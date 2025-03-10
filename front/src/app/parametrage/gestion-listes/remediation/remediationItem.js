// components/RemediationItem.js
import React from 'react';
import {FaEdit, FaTrashAlt} from 'react-icons/fa';
import BioButton from "../../../../../components/button/BioButton";

const RemediationItem = ({remediation, onEdit, onDelete}) => {
    return (
        <div className="flex justify-between items-center bg-primary text-white p-4 rounded-lg shadow-md mb-4">
            <span className="flex-1">{remediation.nom}</span>
            <div className="flex space-x-2">
                <BioButton
                    onClick={() => onEdit(remediation)}
                    color={"gray"}
                    aria-label="Edit"
                >
                    <FaEdit/>
                </BioButton>
                <BioButton
                    onClick={() => onDelete(remediation.id)}
                    color={"failure"}
                    aria-label="Delete"
                >
                    <FaTrashAlt/>
                </BioButton>
            </div>
        </div>
    );
};

export default RemediationItem;