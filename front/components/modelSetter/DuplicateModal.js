import {useEffect, useState} from "react";
import BioButton from "../button/BioButton";
import {Label, Modal, Radio, TextInput} from "flowbite-react";
import {HiOutlineClipboardDocumentList} from "react-icons/hi2";
import {FaCheck, FaClone, FaTimes} from "react-icons/fa";
import i18n from "../../i18n";
import { useAuth } from "../../providers/AuthProvider";
import { useDispatch, useSelector } from "react-redux";
import { createCaracteristiqueTypeBien, fetchCaracteristiquesByTypeBienId, updateCaracteristiqueTypeBien } from "@/redux/features/modelSetterSlice";
import { useToast } from "../../providers/toastProvider";
import { CircularProgress } from "@mui/material";

const DuplicateModal = ({typeSetted, isOpen, onClose, onAdd, entityToDuplicate, caracteristiquesToDuplicate, buttonEntities}) => {
    const dispatch = useDispatch();
    const loading = useSelector((state) => state.models.loading); // Accédez à l'état de chargement
    const [allSelected, setAllSelected] = useState(true);
    const [hasOuvrages, setHasOuvrages] = useState(true); // État pour gérer la réponse à la question
    const [selectedButton, setSelectedButton] = useState(1); // 0 pour Annuler, 1 pour Ajouterconst [checkedItems, setCheckedItems] = useState({});
    const [checkedItems, setCheckedItems] = useState({});
    const [selectedEntities, setSelectedEntities] = useState([]); // État pour les entités sélectionnées
    const [searchButtonsTerm, setSearchButtonsTerm] = useState("");
    const [searchSelectedButtonsTerm, setSearchSelectedButtonsTerm] = useState("");
    const {addToast} = useToast();

    const {token} = useAuth(); // Récupération du token d'authentification
    // console.log(token);
    

    useEffect(() => {
        // Initialiser les cases à cocher comme cochées
        const initialCheckedState = {};
        caracteristiquesToDuplicate.forEach(caracteristique => {
            initialCheckedState[caracteristique.caracteristique.nom] = true; // ou false selon votre logique
        });
        setCheckedItems(initialCheckedState);
    }, [caracteristiquesToDuplicate]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                if (selectedButton === 0) {
                    onClose(); // Appelle la fonction de fermeture si Annuler est sélectionné
                } else {
                    handleSubmit(event); // Appelle la fonction de soumission si Ajouter est sélectionné
                }
            }
            if (event.key === 'Escape') {
                onClose(); // Ferme le modal si la touche Échap est pressée
            }
            if (event.key === 'ArrowRight') {
                setSelectedButton(1); // Sélectionne le bouton Ajouter
            }
            if (event.key === 'ArrowLeft') {
                setSelectedButton(0); // Sélectionne le bouton Annuler
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, selectedButton, onClose]);

    const handleCheckboxChange = (name) => {
        setCheckedItems(prevState => ({
            ...prevState,
            [name]: !prevState[name], // Inverser l'état de la case à cocher
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault(); // Empêche le comportement par défaut du formulaire
    
        if (!selectedEntities || selectedEntities.length === 0) {
            console.error("selectedEntities is not defined or empty");
            return; // Sortir de la fonction si selectedEntities n'est pas défini ou vide
        }
    
        // Récupérer les caractéristiques à ajouter en fonction des checkedItems
        const caracteristiquesToAdd = Object.keys(checkedItems)
            .filter(name => checkedItems[name]) // Garder seulement les caractéristiques cochées
            .map(name => {
                // Trouver la caractéristique correspondante
                const caracteristique = caracteristiquesToDuplicate.find(car => car.caracteristique.nom === name);
                return caracteristique ? caracteristique.caracteristique.id : null; // Retourner l'ID de la caractéristique
            })
            .filter(id => id !== null); // Filtrer les valeurs null
    
        // Récupérer les caractéristiques existantes pour chaque selectedEntity
        const entitiesWithCaracteristiques = await Promise.all(selectedEntities.map(async (entity) => {
            const caracteristiques = await dispatch(fetchCaracteristiquesByTypeBienId({typeBienId: entity.id, token: token}));
            
            // Récupérer uniquement le payload
            const existingCaracteristiques = caracteristiques.payload || []; // Assurez-vous que payload existe
    
            return {
                entityId: entity.id,
                existingCaracteristiques: existingCaracteristiques, // Les caractéristiques existantes
            };
        }));
    
        // Construire le tableau d'entités à mettre à jour
        const entitiesToUpdate = [];
        const priorityMap = {}; // Pour suivre la priorité pour chaque typeBienId
    
        entitiesWithCaracteristiques.forEach(entityWithCaracteristiques => {
            const existingCount = entityWithCaracteristiques.existingCaracteristiques.length; // Nombre de caractéristiques existantes
            const typeBienId = entityWithCaracteristiques.entityId; // Utiliser l'ID de l'entité comme typeBienId
    
            // Initialiser la priorité pour ce typeBienId
            if (!priorityMap[typeBienId]) {
                priorityMap[typeBienId] = existingCount; // Commencer à partir du nombre de caractéristiques existantes
            }
    
            // Pour chaque caractéristique à ajouter, vérifier si elle existe déjà
            caracteristiquesToAdd.forEach((caracteristiqueId) => {
                // Vérifier si la caractéristique est déjà associée à l'entité
                const isAlreadyAssociated = entityWithCaracteristiques.existingCaracteristiques.some(existing => existing.caracteristique.id === caracteristiqueId);
    
                if (!isAlreadyAssociated) {
                    priorityMap[typeBienId] += 1; // Incrémenter la priorité pour chaque nouvelle caractéristique
                    entitiesToUpdate.push({
                        caracteristiqueId: caracteristiqueId,
                        typeBienId: typeBienId,
                        priorite: priorityMap[typeBienId], // Utiliser la priorité mise à jour
                    });
                }
            });
        });
        // Effectuer une création pour chaque entrée dans entitiesToUpdate
        for (const entity of entitiesToUpdate) {
            try {
                await dispatch(createCaracteristiqueTypeBien({caracteristique: entity, token})).unwrap();
            } catch (err) {
                console.error(`Erreur lors de la mise à jour pour caracteristiqueId ${entity.caracteristiqueId} et typeBienId ${entity.typeBienId}:`, err);
            }
        }
        addToast({message: i18n.t("toast.success"), type: "success"});
        onClose();
    };

    const filteredButtonEntities = buttonEntities
    .filter(entity => 
        entity.nom && 
        entity.nom.toLowerCase().includes(searchButtonsTerm.toLowerCase()) && 
        !selectedEntities.some(selected => selected.id === entity.id) // Exclure les entités sélectionnées
    )
    .sort((a, b) => a.nom.localeCompare(b.nom));

    const filteredSelectedButtonEntities = selectedEntities
    .filter(entity => 
        entity.nom && 
        entity.nom.toLowerCase().includes(searchSelectedButtonsTerm.toLowerCase())
    )
    .sort((a, b) => a.nom.localeCompare(b.nom));

    const handleSearchButtonsClear = () => {
        setSearchButtonsTerm(""); // Réinitialiser le terme de recherche
    }

    const handleSearchSelectedButtonsClear = () => {
        setSearchSelectedButtonsTerm(""); // Réinitialiser le terme de recherche
    }

    const handleButtonEntityClick = (entity) => {
        // Vérifier si l'entité est déjà sélectionnée
        if (!selectedEntities.some(selected => selected.id === entity.id)) {
            setSelectedEntities(prev => [...prev, entity]); // Ajouter l'entité à la liste
        }
    };

    const selectAllCarac = () => {
        const allCheckedItems = {};
        caracteristiquesToDuplicate.forEach(caracteristique => {
            const name = caracteristique.caracteristique.nom;
            allCheckedItems[name] = true; // Sélectionner toutes les caractéristiques
        });
        setCheckedItems(allCheckedItems); // Mettre à jour l'état
    }

    const deSelectAllCarac = () => {
        const allUncheckedItems = {};
        caracteristiquesToDuplicate.forEach(caracteristique => {
            const name = caracteristique.caracteristique.nom;
            allUncheckedItems[name] = false; // Désélectionner toutes les caractéristiques
        });
        setCheckedItems(allUncheckedItems); // Mettre à jour l'état
    }

    if (!isOpen) return null;

    return (
        <Modal show={isOpen} size="6xl" onClose={onClose} popup>
            <Modal.Header>
                <div className="flex flex-row items-center">
                    <h2 className="text-2xl font-bold text-primary mb-4">
                        {`${i18n.t("modal.duplicate.typeTitle")} ${entityToDuplicate.nom}`}
                    </h2>
                    {loading && <CircularProgress className="ml-2 p-1 loading mb-3" size={24}/>}
                </div>
            </Modal.Header>
            <Modal.Body className="min-h-[65vh] max-h-[65vh] w-full overflow-hidden overflow-x-hidden">
                <div className="flex flex-row">
                    {/* Rectangle en haut de la modale */}
                    <div className="text-lg font-bold text-primary">{i18n.t("modal.duplicate.explanation")}</div>
                    {/* Boutons pour sélectionner/désélectionner toutes les caractéristiques */}
                    <div className="flex justify-start mb-4 ml-4">
                        <button
                            className="bg-blue-500 text-white text-sm px-2 py-1 rounded hover:bg-blue-600"
                            onClick={() => {
                                if (allSelected) {
                                    deSelectAllCarac(); // Désélectionner toutes les caractéristiques
                                } else {
                                    selectAllCarac(); // Sélectionner toutes les caractéristiques
                                }
                                setAllSelected(!allSelected); // Basculer l'état
                            }}
                        >
                            {allSelected ? i18n.t('modal.duplicate.deselectAllCarac') : i18n.t('modal.duplicate.selectAllCarac')}
                        </button>
                    </div>
                </div>
                <div className="flex flex-wrap gap-4 p-4 shadow-md mb-4">
                    {caracteristiquesToDuplicate && caracteristiquesToDuplicate.map((caracteristique) => {
                        const name = caracteristique.caracteristique.nom; // Utiliser le nom comme clé
                        return (
                            <div key={name} className="flex items-center bg-gray-200 rounded-lg p-3 shadow-md">
                                <input
                                    type="checkbox"
                                    className="mr-2 focus:outline-none focus:ring-0"
                                    checked={checkedItems[name] || false} // Vérifier l'état de la case à cocher
                                    onChange={() => handleCheckboxChange(name)} // Gérer le changement
                                />
                                <label className="flex-1 truncate">{name}</label>
                            </div>
                        );
                    })}
                </div>

                {/* Conteneur pour le champ de recherche et les entités */}
                <div className="flex gap-4">
                    {/* Section de gauche : recherche et entités filtrées */}
                    <div className="flex-1">
                        {/* Input de recherche avec espace */}
                        <div className="mb-4 flex flex-col items-start">
                            <div className="flex flex-row">
                                <div className="text-lg font-bold text-primary">{`${i18n.t('modal.duplicate.selectAllEntities')} ${typeSetted.typeSetted}s`}</div>
                                    <button
                                        className="bg-blue-500 text-white text-sm px-2 py-1 rounded hover:bg-blue-600 ml-4"
                                        onClick={() => {
                                            if (selectedEntities.length > 0) {
                                                setSelectedEntities([]); // Vider la liste si toutes les entités sont sélectionnées
                                            } else {
                                                filteredButtonEntities.forEach(entity => {
                                                    if (!selectedEntities.some(selected => selected.id === entity.id)) {
                                                        setSelectedEntities(prev => [...prev, entity]);
                                                    }
                                                });
                                            }
                                        }}
                                    >
                                        {selectedEntities.length > 0 ? i18n.t('modal.duplicate.deselectAllCarac') : i18n.t('modal.duplicate.selectAllCarac')}
                                    </button>
                            </div>
                            <div className="text-lg font-bold text-gray-600 mt-4 ml-10">{i18n.language == 'fr' ? `${typeSetted.typeSetted.charAt(0).toUpperCase() + typeSetted.typeSetted.slice(1)}s ${i18n.t('modal.duplicate.disposable')}` : `${i18n.t('modal.duplicate.disposable')} ${typeSetted.typeSetted}s`}</div>
                                <div className="flex justify-between w-[88%] max-w-md border rounded-xl mb-2 mt-1 ml-[10%]">
                                    <input
                                        className="w-[92%] border-0 rounded-xl text-base focus:ring-0"
                                        type="text"
                                        placeholder={i18n.t('search')}
                                        value={searchButtonsTerm}
                                        onChange={(e) => setSearchButtonsTerm(e.target.value)}
                                    />
                                    {searchButtonsTerm && (
                                        <button
                                            className="mr-2"
                                            onClick={handleSearchButtonsClear}
                                            aria-label="Clear search"
                                        >
                                            <FaTimes className="text-gray-500" />
                                        </button>
                                    )}
                                </div>
                                <ul className="w-full max-w-md max-h-[calc(55vh-200px)] overflow-y-auto ml-10">
                                    {filteredButtonEntities.map((entity) => (
                                        <li
                                            key={entity.id}
                                            title={entity.nom}
                                            className={`flex flex-row relative text-gray-800 cursor-pointer m-2 rounded-md text-sm transition-all duration-300 
                                                bg-gray-100 hover:bg-gray-200 truncate`}
                                            onClick={() => handleButtonEntityClick(entity)}
                                        >
                                            <p className="p-2 truncate">{entity.nom}</p>
                                        </li>
                                    ))}
                                </ul>
                        </div>
                    </div>

                    {/* Section de droite : liste des entités sélectionnées */}
                    <div className="w-1/2 ml-8 pt-11">
                        <div className="text-lg font-bold text-gray-600 mb-1 ml-8">{i18n.language == 'fr' ? `${typeSetted.typeSetted.charAt(0).toUpperCase() + typeSetted.typeSetted.slice(1)}s ${i18n.t('modal.duplicate.selected')}` : `${i18n.t('modal.duplicate.selected')} ${typeSetted.typeSetted}s`}</div>
                        <div className="flex w-[80%] max-w-md border rounded-xl mb-2 ml-[8%]">
                            <input 
                                className="w-[94%] border-0 rounded-xl text-base focus:ring-0"
                                type="text"
                                placeholder={i18n.t('search')}
                                value={searchSelectedButtonsTerm}
                                onChange={(e) => setSearchSelectedButtonsTerm(e.target.value)}
                            />
                            {searchSelectedButtonsTerm && (
                                <button
                                    className="mr-2"
                                    onClick={handleSearchSelectedButtonsClear}
                                    aria-label="Clear search"
                                >
                                    <FaTimes className="text-gray-500" />
                                </button>
                            )}
                        </div>
                        <ul className="w-full max-w-md max-h-[calc(55vh-200px)] overflow-y-auto ml-8">
                            {filteredSelectedButtonEntities.map((entity) => (
                                <li 
                                    key={entity.id} 
                                    className={`flex flex-row justify-between relative text-gray-800 cursor-pointer m-2 rounded-md text-sm transition-all duration-300 
                                            bg-gray-100 hover:bg-gray-200 truncate`}>
                                    <p className="p-2 truncate">{entity.nom}</p>
                                    <button
                                        className="text-red-500 pr-2"
                                        onClick={() => setSelectedEntities(prev => prev.filter(e => e.id !== entity.id))}
                                    >
                                        <FaTimes />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div className="flex justify-between gap-4 items-center w-full">
                    <BioButton color="gray" onClick={onClose}>
                        <FaTimes size={15} className="mt-0.5 mr-2" />{i18n.t("cancel")}
                    </BioButton>
                    <BioButton color="success" onClick={handleSubmit}
                            disabled={typeSetted.typeSetted === 'site' && hasOuvrages === null}>
                        <FaClone size={15} className="mt-0.5 mr-3" />{i18n.t("duplicate")}
                    </BioButton>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default DuplicateModal;