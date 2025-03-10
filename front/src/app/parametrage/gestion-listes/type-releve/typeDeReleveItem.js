// components/CauseItem.js
import React from 'react';
import {FaEdit, FaTrashAlt} from 'react-icons/fa';
import BioButton from "../../../../../components/button/BioButton";

const TypeDeReleveItem = ({statementType, onEdit, onDelete}) => {
    return (
        <div className="flex justify-between items-center bg-primary text-white p-4 rounded-lg shadow-md mb-4">
            <span className="flex-1">{statementType.nom}</span>
            <div className="flex space-x-2">
                <BioButton
                    onClick={() => onEdit(statementType)}
                    className="transition duration-200"
                    aria-label="Edit"
                    color={"gray"}
                >
                    <FaEdit/>
                </BioButton>
                <BioButton
                    onClick={() => onDelete(statementType.id)}
                    className="transition duration-200"
                    aria-label="Delete"
                    color={"failure"}
                >
                    <FaTrashAlt/>
                </BioButton>
            </div>
        </div>
    );
};

export default TypeDeReleveItem;