
import React from 'react';
import type { ReinoAnimal, TipoCristal, CategoriaBiome, Dieta, TamanoFauna, OrigenMaterial, TipoEfecto } from '../../../types';

// --- CONSTANTS ---
export const CRYSTAL_COLORS: Record<TipoCristal, string> = {
  FUEGO: '#ef4444',
  ELECTRICO: '#f59e0b',
  HIELO: '#38bdf8',
  MAGICO: '#a855f7',
  LUZ: '#f1f5f9',
  GRAVEDAD: '#475569',
  RADIOACTIVO: '#4ade80',
};

export const BIOME_CATEGORY_COLORS: Record<CategoriaBiome, string> = {
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

export const DIET_COLORS: Record<Dieta, string> = {
  carnivoro: 'bg-red-800/50 text-red-300 border-red-600/70',
  herbivoro: 'bg-green-800/50 text-green-300 border-green-600/70',
  omnivoro: 'bg-amber-800/50 text-amber-300 border-amber-600/70',
  carronero: 'bg-stone-700/50 text-stone-300 border-stone-500/70',
  fototrofico: 'bg-lime-800/50 text-lime-300 border-lime-600/70',
  litotrofico: 'bg-slate-600/50 text-slate-300 border-slate-500/70',
};

export const SIZE_COLORS: Record<TamanoFauna, string> = {
  diminuto: 'bg-teal-800/50 text-teal-200 border-teal-600/70',
  pequeno: 'bg-sky-800/50 text-sky-200 border-sky-600/70',
  medio: 'bg-indigo-800/50 text-indigo-200 border-indigo-600/70',
  grande: 'bg-purple-800/50 text-purple-200 border-purple-600/70',
  muy_grande: 'bg-fuchsia-800/50 text-fuchsia-200 border-fuchsia-600/70',
  colosal: 'bg-rose-800/50 text-rose-200 border-rose-600/70',
};

export const ORIGIN_COLORS: Record<OrigenMaterial, string> = {
  vegetal: 'bg-green-800/50 text-green-300 border-green-600/70',
  animal: 'bg-orange-800/50 text-orange-300 border-orange-600/70',
  mineral: 'bg-sky-800/50 text-sky-300 border-sky-600/70',
};

export const EFFECT_TYPE_COLORS: Record<TipoEfecto, string> = {
  BUFF: 'bg-green-800/50 text-green-300 border-green-600/70',
  DEBUFF: 'bg-red-800/50 text-red-300 border-red-600/70',
  NEUTRAL: 'bg-slate-700/50 text-slate-300 border-slate-500/70',
};

// --- ICONS ---
export const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
export const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;
export const LinkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline ml-1"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>;
export const AppleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="14" r="8"></circle><path d="M12 14c-2.67 0-4-3.33-4-6 0-2 1.33-3 3-3 2 0 3 1 3 1s1-1 3-1c1.67 0 3 1 3 3 0 2.67-1.33 6-4 6z"></path><path d="M12 5V3"></path></svg>;
export const HeartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>;
export const HungerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12.57 3.34a2 2 0 0 0-3.15 0L2.6 12.3a4.5 4.5 0 0 0 6.36 6.36l1.41-1.41 2.13-2.12 3.53 3.53a4.5 4.5 0 0 0 6.36-6.36L12.57 3.34Z"></path></svg>;
export const EnergyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>;
export const ArrowUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-green-400"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>;
export const ArrowDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-red-400"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>;
export const ImageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>;
export const CrystalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>;


// --- COMPONENTS ---

export const StatItem: React.FC<{ label: string; value: string | number; className?: string }> = ({ label, value, className = '' }) => (
  <div className={`flex justify-between items-center text-sm py-1.5 border-b border-slate-700/50 ${className}`}>
    <span className="text-slate-400">{label}</span>
    <span className="font-mono text-slate-300 capitalize">{typeof value === 'string' ? value.replace(/_/g, ' ') : value}</span>
  </div>
);

export const ComparisonStatBar: React.FC<{ label: string; baseValue: number; modifier: number }> = ({ label, baseValue, modifier }) => {
    const finalValue = baseValue + (modifier || 0);
    const diff = finalValue - baseValue;
    const maxVal = Math.max(baseValue, finalValue) * 1.5; // Scale factor
    const basePercent = (baseValue / maxVal) * 100;
    const finalPercent = (finalValue / maxVal) * 100;
    
    return (
        <div className="mb-2 text-xs">
            <div className="flex justify-between mb-1">
                <span className="text-slate-400 uppercase font-bold tracking-wider">{label}</span>
                <div className="font-mono flex items-center gap-1">
                    <span className="text-slate-500">{baseValue}</span>
                    {diff !== 0 && <span className="text-slate-600">→</span>}
                    <span className={`${diff > 0 ? 'text-green-400' : diff < 0 ? 'text-red-400' : 'text-white'}`}>
                        {finalValue}
                    </span>
                </div>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden relative">
                {/* Base Marker */}
                <div className="absolute top-0 left-0 h-full bg-slate-600" style={{ width: `${basePercent}%` }}></div>
                
                {/* Difference Marker */}
                {diff > 0 ? (
                     <div className="absolute top-0 h-full bg-green-500/80" style={{ left: `${basePercent}%`, width: `${finalPercent - basePercent}%` }}></div>
                ) : (
                     // If negative, we draw red over the base
                     <div className="absolute top-0 right-0 h-full bg-red-500/80" style={{ left: `${finalPercent}%`, width: `${basePercent - finalPercent}%` }}></div>
                )}
            </div>
        </div>
    );
};

export const KingdomBadge: React.FC<{ kingdom: ReinoAnimal }> = ({ kingdom }) => {
  const kingdomStyles: Record<ReinoAnimal, string> = {
    mamifero: 'bg-orange-800/50 text-orange-300 border-orange-600/70',
    reptiloide: 'bg-emerald-800/50 text-emerald-200 border-emerald-600/70',
    aviano: 'bg-sky-800/50 text-sky-300 border-sky-600/70',
    artropodo: 'bg-purple-800/50 text-purple-300 border-purple-600/70',
    pez: 'bg-blue-800/50 text-blue-300 border-blue-600/70',
    anfibio: 'bg-lime-800/50 text-lime-300 border-lime-600/70',
    molusco: 'bg-indigo-800/50 text-indigo-300 border-indigo-600/70',
    silicoide: 'bg-gray-700/50 text-gray-200 border-gray-500/70',
    fungoide: 'bg-teal-800/50 text-teal-200 border-teal-600/70',
    energetico: 'bg-rose-800/50 text-rose-200 border-rose-600/70',
    mecanoide: 'bg-slate-500/50 text-slate-200 border-slate-400/70 shadow-[0_0_10px_rgba(148,163,184,0.3)]',
    verme: 'bg-amber-900/50 text-amber-200 border-amber-700/70'
  };
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${kingdomStyles[kingdom] || 'bg-slate-700 text-slate-300'} capitalize`}>
      {kingdom.replace(/_/g, ' ')}
    </span>
  );
};

export const Tag: React.FC<{ text: string; className: string, subtext?: string, onClick?: () => void }> = ({ text, className, subtext, onClick }) => {
    const Component = onClick ? 'button' : 'span';
    return (
      <Component 
        onClick={onClick}
        className={`px-2 py-0.5 text-xs font-semibold rounded-full border capitalize flex items-center ${className} ${onClick ? 'hover:scale-105 hover:shadow-lg cursor-pointer transition-all' : ''}`}
      >
        {text.replace(/_/g, ' ')}
        {subtext && <span className="ml-1.5 text-xs opacity-70">({subtext})</span>}
        {onClick && <LinkIcon />}
      </Component>
    );
}
