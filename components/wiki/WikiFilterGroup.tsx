import React from 'react';

const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
);

interface WikiFilterGroupProps {
  filterKey: string;
  title: string;
  currentValue: string;
  setter: (value: string) => void;
  options: { value: string; label: string; color?: string }[];
  openFilter: string | null;
  setOpenFilter: (key: string | null) => void;
}

const WikiFilterGroup: React.FC<WikiFilterGroupProps> = ({
  filterKey,
  title,
  currentValue,
  setter,
  options,
  openFilter,
  setOpenFilter,
}) => {
  const isOpen = openFilter === filterKey;
  
  return (
    <div className="border-b border-slate-800">
      <button
        onClick={() => setOpenFilter(isOpen ? null : filterKey)}
        className="w-full flex justify-between items-center py-2.5 px-2 text-sm text-slate-300 hover:text-white transition-colors"
      >
        <span>{title}: <span className="font-bold capitalize">{currentValue.replace(/_/g, ' ')}</span></span>
        <ChevronDownIcon className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="p-2 bg-space-dark/30 flex flex-wrap gap-1">
          <button
            onClick={() => { setter('all'); setOpenFilter(null); }}
            className={`px-2 py-1 text-xs rounded-md transition-colors duration-200 ${currentValue === 'all' ? 'bg-accent-cyan text-space-dark font-bold' : 'bg-space-light/50 text-slate-300 hover:bg-space-light'}`}
          >
            Todos
          </button>
          {options.map(opt => (
            <button
              key={opt.value}
              onClick={() => { setter(opt.value); setOpenFilter(null); }}
              className={`flex items-center space-x-1.5 px-2 py-1 text-xs rounded-md transition-colors duration-200 capitalize ${currentValue === opt.value ? 'bg-accent-cyan text-space-dark font-bold' : 'bg-space-light/50 text-slate-300 hover:bg-space-light'}`}
            >
              {opt.color && <span className="w-2.5 h-2.5 rounded-full border border-black/20" style={{ backgroundColor: opt.color }}></span>}
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default WikiFilterGroup;
