'use client'
import React, {useEffect, useState} from "react";
import {useAPIRequest} from "../../../../../components/api/apiRequest";
import Characteristics from "../../../../../components/caracteristique/characteristics";
import {useNavigation} from "../../../../../providers/NavigationContext";
import {useBreadcrumb} from "../../../../../providers/BreadCrumbContext";
import BioButton from "../../../../../components/button/BioButton";
import {FaSave} from "react-icons/fa";
import {Label, Textarea, TextInput} from "flowbite-react";
import FileInput from "../../../../../components/fileinput/FileInput";
import Select from "react-select";
import i18n from "../../../../../i18n";
import * as yup from "yup";
import MapPoint from "../../../../../components/map/mapPoint";
import {useToast} from "../../../../../providers/toastProvider";
import {useRouter} from "next/navigation";

// Schéma de validation Yup pour le formulaire de site
const siteSchema = yup.object().shape({
    nom: yup.string().required(i18n.t("Form.validation.required", {field: i18n.t("formSite.name")})),
    latitude: yup.number().required(i18n.t("Form.validation.required", {field: i18n.t("formSite.latitude")})),
    longitude: yup.number().required(i18n.t("Form.validation.required", {field: i18n.t("formSite.longitude")})),
    villeId: yup.string().required(i18n.t("Form.validation.required", {field: i18n.t("formSite.city")})),
    modelId: yup.string().required(i18n.t("Form.validation.required", {field: i18n.t("formSite.modelLabel")})),
});

const SiteForm = () => {
    const apiRequest = useAPIRequest();
    const {setActiveLabel} = useNavigation();
    const {setBreadcrumbs} = useBreadcrumb();
    const router = useRouter();
    const [formData, setFormData] = useState({
        nom: "",
        latitude: null, // au lieu de 0
        longitude: null, // au lieu de 0
        villeId: "",
        postCode: "",
        description: "",
        image: null,
        imageName: "",
        characteristics: [],
        isModelBased: false,
        modelId: null,
    });

    // État pour stocker les messages d'erreur de validation
    const [validationErrors, setValidationErrors] = useState({});
    const {addToast} = useToast();
    const [models, setModels] = useState([]);
    const [modelCarac, setModelCarac] = useState([]);
    const [loading, setLoading] = useState({modelCharac: false, models: false});

    useEffect(() => {
        setBreadcrumbs([{label: i18n.t("formSite.breadcrumb"), href: null}]);
    }, [setBreadcrumbs]);

    useEffect(() => {
        setActiveLabel(i18n.t("formSite.title")); // Par exemple : "Création d'un site"
    }, [setActiveLabel]);

    useEffect(() => {
        const fetchModels = async () => {
            setLoading((prev) => ({...prev, models: true}));
            try {
                const response = await apiRequest("/api/typebien/nature/site", "GET");
                const data = await response.json();
                setModels(data);
            } catch (error) {
                console.error(i18n.t("errorSite.fetchModels"), error);
            } finally {
                setLoading((prev) => ({...prev, models: false}));
            }
        };
        fetchModels();
    }, []);

    useEffect(() => {
        if (formData.isModelBased && formData.modelId) {
            const fetchModelCarac = async () => {
                setLoading((prev) => ({...prev, modelCharac: true}));
                try {
                    const response = await apiRequest(
                        `/api/typebien/${formData.modelId}/caracteristiques`,
                        "GET"
                    );
                    const data = await response.json();
                    setModelCarac(data);
                } catch (error) {
                    console.error(i18n.t("errorSite.fetchModelCharacteristics"), error);
                } finally {
                    setLoading((prev) => ({...prev, modelCharac: false}));
                }
            };
            fetchModelCarac();
        }
    }, []);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
        // Effacer l'erreur associée dès que l'utilisateur modifie le champ
        setValidationErrors((prev) => ({...prev, [name]: undefined}));
    };

    function handleModelChange(value) {
        setFormData({...formData, isModelBased: true, modelId: value});
        setValidationErrors((prev) => ({...prev, modelId: undefined}));
    }

    const handleFileChange = (files) => {
        if (files && files.length > 0) {
            const file = files[0];
            setFormData({...formData, image: file, imageName: file.name});
            const reader = new FileReader();
            reader.onload = () => {
                setFormData((prev) => ({...prev, imagePreview: reader.result}));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleMapClick = async (latitude, longitude) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await response.json();
            const ville =
                data.address.city ||
                data.address.town ||
                data.address.village ||
                i18n.t("unknownCity");
            const postcode = data.address.postcode;
            setFormData({
                ...formData,
                latitude,
                longitude,
                villeId: ville,
                postCode: postcode,
            });
            // Effacer les erreurs liées à ces champs si présentes
            setValidationErrors((prev) => ({
                ...prev,
                latitude: undefined,
                longitude: undefined,
                villeId: undefined
            }));
        } catch (error) {
            console.error("Error fetching city data", error);
        }
    };

    const modelOptions = [
        {value: "", label: i18n.t("formSite.selectModel")},
        ...(models || []).map((model) => ({
            value: model.id,
            label: model.nom,
        })),
    ];

    const selectedModelOption = modelOptions.find(
        (option) => option.value === formData.modelId
    );

    const updateCharacteristique = (value) => {
        setFormData((prev) => ({
            ...prev,
            characteristics: value.map((char) => ({
                id: char.id,
                value: char.value,
                order: char.order,
            })),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validation du formulaire avec Yup
        try {
            await siteSchema.validate(formData, {abortEarly: false});
            setValidationErrors({});
        } catch (err) {
            const newErrors = {};
            if (err.inner && err.inner.length > 0) {
                err.inner.forEach((error) => {
                    newErrors[error.path] = error.message;
                });
            } else {
                newErrors[err.path] = err.message;
            }
            setValidationErrors(newErrors);
            return;
        }

        // Conversion de l'image en base64 si présente
        let base64Image = null;
        if (formData.image) {
            const reader = new FileReader();
            const imagePromise = new Promise((resolve, reject) => {
                reader.onload = () => {
                    resolve(reader.result);
                };
                reader.onerror = (err) => reject(err);
            });
            reader.readAsDataURL(formData.image);
            base64Image = await imagePromise;
        }

        // Construction du payload à envoyer à l'API
        const payload = {
            nom: formData.nom,
            latitude: formData.latitude,
            longitude: formData.longitude,
            nomVille: formData.villeId,
            codePostal: formData.postCode,
            description: formData.description,
            image: base64Image,
            nomImage: formData.imageName,
            caracteristiques: formData.characteristics,
            typeBienId: formData.modelId,
        };

        try {
            // Envoi des données vers l'API via une requête POST
            const response = await apiRequest("/api/site", "POST", payload);
            const result = await response.json();

            // Affichage du toast de succès et redirection
            addToast({message: i18n.t('toast.success'), type: 'success'});
            router.push('/bien');
        } catch (error) {
            addToast({message: i18n.t('errorMessage'), type: 'error'});
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="w-2/3 mx-auto bg-white shadow-md rounded-lg p-6 space-y-6"
        >
            {/* Nom */}
            <div className="flex flex-col">
                <Label>
                    {i18n.t("formSite.name")} <span className="text-red-500">*</span>
                </Label>
                <TextInput
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    required
                />
                {validationErrors.nom && (
                    <p className="text-red-500 text-sm font-bold mt-1">
                        {validationErrors.nom}
                    </p>
                )}
            </div>

            {/* Modèle */}
            <div className="mt-2">
                <Label>{i18n.t("formSite.modelLabel")} <span className="text-red-500">*</span></Label>
                <Select
                    name="modelId"
                    value={selectedModelOption}
                    onChange={(option) => handleModelChange(option.value)}
                    options={modelOptions}
                    className="w-full"
                    placeholder={i18n.t('slectPlaceHolder')}
                    classNamePrefix="react-select"
                    isDisabled={loading.models}
                    isSearchable={false}
                    styles={{
                        input: (provided) => ({
                            ...provided,
                            padding: 0,
                            height: "22px",
                            margin: 0,
                            fontSize: "0.875rem",
                            "input[type='text']:focus": {boxShadow: "none"},
                        }),
                        control: (provided) => ({
                            ...provided,
                            backgroundColor: "#f8fafc",
                        }),
                    }}
                />
                {validationErrors.modelId && (
                    <p className="text-red-500 text-sm font-bold mt-1">
                        {validationErrors.modelId}
                    </p>
                )}
            </div>

            {/* Description */}
            <div className="flex flex-col">
                <Label>{i18n.t("formSite.description")}</Label>
                <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
            </div>

            {/* Image */}
            <div>
                <Label>{i18n.t("image")}</Label>
                <FileInput
                    isImage={true}
                    onFilesSelected={handleFileChange}
                    allowMultiple={false}
                />
            </div>

            {/* Carte */}
            <div>
                <Label>{i18n.t("formSite.location")} <span className="text-red-500">*</span></Label>
                <div className="mt-4 h-96 overflow-hidden rounded-md border border-gray-300 relative">
                    <MapPoint onMapClick={handleMapClick}/>
                </div>
            </div>

            <div className="flex space-x-4">
                <div className="flex flex-col items-center">
                    <Label>{i18n.t("formSite.latitude")} <span className="text-red-500">*</span></Label>
                    <TextInput type="text" value={formData.latitude} disabled required/>
                    {validationErrors.latitude && (
                        <p className="text-red-500 text-sm font-bold mt-1">
                            {validationErrors.latitude}
                        </p>
                    )}
                </div>
                <div className="flex flex-col items-center">
                    <Label>{i18n.t("formSite.longitude")} <span className="text-red-500">*</span></Label>
                    <TextInput type="text" value={formData.longitude} disabled required/>
                    {validationErrors.longitude && (
                        <p className="text-red-500 text-sm font-bold mt-1">
                            {validationErrors.longitude}
                        </p>
                    )}
                </div>
                <div className="flex flex-col items-center">
                    <Label>{i18n.t("formSite.city")} <span className="text-red-500">*</span></Label>
                    <TextInput
                        type="text"
                        name="villeId"
                        value={formData.villeId}
                        onChange={handleInputChange}
                        disabled
                        required
                    />
                    {validationErrors.villeId && (
                        <p className="text-red-500 text-sm font-bold mt-1">
                            {validationErrors.villeId}
                        </p>
                    )}
                </div>
            </div>

            {/* Caractéristiques */}
            <Characteristics
                characteristics={formData.characteristics}
                modelCaracs={modelCarac}
                setCharacteristique={updateCharacteristique}
            />

            {/* Bouton d'envoi */}
            <div className="flex flex-row">
                <BioButton color={"success"} onClick={handleSubmit} className={'ml-auto'}>
                    <FaSave className="mt-0.5 mr-2"/> {i18n.t("formSite.submit")}
                </BioButton>
            </div>
        </form>
    );
};

export default SiteForm;
