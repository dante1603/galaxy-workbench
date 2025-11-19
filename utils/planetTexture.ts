/**
 * @file planetTexture.ts
 * @description Contains the core logic for procedurally generating planet surface textures.
 * This code is designed to be run in a Web Worker to avoid blocking the main UI thread.
 * It uses Simplex noise to create natural-looking terrain and applies color palettes based on
 * the planet's characteristics.
 */

import { SimplexNoise } from './simplexNoise';
import type { CargaUtilPlaneta, TipoPlaneta } from '../types';

type Color = [number, number, number];

// --- HELPER FUNCTIONS ---

/**
 * Linearly interpolates between two numbers.
 * @param a The start value.
 * @param b The end value.
 * @param t The interpolation factor (0.0 to 1.0).
 * @returns The interpolated value.
 */
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Linearly interpolates between two colors in RGB space.
 * @param color1 The start color.
 * @param color2 The end color.
 * @param t The interpolation factor.
 * @returns The interpolated color.
 */
const lerpColor = (color1: Color, color2: Color, t: number): Color => [
    lerp(color1[0], color2[0], t),
    lerp(color1[1], color2[1], t),
    lerp(color1[2], color2[2], t),
];

// --- MAIN GENERATION LOGIC ---

/**
 * Generates a raw buffer representing a planet's texture.
 * Returns a Uint8ClampedArray which is transferable between workers and main thread,
 * unlike ImageData which is DOM-specific.
 */
export const generatePlanetTextureBuffer = (
    planet: CargaUtilPlaneta, 
    orbitObjectId: string, 
    width: number, 
    height: number
): Uint8ClampedArray => {
    // Initialize the noise generator with the planet's unique ID to ensure deterministic generation.
    const noise = new SimplexNoise(orbitObjectId);

    // Define color palettes for different planet types.
    const palettes: Record<TipoPlaneta, Record<string, Color>> = {
      JUNGLA: { deepWater: [20, 80, 120], shallowWater: [60, 140, 180], lowLand: [60, 120, 60], highLand: [100, 140, 80], mountain: [140, 120, 100], snow: [240, 240, 245] },
      DESERTICO: { deepWater: [100, 90, 80], shallowWater: [140, 120, 100], lowLand: [210, 180, 140], highLand: [180, 150, 120], mountain: [140, 110, 90], snow: [240, 230, 220] },
      VOLCANICO: { deepWater: [40, 10, 10], shallowWater: [80, 20, 15], lowLand: [80, 70, 70], highLand: [120, 90, 90], mountain: [180, 50, 40], snow: [220, 210, 210] },
      ACUATICO: { deepWater: [10, 40, 90], shallowWater: [34, 211, 238], lowLand: [210, 190, 160], highLand: [110, 100, 90], mountain: [80, 70, 65], snow: [220, 235, 255] },
      GIGANTE_GASEOSO: { band1: [210, 190, 160], band2: [180, 150, 120], band3: [120, 90, 90], band4: [220, 210, 200] },
    };
    
    const palette = palettes[planet.tipoPlaneta];

    /**
     * Fractional Brownian Motion (fbm).
     */
    const fbm = (x: number, y: number, z: number, octaves: number, persistence: number, lacunarity: number) => {
        let total = 0;
        let frequency = 1;
        let amplitude = 1;
        let maxValue = 0;
        for (let i = 0; i < octaves; i++) {
            total += noise.noise3D(x * frequency, y * frequency, z * frequency) * amplitude;
            maxValue += amplitude;
            amplitude *= persistence;
            frequency *= lacunarity;
        }
        return total / maxValue;
    };
    
    // Create raw buffer instead of ImageData
    const buffer = new Uint8ClampedArray(width * height * 4);
    const avgHumidity = (planet.rangoHumedad[0] + planet.rangoHumedad[1]) / 2;

    for (let j = 0; j < height; j++) {
      for (let i = 0; i < width; i++) {
        const lon = (i / width) * 2 * Math.PI;
        const lat = (j / height) * Math.PI; 

        const x = Math.sin(lat) * Math.cos(lon);
        const z = Math.sin(lat) * Math.sin(lon);
        const y = Math.cos(lat);

        let color: Color;

        if (planet.tipoPlaneta === 'GIGANTE_GASEOSO') {
            const bandNoise = fbm(y * 4, z * 2, x * 2, 3, 0.5, 2.0) * 0.5 + 0.5;
            const swirlNoise = fbm(x * 8, y * 8, z * 8, 4, 0.4, 2.2) * 0.1;
            const yPos = y + swirlNoise;
              
            const c1 = lerpColor(palette.band1, palette.band2, Math.sin(yPos * Math.PI * 3 + bandNoise) * 0.5 + 0.5);
            const c2 = lerpColor(palette.band3, palette.band4, Math.cos(yPos * Math.PI * 2 + bandNoise) * 0.5 + 0.5);
            color = lerpColor(c1, c2, Math.sin(yPos * Math.PI * 5) * 0.5 + 0.5);
        } else { 
            const seaLevel = (avgHumidity * 0.5) - 0.25;
            const iceLine = lerp(0.8, 0.4, planet.composicionGlobal.hielo);
              
            const continentVal = fbm(x * 1.5, y * 1.5, z * 1.5, 3, 0.5, 2.0);
            const elevationVal = fbm(x * 4, y * 4, z * 4, 6, 0.5, 2.0);

            if (continentVal < seaLevel) {
              const depth = (seaLevel - continentVal) * 2;
              const t = Math.max(0, 1 - depth);
              color = lerpColor(palette.deepWater, palette.shallowWater, t);
            } else {
              const elevation = (continentVal - seaLevel + (elevationVal * 0.2)) / (1.0 - seaLevel);
              if (elevation > iceLine) {
                color = lerpColor(palette.mountain, palette.snow, (elevation - iceLine) / (1.0 - iceLine));
              } else if (elevation > 0.6) {
                color = lerpColor(palette.highLand, palette.mountain, (elevation - 0.6) / (iceLine - 0.6));
              } else if (elevation > 0.2) {
                color = lerpColor(palette.lowLand, palette.highLand, (elevation - 0.2) / 0.4);
              } else {
                color = palette.lowLand;
              }
            }
        }
          
        const idx = (j * width + i) * 4;
        buffer[idx] = color[0];
        buffer[idx + 1] = color[1];
        buffer[idx + 2] = color[2];
        buffer[idx + 3] = 255;
      }
    }
    
    return buffer;
};