
import React from 'react';
import type { TipoPlaneta, TipoCristal, EstructuraPlanta, FollajePlanta } from '../../types';

export const CRYSTAL_COLORS: Record<TipoCristal, string> = {
  FUEGO: '#ef4444',       // red-500
  ELECTRICO: '#f59e0b',  // amber-500
  HIELO: '#38bdf8',      // sky-400
  MAGICO: '#a855f7',     // purple-500
  LUZ: '#f1f5f9',         // slate-100
  GRAVEDAD: '#475569',    // slate-600
  RADIOACTIVO: '#4ade80',// green-400
};

export const PLANT_STRUCTURE_COLORS: Record<EstructuraPlanta, string> = {
  arborea: 'bg-emerald-900/50 text-emerald-200 border-emerald-700/70',
  arbustiva: 'bg-lime-900/50 text-lime-200 border-lime-700/70',
  herbacea: 'bg-green-800/50 text-green-200 border-green-600/70',
  liana: 'bg-teal-900/50 text-teal-200 border-teal-700/70',
  hongo: 'bg-purple-900/50 text-purple-200 border-purple-700/70',
  acuatica_flotante: 'bg-cyan-900/50 text-cyan-200 border-cyan-700/70',
  acuatica_sumergida: 'bg-blue-900/50 text-blue-200 border-blue-700/70',
  parasita: 'bg-rose-900/50 text-rose-200 border-rose-700/70',
  epifita: 'bg-pink-900/50 text-pink-200 border-pink-700/70',
  succulenta_gigante: 'bg-emerald-800/50 text-white border-emerald-500/70',
};

export const PLANT_FOLIAGE_COLORS: Record<FollajePlanta, string> = {
  hoja_ancha: 'bg-green-700/50 text-green-100 border-green-500/70',
  aguja: 'bg-stone-700/50 text-stone-200 border-stone-500/70',
  fronda: 'bg-lime-700/50 text-lime-100 border-lime-500/70',
  suculenta: 'bg-emerald-600/50 text-emerald-100 border-emerald-400/70',
  espinas: 'bg-red-900/50 text-red-200 border-red-700/70',
  sin_hojas: 'bg-slate-700/50 text-slate-300 border-slate-500/70',
  cristalino: 'bg-cyan-500/20 text-cyan-100 border-cyan-400/70',
  bioluminiscente: 'bg-indigo-500/20 text-indigo-100 border-indigo-400/70',
  membrana: 'bg-pink-500/20 text-pink-100 border-pink-400/70',
};

export const WarningIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;
export const TargetIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>;
export const CrystalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>;

export const StatItem: React.FC<{ label: string; value: string | number; unit?: string; className?: string }> = ({ label, value, unit, className = '' }) => (
  <div className={`flex justify-between text-sm py-1.5 border-b border-slate-700/50 ${className}`}>
    <span className="text-slate-400">{label}</span>
    <span className="font-mono text-slate-300">
      {value} {unit && <span className="text-slate-500">{unit}</span>}
    </span>
  </div>
);

export const GameplayInfoSection: React.FC<{ title: string; items: string[]; icon: React.ReactNode; colorClass: string }> = ({ title, items, icon, colorClass }) => (
  <div>
    <h4 className={`flex items-center space-x-2 text-sm font-bold mb-2 ${colorClass}`}>
      {icon}
      <span>{title}</span>
    </h4>
    <ul className="list-disc list-inside space-y-1 text-xs text-slate-400 pl-2">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  </div>
);

export const PlanetTypeBadge: React.FC<{ type: TipoPlaneta }> = ({ type }) => {
  const typeStyles: Record<TipoPlaneta, string> = {
    DESERTICO: 'bg-amber-800/50 text-amber-300 border-amber-600/70',
    JUNGLA: 'bg-green-800/50 text-green-300 border-green-600/70',
    VOLCANICO: 'bg-red-800/50 text-red-300 border-red-600/70',
    ACUATICO: 'bg-cyan-800/50 text-cyan-300 border-cyan-600/70',
    GIGANTE_GASEOSO: 'bg-purple-800/50 text-purple-300 border-purple-600/70',
  };
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${typeStyles[type]}`}>
      {type.replace(/_/g, ' ')}
    </span>
  );
};

export const ListItem: React.FC<{ onClick?: () => void, children: React.ReactNode }> = ({ onClick, children }) => {
  const isClickable = !!onClick;
  const baseClasses = "grid grid-cols-3 gap-2 text-xs items-center p-2 w-full text-left rounded-md transition-colors duration-200";
  const styleClasses = isClickable
    ? "bg-space-light hover:bg-space-mid cursor-pointer"
    : "bg-space-light/50";
  
  return (
    <button onClick={onClick} disabled={!isClickable} className={`${baseClasses} ${styleClasses}`}>
      {children}
    </button>
  );
};
