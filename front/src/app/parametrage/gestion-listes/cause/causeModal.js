'use client'
import React, {useEffect, useState} from 'react';
import {FaCheck, FaSave, FaTimes, FaTrashAlt} from "react-icons/fa";
import {Modal} from "flowbite-react";
import BioButton from "../../../../../components/button/BioButton";
import {HiOutlineExclamationCircle} from "react-icons/hi";
import i18n from "../../../../../i18n";

const CauseModal = ({isOpen, onClose, onConfirm, title, children, typeAction}) => {
    const [selectedButton, setSelectedButton] = useState(1); // 0 pour Annuler, 1 pour Confirmer

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                if (selectedButton === 0) {
                    setSelectedButton(1);
                    onClose(); // Appelle la fonction de fermeture si Annuler est sélectionné
                } else {
                    onConfirm(); // Appelle la fonction de confirmation si Confirmer est sélectionné
                }
            }
            if (event.key === 'Escape') {
                setSelectedButton(1);
                onClose(); // Ferme le modal si la touche Échap est pressée
            }
            if (event.key === 'ArrowRight') {
                setSelectedButton(1); // Sélectionne le bouton Confirmer
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
    }, [isOpen, onClose, onConfirm, selectedButton]);

    if (!isOpen) return null;

    return (
        <Modal show={isOpen} onClose={onClose} popup>
            <Modal.Header />
            <Modal.Body>
                <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200"/>
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400 w-full text-center">
                    {title}
                </h3>
                <div className="text-center">{children}</div>
            </Modal.Body>
            <Modal.Footer>
                <div className="flex justify-center gap-4 items-center w-full">
                    <BioButton color={typeAction === 'delete' ? 'failure' : 'success'} onClick={onConfirm}>
                        {typeAction === 'delete' ? <FaTrashAlt size={15} className="mt-0.5 mr-2" /> : <FaSave size={15} className="mt-0.5 mr-2" />}
                        {typeAction === 'delete' ? i18n.t('delete') : i18n.t('edit')}
                    </BioButton>
                    <BioButton color="gray" onClick={onClose}>
                        <FaTimes size={15} className="mt-0.5 mr-2"/> {i18n.t("cancel")}
                    </BioButton>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default CauseModal;
