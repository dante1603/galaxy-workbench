
import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { GoogleGenAI } from "@google/genai";
import { useWorkbenchStore } from '../state/workbenchStore';
import type { TipoPlaneta, CargaUtilPlaneta, TipoEstrella } from '../types';
import { generatePlanetGeometryData, resolvePlanetVisuals } from '../utils/planetGeometry';
import { generateStarTextureBuffer } from '../utils/planetTexture';
import { TABLA_ESTRELLAS } from '../constants/starTables';
import { BH_VERTEX_SHADER, BH_FRAGMENT_SHADER } from '../utils/blackHoleUtils';

// --- ICONS ---
const DiceIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 8h.01"></path><path d="M8 8h.01"></path><path d="M8 16h.01"></path><path d="M16 16h.01"></path><path d="M12 12h.01"></path></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275-1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>;
const RefreshIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3"/></svg>;
const EyeOffIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>;
const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const LinkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>;
const UnlinkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path><line x1="2" y1="2" x2="22" y2="22"></line></svg>;
const StarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>;
const PlanetIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>;
const VortexIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.05 12a9.95 9.95 0 0 1 2.37-6.02L12 12 2.05 12zm17.58-6.02A9.95 9.95 0 0 1 21.95 12H12l7.63-6.02zM4.42 18.02a9.95 9.95 0 0 1 1.08-12.63L12 12 4.42 18.02zm15.16-12.63a9.95 9.95 0 0 1 1.08 12.63L12 12l7.58-6.61zM2 12c0 5.52 4.48 10 10 10s10-4.48 10-10"></path></svg>;

// Helper to create a dummy payload for standalone generation
const createDummyPayload = (type: TipoPlaneta): CargaUtilPlaneta => {
    return {
        tipoPlaneta: type,
        tituloTipoPlaneta: "Simulacro",
        biomas: [],
        subOrbitas: [],
        cristales: [],
        atmosfera: { composicion: "" },
        composicionGlobal: { roca: 0.5, metal: 0.3, hielo: 0.2 },
        gravedad: 'medium',
        presion: 'medium',
        tipoAtmosfera: 'breathable',
        rangoTemperaturaC: [20, 20],
        rangoHumedad: [0.5, 0.5],
        distribucionBiomas: [],
        peligrosPlanetarios: [],
        densidadVida: 'medium'
    };
};

interface PlanetGenerator3DProps {
    isPaused?: boolean;
}

const PlanetGenerator3D: React.FC<PlanetGenerator3DProps> = ({ isPaused = false }) => {
  const { systems, selectedPlanetId } = useWorkbenchStore();
  
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const glowRef = useRef<THREE.Sprite | null>(null);
  const composerRef = useRef<EffectComposer | null>(null);
  
  const bhUniformsRef = useRef({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(0xff4500) },
      uDiskRadius: { value: 4.0 },
      uBlackHoleRadius: { value: 0.5 },
      uCameraPos: { value: new THREE.Vector3() },
      uOpacity: { value: 1.0 },
  });

  const controlsRef = useRef<OrbitControls | null>(null);
  const animationRef = useRef<number | null>(null);
  
  // --- STATE ---
  const [isSceneReady, setIsSceneReady] = useState(false);
  const [objectType, setObjectType] = useState<'PLANET' | 'STAR' | 'BLACK_HOLE'>('PLANET');
  
  // Configuration
  const [planetType, setPlanetType] = useState<TipoPlaneta>('JUNGLA');
  const [starType, setStarType] = useState<TipoEstrella>('solar');
  const [seed, setSeed] = useState<string>('galaxy-workbench');
  
  // Visual Overrides
  const [seaLevel, setSeaLevel] = useState<number>(0.5);
  const [roughness, setRoughness] = useState<number>(0.5); 
  const [hueShift, setHueShift] = useState<number>(0);
  const [granulation, setGranulation] = useState<number>(2.5);
  const [starColorOverride, setStarColorOverride] = useState<string>('');
  const [bhDiskColor, setBhDiskColor] = useState<string>('#ff4500'); 
  const [bhDiskScale, setBhDiskScale] = useState<number>(4.0);

  // UI State
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiDescription, setAiDescription] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [biomeStats, setBiomeStats] = useState<Record<string, string>>({});
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [linkedPlanetName, setLinkedPlanetName] = useState<string | null>(null);

  const isPausedRef = useRef(isPaused);
  useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);

  const isGasGiant = planetType === 'GIGANTE_GASEOSO';

  // --- DATA BINDING EFFECT ---
  useEffect(() => {
    if (selectedPlanetId) {
        const planet = systems
            .flatMap(s => s.orbitas.flatMap(o => o.objetos))
            .find(obj => obj.id === selectedPlanetId && obj.tipo === 'PLANETA');
        
        if (planet && planet.tipo === 'PLANETA') {
            setObjectType('PLANET');
            const payload = planet.cargaUtil;
            setLinkedPlanetName(payload.tituloTipoPlaneta);
            setSeed(planet.id);
            setPlanetType(payload.tipoPlaneta);
            
            const visuals = resolvePlanetVisuals(payload);
            setSeaLevel(visuals.seaLevel);
            setRoughness(visuals.roughness);
            setHueShift(0);
        }
    } else {
        setLinkedPlanetName(null);
        if (!linkedPlanetName && seed === 'galaxy-workbench') {
            setSeaLevel(0.5);
            setRoughness(0.5);
            setHueShift(0);
        }
    }
  }, [selectedPlanetId, systems, linkedPlanetName, seed]);

  // --- 1. INIT SCENE ---
  useEffect(() => {
    if (!mountRef.current) return;
    const currentMount = mountRef.current;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const width = mountRef.current.clientWidth || 1;
    const height = mountRef.current.clientHeight || 1;

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000); 
    camera.position.set(0, 2, 5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping; 
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // --- POST PROCESSING SETUP ---
    const renderPass = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 1.5, 0.4, 0.85);
    bloomPass.threshold = 0.2;
    bloomPass.strength = 1.2; 
    bloomPass.radius = 0.5;

    const composer = new EffectComposer(renderer);
    composer.addPass(renderPass);
    composer.addPass(bloomPass);
    
    composerRef.current = composer;

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

    const clock = new THREE.Clock();

    // Animation Loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      if (isPausedRef.current) return;
      
      const elapsed = clock.getElapsedTime();
      controls.update();
      
      if (meshRef.current) {
          if (meshRef.current.userData.isStar) {
               meshRef.current.rotation.y += 0.002;
          }
      }
      
      if (meshRef.current && meshRef.current.userData.isBlackHole) {
          if (meshRef.current.material instanceof THREE.ShaderMaterial) {
             meshRef.current.material.uniforms.uTime.value = elapsed;
             // Update camera position uniform for raymarching inside the box
             meshRef.current.material.uniforms.uCameraPos.value.copy(camera.position);
          }
      }

      // Use Composer instead of standard renderer
      composer.render();
    };
    animate();

    setIsSceneReady(true);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (rendererRef.current && currentMount) {
          currentMount.removeChild(rendererRef.current.domElement);
          rendererRef.current.dispose();
          composer.dispose();
      }
      setIsSceneReady(false);
    };
  }, []);

  // --- 2. HANDLE RESIZE ---
  useEffect(() => {
    const handleResize = () => {
        if (!mountRef.current || !rendererRef.current || !cameraRef.current || !composerRef.current) return;
        const w = mountRef.current.clientWidth;
        const h = mountRef.current.clientHeight;
        if (w === 0 || h === 0) return; 
        cameraRef.current.aspect = w / h;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(w, h);
        composerRef.current.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    if (mountRef.current) {
        resizeObserver.observe(mountRef.current);
    }
    return () => resizeObserver.disconnect();
  }, [isSceneReady, isControlsVisible]);

  // --- 3. OBJECT GENERATION ---
  const generateBody = useCallback(() => {
    if (!sceneRef.current || !isSceneReady) return;
    
    setIsGenerating(true);

    if (meshRef.current) {
        sceneRef.current.remove(meshRef.current);
        meshRef.current.geometry.dispose();
        if (meshRef.current.material instanceof THREE.Material) meshRef.current.material.dispose();
        if (glowRef.current) {
            meshRef.current.remove(glowRef.current);
            glowRef.current = null;
        }
        meshRef.current = null;
    }
    
    setBiomeStats({});

    if (objectType === 'PLANET') {
        // ... Planet Logic ...
        const basePayload = createDummyPayload(planetType);
        const { positions, colors, stats } = generatePlanetGeometryData(
            basePayload, 
            seed, 
            96, 
            { seaLevel, roughness, hueShift }
        );

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geometry.computeVertexNormals();

        const material = new THREE.MeshStandardMaterial({
            vertexColors: true,
            roughness: planetType === 'ACUATICO' ? 0.3 : 0.8,
            metalness: 0.1,
            flatShading: true 
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.userData = { isStar: false };
        sceneRef.current.add(mesh);
        meshRef.current = mesh;

        const formattedStats: Record<string, string> = {};
        const total = positions.length / 3;
        Object.keys(stats).forEach(key => {
            const pct = (stats[key] / total) * 100;
            if (pct > 1) formattedStats[key] = pct.toFixed(1) + '%';
        });
        setBiomeStats(formattedStats);

    } else if (objectType === 'STAR') {
        // ... Star Logic ...
        const starData = TABLA_ESTRELLAS[starType];
        const colorHex = starColorOverride || starData.colorHex;
        
        const w = 256, h = 128;
        const buffer = generateStarTextureBuffer(colorHex, seed, w, h, granulation);
        
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            const imgData = new ImageData(new Uint8ClampedArray(buffer), w, h);
            ctx.putImageData(imgData, 0, 0);
        }
        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;

        const radius = starData.radioSolar > 5 ? 1.5 : (starData.radioSolar < 0.1 ? 0.5 : 1.0);
        const geometry = new THREE.SphereGeometry(radius, 64, 64);
        const material = new THREE.MeshBasicMaterial({ map: texture });
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.userData = { isStar: true };
        sceneRef.current.add(mesh);
        meshRef.current = mesh;
        
        const spriteCanvas = document.createElement('canvas');
        spriteCanvas.width = 64; spriteCanvas.height = 64;
        const sCtx = spriteCanvas.getContext('2d');
        if (sCtx) {
            const gradient = sCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
            gradient.addColorStop(0.3, `${colorHex}99`); 
            gradient.addColorStop(0.6, `${colorHex}33`);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            sCtx.fillStyle = gradient;
            sCtx.fillRect(0, 0, 64, 64);
        }
        const spriteMap = new THREE.CanvasTexture(spriteCanvas);
        const spriteMat = new THREE.SpriteMaterial({ 
            map: spriteMap, 
            color: colorHex, 
            blending: THREE.AdditiveBlending, 
            transparent: true, 
            opacity: 0.6 
        });
        const sprite = new THREE.Sprite(spriteMat);
        sprite.scale.set(radius * 3, radius * 3, 1);
        mesh.add(sprite);
        glowRef.current = sprite;
        
        setBiomeStats({ 
            "Surface Temp": `${starData.temperaturaSuperficialK} K`,
            "Class": starData.claseEstelar
        });
    } else {
        // --- BLACK HOLE GENERATION ---
        bhUniformsRef.current.uColor.value.set(bhDiskColor);
        bhUniformsRef.current.uDiskRadius.value = bhDiskScale;
        if(cameraRef.current) bhUniformsRef.current.uCameraPos.value.copy(cameraRef.current.position);

        // IMPORTANT: Increase box size to contain the raymarching volume
        // Max scale is 8.0. Sim radius is 8.0 * 2.5 = 20. Diameter is 40. 
        // Box size 50 ensures we don't clip.
        const geometry = new THREE.BoxGeometry(50, 50, 50); 
        
        const material = new THREE.ShaderMaterial({
            uniforms: bhUniformsRef.current,
            vertexShader: BH_VERTEX_SHADER,
            fragmentShader: BH_FRAGMENT_SHADER,
            transparent: true,
            // Use BackSide because camera is usually inside this large box in Voxel Lab
            side: THREE.BackSide, 
            blending: THREE.NormalBlending
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.userData = { isBlackHole: true };
        sceneRef.current.add(mesh);
        meshRef.current = mesh;

        setBiomeStats({ 
            "Singularity Mass": `~${(Math.random() * 30 + 5).toFixed(1)} M☉`,
            "Schwarzschild Radius": `0.5 AU`,
            "Lensing Effect": "Active",
            "Doppler Shift": "Relativistic"
        });
    }

    setIsGenerating(false);
  }, [isSceneReady, seed, objectType, planetType, seaLevel, roughness, hueShift, starType, granulation, starColorOverride, bhDiskColor, bhDiskScale]);

  useEffect(() => {
      if (isSceneReady) {
          const timer = setTimeout(() => {
             generateBody();
          }, 50);
          return () => clearTimeout(timer);
      }
  }, [isSceneReady, generateBody]);


  // --- AI HANDLER ---
  const handleAiDescribe = async () => {
    setIsAiLoading(true);
    setAiDescription(null);
    try {
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            setAiDescription("Error: API Key no configurada.");
            setIsAiLoading(false);
            return;
        }

        const ai = new GoogleGenAI({ apiKey });
        const model = "gemini-2.5-flash";
        
        let prompt = "";
        if (objectType === 'PLANET') {
            const biomeText = Object.entries(biomeStats).map(([k, v]) => `- ${k}: ${v}`).join('\n');
            prompt = `
            Eres un explorador espacial. Describe este planeta para el Códex:
            Tipo: ${planetType.replace('_', ' ')}, Semilla: ${seed}.
            ${isGasGiant 
                ? `Características: Bandas gaseosas (Freq: ${seaLevel.toFixed(2)}), Turbulencia: ${roughness.toFixed(2)}, Matiz: ${hueShift}°` 
                : `Características: Nivel Mar: ${seaLevel}, Rugosidad: ${roughness}.`
            }
            Biomas: \n${biomeText}
            Inventa un nombre, describe su atmósfera y posible vida. Máx 100 palabras.
            `;
        } else if (objectType === 'STAR') {
            prompt = `
            Eres un astrofísico. Describe esta estrella para el Códex:
            Tipo: ${starType.replace('_', ' ')}, Semilla: ${seed}.
            Granulación (Actividad Superficial): ${granulation}.
            Color Base: ${starColorOverride || TABLA_ESTRELLAS[starType].colorHex}.
            Temperatura: ${TABLA_ESTRELLAS[starType].temperaturaSuperficialK} K.
            Inventa un nombre de catálogo y describe su comportamiento estelar. Máx 80 palabras.
            `;
        } else {
             prompt = `
            Eres un físico teórico. Describe esta singularidad gravitacional (Agujero Negro) para el Códex:
            Semilla: ${seed}.
            Disco de Acreción: Color ${bhDiskColor}, con efecto Doppler visible (lado azulado vs rojizo).
            Radio de Acreción: ${bhDiskScale.toFixed(1)}x el radio del horizonte.
            Lente Gravitacional: Fuerte distorsión de la luz estelar de fondo.
            Inventa una designación (ej: Cygnus X-1) y describe la física extrema. Máx 80 palabras.
            `;
        }

        const result = await ai.models.generateContent({ model, contents: prompt });
        setAiDescription(result.text || "Sin respuesta.");
    } catch (error: unknown) {
        console.error("AI Error:", error);
        setAiDescription(`Error de IA: ${error instanceof Error ? error.message : 'Desconocido'}`);
    } finally {
        setIsAiLoading(false);
    }
  };
  
  const handleUnlink = () => {
      setLinkedPlanetName(null);
      setSeed(Math.random().toString(36).substring(7));
  };

  const handleForceRegenerate = () => {
      if (!linkedPlanetName) {
          setSeed(Math.random().toString(36).substring(7));
      } else {
          generateBody();
      }
  };

  const planetTypes: TipoPlaneta[] = ['DESERTICO', 'JUNGLA', 'VOLCANICO', 'ACUATICO', 'GIGANTE_GASEOSO'];
  const starTypes = Object.keys(TABLA_ESTRELLAS) as TipoEstrella[];

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
             
             <div className="flex bg-slate-800/50 rounded-lg p-1 mb-4 border border-white/10">
                <button 
                    onClick={() => setObjectType('PLANET')} 
                    className={`flex-1 py-1.5 text-xs font-bold rounded uppercase transition-colors flex items-center justify-center gap-2 ${objectType === 'PLANET' ? 'bg-accent-cyan text-space-dark' : 'text-slate-400 hover:text-white'}`}
                    title="Planet Builder"
                >
                   <PlanetIcon />
                </button>
                <button 
                    onClick={() => setObjectType('STAR')} 
                    className={`flex-1 py-1.5 text-xs font-bold rounded uppercase transition-colors flex items-center justify-center gap-2 ${objectType === 'STAR' ? 'bg-accent-amber text-space-dark' : 'text-slate-400 hover:text-white'}`}
                    title="Star Forge"
                >
                   <StarIcon />
                </button>
                <button 
                    onClick={() => setObjectType('BLACK_HOLE')} 
                    className={`flex-1 py-1.5 text-xs font-bold rounded uppercase transition-colors flex items-center justify-center gap-2 ${objectType === 'BLACK_HOLE' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    title="Singularity Generator"
                >
                   <VortexIcon />
                </button>
             </div>
             
             {linkedPlanetName && objectType === 'PLANET' && (
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
             )}

             <div className="space-y-6 flex-grow min-w-[280px] custom-scrollbar">
                {objectType === 'PLANET' ? (
                    <>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Planet Class</label>
                            <div className="grid grid-cols-2 gap-2">
                                {planetTypes.map(key => (
                                    <button
                                        key={key}
                                        onClick={() => { setPlanetType(key); if(key === 'GIGANTE_GASEOSO') { setSeaLevel(0.5); setRoughness(0.3); } }}
                                        className={`px-2 py-2 text-[10px] font-bold rounded-md border transition-all duration-200 uppercase ${
                                            planetType === key 
                                            ? 'bg-accent-cyan/20 border-accent-cyan text-white shadow-[0_0_10px_rgba(6,182,212,0.2)]' 
                                            : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                                        }`}
                                    >
                                        {key.replace(/_/g, ' ')}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4 p-4 bg-black/30 rounded-lg border border-white/5">
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-slate-300 font-mono">
                                    <span>{isGasGiant ? "BAND FREQUENCY" : "SEA LEVEL"}</span>
                                    <span className="text-accent-cyan">{seaLevel.toFixed(2)}</span>
                                </div>
                                <input type="range" min="0" max="1.0" step="0.01" value={seaLevel} onChange={(e) => setSeaLevel(parseFloat(e.target.value))} className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-accent-cyan" />
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-slate-300 font-mono">
                                    <span>{isGasGiant ? "TURBULENCE" : "ROUGHNESS"}</span>
                                    <span className="text-accent-cyan">{roughness.toFixed(2)}</span>
                                </div>
                                <input type="range" min="0.0" max={isGasGiant ? "1.0" : "0.7"} step="0.05" value={roughness} onChange={(e) => setRoughness(parseFloat(e.target.value))} className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-accent-cyan" />
                            </div>
                            {isGasGiant && (
                                <div className="space-y-1 pt-2 border-t border-white/5">
                                    <div className="flex justify-between text-xs text-slate-300 font-mono">
                                        <span>HUE SHIFT</span>
                                        <span className="text-accent-cyan">{hueShift}°</span>
                                    </div>
                                    <div className="group relative w-full h-2 rounded-md overflow-hidden ring-1 ring-white/10">
                                        <input 
                                            type="range" min="0" max="360" value={hueShift} 
                                            onChange={(e) => setHueShift(parseInt(e.target.value))}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        <div className="w-full h-full bg-gradient-to-r from-red-500 via-green-500 to-blue-500"></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                ) : objectType === 'STAR' ? (
                    <>
                         <div>
                            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Star Class</label>
                            <select 
                                value={starType} 
                                onChange={(e) => { 
                                    setStarType(e.target.value as TipoEstrella); 
                                    setStarColorOverride(''); 
                                }}
                                className="w-full bg-black/50 border border-slate-600 rounded px-3 py-2 text-sm text-white uppercase focus:ring-accent-amber focus:border-accent-amber"
                            >
                                {starTypes.map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
                            </select>
                        </div>

                        <div className="space-y-4 p-4 bg-black/30 rounded-lg border border-white/5">
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-slate-300 font-mono">
                                    <span>GRANULATION (NOISE)</span>
                                    <span className="text-accent-amber">{granulation.toFixed(1)}</span>
                                </div>
                                <input type="range" min="1.0" max="10.0" step="0.1" value={granulation} onChange={(e) => setGranulation(parseFloat(e.target.value))} className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-accent-amber" />
                            </div>
                            
                            <div className="space-y-2 pt-2 border-t border-white/5">
                                 <label className="block text-xs font-bold text-slate-400 uppercase">Custom Hex Color</label>
                                 <div className="flex gap-2">
                                     <input 
                                        type="color" 
                                        value={starColorOverride || TABLA_ESTRELLAS[starType].colorHex} 
                                        onChange={(e) => setStarColorOverride(e.target.value)}
                                        className="h-8 w-8 bg-transparent border-none cursor-pointer"
                                     />
                                     <input 
                                        type="text" 
                                        value={starColorOverride || TABLA_ESTRELLAS[starType].colorHex} 
                                        onChange={(e) => setStarColorOverride(e.target.value)}
                                        className="flex-1 bg-black/50 border border-slate-600 rounded px-2 text-xs font-mono text-white"
                                     />
                                 </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                         {/* BLACK HOLE CONTROLS */}
                        <div className="space-y-4 p-4 bg-black/30 rounded-lg border border-white/5">
                             <div className="space-y-1">
                                <div className="flex justify-between text-xs text-slate-300 font-mono">
                                    <span>ACCRETION RADIUS</span>
                                    <span className="text-purple-400">{bhDiskScale.toFixed(1)}</span>
                                </div>
                                <input type="range" min="2.5" max="8.0" step="0.1" value={bhDiskScale} onChange={(e) => setBhDiskScale(parseFloat(e.target.value))} className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500" />
                            </div>
                            
                            <div className="space-y-2 pt-2 border-t border-white/5">
                                 <label className="block text-xs font-bold text-slate-400 uppercase">Accretion Color</label>
                                 <div className="flex gap-2">
                                     <input 
                                        type="color" 
                                        value={bhDiskColor} 
                                        onChange={(e) => setBhDiskColor(e.target.value)}
                                        className="h-8 w-8 bg-transparent border-none cursor-pointer"
                                     />
                                     <input 
                                        type="text" 
                                        value={bhDiskColor} 
                                        onChange={(e) => setBhDiskColor(e.target.value)}
                                        className="flex-1 bg-black/50 border border-slate-600 rounded px-2 text-xs font-mono text-white"
                                     />
                                 </div>
                            </div>

                            <div className="p-2 bg-slate-800/50 rounded text-[10px] text-slate-400">
                                <p className="mb-1"><strong>Simulation Active:</strong></p>
                                <ul className="list-disc pl-3 space-y-1">
                                    <li>Space Skipping (Optimized)</li>
                                    <li>Dynamic Doppler Tint</li>
                                    <li>Transparency Support</li>
                                </ul>
                            </div>
                        </div>
                    </>
                )}

                <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Seed</label>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={seed} 
                            onChange={(e) => setSeed(e.target.value)} 
                            className="w-full bg-black/50 border border-slate-600 rounded px-3 py-2 text-sm text-white font-mono" 
                            disabled={!!linkedPlanetName && objectType === 'PLANET'} 
                        />
                        {(!linkedPlanetName || objectType !== 'PLANET') && (
                            <button onClick={() => setSeed(Math.random().toString(36).substring(7))} className="p-2 bg-white/5 text-slate-300 hover:text-accent-cyan rounded border border-slate-600 hover:bg-white/10">
                                <DiceIcon />
                            </button>
                        )}
                    </div>
                </div>
             </div>

             <div className="mt-4 space-y-3 min-w-[280px]">
                <button onClick={handleForceRegenerate} className="w-full py-3 bg-accent-cyan text-space-dark font-bold rounded-md shadow-lg hover:bg-cyan-300 transition-all flex justify-center items-center gap-2 uppercase tracking-wide">
                    {isGenerating ? <span className="animate-spin">⟳</span> : <RefreshIcon />} 
                    <span>{(linkedPlanetName && objectType === 'PLANET') ? "Re-Render" : "New Seed"}</span>
                </button>
                <button onClick={handleAiDescribe} disabled={isAiLoading} className="w-full py-3 bg-purple-600/20 border border-purple-500/50 text-purple-300 font-bold rounded-md shadow-lg hover:bg-purple-600/40 transition-all flex justify-center items-center gap-2 disabled:opacity-50 uppercase tracking-wide">
                    {isAiLoading ? <span className="animate-pulse">Thinking...</span> : <><SparklesIcon /> <span>AI Analyze</span></>}
                </button>
             </div>
        </div>

        {/* 3D VIEWPORT */}
        <div className="flex-1 relative h-full w-full rounded-l-2xl overflow-hidden mx-4 my-4 border border-white/5 shadow-inner bg-black/40">
            <div ref={mountRef} className="absolute inset-0 w-full h-full" />
            
            {/* TOGGLE BUTTON - Z-INDEX INCREASED TO 50 */}
            <button 
                onClick={() => setIsControlsVisible(!isControlsVisible)}
                className="absolute top-4 left-4 z-50 p-2 bg-slate-900/80 text-slate-200 rounded-md border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-md"
                title={isControlsVisible ? "Hide Controls" : "Show Controls"}
            >
                {isControlsVisible ? <EyeOffIcon /> : <EyeIcon />}
            </button>
            
            {/* LINKED INDICATOR OVERLAY */}
            {linkedPlanetName && objectType === 'PLANET' && (
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
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-3 tracking-wider">
                        {objectType === 'PLANET' ? 'Surface Composition' : objectType === 'STAR' ? 'Stellar Telemetry' : 'Singularity Data'}
                    </h4>
                    <div className="space-y-1.5">
                        {Object.entries(biomeStats).map(([name, val]) => (
                            <div key={name} className="flex justify-between text-xs w-48 border-b border-white/5 pb-1 last:border-0">
                                <span className="text-slate-300">{name}</span>
                                <span className={`font-mono ${objectType === 'STAR' ? 'text-accent-amber' : objectType === 'BLACK_HOLE' ? 'text-purple-400' : 'text-accent-cyan'}`}>{val}</span>
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
