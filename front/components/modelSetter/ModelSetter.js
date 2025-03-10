import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
    addCaracteristiqueToEntite,
    addEntite,
    deleteAllCaracteristiquesTypeBien,
    deleteEntite,
    fetchCaracteristiques,
    fetchCaracteristiquesByTypeBienId,
    fetchComposants,
    fetchEquipements,
    fetchOuvrages,
    fetchSites,
    removeCaracteristiqueFromEntite,
    setCaracteristiquesForEntite,
    setEntity,
    setPersistanceUpdated,
    setWaitingPath,
    updateCaracteristiqueTypeBien,
    updateEntite
} from '@/redux/features/modelSetterSlice';
import CircularProgress from '@mui/material/CircularProgress'; // Importez CircularProgress
import {useAuth} from '../../providers/AuthProvider';
import ItemList from './ItemList';
import AddModal from './AddModal';
import ChangeModal from './ChangeModal';
import DeleteModal from './DeleteModal';
import {FaBan, FaClone, FaDraftingCompass, FaEdit, FaPlus, FaTimes, FaTrashAlt} from 'react-icons/fa'; // Assurez-vous d'importer les icônes
import EditModal from './EditModal';
import QuitModal from './QuitModal';
import {useToast} from "../../providers/toastProvider";
import BioButton from "../button/BioButton";
import i18n from "../../i18n";
import DuplicateModal from './DuplicateModal';


const ModelSetter = (typeSetted) => {
    const dispatch = useDispatch();
    const entity = useSelector((state) => state.models.model);
    const buttonEntities = useSelector((state) => state.models.buttonModels);
    const caracteristiques = useSelector((state) => state.models.caracteristiques); // Récupérez les caracteristiques
    const loading = useSelector((state) => state.models.loading); // Accédez à l'état de chargement
    const waitingPath = useSelector((state) => state.models.waitingPath);
    const [selectedItems, setSelectedItems] = useState([]);
    const [availableItems, setAvailableItems] = useState([]);
    const [currentEntity, setCurrentEntity] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isaddEntiteModalOpen, setIsaddEntiteModalOpen] = useState(false);
    const [isPersistanceUpdated, setIsPersistanceUpdated] = useState(true);
    const [newEntityId, setNewEntityId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [entityIdToChange, setEntityIdToChange] = useState(null);
    const [isdeleteEntiteModalOpen, setIsdeleteEntiteModalOpen] = useState(false);
    const [entityIdToDelete, setEntityIdToDelete] = useState(null);
    const [hoveredEntityId, setHoveredEntityId] = useState(null); // État pour gérer le survol
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [searchButtonsTerm, setSearchButtonsTerm] = useState("");
    const [isQuitModalOpen, setIsQuitModalOpen] = useState(false);
    const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
    const [caracteristiquesToDuplicate, setCaracteristiquesToDuplicate] = useState([]);
    const [toastMessage, setToastMessage] = useState(null);
    const {addToast} = useToast();

    const listRef = useRef(null);

    const {token} = useAuth();
    // console.log(token);

    const listTitle = typeSetted.typeSetted === 'site'
        ? i18n.t('ModelSetter.modelListTypeSite')
        : typeSetted.typeSetted === 'ouvrage'
            ? i18n.t('ModelSetter.modelListTypeOuvrage')
            : typeSetted.typeSetted === 'equipement'
                ? i18n.t('ModelSetter.modelListTypeEquipement')
                : typeSetted.typeSetted === 'composant'
                    ? i18n.t('ModelSetter.modelListTypeComposant')
                    : 'Type inconnu'; // Ajout d'un cas par défaut

    const modelTitle = typeSetted.typeSetted === 'site'
        ? i18n.t('ModelSetter.modelTitleTypeSite')
        : typeSetted.typeSetted === 'ouvrage'
            ? i18n.t('ModelSetter.modelTitleTypeOuvrage')
            : typeSetted.typeSetted === 'equipement'
                ? i18n.t('ModelSetter.modelTitleTypeEquipement')
                : typeSetted.typeSetted === 'composant'
                    ? i18n.t('ModelSetter.modelTitleTypeComposant')
                    : 'Type inconnu'; // Ajout d'un cas par défaut

    const filteredButtonEntities = buttonEntities
        .filter(entity => entity.nom && entity.nom.toLowerCase().includes(searchButtonsTerm.toLowerCase())) // Filtrer par nom et par terme de recherche
        .sort((a, b) => a.nom.localeCompare(b.nom));

    useEffect(() => {
        if (currentEntity && buttonEntities && buttonEntities.length > 0) {
            const isEntityIncluded = buttonEntities.some(entity => entity.id === currentEntity.id);
            if (!isEntityIncluded) {
                changeSite(buttonEntities[0].id);
            }
        }
        
    }, [typeSetted, currentEntity, buttonEntities]);

    useEffect(() => {
        const loadSites = async () => {
            switch (typeSetted.typeSetted) {
                case 'site':
                    await dispatch(fetchSites({token}));
                    break;
                case 'ouvrage':
                    await dispatch(fetchOuvrages({token}));
                    break;
                case 'equipement':
                    await dispatch(fetchEquipements({token}));
                    break;
                case 'composant':
                    await dispatch(fetchComposants({token}));
                    break;
                default:
                    return null;
            }
        };

        const loadCaracteristiques = async () => {
            await dispatch(fetchCaracteristiques({token}));
        };

        const loadData = async () => {
            await loadSites();
            await loadCaracteristiques();
        };

        loadData();
    }, [dispatch, typeSetted]);

    useEffect(() => {
        if (caracteristiques) {
            setSelectedItems(caracteristiques)
        }
        if (entity) {
            setCurrentEntity(entity)
        }
        if (entity && entity.length === 0 && buttonEntities && buttonEntities.length > 0) {
            handleSetEntity(buttonEntities[0].id)
        }
        return () => {
            // Nettoyage si nécessaire
        };
    }, [caracteristiques, entity, buttonEntities]);

    useEffect(() => {
        if (newEntityId && buttonEntities && buttonEntities.length > 0) {
            handleSetEntity(newEntityId);
            setNewEntityId(null); // Réinitialiser l'ID après l'avoir utilisé
        }
    }, [buttonEntities, newEntityId]);

    // Utilisez useEffect pour afficher le toast
    useEffect(() => {
        if (toastMessage) {
            showToast('info', toastMessage);
            setToastMessage(null); // Réinitialisez le message après l'affichage
        }
    }, [toastMessage]);

    useEffect(() => {
        if (waitingPath) {
            // setIsQuitModalOpen(currentEntity.id);
            setIsQuitModalOpen(true);
        }
    }, [waitingPath])

    // Ajouter le nouveau entiteType dans type_bien
    const handleAddEntity = async (newSite) => {
        try {
            // Attendre que l'ajout du entity soit terminé
            const resultaddEntite = await dispatch(addEntite({entity: newSite, token})).unwrap();
            if (resultaddEntite) {
                console.log(resultaddEntite.id);
                // Une fois l'ajout réussi, recharger la liste des typeSites
                // await dispatch(fetchSites({ token })).unwrap(); // Cela renvoie directement le payload
                switch (typeSetted.typeSetted) {
                    case 'site':
                        await dispatch(fetchSites({token}));
                        break; // Ajout du break ici
                    case 'ouvrage':
                        await dispatch(fetchOuvrages({token}));
                        break; // Ajout du break ici
                    case 'equipement':
                        await dispatch(fetchEquipements({token}));
                        break; // Ajout du break ici
                    case 'composant':
                        await dispatch(fetchComposants({token}));
                        break; // Ajout du break ici
                    default:
                        return null; // ou une valeur par défaut si nécessaire
                }
                setNewEntityId(resultaddEntite.id); // Stocker l'ID du entity ajouté
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout du entity ou du rechargement des typeSites:', error);
        }
    };

    const handleSetEntity = (entiteId) => {
        if (currentEntity && currentEntity.id !== entiteId && !isPersistanceUpdated) {
            // Ouvrir la modale
            setEntityIdToChange(entiteId);
            setIsModalOpen(true);
        } else {
            // Changer de entity directement
            changeSite(entiteId);
        }
    };

    const handleMenuItemClick = (entiteId) => {
        if (currentEntity && currentEntity.id !== entiteId && !isPersistanceUpdated) {
            // Ouvrir la modale
            setEntityIdToChange(entiteId);
            setIsModalOpen(true);
        } else {
            // Changer d'entité directement
            changeSite(entiteId);
        }
    };

    // /!\ A present il faut gerer le changement de entity sans avoir enregistré les carac du entity actuel
    const changeSite = (entiteId) => {
        if (buttonEntities && buttonEntities.length > 0) {
            const selectedSite = buttonEntities.find(entity => entity.id === entiteId);
            if (selectedSite) {
                // Dispatch l'action pour mettre à jour l'état avec les données du entity
                dispatch(setEntity(selectedSite)); // Utilisez l'objet trouvé
                // Récupérer les caractéristiques pour le type de bien associé
                if (selectedSite.id) { // Assurez-vous que typeBienId est disponible
                    dispatch(fetchCaracteristiquesByTypeBienId({typeBienId: selectedSite.id, token: token}))
                        .then(response => {
                            if (response.payload) {
                                dispatch(setCaracteristiquesForEntite({
                                    entiteId: selectedSite.id,
                                    caracteristiques: response.payload
                                }));
                                // Créer le tableau availableItems ici
                                const availableItems = [
                                    {
                                        id: selectedSite.id,
                                        nom: selectedSite.nom,
                                    },
                                    ...(response.payload && Array.isArray(response.payload) ?
                                        response.payload
                                            .map(caracteristique => ({
                                                id: caracteristique.caracteristique.id,
                                                nom: caracteristique.caracteristique.nom,
                                                priorite: caracteristique.priorite, // Assurez-vous que la priorité est incluse
                                                unite: caracteristique.caracteristique.unite ? caracteristique.caracteristique.unite.nom : "", // Assurez-vous que l'unité est incluse
                                                libelle: caracteristique.caracteristique.unite ? caracteristique.caracteristique.unite.libelle : ""
                                            }))
                                            .sort((a, b) => a.priorite - b.priorite) // Trier par priorité
                                        : []),
                                ];

                                // console.log("Available Items:", availableItems);

                                if (availableItems.length > 0) {
                                    setAvailableItems(availableItems);
                                }
                            } else {
                                const availableItems = [
                                    {
                                        id: selectedSite.id,
                                        nom: selectedSite.nom,
                                    }
                                ];

                                console.log("Available Items:", availableItems);

                                if (availableItems.length > 0) {
                                    setAvailableItems(availableItems);
                                }
                            }
                        });
                }
            } else {
                console.error('Site not found');
            }
        }
    };

    const handleSaveAndChangeSite = () => {
        handleSave(); // Enregistrer les modifications
        if (!waitingPath) {
            changeSite(entityIdToChange); // Changer de entity après l'enregistrement
        }
        setIsModalOpen(false); // Fermer la modale
    };

    const handleChangeSiteWithoutSaving = () => {
        if (!waitingPath) {
            changeSite(entityIdToChange); // Changer de entity après l'enregistrement
        }
        setIsPersistanceUpdated(true)
        dispatch(setPersistanceUpdated(true));
        setIsModalOpen(false); // Fermer la modale
    };

    const handleCancel = () => {
        setIsModalOpen(false); // Fermer la modale sans action
    };

    const handleAutoScroll = (event) => {
        if (!listRef.current) return;

        const {clientY} = event;
        const {top, bottom} = listRef.current.getBoundingClientRect();

        if (clientY < top + 50) {
            listRef.current.scrollBy(0, -10);
        } else if (clientY > bottom - 50) {
            listRef.current.scrollBy(0, 10);
        }
    };

    const handleDeselect = (item) => {
        if (!currentEntity) {
            console.error("currentEntity is not defined");
            return; // Sortir de la fonction si currentEntity n'est pas défini
        }

        // Créer l'objet de caractéristique à ajouter
        const caracteristiqueToAdd = {
            caracteristique: {
                id: item.id,
                nom: item.nom,
                unite: item.unite || [], // Assurez-vous d'inclure les unités si nécessaire
                libelle: item.libelle
            },
            TypeBien: {
                id: currentEntity.id, // Assurez-vous que `currentEntity` est défini
                nom: currentEntity.nom,
            },
            priorite: availableItems.length, // Définissez la priorité selon vos besoins
        };

        // Vérifier si la caractéristique existe déjà dans le entity
        const entity = buttonEntities.find(entity => entity.id === currentEntity.id);
        // console.log(entity);

        const caracteristiqueExists = entity && Array.isArray(entity.caracteristiques) && entity.caracteristiques.some(car => car.caracteristique.id === caracteristiqueToAdd.caracteristique.id);

        if (caracteristiqueExists) {
            console.log("La caractéristique existe déjà, aucune action effectuée.");
            return; // Sortir de la fonction si la caractéristique existe déjà
        }

        // console.log('caracteristiqueToAdd : ', caracteristiqueToAdd);

        // Dispatch l'action pour ajouter la caractéristique au entity
        dispatch(addCaracteristiqueToEntite({entiteId: currentEntity.id, caracteristique: caracteristiqueToAdd}));

        // Mettre à jour availableItems sans écrasement
        const updatedAvailableItems = [
            ...availableItems, // Conservez les éléments existants
            {
                id: caracteristiqueToAdd.caracteristique.id,
                nom: caracteristiqueToAdd.caracteristique.nom,
                priorite: caracteristiqueToAdd.priorite,
                unite: caracteristiqueToAdd.caracteristique.unite,
                libelle: caracteristiqueToAdd.caracteristique.libelle
            },
        ];
        // Mettre à jour l'état avec les nouveaux éléments disponibles
        setAvailableItems(updatedAvailableItems);
        setIsPersistanceUpdated(false)
        dispatch(setPersistanceUpdated(false))
    };

    const handleDelete = (item) => {
        // Vérifiez que l'élément à supprimer est défini
        if (!item) {
            console.error("L'élément à supprimer n'est pas défini");
            return;
        }

        // Filtrer les éléments pour exclure l'élément à supprimer
        const updatedItems = availableItems.filter(existingItem => existingItem.id !== item.id);

        // Mettre à jour l'état avec le nouveau tableau
        setAvailableItems(updatedItems);

        // Si vous devez également mettre à jour le store Redux, vous pouvez le faire ici
        dispatch(removeCaracteristiqueFromEntite({entiteId: currentEntity.id, caracteristiqueId: item.id}));
        setIsPersistanceUpdated(false)
        dispatch(setPersistanceUpdated(false))
    };

// Fonction pour filtrer les éléments sélectionnés
    const filteredSelectedItems = selectedItems
        .filter(item => {
            const normalizedItemName = item.nom.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Normaliser et enlever les accents
            const normalizedSearchTerm = searchTerm.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Normaliser et enlever les accents

            // Vérifiez si l'élément n'est pas dans availableItems
            const isInAvailableItems = availableItems.some(availableItem => availableItem.id === item.id);

            // Retourner vrai si l'élément correspond au terme de recherche et n'est pas dans availableItems
            return !isInAvailableItems && normalizedItemName.toLowerCase().includes(normalizedSearchTerm.toLowerCase());
        })
        .sort((a, b) => {
            const normalizedA = a.nom.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
            const normalizedB = b.nom.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
            return normalizedA.localeCompare(normalizedB); // Tri par ordre alphabétique
        });

    // /!\ Gerer les ids pour faire en sorte qu'ils soient uniques dans availableitems
    // (tempids dans caracteristiques au chargement et dans typebien au chargement)
    const handleDrop = (draggedItem, items, hoveredItemId) => {
        const draggedIndex = items.findIndex(item => item.id === draggedItem.id);
        const targetIndex = items.findIndex(item => item.id === hoveredItemId);

        // Vérifiez que l'élément déplacé et l'élément cible existent et qu'ils ne sont pas identiques
        if (draggedIndex !== -1 && draggedItem.id !== currentEntity.id && targetIndex !== -1 && draggedIndex !== targetIndex) {
            // Vérifiez si l'élément survolé correspond au currentEntity
            const hoveredItem = items[targetIndex];
            // comparaison sur les tempids
            if (hoveredItem.id !== currentEntity.id) { // Empêche le déplacement si l'élément survolé est le currentEntity
                const updatedItems = [...items];
                const [movedItem] = updatedItems.splice(draggedIndex, 1); // Retirer l'élément déplacé
                updatedItems.splice(targetIndex, 0, movedItem); // Insérer l'élément déplacé à la position de l'élément survolé

                // Mettre à jour les priorités en fonction de la nouvelle position, en excluant currentEntity
                const updatedItemsWithPriorities = updatedItems
                    .filter(item => item.id !== currentEntity.id) // Exclure currentEntity
                    .map((item, index) => ({
                        ...item,
                        priorite: index + 1 // La priorité commence à 1
                    }));

                // Mettez à jour l'état avec la nouvelle liste
                setAvailableItems(updatedItems); // Mettre à jour les éléments disponibles

                const caracteristiquesToAdd = updatedItemsWithPriorities
                    .filter(item => item.id !== currentEntity.id) // Exclure currentEntity
                    .map((item) => ({
                        caracteristique: {
                            id: item.id,
                            nom: item.nom,
                            unite: item.unite, // Assurez-vous d'inclure les unités si nécessaire
                        },
                        TypeBien: {
                            id: currentEntity.id, // Assurez-vous que `currentEntity` est défini
                            nom: currentEntity.nom,
                        },
                        priorite: item.priorite, // Utiliser la priorité mise à jour
                    }));

                console.log('caracteristiquesToAdd : ', caracteristiquesToAdd);

                // Mettre à jour les caractéristiques dans Redux
                dispatch(setCaracteristiquesForEntite({
                    entiteId: currentEntity.id,
                    caracteristiques: caracteristiquesToAdd
                }));

                // Si vous avez besoin de mettre à jour le entity, vous pouvez le faire ici
                const newSite = updatedItemsWithPriorities[targetIndex]; // L'élément qui a pris la place
                setEntity(newSite); // Mettre à jour le entity avec le nouvel élément
                setIsPersistanceUpdated(false)
                dispatch(setPersistanceUpdated(false))

                console.log('État mis à jour avec les éléments:', updatedItemsWithPriorities);
            } else {
                console.log('Déplacement non autorisé : l\'élément survolé est le currentEntity.');
            }
        }
    };

    const handleSave = async () => {
        if (!currentEntity || currentEntity.length === 0) {
            console.error("currentEntity is not defined or empty");
            return; // Sortir de la fonction si currentEntity n'est pas défini ou vide
        }
        const entiteId = currentEntity.id; // ID du entity actuel
        const existingCaracteristiques = buttonEntities.find(entity => entity.id === entiteId).caracteristiques;
        if (existingCaracteristiques && existingCaracteristiques.length > 0) {
            // Construire le tableau d'objets à envoyer
            const caracteristiquesToSend = existingCaracteristiques.map((car, index) => ({
                caracteristiqueId: car.caracteristique.id,
                typeBienId: currentEntity.id,
                priorite: index + 1 // Priorité basée sur la position dans la liste
            }));

            // Dispatch avec la clé correcte
            dispatch(updateCaracteristiqueTypeBien({caracteristiques: caracteristiquesToSend, token}))
                .unwrap()
                .then(() => {
                    dispatch(setPersistanceUpdated(true));
                    setIsPersistanceUpdated(true)
                    addToast({message: i18n.t("toast.success"), type: "success"});
                })
                .catch((err) => {
                    console.error("Erreur lors de la mise à jour :", err);
                });
        } else {
            // Dispatch avec la clé correcte
            dispatch(deleteAllCaracteristiquesTypeBien({typeBienId: currentEntity.id, token}))
                .unwrap()
                .then(() => {
                    console.log("Mise à jour réussie !");
                    dispatch(setPersistanceUpdated(true))
                    setIsPersistanceUpdated(true)
                    addToast({message: i18n.t("toast.success"), type: "success"});
                })
                .catch((err) => {
                    console.error("Erreur lors de la mise à jour :", err);
                });
        }
    };

    const handleClear = () => {
        setSearchTerm('');
    };

    const handleDeleteEntity = (entiteId) => {
        const entity = buttonEntities.find(entity => entity.id === entiteId);
        const existingCaracteristiques = entity.caracteristiques;

        if (existingCaracteristiques && existingCaracteristiques.length > 0) {
            // Ouvrir la modale pour demander la confirmation
            setEntityIdToDelete(entiteId);
            setIsdeleteEntiteModalOpen(true);
        } else {
            // Si pas de caractéristiques, supprimer directement le entity
            dispatch(deleteEntite({entite: entiteId, token}))
                .then(() => {
                    setAvailableItems([])
                })
        }
    };

    const handleConfirmDelete = () => {
        if (entityIdToDelete) {
            dispatch(deleteAllCaracteristiquesTypeBien({typeBienId: entityIdToDelete, token}))
                .then(() => {
                    dispatch(deleteEntite({entite: entityIdToDelete, token}))
                        .then(() => {
                            setAvailableItems([])
                            changeSite(buttonEntities[0].id)
                        })
                })
                .catch(error => {
                    console.error('Erreur lors de la suppression des caractéristiques:', error);
                });
        }
        setIsdeleteEntiteModalOpen(false); // Fermer la modale après confirmation
    };

    const handleCancelDelete = () => {
        setIsdeleteEntiteModalOpen(false); // Fermer la modale sans supprimer
    };

    const openEditModal = () => {
        setIsEditModalOpen(true);
    };

    const closeModal = () => {
        setIsEditModalOpen(false);
    };

    const closeQuitModal = () => {
        dispatch(setWaitingPath(false))
        setIsQuitModalOpen(false);
    };

    const closeDuplicateModal = () => {
        setIsDuplicateModalOpen(false);
    }

    const handleEditEntity = async (updatedEntity) => {
        try {
            // Attendre que la mise à jour de l'entité soit terminée
            const resultUpdateEntite = await dispatch(updateEntite({entity: updatedEntity, token})).unwrap();

            if (resultUpdateEntite) {
                console.log(resultUpdateEntite.id);
                // Une fois la mise à jour réussie, recharger la liste des entités
                switch (typeSetted.typeSetted) {
                    case 'site':
                        await dispatch(fetchSites({token}));
                        break;
                    case 'ouvrage':
                        await dispatch(fetchOuvrages({token}));
                        break;
                    case 'equipement':
                        await dispatch(fetchEquipements({token}));
                        break;
                    case 'composant':
                        await dispatch(fetchComposants({token}));
                        break;
                    default:
                        return null; // ou une valeur par défaut si nécessaire
                }
                // Vous pouvez également mettre à jour l'état local si nécessaire
                setNewEntityId(resultUpdateEntite.id);
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'entité ou du rechargement des entités:', error);
        }
    };

    const handleSearchButtonsClear = () => {
        setSearchButtonsTerm(""); // Réinitialiser le terme de recherche
    }

    const handleDuplicateButtonClick = () => {
        console.log(currentEntity);
        if (buttonEntities && buttonEntities.length > 0) {
            const selectedSite = buttonEntities.find(entity => entity.id === currentEntity.id);
            if (selectedSite && selectedSite.caracteristiques) {
                // console.log(selectedSite.caracteristiques);
                setCaracteristiquesToDuplicate(selectedSite.caracteristiques)
            }
        }
    }

    return (
        <div className="h-full bg-gray-50 flex flex-row">
            <div className="w-1/4 h-full p-4 border-r border-gray-200 bg-white shadow-md flex flex-col">
                <h2 className="text-lg font-bold text-primary mb-4">{listTitle}</h2>

                <div className="mb-4 flex flex-row border rounded-xl">
                    <input
                        className={"w-[98%] border-0 rounded-xl focus:ring-0"}
                        type="text"
                        placeholder={i18n.t('search')}
                        value={searchButtonsTerm}
                        onChange={(e) => setSearchButtonsTerm(e.target.value)}
                    />
                    {searchButtonsTerm && (
                        <button
                            className="mr-4"
                            onClick={handleSearchButtonsClear}
                            aria-label="Clear search"
                        >
                            <FaTimes className="text-gray-500"/>
                        </button>
                    )}
                </div>
                <div className='max-h-full overflow-y-auto'>
                    <ul className="space-y-2"> {/* Limiter la hauteur et ajouter overflow */}
                    {filteredButtonEntities.map((entity) => (
                        <li
                            key={entity.id}
                            onClick={() => handleSetEntity(entity.id)}
                            title={entity.nom}
                            onMouseEnter={() => setHoveredEntityId(entity.id)}
                            onMouseLeave={() => setHoveredEntityId(null)}
                            className={`flex flex-row text-black cursor-pointer p-1 rounded-md text-sm transition-all duration-300  
                                ${currentEntity?.id === entity.id ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'} truncate`}
                        >
                            <p className="p-1">{entity.nom}</p>
                            {currentEntity?.id === entity.id && hoveredEntityId === entity.id && (
                                <p className="ml-auto">
                                    <button
                                        className={"p-1 bg-white hover:bg-gray-300 rounded mr-1 mt-1"}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openEditModal();
                                        }}
                                        title="Éditer"
                                    >
                                        <FaEdit size={12} className="text-black" />
                                    </button>
                                    <button
                                        className={"p-1 bg-red-500 hover:bg-red-700 rounded mr-1 mt-1"}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteEntity(entity.id);
                                        }}
                                        title="Supprimer"
                                    >
                                        <FaTrashAlt size={12} />
                                    </button>
                                </p>
                            )}
                            {/* hoveredEntityId !== entity.id */}
                            {currentEntity?.id === entity.id && hoveredEntityId !== entity.id && entity.arbo?.equipements && (
                                <div className="ml-auto flex flex-col items-center" title={i18n.t('hasNotOuvrages')}>
                                    <FaDraftingCompass className="text-sm text-gray-600 mt-2" />
                                    <FaBan className="text-gray-400 text-2xl -mt-5" /> {/* Utilisez une marge négative pour superposer */}
                                </div>
                            )}
                            {currentEntity?.id === entity.id && hoveredEntityId !== entity.id && entity.arbo?.ouvrages && (
                                <div className="ml-auto flex flex-col items-center">
                                    <FaDraftingCompass className="text-sm text-gray-600 mt-1 mr-1" />
                                </div>
                            )}
                            {currentEntity?.id !== entity.id && entity.arbo?.equipements && (
                                <div className="ml-auto flex flex-col items-center" title={i18n.t('hasNotOuvrages')}>
                                    <FaDraftingCompass className="text-sm text-gray-600 mt-2" />
                                    <FaBan className="text-gray-400 text-2xl -mt-5" /> {/* Utilisez une marge négative pour superposer */}
                                </div>
                            )}
                            {currentEntity?.id !== entity.id && entity.arbo?.ouvrages && (
                                <div className="ml-auto flex flex-col items-center">
                                    <FaDraftingCompass className="text-sm text-gray-600 mt-1 mr-1" />
                                </div>
                            )}
                        </li>
                    ))}
                    </ul>
                </div>
                
                <div className="ml-auto mt-6">
                    <BioButton
                        color={"primary"}
                        onClick={() => setIsaddEntiteModalOpen(true)}
                        className="bottom-4 right-4 flex flex-row items-center justify-center"
                    >
                        <FaPlus size={15}
                                className={"mt-0.5 mr-2"}/> {i18n.t("addEntityTitle") + typeSetted.typeSetted}
                    </BioButton>
                </div>
            </div>

            <div className="w-2/4 h-full p-4 flex flex-col">
                <div className="flex flex-row justify-between">
                    <>
                        <div className="flex flex-row items-center"><h2 className="text-lg font-bold text-primary mb-4">{modelTitle}</h2>
                        {loading && <CircularProgress className="ml-2 p-1 loading mb-3" size={24}/>}</div>
                    </>
                    <BioButton
                        onClick={() => {
                            handleDuplicateButtonClick()
                            setIsDuplicateModalOpen(true);
                        }}
                        color={"success"}
                        aria-label={i18n.t("duplicate")}
                        title={i18n.t("duplicate")}>
                        <FaClone size={15} className={"mt-0.5 mr-2"}/>
                            {i18n.t("duplicate")}
                    </BioButton>
                </div>
                <div ref={listRef} className="h-full overflow-y-auto mb-8">
                    <ItemList
                        items={availableItems}
                        isAvailableItems={true}
                        onDelete={handleDelete}
                        selectedItems={selectedItems}
                        currentEntity={currentEntity}
                        parentId={currentEntity ? currentEntity.id : null}
                        onDrop={handleDrop}
                        handleAutoScroll={handleAutoScroll}
                        buttonEntities={buttonEntities}
                        isArbo={true}
                    />
                </div>
                <BioButton
                    color={"success"}
                    onClick={handleSave}
                    className=""
                >
                    {i18n.t('save')}
                </BioButton>
            </div>

            <div className="w-1/4 h-full p-4 border-r border-gray-200 bg-white shadow-md flex flex-col">
                <h2 className="text-lg font-bold text-primary mb-4">{i18n.t("typeCharacteristics")}</h2>
                {availableItems.length > 0 && (
                    <>
                        <div className="mb-4 flex flex-row border rounded-xl">
                            <input
                                type="text"
                                placeholder={i18n.t("searchPlaceholder")}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-[98%] p-2 m-1 border-0 rounded-md focus:ring-0"
                            />
                            {searchTerm && (
                                <button
                                    className="mr-4"
                                    onClick={handleClear}
                                    aria-label="Clear search"
                                >
                                    <FaTimes className="text-gray-500"/>
                                </button>
                            )}
                        </div>
                        <ItemList
                            items={filteredSelectedItems}
                            onItemClick={handleDeselect}
                            onDelete={handleDelete}
                            selectedItems={selectedItems}
                            onDrop={handleDrop}
                            isArbo={false}
                        />
                    </>
                )}
            </div>
            <ChangeModal
                isOpen={isModalOpen}
                message={i18n.t("unsavedChangesMessage")}
                onClose={handleCancel}
                onConfirm={handleChangeSiteWithoutSaving}
                onSave={handleSaveAndChangeSite}
            />
            <AddModal
                typeSetted={typeSetted}
                isOpen={isaddEntiteModalOpen}
                onClose={() => setIsaddEntiteModalOpen(false)}
                onAdd={handleAddEntity}
            />
            {/* Afficher la modale de confirmation */}
            <DeleteModal
                isOpen={isdeleteEntiteModalOpen}
                title="Confirmation de suppression"
                message={i18n.t("deleteConfirmationTitle")}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
            <EditModal
                isOpen={isEditModalOpen}
                onClose={closeModal}
                onEdit={handleEditEntity}
                entity={currentEntity ? currentEntity : entity}
            />
            <QuitModal
                isOpen={isQuitModalOpen}
                message={i18n.t('noSaveMessage')}
                onClose={closeQuitModal}
                onConfirm={handleChangeSiteWithoutSaving}
                onSave={handleSaveAndChangeSite}
            />
            <DuplicateModal
                typeSetted={typeSetted}
                entityToDuplicate={currentEntity}
                caracteristiquesToDuplicate={caracteristiquesToDuplicate}
                buttonEntities={buttonEntities}
                isOpen={isDuplicateModalOpen}
                message={i18n.t('noSaveMessage')}
                onClose={closeDuplicateModal}
                onConfirm={handleChangeSiteWithoutSaving}
                onSave={handleSaveAndChangeSite}
            />
        </div>
    );
};

export default ModelSetter;