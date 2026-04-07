
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

/**
 * Converts a Hex string to an RGB array [0-255].
 */
const hexToRgb = (hex: string): Color => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : [255, 255, 255];
};

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

/**
 * Generates a procedural star texture buffer.
 * Simulates a photosphere using noise turbulence and a heat gradient based on the star's base color.
 * @param frequency Controls the scale of the granulation (noise frequency). Default is 2.5.
 */
export const generateStarTextureBuffer = (
    baseColorHex: string,
    seed: string,
    width: number,
    height: number,
    frequency: number = 2.5
): Uint8ClampedArray => {
    const noise = new SimplexNoise(seed);
    const buffer = new Uint8ClampedArray(width * height * 4);

    const baseRGB = hexToRgb(baseColorHex);
    
    // Construct a palette: Darker/Redder (Spots) -> Base -> Lighter/White (Energy)
    // Dark Spot Color (Cooler regions)
    const spotRGB: Color = [
        Math.max(0, baseRGB[0] * 0.4),
        Math.max(0, baseRGB[1] * 0.2), // Decrease Green/Blue more to shift redder for cooler spots
        Math.max(0, baseRGB[2] * 0.2)
    ];
    
    // Hot/Bright Color
    const brightRGB: Color = [
        Math.min(255, baseRGB[0] * 1.5 + 50),
        Math.min(255, baseRGB[1] * 1.5 + 50),
        Math.min(255, baseRGB[2] * 1.5 + 50)
    ];

    const fbm = (x: number, y: number, z: number) => {
        // Use the provided frequency parameter
        let total = 0;
        let freq = frequency;
        let amp = 1.0;
        let max = 0;
        for(let i=0; i<4; i++) {
            total += noise.noise3D(x*freq, y*freq, z*freq) * amp;
            max += amp;
            amp *= 0.5;
            freq *= 2.0;
        }
        return total / max;
    };

    for (let j = 0; j < height; j++) {
        for (let i = 0; i < width; i++) {
            const lon = (i / width) * 2 * Math.PI;
            const lat = (j / height) * Math.PI; 
            const x = Math.sin(lat) * Math.cos(lon);
            const z = Math.sin(lat) * Math.sin(lon);
            const y = Math.cos(lat);

            // Domain warping for plasma/turbulence effect
            // We use the noise value of P to offset the noise lookup of Q
            const q = fbm(x + 0.0, y + 0.0, z + 0.0);
            const r = fbm(x + q + 1.2, y + q + 2.4, z + q + 4.8);
            
            // Main texture value
            let val = fbm(x + 4.0 * r, y + 4.0 * r, z + 4.0 * r);
            
            // Normalize roughly to 0..1
            val = val * 0.5 + 0.5;
            
            // Contrast stretch
            val = Math.pow(val, 1.5); 

            let finalColor: Color;
            
            if (val < 0.4) {
                // Blend Dark Spot -> Base
                const t = val / 0.4;
                finalColor = lerpColor(spotRGB, baseRGB, t);
            } else {
                // Blend Base -> Bright
                const t = (val - 0.4) / 0.6;
                finalColor = lerpColor(baseRGB, brightRGB, t);
            }

            const idx = (j * width + i) * 4;
            buffer[idx] = finalColor[0];
            buffer[idx + 1] = finalColor[1];
            buffer[idx + 2] = finalColor[2];
            buffer[idx + 3] = 255; // Fully opaque
        }
    }

    return buffer;
};

/**
 * Generates a procedural texture for an accretion disk with temperature gradients.
 * Creates radial streaks with spiral distortion and simulates hot inner ring vs cooler outer ring.
 * @param swirl Fixed distortion factor.
 */
export const generateAccretionTextureBuffer = (
    baseColorHex: string,
    seed: string,
    width: number,
    height: number,
    swirl: number = 12.0
): Uint8ClampedArray => {
    const noise = new SimplexNoise(seed);
    const buffer = new Uint8ClampedArray(width * height * 4);
    const baseRGB = hexToRgb(baseColorHex);

    // Thermal Palette
    // Inner Edge: Blinding White (Extreme friction/heat)
    const hotCoreRGB: Color = [255, 255, 255]; 
    // Outer Edge: Base color fading to dark/redshift (Cooling)
    const coldEdgeRGB: Color = [
        Math.max(0, baseRGB[0] * 0.2), 
        Math.max(0, baseRGB[1] * 0.1), 
        Math.max(0, baseRGB[2] * 0.1)
    ];

    const centerX = width / 2;
    const centerY = height / 2;
    
    // Helper for smoothstep interpolation to avoid hard edges
    const smoothstep = (min: number, max: number, value: number) => {
        const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
        return x * x * (3 - 2 * x);
    };

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const dx = x - centerX;
            const dy = y - centerY;
            const radius = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx);
            
            const maxRadius = width / 2;
            const normalizedR = radius / maxRadius; // 0 at center, 1 at edge

            if (radius > maxRadius) {
                const idx = (y * width + x) * 4;
                buffer[idx+3] = 0; // Transparent outside circle
                continue;
            }

            // Spiral Coordinate Distortion
            // We twist the angle based on distance to center to create the swirl effect
            const spiralAngle = angle + (normalizedR) * swirl;
            
            // High frequency noise for "streaks" of matter
            // Stretching noise along the spiral path
            let n = noise.noise3D(Math.cos(spiralAngle) * 8.0, Math.sin(spiralAngle) * 8.0, normalizedR * 2.0);
            
            // Secondary low-freq noise for "clumps" density
            let clumps = noise.noise3D(Math.cos(spiralAngle) * 3.0, Math.sin(spiralAngle) * 3.0, normalizedR * 5.0);

            let noiseFactor = (n + 1) * 0.5; // 0..1
            noiseFactor *= (clumps + 1.2) * 0.5; // Modulate brightness density

            // Soft falloff at edges
            const falloff = Math.sin(normalizedR * Math.PI); 
            noiseFactor *= Math.pow(falloff, 0.2);

            let finalColor: Color;
            let alpha = 255;

            // Temperature Gradient Logic (Doppler/Thermal simulation)
            // 0.0 - 0.35 : Hot Zone (White -> Base)
            // 0.35 - 1.0 : Cool Zone (Base -> Dark)
            
            if (normalizedR < 0.35) {
                // Hot Inner Zone
                const t = normalizedR / 0.35; // 0 to 1
                // Interpolate White -> Base Color
                finalColor = lerpColor(hotCoreRGB, baseRGB, t + (noiseFactor * 0.2)); 
            } else {
                // Cooling Outer Zone
                const t = (normalizedR - 0.35) / 0.65;
                // Interpolate Base Color -> Cold/Dark
                finalColor = lerpColor(baseRGB, coldEdgeRGB, t);
                
                // Apply noise variation to intensity
                finalColor = [
                    finalColor[0] * (0.8 + noiseFactor * 0.4),
                    finalColor[1] * (0.8 + noiseFactor * 0.4),
                    finalColor[2] * (0.8 + noiseFactor * 0.4)
                ];
            }

            const idx = (y * width + x) * 4;
            buffer[idx] = Math.min(255, Math.max(0, finalColor[0]));
            buffer[idx + 1] = Math.min(255, Math.max(0, finalColor[1]));
            buffer[idx + 2] = Math.min(255, Math.max(0, finalColor[2]));
            
            // --- Soft Alpha Fading for "Blur" Effect ---
            // Use smoothstep to create a wide, soft falloff at the edges instead of hard cuts.
            
            // Outer Fade: Starts at 0.85, fully transparent at 1.0
            const outerFade = 1.0 - smoothstep(0.8, 1.0, normalizedR);
            
            // Inner Fade: Fully transparent at 0.0, fully opaque at 0.2
            const innerFade = smoothstep(0.0, 0.2, normalizedR);
            
            // Combine fades
            alpha = Math.floor(255 * outerFade * innerFade);
            
            buffer[idx + 3] = alpha;
        }
    }

    return buffer;
};
