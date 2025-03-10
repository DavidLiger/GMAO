import React, {useEffect, useState} from 'react';
import DraggableItem from './DraggableItem'; // Assurez-vous d'importer le composant DraggableItem
import { useDispatch } from 'react-redux';
import { toggleShow, toggleShowForSitePR } from '@/redux/features/siteSlice';
import { useDrop } from 'react-dnd';
import store from '@/redux/store';
import {useAuth} from '../../providers/AuthProvider';

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

const DroppableItem = ({item, onDrop, children, allItems, onDragEnter, onDragLeave, hoveredItemId}) => {
    const [{isOver, canDrop}, drop] = useDrop(() => ({
        accept: 'item',
        drop: (draggedItem) => {
            if (draggedItem) {
                const targetItem = findItemById(allItems, item.id);
                if (targetItem) {
                    // Passer la liste appropriée à onDrop en fonction du type d'élément
                    let itemsToUpdate;
                    if (targetItem.nature === 'site') {
                        itemsToUpdate = targetItem.ouvrages;
                    } else if (targetItem.nature === 'site_PR') {
                        itemsToUpdate = targetItem.equipements;
                    } else if (targetItem.nature === 'ouvrage') {
                        itemsToUpdate = targetItem.equipements;
                    } else if (targetItem.nature === 'equipement') {
                        itemsToUpdate = targetItem.composants;
                    }

                    // Passer hoveredItemId à onDrop
                    onDrop(draggedItem, itemsToUpdate, hoveredItemId);
                }
            }
        },
        collect: (monitor) => {
            const draggedItem = monitor.getItem();
            const isSameScope = draggedItem && item.id === draggedItem.parentId;
            return {
                isOver: monitor.isOver() && isSameScope && monitor.canDrop(),
                canDrop: monitor.canDrop(),
            };
        },
    }), [item, onDrop, allItems, hoveredItemId]);

    return (
        <li
            ref={drop}
            onDragEnter={() => {
                if (onDragEnter) { // Vérification si onDragEnter est défini
                    onDragEnter(item.id);
                }
            }}
            onDragLeave={() => {
                if (onDragLeave) { // Vérification si onDragLeave est défini
                    onDragLeave();
                }
            }}
            style={{
                border: isOver ? '2px solid blue' : 'none',
                // padding: '1px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                // margin: '4px 0',
                backgroundColor: isOver ? '#f0f8ff' : 'transparent',
                width: '100%',
                borderRadius: '5px' // Ajout de l'arrondi des angles
            }}
        >
            {children}
        </li>
    );
};

const ItemList = ({
                      items,
                      buttonSites,
                      onItemClick,
                      onDelete,
                      selectedItems,
                      isAvailableItems,
                      currentSite,
                      onDrop,
                      newChildrenId,
                      handleAutoScroll,
                      setAvailableItems,
                      setIsPersistanceUpdated
                  }) => {
    const dispatch = useDispatch();
    const [menuOpen, setMenuOpen] = useState(null); // Gérer quel menu est ouvert
    const [selectedItemId, setSelectedItemId] = useState(null); // État pour l'élément sélectionné
    const [expandedItems, setExpandedItems] = useState({}); // État pour gérer les éléments développés
    const [draggedItem, setDraggedItem] = useState(null); // État pour l'élément glissé
    const [hoveredItemId, setHoveredItemId] = useState(null);
    const [childrenIds, setChildrenIds] = useState([])
    const [parentIdToDelete, setParentIdToDelete] = useState(null);
    const [itemWaitingToBeDeleted, setItemWaitingToBeDeleted] = useState(null);

    const {token} = useAuth();

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

    const findChildrensIds = (id) => {
        const childrenIds = [];

        const findChildren = (items, id) => {
            items.forEach((item) => {
                if (item.id === id) {
                    if (item.ouvrages) {
                        childrenIds.push(...item.ouvrages.map(ouvrage => ouvrage.id));
                    }
                } else if (item.ouvrages) {
                    findChildren(item.ouvrages, id);
                }
            });
        };

        findChildren(items, id);

        const findChildrenOuvrages = (ouvrages, id) => {
            ouvrages.forEach((ouvrage) => {
                if (ouvrage.id === id) {
                    if (ouvrage.equipements) {
                        childrenIds.push(...ouvrage.equipements.map(equipement => equipement.id));
                    }
                } else if (ouvrage.equipements) {
                    findChildrenEquipements(ouvrage.equipements, id);
                }
            });
        };

        const findChildrenEquipements = (equipements, id) => {
            equipements.forEach((equipement) => {
                if (equipement.id === id) {
                    if (equipement.composants) {
                        childrenIds.push(...equipement.composants.map(composant => composant.id));
                    }
                }
            });
        };

        items.forEach((item) => {
            if (item.ouvrages) {
                findChildrenOuvrages(item.ouvrages, id);
            }
        });
        console.log(childrenIds);

        return childrenIds;
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

  const handleExpandToggle = (itemId) => {
    if (currentSite) {
      // Étape 1 : Mettre à jour l'état local
      setExpandedItems((prev) => ({
        ...prev,
        [itemId]: !prev[itemId], // Inverser l'état d'expansion pour cet ID
      }));
  
      // Étape 2 : Effectuer l'opération asynchrone
      let stateUpdated = null;
      if (currentSite.nature === 'site') {
        stateUpdated = dispatch(toggleShow({ siteId: currentSite.id, itemId }));
      } else if (currentSite.nature === 'site_PR') {
        stateUpdated = dispatch(toggleShowForSitePR({ siteId: currentSite.id, itemId }));
      } else {
        console.warn("Type de currentSite non reconnu:", currentSite.nature);
        return; // Sortir si le type n'est pas reconnu
      }
  
      // Étape 3 : Gérer le résultat de l'action
      stateUpdated.then(resultAction => {
        if (toggleShow.fulfilled.match(resultAction) || toggleShowForSitePR.fulfilled.match(resultAction)) {
          // L'état a été mis à jour avec succès
          console.log('L\'état a été mis à jour:', resultAction.payload);
          setAvailableItems([store.getState().sites.sites[0]]);
          setIsPersistanceUpdated(false)
        } else {
          console.error('Échec de la mise à jour de l\'état:', resultAction.error);
        }
      }).catch(error => {
        console.error('Erreur lors de la mise à jour de l\'état:', error);
      });
    } else {
      console.warn("currentSite n'est pas défini. Impossible de mettre à jour le siteSlice.");
    }
  };

    const initializeExpandedItems = (items) => {
        const initialExpandedItems = {};
        items.forEach(item => {
            initialExpandedItems[item.id] = item.show; // Utiliser la propriété show pour déterminer l'état d'expansion
            if (item.ouvrages) {
                Object.assign(initialExpandedItems, initializeExpandedItems(item.ouvrages));
            }
            if (item.equipements) {
                Object.assign(initialExpandedItems, initializeExpandedItems(item.equipements));
            }
            if (item.composants) {
                Object.assign(initialExpandedItems, initializeExpandedItems(item.composants));
            }
        });
        return initialExpandedItems;
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

        const initialExpandedItems = initializeExpandedItems(items);
        setExpandedItems(initialExpandedItems);

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [items, newChildrenId]);

  // Fonction récursive pour afficher les éléments imbriqués et collecter les IDs
  const renderItems = (items, draggedItem) => {
    const collectedIds = []; // Variable locale pour stocker les IDs
    // const render = (items) => {
      return items.map((item, index) => {
        if (isAvailableItems) {
          collectedIds.push(item.id); // Ajouter l'ID de l'élément courant
        }

            const hasSubItems = item.ouvrages && item.ouvrages.length > 0 || item.equipements && item.equipements.length > 0 || item.composants && item.composants.length > 0;

            // Vérifier si l'élément a des sous-éléments
            if (item.ouvrages && item.ouvrages.length > 0) {
                return (
                    <DroppableItem
                        key={item.id}
                        item={item}
                        onDrop={onDrop}
                        allItems={items}
                        hoveredItemId={hoveredItemId} // Passer hoveredItemId ici
                        draggedItem={draggedItem}>
                        <DraggableItem
                            item={item}
                            onDrag={handleAutoScroll} // Ajoutez cet événement
                            onItemClick={() => {
                                onItemClick(item);
                                setSelectedItemId(item.id); // Mettre à jour l'ID de l'élément sélectionné
                                const ids = findChildrensIds(item.id);
                                setChildrenIds(ids);
                            }}
                            onDelete={onDelete}
                            selectedItems={selectedItems}
                            isInAvailableItems={true}
                            menuOpen={menuOpen}
                            handleMenuToggle={handleMenuToggle}
                            collectedIds={collectedIds} // Passer les IDs collectés
                            isMenuOpen={menuOpen === item.id} // Passer si le menu est ouvert
                            isSelected={selectedItemId === item.id} // Passer si l'élément est sélectionné
                            handleExpandToggle={handleExpandToggle} // Passer la fonction d'expansion
                            isExpanded={item.show} // Utiliser l'état du slice pour déterminer l'état d'expansion
                            hasSubItems={hasSubItems}
                            setDraggedItem={setDraggedItem}
                            onDragEnter={() => handleDragEnter(item.id)} // Passer la fonction de gestion de l'entrée de glissement
                            onDragLeave={handleDragLeave}
                            childrenIds={childrenIds}
                            index={index + 1}
                        />
                        {expandedItems[item.id] && ( // Afficher les sous-éléments si l'élément est développé
                            <ul className="ml-4"> {/* Indentation pour les sous-éléments */}
                                {item.ouvrages && item.ouvrages.length > 0 && renderItems(item.ouvrages)} {/* Récursivement afficher les ouvrages */}
                                {item.equipements && item.equipements.length > 0 && renderItems(item.equipements)} {/* Récursivement afficher les équipements */}
                                {item.composants && item.composants.length > 0 && renderItems(item.composants)} {/* Récursivement afficher les composants */}
                            </ul>
                        )}
                    </DroppableItem>
                );
            }
            // Vérifier si l'élément est un ouvrage
            else if (item.equipements && item.equipements.length > 0) {
                return (
                    <DroppableItem
                        key={item.id}
                        item={item}
                        onDrop={onDrop}
                        allItems={items}
                        hoveredItemId={hoveredItemId} // Passer hoveredItemId ici
                        draggedItem={draggedItem}>
                        <DraggableItem
                            item={item}
                            onDrag={handleAutoScroll} // Ajoutez cet événement
                            onItemClick={() => {
                                onItemClick(item);
                                setSelectedItemId(item.id); // Mettre à jour l'ID de l'élément sélectionné
                                const ids = findChildrensIds(item.id);
                                setChildrenIds(ids);
                            }}
                            onDelete={onDelete}
                            selectedItems={selectedItems}
                            isInAvailableItems={true}
                            menuOpen={menuOpen}
                            handleMenuToggle={handleMenuToggle}
                            collectedIds={collectedIds} // Passer les IDs collectés
                            isMenuOpen={menuOpen === item.id} // Passer si le menu est ouvert
                            isSelected={selectedItemId === item.id} // Passer si l'élément est sélectionné // Passer si l'élément est sélectionné
                            handleExpandToggle={handleExpandToggle} // Passer la fonction d'expansion
                            isExpanded={item.show} // Utiliser l'état du slice pour déterminer l'état d'expansion
                            hasSubItems={hasSubItems}
                            setDraggedItem={setDraggedItem}
                            onDragEnter={() => handleDragEnter(item.id)} // Passer la fonction de gestion de l'entrée de glissement
                            onDragLeave={handleDragLeave}
                            childrenIds={childrenIds}
                            index={index + 1}
                        />
                        {expandedItems[item.id] && ( // Afficher les sous-éléments si l'élément est développé
                            <ul className="ml-4"> {/* Indentation pour les sous-éléments */}
                                {item.ouvrages && item.ouvrages.length > 0 && renderItems(item.ouvrages)} {/* Récursivement afficher les ouvrages */}
                                {item.equipements && item.equipements.length > 0 && renderItems(item.equipements)} {/* Récursivement afficher les équipements */}
                                {item.composants && item.composants.length > 0 && renderItems(item.composants)} {/* Récursivement afficher les composants */}
                            </ul>
                        )}
                    </DroppableItem>
                );
            }
            // Vérifier si l'élément est un équipement
            else if (item.composants && item.composants.length > 0) {
                return (
                    <DroppableItem
                        key={item.id}
                        item={item}
                        onDrop={onDrop}
                        allItems={items}
                        hoveredItemId={hoveredItemId} // Passer hoveredItemId ici
                        draggedItem={draggedItem}>
                        <DraggableItem
                            item={item}
                            onDrag={handleAutoScroll} // Ajoutez cet événement
                            onItemClick={() => {
                                onItemClick(item);
                                setSelectedItemId(item.id); // Mettre à jour l'ID de l'élément sélectionné
                                const ids = findChildrensIds(item.id);
                                setChildrenIds(ids);
                            }}
                            onDelete={onDelete}
                            selectedItems={selectedItems}
                            isInAvailableItems={true}
                            menuOpen={menuOpen}
                            handleMenuToggle={handleMenuToggle}
                            collectedIds={collectedIds} // Passer les IDs collectés
                            isMenuOpen={menuOpen === item.id} // Passer si le menu est ouvert
                            isSelected={selectedItemId === item.id} // Passer si l'élément est sélectionné // Passer si l'élément est sélectionné
                            handleExpandToggle={handleExpandToggle} // Passer la fonction d'expansion
                            isExpanded={item.show} // Utiliser l'état du slice pour déterminer l'état d'expansion
                            hasSubItems={hasSubItems}
                            setDraggedItem={setDraggedItem}
                            onDragEnter={() => handleDragEnter(item.id)} // Passer la fonction de gestion de l'entrée de glissement
                            onDragLeave={handleDragLeave}
                            childrenIds={childrenIds}
                            index={index + 1}
                        />
                        {expandedItems[item.id] && ( // Afficher les sous-éléments si l'élément est développé
                            <ul className="ml-4"> {/* Indentation pour les sous-éléments */}
                                {item.ouvrages && item.ouvrages.length > 0 && renderItems(item.ouvrages)} {/* Récursivement afficher les ouvrages */}
                                {item.equipements && item.equipements.length > 0 && renderItems(item.equipements)} {/* Récursivement afficher les équipements */}
                                {item.composants && item.composants.length > 0 && renderItems(item.composants)} {/* Récursivement afficher les composants */}
                            </ul>
                        )}
                    </DroppableItem>
                );
            } else {
                return (
                    <li key={item.id}> {/* Utiliser item.id comme clé */}
                        <DraggableItem
                            item={item}
                            onDrag={handleAutoScroll} // Ajoutez cet événement
                            onItemClick={() => {
                                onItemClick(item);
                                setSelectedItemId(item.id); // Mettre à jour l'ID de l'élément sélectionné
                            }}
                            onDelete={onDelete}
                            selectedItems={selectedItems}
                            menuOpen={menuOpen}
                            handleMenuToggle={handleMenuToggle}
                            collectedIds={collectedIds} // Passer les IDs collectés
                            isMenuOpen={menuOpen === item.id} // Passer si le menu est ouvert
                            isSelected={selectedItemId === item.id}
                            setDraggedItem={setDraggedItem} // Passer si l'élément est sélectionné
                            onDragEnter={() => handleDragEnter(item.id)} // Passer la fonction de gestion de l'entrée de glissement
                            onDragLeave={handleDragLeave}
                            childrenIds={childrenIds}
                            index={index + 1}
                        />
                    </li>
                );
            }
        });
        // };

    };

    return (

        <ul className="list-none mb-4 flex flex-col"> {/* Alignement à droite et 100% de largeur */}
            {renderItems(items, draggedItem)} {/* Appel de la fonction récursive */}
        </ul>
    );
};

export default ItemList;