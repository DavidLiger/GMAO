import {useEffect, useState} from "react";
import {Modal, TextInput} from "flowbite-react";
import {HiOutlineClipboardDocumentList} from "react-icons/hi2";
import BioButton from "../button/BioButton";
import {FaSave, FaTimes} from "react-icons/fa";
import i18n from "../../i18n";

const EditModal = ({isOpen, onClose, onEdit, entity}) => {

    const [entityName, setEntityName] = useState(entity.nom); // Pré-remplir avec le nom de l'entité
    const [selectedButton, setSelectedButton] = useState(1); // 0 pour Annuler, 1 pour Modifier

    useEffect(() => {
        // Récupérer les données de l'entité
        setEntityName(entity.nom);
    }, [entity]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                if (selectedButton === 0) {
                    onClose(); // Appelle la fonction de fermeture si Annuler est sélectionné
                } else {
                    handleSubmit(event); // Appelle la fonction de soumission si Modifier est sélectionné
                }
            }
            if (event.key === 'Escape') {
                onClose(); // Ferme le modal si la touche Échap est pressée
            }
            if (event.key === 'ArrowRight') {
                setSelectedButton(1); // Sélectionne le bouton Modifier
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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (entityName) {
            const updatedEntity = {
                ...entity,
                nom: entityName, // Mettre à jour le nom de l'entité
            };
            onEdit(updatedEntity); // Appeler la fonction onEdit avec l'entité mise à jour
            setEntityName(''); // Réinitialiser le nom de l'entité
            onClose(); // Fermer le modal
        }
    };

    if (!isOpen) return null;

    return (
        <Modal show={isOpen} size="md" onClose={onClose} popup>
            <Modal.Header/>
            <Modal.Body>
                <HiOutlineClipboardDocumentList
                    className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200"/>
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400 w-full text-center">
                    {i18n.t("updateEntity")}</h3>
                <TextInput name="text" placeholder={i18n.t("editEntityPlaceholder")}
                           onChange={(e) => setEntityName(e.target.value)}
                           value={entityName}/>
            </Modal.Body>
            <Modal.Footer>
                <div className="flex justify-center gap-4 items-center w-full">
                    <BioButton color="gray" onClick={onClose}>
                        <FaTimes size={15} className="mt-0.5 mr-2"/> {i18n.t("cancel")}
                    </BioButton>
                    <BioButton color={"success"} onClick={onSave}>
                        <FaSave size={15} className="mt-0.5 mr-2"/> {i18n.t("saveAndChange")}
                    </BioButton>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default EditModal;