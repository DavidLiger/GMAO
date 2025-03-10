import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
    addComposant,
    addComposantForSitePR,
    addEquipement,
    addEquipementForSitePR,
    addOuvrage,
    addSite,
    deleteComposant,
    deleteComposantForSitePR,
    deleteEquipement,
    deleteEquipementForSitePR,
    deleteOuvrage,
    deleteSite,
    fetchComposants,
    fetchEquipements,
    fetchOuvrages,
    fetchSiteById,
    fetchSites,
    updateOrder,
    updateOrderForSitePR,
    updateSite
} from '@/redux/features/siteSlice';
import CircularProgress from '@mui/material/CircularProgress'; // Importez CircularProgress
import WarningModal from './WarningModal';
import ConfirmationModal from './ConfirmationModal';
import ItemList from './ItemList';
import store from '@/redux/store';
import {useAuth} from '../../providers/AuthProvider';
import ChangeSiteConfirmationModal from './ChangeSiteConfirmationModal';
import {useToast} from "../../providers/toastProvider";
import {FaBan, FaDraftingCompass, FaTimes} from "react-icons/fa";
import BioButton from "../button/BioButton";
import {setPersistanceUpdated, setWaitingPath} from '@/redux/features/modelSetterSlice';
import QuitModal from './QuitModal';
import i18n from "../../i18n";

const generateRandomId = () => {
    return Math.floor(Math.random() * 10000000000);
};

const DualListSelector = () => {
    const dispatch = useDispatch();
    const buttonSites = useSelector((state) => state.sites.buttonSites); // Récupérez les sites des boutons
    const loading = useSelector((state) => state.sites.loading); // Accédez à l'état de chargement
    const error = useSelector((state) => state.sites.error);
    const waitingPath = useSelector((state) => state.models.waitingPath);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedItemsType, setSelectedItemsType] = useState(null);
    const [availableItems, setAvailableItems] = useState([]);
    const [currentSite, setCurrentSite] = useState(null);
    const [currentOuvrage, setCurrentOuvrage] = useState(null);
    const [currentEquipement, setCurrentEquipement] = useState(null);
    const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [itemToDelete, setItemToDelete] = useState(null);
    const [menuOpen, setMenuOpen] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [newChildrenId, setNewChildrenId] = useState(null);
    const [itemIdBeingDeleted, setItemIdBeingDeleted] = useState(null);
    const [parentIdOfItemDeleted, setParentIdOfItemDeleted] = useState(null);
    const [isPersistanceUpdated, setIsPersistanceUpdated] = useState(true);
    const [siteIdToChange, setSiteIdToChange] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isQuitModalOpen, setIsQuitModalOpen] = useState(false);
    const [searchButtonsTerm, setSearchButtonsTerm] = useState("");
    const listRef = useRef(null);
    const {addToast} = useToast();

    const prevButtonSitesRef = useRef();

    const {token} = useAuth();

    useEffect(() => {
        const loadSites = async () => {
            await dispatch(fetchSites({token}));
        };
        loadSites();
    }, [dispatch]);

    useEffect(() => {
        if (prevButtonSitesRef.current !== buttonSites) {
            prevButtonSitesRef.current = buttonSites; // Mettre à jour la référence
            if (!currentSite && buttonSites.length > 0) {
                handleSetSite(buttonSites[0].id)
            }
        }
    }, [buttonSites, currentSite]);

    useEffect(() => {
        if (waitingPath) {
            // setIsQuitModalOpen(currentEntity.id);
            setIsQuitModalOpen(true);
        }
    }, [waitingPath])

    const handleAddSite = async (newSite) => {
        try {

            // Attendre que l'ajout du site soit terminé
            await dispatch(addSite({site: newSite, token})).unwrap();

            // Une fois l'ajout réussi, recharger la liste des sites
            const resultAction = await dispatch(fetchSites({token})).unwrap(); // Cela renvoie directement le payload

            // À ce stade, resultAction est le payload, donc pas besoin de vérifier fulfilled
            if (resultAction && resultAction.length > 0) {
                const newSiteId = resultAction[resultAction.length - 1].id; // Récupérer le dernier site
                handleSetSite(newSiteId);
            } else {
                console.error('Aucun site récupéré après fetchSites');
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout du site ou du rechargement des sites:', error);
        }
    };

    const handleSetSite = (siteId) => {
        if (currentSite && currentSite.id !== siteId && !isPersistanceUpdated) {
            // Ouvrir la modale
            setSiteIdToChange(siteId);
            setIsModalOpen(true);
        } else {
            // Changer de site directement
            changeSite(siteId);
        }
    };

    // Fonction pour charger un site par ID
    const changeSite = async (siteId) => {
        try {
            const resultAction = await dispatch(fetchSiteById({site: siteId, token})).unwrap();
            const arbo = resultAction.arbo;
            setAvailableItems([arbo]);
            setCurrentSite(arbo);
            setCurrentOuvrage(null)
            setCurrentEquipement(null)
        } catch (error) {
            // Ici, error contiendra l'erreur lancée par unwrap()
            console.error('Error fetching site:', error.message || error); // Affichez le message d'erreur
        }
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

    // const handleSiteClick = (site) => {
    //   // setCurrentSite(site);
    //   setSelectedItemsType('ouvrage')
    //   setSelectedItems(ouvragesData);
    // };

    const handleSiteClick = async (site) => {
        setCurrentSite(site);
        setSelectedItemsType('ouvrage');
        const resultAction = await dispatch(fetchOuvrages({token}));
        if (fetchOuvrages.fulfilled.match(resultAction)) {
            setSelectedItems(resultAction.payload);
        } else {
            console.error('Erreur lors de la récupération des ouvrages:', resultAction.error);
        }
    };

    const handleSitePRClick = async (site) => {
        setCurrentSite(site);
        setSelectedItemsType('equipement')
        const resultAction = await dispatch(fetchEquipements({token}));
        if (fetchEquipements.fulfilled.match(resultAction)) {
            setSelectedItems(resultAction.payload);
        } else {
            console.error('Erreur lors de la récupération des equipements:', resultAction.error);
        }
    };

    const handleOuvrageClick = async (ouvrage) => {
        setCurrentOuvrage(ouvrage);
        setSelectedItemsType('equipement');
        const resultAction = await dispatch(fetchEquipements({token}));
        if (fetchEquipements.fulfilled.match(resultAction)) {
            setSelectedItems(resultAction.payload);
        } else {
            console.error('Erreur lors de la récupération des equipements:', resultAction.error);
        }
    };

    const handleEquipementClick = async (equipement) => {

        const findOuvrageParent = (parentId) => {
            for (const site of availableItems) {
                if (currentSite.nature === 'site_PR') {
                    const equipement = site.equipements.find(equipement => equipement.id === parentId);
                    if (equipement) return site; // Retourne le site contenant l'équipement
                } else {
                    for (const ouvrage of site.ouvrages) {
                        if (ouvrage.id === parentId) return ouvrage; // Retourne l'ouvrage
                    }
                }
            }
            return undefined;
        };

        if (currentSite.nature === 'site') {
            const ouvrage = findOuvrageParent(equipement.parentId);
            setCurrentOuvrage(ouvrage);

            if (currentOuvrage && currentOuvrage.id !== equipement.parentId) {
                const ouvrage = availableItems.find((site) => {
                    return site.ouvrages.find((ouvrage) => ouvrage.id === equipement.parentId);
                }).ouvrages.find((ouvrage) => ouvrage.id === equipement.parentId);
                setCurrentOuvrage(ouvrage);
            }
            setCurrentEquipement(equipement);
            setSelectedItemsType('composant')
            // setSelectedItems(composantsData);
            const resultAction = await dispatch(fetchComposants({token}));
            if (fetchComposants.fulfilled.match(resultAction)) {
                setSelectedItems(resultAction.payload);
            } else {
                console.error('Erreur lors de la récupération des ouvrages:', resultAction.error);
            }
        } else {
            setCurrentEquipement(equipement);
            setSelectedItemsType('composant')
            const resultAction = await dispatch(fetchComposants({token}));
            if (fetchComposants.fulfilled.match(resultAction)) {
                setSelectedItems(resultAction.payload);
            } else {
                console.error('Erreur lors de la récupération des ouvrages:', resultAction.error);
            }
        }
    };

    const handleComposantClick = (composant) => {
        const findEquipementParent = (composantId) => {
            for (const site of availableItems) {
                if (currentSite.nature === 'site_PR') {
                    const equipement = site.equipements.find(equipement => equipement.id === composantId);
                    if (equipement) return equipement;
                } else {
                    for (const ouvrage of site.ouvrages) {
                        if (ouvrage.equipements && Array.isArray(ouvrage.equipements)) {
                            const equipement = ouvrage.equipements.find(equipement => equipement.id === composantId);
                            if (equipement) return equipement;
                        }
                    }
                }
            }
            return undefined;
        };

        const findOuvrageParent = (parentId) => {
            for (const site of availableItems) {
                if (currentSite.nature === 'site_PR') {
                    const equipement = site.equipements.find(equipement => equipement.id === parentId);
                    if (equipement) return site; // Retourne le site contenant l'équipement
                } else {
                    for (const ouvrage of site.ouvrages) {
                        if (ouvrage.id === parentId) return ouvrage; // Retourne l'ouvrage
                    }
                }
            }
            return undefined;
        };

        const equipementParent = findEquipementParent(composant.parentId);

        if (equipementParent) {
            if (!currentEquipement || currentEquipement && currentEquipement.id !== equipementParent.id) {
                setCurrentEquipement(equipementParent);

                if (!currentOuvrage || currentOuvrage && currentOuvrage.id !== equipementParent.parentId) {
                    const ouvrage = findOuvrageParent(equipementParent.parentId);
                    setCurrentOuvrage(ouvrage);
                }
            }
        }
    };

    const closeWarningModal = () => {
        setIsWarningModalOpen(false);
    };

    const closeConfirmationModal = () => {
        setIsConfirmationModalOpen(false);
        setItemToDelete(null);
    };

    const handleDeselect = (item) => {
        const newItem = {...item, id_type: item.id, id: generateRandomId(), show: true};

        const showWarning = (message) => {
            setModalMessage(message);
            setIsWarningModalOpen(true);
        };

        const addItem = (dispatchAction, additionalData) => {
            const stateUpdated = dispatch(dispatchAction({
                siteId: currentSite.id,
                ...additionalData
            }));

            stateUpdated.then(resultAction => {
                if (dispatchAction.fulfilled.match(resultAction)) {
                    // L'état a été mis à jour avec succès
                    setNewChildrenId(newItem.id);

                    // Mettez à jour le site
                    const realSiteButton = buttonSites.find(buttonSite => buttonSite.arbo.id === currentSite.id);
                    if (realSiteButton) {
                        setAvailableItems([store.getState().sites.sites[0]]);
                        setIsPersistanceUpdated(false)
                        dispatch(setPersistanceUpdated(false))
                    } else {
                        console.error('Site non trouvé avec arboId:', currentSite.id);
                    }
                } else {
                    console.error('Échec de la mise à jour de l\'état:', resultAction.error);
                }
            }).catch(error => {
                console.error('Erreur lors de la mise à jour de l\'état:', error);
            });
        };

        if (!currentSite) {
            showWarning("Vous devez d'abord sélectionner un site.");
            return;
        }

        switch (item.nature) {
            case 'ouvrage':
                addItem(addOuvrage, {ouvrage: {...newItem, parentId: currentSite.id}});
                break;

            case 'equipement':

                if (currentSite.nature === 'site') {
                    if (!currentOuvrage) {
                        showWarning("Vous devez d'abord sélectionner un ouvrage pour ajouter un équipement.");
                        return;
                    }

                    addItem(addEquipement, {
                        ouvrageId: currentOuvrage.id,
                        equipement: {...newItem, parentId: currentOuvrage.id}
                    });
                } else if (currentSite.nature === 'site_PR') {
                    addItem(addEquipementForSitePR, {equipement: {...newItem, parentId: currentSite.id}});
                }
                break;

            case 'composant':
                if (currentSite.nature === 'site') {
                    if (!currentOuvrage) {
                        showWarning("Vous devez d'abord sélectionner un ouvrage pour ajouter un composant.");
                        return;
                    }
                    if (!currentEquipement) {
                        showWarning("Vous devez d'abord sélectionner un équipement pour ajouter un composant.");
                        return;
                    }
                    addItem(addComposant, {
                        ouvrageId: currentOuvrage.id,
                        equipementId: currentEquipement.id,
                        composant: {...newItem, parentId: currentEquipement.id}
                    });
                } else if (currentSite.nature === 'site_PR') {
                    if (!currentEquipement) {
                        showWarning("Vous devez d'abord sélectionner un équipement pour ajouter un composant.");
                        return;
                    }
                    addItem(addComposantForSitePR, {
                        equipementId: currentEquipement.id,
                        composant: {...newItem, parentId: currentEquipement.id}
                    });
                }
                break;

            default:
                console.warn("Type d'élément non reconnu.");
        }
    };

    const handleDelete = (item) => {
        setMenuOpen(null);
        const hasChildren = (item.nature === 'ouvrage' && item.equipements && item.equipements.length > 0) ||
            (item.nature === 'equipement' && item.composants && item.composants.length > 0);

        if (hasChildren) {
            setModalMessage(`Êtes-vous sûr de vouloir supprimer cet élément ? Cela supprimera tous les éléments imbriqués.`);
            setItemToDelete(item);
            setIsConfirmationModalOpen(true);
        } else if (item.nature === 'site' || item.nature === 'site_PR') {
            setModalMessage(`Êtes-vous sûr de vouloir supprimer ce site ?`)
            setItemToDelete(item);
            setIsConfirmationModalOpen(true);
        } else {
            performDelete(item);
        }
    };

    const performDelete = (item) => {
        setParentIdOfItemDeleted(item.parentId);

        if (!currentSite) {
            console.warn("Aucun site sélectionné.");
            return;
        }

        let stateUpdated;

        switch (item.nature) {
            case 'site':
                dispatch(deleteSite({site: buttonSites.find(buttonSite => buttonSite.arbo.id === item.id).id, token}));
                break;

            case 'site_PR':
                dispatch(deleteSite({site: buttonSites.find(buttonSite => buttonSite.arbo.id === item.id).id, token}));
                break;

            case 'ouvrage':
                stateUpdated = dispatch(deleteOuvrage({siteId: currentSite.id, ouvrageId: item.id}));
                setCurrentOuvrage(null);
                setCurrentEquipement(null);
                break;

            case 'equipement':
                if (currentOuvrage && currentSite.nature === 'site') {
                    stateUpdated = dispatch(deleteEquipement({
                        siteId: currentSite.id,
                        ouvrageId: currentOuvrage.id,
                        equipementId: item.id
                    }));
                    setCurrentEquipement(null);
                } else if (currentSite.nature === 'site_PR') {
                    stateUpdated = dispatch(deleteEquipementForSitePR({siteId: currentSite.id, equipementId: item.id}));
                    setCurrentEquipement(null);
                }
                break;

            case 'composant':
                if (currentOuvrage && currentSite.nature === 'site') {
                    const equipementId = currentEquipement ? currentEquipement.id : item.parentId;
                    stateUpdated = dispatch(deleteComposant({
                        siteId: currentSite.id,
                        ouvrageId: currentOuvrage.id,
                        equipementId,
                        composantId: item.id
                    }));
                } else {
                    const equipementId = currentEquipement ? currentEquipement.id : item.parentId;
                    stateUpdated = dispatch(deleteComposantForSitePR({
                        siteId: currentSite.id,
                        equipementId,
                        composantId: item.id
                    }));
                }
                break;

            default:
                console.warn("Type d'élément non reconnu.");
                return;
        }

        if (item.nature !== 'site' && item.nature !== 'site_PR') {
            // Étape 3 : Gérer le résultat de l'action
            stateUpdated.then(resultAction => {
                if (deleteOuvrage.fulfilled.match(resultAction) ||
                    deleteEquipement.fulfilled.match(resultAction) ||
                    deleteEquipementForSitePR.fulfilled.match(resultAction) ||
                    deleteComposant.fulfilled.match(resultAction) ||
                    deleteComposantForSitePR.fulfilled.match(resultAction)) {

                    // Mettez à jour le site dans la base de données si nécessaire
                    const realSiteButton = buttonSites.find(buttonSite => buttonSite.arbo.id === currentSite.id);
                    if (realSiteButton) {
                        const realSiteId = realSiteButton.id; // Récupérer l'ID du site réel

                        // Préparez l'objet site avec la clé arbo
                        const updatedSite = {
                            id: realSiteId,
                            arbo: store.getState().sites.sites[0], // Mettez à jour la clé arbo avec les ouvrages mis à jour
                        };
                        setAvailableItems([store.getState().sites.sites[0]]);
                        setIsPersistanceUpdated(false)
                        dispatch(setPersistanceUpdated(false))
                    } else {
                        console.error('Site non trouvé avec arboId:', currentSite.id);
                    }
                } else {
                    console.error('Échec de la mise à jour de l\'état:', resultAction.error);
                }
            }).catch(error => {
                console.error('Erreur lors de la mise à jour de l\'état:', error);
            });
        } else {
            handleSetSite(buttonSites[0].id)
        }

        // Mise à jour de l'état local pour retirer l'élément supprimé
        setAvailableItems((prev) => prev.filter((selectedItem) => selectedItem.id !== item.id));
    };

    const handleConfirmDelete = () => {
        if (itemToDelete) {
            performDelete(itemToDelete);
            closeConfirmationModal();
        } else {
            console.warn('nothing to delete');
        }
    };

    // Fonction pour filtrer les éléments sélectionnés
    const filteredSelectedItems = selectedItems
        .filter(item => {
            const normalizedItemName = item.nom.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Normaliser et enlever les accents
            const normalizedSearchTerm = searchTerm.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Normaliser et enlever les accents

            return normalizedItemName.toLowerCase().includes(normalizedSearchTerm.toLowerCase());
        })
        .sort((a, b) => {
            const normalizedA = a.nom.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
            const normalizedB = b.nom.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
            return normalizedA.localeCompare(normalizedB); // Tri par ordre alphabétique
        });

    const handleDrop = (draggedItem, items, hoveredItemId) => {
        const draggedIndex = items.findIndex(item => item.id === draggedItem.id);
        const targetIndex = items.findIndex(item => item.id === hoveredItemId);

        if (draggedIndex !== -1 && targetIndex !== -1 && draggedIndex !== targetIndex) {
            const updatedItems = [...items];
            const [movedItem] = updatedItems.splice(draggedIndex, 1);
            updatedItems.splice(targetIndex, 0, movedItem);

            // Mettez à jour l'état avec la nouvelle liste
            if (currentSite.nature === 'site') {
                dispatch(updateOrder({parentId: draggedItem.parentId, newOrder: updatedItems}))
                    .then(() => {
                        setAvailableItems([store.getState().sites.sites[0]]);
                        setIsPersistanceUpdated(false)
                        dispatch(setPersistanceUpdated(false))
                    })
            } else if (currentSite.nature === 'site_PR') {
                dispatch(updateOrderForSitePR({parentId: draggedItem.parentId, newOrder: updatedItems}))
                    .then(() => {
                        setAvailableItems([store.getState().sites.sites[0]]);
                        setIsPersistanceUpdated(false)
                        dispatch(setPersistanceUpdated(false))
                    })
            }
        }
    };

    const handleSaveAndChangeSite = () => {
        handleSave(); // Enregistrer les modifications
        if (!waitingPath) {
            changeSite(siteIdToChange); // Changer de entity après l'enregistrement
        }
        setIsModalOpen(false); // Fermer la modale
    };

    const handleChangeSiteWithoutSaving = () => {
        if (!waitingPath) {
            changeSite(siteIdToChange); // Changer de entity après l'enregistrement
        }
        setIsPersistanceUpdated(true)
        dispatch(setPersistanceUpdated(true));
        setIsModalOpen(false); // Fermer la modale
    };

    const handleCancel = () => {
        setIsModalOpen(false); // Fermer la modale sans action
    };

    const handleClear = () => {
        setSearchTerm('');
    };

    const handleSave = (isChanging = false) => {
        const realSiteButton = buttonSites.find(buttonSite => buttonSite.arbo.id === currentSite.id);

        if (realSiteButton) {
            const realSiteId = realSiteButton.id; // Récupérer l'ID du site réel

            // Préparez l'objet site avec la clé arbo
            const updatedSite = {
                id: realSiteId, // Utilisez l'ID réel du site
                nature: currentSite.nature === 'site_PR' ? 'site' : currentSite.nature, // site_PR à mettre dans l'arbo
                nom: currentSite.nom,
                arbo: store.getState().sites.sites[0], // Mettez à jour la clé arbo avec les ouvrages mis à jour
            };

            // Mettez à jour le site dans la base de données
            dispatch(updateSite({site: updatedSite, token})).then(updateResultAction => {
                if (updateSite.fulfilled.match(updateResultAction)) {
                    // L'update du site a réussi, maintenant on peut fetch le site par ID
                    if (!isChanging) {
                        dispatch(fetchSiteById({site: realSiteId, token})).then(fetchResultAction => {
                            if (fetchSiteById.fulfilled.match(fetchResultAction)) {
                                // Mettez à jour l'état local avec le site récupéré
                                addToast({message: i18n.t("toast.success"), type: "success"});
                                setIsPersistanceUpdated(true)
                                dispatch(setPersistanceUpdated(true))
                            } else {
                                console.error('Échec de la récupération du site:', fetchResultAction.error);
                            }
                        });
                    } else {
                        addToast({message: i18n.t("toast.success"), type: "success"});
                        setIsPersistanceUpdated(true)
                        dispatch(setPersistanceUpdated(true))
                    }
                } else {
                    console.error('Échec de la mise à jour du site:', updateResultAction.error);
                }
            });
        } else {
            console.error('Site non trouvé avec arboId:', currentSite.id);
        }
    }

    const closeQuitModal = () => {
        dispatch(setWaitingPath(false))
        setIsQuitModalOpen(false);
    };

    const handleSearchButtonsClear = () => {
        setSearchButtonsTerm(""); // Réinitialiser le terme de recherche
    }

    const filteredButtonSites = buttonSites
    .filter(entity => 
        entity.nom && 
        entity.nom.toLowerCase().includes(searchButtonsTerm.toLowerCase())
    )
    .sort((a, b) => a.nom.localeCompare(b.nom));

    return (
        <>
            <div className="h-full bg-gray-50 flex flex-row">
                <div className=" w-1/4 h-full p-4 border-r border-gray-200 bg-white shadow-md flex flex-col">
                    <h2 className=" text-lg font-bold text-primary mb-4">{i18n.t('sitesTitle')}</h2>
                    <div className="flex-1 overflow-auto">
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
                        {/* Rendre les boutons pour chaque site */}
                        <ul className="space-y-2">
                            {filteredButtonSites
                                .filter(site => site.nom) // Filtrer les sites sans nom
                                .sort((a, b) => a.nom.localeCompare(b.nom))
                                .map((site) => (
                                    <li
                                        key={site.id}
                                        onClick={() => handleSetSite(site.id)}
                                        title={site.nom} // Affiche le nom complet au survol
                                        className={`flex flex-row text-black cursor-pointer p-2 rounded-md text-sm transition-all duration-300  
                                        ${currentSite?.id === site.arbo.id ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'} truncate`}
                                    >
                                        {site.nom}
                                        {site.arbo?.equipements && (
                                            <div className="ml-auto flex flex-col items-center" title={i18n.t('hasNotOuvrages')}>
                                                <FaDraftingCompass className="text-sm text-gray-600 mt-1" />
                                                <FaBan className="text-gray-400 text-2xl -mt-5" /> {/* Utilisez une marge négative pour superposer */}
                                            </div>
                                        )}
                                        {site.arbo?.ouvrages && (
                                            <div className="ml-auto flex flex-col items-center" title={i18n.t('hasOuvrages')}>
                                                <FaDraftingCompass className="text-sm text-gray-600 mt-1 mr-1" />
                                            </div>
                                        )}
                                    </li>     
                                ))}
                        </ul>
                    </div>
                </div>

                <div className="w-2/4 h-full p-4 flex flex-col"> {/* Colonne pour "Patrimoine" */}
                    <div className="flex flex-row">
                        <h2 className="text-lg font-bold text-primary mb-4">{i18n.t('arboTitle')}</h2>
                        {loading && <CircularProgress className="ml-2 p-1 loading" size={24}/>}
                        {error && <span className="error ml-2">{error}</span>}
                    </div>
                    <div ref={listRef} className="h-full overflow-auto mb-8">
                        <ItemList
                            items={availableItems}
                            isAvailableItems={true}
                            onItemClick={(item) => {
                                if (item.nature === 'site') {
                                    handleSiteClick(item);
                                } else if (item.nature === 'site_PR') {
                                    handleSitePRClick(item);
                                } else if (item.nature === 'ouvrage') {
                                    handleOuvrageClick(item);
                                } else if (item.nature === 'equipement') {
                                    handleEquipementClick(item);
                                } else if (item.nature === 'composant') {
                                    handleComposantClick(item);
                                }
                            }}
                            onDelete={handleDelete}
                            selectedItems={selectedItems}
                            currentSite={currentSite}
                            parentId={currentSite ? currentSite.id : null}
                            onDrop={handleDrop}
                            newChildrenId={newChildrenId}
                            itemIdBeingDeleted={itemIdBeingDeleted}
                            parentIdOfItemDeleted={parentIdOfItemDeleted}
                            handleAutoScroll={handleAutoScroll}
                            buttonSites={buttonSites}
                            setAvailableItems={setAvailableItems}
                            setIsPersistanceUpdated={setIsPersistanceUpdated}
                        />
                    </div>
                    <BioButton
                        color={"success"}
                        onClick={handleSave}
                        className=""
                    >
                        Enregistrer
                    </BioButton>
                </div>

                <div
                    className="w-1/4 h-full p-4 border-l border-gray-200 bg-white shadow-md flex flex-col"> {/* Colonne pour les types d'ouvrages */}
                    <h2 className="text-lg font-bold text-primary mb-4">
                        {selectedItemsType === 'ouvrage' ? i18n.t('ouvrageTypes') :
                            selectedItemsType === 'equipement' ? i18n.t('equipementTypes') :
                                selectedItemsType === 'composant' ? i18n.t('composantTypes') : ''}
                    </h2>
                    <div className="mb-4 flex flex-row border rounded-xl">
                        <input
                            type="text"
                            placeholder={i18n.t('search')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-[98%] border-0 rounded-xl focus:ring-0"
                        />
                        {searchTerm && ( // Affichez la croix seulement si searchTerm n'est pas vide
                            <button
                                className="mr-4"
                                onClick={handleClear}
                                aria-label={i18n.t('clearSearch ')}
                            >
                                <FaTimes className="text-gray-500"/>
                            </button>
                        )}
                    </div>
                    <div className="flex-1 overflow-auto">
                        <ItemList
                            items={filteredSelectedItems}
                            onItemClick={handleDeselect}
                            onDelete={handleDelete}
                            selectedItems={selectedItems}
                            onDrop={handleDrop}
                        />
                    </div>
                </div>

                <WarningModal
                    isOpen={isWarningModalOpen}
                    message={modalMessage}
                    onClose={closeWarningModal}
                />
                <ConfirmationModal
                    isOpen={isConfirmationModalOpen}
                    message={modalMessage}
                    onClose={closeConfirmationModal}
                    onConfirm={handleConfirmDelete}
                />
                <ChangeSiteConfirmationModal
                    isOpen={isModalOpen}
                    message={i18n.t('unsavedChangesMessage')}
                    onClose={handleCancel}
                    onConfirm={handleChangeSiteWithoutSaving}
                    onSave={handleSaveAndChangeSite}
                />
                <QuitModal
                    isOpen={isQuitModalOpen}
                    message={i18n.t('unsavedChangesMessage')}
                    onClose={closeQuitModal}
                    onConfirm={handleChangeSiteWithoutSaving}
                    onSave={handleSaveAndChangeSite}
                />
            </div>
        </>
    );
};

export default DualListSelector;
