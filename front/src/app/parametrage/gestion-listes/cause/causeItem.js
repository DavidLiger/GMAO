// components/CauseItem.js
import React from 'react';
import {FaEdit, FaTrash} from 'react-icons/fa';
import BioButton from "../../../../../components/button/BioButton";

const CauseItem = ({cause, onEdit, onDelete}) => {
    return (
        <div className="flex justify-between items-center bg-primary text-white p-4 rounded-lg shadow-md mb-4">
            <span className="flex-1">{cause.nom}</span>
            <div className="flex space-x-2">
                <BioButton
                    color={"gray"}
                    onClick={() => onEdit(cause)}
                    aria-label="Edit"
                >
                    <FaEdit/>
                </BioButton>
                <BioButton
                    color={"failure"}
                    onClick={() => onDelete(cause.id)}
                    aria-label="Delete"
                >
                    <FaTrash/>
                </BioButton>
            </div>
        </div>
    );
};

export default CauseItem;