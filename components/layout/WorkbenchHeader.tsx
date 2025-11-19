
import React, { useCallback } from 'react';
import IconButton from '../IconButton';
import { useWorkbenchStore, Tool } from '../../state/workbenchStore';

// --- Local Icons ---
const CopyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>;
const DownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>;
const ResetIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"></polyline><polyline points="23 20 23 14 17 14"></polyline><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path></svg>;
const BookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const GlobeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>;
const GridIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>;
const ManifestoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>;
const CubeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
const BackArrowIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>;

interface WorkbenchHeaderProps {
    onOpenWiki: () => void;
    onShowNotification: (msg: string) => void;
    viewModeLocal: 'cards' | '3d';
    setViewModeLocal: (mode: 'cards' | '3d') => void;
    onOpenSysGenModal: () => void;
}

const WorkbenchHeader: React.FC<WorkbenchHeaderProps> = ({ 
    onOpenWiki, 
    onShowNotification,
    viewModeLocal,
    setViewModeLocal,
    onOpenSysGenModal
}) => {
    const { 
        systems, 
        activeTool, 
        setActiveTool, 
        viewMode: globalViewMode, 
        returnToGalaxy, 
        resetSystems 
    } = useWorkbenchStore();

    // --- ACTION HANDLERS ---

    const handleReset = useCallback(() => {
        resetSystems();
        onShowNotification('All systems cleared.');
    }, [resetSystems, onShowNotification]);

    const handleCopyJson = useCallback(() => {
        if (systems.length === 0) {
            onShowNotification('Nothing to copy.');
            return;
        }
        const json = JSON.stringify(systems, null, 2);
        navigator.clipboard.writeText(json)
            .then(() => onShowNotification('JSON copied to clipboard!'))
            .catch(() => onShowNotification('Failed to copy JSON.'));
    }, [systems, onShowNotification]);

    const handleDownloadJson = useCallback(() => {
        if (systems.length === 0) {
            onShowNotification('Nothing to download.');
            return;
        }
        const json = JSON.stringify(systems, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `galaxy_workbench_systems_${new Date().toISOString()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        onShowNotification('JSON download started.');
    }, [systems, onShowNotification]);

    const handleDownloadManifesto = useCallback(() => {
        const content = `
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ODYSSEY PROJECT: MASTER MANIFESTO</title>
<style>
    body { background-color: #0f172a; color: #e2e8f0; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; padding: 2rem; max-width: 900px; margin: 0 auto; }
    h1 { color: #06b6d4; border-bottom: 2px solid #1e293b; padding-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.05em; }
    h2 { color: #38bdf8; margin-top: 2.5rem; border-left: 4px solid #06b6d4; padding-left: 1rem; }
    h3 { color: #cbd5e1; margin-top: 1.5rem; font-weight: 600; }
    ul { list-style-type: none; padding-left: 0; }
    li { margin-bottom: 0.5rem; padding-left: 1.5rem; position: relative; }
    li::before { content: "•"; color: #06b6d4; font-weight: bold; position: absolute; left: 0; }
    strong { color: #ffffff; font-weight: 700; }
    code { font-family: 'Courier New', Courier, monospace; background-color: #1e293b; padding: 0.2rem 0.4rem; border-radius: 4px; color: #f59e0b; font-size: 0.9em; }
    .container { background-color: #1e293b50; padding: 2rem; border-radius: 8px; border: 1px solid #334155; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
    .footer { margin-top: 4rem; font-size: 0.8rem; text-align: center; color: #64748b; border-top: 1px solid #1e293b; padding-top: 1rem; }
    .accent { color: #f59e0b; }
</style>
</head>
<body>
    <div class="container">
        <h1>Galaxy Workbench: Manifiesto Maestro del Proyecto Odyssey</h1>
        
        <p>Este documento establece la visión total, los principios rectores y el papel de la IA en el desarrollo de <strong>Odyssey</strong>.</p>

        <h2>1. Visión General</h2>
        <p>Odyssey es un simulador de galaxias vivas tipo <strong>Sandbox Voxel</strong>, jugado desde la perspectiva de un parásito consciente.</p>
        <ul>
            <li><strong>Soft Sci-Fi + Fantasía:</strong> Mezclamos tecnología avanzada con misticismo y biología exótica (estilo <em>Star Wars</em> o <em>Dragon Ball</em>). Admitimos poderes y energías vitales siempre que tengan coherencia interna.</li>
            <li><strong>Mundo Voxel Esférico:</strong> Generamos planetas esféricos completos y sistemas solares, no mundos planos infinitos.</li>
            <li><strong>El Parásito:</strong> La interfaz de usuario es diegética; eres una entidad que hackea y analiza biología y tecnología.</li>
        </ul>

        <h2>2. Arquitectura Micro ↔ Macro</h2>
        <p>Odyssey opera como un continuo interconectado de escalas:</p>
        <ul>
            <li><strong>Galaxia:</strong> Distribución procedural de estrellas, facciones y rutas.</li>
            <li><strong>Sistemas:</strong> Tipos de estrellas, órbitas y zonas habitables dinámicas.</li>
            <li><strong>Planetas:</strong> Geología voxel modificable, climatología realista y mapas de recursos.</li>
            <li><strong>Biomas:</strong> Reglas ecológicas, flora y minerales específicos.</li>
            <li><strong>Entidades:</strong> Sistema modular (ECS) para fauna y NPCs reactivos.</li>
        </ul>

        <h2>3. Mecánicas Nucleares</h2>
        <ul>
            <li><strong>Control Parasitario:</strong> Toma de cuerpos alienígenas como avatares (ej: Caracoles Solares, Pangolines).</li>
            <li><strong>Cristales:</strong> Tecnología central basada en elementos (Fuego, Hielo, Gravedad, Electricidad).</li>
            <li><strong>Construcción Modular:</strong> Naves, bases y equipamiento con progresión industrial.</li>
            <li><strong>Ecosistemas Reactivos:</strong> Colapso trófico, eventos climáticos y adaptación de la fauna.</li>
        </ul>

        <h2>4. Rol de la IA</h2>
        <p>La IA actúa como un <strong>Motor de Contenido y Narrativa</strong>.</p>
        <ul>
            <li><strong>Generar Datos, NO Reglas:</strong> La IA rellena las bases de datos (JSON), no inventa la lógica del motor.</li>
            <li><strong>Determinismo:</strong> Respetar siempre la semilla (Seed) generada.</li>
            <li><strong>Lore Rico:</strong> Crear descripciones técnicas pero poéticas.</li>
            <li><strong>Coherencia:</strong> Mantener la lógica biológica incluso en criaturas fantásticas.</li>
        </ul>

        <div class="footer">
            Documento Maestro Generado por Galaxy Workbench Core
        </div>
    </div>
</body>
</html>
        `;
        
        const blob = new Blob([content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Odyssey_Master_Manifesto.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        onShowNotification('Project Manifesto downloaded.');
    }, [onShowNotification]);

    return (
        <header className="pointer-events-auto p-4 flex justify-between items-start max-w-full">
            {/* Left: Identity Panel */}
            <div className="flex flex-col bg-slate-950/80 backdrop-blur-md border border-white/10 p-3 rounded-tr-2xl rounded-bl-xl shadow-[0_0_15px_rgba(0,0,0,0.5)] flex-shrink-0 mr-2">
                <h1 className="text-xl font-bold text-white tracking-widest uppercase font-mono flex items-center gap-2">
                    <span className="text-accent-cyan">❖</span> <span className="hidden sm:inline">Galaxy Workbench</span><span className="sm:hidden">GW</span>
                </h1>
                <div className="flex items-center gap-2 text-[10px] font-mono text-accent-cyan/80 mt-1">
                    <span className="bg-accent-cyan/10 px-1 rounded">SYS: ONLINE</span>
                    <span className="text-slate-500">|</span>
                    <span>BUILD v0.9</span>
                </div>
                {activeTool === 'PLANET_VOXEL_LAB' && (
                     <div className="mt-2 text-xs font-bold text-accent-amber border-t border-white/5 pt-1">
                        ⚠ VOXEL LAB ACTIVE
                     </div>
                )}
            </div>

            {/* Right: Control Deck */}
            <div className="bg-slate-950/80 backdrop-blur-md border border-white/10 p-2 rounded-full shadow-lg max-w-[calc(100vw-160px)] sm:max-w-none overflow-hidden">
              <div className="flex items-center gap-3 overflow-x-auto px-2 custom-scrollbar no-scrollbar">
                 {/* Navigation Actions */}
                 {globalViewMode === 'SYSTEM' && activeTool === 'SYSTEM_GENERATOR' && (
                   <>
                    <div className="flex-shrink-0">
                      <IconButton onClick={returnToGalaxy} label="Volver a la Galaxia">
                          <BackArrowIcon />
                      </IconButton>
                    </div>
                    <div className="h-6 w-px bg-white/10 flex-shrink-0"></div>
                   </>
                 )}

                 {activeTool === 'SYSTEM_GENERATOR' && (
                  <>
                    <div className="flex items-center gap-1 flex-shrink-0">
                        <IconButton onClick={onOpenSysGenModal} label="Create New System">
                          <PlusIcon />
                        </IconButton>
                        <IconButton onClick={() => setViewModeLocal(viewModeLocal === 'cards' ? '3d' : 'cards')} label={viewModeLocal === 'cards' ? 'Switch to 3D View' : 'Switch to Card View'}>
                          {viewModeLocal === 'cards' ? <GlobeIcon /> : <GridIcon />}
                        </IconButton>
                        <IconButton onClick={handleDownloadManifesto} label="Download Project Manifesto">
                          <ManifestoIcon />
                        </IconButton>
                    </div>
                    <div className="h-6 w-px bg-white/10 flex-shrink-0"></div>
                  </>
                )}
                
                <div className="flex items-center gap-1 flex-shrink-0">
                  <IconButton 
                    onClick={() => setActiveTool(activeTool === 'PLANET_VOXEL_LAB' ? 'SYSTEM_GENERATOR' : 'PLANET_VOXEL_LAB')} 
                    label={activeTool === 'PLANET_VOXEL_LAB' ? "Exit Voxel Lab" : "Open Planet Voxel Lab"}
                  >
                    <CubeIcon />
                  </IconButton>

                  <div className="h-6 w-px bg-white/10 flex-shrink-0"></div>

                  <IconButton onClick={onOpenWiki} label="Open Glossary">
                    <BookIcon />
                  </IconButton>
                  <IconButton onClick={handleCopyJson} label="Copy All Systems JSON">
                    <CopyIcon />
                  </IconButton>
                  <IconButton onClick={handleDownloadJson} label="Download All Systems JSON">
                    <DownloadIcon />
                  </IconButton>
                  <IconButton onClick={handleReset} label="Reset All Systems">
                    <ResetIcon />
                  </IconButton>
                </div>
              </div>
            </div>
        </header>
    );
};

export default WorkbenchHeader;
