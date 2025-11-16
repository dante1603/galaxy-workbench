import React, { useState, useCallback, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { 
    Fauna, 
    Material, 
    TODAS_DIETAS,
    TODOS_COMPORTAMIENTOS_SOCIALES, 
    TODOS_REINOS_ANIMALES, 
    TODOS_TAMANOS_FAUNA, 
    TODAS_LOCOMOCIONES,
    TODAS_FORMAS_CORPORALES,
    TODOS_TEMPERAMENTOS,
    TODOS_ROLES_COMBATE,
    TODOS_TAGS_UTILIDAD,
    TODAS_EXTREMIDADES_DELANTERAS,
    TODOS_TAGS_UTILIDAD_COLA,
    Drop,
} from '../../types';
import { id } from '../../utils/helpers';

interface CreateFaunaFormProps {
    onClose: () => void;
    onSave: (fauna: Fauna) => void;
    onUpdate: (fauna: Fauna) => void;
    initialData?: Fauna | null;
    allMaterials: Material[];
}

// --- Icon Components ---
const MagicIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L9 9l-7 3 7 3 3 7 3-7 7-3-7-3-3-7z"></path></svg>;
const DownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>;
const LoadingSpinner = () => (
  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

// --- Form Field Subcomponents ---
const FormInput: React.FC<{ label: string; name: string; value: string | number; type?: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ label, name, value, type = 'text', onChange }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
        <input type={type} id={name} name={name} value={value} onChange={onChange} className="w-full bg-space-dark/50 border border-slate-600 rounded-md px-3 py-2 text-sm text-white focus:ring-accent-cyan focus:border-accent-cyan" />
    </div>
);

const FormTextarea: React.FC<{ label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void }> = ({ label, name, value, onChange }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
        <textarea id={name} name={name} value={value} onChange={onChange} rows={3} className="w-full bg-space-dark/50 border border-slate-600 rounded-md px-3 py-2 text-sm text-white focus:ring-accent-cyan focus:border-accent-cyan" />
    </div>
);

const FormSelect: React.FC<{ label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: string[] }> = ({ label, name, value, onChange, options }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
        <select id={name} name={name} value={value} onChange={onChange} className="w-full bg-space-dark/50 border border-slate-600 rounded-md px-3 py-2 text-sm text-white focus:ring-accent-cyan focus:border-accent-cyan capitalize">
            <option value="">Seleccionar...</option>
            {options.map(opt => <option key={opt} value={opt} className="capitalize">{opt.replace(/_/g, ' ')}</option>)}
        </select>
    </div>
);

const FormMultiSelect: React.FC<{ label: string; name: string; selected: string[]; onChange: (name: string, value: string[]) => void; options: { value: string; label: string }[] }> = ({ label, name, selected, onChange, options }) => {
    const handleSelect = (value: string) => {
        const newSelected = selected.includes(value)
            ? selected.filter(item => item !== value)
            : [...selected, value];
        onChange(name, newSelected);
    };

    return (
        <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
            <div className="max-h-32 overflow-y-auto bg-space-dark/50 border border-slate-600 rounded-md p-2 space-y-1">
                {options.map(opt => (
                    <label key={opt.value} className="flex items-center space-x-2 text-sm text-slate-300 cursor-pointer">
                        <input type="checkbox" checked={selected.includes(opt.value)} onChange={() => handleSelect(opt.value)} className="form-checkbox bg-space-dark border-slate-500 text-accent-cyan focus:ring-accent-cyan" />
                        <span className="capitalize">{opt.label.replace(/_/g, ' ')}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};

const FormCheckbox: React.FC<{ label: string; name: string; checked: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ label, name, checked, onChange }) => (
    <div className="flex items-center">
        <input type="checkbox" id={name} name={name} checked={checked} onChange={onChange} className="form-checkbox h-4 w-4 bg-space-dark border-slate-500 text-accent-cyan focus:ring-accent-cyan rounded" />
        <label htmlFor={name} className="ml-2 block text-sm text-slate-300">{label}</label>
    </div>
);

// FIX: The original return type was incorrect, causing a type conflict. The form state for `drops` uses an array of material IDs (string[]),
// not the full Drop[] object. This updated type correctly reflects the state's shape.
const getInitialState = (initialData?: Fauna | null): Omit<Partial<Fauna>, 'drops'> & { drops: string[] } => {
    if (initialData) {
        return {
            ...initialData,
            // When editing, ensure drops are just material IDs for the multiselect component
            drops: initialData.drops.map(d => d.materialId)
        };
    }
    return {
        nombre: '',
        descripcion: '',
        tags: [],
        dieta: undefined,
        comportamientoSocial: undefined,
        reino: undefined,
        tamano: undefined,
        locomocion: undefined,
        formaCorporal: undefined,
        cantidadExtremidades: 0,
        tipoExtremidadesDelanteras: undefined,
        tieneCola: false,
        utilidadCola: [],
        temperamento: undefined,
        rolCombate: [],
        utilidad: [],
        drops: []
    };
};

/**
 * A form for manually creating or AI-assisted generation of new Fauna entities.
 */
const CreateFaunaForm: React.FC<CreateFaunaFormProps> = ({ onClose, onSave, onUpdate, initialData, allMaterials }) => {
    const [creature, setCreature] = useState(getInitialState(initialData));
    const [isGenerating, setIsGenerating] = useState(false);
    const isEditing = !!initialData;
    
    useEffect(() => {
        setCreature(getInitialState(initialData));
    }, [initialData]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const isNumber = ['cantidadExtremidades'].includes(name);
        setCreature(prev => ({ ...prev, [name]: isNumber ? parseInt(value) || 0 : value }));
    }, []);

    const handleMultiSelectChange = useCallback((name: string, value: string[]) => {
        setCreature(prev => ({ ...prev, [name]: value }));
    }, []);
    
    const handleTagChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setCreature(prev => ({...prev, tags: value.split(',').map(t => t.trim()).filter(Boolean)}));
    }, []);

    const handleSave = () => {
        const requiredFields: (keyof Pick<Fauna, 'nombre' | 'descripcion' | 'dieta' | 'reino' | 'tamano' | 'comportamientoSocial' | 'locomocion' | 'formaCorporal' | 'temperamento'>)[] = [
            'nombre', 'descripcion', 'dieta', 'reino', 'tamano', 'comportamientoSocial', 'locomocion', 'formaCorporal', 'temperamento'
        ];
        
        const fieldTranslations: Record<string, string> = {
            nombre: 'Nombre',
            descripcion: 'Descripción',
            dieta: 'Dieta',
            reino: 'Reino',
            tamano: 'Tamaño',
            comportamientoSocial: 'Comportamiento Social',
            locomocion: 'Locomoción',
            formaCorporal: 'Forma Corporal',
            temperamento: 'Temperamento'
        };

        const missingField = requiredFields.find(field => !creature[field]);
        if (missingField) {
            const fieldName = fieldTranslations[missingField] || missingField;
            alert(`El campo "${fieldName}" es obligatorio. Por favor, completa todos los campos.`);
            return;
        }

        const finalDrops: Drop[] = (creature.drops || []).map(materialId => {
            const existingDrop = initialData?.drops.find(d => d.materialId === materialId);
            return existingDrop || { materialId: materialId, min: 1, max: 1, chance: 0.5 };
        });

        const cleanCreature = Object.fromEntries(
            Object.entries(creature).filter(([_, v]) => v !== undefined)
        );

        if (isEditing && initialData) {
             const updatedCreature: Fauna = {
                ...initialData,
                ...cleanCreature,
                drops: finalDrops,
                fechaActualizacion: new Date().toISOString(),
                version: initialData.version + 1,
             };
             onUpdate(updatedCreature);
        } else {
            const newCreature: Fauna = {
                id: id('f'),
                nombre: 'Criatura sin nombre',
                descripcion: 'Sin descripción.',
                tags: [],
                dieta: 'omnivoro',
                comportamientoSocial: 'solitario',
                reino: 'mamifero',
                tamano: 'medio',
                locomocion: 'terrestre',
                formaCorporal: 'vertebrado',
                cantidadExtremidades: 4,
                tipoExtremidadesDelanteras: 'ninguna',
                tieneCola: false,
                utilidadCola: [],
                temperamento: 'oportunista',
                rolCombate: [],
                utilidad: [],
                biomeIds: [],
                nivelAmenaza: 1,
                stats: { salud: 50, dano: 5, velocidad: 3, rangoPercepcion: 15, rangoAgresividad: 10 },
                idPerfilIA: null,
                estado: 'borrador',
                version: 1,
                fechaCreacion: new Date().toISOString(),
                ...cleanCreature,
                fechaActualizacion: new Date().toISOString(),
                drops: finalDrops,
            };
            onSave(newCreature);
        }
        onClose();
    };
    
    const handleDownload = () => {
      const json = JSON.stringify(creature, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${creature.nombre?.toLowerCase().replace(/\s/g, '_') || 'nueva_criatura'}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };

    const handleAutogenerate = async () => {
        setIsGenerating(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const dropSchema = {
                type: Type.OBJECT,
                properties: {
                    materialId: { type: Type.STRING, enum: allMaterials.map(m => m.id) },
                    min: { type: Type.INTEGER },
                    max: { type: Type.INTEGER },
                    chance: { type: Type.NUMBER, description: "Probabilidad entre 0.0 y 1.0" },
                },
                required: ['materialId', 'min', 'max', 'chance']
            };

            const schema = {
                type: Type.OBJECT,
                properties: {
                    nombre: { type: Type.STRING, description: "Nombre evocador y único para la criatura." },
                    descripcion: { type: Type.STRING, description: "Descripción detallada de la apariencia, hábitat y comportamiento." },
                    tags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Lista de 1 a 3 etiquetas descriptivas (ej: 'volador', 'acorazado', 'nocturno')." },
                    dieta: { type: Type.STRING, enum: TODAS_DIETAS },
                    reino: { type: Type.STRING, enum: TODOS_REINOS_ANIMALES },
                    tamano: { type: Type.STRING, enum: TODOS_TAMANOS_FAUNA },
                    comportamientoSocial: { type: Type.STRING, enum: TODOS_COMPORTAMIENTOS_SOCIALES },
                    locomocion: { type: Type.STRING, enum: TODAS_LOCOMOCIONES },
                    formaCorporal: { type: Type.STRING, enum: TODAS_FORMAS_CORPORALES },
                    cantidadExtremidades: { type: Type.INTEGER, description: "Número de extremidades para locomoción." },
                    tipoExtremidadesDelanteras: { type: Type.STRING, enum: TODAS_EXTREMIDADES_DELANTERAS },
                    tieneCola: { type: Type.BOOLEAN },
                    utilidadCola: { type: Type.ARRAY, items: { type: Type.STRING, enum: TODOS_TAGS_UTILIDAD_COLA } },
                    temperamento: { type: Type.STRING, enum: TODOS_TEMPERAMENTOS },
                    rolCombate: { type: Type.ARRAY, items: { type: Type.STRING, enum: TODOS_ROLES_COMBATE } },
                    utilidad: { type: Type.ARRAY, items: { type: Type.STRING, enum: TODOS_TAGS_UTILIDAD } },
                    drops: { type: Type.ARRAY, items: dropSchema, description: "Lista de 1 a 3 objetos de loot que puede soltar al ser derrotado." },
                },
                required: [
                    'nombre', 'descripcion', 'tags', 'dieta', 'reino', 'tamano', 'comportamientoSocial',
                    'locomocion', 'formaCorporal', 'cantidadExtremidades', 'tipoExtremidadesDelanteras',
                    'tieneCola', 'utilidadCola', 'temperamento',
                    'rolCombate', 'utilidad', 'drops'
                ]
            };

            const prompt = `Eres un diseñador de criaturas para un videojuego de ciencia ficción. Basándote en la siguiente información parcial, completa TODOS los campos vacíos (marcados con 'undefined', '[]' u objeto vacío) para crear una criatura coherente e interesante. Asegúrate de que los drops (recursos) sean lógicos para la criatura. Devuelve únicamente el objeto JSON completo.
            
            Información parcial:
            ${JSON.stringify(creature, null, 2)}
            
            IDs de materiales disponibles para 'materialId' en 'drops': ${allMaterials.map(m => m.id).join(', ')}`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: schema,
                },
            });
            
            const text = response.text.trim();
            const generatedData = JSON.parse(text);
            
            const generatedDropsAsIds = generatedData.drops.map((d: Drop) => d.materialId);

            setCreature(prev => ({
                ...prev, 
                ...generatedData,
                drops: generatedDropsAsIds // Store as IDs for the multiselect
            }));
            
        } catch (error) {
            console.error("Error during autogeneration:", error);
            alert("Hubo un error al generar los datos. Por favor, inténtalo de nuevo.");
        } finally {
            setIsGenerating(false);
        }
    };
    
    const selectedDropIds = creature.drops || [];

    return (
        <div className="flex flex-col h-full">
            <div className="flex-grow p-4 overflow-y-auto space-y-4">
                <FormInput label="Nombre" name="nombre" value={creature.nombre || ''} onChange={handleChange} />
                <FormTextarea label="Descripción" name="descripcion" value={creature.descripcion || ''} onChange={handleChange} />
                <FormInput label="Tags (separados por coma)" name="tags" value={creature.tags?.join(', ') || ''} onChange={handleTagChange} />

                <div className="grid grid-cols-2 gap-4">
                    <FormSelect label="Dieta" name="dieta" value={creature.dieta || ''} onChange={handleChange} options={TODAS_DIETAS} />
                    <FormSelect label="Reino" name="reino" value={creature.reino || ''} onChange={handleChange} options={TODOS_REINOS_ANIMALES} />
                    <FormSelect label="Tamaño" name="tamano" value={creature.tamano || ''} onChange={handleChange} options={TODOS_TAMANOS_FAUNA} />
                    <FormSelect label="Comportamiento Social" name="comportamientoSocial" value={creature.comportamientoSocial || ''} onChange={handleChange} options={TODOS_COMPORTAMIENTOS_SOCIALES} />
                </div>
                
                <h3 className="text-lg font-bold text-slate-200 pt-2 border-t border-slate-700">Fisiología</h3>
                <div className="grid grid-cols-2 gap-4">
                    <FormSelect label="Locomoción" name="locomocion" value={creature.locomocion || ''} onChange={handleChange} options={TODAS_LOCOMOCIONES} />
                    <FormSelect label="Forma Corporal" name="formaCorporal" value={creature.formaCorporal || ''} onChange={handleChange} options={TODAS_FORMAS_CORPORALES} />
                    <FormInput label="Nº Extremidades" name="cantidadExtremidades" type="number" value={creature.cantidadExtremidades || 0} onChange={handleChange} />
                    <FormSelect label="Extremidades Delanteras" name="tipoExtremidadesDelanteras" value={creature.tipoExtremidadesDelanteras || ''} onChange={handleChange} options={TODAS_EXTREMIDADES_DELANTERAS} />
                    <FormSelect label="Temperamento" name="temperamento" value={creature.temperamento || ''} onChange={handleChange} options={TODOS_TEMPERAMENTOS} />
                </div>
                
                <FormCheckbox label="Tiene Cola" name="tieneCola" checked={!!creature.tieneCola} onChange={(e) => setCreature(prev => ({ ...prev, tieneCola: e.target.checked, utilidadCola: e.target.checked ? prev.utilidadCola : [] }))} />
                {creature.tieneCola && (
                    <FormMultiSelect label="Utilidad de la Cola" name="utilidadCola" selected={creature.utilidadCola || []} onChange={handleMultiSelectChange} options={TODOS_TAGS_UTILIDAD_COLA.map(b => ({value: b, label: b}))} />
                )}


                <h3 className="text-lg font-bold text-slate-200 pt-2 border-t border-slate-700">Gameplay</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormMultiSelect label="Rol en Combate" name="rolCombate" selected={creature.rolCombate || []} onChange={handleMultiSelectChange} options={TODOS_ROLES_COMBATE.map(b => ({value: b, label: b}))} />
                  <FormMultiSelect label="Utilidad" name="utilidad" selected={creature.utilidad || []} onChange={handleMultiSelectChange} options={TODOS_TAGS_UTILIDAD.map(m => ({value: m, label: m}))} />
                </div>
                <div>
                   <FormMultiSelect label="Recursos (Drops)" name="drops" selected={selectedDropIds} onChange={handleMultiSelectChange} options={allMaterials.map(m => ({value: m.id, label: m.nombre}))} />
                </div>

            </div>
            <div className="flex-shrink-0 p-4 border-t border-slate-700 bg-space-dark/30 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <button onClick={handleAutogenerate} disabled={isGenerating} className="flex items-center space-x-2 bg-purple-600 text-white font-bold py-2 px-4 rounded-md hover:bg-purple-500 transition-colors duration-200 disabled:bg-purple-800 disabled:cursor-not-allowed">
                        {isGenerating ? <LoadingSpinner /> : <MagicIcon />}
                        <span>Autogenerar</span>
                    </button>
                    <button onClick={handleDownload} className="flex items-center space-x-2 bg-slate-600 text-white font-bold py-2 px-4 rounded-md hover:bg-slate-500 transition-colors duration-200">
                        <DownloadIcon />
                        <span>JSON</span>
                    </button>
                </div>
                <button onClick={handleSave} className="bg-accent-cyan text-space-dark font-bold py-2 px-6 rounded-md hover:bg-cyan-300 transition-colors duration-200">
                    {isEditing ? 'Actualizar Criatura' : 'Guardar y Añadir'}
                </button>
            </div>
        </div>
    );
};

export default CreateFaunaForm;
