"use client"
import React, {useEffect, useState} from 'react';
import {useAPIRequest} from '../../../../../components/api/apiRequest';
import CriticiteModal from './criticiteModal';
import CriticiteItem from './criticiteItem';
import {useToast} from '../../../../../providers/toastProvider';
import {useNavigation} from '../../../../../providers/NavigationContext';
import {useBreadcrumb} from '../../../../../providers/BreadCrumbContext';
import BioButton from '../../../../../components/button/BioButton';
import {FaPlus} from "react-icons/fa";
import {TextInput} from "flowbite-react";
import i18n from '../../../../../i18n';

const CriticiteSetter = () => {
    const apiRequest = useAPIRequest();
    const [data, setData] = useState([]);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isCreateModalOpen, setCreateModalOpen] = useState(false); // Nouvel état pour la modale de création
    const [selectedCriticite, setSelectedCriticite] = useState(null);
    const [editNom, setEditNom] = useState('');
    const [newNom, setNewNom] = useState(''); // État pour le nom de la nouvelle criticité
    const [user, setUser] = useState('');
    const [required, setRequired] = useState(false);
    const {addToast} = useToast();
    const [toastMessage, setToastMessage] = useState(null);
    const {setActiveLabel} = useNavigation();
    const {setBreadcrumbs} = useBreadcrumb();

    useEffect(() => {
        setBreadcrumbs([
            {label: i18n.t("breadcrumb.listManagement"), href: '/parametrage/gestion-listes'},
            {label: i18n.t("criticiteListTitle"), href: null},
        ]);
    }, [setBreadcrumbs]);

    useEffect(() => {
        setActiveLabel(i18n.t("criticiteListTitle")); // Exemple : "Liste des Criticités"
    }, [setActiveLabel]);

    useEffect(() => {
        apiRequest("/api/criticite")
            .then((res) => res.json())
            .then((data) => {
                const formattedData = data.map((item) => ({
                    id: item.id,
                    nom: item.nom,
                    idSociete: item.societe.id
                }));
                formattedData.sort((a, b) => a.nom.localeCompare(b.nom));
                setData(formattedData);
            })
            .catch(() => {
                // Gérer l'erreur ici
            });
    }, []);

    useEffect(() => {
        if (toastMessage) {
            addToast({message: toastMessage, type: "info"});
            setToastMessage(null);
        }
    }, [toastMessage, addToast]);

    useEffect(() => {
        if (!user) {
            apiRequest("/api/utilisateur")
                .then((res) => res.json())
                .then((data) => {
                    setUser(data);
                })
                .catch(() => {
                    // Gérer l'erreur ici
                });
        }
    }, [user]);

    const handleEdit = (criticite) => {
        setSelectedCriticite(criticite);
        setEditNom(criticite.nom); // Pré-remplir avec le nom actuel
        setEditModalOpen(true);
    };

    const handleDelete = (id) => {
        setSelectedCriticite(id);
        setDeleteModalOpen(true);
    };

    const closeEditModal = () => {
        setEditModalOpen(false);
        setSelectedCriticite(null);
    };

    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
        setSelectedCriticite(null);
    };

    const closeCreateModal = () => {
        setCreateModalOpen(false);
        setNewNom(''); // Réinitialiser le champ de nom
    };

    const confirmDelete = () => {
        apiRequest(`/api/criticite/${selectedCriticite}`, 'DELETE')
            .then(() => {
                setData(data.filter(criticite => criticite.id !== selectedCriticite));
                closeDeleteModal();
            });
    };

    const handleSaveEdit = () => {
        const updatedCriticite = {...selectedCriticite, nom: editNom, idSociete: selectedCriticite.idSociete};
        apiRequest(`/api/criticite/${selectedCriticite.id}`, 'PUT', updatedCriticite)
            .then(() => {
                setData(data.map(criticite => criticite.id === selectedCriticite.id ? updatedCriticite : criticite));
                closeEditModal();
            })
            .catch(() => {
                // Gérer l'erreur ici
            });
    };

    const handleCreate = () => {
        if (newNom) {
            if (required) {
                setRequired(false);
            }
            const newCriticite = {nom: newNom, idSociete: user.societe.id};
            apiRequest('/api/criticite', 'POST', newCriticite)
                .then((res) => {
                    if (!res.ok) {
                        throw new Error(i18n.t("createError"));
                    }
                    return res.json();
                })
                .then((createdCriticite) => {
                    setData((prevData) => {
                        const updatedData = [...prevData, createdCriticite];
                        updatedData.sort((a, b) => a.nom.localeCompare(b.nom));
                        return updatedData;
                    });
                    closeCreateModal();
                })
                .catch((error) => {
                    console.error(i18n.t("createError"), error);
                });
        } else {
            setRequired(true);
        }
    };

    return (
        <div className="flex p-4 bg-gray-100 rounded-lg shadow-md">
            <div className="flex-none w-4/5 ml-[10%]">
                <div className="flex flex-col bg-gray-200 shadow-inner p-4 rounded-lg mt-4">
                    <div className="relative">
                        {data.map(criticite => (
                            <CriticiteItem
                                key={criticite.id}
                                criticite={criticite}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}

                        <CriticiteModal
                            isOpen={isCreateModalOpen}
                            onClose={closeCreateModal}
                            onConfirm={handleCreate}
                            title={i18n.t("createCriticiteTitle")}
                        >
                            <TextInput
                                type="text"
                                value={newNom}
                                onChange={(e) => setNewNom(e.target.value)}
                                className={`w-full ${required ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder={i18n.t("enterCriticiteName")}
                                autoFocus
                            />
                        </CriticiteModal>

                        <CriticiteModal
                            isOpen={isEditModalOpen}
                            onClose={closeEditModal}
                            onConfirm={handleSaveEdit}
                            title={i18n.t("editCriticiteTitle")}
                        >
                            <TextInput
                                type="text"
                                value={editNom}
                                onChange={(e) => setEditNom(e.target.value)}
                                className="w-full"
                                placeholder={i18n.t("enterNewName")}
                                autoFocus
                            />
                        </CriticiteModal>

                        <CriticiteModal
                            isOpen={isDeleteModalOpen}
                            onClose={closeDeleteModal}
                            onConfirm={confirmDelete}
                            title={i18n.t("deleteCriticiteTitle")}
                        >
                            <p>{i18n.t("deleteCriticiteConfirmation")}</p>
                        </CriticiteModal>

                        <BioButton
                            onClick={() => setCreateModalOpen(true)}
                            color={"success"}
                            className="fixed bottom-4 right-4"
                            aria-label={i18n.t("createNewCriticite")}
                        >
                            <FaPlus size={15} className="mt-0.5 mr-2"/> {i18n.t("addCriticite")}
                        </BioButton>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CriticiteSetter;
