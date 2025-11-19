
import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { SimplexNoise } from '../utils/simplexNoise';
import { GoogleGenAI } from "@google/genai";
import { useWorkbenchStore } from '../state/workbenchStore';
import type { TipoPlaneta } from '../types';

// --- ICONS ---
const DiceIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 8h.01"></path><path d="M8 8h.01"></path><path d="M8 16h.01"></path><path d="M16 16h.01"></path><path d="M12 12h.01"></path></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275-1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>;
const RefreshIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3"/></svg>;
const EyeOffIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>;
const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const LinkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>;
const UnlinkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path><line x1="2" y1="2" x2="22" y2="22"></line></svg>;

// --- TYPES & PRESETS ---

interface PlanetPreset {
  name: string;
  seaLevel: number;
  roughness: number;
  frequency: number;
  colors: {
    deepOcean: THREE.Color;
    midOcean: THREE.Color;
    shallowOcean: THREE.Color;
    beach: THREE.Color;
    plains: THREE.Color;
    forest: THREE.Color;
    mountain: THREE.Color;
    peak: THREE.Color;
  };
}

const PRESETS: Record<string, PlanetPreset> = {
  TERRAN: {
    name: 'Terran (Jungla/Bosque)',
    seaLevel: 0.5,
    roughness: 1.5,
    frequency: 1.0,
    colors: {
      deepOcean: new THREE.Color(0x00002E),
      midOcean: new THREE.Color(0x00427E),
      shallowOcean: new THREE.Color(0x008EAE),
      beach: new THREE.Color(0xD9E2B4),
      plains: new THREE.Color(0x558E3A),
      forest: new THREE.Color(0x226021),
      mountain: new THREE.Color(0x736961),
      peak: new THREE.Color(0xFFFFFF),
    }
  },
  DESERT: {
    name: 'Desértico',
    seaLevel: 0.1,
    roughness: 1.2,
    frequency: 0.8,
    colors: {
      deepOcean: new THREE.Color(0x5D2906), // Lava seca o salmuera profunda
      midOcean: new THREE.Color(0xA0522D),
      shallowOcean: new THREE.Color(0xCD853F),
      beach: new THREE.Color(0xF4A460),
      plains: new THREE.Color(0xDEB887),
      forest: new THREE.Color(0xD2691E),
      mountain: new THREE.Color(0x8B4513),
      peak: new THREE.Color(0x800000),
    }
  },
  VOLCANIC: {
    name: 'Volcánico',
    seaLevel: 0.3,
    roughness: 2.5,
    frequency: 1.5,
    colors: {
      deepOcean: new THREE.Color(0x330000), // Magma profundo
      midOcean: new THREE.Color(0x800000),
      shallowOcean: new THREE.Color(0xFF4500), // Lava brillante
      beach: new THREE.Color(0x2F4F4F), // Ceniza
      plains: new THREE.Color(0x1a1a1a), // Roca basáltica
      forest: new THREE.Color(0x333333),
      mountain: new THREE.Color(0x000000),
      peak: new THREE.Color(0x555555),
    }
  },
  AQUATIC: {
    name: 'Acuático',
    seaLevel: 0.85,
    roughness: 0.8,
    frequency: 1.2,
    colors: {
      deepOcean: new THREE.Color(0x001a33),
      midOcean: new THREE.Color(0x003366),
      shallowOcean: new THREE.Color(0x006699),
      beach: new THREE.Color(0x0099cc), // Arrecifes someros
      plains: new THREE.Color(0x33ccff),
      forest: new THREE.Color(0x20b2aa), // Islas de coral/algas
      mountain: new THREE.Color(0x008080),
      peak: new THREE.Color(0xa0db8e),
    }
  },
  ICE: {
    name: 'Tundra / Helado',
    seaLevel: 0.45,
    roughness: 1.8,
    frequency: 1.1,
    colors: {
      deepOcean: new THREE.Color(0x2b3a42),
      midOcean: new THREE.Color(0x3f5a6c),
      shallowOcean: new THREE.Color(0x5d8aa8),
      beach: new THREE.Color(0xb0c4de),
      plains: new THREE.Color(0xf0f8ff),
      forest: new THREE.Color(0xdcdcdc),
      mountain: new THREE.Color(0xa9a9a9),
      peak: new THREE.Color(0xffffff),
    }
  },
   GAS_GIANT: { // Simulated
    name: 'Gigante Gaseoso',
    seaLevel: 0.0, // No ocean visual displacement logic usually
    roughness: 0.2,
    frequency: 2.5,
    colors: {
      deepOcean: new THREE.Color(0x4B0082),
      midOcean: new THREE.Color(0x800080),
      shallowOcean: new THREE.Color(0x8A2BE2),
      beach: new THREE.Color(0x9370DB),
      plains: new THREE.Color(0xBA55D3),
      forest: new THREE.Color(0xDDA0DD),
      mountain: new THREE.Color(0xEE82EE),
      peak: new THREE.Color(0xFF00FF),
    }
  }
};

// Helper to map Global types to Local presets
const mapPlanetTypeToPreset = (type: TipoPlaneta): string => {
    switch (type) {
        case 'JUNGLA': return 'TERRAN';
        case 'DESERTICO': return 'DESERT';
        case 'VOLCANICO': return 'VOLCANIC';
        case 'ACUATICO': return 'AQUATIC';
        case 'GIGANTE_GASEOSO': return 'GAS_GIANT';
        default: return 'TERRAN';
    }
}

interface PlanetGenerator3DProps {
    isPaused?: boolean;
}

const PlanetGenerator3D: React.FC<PlanetGenerator3DProps> = ({ isPaused = false }) => {
  const { systems, selectedPlanetId } = useWorkbenchStore();
  
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const planetMeshRef = useRef<THREE.Mesh | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animationRef = useRef<number | null>(null);
  
  // --- STATE ---
  const [isSceneReady, setIsSceneReady] = useState(false);
  
  // Params
  const [activePreset, setActivePreset] = useState<string>('TERRAN');
  const [seed, setSeed] = useState<string>('galaxy-workbench');
  const [seaLevel, setSeaLevel] = useState<number>(0.5);
  const [roughness, setRoughness] = useState<number>(1.5);
  const [frequency, setFrequency] = useState<number>(1.0);
  
  // UI State
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiDescription, setAiDescription] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [biomeStats, setBiomeStats] = useState<Record<string, string>>({});
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [linkedPlanetName, setLinkedPlanetName] = useState<string | null>(null);

  // Pause Ref
  const isPausedRef = useRef(isPaused);
  useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);

  // --- DATA BINDING EFFECT ---
  // This effect connects the global selection to the Voxel Lab's local state
  useEffect(() => {
    if (selectedPlanetId) {
        const planet = systems
            .flatMap(s => s.orbitas.flatMap(o => o.objetos))
            .find(obj => obj.id === selectedPlanetId && obj.tipo === 'PLANETA');
        
        if (planet && planet.tipo === 'PLANETA') {
            const payload = planet.cargaUtil;
            setLinkedPlanetName(payload.tituloTipoPlaneta);
            setSeed(planet.id); // Deterministic seed from ID
            
            // Map Global Data to Visual Sliders
            setActivePreset(mapPlanetTypeToPreset(payload.tipoPlaneta));
            
            // Approximate visual params based on data
            // Sea Level based on ice/water composition + humidity
            let calcSeaLevel = 0.5;
            if (payload.tipoPlaneta === 'ACUATICO') calcSeaLevel = 0.8 + (Math.random() * 0.15);
            else if (payload.tipoPlaneta === 'DESERTICO') calcSeaLevel = 0.1;
            else if (payload.tipoPlaneta === 'GIGANTE_GASEOSO') calcSeaLevel = 0.0;
            else {
                const humidAvg = (payload.rangoHumedad[0] + payload.rangoHumedad[1]) / 2;
                calcSeaLevel = humidAvg * 0.7; 
            }
            setSeaLevel(calcSeaLevel);

            // Roughness based on Gravity/Type
            let calcRoughness = 1.5;
            if (payload.gravedad === 'high') calcRoughness = 0.8; // High gravity = flatter
            else if (payload.gravedad === 'low') calcRoughness = 2.2; // Low gravity = spikey
            if (payload.tipoPlaneta === 'VOLCANICO') calcRoughness += 0.5;
            if (payload.tipoPlaneta === 'GIGANTE_GASEOSO') calcRoughness = 0.2;
            setRoughness(calcRoughness);
            
            setFrequency(1.0 + Math.random() * 0.5); // Slight variation
        }
    } else {
        setLinkedPlanetName(null);
    }
  }, [selectedPlanetId, systems]);

  // --- 1. INIT SCENE (Runs once) ---
  useEffect(() => {
    if (!mountRef.current) return;

    // Setup
    const scene = new THREE.Scene();
    // Remove background color so the global "space" background shows through
    sceneRef.current = scene;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 3.5;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.0;
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 3, 5);
    scene.add(dirLight);

    const backLight = new THREE.DirectionalLight(0x5555ff, 0.4);
    backLight.position.set(-5, -2, -5);
    scene.add(backLight);

    // Animation Loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      if (isPausedRef.current) return;

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    setIsSceneReady(true);

    // Cleanup
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (rendererRef.current && mountRef.current) {
          mountRef.current.removeChild(rendererRef.current.domElement);
          rendererRef.current.dispose();
      }
      setIsSceneReady(false);
    };
  }, []);

  // --- 2. HANDLE RESIZE ---
  useEffect(() => {
    const handleResize = () => {
        if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
        const w = mountRef.current.clientWidth;
        const h = mountRef.current.clientHeight;
        if (w === 0 || h === 0) return; 
        cameraRef.current.aspect = w / h;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(w, h);
    };

    handleResize();

    const resizeObserver = new ResizeObserver(handleResize);
    if (mountRef.current) {
        resizeObserver.observe(mountRef.current);
    }
    
    return () => resizeObserver.disconnect();
  }, [isSceneReady, isControlsVisible]);


  // --- 3. PLANET GENERATION (Runs when params change) ---
  const generatePlanet = useCallback(() => {
    if (!sceneRef.current || !isSceneReady) return;
    
    setIsGenerating(true);

    // Clean up old mesh
    if (planetMeshRef.current) {
        sceneRef.current.remove(planetMeshRef.current);
        planetMeshRef.current.geometry.dispose();
        (planetMeshRef.current.material as THREE.Material).dispose();
        planetMeshRef.current = null;
    }

    // New Geometry
    const noise = new SimplexNoise(seed);
    const geometry = new THREE.SphereGeometry(1.0, 128, 128);
    
    const count = geometry.attributes.position.count;
    const positions = geometry.attributes.position;
    const colors = [];
    const preset = PRESETS[activePreset];

    const biomeCounts: Record<string, number> = {
        'Océano Profundo': 0, 'Océano Medio': 0, 'Aguas Someras': 0, 'Playa': 0,
        'Llanuras': 0, 'Bosque': 0, 'Montaña': 0, 'Nieve/Pico': 0
    };

    const _v = new THREE.Vector3();
    
    for (let i = 0; i < count; i++) {
        _v.fromBufferAttribute(positions, i);
        
        let noiseVal = 0;
        let amp = 1.0;
        let freq = frequency;
        let maxAmp = 0;

        for(let o=0; o<4; o++) {
             noiseVal += noise.noise3D(_v.x * freq, _v.y * freq, _v.z * freq) * amp;
             maxAmp += amp;
             amp *= 0.5;
             freq *= 2.0;
        }
        noiseVal = (noiseVal / maxAmp + 1) * 0.5; // 0..1

        // Displacement
        let displacement = 0;
        if (activePreset === 'GAS_GIANT') {
             displacement = 0;
        } else {
             displacement = (noiseVal - seaLevel) * roughness * 0.2; 
             if (noiseVal < seaLevel) {
                displacement = 0; 
             }
        }

        const newPos = _v.clone().normalize().multiplyScalar(1.0 + displacement);
        positions.setXYZ(i, newPos.x, newPos.y, newPos.z);

        // Colors
        let color = new THREE.Color();
        
        if (activePreset === 'GAS_GIANT') {
             const latitude = Math.asin(newPos.y / (1.0 + displacement)); 
             const band = Math.abs(Math.sin(latitude * 10 + noiseVal * 5));
             
             if (band < 0.2) color = preset.colors.deepOcean;
             else if (band < 0.4) color = preset.colors.midOcean;
             else if (band < 0.6) color = preset.colors.plains;
             else color = preset.colors.beach;
             
        } else {
             if (noiseVal < seaLevel * 0.4) { color = preset.colors.deepOcean; biomeCounts['Océano Profundo']++; }
             else if (noiseVal < seaLevel * 0.8) { color = preset.colors.midOcean; biomeCounts['Océano Medio']++; }
             else if (noiseVal < seaLevel) { color = preset.colors.shallowOcean; biomeCounts['Aguas Someras']++; }
             else if (noiseVal < seaLevel + 0.03) { color = preset.colors.beach; biomeCounts['Playa']++; }
             else if (noiseVal < seaLevel + 0.25) { color = preset.colors.plains; biomeCounts['Llanuras']++; }
             else if (noiseVal < seaLevel + 0.5) { color = preset.colors.forest; biomeCounts['Bosque']++; }
             else if (noiseVal < seaLevel + 0.8) { color = preset.colors.mountain; biomeCounts['Montaña']++; }
             else { color = preset.colors.peak; biomeCounts['Nieve/Pico']++; }
        }
        colors.push(color.r, color.g, color.b);
    }

    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.computeVertexNormals();

    const material = new THREE.MeshStandardMaterial({
        vertexColors: true,
        roughness: activePreset === 'AQUATIC' ? 0.3 : 0.8,
        metalness: 0.1,
        flatShading: activePreset !== 'GAS_GIANT'
    });

    const mesh = new THREE.Mesh(geometry, material);
    sceneRef.current.add(mesh);
    planetMeshRef.current = mesh;

    // Stats
    const stats: Record<string, string> = {};
    Object.keys(biomeCounts).forEach(key => {
        const pct = (biomeCounts[key] / count) * 100;
        if (pct > 1) stats[key] = pct.toFixed(1) + '%';
    });
    setBiomeStats(stats);

    setIsGenerating(false);
  }, [isSceneReady, seed, activePreset, seaLevel, roughness, frequency]);

  // Trigger generation
  useEffect(() => {
      if (isSceneReady) {
          generatePlanet();
      }
  }, [isSceneReady, generatePlanet]);


  // --- 4. AI HANDLER ---
  const handleAiDescribe = async () => {
    setIsAiLoading(true);
    setAiDescription(null);
    try {
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            setAiDescription("API Key no encontrada.");
            setIsAiLoading(false);
            return;
        }

        const ai = new GoogleGenAI({ apiKey });
        const model = "gemini-2.5-flash";
        let biomeText = Object.entries(biomeStats).map(([k, v]) => `- ${k}: ${v}`).join('\n');
        const prompt = `
        Eres un explorador espacial. Describe este planeta para el Códex:
        Tipo: ${PRESETS[activePreset].name}, Semilla: ${seed}, Nivel Mar: ${seaLevel}, Rugosidad: ${roughness}.
        Biomas: \n${biomeText}
        Inventa un nombre, describe su atmósfera y posible vida. Máx 100 palabras.
        `;

        const result = await ai.models.generateContent({ model, contents: prompt });
        setAiDescription(result.text || "Sin respuesta.");
    } catch (error) {
        console.error("AI Error:", error);
        setAiDescription("Error de comunicación.");
    } finally {
        setIsAiLoading(false);
    }
  };
  
  const handleUnlink = () => {
      setLinkedPlanetName(null);
      setSeed(Math.random().toString(36).substring(7));
      // Reset to arbitrary defaults to show "freedom"
      setSeaLevel(0.5);
      setRoughness(1.5);
  }

  return (
    <div className="w-full h-full relative flex flex-col md:flex-row overflow-hidden pt-20 pb-32 pointer-events-auto">
        {/* LEFT CONTROLS (Collapsible) */}
        <div 
          className={`
            flex-shrink-0 bg-slate-950/80 backdrop-blur-md border-r border-white/10 
            flex flex-col overflow-y-auto z-20 shadow-2xl transition-all duration-300 ease-in-out
            absolute md:relative h-full rounded-r-2xl my-4 ml-4
          `}
          style={{ width: isControlsVisible ? '320px' : '0px', opacity: isControlsVisible ? 1 : 0, padding: isControlsVisible ? '1.5rem' : '0' }}
        >
             <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2 whitespace-nowrap">
                <span className="text-accent-cyan">⚡</span> Voxel Fabricator
             </h2>
             
             {linkedPlanetName ? (
                 <div className="mb-6 p-3 bg-accent-cyan/10 border border-accent-cyan/30 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-accent-cyan uppercase tracking-wider flex items-center gap-1">
                             <LinkIcon /> Linked Signal
                        </span>
                        <button onClick={handleUnlink} title="Unlink from System Data" className="text-slate-400 hover:text-white transition-colors">
                            <UnlinkIcon />
                        </button>
                    </div>
                    <p className="text-sm text-white font-bold truncate">{linkedPlanetName}</p>
                 </div>
             ) : (
                  <p className="text-xs text-slate-500 mb-6 italic">Sandbox Mode (No planet selected)</p>
             )}

             <div className="space-y-6 flex-grow min-w-[280px] custom-scrollbar">
                <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Class Template</label>
                    <div className="grid grid-cols-2 gap-2">
                        {Object.keys(PRESETS).map(key => (
                            <button
                                key={key}
                                onClick={() => setActivePreset(key)}
                                className={`px-2 py-2 text-xs font-bold rounded-md border transition-all duration-200 ${
                                    activePreset === key 
                                    ? 'bg-accent-cyan/20 border-accent-cyan text-white shadow-[0_0_10px_rgba(6,182,212,0.2)]' 
                                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                {PRESETS[key].name.split(' ')[0]}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-4 p-4 bg-black/30 rounded-lg border border-white/5">
                     <div className="space-y-1">
                        <div className="flex justify-between text-xs text-slate-300 font-mono">
                            <span>SEA LEVEL</span>
                            <span className="text-accent-cyan">{seaLevel.toFixed(2)}</span>
                        </div>
                        <input type="range" min="0" max="1.0" step="0.01" value={seaLevel} onChange={(e) => setSeaLevel(parseFloat(e.target.value))} className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-accent-cyan" />
                     </div>
                     <div className="space-y-1">
                        <div className="flex justify-between text-xs text-slate-300 font-mono">
                            <span>ROUGHNESS</span>
                            <span className="text-accent-cyan">{roughness.toFixed(2)}</span>
                        </div>
                        <input type="range" min="0.1" max="3.0" step="0.1" value={roughness} onChange={(e) => setRoughness(parseFloat(e.target.value))} className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-accent-cyan" />
                     </div>
                     <div className="space-y-1">
                        <div className="flex justify-between text-xs text-slate-300 font-mono">
                            <span>FREQUENCY</span>
                            <span className="text-accent-cyan">{frequency.toFixed(2)}</span>
                        </div>
                        <input type="range" min="0.5" max="3.0" step="0.1" value={frequency} onChange={(e) => setFrequency(parseFloat(e.target.value))} className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-accent-cyan" />
                     </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Seed</label>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={seed} 
                            onChange={(e) => setSeed(e.target.value)} 
                            className="w-full bg-black/50 border border-slate-600 rounded px-3 py-2 text-sm text-white font-mono" 
                            disabled={!!linkedPlanetName} // Disable editing seed when linked to preserve consistency
                        />
                        {!linkedPlanetName && (
                            <button onClick={() => setSeed(Math.random().toString(36).substring(7))} className="p-2 bg-white/5 text-slate-300 hover:text-accent-cyan rounded border border-slate-600 hover:bg-white/10">
                                <DiceIcon />
                            </button>
                        )}
                    </div>
                </div>
             </div>

             <div className="mt-4 space-y-3 min-w-[280px]">
                <button onClick={generatePlanet} className="w-full py-3 bg-accent-cyan text-space-dark font-bold rounded-md shadow-lg hover:bg-cyan-300 transition-all flex justify-center items-center gap-2 uppercase tracking-wide">
                    {isGenerating ? <span className="animate-spin">⟳</span> : <RefreshIcon />} <span>Regenerate</span>
                </button>
                <button onClick={handleAiDescribe} disabled={isAiLoading} className="w-full py-3 bg-purple-600/20 border border-purple-500/50 text-purple-300 font-bold rounded-md shadow-lg hover:bg-purple-600/40 transition-all flex justify-center items-center gap-2 disabled:opacity-50 uppercase tracking-wide">
                    {isAiLoading ? <span className="animate-pulse">...</span> : <><SparklesIcon /> <span>AI Analyze</span></>}
                </button>
             </div>
        </div>

        {/* 3D VIEWPORT */}
        <div className="flex-1 relative h-full w-full rounded-l-2xl overflow-hidden mx-4 my-4 border border-white/5 shadow-inner bg-black/40">
            <div ref={mountRef} className="absolute inset-0 w-full h-full" />
            
            {/* TOGGLE BUTTON */}
            <button 
                onClick={() => setIsControlsVisible(!isControlsVisible)}
                className="absolute top-4 left-4 z-30 p-2 bg-slate-900/80 text-slate-200 rounded-md border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-md"
                title={isControlsVisible ? "Hide Controls" : "Show Controls"}
            >
                {isControlsVisible ? <EyeOffIcon /> : <EyeIcon />}
            </button>
            
            {/* LINKED INDICATOR OVERLAY */}
            {linkedPlanetName && (
                <div className="absolute top-4 left-16 z-30 px-3 py-1.5 bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan text-xs font-bold rounded-md backdrop-blur-md animate-pulse">
                    VISUALIZING: {linkedPlanetName.toUpperCase()}
                </div>
            )}

            {aiDescription && (
                <div className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 bg-slate-900/90 backdrop-blur-md border border-purple-500/30 p-5 rounded-lg shadow-2xl animate-fade-in text-sm text-slate-200 max-h-[40vh] overflow-y-auto z-30">
                    <div className="flex justify-between mb-2 border-b border-purple-500/30 pb-2">
                         <h3 className="text-purple-400 font-bold flex items-center gap-2 uppercase tracking-widest text-xs"><SparklesIcon /> Analysis Log</h3>
                         <button onClick={() => setAiDescription(null)} className="text-slate-500 hover:text-white">✕</button>
                    </div>
                    <p className="font-mono leading-relaxed">{aiDescription}</p>
                </div>
            )}

            <div className="absolute top-4 right-4 pointer-events-none z-10">
                <div className="bg-slate-900/80 backdrop-blur-sm p-4 rounded-lg border border-white/10 shadow-lg">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-3 tracking-wider">Surface Composition</h4>
                    <div className="space-y-1.5">
                        {Object.entries(biomeStats).map(([name, pct]) => (
                            <div key={name} className="flex justify-between text-xs w-48 border-b border-white/5 pb-1 last:border-0">
                                <span className="text-slate-300">{name}</span>
                                <span className="font-mono text-accent-cyan">{pct}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default PlanetGenerator3D;
