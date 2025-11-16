import React, { useState, useCallback } from 'react';
import type { TipoCuerpoCentral } from '../../types';

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);
const LoadingSpinner = () => (
  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-space-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

interface SystemGenerationModalProps {
  /** Controls the visibility of the modal. */
  isOpen: boolean;
  /** Callback function to close the modal. */
  onClose: () => void;
  /** Async callback function to trigger the system generation process with selected options. */
  onGenerate: (options: { centralBody?: TipoCuerpoCentral | 'Any' }) => Promise<void>;
}

/**
 * A modal dialog that allows the user to configure and initiate the
 * procedural generation of a new star system.
 */
const SystemGenerationModal: React.FC<SystemGenerationModalProps> = ({ isOpen, onClose, onGenerate }) => {
    const [centralBody, setCentralBody] = useState<'Any' | TipoCuerpoCentral>('Any');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = useCallback(async () => {
        setIsGenerating(true);
        await onGenerate({ centralBody });
        setIsGenerating(false);
        onClose(); // Close the modal after generation is complete
    }, [onGenerate, centralBody, onClose]);

    if (!isOpen) {
        return null;
    }

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div
                className="bg-space-mid rounded-lg shadow-2xl border border-slate-700 w-full max-w-md m-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b border-slate-700">
                    <h2 className="text-xl font-bold text-white">System Generation Console</h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-space-light"
                        aria-label="Close modal"
                    >
                        <CloseIcon />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label htmlFor="centralBody" className="block text-sm font-medium text-slate-300 mb-2">
                            Central Body Type
                        </label>
                        <select 
                            id="centralBody" 
                            value={centralBody}
                            onChange={(e) => setCentralBody(e.target.value as 'Any' | TipoCuerpoCentral)}
                            className="w-full bg-space-dark/50 border border-slate-600 rounded-md px-3 py-2 text-sm text-white focus:ring-accent-cyan focus:border-accent-cyan"
                        >
                            <option value="Any">Any (Random)</option>
                            <option value="ESTRELLA">Star</option>
                            <option value="AGUJERO_NEGRO">Black Hole</option>
                            <option value="PULSAR">Pulsar</option>
                        </select>
                    </div>
                    <p className="text-xs text-slate-500">
                        Select the type of celestial body at the center of the system. 'Any' will use weighted probabilities for a random outcome.
                    </p>
                </div>
                <div className="flex justify-end items-center p-4 border-t border-slate-700 bg-space-dark/30 rounded-b-lg space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-300 bg-space-light rounded-md hover:bg-slate-600 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="flex items-center justify-center bg-accent-cyan text-space-dark font-bold py-2 px-6 rounded-md shadow-lg hover:bg-cyan-300 transition-all duration-300 transform focus:outline-none focus:ring-4 focus:ring-accent-cyan/50 disabled:bg-slate-400 disabled:cursor-not-allowed"
                    >
                        {isGenerating && <LoadingSpinner />}
                        {isGenerating ? 'Generating...' : 'Generate'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SystemGenerationModal;