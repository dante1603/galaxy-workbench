import React, { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import type { Sistema, Estrella, ObjetoOrbital, CuerpoEspecial, ObjetoPlaneta } from '../types';
import { generatePlanetImageData } from '../utils/planetTexture';

interface SystemVisualizerProps {
  systems: Sistema[];
  onObjectSelected: (data: Estrella | ObjetoOrbital | CuerpoEspecial) => void;
}

const SystemVisualizer: React.FC<SystemVisualizerProps> = ({ systems, onObjectSelected }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const clockRef = useRef(new THREE.Clock());

  const textureCache = useMemo(() => new Map<string, THREE.CanvasTexture>(), []);

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a); // space-dark
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 10000);
    camera.position.z = 50;
    camera.position.y = 20;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;
    currentMount.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controlsRef.current = controls;
    
    // Starfield
    const starVertices = [];
    for (let i = 0; i < 15000; i++) {
        const x = THREE.MathUtils.randFloatSpread(4000);
        const y = THREE.MathUtils.randFloatSpread(4000);
        const z = THREE.MathUtils.randFloatSpread(4000);
        starVertices.push(x, y, z);
    }
    const starGeometryBuffer = new THREE.BufferGeometry();
    starGeometryBuffer.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.15, transparent: true, opacity: 0.8 });
    const starfield = new THREE.Points(starGeometryBuffer, starMaterial);
    scene.add(starfield);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.03);
    scene.add(ambientLight);

    const systemsGroup = new THREE.Group();
    scene.add(systemsGroup);

    const animatedObjects: {mesh: THREE.Object3D, distance: number, speed: number, initialAngle: number}[] = [];
    
    const createGlowTexture = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const context = canvas.getContext('2d');
        if (!context) return null;

        const gradient = context.createRadialGradient(
            canvas.width / 2, canvas.height / 2, 0,
            canvas.width / 2, canvas.height / 2, canvas.width / 2
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.2)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);
        return new THREE.CanvasTexture(canvas);
    };

    const systemSpacing = 250;
    systems.forEach((system, systemIndex) => {
        const systemGroup = new THREE.Group();
        systemGroup.position.x = systemIndex * systemSpacing;

        const star = system.cuerpoCentral;
        if (star.tipo === 'ESTRELLA') {
            const starSize = star.radioSolar;
            
            const pointLight = new THREE.PointLight(star.colorHex, 3000 * star.luminosidadSolar, 2000);
            systemGroup.add(pointLight);

            const glowTexture = createGlowTexture();
            if (glowTexture) {
                const spriteMaterial = new THREE.SpriteMaterial({
                    map: glowTexture,
                    color: star.colorHex,
                    blending: THREE.AdditiveBlending,
                    transparent: true,
                    opacity: 0.9,
                    depthWrite: false,
                });
                const sprite = new THREE.Sprite(spriteMaterial);
                sprite.scale.set(starSize * 15, starSize * 15, 1.0);
                sprite.userData = { data: star, type: 'selectable' };
                systemGroup.add(sprite);
            }
        }

        system.orbitas.forEach(orbit => {
            const planetObject = orbit.objetos[0];
            if (planetObject?.tipo === 'PLANETA') {
                const planetPayload = planetObject.cargaUtil as ObjetoPlaneta['cargaUtil'];
                let texture = textureCache.get(planetObject.id);

                if (!texture) {
                    const imageData = generatePlanetImageData(planetPayload, planetObject.id, 256, 128);
                    const canvas = document.createElement('canvas');
                    canvas.width = 256;
                    canvas.height = 128;
                    const context = canvas.getContext('2d');
                    context?.putImageData(imageData, 0, 0);
                    texture = new THREE.CanvasTexture(canvas);
                    texture.colorSpace = THREE.SRGBColorSpace;
                    textureCache.set(planetObject.id, texture);
                }

                const planetSize = planetPayload.gravedad === 'high' ? 2 : planetPayload.gravedad === 'low' ? 0.8 : 1.2;
                const geometry = new THREE.SphereGeometry(planetSize, 32, 32);
                const material = new THREE.MeshStandardMaterial({
                    map: texture,
                    metalness: 0.1,
                    roughness: 0.7,
                });

                const planetMesh = new THREE.Mesh(geometry, material);
                planetMesh.userData = { data: planetObject, type: 'selectable' };
                systemGroup.add(planetMesh);
                
                animatedObjects.push({
                    mesh: planetMesh,
                    distance: orbit.a_UA * 20,
                    speed: 0.1 / Math.sqrt(orbit.a_UA),
                    initialAngle: orbit.M0_deg * (Math.PI / 180),
                });
            }
        });

        systemsGroup.add(systemGroup);
    });

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseClick = (event: MouseEvent) => {
        mouse.x = (event.clientX / currentMount.clientWidth) * 2 - 1;
        mouse.y = -(event.clientY / currentMount.clientHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children, true);

        if (intersects.length > 0) {
            let selectedObject = intersects[0].object;
            while (selectedObject && !selectedObject.userData.type) {
                selectedObject = selectedObject.parent as THREE.Object3D;
            }
            if (selectedObject && selectedObject.userData.type === 'selectable') {
                onObjectSelected(selectedObject.userData.data);
            }
        }
    };

    const animate = () => {
        animationFrameId.current = requestAnimationFrame(animate);
        const elapsedTime = clockRef.current.getElapsedTime();

        animatedObjects.forEach(obj => {
            const angle = obj.initialAngle + elapsedTime * obj.speed;
            obj.mesh.position.x = Math.cos(angle) * obj.distance;
            obj.mesh.position.z = Math.sin(angle) * obj.distance;
            obj.mesh.rotation.y += 0.001;
        });

        controls.update();
        renderer.render(scene, camera);
    };

    const handleResize = () => {
        camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    
    currentMount.addEventListener('click', onMouseClick);
    window.addEventListener('resize', handleResize);

    animate();

    return () => {
        if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
        }
        window.removeEventListener('resize', handleResize);
        currentMount.removeEventListener('click', onMouseClick);
        if (renderer.domElement) {
            currentMount.removeChild(renderer.domElement);
        }
        renderer.dispose();
    };
  }, [systems, onObjectSelected, textureCache]);

  return <div ref={mountRef} className="w-full h-full" />;
};

export default SystemVisualizer;