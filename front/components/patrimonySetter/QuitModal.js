import React, {useEffect, useState} from 'react';
import {Modal} from "flowbite-react";
import {HiOutlineExclamationCircle} from "react-icons/hi";
import BioButton from "../button/BioButton";
import {FaSave, FaTimes, FaTrashAlt} from "react-icons/fa";
import i18n from "../../i18n";

const ChangeModal = ({isOpen, message, onClose, onConfirm, onSave}) => {
    const [selectedButton, setSelectedButton] = useState(0); // 0 pour Enregistrer, 1 pour Changer sans enregistrer, 2 pour Annuler

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                if (selectedButton === 0) {
                    onSave(); // Appelle la fonction onSave si Enregistrer est sélectionné
                } else if (selectedButton === 1) {
                    onConfirm(); // Appelle la fonction onConfirm si Changer sans enregistrer est sélectionné
                } else {
                    onClose(); // Appelle la fonction onClose si Annuler est sélectionné
                }
            }
            if (event.key === 'Escape') {
                onClose(); // Ferme le modal si la touche Échap est pressée
            }
            if (event.key === 'ArrowRight') {
                setSelectedButton((prev) => (prev + 1) % 3); // Sélectionne le bouton suivant
            }
            if (event.key === 'ArrowLeft') {
                setSelectedButton((prev) => (prev - 1 + 3) % 3); // Sélectionne le bouton précédent
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, selectedButton, onClose, onConfirm, onSave]);

    if (!isOpen) return null;

    return (
        <Modal show={isOpen} onClose={onClose} size="3xl" popup dismissible>
            <Modal.Header/>
            <Modal.Body>
                <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200"/>
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400 w-full text-center">
                    {i18n.t("unsavedChanges")}
                </h3>
                <p className="text-center">{message}</p>
            </Modal.Body>
            <Modal.Footer>
                <div className="flex justify-center gap-4 items-center w-full">
                    <BioButton color="failure" onClick={onConfirm}>
                        <FaTrashAlt size={15} className="mt-0.5 mr-2"/> {i18n.t("quitWithoutSaving")}
                    </BioButton>
                    <BioButton color="gray" onClick={onClose}>
                        <FaTimes size={15} className="mt-0.5 mr-2"/> {i18n.t("cancel")}
                    </BioButton>
                    <BioButton color={"success"} onClick={onSave}>
                        <FaSave size={15} className="mt-0.5 mr-2"/> {i18n.t("quitAndSave")}
                    </BioButton>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default ChangeModal;
