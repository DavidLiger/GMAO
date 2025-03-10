// components/TypeActionItem.js
import React, { useEffect } from 'react';

const ActionItem = ({ typeaction, onSelect, isSelected, dataSousTypeList }) => {

    useEffect(() => {
        console.log(typeaction);
    }, [typeaction]);

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
        </div>
    );
};

export default ActionItem;