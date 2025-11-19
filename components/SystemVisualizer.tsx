
import React, { useRef, useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import type { Sistema, Estrella, ObjetoOrbital, CuerpoEspecial, ObjetoPlaneta } from '../types';
import { generatePlanetTextureBuffer } from '../utils/planetTexture';
import { getPlanetBaseColor, generatePlanetGeometryData } from '../utils/planetGeometry';

interface SystemVisualizerProps {
  systems: Sistema[];
  onObjectSelected: (data: Estrella | ObjetoOrbital | CuerpoEspecial) => void;
  onBack: () => void;
  isPaused?: boolean;
  onOpenWiki?: () => void;
}

// Icons
const BackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>;
const TargetIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></svg>;
const BookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>;

interface AnimatedObject {
    mesh: THREE.Object3D;
    distance: number;
    speed: number;
    initialAngle: number;
    isInstanced?: boolean;
    clouds?: THREE.Mesh;
    id: string; // Added ID for tracking
}

interface FocusTarget {
    id: string;
    object: THREE.Object3D;
    offset: THREE.Vector3;
    minDist: number;
    animData?: AnimatedObject; // Store ref to animation data for math prediction
}

const SystemVisualizer: React.FC<SystemVisualizerProps> = ({ systems, onObjectSelected, onBack, isPaused = false, onOpenWiki }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const clockRef = useRef(new THREE.Clock());
  
  // Animation State Refs
  const overlayRef = useRef<HTMLDivElement>(null);
  const isExitingRef = useRef(false);
  const exitAlphaRef = useRef(0);
  const entryAlphaRef = useRef(1);
  
  // Camera focus target ref
  const focusTargetRef = useRef<FocusTarget | null>(null);
  const isCameraLocked = useRef(false); // True when transition is finished and we are strictly following

  // Store animated objects in ref to access inside animate loop
  const animatedObjectsRef = useRef<AnimatedObject[]>([]);

  // Pause Ref
  const isPausedRef = useRef(isPaused);
  useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);

  // Local selection state for UI
  const [selectedData, setSelectedData] = useState<Estrella | ObjetoOrbital | CuerpoEspecial | null>(null);

  // Cache to store generated resources
  const planetResourceCache = useMemo(() => new Map<string, { texture?: THREE.CanvasTexture, geometryData?: { positions: Float32Array, colors: Float32Array } }>(), []);

  useEffect(() => {
    if (!mountRef.current) return;
    const currentMount = mountRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // --- BACKGROUND DOME SHADER ---
    const domeGeo = new THREE.SphereGeometry(20000, 64, 64);
    const domeMat = new THREE.ShaderMaterial({
        uniforms: {
            spaceColor: { value: new THREE.Color(0x000000) },
            nebulaColor1: { value: new THREE.Color(0x0f001a) },
            nebulaColor2: { value: new THREE.Color(0x000a1a) },
        },
        vertexShader: `
            varying vec3 vWorldPosition;
            void main() {
                vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                vWorldPosition = worldPosition.xyz;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 spaceColor;
            uniform vec3 nebulaColor1;
            uniform vec3 nebulaColor2;
            varying vec3 vWorldPosition;
            float hash(vec3 p) {
                return fract(sin(dot(p, vec3(12.9898, 78.233, 148.85))) * 43758.5453);
            }
            float noise(in vec3 x) {
                vec3 i = floor(x);
                vec3 f = fract(x);
                f = f * f * (3.0 - 2.0 * f);
                return mix(mix(mix( hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
                                mix( hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
                            mix(mix( hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
                                mix( hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
            }
            void main() {
                vec3 dir = normalize(vWorldPosition);
                vec3 noiseCoord = dir + vec3(100.0); 
                float n = noise(noiseCoord * 3.0);
                float bandFactor = smoothstep(0.6, 0.0, abs(dir.y));
                vec3 color = mix(spaceColor, nebulaColor1, smoothstep(0.4, 0.8, n) * bandFactor);
                float starNoise = hash(floor(dir * 1500.0)); 
                if (starNoise > 0.998) color += vec3(pow((starNoise - 0.998)/(0.002), 3.0));
                gl_FragColor = vec4(color, 1.0);
            }
        `,
        side: THREE.BackSide,
        depthWrite: false 
    });
    const dome = new THREE.Mesh(domeGeo, domeMat);
    scene.add(dome);
    // ------------------------------

    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 40000);
    // Initial Free View Position
    camera.position.set(0, 100, 250); 
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;
    currentMount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxDistance = 5000;
    controls.target.set(0, 0, 0); // Focus on star initially
    controlsRef.current = controls;
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);
    const hemiLight = new THREE.HemisphereLight(0xddeeff, 0x0f0e0d, 0.15);
    scene.add(hemiLight);

    const systemsGroup = new THREE.Group();
    systemsGroup.name = "SystemsGroup"; 
    scene.add(systemsGroup);

    // Clear previous refs
    animatedObjectsRef.current = [];
    const systemSpacing = 800; 
    
    systems.forEach((system, systemIndex) => {
        const systemGroup = new THREE.Group();
        systemGroup.position.x = systemIndex * systemSpacing;

        const star = system.cuerpoCentral;
        let starSize = 1;
        let starColor = '#ffffff';

        if (star.tipo === 'ESTRELLA') {
            starSize = Math.max(1, star.radioSolar);
            starColor = star.colorHex;
        } else if (star.tipo === 'AGUJERO_NEGRO') {
             starSize = 2;
             starColor = '#000000';
             const diskGeo = new THREE.RingGeometry(3, 12, 64);
             const diskMat = new THREE.MeshBasicMaterial({ color: 0xffaa00, side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
             const disk = new THREE.Mesh(diskGeo, diskMat);
             disk.rotation.x = Math.PI / 2;
             systemGroup.add(disk);
        }

        if (star.tipo !== 'AGUJERO_NEGRO') {
            const luminosity = star.tipo === 'ESTRELLA' ? star.luminosidadSolar : 1;
            const pointLight = new THREE.PointLight(starColor, 60000 * luminosity, 0); 
            systemGroup.add(pointLight);
        }

        if (star.tipo !== 'AGUJERO_NEGRO') {
            const geometry = new THREE.SphereGeometry(starSize, 32, 32);
            const material = new THREE.MeshBasicMaterial({ color: starColor });
            const starMesh = new THREE.Mesh(geometry, material);
            starMesh.userData = { data: star, type: 'selectable', isStar: true, originalScale: 1, id: star.id };
            
            const spriteMaterial = new THREE.SpriteMaterial({ 
                map: new THREE.CanvasTexture(generateGlowTexture(starColor)), 
                color: starColor, blending: THREE.AdditiveBlending, transparent: true, opacity: 0.6, depthWrite: false 
            });
            const sprite = new THREE.Sprite(spriteMaterial);
            sprite.scale.set(starSize * 20, starSize * 20, 1.0);
            starMesh.add(sprite);
            systemGroup.add(starMesh);
        } else {
            const bhGeo = new THREE.SphereGeometry(starSize, 32, 32);
            const bhMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
            const bhMesh = new THREE.Mesh(bhGeo, bhMat);
            bhMesh.userData = { data: star, type: 'selectable', isStar: true, id: star.id };
            systemGroup.add(bhMesh);
        }

        system.orbitas.forEach(orbit => {
            const orbitalObject = orbit.objetos[0];
            if (!orbitalObject) return;

            const orbitDistance = orbit.a_UA * 40; 
            const orbitSpeed = 0.2 / Math.sqrt(Math.max(0.1, orbit.a_UA));
            const startAngle = orbit.M0_deg * (Math.PI / 180);

            const orbitCurve = new THREE.EllipseCurve(0, 0, orbitDistance, orbitDistance, 0, 2 * Math.PI, false, 0);
            const orbitPoints = orbitCurve.getPoints(128);
            const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
            const orbitMaterial = new THREE.LineBasicMaterial({ color: 0x334155, transparent: true, opacity: 0.2 });
            const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
            orbitLine.rotation.x = Math.PI / 2;
            systemGroup.add(orbitLine);

            if (orbitalObject.tipo === 'PLANETA') {
                const planetPayload = orbitalObject.cargaUtil as ObjetoPlaneta['cargaUtil'];
                const isGasGiant = planetPayload.tipoPlaneta === 'GIGANTE_GASEOSO';
                const planetSize = planetPayload.gravedad === 'high' ? 1.5 : planetPayload.gravedad === 'low' ? 0.6 : 1.0;
                const finalSize = isGasGiant ? planetSize * 2.5 : planetSize;

                let planetMesh: THREE.Mesh;
                
                if (isGasGiant) {
                    let texture = planetResourceCache.get(orbitalObject.id)?.texture;
                    if (!texture) {
                         // Initial placeholder
                        const placeholderCanvas = document.createElement('canvas');
                        placeholderCanvas.width = 8; placeholderCanvas.height = 8;
                        const ctx = placeholderCanvas.getContext('2d');
                        if (ctx) { ctx.fillStyle = '#1e293b'; ctx.fillRect(0, 0, 8, 8); }
                        texture = new THREE.CanvasTexture(placeholderCanvas);
                        texture.colorSpace = THREE.SRGBColorSpace;
                        
                        const cacheEntry = planetResourceCache.get(orbitalObject.id) || {};
                        cacheEntry.texture = texture;
                        planetResourceCache.set(orbitalObject.id, cacheEntry);

                        // Async Texture Generation
                        setTimeout(() => {
                            const buffer = generatePlanetTextureBuffer(planetPayload, orbitalObject.id, 256, 128);
                            const imageData = new ImageData(new Uint8ClampedArray(buffer), 256, 128);
                            if (texture && texture.image instanceof HTMLCanvasElement) {
                                const canvas = texture.image;
                                canvas.width = 256;
                                canvas.height = 128;
                                const context = canvas.getContext('2d');
                                if (context) {
                                    context.putImageData(imageData, 0, 0);
                                    texture.needsUpdate = true;
                                }
                            }
                        }, 0);
                    }
                    const geometry = new THREE.SphereGeometry(finalSize, 64, 64);
                    const material = new THREE.MeshStandardMaterial({ map: texture, metalness: 0.1, roughness: 0.8 });
                    planetMesh = new THREE.Mesh(geometry, material);

                } else {
                    // ROCKY PLANET
                    const geometry = new THREE.SphereGeometry(1.0, 128, 128);
                    
                    const cacheEntry = planetResourceCache.get(orbitalObject.id);
                    
                    if (cacheEntry && cacheEntry.geometryData) {
                        const { positions, colors } = cacheEntry.geometryData;
                        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
                        geometry.computeVertexNormals();
                    } else {
                        const count = geometry.attributes.position.count;
                        const baseColor = getPlanetBaseColor(planetPayload.tipoPlaneta);
                        const colors = new Float32Array(count * 3);
                        for (let i = 0; i < count; i++) {
                             colors[i * 3] = baseColor[0];
                             colors[i * 3 + 1] = baseColor[1];
                             colors[i * 3 + 2] = baseColor[2];
                        }
                        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

                        setTimeout(() => {
                             const { positions, colors: newColors } = generatePlanetGeometryData(planetPayload, orbitalObject.id, 128);
                             geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                             geometry.setAttribute('color', new THREE.BufferAttribute(newColors, 3));
                             geometry.computeVertexNormals();
                             planetResourceCache.set(orbitalObject.id, { geometryData: { positions, colors: newColors } });
                        }, 0);
                    }

                    const material = new THREE.MeshStandardMaterial({ 
                        vertexColors: true, 
                        roughness: 0.9, 
                        metalness: 0.0,
                        flatShading: true 
                    });
                    
                    planetMesh = new THREE.Mesh(geometry, material);
                    planetMesh.scale.setScalar(finalSize);
                }

                planetMesh.userData = { data: orbitalObject, type: 'selectable', size: finalSize, id: orbitalObject.id };
                systemGroup.add(planetMesh);
                
                let cloudMesh: THREE.Mesh | undefined;
                if (planetPayload.tipoAtmosfera && planetPayload.tipoAtmosfera !== 'none') {
                    const cloudGeo = new THREE.SphereGeometry(finalSize * 1.02, 64, 64);
                    const cloudMat = new THREE.MeshStandardMaterial({ 
                        color: 0xffffff, 
                        transparent: true, 
                        opacity: isGasGiant ? 0.1 : 0.2, 
                        side: THREE.DoubleSide, 
                        depthWrite: false 
                    });
                    cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
                    planetMesh.add(cloudMesh);
                }
                
                animatedObjectsRef.current.push({ 
                    mesh: planetMesh, 
                    distance: orbitDistance, 
                    speed: orbitSpeed, 
                    initialAngle: startAngle, 
                    clouds: cloudMesh,
                    id: orbitalObject.id
                });
                
                if (planetPayload.subOrbitas && planetPayload.subOrbitas.length > 0) {
                    planetPayload.subOrbitas.forEach((sub, idx) => {
                        if(sub.tipo === 'LUNA') {
                            const moonGeo = new THREE.SphereGeometry(finalSize * 0.25, 8, 8);
                            const moonMat = new THREE.MeshStandardMaterial({ color: 0x888888 });
                            const moonMesh = new THREE.Mesh(moonGeo, moonMat);
                            const angle = Math.random() * Math.PI * 2;
                            const distance = 2.0 + (idx * 0.8);
                            moonMesh.position.x = Math.cos(angle) * distance;
                            moonMesh.position.z = Math.sin(angle) * distance;
                            moonMesh.position.y = (Math.random() - 0.5) * 0.2; 
                            planetMesh.add(moonMesh); 
                        }
                    });
                }
            } else if (orbitalObject.tipo === 'CINTURON_ASTEROIDES') {
                const asteroidCount = 800;
                const asteroidGeo = new THREE.IcosahedronGeometry(0.15, 0);
                const asteroidMat = new THREE.MeshStandardMaterial({ color: 0x8899aa, roughness: 0.9, flatShading: true });
                const instancedAsteroids = new THREE.InstancedMesh(asteroidGeo, asteroidMat, asteroidCount);
                instancedAsteroids.userData = { data: orbitalObject, type: 'selectable', size: 5, id: orbitalObject.id }; 
                
                const dummy = new THREE.Object3D();
                const bandWidth = 6.0;
                for (let i = 0; i < asteroidCount; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const distance = orbitDistance + (Math.random() - 0.5) * bandWidth;
                    const yOffset = (Math.random() - 0.5) * 1.5;
                    dummy.position.set(Math.cos(angle) * distance, yOffset, Math.sin(angle) * distance);
                    dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
                    const scale = 0.5 + Math.random() * 1.2;
                    dummy.scale.set(scale, scale, scale);
                    dummy.updateMatrix();
                    instancedAsteroids.setMatrixAt(i, dummy.matrix);
                }
                instancedAsteroids.instanceMatrix.needsUpdate = true;
                systemGroup.add(instancedAsteroids);
                animatedObjectsRef.current.push({ 
                    mesh: instancedAsteroids, 
                    distance: 0, 
                    speed: orbitSpeed * 0.5, 
                    initialAngle: 0, 
                    isInstanced: true,
                    id: orbitalObject.id
                });
            }
        });
        systemsGroup.add(systemGroup);
    });

    // Raycaster logic
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseClick = (event: MouseEvent) => {
        if (isExitingRef.current) return;
        const rect = currentMount.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children, true);

        let found = false;
        if (intersects.length > 0) {
            let selectedObject: THREE.Object3D | null = intersects[0].object;
            
            // Handle Instanced Meshes (Asteroids)
            if (selectedObject instanceof THREE.InstancedMesh && selectedObject.userData.type === 'selectable') {
                 const data = selectedObject.userData.data;
                 handleSelection(selectedObject, data);
                 found = true;
            } else {
                // Traverse up to find the selectable parent
                while (selectedObject && !selectedObject.userData.type) { selectedObject = selectedObject.parent; }
                
                if (selectedObject && selectedObject.userData.type === 'selectable') {
                    const data = selectedObject.userData.data;
                    handleSelection(selectedObject, data);
                    found = true;
                }
            }
        } 
        if (!found) {
            resetView();
        }
    };

    const handleSelection = (object: THREE.Object3D, data: any) => {
        onObjectSelected(data);
        setSelectedData(data); 

        const size = object.userData.size || 2;
        const isStar = object.userData.isStar;
        const dist = isStar ? size * 4 : size * 3; 
        const offset = new THREE.Vector3(dist, dist * 0.5, dist);
        
        // Find matching animation data for math prediction
        const animData = animatedObjectsRef.current.find(ao => ao.id === data.id);

        focusTargetRef.current = { 
            id: data.id,
            object: object, 
            offset, 
            minDist: size * 1.2,
            animData
        };
        
        isCameraLocked.current = false; // Start transition
        controlsRef.current!.minDistance = size * 1.1;
        controlsRef.current!.maxDistance = size * 20;
    };

    const resetView = () => {
        focusTargetRef.current = null;
        isCameraLocked.current = false;
        setSelectedData(null); 
        controlsRef.current!.minDistance = 10;
        controlsRef.current!.maxDistance = 5000;
        // DO NOT reset camera position here, let user stay where they are in free view
    };

    const animate = () => {
        animationFrameId.current = requestAnimationFrame(animate);
        if (isPausedRef.current) return;

        const elapsedTime = clockRef.current.getElapsedTime();
        
        // 1. Update Object Positions
        animatedObjectsRef.current.forEach(obj => {
            if (obj.isInstanced) { 
                obj.mesh.rotation.y = elapsedTime * obj.speed; 
            } else {
                const angle = obj.initialAngle + elapsedTime * obj.speed;
                obj.mesh.position.x = Math.cos(angle) * obj.distance;
                obj.mesh.position.z = Math.sin(angle) * obj.distance;
                obj.mesh.rotation.y += 0.002;
                if (obj.clouds) { 
                    obj.clouds.rotation.y += 0.001; 
                    obj.clouds.rotation.z = Math.sin(elapsedTime * 0.1) * 0.05; 
                }
            }
        });

        // 2. Handle Camera Transitions & Locking
        if (isExitingRef.current) {
            // Exit Animation
            exitAlphaRef.current = Math.min(exitAlphaRef.current + 0.02, 1);
            if (overlayRef.current) overlayRef.current.style.opacity = exitAlphaRef.current.toString();
            const direction = camera.position.clone().normalize();
            camera.position.addScaledVector(direction, 5.0);
            if (exitAlphaRef.current >= 1) {
                if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
                onBack();
                return;
            }
        } else if (entryAlphaRef.current > 0) {
             // Entry Animation
             entryAlphaRef.current = Math.max(entryAlphaRef.current - 0.02, 0);
             if (overlayRef.current) overlayRef.current.style.opacity = entryAlphaRef.current.toString();
        }

        // 3. Smart Tracking Logic
        if (focusTargetRef.current && focusTargetRef.current.object) {
            const target = focusTargetRef.current.object;
            const animData = focusTargetRef.current.animData;

            // Calculate "Actual" Position from Mesh (Works for Stars/Static/Instanced)
            const targetWorldPos = new THREE.Vector3();
            target.getWorldPosition(targetWorldPos);
            
            // Calculate "Lead" Position (Triangulation) if animated
            const leadPosition = targetWorldPos.clone();
            
            if (animData && !animData.isInstanced) {
                // Calculate future position to prevent lag
                // Look ahead slightly (0.05 seconds worth of movement?)
                // Or essentially, update the target to where the object IS right now,
                // but bypass the lerp loop in the camera controller.
                
                // To smoothly follow, we set the controls.target strictly to the object position
                // allowing OrbitControls to handle the rotation relative to that point.
                
                // Optional: "Lead" logic for faster orbits
                // const leadTime = 0.05; 
                // const leadAngle = animData.initialAngle + (elapsedTime + leadTime) * animData.speed;
                // leadPosition.x = Math.cos(leadAngle) * animData.distance;
                // leadPosition.z = Math.sin(leadAngle) * animData.distance;
                // leadPosition.y = 0; // Assuming flat plane orbits for visualizer
            }

            if (!isCameraLocked.current) {
                 // TRANSITION PHASE: Smoothly fly to the object
                 const offset = focusTargetRef.current.offset;
                 const desiredCamPos = targetWorldPos.clone().add(offset);
                 
                 // Smoothly move target center
                 controlsRef.current!.target.lerp(targetWorldPos, 0.1);
                 
                 // Smoothly move camera body
                 camera.position.lerp(desiredCamPos, 0.05);
                 
                 // Check if we arrived
                 if (camera.position.distanceTo(desiredCamPos) < 2.0) {
                     isCameraLocked.current = true;
                 }
            } else {
                // LOCKED PHASE: Hard-lock the target to the object (or lead point)
                // We DO NOT touch camera.position here. 
                // OrbitControls determines camera.position based on user rotation + target.
                controlsRef.current!.target.copy(leadPosition);
            }
        } 
        
        // If no focus target, we are in Free View. 
        // We deliberately DO NOT add logic here to drift the camera.
        // This leaves the camera wherever the user left it.

        controlsRef.current!.update();
        renderer.render(scene, camera);
    };

    const handleResize = () => {
        if (!currentMount) return;
        camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    
    currentMount.addEventListener('click', onMouseClick);
    window.addEventListener('resize', handleResize);

    animate();

    return () => {
        if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        window.removeEventListener('resize', handleResize);
        currentMount.removeEventListener('click', onMouseClick);
        if (renderer.domElement && currentMount.contains(renderer.domElement)) currentMount.removeChild(renderer.domElement);
        renderer.dispose();
    };
  }, [systems, onObjectSelected, onBack]);

  const handleRandomJump = () => {
     if (isExitingRef.current) return;
     if (systems.length === 0) return;
     const system = systems[0];
     const planets = system.orbitas.flatMap(o => o.objetos).filter(o => o.tipo === 'PLANETA');
     if (planets.length === 0) return;
     const randomPlanet = planets[Math.floor(Math.random() * planets.length)];
     
     if (sceneRef.current) {
         const systemsGroup = sceneRef.current.getObjectByName("SystemsGroup");
         if (systemsGroup) {
             let targetMesh: THREE.Object3D | null = null;
             systemsGroup.traverse((child) => {
                 if (child.userData && child.userData.data && child.userData.data.id === randomPlanet.id) {
                     targetMesh = child;
                 }
             });
             if (targetMesh) {
                 const data = targetMesh.userData.data;
                 
                 // Trigger selection logic via Raycaster logic function to reuse code
                 onObjectSelected(data);
                 setSelectedData(data); 
                 
                 const size = targetMesh.userData.size || 2;
                 const dist = size * 3;
                 const offset = new THREE.Vector3(dist, dist * 0.5, dist);
                 const animData = animatedObjectsRef.current.find(ao => ao.id === data.id);

                 focusTargetRef.current = { 
                     id: data.id,
                     object: targetMesh, 
                     offset,
                     minDist: size * 1.2,
                     animData
                 };
                 isCameraLocked.current = false;
                 if (controlsRef.current) {
                     controlsRef.current.minDistance = size * 1.1;
                     controlsRef.current.maxDistance = size * 20;
                 }
             }
         }
     }
  };
  
  const handleResetViewClick = () => {
      focusTargetRef.current = null;
      isCameraLocked.current = false;
      setSelectedData(null);
      if (controlsRef.current) {
        controlsRef.current.minDistance = 10;
        controlsRef.current.maxDistance = 5000;
      }
      // In free view, we don't reset position, just unlock
  }

  const handleExit = () => { isExitingRef.current = true; };

  return (
    <div className="w-full h-full relative group">
        <div ref={mountRef} className="w-full h-full" />
        <div ref={overlayRef} className="absolute inset-0 bg-white pointer-events-none z-50" style={{ opacity: 1 }} />
        <div className="absolute bottom-40 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md p-2 rounded-xl border border-white/10 shadow-2xl pointer-events-auto">
            <button onClick={handleExit} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-colors border border-transparent hover:border-white/20 text-xs font-bold uppercase tracking-wider">
                <BackIcon /><span>Sector Return</span>
            </button>
            <div className="w-px h-6 bg-white/10"></div>
             <button onClick={handleResetViewClick} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-colors border border-transparent hover:border-white/20 text-xs font-bold uppercase tracking-wider">
                <span>System View</span>
            </button>
            <div className="w-px h-6 bg-white/10"></div>
            <button onClick={handleRandomJump} className="flex items-center gap-2 px-4 py-2 bg-accent-cyan/10 hover:bg-accent-cyan/20 rounded-lg text-accent-cyan hover:text-cyan-200 transition-colors border border-accent-cyan/30 hover:border-accent-cyan/50 text-xs font-bold uppercase tracking-wider">
                <TargetIcon /><span>Auto-Nav</span>
            </button>
            {selectedData && onOpenWiki && (
                <>
                    <div className="w-px h-6 bg-white/10"></div>
                    <button onClick={onOpenWiki} className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg text-emerald-400 hover:text-emerald-200 transition-colors border border-emerald-500/30 hover:border-emerald-500/50 text-xs font-bold uppercase tracking-wider">
                        <BookIcon /><span>Ver Datos</span>
                    </button>
                </>
            )}
        </div>
    </div>
  );
};

function generateGlowTexture(color: string) {
    const canvas = document.createElement('canvas');
    canvas.width = 128; canvas.height = 128;
    const context = canvas.getContext('2d');
    if (context) {
        const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.2)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        context.fillStyle = gradient;
        context.fillRect(0, 0, 128, 128);
    }
    return canvas;
}

export default SystemVisualizer;
