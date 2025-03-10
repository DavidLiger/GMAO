import React, {useEffect, useState} from 'react';
import DraggableItem from './DraggableItem'; // Assurez-vous d'importer le composant DraggableItem
import {useDrop} from 'react-dnd';

const findItemById = (items, id) => {
    for (const item of items) {
        if (item.id === id) {
            return item; // Retourner l'élément si l'ID correspond
        }
        // Vérifier les sous-éléments
        const foundInSubItems = findItemById(item.ouvrages || [], id) ||
            findItemById(item.equipements || [], id) ||
            findItemById(item.composants || [], id);
        if (foundInSubItems) {
            return foundInSubItems; // Retourner l'élément trouvé dans les sous-éléments
        }
    }
    return null; // Retourner null si l'élément n'est pas trouvé
};

const DroppableItem = ({item, onDrop, children, allItems, hoveredItemId}) => {
    const [{isOver, canDrop}, drop] = useDrop(() => ({
        accept: 'item',
        drop: (draggedItem) => {
            if (draggedItem) {
                // Ici, vous pouvez simplement ajouter l'élément à une liste commune
                onDrop(draggedItem, allItems, hoveredItemId);
            }
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    }), [item, onDrop, hoveredItemId]);

    return (
        <div
            ref={drop}
            className={"max-h-full overflow-y-auto"}
        >
            {children}
        </div>
    );
};

const ItemList = ({
                      items,
                      onItemClick,
                      onDelete,
                      selectedItems,
                      isAvailableItems,
                      onDrop,
                      newChildrenId,
                      handleAutoScroll,
                      isArbo
                  }) => {
    const [menuOpen, setMenuOpen] = useState(null); // Gérer quel menu est ouvert
    const [selectedItemId, setSelectedItemId] = useState(null); // État pour l'élément sélectionné
    const [draggedItem, setDraggedItem] = useState(null); // État pour l'élément glissé
    const [hoveredItemId, setHoveredItemId] = useState(null);
    const [parentIdToDelete, setParentIdToDelete] = useState(null);
    const [itemWaitingToBeDeleted, setItemWaitingToBeDeleted] = useState(null);
    

    const findParent = (id, items) => {
        for (const item of items) {
            if (item.id === id) {
                return item.parentId; // Supposons que chaque item a une propriété parentId
            }
            // Vérifiez les sous-éléments récursivement
            const subItems = item.ouvrages || item.equipements || item.composants;
            if (subItems) {
                const parentId = findParent(id, subItems);
                if (parentId) {
                    return parentId;
                }
            }
        }
        return null; // Si aucun parent n'est trouvé
    };

    const handleDragEnter = (id) => {
        setHoveredItemId(id);
    };

    const handleDragLeave = () => {
        // Ne rien faire ici pour conserver l'ID survolé
    };

    const handleMenuToggle = (id) => {
        console.log(id);
        const parentId = findParent(id, items);
        setItemWaitingToBeDeleted(id)
        setParentIdToDelete(parentId);
        console.log(itemWaitingToBeDeleted, parentIdToDelete);

        setMenuOpen(menuOpen === id ? null : id); // Ouvrir ou fermer le menu
    };


    // Fermer le menu si un clic est effectué en dehors
    useEffect(() => {
        const handleClickOutside = (event) => {
            const menuElements = document.querySelectorAll('.menu'); // Sélectionner tous les éléments de menu
            const isClickInsideMenu = Array.from(menuElements).some(menu => menu.contains(event.target));
            if (!isClickInsideMenu) {
                setMenuOpen(null); // Fermer le menu
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [items, newChildrenId]);

    // Fonction récursive pour afficher les éléments imbriqués et collecter les IDs
    const renderItems = (items) => {
        const collectedIds = []; // Variable locale pour stocker les IDs

        // Vérifiez si la liste d'éléments est disponible
        if (!items || items.length === 0) {
            return null; // Retourner null si aucun élément n'est disponible
        }

        return (
            <DroppableItem
                item={{}} // Vous pouvez passer un objet vide ou un objet approprié
                onDrop={(draggedItem, targetId, hoveredItemId) => {
                    // Ignorer le premier élément lors du dépôt
                    if (items[0].id !== targetId) {
                        onDrop(draggedItem, targetId, hoveredItemId);
                    }
                }}
                allItems={items}
                hoveredItemId={hoveredItemId}
            >
                <ul className=""> {/* Alignement à droite et 100% de largeur */}
                    {items.map((item, index) => {
                        if (isAvailableItems) {
                            collectedIds.push(item.id); // Ajouter l'ID de l'élément courant
                        }

                        const itemType = !isArbo ? '' : (index === 0 && isArbo ? 'root' : 'element');

                        return (
                            <li key={Math.random()}>
                                <DraggableItem
                                    item={item}
                                    type={itemType} // Passer le type approprié
                                    onDrag={handleAutoScroll}
                                    onItemClick={() => {
                                        onItemClick(item);
                                        setSelectedItemId(item.id);
                                    }}
                                    onDelete={onDelete}
                                    selectedItems={selectedItems}
                                    menuOpen={menuOpen}
                                    handleMenuToggle={handleMenuToggle}
                                    collectedIds={collectedIds}
                                    isMenuOpen={menuOpen === item.id}
                                    isSelected={selectedItemId === item.id}
                                    setDraggedItem={setDraggedItem}
                                    onDragEnter={() => handleDragEnter(item.id)}
                                    onDragLeave={handleDragLeave}
                                    index={index + 1} // Notez que l'index commence à 0 ici

                                />
                            </li>
                        );
                    })}
                </ul>
            </DroppableItem>
        );
    };

    return (
        <>
            {renderItems(items, draggedItem)} {/* Appel de la fonction récursive */}
        </>
    );
};

export default ItemList;