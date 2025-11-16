import React, { useRef } from 'react';
import type { Jugador, Fauna, Planta, Mineral, Material, ReinoAnimal, Bioma, ArquetipoCristal, TipoCristal, CategoriaBiome, Dieta, TamanoFauna, OrigenMaterial, EspecieInteligente, Arma, Herramienta, Efecto, TipoEfecto, GameEntity } from '../../types';

// --- CONSTANTS ---
const CRYSTAL_COLORS: Record<TipoCristal, string> = {
  FUEGO: '#ef4444',
  ELECTRICO: '#f59e0b',
  HIELO: '#38bdf8',
  MAGICO: '#a855f7',
  LUZ: '#f1f5f9',
  GRAVEDAD: '#475569',
  RADIOACTIVO: '#4ade80',
};

const BIOME_CATEGORY_COLORS: Record<CategoriaBiome, string> = {
  DESIERTO: 'bg-amber-800/50 text-amber-300 border-amber-600/70',
  MONTAÑA: 'bg-stone-700/50 text-stone-300 border-stone-500/70',
  BOSQUE: 'bg-green-800/50 text-green-300 border-green-600/70',
  JUNGLA: 'bg-emerald-800/50 text-emerald-300 border-emerald-600/70',
  PANTANO: 'bg-lime-900/50 text-lime-300 border-lime-700/70',
  TUNDRA: 'bg-sky-800/50 text-sky-200 border-sky-600/70',
  VOLCANICO: 'bg-red-900/50 text-red-300 border-red-700/70',
  INOSPITO: 'bg-slate-800/50 text-slate-300 border-slate-600/70',
  SUBTERRANEO: 'bg-purple-900/50 text-purple-300 border-purple-700/70',
  LECHO_MARINO: 'bg-blue-900/50 text-blue-300 border-blue-700/70',
  PLAYA: 'bg-yellow-800/50 text-yellow-200 border-yellow-600/70',
  ACANTILADO: 'bg-gray-700/50 text-gray-300 border-gray-500/70',
  OCEANO_ABIERTO: 'bg-cyan-800/50 text-cyan-200 border-cyan-600/70',
};

const DIET_COLORS: Record<Dieta, string> = {
  carnivoro: 'bg-red-800/50 text-red-300 border-red-600/70',
  herbivoro: 'bg-green-800/50 text-green-300 border-green-600/70',
  omnivoro: 'bg-amber-800/50 text-amber-300 border-amber-600/70',
  carronero: 'bg-stone-700/50 text-stone-300 border-stone-500/70',
};

const SIZE_COLORS: Record<TamanoFauna, string> = {
  diminuto: 'bg-teal-800/50 text-teal-200 border-teal-600/70',
  pequeno: 'bg-sky-800/50 text-sky-200 border-sky-600/70',
  medio: 'bg-indigo-800/50 text-indigo-200 border-indigo-600/70',
  grande: 'bg-purple-800/50 text-purple-200 border-purple-600/70',
  muy_grande: 'bg-fuchsia-800/50 text-fuchsia-200 border-fuchsia-600/70',
  colosal: 'bg-rose-800/50 text-rose-200 border-rose-600/70',
};

const ORIGIN_COLORS: Record<OrigenMaterial, string> = {
  vegetal: 'bg-green-800/50 text-green-300 border-green-600/70',
  animal: 'bg-orange-800/50 text-orange-300 border-orange-600/70',
  mineral: 'bg-sky-800/50 text-sky-300 border-sky-600/70',
};

const EFFECT_TYPE_COLORS: Record<TipoEfecto, string> = {
  BUFF: 'bg-green-800/50 text-green-300 border-green-600/70',
  DEBUFF: 'bg-red-800/50 text-red-300 border-red-600/70',
  NEUTRAL: 'bg-slate-700/50 text-slate-300 border-slate-500/70',
};

// --- HELPER ICONS & COMPONENTS ---
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;

const StatItem: React.FC<{ label: string; value: string | number; className?: string }> = ({ label, value, className = '' }) => (
  <div className={`flex justify-between items-center text-sm py-1.5 border-b border-slate-700/50 ${className}`}>
    <span className="text-slate-400">{label}</span>
    <span className="font-mono text-slate-300 capitalize">{typeof value === 'string' ? value.replace(/_/g, ' ') : value}</span>
  </div>
);

const KingdomBadge: React.FC<{ kingdom: ReinoAnimal }> = ({ kingdom }) => {
  const kingdomStyles: Record<ReinoAnimal, string> = {
    mamifero: 'bg-orange-800/50 text-orange-300 border-orange-600/70',
    dinosaurio_aviano: 'bg-sky-800/50 text-sky-300 border-sky-600/70',
    dinosaurio_reptiloide: 'bg-emerald-800/50 text-emerald-300 border-emerald-600/70',
    artropodo: 'bg-purple-800/50 text-purple-300 border-purple-600/70',
    pez: 'bg-blue-800/50 text-blue-300 border-blue-600/70',
    anfibio: 'bg-lime-800/50 text-lime-300 border-lime-600/70',
    molusco: 'bg-indigo-800/50 text-indigo-300 border-indigo-600/70',
    constructo_silicio: 'bg-gray-700/50 text-gray-200 border-gray-500/70',
    fungoide: 'bg-teal-800/50 text-teal-200 border-teal-600/70'
  };
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${kingdomStyles[kingdom] || kingdomStyles['constructo_silicio']} capitalize`}>
      {kingdom.replace(/_/g, ' ')}
    </span>
  );
};

const Tag: React.FC<{ text: string; className: string, subtext?: string }> = ({ text, className, subtext }) => (
  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border capitalize flex items-center ${className}`}>
    {text.replace(/_/g, ' ')}
    {subtext && <span className="ml-1.5 text-xs opacity-70">({subtext})</span>}
  </span>
);

const CameraIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>;
const CrystalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>;

type WikiItemCardProps = {
    item: GameEntity;
    type: 'Jugador' | 'Fauna' | 'Flora' | 'Mineral' | 'Material' | 'Biome' | 'Especie' | 'Cristal' | 'Arma' | 'Herramienta' | 'Efecto';
    onUpdateSpeciesImage: (speciesId: string, imageUrl: string) => void;
    allFauna: Fauna[];
    allPlants: Planta[];
    allMinerals: Mineral[];
    allMaterials: Material[];
    allSpecies: EspecieInteligente[];
    onEdit: (item: GameEntity) => void;
    onDelete: (type: string, id: string) => void;
}

const WikiItemCard: React.FC<WikiItemCardProps> = ({ item, type, onUpdateSpeciesImage, allFauna, allPlants, allMinerals, allMaterials, allSpecies, onEdit, onDelete }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onUpdateSpeciesImage(item.id, reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const renderPlayer = (player: Jugador) => {
        const species = allSpecies.find(s => s.id === player.especieId);
        return (
             <div className="mt-2 pt-2 border-t border-slate-700/50">
                <h4 className="text-xs text-slate-400 mb-1.5 font-bold">Estadísticas Base</h4>
                <div className="flex flex-col text-xs space-y-1">
                    <StatItem label="Salud" value={player.statsBase.salud} className="py-1" />
                    <StatItem label="Aguante" value={player.statsBase.aguante} className="py-1" />
                    <StatItem label="Ataque" value={player.statsBase.ataque} className="py-1" />
                    <StatItem label="Defensa" value={player.statsBase.defensa} className="py-1" />
                    <StatItem label="Especie" value={species?.nombre || 'Ninguna'} className="py-1 border-b-0" />
                </div>
            </div>
        )
    };

    const renderFauna = (fauna: Fauna) => {
        const drops = fauna.drops.map(drop => {
            const material = allMaterials.find(m => m.id === drop.materialId);
            return material ? { ...drop, name: material.nombre } : null;
        }).filter(Boolean);
        const extremidadesDisplay = fauna.cantidadExtremidades > 10 ? 'Muchas' : fauna.cantidadExtremidades;
        return (
            <div className="mt-2 pt-2 border-t border-slate-700/50 space-y-3">
                 <div className="grid grid-cols-2 gap-4">
                     <div>
                        <h4 className="text-xs text-slate-400 mb-1.5 font-bold">Fisiología</h4>
                        <div className="flex flex-col text-xs space-y-1">
                            <StatItem label="Locomoción" value={fauna.locomocion} className="py-1 border-b-0" />
                            <StatItem label="Forma Corporal" value={fauna.formaCorporal} className="py-1 border-b-0" />
                            <StatItem label="Nº de Patas" value={extremidadesDisplay} className="py-1 border-b-0" />
                            <StatItem label="Brazos" value={fauna.tipoExtremidadesDelanteras} className="py-1 border-b-0" />
                            <StatItem label="Cola" value={fauna.tieneCola ? `Sí (${fauna.utilidadCola.join(', ').replace(/_/g, ' ') || 'N/A'})` : 'No'} className="py-1 border-b-0" />
                        </div>
                     </div>
                     <div>
                        <h4 className="text-xs text-slate-400 mb-1.5 font-bold">Comportamiento</h4>
                        <div className="flex flex-col text-xs space-y-1">
                            <StatItem label="Social" value={fauna.comportamientoSocial} className="py-1 border-b-0" />
                            <StatItem label="Temperamento" value={fauna.temperamento} className="py-1 border-b-0" />
                        </div>
                     </div>
                 </div>
                {(fauna.rolCombate.length > 0 || fauna.utilidad.length > 0) && (
                    <div>
                        <h4 className="text-xs text-slate-400 mb-1.5 font-bold">Utilidad y Combate</h4>
                        <div className="flex flex-wrap gap-1.5">
                            {fauna.rolCombate.map(tag => (
                                <Tag key={tag} text={tag} className="bg-red-900/50 text-red-300 border-red-700/70" />
                            ))}
                            {fauna.utilidad.map(tag => (
                                <Tag key={tag} text={tag} className="bg-cyan-900/50 text-cyan-300 border-cyan-700/70" />
                            ))}
                        </div>
                    </div>
                )}
                {drops.length > 0 && (
                    <div>
                        <h4 className="text-xs text-slate-400 mb-1.5 font-bold">Recursos Obtenibles</h4>
                        <div className="flex flex-wrap gap-1.5">
                            {drops.map(drop => drop && (
                                <Tag key={drop.materialId} text={drop.name} subtext={`${(drop.chance * 100).toFixed(0)}%`} className="bg-blue-900/50 text-blue-300 border-blue-700/70" />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderPlant = (plant: Planta) => {
        const materials = plant.materiales.map(matId => allMaterials.find(m => m.id === matId)?.nombre).filter(Boolean);
        return (
            <div className="mt-2 pt-2 border-t border-slate-700/50">
                <h4 className="text-xs text-slate-400 mb-1">Materiales</h4>
                <div className="text-sm font-mono text-slate-300">{materials.join(' • ')}</div>
            </div>
        );
    };
    
    const renderBiome = (biome: Bioma) => {
        const faunaNames = biome.faunaPosible.map(id => allFauna.find(f => f.id === id)?.nombre).filter(Boolean).join(', ');
        const plantNames = biome.floraPosible.map(id => allPlants.find(p => p.id === id)?.nombre).filter(Boolean).join(', ');
        const mineralNames = biome.mineralesPosibles.map(id => allMinerals.find(m => m.id === id)?.nombre).filter(Boolean).join(', ');
        return (
            <div className="mt-2 pt-2 border-t border-slate-700/50 space-y-2 text-xs">
                {faunaNames && <div><strong className="text-slate-400">Fauna: </strong><span className="font-mono text-slate-300">{faunaNames}</span></div>}
                {plantNames && <div><strong className="text-slate-400">Flora: </strong><span className="font-mono text-slate-300">{plantNames}</span></div>}
                {mineralNames && <div><strong className="text-slate-400">Minerales: </strong><span className="font-mono text-slate-300">{mineralNames}</span></div>}
            </div>
        );
    };

    const renderSpecies = (species: EspecieInteligente) => (
        <div className="space-y-4">
             {species.urlImagen && (
                <div className="mt-2">
                    <img src={species.urlImagen} alt={`Concept art for ${species.nombre}`} className="w-full h-auto rounded-md object-cover border-2 border-slate-700/50" />
                </div>
             )}
            <div className="pt-2 border-t border-slate-700/50">
                <h4 className="text-sm text-slate-300 font-bold mb-1.5">Lore</h4>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-400 pl-2">
                    {species.lore.map((line, index) => <li key={index}>{line}</li>)}
                </ul>
            </div>
            <div>
                <h4 className="text-sm text-slate-300 font-bold mb-1.5">Reglas de Gameplay</h4>
                <div className="space-y-2">
                    {species.reglasGameplay.map((rule, index) => (
                        <div key={index} className="text-xs">
                            <strong className="text-slate-200">{rule.titulo}</strong>
                            <p className="text-slate-400">{rule.descripcion}</p>
                        </div>
                    ))}
                </div>
            </div>
            {species.debilidades?.length > 0 && (
                 <div>
                    <h4 className="text-sm text-red-400 font-bold mb-1.5">Debilidades</h4>
                    <ul className="list-disc list-inside space-y-1 text-xs text-slate-400 pl-2">
                        {species.debilidades.map((line, index) => <li key={index}>{line}</li>)}
                    </ul>
                </div>
            )}
             <div>
                <h4 className="text-sm text-slate-300 font-bold mb-1.5">Restricciones de Diseño</h4>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-400 pl-2">
                    {species.restriccionesDiseno.map((line, index) => <li key={index}>{line}</li>)}
                </ul>
            </div>
        </div>
    );

    const renderWeapon = (weapon: Arma) => (
        <div className="mt-2 pt-2 border-t border-slate-700/50">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <h4 className="text-xs text-slate-400 mb-1.5 font-bold">Estadísticas</h4>
                    <div className="flex flex-col text-xs space-y-1">
                        <StatItem label="Tipo" value={weapon.tipoArma} className="py-1 border-b-0" />
                        <StatItem label="Daño" value={weapon.dano} className="py-1 border-b-0" />
                        <StatItem label="Velocidad" value={weapon.velocidad} className="py-1 border-b-0" />
                        <StatItem label="Alcance" value={weapon.alcance} className="py-1 border-b-0" />
                    </div>
                </div>
            </div>
        </div>
    );

    const renderTool = (tool: Herramienta) => (
        <div className="mt-2 pt-2 border-t border-slate-700/50">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <h4 className="text-xs text-slate-400 mb-1.5 font-bold">Atributos</h4>
                    <div className="flex flex-col text-xs space-y-1">
                        <StatItem label="Tipo" value={tool.tipoHerramienta} className="py-1 border-b-0" />
                        <StatItem label="Eficiencia" value={tool.eficiencia.toFixed(1)} className="py-1 border-b-0" />
                        <StatItem label="Durabilidad" value={tool.durabilidad} className="py-1 border-b-0" />
                    </div>
                </div>
            </div>
        </div>
    );
    
    const renderEffect = (effect: Efecto) => (
        <div className="mt-2 pt-2 border-t border-slate-700/50">
            <h4 className="text-sm text-slate-300 font-bold mb-1.5">Mecánicas de Juego</h4>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-400 pl-2">
                {effect.mecanicasGameplay.map((line, index) => <li key={index}>{line}</li>)}
            </ul>
        </div>
    );

    return (
        <div id={`wiki-item-${item.id}`} className="bg-space-light/50 p-3 rounded-lg border border-slate-700 transition-all duration-500">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <h3 className="font-bold text-white">{item.nombre}</h3>
                    <p className="text-xs text-slate-400 mt-1 italic">{item.descripcion}</p>
                </div>
                <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                    {type === 'Jugador' && <Tag text="Jugador" className="bg-yellow-800/50 text-yellow-300 border-yellow-600/70" />}
                    {type === 'Fauna' && <KingdomBadge kingdom={(item as Fauna).reino} />}
                    {type === 'Material' && <Tag text={(item as Material).origen} className={ORIGIN_COLORS[(item as Material).origen]} />}
                    {type === 'Biome' && (
                        <div className="flex flex-col space-y-1 items-end">
                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${BIOME_CATEGORY_COLORS[(item as Bioma).categoria]} capitalize`}>
                                {(item as Bioma).categoria.replace(/_/g, ' ').toLowerCase()}
                            </span>
                            {(item as Bioma).tags.map(tag => (
                                <span key={tag} className="px-2 py-0.5 text-xs font-semibold rounded-full border bg-gray-700/50 text-gray-300 border-gray-600/70 capitalize">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                    {type === 'Cristal' && (
                        <div className="flex items-center space-x-2 text-xs font-semibold" style={{ color: CRYSTAL_COLORS[(item as ArquetipoCristal).tipoCristal] }}>
                            <CrystalIcon />
                            <span className="capitalize">{(item as ArquetipoCristal).tipoCristal}</span>
                        </div>
                    )}
                    {type === 'Especie' && (
                        <div className="flex items-center space-x-2">
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                            <button onClick={handleImageUploadClick} title="Upload Concept Art" className="p-1.5 rounded-md bg-space-light hover:bg-space-dark/50 text-slate-300 hover:text-white transition-colors">
                                <CameraIcon />
                            </button>
                            <div className="w-4 h-4 rounded-full border border-black/30" style={{ backgroundColor: (item as EspecieInteligente).colorClave }}></div>
                            <span className="text-xs font-bold text-slate-300">Especie Inteligente</span>
                        </div>
                    )}
                    {type === 'Efecto' && <Tag text={(item as Efecto).tipoEfecto} className={EFFECT_TYPE_COLORS[(item as Efecto).tipoEfecto]} />}
                </div>
            </div>

            {type === 'Fauna' && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                    <Tag text={(item as Fauna).dieta} className={DIET_COLORS[(item as Fauna).dieta]} />
                    <Tag text={(item as Fauna).tamano} className={SIZE_COLORS[(item as Fauna).tamano]} />
                </div>
            )}
            
            {type === 'Fauna' && (
                <div className="flex justify-end space-x-2 mt-2">
                    <button onClick={() => onEdit(item)} title="Editar" className="p-1.5 rounded-md bg-space-light/50 hover:bg-accent-amber/80 text-slate-300 hover:text-space-dark transition-colors">
                        <EditIcon />
                    </button>
                     <button onClick={() => onDelete(type, item.id)} title="Eliminar" className="p-1.5 rounded-md bg-space-light/50 hover:bg-red-600/80 text-slate-300 hover:text-white transition-colors">
                        <TrashIcon />
                    </button>
                </div>
            )}
            
            {type === 'Jugador' && renderPlayer(item as Jugador)}
            {type === 'Fauna' && renderFauna(item as Fauna)}
            {type === 'Flora' && renderPlant(item as Planta)}
            {type === 'Biome' && renderBiome(item as Bioma)}
            {type === 'Especie' && renderSpecies(item as EspecieInteligente)}
            {type === 'Arma' && renderWeapon(item as Arma)}
            {type === 'Herramienta' && renderTool(item as Herramienta)}
            {type === 'Efecto' && renderEffect(item as Efecto)}
        </div>
    );
};

export default WikiItemCard;