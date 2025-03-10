import {useDrag} from 'react-dnd';
import {IconButton} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React, {forwardRef, useEffect, useState} from 'react';
import Image from 'next/image';
import {FaTrashAlt} from "react-icons/fa";

const DraggableItem = forwardRef((props, ref) => {
    const {
        item,
        onItemClick,
        onDelete,
        collectedIds,
        isSelected,
        handleExpandToggle,
        isExpanded,
        hasSubItems,
        setDraggedItem,
        onDragEnter,
        onDragLeave,
    } = props;

    const [isHovered, setIsHovered] = useState(false); // État pour gérer le survol

    const isInCollectedIds = item ? collectedIds.includes(item.id) : false;

    const [{isDragging}, drag] = useDrag(() => ({
        type: 'item',
        item: {...item, parentId: item.parentId},
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
        canDrag: () => isInCollectedIds,
    }), [item, collectedIds]);

    useEffect(() => {
        if (isDragging) {
            setDraggedItem(item);
        } else {
            setDraggedItem(null);
        }
    }, [isDragging, item, setDraggedItem]);

    if (!item) {
        console.error("L'item est undefined");
        return null;
    }

    return (
        <div
            ref={drag}
            style={{opacity: isDragging ? 0.5 : 1}}
            className={`
        ${isInCollectedIds ? getBackgroundColor(item.nature) : 'bg-gray-100 hover:bg-gray-200'} 
        ${isInCollectedIds ? getWidthClass(item.nature) : 'w-full ml-0'} 
        ${isInCollectedIds ? 'float-right shadow-md' : ''} 
        rounded p-1 mb-2 cursor-pointer hover:text-sky-800
        transition duration-200 
        ${isSelected && isInCollectedIds ? getBorderColor(item.nature) : ''}`}
            onClick={() => onItemClick(item)}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onMouseEnter={() => setIsHovered(true)} // Gérer le survol
            onMouseLeave={() => setIsHovered(false)} // Gérer la sortie du survol
            title={item.nom}
        >
            <div className="flex items-center">
                {/* Icone open/close treeview */}
                {hasSubItems && item.nature !== 'site' && item.nature !== 'site_PR' && (
                    <IconButton onClick={(e) => {
                        e.stopPropagation();
                        handleExpandToggle(item.id);
                    }} className="mr-2">
                        <ExpandMoreIcon style={{
                            transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
                            transition: 'transform 0.2s'
                        }}/>
                    </IconButton>
                )}
                {/* Afficher l'icône de drag si l'élément est survolé */}
                {isInCollectedIds && (
                    <div className="ml-2 w-8 flex-shrink-0">
                        {isInCollectedIds && isHovered && item.nature !== 'site' && item.nature !== 'site_PR' && (
                            <div className="ml-2 w-8 flex-shrink-0"> {/* Largeur fixe pour l'icône de drag */}
                                <Image src="/drag_icon.png" alt="Drag Icon" className="h-8 w-8" height={32} width={32}/>
                            </div>
                        )}
                    </div>)
                }
                <span
                    className={`${isInCollectedIds ? 'p-2 text-base' : 'p-1 text-sm '} ${!isHovered && isInCollectedIds ? getTextColor(item.nature) : 'text-black'} flex-grow overflow-hidden text-ellipsis whitespace-nowrap`}>{item.nom}</span>
                {/* Menu suppression */}
                {isInCollectedIds && isHovered && isSelected && item.nature !== 'site' && item.nature !== 'site_PR' && (
                    <div className="relative ml-auto">
                        <button
                            className={"p-2 my-2 bg-red-500 hover:bg-red-700 rounded mr-4 text-white"}
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(item);
                            }}
                            title="Supprimer"
                        >
                            <FaTrashAlt size={12} className={"text-white"}/>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
});

// Définir les classes de couleur en fonction du type d'élément
const getBackgroundColor = (type) => {
    switch (type) {
        case 'site':
            return 'bg-sky-500 hover:bg-sky-100'; // Fond gris clair pour les sites
        case 'site_PR':
            return 'bg-sky-500 hover:bg-sky-100'; // Fond gris clair pour les sites
        case 'ouvrage':
            return 'bg-sky-400 hover:bg-sky-100'; // Fond gris clair pour les sites
        case 'equipement':
            return 'bg-sky-300 hover:bg-sky-100'; // Fond gris clair pour les sites
        case 'composant':
            return 'bg-sky-200 hover:bg-sky-100'; // Fond gris clair pour les sites
        default:
            return 'bg-white'; // Fond par défaut
    }
};

const getTextColor = (type) => {
    switch (type) {
        case 'site':
            return 'text-sky-50'; // Fond gris clair pour les sites
        case 'site_PR':
            return 'text-sky-50'; // Fond gris clair pour les sites
        case 'ouvrage':
            return 'text-sky-50'; // Fond gris clair pour les sites
        case 'equipement':
            return 'text-sky-800'; // Fond gris clair pour les sites
        case 'composant':
            return 'text-sky-800'; // Fond gris clair pour les sites
        default:
            return 'text-sky-800'; // Fond par défaut
    }
};

// Définir la couleur de la bordure en fonction du type d'élément
const getBorderColor = (type) => {
    switch (type) {
        case 'site':
            return 'border-solid border-2 border-indigo-800'; // Fond gris clair pour les sites
        case 'site_PR':
            return 'border-solid border-2 border-indigo-800'; // Fond gris clair pour les sites
        case 'ouvrage':
            return 'border-solid border-2 border-indigo-600'; // Fond gris clair pour les sites
        case 'equipement':
            return 'border-solid border-2 border-indigo-500'; // Fond gris clair pour les sites
        case 'composant':
            return 'border-solid border-2 border-indigo-400'; // Fond gris clair pour les sites
        default:
            return 'border-solid border-2 border-gray-400'; // Bordure par défaut
    }
};

// Définir la largeur en fonction du type d'élément
const getWidthClass = (type) => {
    switch (type) {
        case 'site':
            return 'w-full ml-0'; // 100% pour les sites
        case 'ouvrage':
            return 'w-[90%] ml-[10%]'; // 10% moins large que les sites
        case 'equipement':
            return 'w-[80%] ml-[20%]'; // 20% moins large que les sites
        case 'composant':
            return 'w-[70%] ml-[30%]'; // 30% moins large que les sites
        default:
            return 'w-full ml-0'; // Par défaut
    }
};

DraggableItem.displayName = 'DraggableItem';

export default DraggableItem;