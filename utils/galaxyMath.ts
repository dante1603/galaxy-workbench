
/**
 * @file galaxyMath.ts
 * @description Contains the mathematical logic for generating procedural spiral galaxies.
 * Shared between the main thread (for types) and the Web Worker (for calculations).
 */

export interface GalaxyParams {
    arms: number;
    armSpread: number;
    coreRadius: number;
    galaxyRadius: number;
    twist: number;
    randomness: number;
    bulge: number;
    verticalSpread: number;
    colorCore: string; // Hex
    colorArm: string; // Hex
}

export interface GalaxyDataBuffers {
    positions: Float32Array;
    colors: Float32Array;
}

export const hexToRgbNormalized = (hex: string): [number, number, number] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16) / 255,
        parseInt(result[2], 16) / 255,
        parseInt(result[3], 16) / 255
    ] : [1, 1, 1];
};

export const calculateGalaxyData = (params: GalaxyParams, particleCount: number): GalaxyDataBuffers => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    const cCore = hexToRgbNormalized(params.colorCore);
    const cArm = hexToRgbNormalized(params.colorArm);

    for (let i = 0; i < particleCount; i++) {
        const r = Math.pow(Math.random(), params.bulge) * params.galaxyRadius;
        const arm = i % params.arms;
        const baseAngle = (arm / params.arms) * Math.PI * 2;
        
        const theta = baseAngle + r * params.twist + (Math.random() - 0.5) * params.armSpread;

        let x = Math.cos(theta) * r;
        let z = Math.sin(theta) * r; 
        let y = (Math.random() - 0.5) * params.verticalSpread * r; 

        x += (Math.random() - 0.5) * params.randomness * r;
        z += (Math.random() - 0.5) * params.randomness * r;
        y += (Math.random() - 0.5) * params.randomness * r * 0.5;

        if (r < params.coreRadius) {
            x *= 0.5;
            z *= 0.5;
            y *= 0.5;
        }

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        const t = Math.min(1, r / params.galaxyRadius);
        colors[i * 3] = cCore[0] * (1 - t) + cArm[0] * t;
        colors[i * 3 + 1] = cCore[1] * (1 - t) + cArm[1] * t;
        colors[i * 3 + 2] = cCore[2] * (1 - t) + cArm[2] * t;
    }

    return { positions, colors };
};

export const generateRandomParams = (): GalaxyParams => {
    const randomColor = () => '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    return {
        arms: Math.floor(Math.random() * 7) + 2, 
        armSpread: Number((Math.random() * 1.8).toFixed(2)),
        coreRadius: Number((Math.random() * 1.5 + 0.1).toFixed(2)),
        galaxyRadius: Number((Math.random() * 5 + 2).toFixed(2)),
        twist: Number((Math.random() * 5).toFixed(2)),
        randomness: Number((Math.random() * 0.8).toFixed(2)),
        bulge: Number((Math.random() * 0.8 + 0.1).toFixed(2)),
        verticalSpread: Number((Math.random() * 0.5).toFixed(2)),
        colorCore: randomColor(),
        colorArm: randomColor(),
    };
};
