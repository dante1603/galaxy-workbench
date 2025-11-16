import React, { useRef, useEffect, useState } from 'react';
import type { ObjetoOrbital, CargaUtilPlaneta } from '../types';

interface ProceduralPlanetProps {
  planetObject: ObjetoOrbital;
}

/**
 * A component that displays a procedurally generated planet texture on a canvas.
 * It uses a Web Worker to offload the expensive texture generation from the main UI thread,
 * preventing the UI from freezing while a planet is being rendered.
 */
const ProceduralPlanet: React.FC<ProceduralPlanetProps> = ({ planetObject }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // A ref to hold the Web Worker instance.
  const workerRef = useRef<Worker | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);

  if (planetObject.tipo !== 'PLANETA') return null;
  
  const planeta = planetObject.cargaUtil as CargaUtilPlaneta;

  // This effect runs only once when the component mounts to initialize the worker.
  useEffect(() => {
    // Initialize the worker.
    workerRef.current = new Worker('/components/planet.worker.ts', { type: 'module' });

    // Define how to handle messages received from the worker.
    workerRef.current.onmessage = (event: MessageEvent<ImageData | { error: string }>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Check if the worker sent back an error.
      if ((event.data as any).error) {
        console.error('Error from planet worker:', (event.data as any).error);
        setIsGenerating(false);
        // Display an error state on the canvas.
        ctx.fillStyle = '#991b1b'; // bg-red-800
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.font = 'bold 14px sans-serif';
        ctx.fillText('Error', canvas.width / 2, canvas.height / 2);
        return;
      }

      // If no error, the worker sent back the generated ImageData.
      // We draw this data onto the canvas.
      const imageData = event.data as ImageData;
      ctx.putImageData(imageData, 0, 0);
      setIsGenerating(false);
    };

    // Cleanup function: Terminate the worker when the component unmounts to free up resources.
    return () => {
      workerRef.current?.terminate();
    };
  }, []); // Empty dependency array ensures this runs only once.

  // This effect runs whenever the planet data changes, triggering a new texture generation.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !workerRef.current) return;
    
    // Clear canvas and show a loading state before starting a new generation.
    const ctx = canvas.getContext('2d');
    if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setIsGenerating(true);

    // Send the necessary data to the worker to start the texture generation process.
    workerRef.current.postMessage({
      planet: planeta,
      orbitObjectId: planetObject.id, // The ID is used as a seed for the noise generator.
      width: canvas.width,
      height: canvas.height,
    });
  }, [planeta, planetObject.id]); // Re-run this effect when the planet data or its ID changes.

  return (
    <div className="relative flex-shrink-0 w-24 h-24">
      <canvas
        ref={canvasRef}
        width={96}
        height={96}
        className="rounded-full bg-space-dark border-2 border-slate-700/50 group-hover:scale-105 transition-all duration-300 w-full h-full"
        aria-label={`Imagen generada proceduralmente de ${planeta.tituloTipoPlaneta}`}
      />
      {isGenerating && (
        <div className="absolute inset-0 flex items-center justify-center bg-space-dark/70 rounded-full transition-opacity duration-300">
            <svg className="animate-spin h-8 w-8 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </div>
      )}
    </div>
  );
};

export default ProceduralPlanet;