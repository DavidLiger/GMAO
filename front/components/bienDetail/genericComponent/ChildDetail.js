import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {FaExclamationCircle, FaTimes} from 'react-icons/fa';
import clsx from 'clsx';
import BioButton from "../../button/BioButton";

export default function ChildDetail({child, onClose}) {
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(false);

    // Gère l'animation d'ouverture
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 10); // Petit délai pour déclencher la transition
        return () => clearTimeout(timer);
    }, []);

    const handleNavigateToDetail = () => {
        router.push(`/bien/${child.id}`);
    };

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Attends la fin de l'animation avant de fermer
    };

    return (
        <div
            className={clsx(
                "fixed inset-0 z-50 flex items-center justify-end bg-black bg-opacity-50 transition-opacity duration-300",
                isVisible ? "opacity-100" : "opacity-0"
            )}
            onClick={handleClose} // Ferme en cliquant à l'extérieur
        >
            <div
                className={clsx(
                    "relative w-1/3 h-full bg-white shadow-lg p-4 overflow-y-auto transition-transform duration-300",
                    isVisible ? "translate-x-0" : "translate-x-full"
                )}
                onClick={(e) => e.stopPropagation()} // Empêche la fermeture en cliquant à l'intérieur
            >
                <BioButton
                    color={"failure"}
                    onClick={handleClose}
                    className="absolute top-4 right-4"
                >
                    <FaTimes/>
                </BioButton>
                <h2 className="font-bold text-lg mb-4">{child.nom}</h2>
                <p>
                    <strong>{i18n.t('type')} :</strong> {child.typeBien.nom}
                </p>
                <p>
                    <strong>{i18n.t('tags')} :</strong> {child.tags?.join(', ') || t('noTags')}
                </p>
                <p>
                    <strong>{i18n.t('description')} :</strong> {child.description || t('noDescription')}
                </p>

                {/* Bouton Détail */}
                <BioButton
                    color={"primary"}
                    onClick={handleNavigateToDetail}
                    className="mt-4"
                >
                    <FaExclamationCircle size={15} className="mt-0.5 mr-3"/>{i18n.t('viewDetails')}
                </BioButton>
            </div>
        </div>
    );
}
