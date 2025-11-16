/// <reference lib="webworker" />
/**
 * @file planet.worker.ts
 * @description This is a Web Worker script responsible for generating planet textures.
 * It listens for messages from the main thread containing planet data, runs the
 * computationally intensive `generatePlanetImageData` function, and then posts
 * the resulting ImageData back to the main thread. This prevents the main UI
 * from freezing during texture generation.
 */
import { generatePlanetImageData } from '../utils/planetTexture.ts';
import type { CargaUtilPlaneta } from '../types.ts';

self.onmessage = (e: MessageEvent<{ planet: CargaUtilPlaneta, orbitObjectId: string, width: number, height: number }>) => {
    try {
        const { planet, orbitObjectId, width, height } = e.data;
        
        // Call the unified, computationally heavy generation function.
        const imageData = generatePlanetImageData(planet, orbitObjectId, width, height);
        
        // Send the result back to the main thread.
        // The second argument is a list of "transferable" objects. Transferring the
        // ArrayBuffer is much more efficient than copying it.
        postMessage(imageData, [imageData.data.buffer]);
    } catch (error) {
        console.error('Error in planet.worker.ts:', error);
        // If an error occurs, send an error message back to the main thread.
        // The error object itself might not be cloneable, so send a message string.
        const errorMessage = error instanceof Error ? error.message : String(error);
        postMessage({ error: `Failed to generate planet texture: ${errorMessage}` });
    }
};