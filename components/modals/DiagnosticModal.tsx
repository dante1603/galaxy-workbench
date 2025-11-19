import React, { useEffect, useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import type { Sistema } from '../../types';

interface DiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
  system: Sistema;
}

const DiagnosticModal: React.FC<DiagnosticModalProps> = ({ isOpen, onClose, system }) => {
  const [report, setReport] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && !report) {
      generateReport();
    }
  }, [isOpen]);

  const generateReport = async () => {
    setLoading(true);
    setReport('');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Prepare a simplified version of the system data to save tokens and focus the AI
      const systemSummary = {
        nombre: system.nombre,
        tipo: system.cuerpoCentral.tipo,
        cuerpoCentral: {
             tipoBase: (system.cuerpoCentral as any).tipoBase,
             descripcion: (system.cuerpoCentral as any).nombreProvisional || (system.cuerpoCentral as any).nombre,
             peligros: (system.cuerpoCentral as any).peligros,
             atractivos: (system.cuerpoCentral as any).atractivosSistema
        },
        orbitas: system.orbitas.map(o => ({
            distanciaUA: o.a_UA,
            objeto: o.objetos[0]?.tipo === 'PLANETA' 
                ? { 
                    tipo: (o.objetos[0] as any).cargaUtil.tipoPlaneta,
                    biomas: (o.objetos[0] as any).cargaUtil.biomas.map((b: any) => b.nombre),
                    vida: (o.objetos[0] as any).cargaUtil.densidadVida
                  }
                : 'Cinturón de Asteroides'
        }))
      };

      const prompt = `
        Act as a ship's advanced AI computer. Run a full diagnostic scan on the following Star System data:
        ${JSON.stringify(systemSummary, null, 2)}

        Generate a "System Diagnostic Report" (in plain text with clear headers).
        
        Required Sections:
        1. 🔭 STELLAR ANALYSIS: Brief evaluation of the central body and its stability.
        2. ⚠️ HAZARD DETECTION: Analyze orbital hazards, environmental threats, or radiation levels.
        3. 💎 RESOURCE POTENTIAL: Identify valuable mining or biological opportunities based on the planets/belts.
        4. 🧬 HABITABILITY INDEX: Calculate a theoretical score (0-100%) for colonization viability.
        5. 🏁 STRATEGIC RECOMMENDATION: A one-sentence verdict for the captain.

        Tone: Technical, concise, slightly robotic but helpful.
      `;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      
      setReport(response.text || 'Error: Empty response from main computer.');
    } catch (e) {
      setReport('SYSTEM ERROR: Communication array offline. Unable to query AI core.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-space-mid border border-accent-cyan/50 rounded-lg w-full max-w-2xl shadow-[0_0_50px_rgba(6,182,212,0.15)] flex flex-col max-h-[85vh] overflow-hidden" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-accent-cyan/30 bg-space-dark/80">
            <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${loading ? 'bg-amber-500 animate-ping' : 'bg-accent-cyan'}`}></div>
                <h3 className="font-mono font-bold tracking-widest text-accent-cyan text-lg">SYSTEM DIAGNOSTIC TOOL // v2.4</h3>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors text-xl">&times;</button>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto font-mono text-sm leading-relaxed text-slate-300 bg-black/20 custom-scrollbar">
             {loading ? (
                 <div className="flex flex-col items-center justify-center py-12 space-y-6">
                     <div className="relative w-16 h-16">
                        <div className="absolute inset-0 border-4 border-accent-cyan/30 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-accent-cyan border-t-transparent rounded-full animate-spin"></div>
                     </div>
                     <div className="text-center space-y-1">
                        <p className="animate-pulse text-accent-cyan font-bold">SCANNING TELEMETRY...</p>
                        <p className="text-xs text-slate-500">Calculating orbital trajectories...</p>
                     </div>
                 </div>
             ) : (
                 <div className="whitespace-pre-wrap animate-fade-in selection:bg-accent-cyan/30 selection:text-white">
                    {report}
                 </div>
             )}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-slate-700 bg-space-dark/50 flex justify-between items-center">
             <div className="text-xs text-slate-500 font-mono">
                TARGET: {system.nombre.toUpperCase()}
             </div>
             <div className="flex gap-3">
                {!loading && (
                    <button onClick={generateReport} className="px-4 py-2 rounded border border-slate-600 hover:border-white text-slate-300 hover:text-white text-xs font-bold uppercase transition-colors">
                        Rerun Scan
                    </button>
                )}
                <button onClick={onClose} className="px-6 py-2 rounded bg-accent-cyan/10 border border-accent-cyan text-accent-cyan hover:bg-accent-cyan hover:text-space-dark transition-all font-bold uppercase text-xs tracking-wider">
                    Close Log
                </button>
             </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticModal;