
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { useStaticDataCtx } from '../../context/StaticDataContext';
import { 
    Fauna, 
    ReinoAnimal, Dieta, TamanoFauna, ComportamientoSocial, Locomocion, 
    PlanCorporal, Cobertura, Sentido, TipoExtremidadesDelanteras, Temperamento, RolCombate, TagUtilidad, TagUtilidadCola,
    TODAS_DIETAS, TODOS_REINOS_ANIMALES, TODOS_PLANES_CORPORALES, TODAS_COBERTURAS, TODOS_SENTIDOS,
    TODOS_TAMANOS_FAUNA, TODOS_COMPORTAMIENTOS_SOCIALES, TODAS_LOCOMOCIONES, TODAS_EXTREMIDADES_DELANTERAS,
    TODOS_TAGS_UTILIDAD_COLA, TODOS_TEMPERAMENTOS, TODOS_ROLES_COMBATE, TODOS_TAGS_UTILIDAD
} from '../../types';
import { id as generateId } from '../../utils/helpers';

interface CreateFaunaFormProps {
    onClose: () => void;
    onSave: (fauna: Fauna) => void;
    onUpdate: (fauna: Fauna) => void;
    initialData: Fauna | null;
}

const defaultFauna: Omit<Fauna, 'id' | 'estado' | 'version' | 'fechaCreacion' | 'fechaActualizacion'> = {
    nombre: '',
    descripcion: '',
    tags: [],
    reino: 'mamifero',
    planCorporal: 'cuadrupedo',
    cobertura: 'pelaje',
    sentidos: ['visual'],
    tamano: 'medio',
    locomocion: 'terrestre',
    cantidadExtremidades: 4,
    tipoExtremidadesDelanteras: 'ninguna',
    tieneCola: false,
    utilidadCola: [],
    dieta: 'herbivoro',
    comportamientoSocial: 'solitario',
    temperamento: 'docil',
    rolCombate: [],
    utilidad: [],
    drops: [],
    biomeIds: [],
    nivelAmenaza: 1,
    stats: {
        salud: 50,
        dano: 5,
        velocidad: 3,
        rangoPercepcion: 15,
        rangoAgresividad: 10
    },
    idPerfilIA: null,
    urlImagen: null
};

const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            const base64Data = base64String.split(',')[1];
            resolve({
                inlineData: {
                    data: base64Data,
                    mimeType: file.type
                }
            });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const CreateFaunaForm: React.FC<CreateFaunaFormProps> = ({ onClose, onSave, onUpdate, initialData }) => {
    const { materials: allMaterials } = useStaticDataCtx();
    const [formData, setFormData] = useState<Fauna>(() => {
        if (initialData) return { ...initialData };
        const now = new Date().toISOString();
        return {
            id: generateId('fauna'),
            estado: 'borrador',
            version: 2,
            fechaCreacion: now,
            fechaActualizacion: now,
            ...defaultFauna
        } as Fauna;
    });

    const [morphologyText, setMorphologyText] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingStage, setLoadingStage] = useState('');
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isFormComplete = formData.nombre.trim().length > 0 && formData.descripcion.trim().length > 0;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleArrayToggle = (field: keyof Fauna, value: string) => {
        setFormData(prev => {
            const currentArray = prev[field] as string[];
            if (currentArray.includes(value)) {
                return { ...prev, [field]: currentArray.filter(item => item !== value) };
            } else {
                return { ...prev, [field]: [...currentArray, value] };
            }
        });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, urlImagen: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGenerate = async () => {
        const textInput = morphologyText.trim() || formData.descripcion.trim() || formData.nombre.trim();

        if (!selectedFile && !textInput) {
            setError("Por favor, sube una imagen o escribe una descripción/nombre para generar.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setLoadingStage('Inicializando IA...');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            setLoadingStage(selectedFile ? 'Analizando imagen...' : 'Generando datos...');

             const dropSchema: Schema = {
                type: Type.OBJECT,
                properties: {
                    materialId: { type: Type.STRING, enum: allMaterials.map(m => m.id) },
                    min: { type: Type.INTEGER },
                    max: { type: Type.INTEGER },
                    chance: { type: Type.NUMBER, description: "Probabilidad entre 0.0 y 1.0" },
                },
                required: ['materialId', 'min', 'max', 'chance']
            };

            const faunaSchema: Schema = {
                type: Type.OBJECT,
                properties: {
                    analisisMorfologico: { type: Type.STRING, description: "Análisis biológico detallado." },
                    nombre: { type: Type.STRING },
                    descripcion: { type: Type.STRING },
                    tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                    dieta: { type: Type.STRING, enum: TODAS_DIETAS as string[] },
                    reino: { type: Type.STRING, enum: TODOS_REINOS_ANIMALES as string[] },
                    planCorporal: { type: Type.STRING, enum: TODOS_PLANES_CORPORALES as string[] },
                    cobertura: { type: Type.STRING, enum: TODAS_COBERTURAS as string[] },
                    sentidos: { type: Type.ARRAY, items: { type: Type.STRING, enum: TODOS_SENTIDOS as string[] } },
                    tamano: { type: Type.STRING, enum: TODOS_TAMANOS_FAUNA as string[] },
                    comportamientoSocial: { type: Type.STRING, enum: TODOS_COMPORTAMIENTOS_SOCIALES as string[] },
                    locomocion: { type: Type.STRING, enum: TODAS_LOCOMOCIONES as string[] },
                    cantidadExtremidades: { type: Type.INTEGER },
                    tipoExtremidadesDelanteras: { type: Type.STRING, enum: TODAS_EXTREMIDADES_DELANTERAS as string[] },
                    tieneCola: { type: Type.BOOLEAN },
                    utilidadCola: { type: Type.ARRAY, items: { type: Type.STRING, enum: TODOS_TAGS_UTILIDAD_COLA as string[] } },
                    temperamento: { type: Type.STRING, enum: TODOS_TEMPERAMENTOS as string[] },
                    rolCombate: { type: Type.ARRAY, items: { type: Type.STRING, enum: TODOS_ROLES_COMBATE as string[] } },
                    utilidad: { type: Type.ARRAY, items: { type: Type.STRING, enum: TODOS_TAGS_UTILIDAD as string[] } },
                    drops: { type: Type.ARRAY, items: dropSchema },
                    stats: {
                        type: Type.OBJECT,
                        properties: {
                            salud: { type: Type.INTEGER },
                            dano: { type: Type.INTEGER },
                            velocidad: { type: Type.INTEGER },
                            rangoPercepcion: { type: Type.INTEGER },
                            rangoAgresividad: { type: Type.INTEGER },
                        },
                        required: ['salud', 'dano', 'velocidad', 'rangoPercepcion', 'rangoAgresividad']
                    }
                },
                required: [
                    'nombre', 'descripcion', 'tags', 'dieta', 'reino', 'planCorporal', 'cobertura', 'sentidos',
                    'tamano', 'comportamientoSocial', 'locomocion', 'cantidadExtremidades', 
                    'tipoExtremidadesDelanteras', 'tieneCola', 'utilidadCola', 'temperamento', 
                    'rolCombate', 'utilidad', 'drops', 'stats'
                ]
            };

            let contents = [];
            // Updated prompt to explicitly allow new requested fauna types
            let promptText = "Actúa como un experto en Xenobiología, Paleontología y Ciencia Ficción. Analiza la entrada y genera una criatura completa. Soporta y detecta: Fauna marina prehistórica (tipo Dunkleosteus, Megalodon), voladores gigantes (Pterosaurios, Insectos Carboníferos), fauna espacial (Ballenas de vacío, Gusanos de asteroides) y monstruos sci-fi (tipo Rancor, Sarlacc, Gusanos de Arena). Si es fauna espacial, usa locomoción 'espacial' o 'levitacion'. Si es gusano, usa reino 'verme'. Si es robot, usa 'mecanoide'. IMPORTANTE: Usa el esquema JSON provisto estrictamente.";
            
            if (selectedFile) {
                const imagePart = await fileToGenerativePart(selectedFile);
                promptText += "Usa la imagen para determinar el Plan Corporal (geometría) y Cobertura (textura) exactos. ";
                if (textInput) promptText += `Contexto: "${textInput}".`;
                
                contents = [{ role: 'user', parts: [imagePart, { text: promptText }] }];
            } else {
                promptText += `Basado en: "${textInput}". Inventa detalles biológicos coherentes con el arquetipo solicitado.`;
                contents = [{ role: 'user', parts: [{ text: promptText }] }];
            }

            const jsonResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: contents,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: faunaSchema,
                },
            });

            const generatedData = JSON.parse(jsonResponse.text || '{}');
            const { analisisMorfologico, ...finalData } = generatedData;
            
            if (selectedFile && !textInput) {
                setMorphologyText(analisisMorfologico || "Análisis completado.");
            }

            setFormData(prev => ({
                ...prev,
                ...finalData,
                id: prev.id,
                fechaCreacion: prev.fechaCreacion,
                fechaActualizacion: new Date().toISOString(),
                urlImagen: prev.urlImagen
            }));

        } catch (err: any) {
            console.error("Generation error:", err);
            setError(err.message || "Unknown error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = () => {
        if (initialData) {
            onUpdate(formData);
        } else {
            onSave(formData);
        }
        onClose();
    };

    const canGenerate = !!(selectedFile || morphologyText.trim() || formData.descripcion.trim() || formData.nombre.trim());

    return (
        <div className="flex flex-col h-full bg-space-mid text-slate-200">
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                
                {/* AI GENERATOR */}
                <div className="bg-space-dark/40 p-4 rounded-lg border border-slate-700/50">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-bold text-accent-cyan uppercase tracking-wider">Xenobiología IA</h3>
                        <span className="text-[10px] text-slate-500 uppercase bg-slate-800 px-2 py-0.5 rounded">
                            {selectedFile ? "Análisis Visual" : "Generación Textual"}
                        </span>
                    </div>
                    
                    <div className="flex gap-3 mb-3">
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className={`w-20 h-20 flex-shrink-0 bg-space-dark border-2 border-dashed rounded-md flex items-center justify-center cursor-pointer transition-colors relative overflow-hidden group ${selectedFile ? 'border-accent-cyan' : 'border-slate-600 hover:border-slate-400'}`}
                        >
                            {formData.urlImagen ? (
                                <img src={formData.urlImagen} alt="Ref" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-xl block">📷</span>
                            )}
                            <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                        </div>

                        <textarea
                            className="flex-1 h-20 bg-space-dark border border-slate-600 rounded-md p-2 text-sm text-white focus:ring-1 focus:ring-accent-cyan resize-none placeholder-slate-500"
                            placeholder="Ej: 'Tiburón blindado prehistórico', 'Ballena espacial', 'Gusano de arena gigante'..."
                            value={morphologyText}
                            onChange={(e) => setMorphologyText(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || !canGenerate}
                        className={`w-full py-2 rounded-md flex items-center justify-center space-x-2 transition-all ${
                            canGenerate 
                            ? 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/50 hover:bg-accent-cyan/30' 
                            : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                        }`}
                    >
                        {isLoading ? <span className="animate-spin">⟳</span> : <span>✨</span>}
                        <span className="text-xs font-bold uppercase tracking-wide">
                            {isLoading ? "Sintetizando ADN..." : "Generar Especimen"}
                        </span>
                    </button>
                    {error && <p className="text-xs text-red-400 mt-2 text-center">{error}</p>}
                </div>

                {/* BASIC INFO */}
                <div className="space-y-3">
                    <input
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        placeholder="Nombre de la Criatura"
                        className="w-full bg-space-dark border border-slate-600 rounded px-3 py-2 text-white focus:ring-1 focus:ring-accent-cyan font-bold"
                    />
                    <textarea
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleInputChange}
                        maxLength={300}
                        rows={3}
                        placeholder="Descripción biológica..."
                        className="w-full bg-space-dark border border-slate-600 rounded px-3 py-2 text-white text-sm resize-none"
                    />
                </div>

                {/* TAXONOMY & MORPHOLOGY */}
                <div className="border-t border-slate-700 pt-4">
                    <h4 className="text-xs font-bold text-slate-300 mb-3 uppercase">Morfología y Taxonomía</h4>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Reino</label>
                            <select name="reino" value={formData.reino} onChange={handleInputChange} className="w-full bg-space-dark border border-slate-600 rounded px-2 py-1.5 text-white text-sm">
                                {TODOS_REINOS_ANIMALES.map(o => <option key={o} value={o}>{o.replace(/_/g, ' ')}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Plan Corporal</label>
                            <select name="planCorporal" value={formData.planCorporal} onChange={handleInputChange} className="w-full bg-space-dark border border-slate-600 rounded px-2 py-1.5 text-white text-sm">
                                {TODOS_PLANES_CORPORALES.map(o => <option key={o} value={o}>{o.replace(/_/g, ' ')}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Cobertura</label>
                            <select name="cobertura" value={formData.cobertura} onChange={handleInputChange} className="w-full bg-space-dark border border-slate-600 rounded px-2 py-1.5 text-white text-sm">
                                {TODAS_COBERTURAS.map(o => <option key={o} value={o}>{o.replace(/_/g, ' ')}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Locomoción</label>
                            <select name="locomocion" value={formData.locomocion} onChange={handleInputChange} className="w-full bg-space-dark border border-slate-600 rounded px-2 py-1.5 text-white text-sm">
                                {TODAS_LOCOMOCIONES.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                        </div>
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Sentidos Principales</label>
                        <div className="flex flex-wrap gap-1.5">
                             {TODOS_SENTIDOS.map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => handleArrayToggle('sentidos', tag)}
                                    className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded border ${formData.sentidos.includes(tag) ? 'bg-purple-900/50 border-purple-500 text-purple-300' : 'bg-space-dark border-slate-700 text-slate-500'}`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* STATS */}
                <div className="border-t border-slate-700 pt-4">
                    <h4 className="text-xs font-bold text-slate-300 mb-3 uppercase">Estadísticas de Combate</h4>
                    <div className="grid grid-cols-3 gap-3 text-xs">
                        {Object.keys(formData.stats).map(stat => (
                            <div key={stat}>
                                <label className="block text-slate-500 mb-1 capitalize">{stat.replace('rango', 'R.')}</label>
                                <input 
                                    type="number" 
                                    value={(formData.stats as any)[stat]} 
                                    onChange={(e) => setFormData({...formData, stats: {...formData.stats, [stat]: parseInt(e.target.value)}})} 
                                    className="w-full bg-space-dark border border-slate-600 rounded px-2 py-1 text-white font-mono" 
                                />
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            <div className="p-4 border-t border-slate-700 bg-space-mid flex justify-end space-x-3">
                <button onClick={onClose} className="px-4 py-2 rounded text-sm font-medium text-slate-300 hover:bg-slate-700 transition-colors">Cancelar</button>
                <button onClick={handleSubmit} disabled={!isFormComplete} className="px-6 py-2 rounded bg-accent-cyan text-space-dark font-bold hover:bg-cyan-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Guardar</button>
            </div>
        </div>
    );
};

export default CreateFaunaForm;
