
import { generatePlanetTextureBuffer } from '../utils/planetTexture';
import { generatePlanetGeometryData } from '../utils/planetGeometry';
import type { CargaUtilPlaneta } from '../types';

// This worker listens for generation requests.
// Mode 1: 'TEXTURE' - Returns a texture buffer (for Gas Giants).
// Mode 2: 'GEOMETRY' - Returns position and color buffers (for Rocky Planets/Voxel Lab style).

self.onmessage = (e: MessageEvent) => {
  const { type, planetPayload, objectId, width, height, resolution } = e.data as {
    type: 'TEXTURE' | 'GEOMETRY';
    planetPayload: CargaUtilPlaneta;
    objectId: string;
    width?: number;
    height?: number;
    resolution?: number;
  };

  try {
    if (type === 'GEOMETRY') {
        const { positions, colors } = generatePlanetGeometryData(planetPayload, objectId, resolution || 128);
        
        (self as any).postMessage(
            {
                success: true,
                type: 'GEOMETRY',
                objectId,
                positions,
                colors
            },
            [positions.buffer, colors.buffer]
        );
    } else {
        // Default to TEXTURE
        const w = width || 256;
        const h = height || 128;
        const buffer = generatePlanetTextureBuffer(planetPayload, objectId, w, h);
        
        (self as any).postMessage(
          { 
            success: true, 
            type: 'TEXTURE',
            objectId, 
            buffer, 
            width: w, 
            height: h 
          }, 
          [buffer.buffer]
        );
    }

  } catch (error) {
    console.error("Worker generation error:", error);
    (self as any).postMessage({ success: false, objectId, error: String(error) });
  }
};