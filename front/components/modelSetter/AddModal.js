import {useEffect, useState} from "react";
import BioButton from "../button/BioButton";
import {Label, Modal, Radio, TextInput} from "flowbite-react";
import {HiOutlineClipboardDocumentList} from "react-icons/hi2";
import {FaCheck, FaTimes} from "react-icons/fa";
import i18n from "../../i18n";

const AddModal = ({typeSetted, isOpen, onClose, onAdd}) => {
    const [entityName, setEntityName] = useState('');
    const [hasOuvrages, setHasOuvrages] = useState(true); // État pour gérer la réponse à la question
    const [selectedButton, setSelectedButton] = useState(1); // 0 pour Annuler, 1 pour Ajouter

    const handleSubmit = (e) => {
        e.preventDefault();
        if (entityName) {
            const siteType = hasOuvrages === false ? 'site_PR' : 'site'; // Définir le type de site
            const newSite = {
                nom: entityName, // Utiliser 'nom' au lieu de 'name'
                nature: typeSetted.typeSetted,
                arbo: typeSetted.typeSetted === 'site' ? {
                    id: Date.now(),
                    nom: entityName,
                    nature: siteType,
                    show: true,
                    ouvrages: hasOuvrages === true ? [] : undefined, // Tableau d'ouvrages si oui
                    equipements: hasOuvrages === false ? [] : undefined // Tableau d'équipements si non
                } : null
            };
            onAdd(newSite); // Appeler la fonction onAdd avec le nouvel objet
            setEntityName(''); // Réinitialiser le nom du site
            setHasOuvrages(null); // Réinitialiser l'état
            onClose(); // Fermer le formulaire
        }
    };

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

    if (!isOpen) return null;

    return (
        <Modal show={isOpen} size="md" onClose={onClose} popup>
            <Modal.Header/>
            <Modal.Body>
                <HiOutlineClipboardDocumentList
                    className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200"/>
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400 w-full text-center">
                    {i18n.t("addEntityTitle") + typeSetted.typeSetted}</h3>
                <TextInput
                    type="text"
                    value={entityName}
                    onChange={(e) => setEntityName(e.target.value)}
                    placeholder={
                        typeSetted.typeSetted === 'site' || typeSetted.typeSetted === 'composant'
                            ? i18n.t("entityNamePlaceholder") + typeSetted.typeSetted
                            : i18n.t("entityNamePlaceholderAlt") + (typeSetted.typeSetted === 'equipement' ? 'équipement' : typeSetted.typeSetted)
                    }                    required
                    autoFocus
                />

                {typeSetted.typeSetted === 'site' &&
                    <div className="flex flex-col items-start space-y-2 mt-4">
                        <p className="mb-2">{i18n.t("siteHasOuvrages")}</p>
                        <Label className="flex items-center">
                            <Radio id="radio1" name="radio" checked={hasOuvrages === true}
                                   onChange={() => setHasOuvrages(true)}
                                   className="text-primary mr-2"/>
                            {i18n.t("yes")}
                        </Label>
                        <Label className="flex items-center">
                            <Radio id="radio2" name="radio" checked={hasOuvrages === false}
                                   onChange={() => setHasOuvrages(false)}
                                   className="text-primary mr-2"/>
                            {i18n.t("no")}
                        </Label>
                    </div>
                }
            </Modal.Body>
            <Modal.Footer>
                <div className="flex justify-center gap-4 items-center w-full">
                    <BioButton color="gray" onClick={onClose}>
                        <FaTimes size={15} className="mt-0.5 mr-2"/>{i18n.t("cancel")}
                    </BioButton>
                    <BioButton color="success" onClick={handleSubmit}
                               disabled={typeSetted.typeSetted === 'site' && hasOuvrages === null}>
                        <FaCheck size={15} className="mt-0.5 mr-3"/>{i18n.t("add")}
                    </BioButton>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default AddModal;