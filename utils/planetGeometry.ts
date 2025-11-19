
/**
 * @file planetGeometry.ts
 * @description Core logic for generating 3D displaced planet geometry (Voxel/LowPoly style).
 * Shared between PlanetVoxelLab and the Web Worker.
 */

import * as THREE from 'three';
import { SimplexNoise } from './simplexNoise';
import type { CargaUtilPlaneta, TipoPlaneta } from '../types';

// Define presets to map game types to visual styles
// Colors are defined as [r, g, b] normalized 0-1 ideally, but here we use 0-255 for easier mapping then normalize later.
export const BIOME_PRESETS: Record<string, any> = {
  JUNGLA: {
    seaLevel: 0.5,
    roughness: 1.5,
    baseColor: [34, 96, 33], // Forest Green
    colors: {
      deepOcean: [0, 0, 46],       // 0x00002E
      midOcean: [0, 66, 126],      // 0x00427E
      shallowOcean: [0, 142, 174], // 0x008EAE
      beach: [217, 226, 180],      // 0xD9E2B4
      plains: [85, 142, 58],       // 0x558E3A
      forest: [34, 96, 33],        // 0x226021
      mountain: [115, 105, 97],    // 0x736961
      peak: [255, 255, 255],       // 0xFFFFFF
    }
  },
  DESERTICO: {
    seaLevel: 0.1,
    roughness: 1.2,
    baseColor: [222, 184, 135], // Tan
    colors: {
      deepOcean: [93, 41, 6],      // 0x5D2906
      midOcean: [160, 82, 45],     // 0xA0522D
      shallowOcean: [205, 133, 63],// 0xCD853F
      beach: [244, 164, 96],       // 0xF4A460
      plains: [222, 184, 135],     // 0xDEB887
      forest: [210, 105, 30],      // 0xD2691E
      mountain: [139, 69, 19],     // 0x8B4513
      peak: [128, 0, 0],           // 0x800000
    }
  },
  VOLCANICO: {
    seaLevel: 0.3,
    roughness: 2.0,
    baseColor: [51, 0, 0], // Dark Red
    colors: {
      deepOcean: [51, 0, 0],       // 0x330000
      midOcean: [128, 0, 0],       // 0x800000
      shallowOcean: [255, 69, 0],  // 0xFF4500 (Lava)
      beach: [47, 79, 79],         // 0x2F4F4F (Ash)
      plains: [26, 26, 26],        // 0x1a1a1a (Basalt)
      forest: [51, 51, 51],        // 0x333333
      mountain: [0, 0, 0],         // 0x000000
      peak: [85, 85, 85],          // 0x555555
    }
  },
  ACUATICO: {
    seaLevel: 0.85,
    roughness: 0.8,
    baseColor: [0, 102, 153], // Blue
    colors: {
      deepOcean: [0, 26, 51],      // 0x001a33
      midOcean: [0, 51, 102],      // 0x003366
      shallowOcean: [0, 102, 153], // 0x006699
      beach: [0, 153, 204],        // 0x0099cc
      plains: [51, 204, 255],      // 0x33ccff
      forest: [32, 178, 170],      // 0x20b2aa
      mountain: [0, 128, 128],     // 0x008080
      peak: [160, 219, 142],       // 0xa0db8e
    }
  },
  // Fallback / Default
  TERRAN: {
    seaLevel: 0.5,
    roughness: 1.0,
    baseColor: [100, 160, 80],
    colors: {
      deepOcean: [30, 30, 80],
      midOcean: [50, 50, 120],
      shallowOcean: [80, 100, 180],
      beach: [210, 200, 160],
      plains: [100, 160, 80],
      forest: [40, 100, 40],
      mountain: [120, 110, 100],
      peak: [240, 240, 255],
    }
  }
};

/**
 * Returns a normalized RGB color array [r, g, b] for the initial planet mesh
 */
export const getPlanetBaseColor = (type: TipoPlaneta): [number, number, number] => {
    const preset = BIOME_PRESETS[type] || BIOME_PRESETS.TERRAN;
    const c = preset.baseColor || [128, 128, 128];
    return [c[0]/255, c[1]/255, c[2]/255];
};

/**
 * Generates position and color buffers for a 3D displaced planet.
 */
export const generatePlanetGeometryData = (
    planet: CargaUtilPlaneta,
    seed: string,
    resolution: number = 128 // Standard resolution for system view
): { positions: Float32Array, colors: Float32Array } => {
    
    const noise = new SimplexNoise(seed);
    const preset = BIOME_PRESETS[planet.tipoPlaneta] || BIOME_PRESETS.TERRAN;
    
    // Create a temporary SphereGeometry to get the vertices
    // We use Three.js logic here but we operate on buffers.
    const geometry = new THREE.SphereGeometry(1.0, resolution, resolution);
    const posAttr = geometry.attributes.position;
    const count = posAttr.count;
    
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    const _v = new THREE.Vector3();
    const frequency = 1.5; // Increased frequency slightly for more detail at system scale
    
    for (let i = 0; i < count; i++) {
        _v.fromBufferAttribute(posAttr, i);
        
        let noiseVal = 0;
        let amp = 1.0;
        let freq = frequency;
        let maxAmp = 0;

        // 4 Octaves of FBM Noise
        for(let o=0; o<4; o++) {
             noiseVal += noise.noise3D(_v.x * freq, _v.y * freq, _v.z * freq) * amp;
             maxAmp += amp;
             amp *= 0.5;
             freq *= 2.0;
        }
        noiseVal = (noiseVal / maxAmp + 1) * 0.5; // Normalize 0..1

        // Displacement Logic
        // Increased multiplier to 0.5 so features are unmistakably 3D
        let displacement = (noiseVal - preset.seaLevel) * preset.roughness * 0.5;
        
        // FLATTEN OCEANS: Ensure water is perfectly spherical (or slightly below "sea level")
        if (noiseVal < preset.seaLevel) {
            displacement = 0; 
        }

        const newPos = _v.clone().normalize().multiplyScalar(1.0 + displacement);
        positions[i * 3] = newPos.x;
        positions[i * 3 + 1] = newPos.y;
        positions[i * 3 + 2] = newPos.z;

        // Coloring Logic
        let color = [0,0,0];
        const c = preset.colors;
        
        if (noiseVal < preset.seaLevel * 0.4) color = c.deepOcean;
        else if (noiseVal < preset.seaLevel * 0.8) color = c.midOcean;
        else if (noiseVal < preset.seaLevel) color = c.shallowOcean;
        else if (noiseVal < preset.seaLevel + 0.05) color = c.beach;
        else if (noiseVal < preset.seaLevel + 0.3) color = c.plains;
        else if (noiseVal < preset.seaLevel + 0.6) color = c.forest;
        else if (noiseVal < preset.seaLevel + 0.8) color = c.mountain;
        else color = c.peak;

        // RGB 0-255 to 0.0-1.0
        colors[i * 3] = color[0] / 255;
        colors[i * 3 + 1] = color[1] / 255;
        colors[i * 3 + 2] = color[2] / 255;
    }

    geometry.dispose(); // Clean up standard geometry
    return { positions, colors };
};
