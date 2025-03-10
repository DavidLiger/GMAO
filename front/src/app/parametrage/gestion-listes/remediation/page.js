// pages/index.js
"use client"
import React, {useEffect, useState} from 'react';
import {useAPIRequest} from '../../../../../components/api/apiRequest';
import RemediationModal from './remediationModal';
import RemediationItem from './remediationItem';
import {useNavigation} from "../../../../../providers/NavigationContext";
import {useBreadcrumb} from "../../../../../providers/BreadCrumbContext";
import {useToast} from "../../../../../providers/toastProvider";
import BioButton from "../../../../../components/button/BioButton";
import {FaPlus} from "react-icons/fa";
import {TextInput} from "flowbite-react";
import i18n from "../../../../../i18n";

const RemediationSetter = () => {

    const apiRequest = useAPIRequest();
    const [data, setData] = useState([]);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isCreateModalOpen, setCreateModalOpen] = useState(false); // Nouvel état pour la modale de création
    const [selectedRemediation, setSelectedRemediation] = useState(null);
    const [editNom, setEditNom] = useState('');
    const [newNom, setNewNom] = useState(''); // État pour le nom de la nouvelle remediation
    const [user, setUser] = useState(''); // État pour le nom de la nouvelle remediation
    const [required, setRequired] = useState(false)
    // const [toastMessage, setToastMessage] = useState(null);
    const {addToast} = useToast();
    const [toastMessage, setToastMessage] = useState(null);
    const {setActiveLabel} = useNavigation();
    const {setBreadcrumbs} = useBreadcrumb();

    useEffect(() => {
        setBreadcrumbs([
            {label: i18n.t("breadcrumb.listManagement"), href: '/parametrage/gestion-listes'},
            {label: i18n.t("remediationListTitle"), href: null},
        ]);
    }, [setBreadcrumbs]);

    useEffect(() => {
        setActiveLabel(i18n.t('remediationListTitle')); // Définir le titre de la page
    }, [setActiveLabel]);
    useEffect(() => {
        apiRequest("/api/remediation")
            .then((res) => res.json())
            .then((data) => {
                const formattedData = data.map((item) => ({
                    id: item.id,
                    nom: item.nom,
                    idSociete: item.societe.id
                }));

                // Trier les données par ordre alphabétique en fonction de 'nom'
                formattedData.sort((a, b) => a.nom.localeCompare(b.nom));

                // Mettre à jour l'état avec les données triées
                setData(formattedData);
            })
            .catch(() => {
                // Gérer l'erreur ici
            });
    }, []);

    // Utilisez useEffect pour afficher le toast
    useEffect(() => {
        if (toastMessage) {
            showToast('info', toastMessage);
            addToast({message: toastMessage, type: "info"});
            setToastMessage(null); // Réinitialisez le message après l'affichage
        }
    }, [toastMessage]);

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
        } else {
            console.log(user);

        }
    }, [user])

    const handleEdit = (remediation) => {
        setSelectedRemediation(remediation);
        setEditNom(remediation.nom); // Pré-remplir le champ avec le nom actuel
        setEditModalOpen(true);
    };

    const handleDelete = (id) => {
        setSelectedRemediation(id);
        setDeleteModalOpen(true);
    };

    const closeEditModal = () => {
        setEditModalOpen(false);
        setSelectedRemediation(null);
    };

    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
        setSelectedRemediation(null);
    };

    const closeCreateModal = () => {
        setCreateModalOpen(false);
        setNewNom(''); // Réinitialiser le champ de nom
    };

    const confirmDelete = () => {
        // Logique pour supprimer l'élément
        apiRequest(`/api/remediation/${selectedRemediation}`, 'DELETE')
            .then(() => {
                // Mettre à jour l'état pour retirer l'élément supprimé
                setData(data.filter(remediation => remediation.id !== selectedRemediation));
                closeDeleteModal();
                // setToastMessage('remediation supprimée'); // Mettez à jour le message du toast
            });
    };

    const handleSaveEdit = () => {
        const updatedCause = {...selectedRemediation, nom: editNom, idSociete: selectedRemediation.idSociete};
        console.log(updatedCause);

        apiRequest(`/api/remediation/${selectedRemediation.id}`, 'PUT', updatedCause)
            .then(() => {
                setData(data.map(remediation => remediation.id === selectedRemediation.id ? updatedCause : remediation));
                closeEditModal();
                // setToastMessage('remediation modifiée'); // Mettez à jour le message du toast
            })
            .catch(() => {
                // setToastMessage('Erreur lors de la mise à jour de la remediation.');
            });
    };

    // APPEL sur http://api.eperf.local/api/utilisateur -> societe.id
    // à ajouter dans CREATE avec le nom de la remediation
    const handleCreate = () => {
        if (newNom) {
            if (required) {
                setRequired(false)
            }
            // Logique pour créer une nouvelle remediation
            const newCause = {nom: newNom, idSociete: user.societe.id};

            apiRequest('/api/remediation', 'POST', newCause)
                .then((res) => {
                    if (!res.ok) {
                        throw new Error('Erreur lors de la création de la remediation');
                    }
                    return res.json();
                })
                .then((createdCause) => {
                    // Ajoutez la nouvelle remediation à l'état data
                    setData((prevData) => {
                        // Créer un nouveau tableau avec la nouvelle remediation ajoutée
                        const updatedData = [...prevData, createdCause];

                        // Trier le tableau par ordre alphabétique en fonction de 'nom'
                        updatedData.sort((a, b) => a.nom.localeCompare(b.nom));

                        return updatedData; // Retourner le tableau trié
                    });
                    closeCreateModal();
                    // setToastMessage('remediation ajoutée');
                })
                .catch((error) => {
                    console.error('Erreur:', error);
                    // Vous pouvez également gérer l'affichage d'un message d'erreur ici
                    // setToastMessage('Une erreur est survenue lors de la création de la remediation.');
                });
        } else {
            setRequired(true)
        }
    };

    return (
        <div className="flex p-4 bg-gray-100 rounded-lg shadow-md">
            <div className="flex-none w-4/5 ml-[10%] ">
                <div className="flex flex-col bg-gray-200 shadow-inner p-4 rounded-lg  mt-4">
                    <div className="relative">
                        {data.map(remediation => (
                            <RemediationItem
                                key={remediation.id}
                                remediation={remediation}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}

                        <RemediationModal
                            isOpen={isCreateModalOpen}
                            onClose={closeCreateModal}
                            onConfirm={handleCreate}
                            title={i18n.t('addRemediation')}
                        >
                            <TextInput
                                type="text"
                                value={newNom}
                                onChange={(e) => setNewNom(e.target.value)}
                                className={`w-full ${required ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder={i18n.t('enterRemediationName')}
                                autoFocus
                            />
                        </RemediationModal>

                        <RemediationModal
                            isOpen={isEditModalOpen}
                            onClose={closeEditModal}
                            onConfirm={handleSaveEdit}
                            title={i18n.t('editRemediationTitle')}>
                            <TextInput
                                type="text"
                                value={editNom}
                                onChange={(e) => setEditNom(e.target.value)}
                                className="w-full"
                                placeholder="Enter new name"
                                autoFocus
                            />
                        </RemediationModal>

                        <RemediationModal
                            isOpen={isDeleteModalOpen}
                            onClose={closeDeleteModal}
                            onConfirm={confirmDelete}
                            title={i18n.t('deleteRemediationTitle')}
                        >
                            <p>{i18n.t('deleteRemediationConfirmation')}</p>
                        </RemediationModal>

                        <BioButton
                            onClick={() => setCreateModalOpen(true)}
                            color={"success"}
                            className="fixed bottom-4 right-4"
                            aria-label="Créer une nouvelle remédiation"
                        >
                            <FaPlus className={"mt-0.5 mr-2"}/> {i18n.t('add')}
                        </BioButton>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RemediationSetter;