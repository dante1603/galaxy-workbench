
/**
 * @file planetGeometry.ts
 * @description Core logic for generating 3D displaced planet geometry (Voxel/LowPoly style).
 * Shared between PlanetVoxelLab and the Web Worker.
 */

import * as THREE from 'three';
import { SimplexNoise } from './simplexNoise';
import type { CargaUtilPlaneta, TipoPlaneta } from '../types';

export interface PlanetVisualConfig {
    seaLevel: number;
    roughness: number; // Normalized 0.0 to 0.7
    hueShift?: number; // 0 to 360 degrees
    baseColor: number[]; // [r, g, b] 0-255
    colors: {
        deepOcean: number[];
        midOcean: number[];
        shallowOcean: number[];
        beach: number[];
        plains: number[];
        forest: number[];
        mountain: number[];
        peak: number[];
    }
}

// --- COLOR UTILS ---

/**
 * Converts an RGB color array [0-255, 0-255, 0-255] to HSL [0-1, 0-1, 0-1]
 */
const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h, s, l];
};

/**
 * Converts an HSL color array [0-1, 0-1, 0-1] to RGB [0-255, 0-255, 0-255]
 */
const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
    let r, g, b;
    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};

/**
 * Shifts the hue of an RGB color by a given degree.
 */
const shiftColorHue = (rgb: number[], degrees: number): number[] => {
    if (degrees === 0) return rgb;
    const [h, s, l] = rgbToHsl(rgb[0], rgb[1], rgb[2]);
    let newH = (h + degrees / 360) % 1;
    if (newH < 0) newH += 1;
    return hslToRgb(newH, s, l);
};

// Define presets to map game types to visual styles
export const BIOME_PRESETS: Record<string, PlanetVisualConfig> = {
  JUNGLA: {
    seaLevel: 0.5,
    roughness: 0.6,
    baseColor: [34, 96, 33],
    colors: {
      deepOcean: [0, 0, 46],
      midOcean: [0, 66, 126],
      shallowOcean: [0, 142, 174],
      beach: [217, 226, 180],
      plains: [85, 142, 58],
      forest: [34, 96, 33],
      mountain: [115, 105, 97],
      peak: [255, 255, 255],
    }
  },
  DESERTICO: {
    seaLevel: 0.1,
    roughness: 0.4,
    baseColor: [222, 184, 135],
    colors: {
      deepOcean: [93, 41, 6],
      midOcean: [160, 82, 45],
      shallowOcean: [205, 133, 63],
      beach: [244, 164, 96],
      plains: [222, 184, 135],
      forest: [210, 105, 30],
      mountain: [139, 69, 19],
      peak: [128, 0, 0],
    }
  },
  VOLCANICO: {
    seaLevel: 0.3,
    roughness: 0.7,
    baseColor: [51, 0, 0],
    colors: {
      deepOcean: [51, 0, 0],
      midOcean: [128, 0, 0],
      shallowOcean: [255, 69, 0],
      beach: [47, 79, 79],
      plains: [26, 26, 26],
      forest: [51, 51, 51],
      mountain: [0, 0, 0],
      peak: [85, 85, 85],
    }
  },
  ACUATICO: {
    seaLevel: 0.85,
    roughness: 0.2,
    baseColor: [0, 102, 153],
    colors: {
      deepOcean: [0, 26, 51],
      midOcean: [0, 51, 102],
      shallowOcean: [0, 102, 153],
      beach: [0, 153, 204],
      plains: [51, 204, 255],
      forest: [32, 178, 170],
      mountain: [0, 128, 128],
      peak: [160, 219, 142],
    }
  },
  GIGANTE_GASEOSO: {
    // For Gas Giants: 
    // seaLevel = Band Frequency (0.0 to 1.0)
    // roughness = Turbulence (0.0 to 1.0)
    seaLevel: 0.5, 
    roughness: 0.3,
    baseColor: [75, 0, 130],
    colors: {
       deepOcean: [40, 0, 70], // Darkest Band
       midOcean: [75, 0, 130], // Dark Band
       shallowOcean: [100, 20, 160], // Mid Band
       beach: [138, 43, 226], // Highlight Band
       plains: [147, 112, 219], // Light Band
       forest: [186, 85, 211], // Lighter Band
       mountain: [221, 160, 221], // Pale Band
       peak: [255, 200, 255], // Brightest
    }
  },
  // Fallback
  TERRAN: {
    seaLevel: 0.5,
    roughness: 0.5,
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
 * Calculates the visual configuration for a planet based on its game data.
 * This logic is extracted so it can be used by the visualizer and the voxel lab.
 */
export const resolvePlanetVisuals = (planet: CargaUtilPlaneta): PlanetVisualConfig => {
    const preset = BIOME_PRESETS[planet.tipoPlaneta] || BIOME_PRESETS.TERRAN;
    
    // Clone to avoid mutation
    const config = JSON.parse(JSON.stringify(preset));

    // 1. Calculate Sea Level (Humidity & Type influence)
    if (planet.tipoPlaneta === 'ACUATICO') {
        config.seaLevel = 0.85 + (Math.random() * 0.1);
    } else if (planet.tipoPlaneta === 'DESERTICO') {
        config.seaLevel = 0.1;
    } else if (planet.tipoPlaneta === 'GIGANTE_GASEOSO') {
        // For Gas Giants, this is Band Frequency.
        // Default around 0.5, vary slightly by seed/random if desired.
        config.seaLevel = 0.5; 
    } else {
        const humidAvg = (planet.rangoHumedad[0] + planet.rangoHumedad[1]) / 2;
        config.seaLevel = Math.max(0.2, Math.min(0.7, humidAvg)); 
    }

    // 2. Calculate Roughness (Gravity & Type influence)
    if (planet.tipoPlaneta === 'GIGANTE_GASEOSO') {
        // For Gas Giants, this is Turbulence.
        config.roughness = 0.3; 
    } else {
        // High gravity = flatter terrain
        if (planet.gravedad === 'high') config.roughness *= 0.7;
        if (planet.gravedad === 'low') config.roughness *= 1.3;
        if (planet.tipoPlaneta === 'VOLCANICO') config.roughness *= 1.2;
    }
    
    // Clamp roughness to strict 0-0.7 range (or 0-1 for gas giants)
    config.roughness = Math.max(0, Math.min(planet.tipoPlaneta === 'GIGANTE_GASEOSO' ? 1.0 : 0.7, config.roughness));

    return config;
};

/**
 * Generates position and color buffers for a 3D displaced planet.
 * Accepts optional overrides for Voxel Lab tweaking.
 * 
 * FIX: Now converts geometry to non-indexed (triangle soup) to fix polygon rendering issues.
 */
export const generatePlanetGeometryData = (
    planet: CargaUtilPlaneta,
    seed: string,
    resolution: number = 128,
    overrides?: Partial<PlanetVisualConfig>
): { positions: Float32Array, colors: Float32Array, stats: Record<string, number> } => {
    
    const noise = new SimplexNoise(seed);
    
    // Get base config derived from game data
    const baseConfig = resolvePlanetVisuals(planet);
    
    // Apply overrides (e.g. from Voxel Lab sliders)
    const config: PlanetVisualConfig = { ...baseConfig, ...overrides };
    
    // 1. Create Indexed Sphere Geometry first to manipulate shared vertices efficiently
    const geometry = new THREE.SphereGeometry(1.0, resolution, resolution);
    const posAttr = geometry.attributes.position;
    const count = posAttr.count;
    
    // Prepare color buffer for indexed geometry
    const colorData = new Float32Array(count * 3);
    
    const _v = new THREE.Vector3();
    const frequency = planet.tipoPlaneta === 'GIGANTE_GASEOSO' ? 3.0 : 1.5; 
    
    const biomeCounts: Record<string, number> = {
        'Deep Ocean': 0, 'Mid Ocean': 0, 'Shallow': 0, 'Beach': 0,
        'Plains': 0, 'Forest': 0, 'Mountain': 0, 'Peak': 0
    };

    // --- PRE-CALCULATE PALETTE (Apply Hue Shift) ---
    // We do this once per generation to avoid heavy HSL conversion per-vertex
    const hueShift = config.hueShift || 0;
    const palette = {
        deepOcean: shiftColorHue(config.colors.deepOcean, hueShift),
        midOcean: shiftColorHue(config.colors.midOcean, hueShift),
        shallowOcean: shiftColorHue(config.colors.shallowOcean, hueShift),
        beach: shiftColorHue(config.colors.beach, hueShift),
        plains: shiftColorHue(config.colors.plains, hueShift),
        forest: shiftColorHue(config.colors.forest, hueShift),
        mountain: shiftColorHue(config.colors.mountain, hueShift),
        peak: shiftColorHue(config.colors.peak, hueShift),
    };

    // 2. Modify Vertices & Assign Colors (Shared)
    for (let i = 0; i < count; i++) {
        _v.fromBufferAttribute(posAttr, i);
        
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
        noiseVal = (noiseVal / maxAmp + 1) * 0.5; // Normalize 0..1

        // Displacement Logic
        let displacement = 0;
        if (planet.tipoPlaneta !== 'GIGANTE_GASEOSO') {
            // We use the roughness value (0-0.7) as intensity now.
            displacement = (noiseVal - config.seaLevel) * config.roughness;
            if (noiseVal < config.seaLevel) {
                displacement = 0; // Flatten oceans
            }
        }

        const newPos = _v.clone().normalize().multiplyScalar(1.0 + displacement);
        posAttr.setXYZ(i, newPos.x, newPos.y, newPos.z);

        // Coloring Logic
        let color = [0,0,0];
        
        if (planet.tipoPlaneta === 'GIGANTE_GASEOSO') {
            // --- GAS GIANT LOGIC ---
            // seaLevel mapped to Band Frequency (Density)
            // roughness mapped to Turbulence (Distortion)
            const bandFreq = (config.seaLevel * 20) + 2; // 2 to 22 bands roughly
            const turbulence = config.roughness * 0.8; // 0 to 0.8

            // Calculate Y position with noise distortion
            const distortedY = newPos.y + (noiseVal - 0.5) * turbulence;
            
            // Use Sine wave to create bands
            // Map -1..1 to 0..1 approx for palette lookup
            const bandVal = Math.sin(distortedY * bandFreq); // -1 to 1
            const absBand = (bandVal + 1) * 0.5; // 0 to 1

            // Interpolate between palette colors based on band value
            // We use a gradient of the 8 palette colors
            if (absBand < 0.125) color = palette.deepOcean;
            else if (absBand < 0.25) color = palette.midOcean;
            else if (absBand < 0.375) color = palette.shallowOcean;
            else if (absBand < 0.5) color = palette.beach;
            else if (absBand < 0.625) color = palette.plains;
            else if (absBand < 0.75) color = palette.forest;
            else if (absBand < 0.875) color = palette.mountain;
            else color = palette.peak;

            // Simple stats for gas giants (just counting primary bands)
            biomeCounts['Plains']++; 

        } else {
            // --- ROCKY PLANET LOGIC ---
            if (noiseVal < config.seaLevel * 0.4) { color = palette.deepOcean; biomeCounts['Deep Ocean']++; }
            else if (noiseVal < config.seaLevel * 0.8) { color = palette.midOcean; biomeCounts['Mid Ocean']++; }
            else if (noiseVal < config.seaLevel) { color = palette.shallowOcean; biomeCounts['Shallow']++; }
            else if (noiseVal < config.seaLevel + 0.05) { color = palette.beach; biomeCounts['Beach']++; }
            else if (noiseVal < config.seaLevel + 0.3) { color = palette.plains; biomeCounts['Plains']++; }
            else if (noiseVal < config.seaLevel + 0.6) { color = palette.forest; biomeCounts['Forest']++; }
            else if (noiseVal < config.seaLevel + 0.8) { color = palette.mountain; biomeCounts['Mountain']++; }
            else { color = palette.peak; biomeCounts['Peak']++; }
        }

        // RGB 0-255 to 0.0-1.0
        colorData[i * 3] = color[0] / 255;
        colorData[i * 3 + 1] = color[1] / 255;
        colorData[i * 3 + 2] = color[2] / 255;
    }

    // Add color attribute to indexed geometry
    geometry.setAttribute('color', new THREE.BufferAttribute(colorData, 3));

    // 3. Explode to Non-Indexed Geometry (Triangle Soup)
    // This ensures every face has unique vertices, fixing polygon rendering issues
    // and enabling correct flat shading.
    const nonIndexedGeometry = geometry.toNonIndexed();
    
    // Compute normals for the new face structure
    nonIndexedGeometry.computeVertexNormals();

    // Extract data arrays
    const positions = nonIndexedGeometry.attributes.position.array as Float32Array;
    const colors = nonIndexedGeometry.attributes.color.array as Float32Array;

    // Clean up
    geometry.dispose();
    nonIndexedGeometry.dispose();

    return { positions, colors, stats: biomeCounts };
};
