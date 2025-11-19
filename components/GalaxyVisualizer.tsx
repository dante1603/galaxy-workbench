
import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { GalaxyParams, GalaxyDataBuffers, calculateGalaxyData, generateRandomParams, hexToRgbNormalized } from '../utils/galaxyMath';

interface GalaxyVisualizerProps {
    onStarSelected: (seed: number) => void;
    onGalaxyHyperjump?: () => void;
    isPaused?: boolean;
}

// --- ICONS ---
const DiceIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 8h.01"></path><path d="M8 8h.01"></path><path d="M8 16h.01"></path><path d="M16 16h.01"></path><path d="M12 12h.01"></path></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const ChevronDownIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="6 9 12 15 18 9"></polyline></svg>;
const RocketIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path></svg>;

// --- COLOR UTILS ---
const hslToHex = (h: number, s: number, l: number) => {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

const hexToHSL = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [0, 100, 50];
  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
  }
  return [h, s * 100, l * 100];
};

const GalaxyColorPicker: React.FC<{ label: string, value: string, onChange: (val: string) => void }> = ({ label, value, onChange }) => {
    const [h, s, l] = hexToHSL(value);
    
    // We map Lightness from 50 (pure color) to 100 (white) for the slider
    // If the input color is darker than 50% L, we clamp it visually to start at 0.
    const whiteness = Math.max(0, Math.min(100, (l - 50) * 2)); 

    const handleHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newH = parseInt(e.target.value);
        // Keep saturation at 100 for vivid colors, maintain current L
        onChange(hslToHex(newH, 100, l));
    };

    const handleWhitenessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const w = parseInt(e.target.value);
        // Map 0-100 slider back to 50-100 Lightness
        const newL = 50 + (w / 2); 
        onChange(hslToHex(h, 100, newL));
    };

    const hueBackground = `linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)`;
    const whiteBackground = `linear-gradient(to right, hsl(${h}, 100%, 50%), white)`;

    return (
        <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
                <label className="text-xs text-slate-400">{label}</label>
                <div className="w-3 h-3 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: value }}></div>
            </div>
            
            <div className="space-y-2">
                {/* Hue Slider */}
                <div className="group relative w-full h-3 rounded-md overflow-hidden ring-1 ring-white/10">
                    <input 
                        type="range" min="0" max="360" value={h} 
                        onChange={handleHueChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        title="Select Hue"
                    />
                    <div className="w-full h-full" style={{ background: hueBackground }}></div>
                </div>
                
                {/* Whiteness Slider */}
                <div className="group relative w-full h-3 rounded-md overflow-hidden ring-1 ring-white/10">
                     <input 
                        type="range" min="0" max="100" value={whiteness} 
                        onChange={handleWhitenessChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        title="Adjust Intensity/Whiteness"
                    />
                    <div className="w-full h-full" style={{ background: whiteBackground }}></div>
                </div>
                 <div className="flex justify-between text-[9px] text-slate-500 uppercase tracking-widest font-bold">
                    <span>Color</span>
                    <span>→ White</span>
                </div>
            </div>
        </div>
    );
};

const GalaxyVisualizer: React.FC<GalaxyVisualizerProps> = ({ onStarSelected, onGalaxyHyperjump, isPaused = false }) => {
    const mountRef = useRef<HTMLDivElement>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [whiteoutOpacity, setWhiteoutOpacity] = useState(1); // Start White for "arrival" effect
    
    // Current Visible Params
    const [params, setParams] = useState<GalaxyParams>({
        arms: 4,
        armSpread: 0.5,
        coreRadius: 0.7,
        galaxyRadius: 4.5,
        twist: 2.5,
        randomness: 0.35,
        bulge: 0.5,
        verticalSpread: 0.15,
        colorCore: '#fff2cc',
        colorArm: '#80b2ff',
    });

    // --- PRE-CALCULATION REFS ---
    const nextGalaxyDataRef = useRef<GalaxyDataBuffers | null>(null);
    const nextParamsRef = useRef<GalaxyParams | null>(null);
    const PARTICLE_COUNT = 20000;

    // Refs for Three.js objects
    const particlesMeshRef = useRef<THREE.Points | null>(null);
    const jumpToRandomRef = useRef<(() => void) | null>(null);
    
    // Animation Control Refs
    const warpState = useRef<'IDLE' | 'EXITING' | 'SWAPPING' | 'ENTERING'>('IDLE');
    const warpVector = useRef(new THREE.Vector3(0, 0, 0));
    const warpSpeed = useRef(0);
    const rotationSpeedBoost = useRef(0);
    
    // Pause Ref
    const isPausedRef = useRef(isPaused);
    useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);

    // Worker Ref
    const workerRef = useRef<Worker | null>(null);

    // Fade in on mount
    useEffect(() => {
        // Wait a brief moment for DOM render then fade in
        const timeout = setTimeout(() => {
            setWhiteoutOpacity(0);
        }, 100);
        return () => clearTimeout(timeout);
    }, []);

    // Helper to update Three.js Geometry from Buffer Data
    const applyGalaxyDataToGeometry = (geometry: THREE.BufferGeometry, data: GalaxyDataBuffers) => {
        const posAttr = geometry.getAttribute('position') as THREE.BufferAttribute;
        const colAttr = geometry.getAttribute('color') as THREE.BufferAttribute;

        posAttr.array.set(data.positions);
        colAttr.array.set(data.colors);

        posAttr.needsUpdate = true;
        colAttr.needsUpdate = true;
    };

    // Helper to prepare the NEXT galaxy in background using Worker
    const prepareNextGalaxy = useCallback(() => {
        if (workerRef.current) {
            workerRef.current.postMessage({ 
                type: 'GENERATE_RANDOM', 
                particleCount: PARTICLE_COUNT 
            });
        }
    }, []);

    // --- INITIAL WORKER SETUP ---
    useEffect(() => {
        const workerScript = `
            // Helper Functions Injected from Main Thread
            const hexToRgbNormalized = ${hexToRgbNormalized.toString()};
            const calculateGalaxyData = ${calculateGalaxyData.toString()};
            const generateRandomParams = ${generateRandomParams.toString()};

            self.onmessage = (e) => {
                const { particleCount, type, specificParams } = e.data;

                try {
                    let params;
                    
                    if (type === 'GENERATE_RANDOM') {
                        params = generateRandomParams();
                    } else {
                        params = specificParams;
                    }

                    const data = calculateGalaxyData(params, particleCount);
                    
                    self.postMessage(
                        { 
                            success: true, 
                            data,
                            params
                        }, 
                        [data.positions.buffer, data.colors.buffer]
                    );
                } catch (error) {
                    console.error("Galaxy Worker error:", error);
                    self.postMessage({ success: false, error: String(error) });
                }
            };
        `;

        try {
            const blob = new Blob([workerScript], { type: 'application/javascript' });
            const workerUrl = URL.createObjectURL(blob);
            workerRef.current = new Worker(workerUrl);
            
            workerRef.current.onmessage = (e) => {
                const { success, data, params } = e.data;
                if (success) {
                    nextGalaxyDataRef.current = data;
                    nextParamsRef.current = params;
                }
            };
            
            prepareNextGalaxy();
            
            return () => {
                workerRef.current?.terminate();
                URL.revokeObjectURL(workerUrl);
            };
        } catch (err) {
            console.error("Failed to initialize Galaxy Worker:", err);
        }
    }, [prepareNextGalaxy]);

    // --- MANUAL PARAM CHANGE ---
    useEffect(() => {
        if (particlesMeshRef.current && warpState.current === 'IDLE') {
            const data = calculateGalaxyData(params, PARTICLE_COUNT);
            applyGalaxyDataToGeometry(particlesMeshRef.current.geometry, data);
        }
    }, [params]);


    const handleParamChange = (key: keyof GalaxyParams, value: number | string) => {
        setParams(prev => ({ ...prev, [key]: value }));
    };
    
    const handleRandomize = () => {
        if (warpState.current !== 'IDLE') return;

        if (!nextGalaxyDataRef.current) {
             console.warn("Worker too slow, calculating on main thread fallback.");
             const fallbackParams = nextParamsRef.current || params;
             nextGalaxyDataRef.current = calculateGalaxyData(fallbackParams, PARTICLE_COUNT);
        }

        warpState.current = 'EXITING';
        
        const angle = Math.random() * Math.PI * 2;
        const right = new THREE.Vector3(1, 0, 0);
        const up = new THREE.Vector3(0, 1, -1).normalize();
        
        warpVector.current
            .copy(right)
            .multiplyScalar(Math.cos(angle))
            .add(up.multiplyScalar(Math.sin(angle)))
            .normalize();
        
        warpSpeed.current = 0.5;
        rotationSpeedBoost.current = 0.0;
    };


    useEffect(() => {
        if (!mountRef.current) return;
        const currentMount = mountRef.current;

        // --- SCENE SETUP ---
        const scene = new THREE.Scene();
        
        // 1. Create Background Dome using ShaderMaterial
        // OPTIMIZATION: Reduced segments from 60x40 to 32x32 for performance
        const domeGeo = new THREE.SphereGeometry(500, 32, 32);
        const domeMat = new THREE.ShaderMaterial({
            uniforms: {
                spaceColor: { value: new THREE.Color(0x000000) }, // Deep black
                nebulaColor1: { value: new THREE.Color(0x0f001a) }, // Very dark purple
                nebulaColor2: { value: new THREE.Color(0x000a1a) }, // Very dark blue
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

                // Optimized Hash for Background
                float hash(vec3 p) {
                    return fract(sin(dot(p, vec3(12.9898, 78.233, 148.85))) * 43758.5453);
                }

                // Simplified 3D Noise (Reduced complexity)
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
                    
                    // Offset to center
                    vec3 noiseCoord = dir + vec3(100.0);

                    // Single octave noise for nebula
                    float n = noise(noiseCoord * 2.5);
                    
                    // Simplified Galactic Band
                    float distFromEquator = abs(dir.y);
                    float bandFactor = smoothstep(0.6, 0.0, distFromEquator);
                    
                    vec3 color = spaceColor;
                    
                    // Simple Nebula Mix
                    float nebulaMix = smoothstep(0.35, 0.8, n);
                    color = mix(color, nebulaColor1, nebulaMix * 0.6);
                    color = mix(color, nebulaColor2, bandFactor * 0.5);

                    // Simple Stars (Thresholding)
                    float starNoise = hash(floor(dir * 1800.0)); 
                    if (starNoise > 0.9985) {
                        color += vec3(0.6 + (starNoise - 0.9985) * 200.0);
                    }
                    
                    gl_FragColor = vec4(color, 1.0);
                }
            `,
            side: THREE.BackSide,
            depthWrite: false 
        });
        const dome = new THREE.Mesh(domeGeo, domeMat);
        scene.add(dome);

        const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 2000);
        camera.position.set(0, 12, 12); 
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        // OPTIMIZATION: Cap pixel ratio to 1.5 to prevent 4K lag on bloom effects
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); 
        currentMount.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.minDistance = 1;
        controls.maxDistance = 50;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.5;

        // --- GALAXY INIT ---
        const positions = new Float32Array(PARTICLE_COUNT * 3);
        const colors = new Float32Array(PARTICLE_COUNT * 3);
        const sizes = new Float32Array(PARTICLE_COUNT);
        
        for(let i=0; i<PARTICLE_COUNT; i++) {
            sizes[i] = Math.random() * 0.1 + 0.05;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const initialData = calculateGalaxyData(params, PARTICLE_COUNT);
        applyGalaxyDataToGeometry(geometry, initialData);
        
        const material = new THREE.ShaderMaterial({
            vertexShader: `
                attribute float size;
                attribute vec3 color;
                varying vec3 vColor;
                void main() {
                    vColor = color;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                void main() {
                    float r = 0.0;
                    vec2 cxy = 2.0 * gl_PointCoord - 1.0;
                    r = dot(cxy, cxy);
                    if (r > 1.0) {
                        discard;
                    }
                    gl_FragColor = vec4(vColor, 1.0 - r);
                }
            `,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: true
        });

        const particles = new THREE.Points(geometry, material);
        scene.add(particles);
        particlesMeshRef.current = particles;

        const renderPass = new RenderPass(scene, camera);
        
        // OPTIMIZATION: Half-resolution bloom buffer
        // This drastically reduces the cost of the bloom blur passes
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(currentMount.clientWidth / 2, currentMount.clientHeight / 2), 
            1.5, 0.4, 0.85
        );
        // OPTIMIZATION: Increase threshold to 0.1 to stop background glow
        // Reduce strength to 1.0 to prevent washed out look
        bloomPass.threshold = 0.1;
        bloomPass.strength = 1.0;
        bloomPass.radius = 0.8;

        const composer = new EffectComposer(renderer);
        composer.addPass(renderPass);
        composer.addPass(bloomPass);

        // --- CLICK HANDLER (Raycaster) ---
        const raycaster = new THREE.Raycaster();
        raycaster.params.Points.threshold = 0.2;
        const mouse = new THREE.Vector2();
        
        const transitionTarget = new THREE.Vector3();
        const cameraStartPos = new THREE.Vector3();
        let transitionAlpha = 0;
        let transitionActive = false;
        let selectedSeed = 0;

        const triggerTransition = (index: number, point: THREE.Vector3) => {
            if (warpState.current !== 'IDLE') return; 
            controls.autoRotate = false;
            transitionActive = true;
            setIsTransitioning(true);
            transitionTarget.copy(point);
            cameraStartPos.copy(camera.position);
            selectedSeed = index;
        };

        jumpToRandomRef.current = () => {
            if (transitionActive || warpState.current !== 'IDLE') return;
            const randomIndex = Math.floor(Math.random() * PARTICLE_COUNT);
            const positionAttribute = particles.geometry.getAttribute('position');
            const point = new THREE.Vector3(
                positionAttribute.getX(randomIndex),
                positionAttribute.getY(randomIndex),
                positionAttribute.getZ(randomIndex)
            );
            triggerTransition(randomIndex, point);
        };

        const onMouseClick = (event: MouseEvent) => {
            if (transitionActive || warpState.current !== 'IDLE') return;

            const rect = currentMount.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObject(particles);

            if (intersects.length > 0) {
                const hit = intersects[0];
                const index = hit.index;
                if (index !== undefined) triggerTransition(index, hit.point);
            }
        };

        currentMount.addEventListener('click', onMouseClick);

        // --- ANIMATION LOOP ---
        let frameId: number;
        const animate = () => {
            frameId = requestAnimationFrame(animate);

            // PAUSE LOGIC: If paused, skip all calculations and rendering.
            // The canvas will hold the last drawn frame (static image).
            if (isPausedRef.current) return;
            
            // 1. WARP TRANSITION
            if (warpState.current !== 'IDLE') {
                rotationSpeedBoost.current *= 0.96;
                particles.rotation.y += 0.01 + rotationSpeedBoost.current;

                if (warpState.current === 'EXITING') {
                    warpSpeed.current += 0.8; 
                    rotationSpeedBoost.current += 0.01; 
                    particles.position.add(warpVector.current.clone().multiplyScalar(warpSpeed.current));
                    
                    if (particles.position.length() > 120) {
                         warpState.current = 'SWAPPING';
                    }
                } 
                else if (warpState.current === 'SWAPPING') {
                     if (nextGalaxyDataRef.current && nextParamsRef.current) {
                         applyGalaxyDataToGeometry(geometry, nextGalaxyDataRef.current);
                         setParams(nextParamsRef.current); 
                     }
                     
                     particles.position.copy(warpVector.current.clone().multiplyScalar(-120));
                     
                     if (onGalaxyHyperjump) onGalaxyHyperjump();

                     warpState.current = 'ENTERING';
                     rotationSpeedBoost.current = 0; 
                     
                     prepareNextGalaxy();
                }
                else if (warpState.current === 'ENTERING') {
                    particles.position.lerp(new THREE.Vector3(0, 0, 0), 0.1);
                    
                    if (particles.position.length() < 0.05) {
                         particles.position.set(0, 0, 0);
                         warpState.current = 'IDLE';
                    }
                }
            }
            else if (rotationSpeedBoost.current > 0.001) {
                rotationSpeedBoost.current *= 0.96;
                particles.rotation.y += 0.01 + rotationSpeedBoost.current;
            } else {
                controls.update(); 
            }
            
            // 2. DRILL DOWN TRANSITION (Standard)
            if (transitionActive) {
                transitionAlpha += 0.015;
                if (transitionAlpha > 1) transitionAlpha = 1;
                const t = transitionAlpha * transitionAlpha * (3 - 2 * transitionAlpha); 

                const direction = new THREE.Vector3().subVectors(transitionTarget, cameraStartPos);
                const distance = direction.length();
                const newPos = new THREE.Vector3().copy(cameraStartPos).add(direction.normalize().multiplyScalar(distance * t));
                
                camera.position.copy(newPos);
                controls.target.lerp(transitionTarget, 0.1);
                
                if (t > 0.5) {
                    const op = (t - 0.5) * 2.5;
                    setWhiteoutOpacity(Math.min(1, op));
                }

                if (t > 0.98) {
                     onStarSelected(selectedSeed);
                     transitionActive = false;
                     return;
                }
            }

            composer.render();
        };
        animate();

        const handleResize = () => {
            if (!currentMount) return;
            camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
            // Important: Resize composer with half resolution for bloom optimization
            composer.setSize(currentMount.clientWidth, currentMount.clientHeight);
            bloomPass.resolution.set(currentMount.clientWidth / 2, currentMount.clientHeight / 2);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            currentMount.removeEventListener('click', onMouseClick);
            cancelAnimationFrame(frameId);
            if (currentMount.contains(renderer.domElement)) {
                currentMount.removeChild(renderer.domElement);
            }
            renderer.dispose();
            geometry.dispose();
            domeGeo.dispose();
            domeMat.dispose();
            composer.dispose();
        };
    }, [onStarSelected, prepareNextGalaxy, onGalaxyHyperjump]); 

    const handleRandomClick = () => {
        if (jumpToRandomRef.current) jumpToRandomRef.current();
    };

    return (
        <div className="relative w-full h-full group">
            <div ref={mountRef} className="w-full h-full" />
            
            {/* Whiteout Overlay */}
            <div 
                className="absolute inset-0 bg-white pointer-events-none z-50" 
                style={{ opacity: whiteoutOpacity, transition: 'opacity 1.0s ease-out' }}
            />

            {/* Title Overlay */}
            <div className={`absolute top-32 left-4 pointer-events-none select-none transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                <h2 className="text-2xl font-bold text-white drop-shadow-md tracking-wider">GALAXIA ESPIRAL</h2>
                <p className="text-sm text-accent-cyan drop-shadow-md">Haz clic en una estrella para viajar a su sistema.</p>
            </div>

            {/* Galaxy Configuration Sidebar (Right) */}
            <div className={`absolute top-32 right-4 flex flex-col items-end gap-3 transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                 <div className="flex flex-col bg-slate-900/80 backdrop-blur-md rounded-lg border border-slate-700/50 shadow-lg p-1 z-40">
                    <button 
                        onClick={handleRandomize} 
                        className="p-2 rounded-md hover:bg-white/10 text-slate-400 hover:text-emerald-400 transition-colors"
                        title="Aleatorizar Parámetros de Galaxia"
                        disabled={isTransitioning}
                    >
                        <DiceIcon />
                    </button>
                    <div className="h-px bg-slate-700/50 mx-2"></div>
                    <button
                         onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                         className={`p-2 rounded-md hover:bg-white/10 transition-colors ${isSettingsOpen ? 'text-accent-cyan' : 'text-slate-400 hover:text-white'}`}
                         title="Configuración de Galaxia"
                    >
                        <ChevronDownIcon className={`transform transition-transform duration-200 ${isSettingsOpen ? 'rotate-180' : ''}`} />
                    </button>
                 </div>

                {/* Settings Panel - Increased Z-Index to avoid overlap */}
                {isSettingsOpen && (
                    <div className="absolute right-12 top-0 bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-md p-4 w-64 shadow-2xl animate-fade-in z-50">
                        <div className="flex items-center space-x-2 mb-3 pb-2 border-b border-slate-700/50 text-slate-300">
                            <SettingsIcon />
                            <h4 className="text-sm font-bold uppercase">Configurar Galaxia</h4>
                        </div>
                        
                        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
                             {/* Sliders */}
                             <div className="space-y-1">
                                <div className="flex justify-between text-xs text-slate-400">
                                    <span>Brazos</span>
                                    <span>{params.arms}</span>
                                </div>
                                <input type="range" min="2" max="10" step="1" value={params.arms} onChange={(e) => handleParamChange('arms', parseInt(e.target.value))} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-accent-cyan" />
                             </div>

                             <div className="space-y-1">
                                <div className="flex justify-between text-xs text-slate-400">
                                    <span>Giro (Twist)</span>
                                    <span>{params.twist}</span>
                                </div>
                                <input type="range" min="0" max="5" step="0.1" value={params.twist} onChange={(e) => handleParamChange('twist', parseFloat(e.target.value))} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-accent-cyan" />
                             </div>

                             <div className="space-y-1">
                                <div className="flex justify-between text-xs text-slate-400">
                                    <span>Radio Galaxia</span>
                                    <span>{params.galaxyRadius}</span>
                                </div>
                                <input type="range" min="1" max="10" step="0.1" value={params.galaxyRadius} onChange={(e) => handleParamChange('galaxyRadius', parseFloat(e.target.value))} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-accent-cyan" />
                             </div>
                             
                             <div className="space-y-1">
                                <div className="flex justify-between text-xs text-slate-400">
                                    <span>Radio Núcleo</span>
                                    <span>{params.coreRadius}</span>
                                </div>
                                <input type="range" min="0.1" max="2" step="0.1" value={params.coreRadius} onChange={(e) => handleParamChange('coreRadius', parseFloat(e.target.value))} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-accent-cyan" />
                             </div>

                             <div className="space-y-1">
                                <div className="flex justify-between text-xs text-slate-400">
                                    <span>Dispersión Brazos</span>
                                    <span>{params.armSpread}</span>
                                </div>
                                <input type="range" min="0" max="2" step="0.01" value={params.armSpread} onChange={(e) => handleParamChange('armSpread', parseFloat(e.target.value))} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-accent-cyan" />
                             </div>

                             <div className="space-y-1">
                                <div className="flex justify-between text-xs text-slate-400">
                                    <span>Dispersión Vertical</span>
                                    <span>{params.verticalSpread}</span>
                                </div>
                                <input type="range" min="0" max="1" step="0.01" value={params.verticalSpread} onChange={(e) => handleParamChange('verticalSpread', parseFloat(e.target.value))} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-accent-cyan" />
                             </div>

                             <div className="space-y-1">
                                <div className="flex justify-between text-xs text-slate-400">
                                    <span>Aleatoriedad</span>
                                    <span>{params.randomness}</span>
                                </div>
                                <input type="range" min="0" max="1" step="0.01" value={params.randomness} onChange={(e) => handleParamChange('randomness', parseFloat(e.target.value))} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-accent-cyan" />
                             </div>

                             {/* Advanced Color Pickers */}
                             <div className="pt-2 border-t border-slate-700/50">
                                <GalaxyColorPicker 
                                    label="Color del Núcleo" 
                                    value={params.colorCore} 
                                    onChange={(val) => handleParamChange('colorCore', val)} 
                                />
                                <GalaxyColorPicker 
                                    label="Color de Brazos" 
                                    value={params.colorArm} 
                                    onChange={(val) => handleParamChange('colorArm', val)} 
                                />
                             </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Main Action Button (Bottom Center) - Disabled if settings open */}
            <div className={`absolute bottom-40 left-1/2 -translate-x-1/2 z-20 transition-all duration-500 ${isTransitioning ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'}`}>
                <button 
                    onClick={handleRandomClick}
                    className={`group relative flex items-center gap-3 px-8 py-3 bg-black/60 border border-accent-cyan/50 text-accent-cyan font-bold tracking-[0.25em] uppercase transition-all duration-300 backdrop-blur-md clip-path-button ${isSettingsOpen ? 'opacity-40 cursor-not-allowed grayscale' : 'hover:bg-accent-cyan/10 hover:border-accent-cyan hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]'}`}
                    disabled={isTransitioning || isSettingsOpen}
                >
                    <RocketIcon />
                    <span>Initiate Hyperjump</span>
                    
                    {/* Decorative lines */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent-cyan opacity-50"></div>
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-accent-cyan opacity-50"></div>
                </button>
            </div>
        </div>
    );
};

export default GalaxyVisualizer;
