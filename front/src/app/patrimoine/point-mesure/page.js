'use client'

import React, {useEffect, useState} from 'react';
import {useAPIRequest} from "../../../../components/api/apiRequest";
import {FaSave, FaTimes, FaTrashAlt} from "react-icons/fa";
import {Label, Modal, Textarea, TextInput} from "flowbite-react";
import {HiOutlineExclamationCircle} from "react-icons/hi";
import {useNavigation} from "../../../../providers/NavigationContext";
import {useBreadcrumb} from "../../../../providers/BreadCrumbContext";
import BioButton from "../../../../components/button/BioButton";
import {useToast} from "../../../../providers/toastProvider";
import i18n from "../../../../i18n";
import {setPersistanceUpdated} from "@/redux/features/modelSetterSlice";
import {useDispatch} from "react-redux";

export default function SitesManagement() {
    const apiRequest = useAPIRequest();
    const {setActiveLabel} = useNavigation();
    const {setBreadcrumbs} = useBreadcrumb();
    const dispatch = useDispatch();
    const {addToast} = useToast()

    // State management
    const [sites, setSites] = useState([]);
    const [elements, setElements] = useState([]);
    const [selectedSite, setSelectedSite] = useState(null);
    const [selectedSiteTemp, setSelectedSiteTemp] = useState(null);
    const [points, setPoints] = useState([]);
    const [unsavedChanges, setUnsavedChanges] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [searchQuery, setSearchQuery] = useState('');
    const [errors, setErrors] = useState({});
    const [availableElements, setAvailableElements] = useState(elements); // Liste des éléments disponibles
    const filteredSites = sites.filter((site) =>
        site.nom.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const [searchQueryElements, setSearchQueryElements] = useState('');

    useEffect(() => {
        setBreadcrumbs([
            {label: i18n.t('breadcrumb.patrimoine'), href: null},
        ]);
    }, [setBreadcrumbs]);

    useEffect(() => {
        setActiveLabel(i18n.t('measurePointManagement')); // Définir le titre de la page
    }, [setActiveLabel]);

    // API Calls
    useEffect(() => {
        fetchSites();
        fetchElements();
    }, []);

    const fetchSites = async () => {
        // Replace with your API endpoint
        const response = await apiRequest('/api/site');
        const data = await response.json();
        setSites(data);
    };

    const fetchElements = async () => {
        // Replace with your API endpoint
        const response = await apiRequest('/api/locpointmesure');
        const data = await response.json();
        setElements(data);
    };

// Réinitialisation des états lors du changement de site
    const handleSiteChange = (siteId) => {

        if (points.length > 0 && unsavedChanges === true) {
            // Affiche la modal si des points sont déjà présents dans la colonne centrale
            setSelectedSiteTemp(siteId)
            setShowModal(true);
        } else {
            proceedSiteChange(siteId);
        }
    };

    const filteredAvailableElements = availableElements.filter((element) =>
        element.nom.toLowerCase().includes(searchQueryElements.toLowerCase())
    );

    const proceedSiteChange = async (siteId) => {
        setSelectedSite(siteId);

        try {
            // Récupérer les points pour le site sélectionné
            const responseSite = await apiRequest(`/api/locpointmesuresite/site/${siteId}`);
            const dataSite = await responseSite.json();

            // Mettre à jour les points sélectionnés avec isFromAPI
            const loadedPointsSite = dataSite.map((point) => ({
                ...point,
                isFromAPI: true, // Ajouter cette propriété pour indiquer que c'est un élément de l'API
                numero_point_mesure: point.numero_point_mesure || '',
                baseDesc: point.baseDesc || '',
            }));
            setPoints(loadedPointsSite);

            const responseTypeBien = await apiRequest(`/api/locpointmesuresite/typebien/${siteId}`);
            const dataTypeBien = await responseTypeBien.json();
            // Mettre à jour les points sélectionnés avec isFromAPI
            const loadedPointsTypeBien = dataTypeBien.map((point) => ({
                ...point,
                isFromAPI: true, // Ajouter cette propriété pour indiquer que c'est un élément de l'API
                numeroPointMesure: point.numeroPointMesure || '',
                baseDesc: point.baseDesc || '',
            }));

            const mergedPoints = [
                ...loadedPointsSite,
                ...loadedPointsTypeBien.filter(
                    (pointTypeBien) => !loadedPointsSite.some((pointSite) => pointSite.id === pointTypeBien.id)
                ),
            ];

            setPoints(mergedPoints);
            console.log(points)
            // Supprimer les points chargés de la liste des éléments disponibles
            const updatedAvailableElements = elements.filter(
                (element) => !loadedPointsTypeBien.some((point) => point.id === element.id) &&
                    !loadedPointsSite.some((point) => point.id === element.id)
            );
            setAvailableElements(updatedAvailableElements);
        } catch (error) {
            console.error('Erreur lors du chargement des points:', error);
        }
    };

    const handleAddPoint = (element) => {
        console.log(element)
        setPoints([...points, {...element, baseDesc: element.baseDesc, numeroPointMesure: '', description: ''}]);
        setUnsavedChanges(true);

        // Supprimer l'élément de la liste des disponibles
        const updatedAvailableElements = availableElements.filter(
            (availableElement) => availableElement.id !== element.id
        );
        setAvailableElements(updatedAvailableElements);
    };

    const handleSavePoints = async () => {
        if (!selectedSite) return;
        ''
        let validationErrors = {};
        points.forEach((point, index) => {
            if (!point.numeroPointMesure) {
                validationErrors[index] = i18n.t('Form.validation.genericRquired');
            }
        });

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            const payload = points.map((point) => ({
                siteId: selectedSite, // Ajoute l'ID du site à chaque point
                locPointMesureId: point.id, // ID du point à envoyer
                numeroPointMesure: point.numeroPointMesure,
                description: point.description,
            }));

            const response = await apiRequest('/api/locpointmesuresite', 'POST', payload)

            if (response.ok) {
                setUnsavedChanges(false);
                addToast({message: "Enregistrment effectué", type: "success"})
            }
        }
    };

    const handleInputChange = (index, field, value) => {
        const updatedPoints = [...points];
        updatedPoints[index][field] = value;
        setPoints(updatedPoints);
        setUnsavedChanges(true);
    };

    const handleDeletePoint = (index) => {
        const removedPoint = points[index];
        const updatedPoints = points.filter((_, i) => i !== index);

        setPoints(updatedPoints);

        // Réintégrer le point dans la liste des éléments disponibles
        setAvailableElements([...availableElements, removedPoint]);
    };

    return (
        <>
            <div className="h-[95%] bg-gray-50 flex flex-row">
                {/* Left: Sites List */}
                <div
                    className="w-1/4 h-full p-4 border-r border-gray-200 bg-white shadow-md flex flex-col">
                    <h2 className="text-lg font-bold text-primary mb-4">{i18n.t('sitesList')}</h2>
                    <div className="mb-4">
                        <TextInput
                            type="text"
                            placeholder={i18n.t('searchSite')}
                            className="w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex-1 overflow-auto">
                        <ul className="space-y-2">
                            {filteredSites.map((site) => (
                                <li
                                    key={site.id}
                                    className={`text-black cursor-pointer p-3 rounded-md text-sm font-medium transition-all duration-300 ${
                                        selectedSite === site.id ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'
                                    }`}
                                    onClick={() => handleSiteChange(site.id)}
                                >
                                    {site.nom}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Center: Selected Points */}
                <div className="w-2/4 h-full p-4 relative">
                    <div className={'flex flex-row mb-4'}>
                        <h2 className="text-lg font-bold text-primary mb-4">{i18n.t('selectedPoints')}</h2>
                        <BioButton
                            className="ml-auto"
                            color={"success"}
                            onClick={handleSavePoints}
                        >
                            <FaSave size={15} className={"mt-0.5 mr-2"}/> {i18n.t('save')}
                        </BioButton>
                    </div>
                    <div className="h-[95%] overflow-auto pr-8"> {/* Conteneur scrollable avec une hauteur fixe */}
                        {points.map((point, index) => (
                            <div
                                key={index}
                                className="relative mb-6 p-4 border border-gray-200 bg-white rounded-md shadow-md"
                            >
                                <div className="pr-8 ml-2 flex flex-row items-center">
                                    <h3 className="font-bold text-xl text-gray-700">{point.nom} | {point.baseDesc}</h3>
                                    {!point.isFromAPI && (
                                        <BioButton
                                            color={"failure"}
                                            className={"ml-auto"}
                                            onClick={() => handleDeletePoint(index)}
                                        >
                                            <FaTrashAlt/>
                                        </BioButton>
                                    )}
                                </div>
                                <div className="grid grid-cols-4 gap-4 items-center">
                                    <div className="col-span-2">
                                        <Label className="block text-sm font-medium text-gray-700 mb-1">
                                            {i18n.t('numeroPointMesure')}<span className="text-red-500">*</span>
                                        </Label>
                                        <TextInput
                                            type="text"
                                            value={point.numeroPointMesure || ''}
                                            className={`w-full ${
                                                errors[index] ? 'border-red-600' : "border-gray-300"
                                            }`}
                                            onChange={(e) =>
                                                handleInputChange(index, 'numeroPointMesure', e.target.value)
                                            }
                                        />
                                        {errors[index] && (
                                            <span className="text-red-500 text-sm">{errors[index]}</span>
                                        )}
                                    </div>
                                    <div className="col-span-2">
                                        <Label className="block text-sm font-medium text-gray-700 mb-1">
                                            {i18n.t('description')}
                                        </Label>
                                        <Textarea
                                            value={point.description || ''}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
                                            rows="1"
                                            onChange={(e) =>
                                                handleInputChange(index, 'description', e.target.value)
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Right: Elements List */}
                <div
                    className="w-1/4 h-full p-4 border-l border-gray-200 bg-white shadow-md flex flex-col overflow-hidden">
                    <h2 className="text-lg font-bold text-primary mb-4">{i18n.t('elementsList')}</h2>
                    <div className="mb-4">
                        <TextInput
                            type="text"
                            placeholder={i18n.t('searchElement')}
                            className="w-full"
                            value={searchQueryElements}
                            onChange={(e) => setSearchQueryElements(e.target.value)}
                        />
                    </div>
                    <div className="flex-1 overflow-auto">
                        <ul className="space-y-2">
                            {filteredAvailableElements.map((element) => (
                                <li
                                    key={element.id}
                                    className="cursor-pointer p-3 rounded-md bg-gray-100 hover:bg-gray-200 text-sm font-medium transition-all duration-300"
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
                        </div>
                    </Modal.Footer>
                </Modal>
            </div>
        </>

    );
}
