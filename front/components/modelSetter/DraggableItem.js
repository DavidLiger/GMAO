import {useDrag} from 'react-dnd';
import React, {forwardRef, useEffect, useState} from 'react';
import {FaTrashAlt} from "react-icons/fa";
import {MdDragIndicator} from "react-icons/md";
import i18n from '../../i18n';

const DraggableItem = forwardRef((props, ref) => {
    const {
        item,
        onItemClick,
        onDelete,
        collectedIds,
        selectedItems,
        isSelected,
        setDraggedItem,
        onDragEnter,
        onDragLeave,
        type
    } = props;

    const [isHovered, setIsHovered] = useState(false); // État pour gérer le survol

    const isInCollectedIds = item ? collectedIds.includes(item.id) : false;
    const isInSelectedItems = item ? selectedItems.includes(item.id) : false;
    

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
    // console.log(item)
    return (
        <div
            ref={drag}
            style={{opacity: isDragging ? 0.5 : 1}}
            className={`
                ${getBackgroundColor(type)} 
                ${isInCollectedIds ? getWidthClass(type) : ''} 
                ${isInCollectedIds ? 'hover:bg-sky-100 hover:text-sky-800' : 'hover:bg-gray-200 hover:text-gray-800'}
                flex flex-row relative text-black cursor-pointer m-2 rounded-md text-sm font-medium transition-all duration-300 bg-gray-100 hover:bg-gray-200 truncate
                ${isSelected && isInCollectedIds ? getBorderColor(type) : ''}`}
            onClick={() => onItemClick(item)}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onMouseEnter={() => setIsHovered(true)} // Gérer le survol
            onMouseLeave={() => setIsHovered(false)} // Gérer la sortie du survol
            title={item.nom}
        >
            <div className="flex items-center flex-row w-full">
                {/* Afficher l'icône de drag si l'élément est survolé */}
                {isInCollectedIds && (
                    isHovered && type !== 'root' ? (
                        <MdDragIndicator />
                    ) : (
                        <span className="w-4"></span>
                    )
                )}

                {/* Afficher le nom avec ellipsis et tooltip */}
                <span
                    className={`${isInCollectedIds ? 'p-2 text-base' : 'p-2 text-sm '} ${!isHovered && isInCollectedIds ? getTextColor(item.nature) : 'text-black'} font-normal flex-grow overflow-hidden text-ellipsis whitespace-nowrap`}
                    style={{maxWidth: '400px'}}
                    title={`${item.nom}${item.unite?.length > 0 ? ` (${item.libelle})` : ''}`}
                >
                    {item.nom}
                    {item.unite?.length > 0 && ` (${item.libelle})`}
                </span>

                {/* Bouton de suppression */}
                {isInCollectedIds && isHovered && type !== 'root' && (
                    <div className="ml-auto">
                        <button
                            className={"p-2 my-2 bg-red-500 hover:bg-red-700 rounded mr-4 text-white"}
                            onClick={(e) => {
                                e.stopPropagation(); // Empêche la propagation du clic
                                onDelete(item); // Appelle la méthode de suppression
                            }}
                            title={i18n.t("delete")}
                        >
                            <FaTrashAlt size={12}/>
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
        case 'root':
            return 'bg-sky-500'; // Fond gris clair pour les typeSites
        case 'element':
            return 'bg-sky-300';
        default:
            return 'bg-gray-100'; // Fond par défaut
    }
};

const getTextColor = (type) => {
    switch (type) {
        case 'root':
            return 'text-sky-50'; // Fond gris clair pour les typeSites
        case 'element':
            return 'text-sky-800'; // Fond gris clair pour les typeSites
        default:
            return 'text-gray-800'; // Fond par défaut
    }
};

// Définir la couleur de la bordure en fonction du type d'élément
const getBorderColor = (type) => {
    switch (type) {
        case 'root':
            return 'border-solid border-2 border-indigo-800'; // Fond gris clair pour les typeSites
        case 'element':
            return 'border-solid border-2 border-indigo-600'; // Fond gris clair pour les typeSites
    }
};

// Définir la largeur en fonction du type d'élément
const getWidthClass = (type) => {
    switch (type) {
        case 'root':
            return 'w-full ml-0'; // 100% pour les typeSites
        case 'element':
            return 'w-[90%] ml-[10%]'; // 10% moins large que les typeSites
        default:
            return 'w-full ml-0'; // Par défaut
    }
};

DraggableItem.displayName = 'DraggableItem';

export default DraggableItem;