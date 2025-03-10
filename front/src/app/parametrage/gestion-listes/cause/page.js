'use client'

import React, {useEffect, useState} from 'react';
import {useAPIRequest} from '../../../../../components/api/apiRequest';
import CauseModal from './causeModal';
import CauseItem from './causeItem';
import {useToast} from '../../../../../providers/toastProvider';
import {useNavigation} from '../../../../../providers/NavigationContext';
import {useBreadcrumb} from '../../../../../providers/BreadCrumbContext';
import BioButton from '../../../../../components/button/BioButton';
import {FaPlus} from "react-icons/fa";
import {TextInput} from "flowbite-react";
import i18n from '../../../../../i18n';

const CauseSetter = () => {
    const apiRequest = useAPIRequest();
    const [data, setData] = useState([]);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [selectedCause, setSelectedCause] = useState(null);
    const [editNom, setEditNom] = useState('');
    const [newNom, setNewNom] = useState('');
    const [user, setUser] = useState('');
    const [required, setRequired] = useState(false);
    const {addToast} = useToast();
    const {setActiveLabel} = useNavigation();
    const {setBreadcrumbs} = useBreadcrumb();

    useEffect(() => {
        setBreadcrumbs([
            {label: i18n.t("breadcrumb.listManagement"), href: '/parametrage/gestion-listes'},
            {label: i18n.t("causeListTitle"), href: null},
        ]);
    }, [setBreadcrumbs]);

    useEffect(() => {
        setActiveLabel(i18n.t("causeListTitle")); // Titre de la page
    }, [setActiveLabel]);

    useEffect(() => {
        apiRequest("/api/cause")
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

    const handleEdit = (cause) => {
        setSelectedCause(cause);
        setEditNom(cause.nom); // Pré-remplir le champ avec le nom actuel
        setEditModalOpen(true);
    };

    const handleDelete = (id) => {
        setSelectedCause(id);
        setDeleteModalOpen(true);
    };

    const closeEditModal = () => {
        setEditModalOpen(false);
        setSelectedCause(null);
    };

    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
        setSelectedCause(null);
    };

    const closeCreateModal = () => {
        setCreateModalOpen(false);
        setNewNom(''); // Réinitialiser le champ de nom
    };

    const confirmDelete = () => {
        apiRequest(`/api/cause/${selectedCause}`, 'DELETE')
            .then(() => {
                setData(data.filter(cause => cause.id !== selectedCause));
                closeDeleteModal();
            });
    };

    const handleSaveEdit = () => {
        const updatedCause = {...selectedCause, nom: editNom, idSociete: selectedCause.idSociete};
        apiRequest(`/api/cause/${selectedCause.id}`, 'PUT', updatedCause)
            .then(() => {
                setData(data.map(cause => cause.id === selectedCause.id ? updatedCause : cause));
                closeEditModal();
            })
            .catch(() => {
                // Gérer l'erreur
            });
    };

    const handleCreate = () => {
        if (newNom) {
            if (required) {
                setRequired(false);
            }
            const newCause = {nom: newNom, idSociete: user.societe.id};
            apiRequest('/api/cause', 'POST', newCause)
                .then((res) => {
                    if (!res.ok) {
                        throw new Error(i18n.t("createError"));
                    }
                    return res.json();
                })
                .then((createdCause) => {
                    setData((prevData) => {
                        const updatedData = [...prevData, createdCause];
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
            <div className="flex-none w-4/5 ml-[10%] ">
                <div className="relative">
                    {data.map(cause => (
                        <CauseItem
                            key={cause.id}
                            cause={cause}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}

                    <CauseModal
                        isOpen={isCreateModalOpen}
                        onClose={closeCreateModal}
                        onConfirm={handleCreate}
                        title={i18n.t("createCauseTitle")}
                    >
                        <TextInput
                            type="text"
                            value={newNom}
                            onChange={(e) => setNewNom(e.target.value)}
                            className={`w-full ${required ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder={i18n.t("enterCauseName")}
                            autoFocus
                        />
                    </CauseModal>

                    <CauseModal
                        isOpen={isEditModalOpen}
                        onClose={closeEditModal}
                        onConfirm={handleSaveEdit}
                        title={i18n.t("editCauseTitle")}
                    >
                        <TextInput
                            type="text"
                            value={editNom}
                            onChange={(e) => setEditNom(e.target.value)}
                            className="w-full"
                            placeholder={i18n.t("enterNewName")}
                            autoFocus
                        />
                    </CauseModal>

                    <CauseModal
                        isOpen={isDeleteModalOpen}
                        onClose={closeDeleteModal}
                        onConfirm={confirmDelete}
                        title={i18n.t("deleteCauseTitle")}
                        typeAction='delete'
                    >
                        <p>{i18n.t("deleteCauseConfirmation")}</p>
                    </CauseModal>

                    <BioButton
                        onClick={() => setCreateModalOpen(true)}
                        color={"success"}
                        className="fixed bottom-4 right-4"
                        aria-label={i18n.t("createNewCause")}
                    >
                        <FaPlus size={15} className="mt-0.5 mr-2"/> {i18n.t("addCause")}
                    </BioButton>
                </div>
            </div>
        </div>
    );
};

export default CauseSetter;