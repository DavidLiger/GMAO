import React, { useEffect, useState } from 'react';
import { Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import BioButton from "../../../../../components/button/BioButton";
import i18n from "../../../../../i18n";
import { FaSave, FaTimes, FaTrashAlt } from "react-icons/fa";
import { Label, TextInput } from "flowbite-react";
import Select from "react-select";
import {useAPIRequest} from '../../../../../components/api/apiRequest';

const TypeActionModal = ({ isOpen, onClose, onConfirm, title, modalType, setColor, editColor, children, typeAction, isCreatingSubType, newNom, setNewNom, editNom, setEditNom }) => {
    const [selectedButton, setSelectedButton] = useState(1); // 0 pour Annuler, 1 pour Confirmer
    const [selectedColor, setSelectedColor] = useState(null); // État pour la couleur sélectionnée
    const [error, setError] = useState(''); // État pour gérer les erreurs

    // postTraitement après un tableau
    const colorOptions = [
        { value: "bg-white", label:  i18n.t("white") },
        { value: "bg-red-500", label: i18n.t("red") },
        { value: "bg-green-500", label: i18n.t("green") },
        { value: "bg-yellow-200", label: i18n.t("yellow") },
        { value: "bg-orange-400", label: i18n.t("orange") },
        { value: "bg-blue-500", label: i18n.t("blue") },
        { value: "bg-purple-600", label: i18n.t("purple") },
        { value: "bg-black", label: i18n.t("black") },
        { value: "bg-cyan-500", label: i18n.t("cyan") },
    ].map((color) => ({
        value: color.value,
        label: (
            <div className="flex items-center gap-2">
                <span className={`${color.value} rounded-full w-4 h-4 border border-gray-500`} />
                {color.label}
            </div>
        ),
    }));

    useEffect(() => {
        console.log(isCreatingSubType);
    }, [isCreatingSubType])

    useEffect(() => {
        if (isOpen) {
            // Si modalType est 'create', sélectionnez la couleur blanche
            if (modalType === 'create') {
                if (!selectedColor) {
                    setSelectedColor(colorOptions.find(color => color.value === 'bg-white'));
                }
                // if(!isCreatingSubType){
                    if(!newNom){
                        setNewNom(''); // Réinitialiser le champ pour la création
                    }
                // }
                // setNewNom('');
                setError(''); // Réinitialiser l'erreur
            } else {
                // if (selectedColor){
                    setSelectedColor(colorOptions.find(color => color.value === editColor));
                // }
                setNewNom(editNom); // Définir la valeur initiale pour l'édition
                setError(''); // Réinitialiser l'erreur
            }
        }
    }, [isOpen, modalType, editColor, editNom, setNewNom]);

    useEffect(() => {
        // Mettre à jour la couleur dans le parent lorsque selectedColor change
        if (selectedColor) {
            setColor(selectedColor.value);
        }
    }, [selectedColor]);

    const handleConfirm = () => {
        // Validation du champ
        if (modalType === 'create' && !newNom.trim()) {
            setError(i18n.t('modal.edit.error')); // Définir le message d'erreur
            return;
        }
        if (modalType === 'edit' && !editNom.trim()) {
            setError(i18n.t('modal.edit.error')); // Définir le message d'erreur
            return;
        }
        setError(''); // Réinitialiser l'erreur si tout est bon
        onConfirm(selectedColor); // Passe la couleur sélectionnée à la fonction de confirmation
        setSelectedColor('')
        setNewNom('')
    };

    if (!isOpen) return null;

    return (
        <Modal show={isOpen} onClose={onClose} popup>
            <Modal.Header />
            <Modal.Body>
                <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400 w-full text-center">{title}</h3>
                {/* <div className="text-center">{children}</div> */}
                {modalType !== 'delete' &&
                    <>
                        <div className="mb-4">
                            {/* <Label className="block text-sm font-medium mb-2 mt-2 ml-2">
                                {i18n.t("name")} <span className="text-red-500">*</span>
                            </Label> */}
                            <input
                                type="text"
                                value={modalType === 'create' ? newNom : editNom}
                                onChange={(e) => {
                                    if (modalType === 'create') {
                                        setNewNom(e.target.value);
                                    } else {
                                        setEditNom(e.target.value);
                                    }
                                    setError(''); // Réinitialiser l'erreur lors de la saisie
                                }}
                                className={`${error ? "block w-full border disabled:cursor-not-allowed disabled:opacity-50 border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-400 dark:bg-red-100 dark:focus:border-red-500 dark:focus:ring-red-500 p-2.5 text-sm rounded-lg" : "block w-full border disabled:cursor-not-allowed disabled:opacity-50 border-gray-300 bg-gray-50 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500 p-2.5 text-sm rounded-lg"}`} // Appliquer une bordure rouge si une erreur est présente
                                placeholder={i18n.t('modal.create.placeholder.type')}
                            />
                            {error && <p className="text-red-500 text-sm mt-1">{error}</p>} {/* Afficher le message d'erreur */}
                        </div>
                        {!isCreatingSubType && (
                            <div className="mb-4">
                                <Label className="block text-sm font-medium mb-2 mt-2 ml-2">
                                    {i18n.t("actionColor")} <span className="text-red-500"></span>
                                </Label>
                                <Select
                                    value={selectedColor}
                                    onChange={(color) => {
                                        setSelectedColor(color);
                                        setColor(color.value); // Appeler setColor pour mettre à jour la couleur dans le parent
                                    }}
                                    options={colorOptions}
                                    isSearchable
                                    placeholder={i18n.t("slectPlaceHolder")}
                                    menuPortalTarget={document.body} // Rendre le menu dans le body
                                    styles={{
                                        menuPortal: (base) => ({ ...base, zIndex: 9999 }), // Définir le z-index
                                        input: (provided) => ({
                                            ...provided,
                                            padding: 0,
                                            height: "22px",
                                            margin: 0,
                                            fontSize: "0.875rem",
                                            "input[type='text']:focus": { boxShadow: "none" }
                                        }),
                                        control: (provided) => ({
                                            ...provided,
                                            backgroundColor: "#f8fafc"
                                        }),
                                    }}
                                />
                            </div>
                        )}
                    </>
                }
            </Modal.Body>
            <Modal.Footer>
                <div className="flex justify-between gap-4 items-center w-full">
                    <BioButton color="gray" onClick={onClose}>
                        <FaTimes size={15} className="mt-0.5 mr-2" /> {i18n.t('cancel')}
                    </BioButton>
                    <BioButton color={typeAction === 'delete' ? 'failure' : 'success'} onClick={handleConfirm}>
                        {modalType === 'delete' ? <FaTrashAlt size={15} className="mt-0.5 mr-2" /> : <FaSave size={15} className="mt-0.5 mr-2" />}
                        {modalType === 'delete' ? i18n.t('delete') : i18n.t('save')}
                    </BioButton>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default TypeActionModal;