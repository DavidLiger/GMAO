'use client'

import React, {useEffect, useState} from 'react';
import {Modal, TextInput} from "flowbite-react";
import {useAPIRequest} from "../../../../components/api/apiRequest";
import {HiOutlineExclamationCircle} from "react-icons/hi";
import {FaCheck, FaSave, FaTimes, FaTrashAlt} from "react-icons/fa";
import {useNavigation} from "../../../../providers/NavigationContext";
import {useBreadcrumb} from "../../../../providers/BreadCrumbContext";
import BioButton from "../../../../components/button/BioButton";
import {useToast} from "../../../../providers/toastProvider";
import {setPersistanceUpdated, setWaitingPath} from '@/redux/features/modelSetterSlice';
import {useDispatch, useSelector} from 'react-redux';
import QuitModal from './QuitModal';
import i18n from "../../../../i18n";

export default function SitesManagement() {
    const dispatch = useDispatch();
    const apiRequest = useAPIRequest();
    const waitingPath = useSelector((state) => state.models.waitingPath);

    // State management
    const [sites, setSites] = useState([]);
    const [elements, setElements] = useState([]);
    const [selectedSite, setSelectedSite] = useState(null);
    const [selectedSiteTemp, setSelectedSiteTemp] = useState(null);
    const [points, setPoints] = useState([]);
    const [unsavedChanges, setUnsavedChanges] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [searchQuery, setSearchQuery] = useState('');
    const [errors, setErrors] = useState({});
    const [availableElements, setAvailableElements] = useState(elements); // Liste des éléments disponibles
    const [isQuitModalOpen, setIsQuitModalOpen] = useState(false);
    const filteredSites = sites.filter((site) =>
        site.nom.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const [searchQueryElements, setSearchQueryElements] = useState('');
    const {setActiveLabel} = useNavigation();
    const {setBreadcrumbs} = useBreadcrumb();
    const {addToast} = useToast();

    useEffect(() => {
        setBreadcrumbs([
            {label: i18n.t('parametrage'), href: null},
        ]);
    }, [setBreadcrumbs]);

    useEffect(() => {
        setActiveLabel(i18n.t('titlePointMesure')); // Définir le titre de la page
    }, [setActiveLabel]);
    // API Calls
    useEffect(() => {
        fetchSites();
        fetchElements();
    }, []);

    useEffect(() => {
        if (waitingPath) {
            // setIsQuitModalOpen(currentEntity.id);
            setIsQuitModalOpen(true);
        }
    }, [waitingPath])

    const fetchSites = async () => {
        // Replace with your API endpoint
        const response = await apiRequest('/api/typebien/nature/site');
        const data = await response.json();
        setSites(data);
    };

    const fetchElements = async () => {
        // Replace with your API endpoint
        const response = await apiRequest('/api/locpointmesure');
        const data = await response.json();
        setElements(data);
    };

    const handleSaveAndChangeSite = () => {
        console.log(selectedSite);

        handleSavePoints(); // Enregistrer les modifications
        if (!waitingPath) {
            proceedSiteChange(selectedSiteTemp); // Changer de entity après l'enregistrement
        }
        setShowModal(false); // Fermer la modale
    };

    const handleChangeSiteWithoutSaving = () => {
        if (!waitingPath) {
            proceedSiteChange(selectedSiteTemp); // Changer de entity après l'enregistrement
        }
        setUnsavedChanges(false)
        dispatch(setPersistanceUpdated(true));
        setShowModal(false); // Fermer la modale
    };

    // Réinitialisation des états lors du changement de site
    // correspond à handleSetEntity
    const handleSiteChange = (siteId) => {
        if (points.length > 0 && unsavedChanges === true) {
            // Affiche la modal si des points sont déjà présents dans la colonne centrale
            setShowModal(true);
            setSelectedSiteTemp(siteId)
        } else {
            proceedSiteChange(siteId);
        }
    };

    const filteredAvailableElements = availableElements.filter((element) =>
        element.nom.toLowerCase().includes(searchQueryElements.toLowerCase()) ||
        element.baseDesc.toLowerCase().includes(searchQueryElements.toLowerCase())
    );

    // correspond à changeSite
    const proceedSiteChange = async (siteId) => {
        setSelectedSite(siteId);

        try {
            // Récupérer les points pour le site sélectionné
            const response = await apiRequest(`/api/locpointmesure/typebien/${siteId}`);
            const data = await response.json();

            // Mettre à jour les points sélectionnés avec isFromAPI
            const loadedPoints = data.map((point) => ({
                ...point,
                isFromAPI: true, // Ajouter cette propriété pour indiquer que c'est un élément de l'API
                valeurDefaut: point.valeurDefaut || '',
                baseDesc: point.description
            }));
            setPoints(loadedPoints);

            // Supprimer les points chargés de la liste des éléments disponibles
            const updatedAvailableElements = elements.filter(
                (element) => !loadedPoints.some((point) => point.id === element.id)
            );
            setAvailableElements(updatedAvailableElements);
        } catch (error) {
            console.error(i18n.t("error.fetchPoints"), error);
        }
    };

    const handleAddPoint = (element) => {
        setPoints([...points, {...element, valeurDefaut: ''}]);
        dispatch(setPersistanceUpdated(false));
        setUnsavedChanges(true);
        // Supprimer l'élément de la liste des disponibles
        const updatedAvailableElements = availableElements.filter(
            (availableElement) => availableElement.id !== element.id
        );
        setAvailableElements(updatedAvailableElements);
    };

    const handleSavePoints = async () => {
        if (!selectedSite) return;

        let validationErrors = {};
        points.forEach((point, index) => {
            if (!point.valeurDefaut) {
                validationErrors[index] = i18n.t("error.mandatory");
            }
        });

        setErrors("");
        const payload = points.map((point) => ({
            typeBienId: selectedSite, // Ajoute l'ID du site à chaque point
            locPointMesureId: point.id, // ID du point à envoyer
        }));

        const response = await apiRequest('/api/locpointmesure/typebien', 'POST', payload)

        if (response.ok) {
            dispatch(setPersistanceUpdated(true));
            setUnsavedChanges(false);
            addToast({message: i18n.t("successUser.userCreated"), type: "success"});
        }
    };

    const handleDeletePoint = (index) => {
        const removedPoint = points[index];
        const updatedPoints = points.filter((_, i) => i !== index);

        setPoints(updatedPoints);

        // Réintégrer le point dans la liste des éléments disponibles
        setAvailableElements([...availableElements, removedPoint]);
    };

    const handleDeleteFromApi = async (point, index) => {
        const response = await apiRequest(`/api/locpointmesure/${selectedSite}/allowdelete`)
        const data = await response.json()
        if (data) {
            const response = await apiRequest(`/api/locpointmesure/${point.id}/${selectedSite}`, 'DELETE')
            if (response.ok) {
                addToast({message: i18n.t("toast.deleteSuccess"), type: "success"})
                handleDeletePoint(index)
            } else {
                addToast({message: i18n.t("error.deletePoint"), type: "error"});
            }
        } else {
            setShowDeleteModal(true)
        }
    }

    const closeQuitModal = () => {
        dispatch(setWaitingPath(false))
        setIsQuitModalOpen(false);
    };

    return (
        <>
            <div className="h-[95%] bg-gray-50 flex flex-row">

                {/* Left: Sites List */}
                <div className=" w-1/4 h-full p-4 border-r border-gray-200 bg-white shadow-md flex flex-col">
                    <h2 className=" text-lg font-bold text-primary mb-4">{i18n.t('sitesList')}</h2>

                    {/* Champ de recherche */}
                    <div className="mb-4">
                        <TextInput
                            type="text"
                            placeholder={i18n.t("search")}
                            className="w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Liste des sites */}
                    <div className="flex-1 overflow-auto">
                        <ul className="space-y-2">
                            {filteredSites.map((site) => (
                                <li
                                    key={site.id}
                                    className={`text-black cursor-pointer p-2 rounded-md text-sm transition-all duration-300 ${
                                        selectedSite === site.id ? "bg-primary text-white" : "bg-gray-100 hover:bg-gray-200"
                                    }`}
                                    onClick={() => handleSiteChange(site.id)}
                                >
                                    {site.nom}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Center: Points sélectionnés */}
                <div className="w-2/4 h-full p-6 relative">
                    <div className="w-full flex flex-row">
                        <h2 className="text-lg font-bold text-primary mb-4">{i18n.t("selectedPoints")}</h2>
                        <BioButton
                            color={"success"}
                            className="ml-auto"
                            onClick={handleSavePoints}
                        >
                            <FaSave size={15} className="mt-0.5 mr-2"/> {i18n.t("save")}
                        </BioButton>
                    </div>
                    <div className="h-full overflow-auto pr-8"> {/* Conteneur scrollable avec une hauteur fixe */}
                        {points.map((point, index) => (
                            <div
                                key={index}
                                className="relative flex flex-row items-center px-2 py-1 border border-gray-200 bg-white rounded-md shadow-md mt-2"
                            >
                                <div className="pr-8 ml-2 flex flex-row items-center gap-4">
                                    <h3 className="font-bold text-2xl text-gray-700">{point.nom} | </h3>
                                    <div className={"text-lg"}>{point.baseDesc}</div>
                                </div>
                                {!point.isFromAPI ? (
                                    <BioButton
                                        color={"failure"}
                                        className="ml-auto"
                                        onClick={() => handleDeletePoint(index)}
                                    >
                                        <FaTrashAlt size={12}/>
                                    </BioButton>
                                ) : (
                                    <BioButton
                                        color={"failure"}
                                        className="ml-auto"
                                        onClick={() => handleDeleteFromApi(point, index)}
                                    >
                                        <FaTrashAlt size={12}/>
                                    </BioButton>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Elements List */}
                <div className="w-1/4 h-full p-4 border-l border-gray-200 bg-white shadow-md flex flex-col">
                    <h2 className="text-lg font-bold text-primary mb-4">{i18n.t("elementsList")}</h2>
                    <div className="mb-4">
                        <TextInput
                            type="text"
                            placeholder={i18n.t("searchElement")}
                            className="w-full"
                            value={searchQueryElements}
                            onChange={(e) => setSearchQueryElements(e.target.value)}
                        />
                    </div>

                    {/* Liste des éléments */}
                    <div className="flex-1 overflow-auto">
                        <ul className="space-y-2">
                            {filteredAvailableElements.map((element) => (
                                <li
                                    key={element.id}
                                    className="cursor-pointer p-2 rounded-md bg-gray-100 hover:bg-gray-200 text-sm transition-all duration-300"
                                    onClick={() => handleAddPoint(element)}
                                >
                                    {element.nom} | {element.baseDesc}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <Modal show={showModal} size={"3xl"} onClose={() => setShowModal(false)} popup dismissible>
                    <Modal.Header/>
                    <Modal.Body>
                        <HiOutlineExclamationCircle
                            className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200"/>
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400 w-full text-center">
                            {i18n.t("confirmSiteChange")}
                        </h3>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="flex justify-center gap-4 items-center w-full">
                            <BioButton color="failure" onClick={() => {
                                dispatch(setPersistanceUpdated(true));
                                setUnsavedChanges(false);
                                setShowModal(false);
                                proceedSiteChange(selectedSiteTemp); // Confirmation de changement de site
                            }}>
                                <FaTrashAlt size={15} className="mt-0.5 mr-2"/> {i18n.t('proceed')}
                            </BioButton>
                            <BioButton color="gray" onClick={() => setShowModal(false)}>
                                <FaTimes size={15} className="mt-0.5 mr-2"/> {i18n.t("cancel")}
                            </BioButton>
                            <BioButton color={"success"} onClick={() => {
                                handleSavePoints();
                                dispatch(setPersistanceUpdated(true));
                                setUnsavedChanges(false);
                                setShowModal(false);
                                proceedSiteChange(selectedSiteTemp); // Confirmation de changement de site
                            }}>
                                <FaSave size={15} className="mt-0.5 mr-2"/> {i18n.t("saveAndChange")}
                            </BioButton>
                        </div>
                    </Modal.Footer>
                </Modal>
                <Modal show={showDeleteModal} size="md" onClose={() => setShowDeleteModal(false)} popup dismissible>
                    <Modal.Header/>
                    <Modal.Body>
                        <HiOutlineExclamationCircle
                            className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200"/>
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400 w-full text-center">
                            {i18n.t("deletePointTitle")}
                        </h3>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="flex justify-center items-center w-full gap-4">
                            <BioButton color="gray" onClick={() => setShowDeleteModal(false)}>
                                <FaCheck size={15} className="mt-0.5 mr-3"/> {i18n.t("acknowledge")}
                            </BioButton>
                        </div>
                    </Modal.Footer>
                </Modal>
                <QuitModal
                    isOpen={isQuitModalOpen}
                    message={i18n.t("unsavedChangesMessage")}
                    onClose={closeQuitModal}
                    onConfirm={handleChangeSiteWithoutSaving}
                    onSave={handleSaveAndChangeSite}
                />
            </div>
        </>
    )
        ;
}
