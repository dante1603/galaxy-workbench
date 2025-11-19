
import { calculateGalaxyData, generateRandomParams } from '../utils/galaxyMath';

// This worker handles the heavy lifting of calculating 20k+ particle positions
// and colors for the next galaxy, preventing main-thread jank during animations.

self.onmessage = (e: MessageEvent) => {
  const { particleCount, type, specificParams } = e.data;

  try {
    let params;
    
    // If specific params are sent (e.g. user edited sliders), use those.
    // Otherwise, generate random ones for a hyperjump.
    if (type === 'GENERATE_RANDOM') {
        params = generateRandomParams();
    } else {
        params = specificParams;
    }

    const data = calculateGalaxyData(params, particleCount);
    
    // We transfer the buffers to keep it zero-copy and fast
    (self as any).postMessage(
      { 
        success: true, 
        data,
        params
      }, 
      [data.positions.buffer, data.colors.buffer]
    );
  } catch (error) {
    console.error("Galaxy Worker error:", error);
    (self as any).postMessage({ success: false, error: String(error) });
  }
};
