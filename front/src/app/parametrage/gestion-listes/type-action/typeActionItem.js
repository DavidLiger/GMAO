// components/TypeActionItem.js
import React, { useEffect } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import BioButton from "../../../../../components/button/BioButton";

const TypeActionItem = ({ typeaction, onEdit, onDelete, onSelect, isSelected, dataSousTypeList, setIsCreatingSubType, isCreatingSubType }) => {

    useEffect(() => {
        console.log(typeaction);
    }, [typeaction]);

        useEffect(() => {
            console.log(isCreatingSubType);
        }, [isCreatingSubType])

    // Vérifiez si le bouton de suppression doit être désactivé
    const isDeleteDisabled = typeaction.nom === "Curative" || typeaction.nom === "Préventive";

    return (
        <div
            className={`flex justify-between items-center p-4 rounded-lg shadow-md mb-4 cursor-pointer 
                ${onSelect ? (isSelected ? 'bg-primary text-white' : 'bg-blue-200 text-black') : 'bg-blue-200 text-black'}`} // Changer les classes en fonction de isSelected
            onClick={onSelect ? () => onSelect(typeaction) : undefined} // Appeler onSelect seulement si défini
        >
            <div className="flex items-center">
                {!dataSousTypeList &&
                    <span
                        className={`rounded-full w-5 h-5 mr-2 border border-gray-500 ${typeaction.color}`}
                    />
                }
                <span className="flex-1">{typeaction.nom}</span>
            </div>
            {isSelected &&
                <div className="flex space-x-2">
                    <BioButton
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(typeaction);
                            setIsCreatingSubType(false);
                        }} // Empêche la propagation de l'événement
                        color={"gray"}
                        aria-label="Edit"
                    >
                        <FaEdit />
                    </BioButton>
                    <BioButton
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(typeaction);
                        }} // Empêche la propagation de l'événement
                        aria-label="Delete"
                        color={"failure"}
                        disabled={isDeleteDisabled} // Désactiver le bouton si nécessaire
                    >
                        <FaTrashAlt />
                    </BioButton>
                </div>
            }
            {dataSousTypeList &&
                <div className="flex space-x-2">
                    <BioButton
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(typeaction);
                            setIsCreatingSubType(true);
                        }} // Empêche la propagation de l'événement
                        aria-label="Edit"
                        color={"gray"}
                    >
                        <FaEdit />
                    </BioButton>
                    <BioButton
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(typeaction);
                        }} // Empêche la propagation de l'événement
                        aria-label="Delete"
                        color={"failure"}
                        disabled={isDeleteDisabled} // Désactiver le bouton si nécessaire
                    >
                        <FaTrashAlt />
                    </BioButton>
                </div>
            }
        </div>
    );
};

export default TypeActionItem;