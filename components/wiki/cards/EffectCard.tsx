
import React from 'react';
import type { Efecto } from '../../../types';

interface EffectCardProps {
  effect: Efecto;
}

const EffectCard: React.FC<EffectCardProps> = ({ effect }) => (
    <div className="mt-2 pt-2 border-t border-slate-700/50 w-full">
        <h4 className="text-sm text-slate-300 font-bold mb-1.5">Mecánicas</h4>
        <ul className="list-disc list-inside space-y-1 text-xs text-slate-400 pl-2">
            {effect.mecanicasGameplay.map((line, index) => <li key={index}>{line}</li>)}
        </ul>
    </div>
);

export default EffectCard;
