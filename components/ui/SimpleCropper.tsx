
import React, { useState, useRef, useEffect } from 'react';

interface SimpleCropperProps {
    imageUrl: string;
    onCancel: () => void;
    onConfirm: (croppedImage: string) => void;
    aspectRatio?: number; // Default 1.0 (Square)
}

// Dimensions of the crop window in pixels (Visual representation)
const CROP_SIZE = 280;

const SimpleCropper: React.FC<SimpleCropperProps> = ({ imageUrl, onCancel, onConfirm, aspectRatio = 1 }) => {
    const [zoom, setZoom] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    
    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const dragStartRef = useRef({ x: 0, y: 0 });
    const offsetStartRef = useRef({ x: 0, y: 0 });

    // Initial Setup: Center and scale image to cover the crop area roughly
    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        setImageLoaded(true);
        // Auto-fit logic could go here if needed, currently defaults to scale 1 which is usually fine
        // but setting a smart min-zoom based on image size vs crop size is good UX.
        const { naturalWidth, naturalHeight } = e.currentTarget;
        const minScale = Math.max(CROP_SIZE / naturalWidth, (CROP_SIZE / aspectRatio) / naturalHeight);
        setZoom(Math.max(minScale, 0.5)); 
    };

    // --- DRAG LOGIC ---
    const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault(); // Prevent default drag behavior of img
        setIsDragging(true);
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
        
        dragStartRef.current = { x: clientX, y: clientY };
        offsetStartRef.current = { ...offset };
    };

    const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDragging) return;
        
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

        const deltaX = clientX - dragStartRef.current.x;
        const deltaY = clientY - dragStartRef.current.y;

        setOffset({
            x: offsetStartRef.current.x + deltaX,
            y: offsetStartRef.current.y + deltaY
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // --- CROP GENERATION ---
    const handleCrop = () => {
        const image = imageRef.current;
        if (!image) return;

        const canvas = document.createElement('canvas');
        // Output resolution (Higher than display for quality)
        const scaleMultiplier = 2; 
        canvas.width = CROP_SIZE * scaleMultiplier;
        canvas.height = (CROP_SIZE / aspectRatio) * scaleMultiplier;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Fill background (for transparency safety)
        ctx.fillStyle = '#0f172a'; // space-dark
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Advanced Draw: Replicate CSS Transform in Canvas Context
        // 1. Move origin to center of canvas
        ctx.translate(canvas.width / 2, canvas.height / 2);
        
        // 2. Apply offset (scaled up by our export multiplier)
        ctx.translate(offset.x * scaleMultiplier, offset.y * scaleMultiplier);
        
        // 3. Apply zoom (scale)
        ctx.scale(zoom * scaleMultiplier, zoom * scaleMultiplier);
        
        // 4. Draw image centered on the new origin
        ctx.drawImage(
            image,
            -image.naturalWidth / 2,
            -image.naturalHeight / 2
        );

        onConfirm(canvas.toDataURL('image/jpeg', 0.9));
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
            <div className="bg-space-mid border border-slate-600 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-lg flex flex-col overflow-hidden">
                
                {/* Header */}
                <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-space-dark/50">
                    <div className="flex flex-col">
                        <h3 className="text-white font-bold uppercase tracking-wider text-sm">Configurar Imagen</h3>
                        <span className="text-[10px] text-accent-cyan">Vista Previa: Ficha de Wiki</span>
                    </div>
                    <button onClick={onCancel} className="text-slate-400 hover:text-white p-2">✕</button>
                </div>

                {/* Editor Area */}
                <div 
                    className="relative w-full h-[400px] bg-[#0a0a0a] overflow-hidden cursor-move touch-none select-none flex items-center justify-center group"
                    ref={containerRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleMouseDown}
                    onTouchMove={handleMouseMove}
                    onTouchEnd={handleMouseUp}
                >
                    {/* Background Grid Pattern for transparency hint */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none" 
                        style={{ 
                            backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', 
                            backgroundSize: '20px 20px' 
                        }} 
                    />

                    {/* The Moveable Image Layer */}
                    <div 
                        className="absolute pointer-events-none origin-center will-change-transform"
                        style={{ 
                            transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                            transition: isDragging ? 'none' : 'transform 0.1s cubic-bezier(0, 0, 0.2, 1)' 
                        }}
                    >
                        <img 
                            ref={imageRef}
                            src={imageUrl} 
                            alt="Source" 
                            draggable={false}
                            onLoad={onImageLoad}
                            className="max-w-none" // Allow image to overflow natural size
                            style={{ display: 'block' }} 
                        />
                    </div>

                    {/* Overlay Mask (Darkens outside) */}
                    <div className="absolute inset-0 pointer-events-none bg-black/70">
                         {/* The "Hole" via clip-path or simply composite layers. 
                             Using CSS mask is cleaner but complex for centered dynamic hole. 
                             We'll use a visual border trick instead for simplicity and robustness. 
                         */}
                    </div>

                    {/* The Visible Crop Area (Wiki Card Simulation) */}
                    {/* This sits ON TOP of the dark overlay but we need to see through it.
                        Actually, easiest way to do "Hole" in React without canvas is using 
                        huge borders on a centered div. */}
                    <div 
                        className="absolute pointer-events-none box-content"
                        style={{
                            width: `${CROP_SIZE}px`,
                            height: `${CROP_SIZE / aspectRatio}px`,
                            // Huge borders create the dark overlay effect, leaving the center transparent
                            borderWidth: '100vmax', 
                            borderColor: 'rgba(0,0,0,0.5)', 
                            borderStyle: 'solid',
                            // Adjust position to be centered
                            margin: 'auto',
                            left: 0, right: 0, top: 0, bottom: 0
                        }}
                    >
                    </div>
                    
                    {/* The "Frame" Decoration (Sits exactly on crop area) */}
                    <div 
                        className="absolute pointer-events-none flex flex-col justify-between p-2"
                        style={{
                            width: `${CROP_SIZE}px`,
                            height: `${CROP_SIZE / aspectRatio}px`,
                            border: '2px solid rgba(6, 182, 212, 0.5)', // Accent Cyan border
                            boxShadow: '0 0 20px rgba(6, 182, 212, 0.2), inset 0 0 20px rgba(0,0,0,0.5)',
                            borderRadius: '0.375rem' // rounded-md
                        }}
                    >
                        {/* Fake Wiki UI Overlay to give context */}
                        <div className="w-full flex justify-between items-start opacity-80">
                             <div className="bg-black/60 backdrop-blur-sm text-[10px] text-white px-2 py-0.5 rounded border border-white/10">
                                 IMG_PREVIEW
                             </div>
                        </div>
                        
                        {/* Center Guide */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 opacity-30">
                            <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white"></div>
                            <div className="absolute left-0 right-0 top-1/2 h-px bg-white"></div>
                        </div>

                        <div className="text-right">
                             <span className="text-[9px] text-accent-cyan uppercase tracking-widest opacity-70">Holo-Capture</span>
                        </div>
                    </div>

                    {/* Drag Instruction Hint */}
                    <div className="absolute bottom-4 bg-black/40 text-white/70 text-xs px-3 py-1 rounded-full pointer-events-none backdrop-blur-sm border border-white/5">
                        Arrastra para encuadrar
                    </div>
                </div>

                {/* Controls */}
                <div className="p-5 bg-space-dark border-t border-slate-700 space-y-4">
                    <div className="flex items-center gap-4">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wide w-12">Zoom</span>
                        <span className="text-xs font-mono text-slate-500 w-8">{(zoom * 100).toFixed(0)}%</span>
                        <input 
                            type="range" 
                            min="0.1" 
                            max="4" 
                            step="0.01" 
                            value={zoom} 
                            onChange={(e) => setZoom(parseFloat(e.target.value))}
                            className="flex-1 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-accent-cyan hover:accent-cyan-300"
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button 
                            onClick={onCancel}
                            className="flex-1 py-2.5 rounded-md border border-slate-600 text-slate-300 hover:bg-white/5 transition-colors text-xs font-bold uppercase tracking-wide"
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={handleCrop}
                            disabled={!imageLoaded}
                            className="flex-1 py-2.5 rounded-md bg-accent-cyan text-space-dark hover:bg-cyan-400 transition-all text-xs font-bold uppercase tracking-wide shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Confirmar Imagen
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SimpleCropper;
