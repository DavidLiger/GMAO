import React, {useEffect, useState} from 'react';
import {useAPIRequest} from "../../api/apiRequest";
import {FaEdit, FaSave} from 'react-icons/fa';
import Image from "next/image";
import BioButton from "../../button/BioButton";
import {TextInput} from "flowbite-react";
import i18n from "../../../i18n";

export default function BienView({bienId}) {
    const apiRequest = useAPIRequest();
    const [bien, setBien] = useState(null); // Données du bien
    const [caracteristiques, setCaracteristiques] = useState([]); // Liste des caractéristiques
    const [isEditing, setIsEditing] = useState(null); // ID de la caractéristique en cours de modification
    const [editValue, setEditValue] = useState(''); // Valeur en cours d'édition

    // Requête API pour récupérer les données du bien
    useEffect(() => {
        const fetchBienData = async () => {
            try {
                const bienResponse = await apiRequest(`/api/bien/${bienId}`);
                const bienData = await bienResponse.json();
                setBien(bienData);

                const caractResponse = await apiRequest(`/api/bien/${bienId}/caracteristiques`);
                const caractData = await caractResponse.json();
                setCaracteristiques(caractData);
            } catch (error) {
                console.error("Erreur lors de la récupération des données du bien :", error);
            }
        };

        fetchBienData();
    }, []);

    // Gestion de l'édition d'une caractéristique
    const handleEdit = (caracteristique) => {
        setIsEditing(caracteristique.id);
        setEditValue(caracteristique.valeur);
    };

    const handleSave = async (caracteristiqueId) => {
        try {
            await apiRequest(`/api/bien/${bienId}/caracteristiques/${caracteristiqueId}`, 'PUT', {
                valeur: editValue,
            });
            setCaracteristiques((prev) =>
                prev.map((caract) =>
                    caract.id === caracteristiqueId ? {...caract, valeur: editValue} : caract
                )
            );
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la caractéristique :", error);
        } finally {
            setIsEditing(null);
            setEditValue('');
        }
    };

    return (
        <div className="p-6">
            {/* Bandeau */}
            {bien && (
                <div className="mb-8 flex items-center gap-6">
                    {bien.image ? (
                        <Image
                            src={bien.image}
                            alt={i18n.t("bienImageAlt", {name: bien.nom})}
                            className="w-40 h-40 object-cover rounded-md shadow-md"
                        />
                    ) : (
                        <div className="w-40 h-40 flex items-center justify-center bg-gray-200 rounded-md shadow-md">
                            <span className="text-gray-500 text-sm">{i18n.t("noImage")}</span>
                        </div>
                    )}
                    <div>
                        <h1 className="text-3xl font-bold text-primary">{bien.nom}</h1>
                        <p className="text-sm text-gray-600">{bien.typeBien.nom}</p>
                        <p className="text-base text-gray-800 mt-2">{bien.description || i18n.t("noDescription")}</p>
                    </div>
                </div>
            )}

            {/* Caractéristiques */}
            <h2 className="text-2xl font-bold text-primary mb-4">{i18n.t("characteristics")}</h2>
            <div className="space-y-4">
                {caracteristiques.map((caract) => (
                    <div
                        key={caract.id}
                        className="flex items-center justify-between p-4 bg-gray-100 rounded-md shadow-md"
                    >
                        <span className="text-sm font-medium text-gray-800">{caract.nom}</span>
                        {isEditing === caract.id ? (
                            <div className="flex items-center gap-2">
                                <TextInput
                                    type="text"
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    className="p-2"
                                />
                                <BioButton color="success" onClick={() => handleSave(caract.id)}>
                                    <FaSave size={15} className="mt-0.5 mr-2"/> {i18n.t("save")}
                                </BioButton>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-600">{caract.valeur}</span>
                                <FaEdit
                                    className="text-gray-500 cursor-pointer hover:text-primary"
                                    onClick={() => handleEdit(caract)}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
