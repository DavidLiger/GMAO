// pages/index.js
"use client"
import React, {useEffect, useState} from 'react';
import {useAPIRequest} from '../../../../../components/api/apiRequest';
import TypeDeReleveModal from './typeDeReleveModal';
import TypeDeReleveItem from './typeDeReleveItem';
import {useToast} from "../../../../../providers/toastProvider";
import {useNavigation} from "../../../../../providers/NavigationContext";
import {useBreadcrumb} from "../../../../../providers/BreadCrumbContext";
import {FaPlus} from "react-icons/fa";
import BioButton from "../../../../../components/button/BioButton";
import {TextInput} from "flowbite-react";
import i18n from "../../../../../i18n";

const StatementTypeSetter = () => {
    // const t = useTranslations("StatementTypes");
    const apiRequest = useAPIRequest();
    const [data, setData] = useState([]);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isCreateModalOpen, setCreateModalOpen] = useState(false); // Nouvel état pour la modale de création
    const [selectedStatementType, setSelectedStatementType] = useState(null);
    const [editNom, setEditNom] = useState('');
    const [newNom, setNewNom] = useState(''); // État pour le nom de la nouveau type de relevé
    const [user, setUser] = useState(''); // État pour le nom de la nouveau type de relevé
    const [required, setRequired] = useState(false)
    const {addToast} = useToast();
    const {setActiveLabel} = useNavigation();
    const {setBreadcrumbs} = useBreadcrumb();

    useEffect(() => {
        setBreadcrumbs([
            {label: i18n.t("breadcrumb.listManagement"), href: '/parametrage/gestion-listes'},
            {label: i18n.t("statementTypeListTitle"), href: null},
        ]);
    }, [setBreadcrumbs]);

    useEffect(() => {
        setActiveLabel(i18n.t('statementTypeListTitle')); // Définir le titre de la page
    }, [setActiveLabel]);


    useEffect(() => {
        apiRequest("/api/typereleve")
            .then((res) => res.json())
            .then((data) => {
                const formattedData = data.map((item) => ({
                    id: item.id,
                    nom: item.nom
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
    // useEffect(() => {
    //     if (toastMessage) {
    //         addToast({message: toastMessage, type: 'info'});
    //         setToastMessage(null); // Réinitialisez le message après l'affichage
    //     }
    // }, [toastMessage]);

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

    const handleEdit = (statementType) => {
        setSelectedStatementType(statementType);
        setEditNom(statementType.nom); // Pré-remplir le champ avec le nom actuel
        setEditModalOpen(true);
    };

    const handleDelete = (id) => {
        setSelectedStatementType(id);
        setDeleteModalOpen(true);
    };

    const closeEditModal = () => {
        setEditModalOpen(false);
        setSelectedStatementType(null);
    };

    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
        setSelectedStatementType(null);
    };

    const closeCreateModal = () => {
        setCreateModalOpen(false);
        setNewNom(''); // Réinitialiser le champ de nom
    };

    const confirmDelete = () => {
        // Logique pour supprimer l'élément
        apiRequest(`/api/typereleve/${selectedStatementType}`, 'DELETE')
            .then(() => {
                // Mettre à jour l'état pour retirer l'élément supprimé
                setData(data.filter(statementType => statementType.id !== selectedStatementType));
                closeDeleteModal();
                // setToastMessage('Type de relevé supprimé'); // Mettez à jour le message du toast
            });
    };

    const handleSaveEdit = () => {
        const updatedStatementType = {
            ...selectedStatementType,
            nom: editNom,
            idSociete: selectedStatementType.idSociete
        };
        console.log(updatedStatementType);

        apiRequest(`/api/typereleve/${selectedStatementType.id}`, 'PUT', updatedStatementType)
            .then(() => {
                setData(data.map(statementType => statementType.id === selectedStatementType.id ? updatedStatementType : statementType));
                closeEditModal();
                //setToastMessage('Type de relevé modifié'); // Mettez à jour le message du toast
            })
            .catch(() => {
                // setToastMessage('Erreur lors de la mise à jour du type de relevé.');
            });
    };

    // APPEL sur http://api.eperf.local/api/utilisateur -> societe.id
    // à ajouter dans CREATE avec le nom du type de relevé
    const handleCreate = () => {
        if (newNom) {
            if (required) {
                setRequired(false)
            }
            // Logique pour créer une nouveau type de relevé
            const newStatementType = {nom: newNom, idSociete: user.societe.id};
            apiRequest('/api/typereleve', 'POST', newStatementType)
                .then((res) => {
                    if (!res.ok) {
                        throw new Error('Erreur lors de la création du type de relevé');
                    }
                    return res.json();
                })
                .then((createdStatementType) => {
                    // Ajoutez le nouveau type de relevé à l'état data
                    setData((prevData) => {
                        // Créer un nouveau tableau avec le nouveau type de relevé ajouté
                        const updatedData = [...prevData, createdStatementType];

                        // Trier le tableau par ordre alphabétique en fonction de 'nom'
                        updatedData.sort((a, b) => a.nom.localeCompare(b.nom));

                        return updatedData; // Retourner le tableau trié
                    });
                    closeCreateModal();
                    // setToastMessage('Type de relevé ajouté');
                })
                .catch((error) => {
                    console.error('Erreur:', error);
                    // Vous pouvez également gérer l'affichage d'un message d'erreur ici
                    // setToastMessage('Une erreur est survenue lors de la création du nouveau type de relevé.');
                });
        } else {
            setRequired(true)
        }

    };

    // const handleToastStatusChange = async (id, cancelled) => {
    //     if (cancelled) {
    //         await apiRequest(`/api/typereleve`, 'POST', data);
    //     }
    // };

    // const showToast = (type, message) => {
    //     toastManagerRef.current.addToast({
    //         type,
    //         message,
    //         duration: 5000,
    //     });
    // };

    return (
        <div className="flex p-4 bg-gray-100 rounded-lg shadow-md">
            <div className="flex-none w-4/5 ml-[10%] ">
                <div className="flex flex-col bg-gray-200 rounded-lg shadow-inner p-4  mt-4">
                    <div className="relative">
                        {data.map(statementType => (
                            <TypeDeReleveItem
                                key={statementType.id}
                                statementType={statementType}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}

                        <TypeDeReleveModal
                            isOpen={isCreateModalOpen}
                            onClose={closeCreateModal}
                            onConfirm={handleCreate}
                            title={i18n.t("recordType.create")}
                        >
                            <TextInput
                                type="text"
                                value={newNom}
                                onChange={(e) => setNewNom(e.target.value)}
                                className={`w-full ${required ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder={i18n.t("recordType.enterName")}
                                autoFocus
                            />
                        </TypeDeReleveModal>

                        <TypeDeReleveModal
                            isOpen={isEditModalOpen}
                            onClose={closeEditModal}
                            onConfirm={handleSaveEdit}
                            title={i18n.t("recordType.edit")}
                        >
                            <TextInput
                                type="text"
                                value={editNom}
                                onChange={(e) => setEditNom(e.target.value)}
                                className="w-full"
                                placeholder={i18n.t("recordType.enterNewName")}
                                autoFocus
                            />
                        </TypeDeReleveModal>

                        <TypeDeReleveModal
                            isOpen={isDeleteModalOpen}
                            onClose={closeDeleteModal}
                            onConfirm={confirmDelete}
                            title={i18n.t("recordType.delete")}
                            typeAction='delete'
                        >
                            <p>{i18n.t('deleteCauseConfirmation')}</p>
                        </TypeDeReleveModal>

                        <BioButton
                            onClick={() => setCreateModalOpen(true)}
                            color="success"
                            className="fixed bottom-4 right-4"
                            aria-label={i18n.t("recordType.create")}
                        >
                            <FaPlus className="mt-0.5 mr-2"/> {i18n.t('add')}
                        </BioButton>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatementTypeSetter;