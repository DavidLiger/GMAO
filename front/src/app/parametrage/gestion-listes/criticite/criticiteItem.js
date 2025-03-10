// components/CriticiteItem.js
import React from 'react';
import {FaEdit, FaTrash} from 'react-icons/fa';
import BioButton from "../../../../../components/button/BioButton";

const CriticiteItem = ({criticite, onEdit, onDelete}) => {
    return (
        <div className="flex justify-between items-center bg-primary text-white p-4 rounded-lg shadow-md mb-4">
            <span className="flex-1">{criticite.nom}</span>
            <div className="flex space-x-2">
                <BioButton
                    onClick={() => onEdit(criticite)}
                    color={"gray"}
                    aria-label="Edit"
                >
                    <FaEdit/>
                </BioButton>
                <BioButton
                    onClick={() => onDelete(criticite.id)}
                    color={"failure"}
                    aria-label="Delete"
                >
                    <FaTrash/>
                </BioButton>
            </div>
        </div>
    );
};

export default CriticiteItem;