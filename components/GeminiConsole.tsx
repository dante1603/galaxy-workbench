
import React, { useState, useCallback, useEffect, useRef } from 'react';
import type { Sistema, Estrella, ObjetoOrbital, CuerpoEspecial, ObjetoPlaneta, ObjetoCinturonAsteroides } from '../types';

// Icons used internally
const TerminalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>;

interface GeminiConsoleProps {
  globalViewMode: 'GALAXY' | 'SYSTEM';
  system: Sistema | undefined;
  selection: Estrella | ObjetoOrbital | CuerpoEspecial | null;
  customMessage?: string | null;
}

const GeminiConsole: React.FC<GeminiConsoleProps> = ({ globalViewMode, system, selection, customMessage }) => {
    const [logs, setLogs] = useState<string[]>([]);
    const [typingLog, setTypingLog] = useState<string>('');
    const endRef = useRef<HTMLDivElement>(null);
    
    // Function to add a log entry (keeping only the last few)
    const addLog = useCallback((text: string) => {
        setLogs(prev => {
            const newLogs = [...prev, text];
            return newLogs.slice(-8); // Keep last 8 lines to fit the small window
        });
    }, []);

    // Simulate typing effect for the latest message
    const typeWriter = useCallback((text: string) => {
        setTypingLog('');
        let i = 0;
        const speed = 15; // ms
        const interval = setInterval(() => {
            if (i < text.length) {
                setTypingLog(prev => prev + text.charAt(i));
                i++;
            } else {
                clearInterval(interval);
                addLog(text);
                setTypingLog('');
            }
        }, speed);
    }, [addLog]);

    // --- CONTEXT AWARENESS ---
    
    // 1. Monitor View Mode (Galaxy vs System)
    useEffect(() => {
        if (globalViewMode === 'GALAXY') {
            typeWriter("[NAV] Entering Interstellar Space. Long-range sensors online.");
        } else if (globalViewMode === 'SYSTEM' && system) {
             typeWriter(`[WARP] Arriving at ${system.nombre}. Threat Assessment: ${system.nivelPeligro}/10.`);
        }
    }, [globalViewMode, system, typeWriter]); // Use IDs to avoid re-triggering on object mutations

    // 2. Monitor Selections
    useEffect(() => {
        if (selection) {
            let logText = "";
            if (selection.tipo === 'ESTRELLA') {
                const s = selection as Estrella;
                logText = `[TARGET] STAR: ${s.nombreProvisional} // Class ${s.claseEstelar} // Temp: ${s.temperaturaSuperficial}.`;
            } else if (selection.tipo === 'PLANETA') {
                const p = (selection as ObjetoPlaneta).cargaUtil; 
                logText = `[TARGET] PLANET: ${p.tituloTipoPlaneta} // Atm: ${p.tipoAtmosfera} // Bio-Scan: ${p.densidadVida}.`;
            } else if (selection.tipo === 'CINTURON_ASTEROIDES') {
                const a = (selection as ObjetoCinturonAsteroides).cargaUtil;
                 logText = `[TARGET] ASTEROID BELT // Density: ${a.densidad} // Comp: ${a.composicion}.`;
            } else if (selection.tipo === 'AGUJERO_NEGRO') {
                 logText = `[WARNING] GRAVITATIONAL SINGULARITY DETECTED. EVENT HORIZON PROXIMITY ALERT.`;
            } else if (selection.tipo === 'PULSAR') {
                 logText = `[TARGET] PULSAR // Magnetic Field: Critical // Radiation: Extreme.`;
            }
            
            if (logText) typeWriter(logText);
        }
    }, [selection, typeWriter]); // Trigger only when ID changes

    // 3. Monitor Custom Messages (e.g. Hyperjumps)
    useEffect(() => {
        if (customMessage) {
            typeWriter(customMessage);
        }
    }, [customMessage, typeWriter]);


    // Auto-scroll
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs, typingLog]);


    return (
        <div className="w-full h-full flex flex-col bg-black/80 border-t border-accent-cyan/30 backdrop-blur-md font-mono text-xs p-2 shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-2 text-accent-cyan/70 border-b border-white/5 pb-1 mb-1">
                <TerminalIcon />
                <span className="uppercase tracking-widest font-bold">Gemini Core // System Log</span>
            </div>
            <div className="flex-1 overflow-hidden relative p-1">
                <div className="absolute inset-0 flex flex-col justify-end">
                    {logs.map((log, i) => (
                        <p key={i} className={`mb-1 ${
                            log.includes('[WARNING]') ? 'text-red-400' : 
                            log.includes('[TARGET]') ? 'text-accent-cyan' : 
                            log.includes('[HYPERDRIVE]') ? 'text-accent-amber font-bold' :
                            'text-slate-400'
                        }`}>
                            {log}
                        </p>
                    ))}
                    {typingLog && <p className="text-white animate-pulse">{typingLog}█</p>}
                    <div ref={endRef}></div>
                </div>
            </div>
            <div className="mt-1 flex items-center gap-2 border-t border-white/5 pt-1">
                <span className="text-accent-cyan animate-pulse">❯</span>
                <input 
                    type="text" 
                    placeholder="Awaiting command..." 
                    className="bg-transparent border-none outline-none text-white w-full placeholder-slate-600 focus:ring-0"
                    disabled
                />
            </div>
        </div>
    );
};

export default GeminiConsole;
