
import React from 'react';
import type { Jugador, Fauna, Planta, Mineral, Material, Bioma, ArquetipoCristal, EspecieInteligente, Arma, Herramienta, Efecto, GameEntity } from '../../../types';

// Header
import WikiCardHeader from './cards/WikiCardHeader';

// Specialized Cards
import FaunaCard from './cards/FaunaCard';
import FloraCard from './cards/FloraCard';
import PlanetCard from './cards/PlanetCard'; // Maps to Biomes
import SpeciesCard from './cards/SpeciesCard';
import ItemCard from './cards/ItemCard';
import EquipmentCard from './cards/EquipmentCard';
import PlayerCard from './cards/PlayerCard';
import EffectCard from './cards/EffectCard';

type WikiItemCardProps = {
    item: GameEntity;
    type: 'Jugador' | 'Fauna' | 'Flora' | 'Mineral' | 'Material' | 'Biome' | 'Especie' | 'Cristal' | 'Arma' | 'Herramienta' | 'Efecto';
    onUpdateSpeciesImage: (speciesId: string, imageUrl: string) => void;
    onEdit: (item: GameEntity) => void;
    onDelete: (type: string, id: string) => void;
    onNavigate?: (type: string, id: string) => void;
    viewMode?: 'list' | 'grid';
}

// Registry for Card Renderers (Strategy Pattern)
const CARD_RENDERERS: Record<string, React.FC<WikiItemCardProps>> = {
    'Fauna': (props) => (
        <FaunaCard 
            fauna={props.item as Fauna} 
            viewMode={props.viewMode} 
            onEdit={props.onEdit} 
            onDelete={props.onDelete} 
            onNavigate={props.onNavigate} 
        />
    ),
    'Flora': (props) => (
        <FloraCard 
            plant={props.item as Planta} 
            onNavigate={props.onNavigate} 
        />
    ),
    'Biome': (props) => (
        <PlanetCard 
            biome={props.item as Bioma} 
            onNavigate={props.onNavigate} 
        />
    ),
    'Especie': (props) => (
        <SpeciesCard 
            species={props.item as EspecieInteligente} 
            viewMode={props.viewMode} 
            onUpdateSpeciesImage={props.onUpdateSpeciesImage} 
        />
    ),
    'Material': (props) => <ItemCard item={props.item as Material} type="Material" onNavigate={props.onNavigate} />,
    'Mineral': (props) => <ItemCard item={props.item as Mineral} type="Mineral" onNavigate={props.onNavigate} />,
    'Cristal': (props) => <ItemCard item={props.item as ArquetipoCristal} type="Cristal" onNavigate={props.onNavigate} />,
    'Arma': (props) => <EquipmentCard item={props.item as Arma} type="Arma" />,
    'Herramienta': (props) => <EquipmentCard item={props.item as Herramienta} type="Herramienta" />,
    'Jugador': (props) => <PlayerCard player={props.item as Jugador} />,
    'Efecto': (props) => <EffectCard effect={props.item as Efecto} />,
};

/**
 * WikiItemCard (Factory/Context)
 * Acts as a dispatcher that renders the specific card based on the entity type map.
 */
const WikiItemCard: React.FC<WikiItemCardProps> = (props) => {
    const { item, type, viewMode = 'list' } = props;

    const mainClasses = viewMode === 'grid' 
        ? "bg-space-light/50 p-3 rounded-lg border border-slate-700 transition-all duration-500 flex flex-col h-full hover:shadow-lg hover:bg-space-light"
        : "bg-space-light/50 p-3 rounded-lg border border-slate-700 transition-all duration-500";

    const Renderer = CARD_RENDERERS[type];

    return (
        <div id={`wiki-item-${item.id}`} className={mainClasses}>
            <WikiCardHeader item={item} type={type} viewMode={viewMode} />
            {Renderer ? (
                <Renderer {...props} />
            ) : (
                <div className="text-xs text-red-400 mt-2">Unknown Entity Type</div>
            )}
        </div>
    );
};

export default WikiItemCard;
