import React from 'react';
import type { TipoPlaneta, TipoCristal } from '../../types';

export const CRYSTAL_COLORS: Record<TipoCristal, string> = {
  FUEGO: '#ef4444',       // red-500
  ELECTRICO: '#f59e0b',  // amber-500
  HIELO: '#38bdf8',      // sky-400
  MAGICO: '#a855f7',     // purple-500
  LUZ: '#f1f5f9',         // slate-100
  GRAVEDAD: '#475569',    // slate-600
  RADIOACTIVO: '#4ade80',// green-400
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