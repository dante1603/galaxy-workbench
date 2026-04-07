
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import type { CargaUtilPlaneta } from '../types';
import { generatePlanetGeometryData, resolvePlanetVisuals } from '../utils/planetGeometry';
import { generatePlanetTextureBuffer } from '../utils/planetTexture';

interface PlanetThumbnailProps {
    planet: CargaUtilPlaneta;
    id: string;
    size?: number; // Pixel size (e.g. 80 for w-20)
}

/**
 * A lightweight 3D renderer that generates a single static frame of the procedural planet.
 * Optimized for use in lists (low polygon count, single render, aggressive cleanup).
 */
const PlanetThumbnail: React.FC<PlanetThumbnailProps> = ({ planet, id, size = 80 }) => {
    const mountRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if (!mountRef.current) return;
        const container = mountRef.current;

        // 1. Setup Basic Scene
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
        camera.position.set(0, 0, 2.8); // Zoom level
        
        // Optimization: Disable antialias for thumbnails if performance drags, but strictly keeps it pretty here
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true });
        renderer.setSize(size, size);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        // Render High-Dynamic Rangeish look
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        
        container.appendChild(renderer.domElement);

        // 2. Lighting (Dramatic side lighting)
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);
        
        const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
        dirLight.position.set(5, 3, 5); // Top-right sun
        scene.add(dirLight);

        const backLight = new THREE.DirectionalLight(0x5555ff, 0.5);
        backLight.position.set(-5, -2, -5); // Rim light
        scene.add(backLight);

        let mesh: THREE.Mesh;
        let texture: THREE.CanvasTexture | undefined;

        // 3. Geometry Generation (Async simulation to not block UI)
        const generate = async () => {
            const isGasGiant = planet.tipoPlaneta === 'GIGANTE_GASEOSO';
            const resolution = 32; // Lower resolution for thumbnails (vs 96/128 in Voxel Lab)

            if (isGasGiant) {
                // --- GAS GIANT: Sphere + Texture ---
                const buffer = generatePlanetTextureBuffer(planet, id, 128, 64); // Lower res texture
                const canvas = document.createElement('canvas');
                canvas.width = 128; canvas.height = 64;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    const imgData = new ImageData(new Uint8ClampedArray(buffer), 128, 64);
                    ctx.putImageData(imgData, 0, 0);
                }
                texture = new THREE.CanvasTexture(canvas);
                texture.colorSpace = THREE.SRGBColorSpace;

                const geo = new THREE.SphereGeometry(1, 32, 32);
                const mat = new THREE.MeshStandardMaterial({ 
                    map: texture, 
                    roughness: 0.4,
                    metalness: 0.1
                });
                mesh = new THREE.Mesh(geo, mat);

                // Add subtle atmosphere ring
                const atmoGeo = new THREE.SphereGeometry(1.05, 32, 32);
                const atmoMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.1 });
                const atmo = new THREE.Mesh(atmoGeo, atmoMat);
                mesh.add(atmo);

            } else {
                // --- ROCKY PLANET: Displaced Geometry ---
                // Reuse the Voxel Lab logic
                const { positions, colors } = generatePlanetGeometryData(planet, id, resolution);
                
                const geo = new THREE.BufferGeometry();
                geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
                geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
                geo.computeVertexNormals();

                const mat = new THREE.MeshStandardMaterial({
                    vertexColors: true,
                    roughness: planet.tipoPlaneta === 'ACUATICO' ? 0.3 : 0.8,
                    metalness: 0.1,
                    flatShading: true 
                });
                mesh = new THREE.Mesh(geo, mat);
            }

            // Rotate slightly for a nice angle
            mesh.rotation.y = Math.PI / 6;
            mesh.rotation.x = Math.PI / 12;
            scene.add(mesh);

            // 4. Render Static Frame
            renderer.render(scene, camera);
        };

        generate();

        // Cleanup
        return () => {
            if (container && renderer.domElement && container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
            
            renderer.dispose();
            if (mesh) {
                mesh.geometry.dispose();
                if (Array.isArray(mesh.material)) {
                    mesh.material.forEach(m => m.dispose());
                } else {
                    mesh.material.dispose();
                }
            }
            if (texture) texture.dispose();
        };
    }, [planet, id, size]);

    return (
        <div 
            ref={mountRef} 
            className="w-full h-full rounded-full overflow-hidden shadow-inner relative bg-black/20"
            title={`${planet.tituloTipoPlaneta} (${planet.tipoPlaneta})`}
        >
            {/* Gloss overlay for the "icon" feel */}
            <div className="absolute inset-0 rounded-full pointer-events-none bg-gradient-to-tr from-black/20 via-transparent to-white/10 z-10"></div>
        </div>
    );
};

export default PlanetThumbnail;
