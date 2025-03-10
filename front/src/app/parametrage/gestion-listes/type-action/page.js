"use client";

import React, {useEffect, useState} from 'react';
import {useAPIRequest} from '../../../../../components/api/apiRequest';
import TypeActionModal from './typeActionModal';
import TypeActionItem from './typeActionItem';
import {useNavigation} from "../../../../../providers/NavigationContext";
import {useBreadcrumb} from "../../../../../providers/BreadCrumbContext";
import BioButton from "../../../../../components/button/BioButton";
import {FaPlus} from "react-icons/fa";
import {TextInput} from "flowbite-react";
import i18n from "../../../../../i18n";
import { useAuth } from '../../../../../providers/AuthProvider';

const TypeActionSetter = () => {

    const apiRequest = useAPIRequest();
    const [data, setData] = useState([]);
    const [dataSousType, setDataSousType] = useState([]);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [selectedTypeAction, setSelectedTypeAction] = useState(null);
    const [selectedSubTypeAction, setSelectedSubTypeAction] = useState(null);
    const [editNom, setEditNom] = useState('');
    const [editColor, setEditColor] = useState('');
    const [newNom, setNewNom] = useState('');
    const [user, setUser] = useState('');
    const [isCreatingSubType, setIsCreatingSubType] = useState(false);
    const [isEditingSubType, setIsEditingSubType] = useState(false);
    const [typeToDelete, setTypeToDelete] = useState(null);
    const [hasSubTypes, setHasSubTypes] = useState(false);
    const {setActiveLabel} = useNavigation();
    const {setBreadcrumbs} = useBreadcrumb();

    const {token} = useAuth()
    // console.log(token);

    useEffect(() => {
        setBreadcrumbs([
            {label: i18n.t("breadcrumb.listManagement"), href: '/parametrage/gestion-listes'},
            {label: i18n.t("actionTitle"), href: null},
        ]);
    }, [setBreadcrumbs]);

    useEffect(() => {
        setActiveLabel(i18n.t('actionTitle'));
    }, [setActiveLabel]);

    useEffect(() => {
        apiRequest("/api/typeaction")
            .then((res) => res.json())
            .then((data) => {
                const formattedData = data.map((item) => ({
                    id: item.id,
                    nom: item.nom,
                    idSociete: item.societe.id,
                    color: item.color,
                }));

                formattedData.sort((a, b) => a.nom.localeCompare(b.nom));
                setData(formattedData);

                if (!selectedTypeAction) {
                    setSelectedTypeAction(formattedData[0]);
                    handleSelectTypeAction(formattedData[0]);
                }
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
        } else {
            console.log(user);
        }
    }, [user]);

    const handleEdit = (typeaction, isSubItem = false) => {
        setEditNom(typeaction.nom);
        setEditColor(typeaction.color)
        setIsEditingSubType(isSubItem);
        if (isSubItem) {
            setSelectedSubTypeAction(typeaction);
        } else {
            setSelectedTypeAction(typeaction);
        }
        setEditModalOpen(true);
    };

    const handleDelete = (id) => {
        setSelectedTypeAction(id);
        setDeleteModalOpen(true);
    };

    const closeEditModal = () => {
        setEditModalOpen(false);
    };

    const openDeleteModal = (typeaction) => {
        setTypeToDelete(typeaction);
        const hasSubTypes = dataSousType.some(item => item.typeActionParentId === typeaction.id);
        setHasSubTypes(hasSubTypes);
        setDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
    };

    const closeCreateModal = () => {
        setCreateModalOpen(false);
        setNewNom('');
    };

    const confirmDelete = async () => {
        if (typeToDelete.typeActionParentId) {
            await apiRequest(`/api/typeaction/${typeToDelete.id}`, 'DELETE');
            setDataSousType((prevData) => prevData.filter(item => item.id !== typeToDelete.id));
        } else {
            const hasSubTypes = dataSousType.some(item => item.typeActionParentId === typeToDelete.id);
            if (hasSubTypes) {
                const subTypesToDelete = dataSousType.filter(item => item.typeActionParentId === typeToDelete.id);
                for (const subType of subTypesToDelete) {
                    await apiRequest(`/api/typeaction/${subType.id}`, 'DELETE');
                }
                setDataSousType((prevData) => prevData.filter(item => item.typeActionParentId !== typeToDelete.id));
            }
            await apiRequest(`/api/typeaction/${typeToDelete.id}`, 'DELETE');
            setData((prevData) => prevData.filter(item => item.id !== typeToDelete.id));
        }
        closeDeleteModal();
    };

    const handleSaveEdit = () => {
        let updatedTypeAction;
        if (!isEditingSubType) {
            updatedTypeAction = {...selectedTypeAction, nom: editNom, color: editColor, idSociete: user.societe.id};
        } else {
            updatedTypeAction = {...selectedSubTypeAction, nom: editNom, idSociete: user.societe.id};
            console.log(updatedTypeAction);
            
            updatedTypeAction.idTypeActionParent = updatedTypeAction.typeActionParentId;
        }

        apiRequest(`/api/typeaction/${updatedTypeAction.id}`, 'PUT', updatedTypeAction)
            .then(() => {
                if (updatedTypeAction.typeActionParentId) {
                    setDataSousType((prevData) =>
                        prevData.map(item => item.id === selectedSubTypeAction.id ? updatedTypeAction : item)
                    );
                } else {
                    setData((prevData) =>
                        prevData.map(item => item.id === selectedTypeAction.id ? updatedTypeAction : item)
                    );
                }
                closeEditModal();
            })
            .catch(() => {
                // Gérer l'erreur ici
            });
    };

    const handleCreate = (isSubType = false) => {
        const newTypeAction = {nom: newNom, color: editColor, idSociete: user.societe.id};
        if (isSubType) {
            newTypeAction.idTypeActionParent = selectedTypeAction.id;
        }
        apiRequest('/api/typeaction', 'POST', newTypeAction)
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Erreur lors de la création de la typeaction');
                }
                return res.json();
            })
            .then((createdTypeAction) => {
                if (isSubType) {
                    setDataSousType((prevData) => {
                        const updatedData = [...prevData, {
                            id: createdTypeAction.id,
                            nom: createdTypeAction.nom,
                            typeActionParentId: createdTypeAction.typeActionParent.id,
                            color: null
                        }];
                        updatedData.sort((a, b) => a.nom.localeCompare(b.nom));
                        return updatedData;
                    });
                    setSelectedSubTypeAction(createdTypeAction);
                } else {
                    setData((prevData) => {
                        const updatedData = [...prevData, createdTypeAction];
                        updatedData.sort((a, b) => a.nom.localeCompare(b.nom));
                        return updatedData;
                    });
                    setSelectedTypeAction(createdTypeAction);
                    handleSelectTypeAction(createdTypeAction);
                }
                closeCreateModal();
            })
            .catch((error) => {
                console.error('Erreur:', error);
            });
    };

    const handleToastStatusChange = async (id, cancelled) => {
        if (cancelled) {
            await apiRequest(`/api/typeaction`, 'POST', data);
        }
    };

    const showToast = (type, message) => {
        toastManagerRef.current.addToast({
            type,
            message,
            duration: 5000,
        });
    };

    const handleSelectTypeAction = (typeaction) => {
        setSelectedTypeAction(typeaction);
        apiRequest(`/api/typeaction/${typeaction.id}/sous_types`)
            .then((res) => res.json())
            .then((data) => {
                const formattedSousTypes = data.map((item) => ({
                    id: item.id,
                    nom: item.nom,
                    typeActionParentId: item.typeActionParent.id
                }));
                setDataSousType(formattedSousTypes);
            })
            .catch(() => {
                // Gérer l'erreur ici
            });
    };

    return (
        <div className="flex p-4 bg-gray-100 rounded-lg shadow-md">
            <div className="flex-none w-4/5 ml-[10%] ">
                <div className="flex mt-4">
                    {/* Colonne pour les types d'actions */}
                    <div className="flex-1 bg-gray-200 rounded-lg shadow-inner p-4 mr-2">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">{i18n.t('types.title')}</h2>
                            <BioButton
                                onClick={() => {
                                    setIsCreatingSubType(false);
                                    setCreateModalOpen(true);
                                }}
                                color={"success"}
                                aria-label={i18n.t('modal.create.typeTitle')}
                                title={i18n.t('modal.create.typeTitle')}>
                                <FaPlus size={15} className={"mt-0.5 mr-2"}/>
                                {i18n.t('add')}
                            </BioButton>
                        </div>
                        {data.length > 0 ? (
                            data.map(typeaction => (
                                <TypeActionItem
                                    key={typeaction.id}
                                    typeaction={typeaction}
                                    color={editColor}
                                    onEdit={(typeaction) => handleEdit(typeaction, false)}
                                    onDelete={openDeleteModal}
                                    onSelect={handleSelectTypeAction}
                                    isSelected={selectedTypeAction && selectedTypeAction.id === typeaction.id}
                                    setIsCreatingSubType={setIsCreatingSubType}
                                    isCreatingSubType={isCreatingSubType}
                                />
                            ))
                        ) : (
                            <p>{i18n.t('types.null')}</p>
                        )}
                    </div>

                    {/* Colonne pour les sous-types d'actions */}
                    <div className="flex-1 bg-gray-200 rounded-lg shadow-inner p-4 ml-2">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">{i18n.t('subTypes.title')}</h2>
                            <BioButton
                                onClick={() => {
                                    setIsCreatingSubType(true);
                                    setCreateModalOpen(true);
                                }}
                                color={"success"}
                                aria-label={i18n.t('modal.create.subTypeTitle')}
                                title={i18n.t('modal.create.subTypeTitle')}>
                                <FaPlus size={15} className={"mt-0.5 mr-2"}/>
                                {i18n.t('add')}
                            </BioButton>
                        </div>
                        {dataSousType.length > 0 ? (
                            dataSousType.map(typeaction => (
                                <TypeActionItem
                                    key={typeaction.id}
                                    typeaction={typeaction}
                                    onEdit={(typeaction) => handleEdit(typeaction, true)}
                                    onDelete={openDeleteModal}
                                    dataSousTypeList={true}
                                    setIsCreatingSubType={setIsCreatingSubType}
                                    isCreatingSubType={isCreatingSubType}
                                />
                            ))
                        ) : (
                            <p>{i18n.t('subTypes.null')}</p>
                        )}
                    </div>
                </div>

                {/* Modals */}
                <TypeActionModal
                    isOpen={isEditModalOpen}
                    onClose={closeEditModal}
                    onConfirm={handleSaveEdit}
                    title={isEditingSubType ? i18n.t('modal.edit.subTypeTitle') : i18n.t('modal.edit.typeTitle')}
                    modalType={"edit"}
                    setColor={setEditColor}
                    editColor={editColor}
                    isCreatingSubType={isCreatingSubType}
                    editNom={editNom} // Passez newNom en tant que prop
                    setEditNom={setEditNom}
                    newNom={newNom} // Passez newNom en tant que prop
                    setNewNom={setNewNom}
                    >
                    <TextInput
                        type="text"
                        value={editNom}
                        onChange={(e) => setEditNom(e.target.value)}
                        className="w-full"
                        placeholder={isEditingSubType ? i18n.t('modal.edit.placeholder.subType') : i18n.t('modal.edit.placeholder.type')}
                        autoFocus
                    />
                </TypeActionModal>

                <TypeActionModal
                    isOpen={isDeleteModalOpen}
                    onClose={closeDeleteModal}
                    onConfirm={confirmDelete}
                    title={hasSubTypes ? i18n.t('modal.delete.withSubTypes') : i18n.t('modal.delete.confirm')}
                    modalType={'delete'}
                    newNom={newNom} // Passez newNom en tant que prop
                    setNewNom={setNewNom}>
                </TypeActionModal>

                <TypeActionModal
                    isOpen={isCreateModalOpen}
                    onClose={closeCreateModal}
                    onConfirm={() => {
                        handleCreate(isCreatingSubType);
                        closeCreateModal();
                    }}
                    title={isCreatingSubType ? i18n.t('modal.create.subTypeTitle') : i18n.t('modal.create.typeTitle')}
                    modalType={'create'}
                    setColor={setEditColor}
                    editColor={editColor}
                    isCreatingSubType={isCreatingSubType}
                    newNom={newNom} // Passez newNom en tant que prop
                    setNewNom={setNewNom}>
                    <TextInput
                        type="text"
                        value={newNom}
                        onChange={(e) => setNewNom(e.target.value)}
                        className="w-full"
                        placeholder={isCreatingSubType ? i18n.t('modal.create.placeholder.subType') : i18n.t('modal.create.placeholder.type')}
                        autoFocus
                    />
                </TypeActionModal>
            </div>
        </div>
    );
};

export default TypeActionSetter;
