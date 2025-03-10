import React, {useEffect, useState} from 'react';
import {useAPIRequest} from "../api/apiRequest";
import ChildSearch from "./genericComponent/ChildSearch";
import DynamicInput from "../dynamicInput/dynamicInput";
import Image from "next/image";
import {FaEdit, FaPlus, FaSave, FaTimes, FaTrashAlt} from "react-icons/fa";
import BioButton from "../button/BioButton";
import FileInput from "../fileinput/FileInput";
import {Label, Textarea, TextInput} from "flowbite-react";
import i18n from "../../i18n";
import {useToast} from "../../providers/toastProvider";
import * as yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import Select from "react-select";

const schema = yup.object().shape({
    nom: yup.string().required(i18n.t('Form.validation.required', {field: i18n.t('fields.nom')})),
});


export default function BienView({bien}) {
    const apiRequest = useAPIRequest();
    const [siteData, setSiteData] = useState(null);
    const [caracteristiques, setCaracteristiques] = useState([]);
    const [isEditingAll, setIsEditingAll] = useState(false);
    const [isEditingInfo, setIsEditingInfo] = useState(false);
    const [editedCaracteristiques, setEditedCaracteristiques] = useState({});
    const [newCaracs, setNewCaracs] = useState([]);
    const [formValues, setFormValues] = useState({
        nom: "",
        description: "",
        image: ""
    });
    // L'image affichée en vue principale (issue de la BDD)
    const [imagePreviewUrl, setImagePreviewUrl] = useState(bien.image);
    // Fichier sélectionné par l'utilisateur
    const [selectedImageFile, setSelectedImageFile] = useState(null);

    const {addToast} = useToast();

    const {
        register,
        handleSubmit,
        setValue,
        formState: {errors}
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            nom: formValues.nom,
            description: formValues.description,
            image: formValues.image
        }
    });
    const [availableCaracs, setAvailableCaracs] = useState([]);

    useEffect(() => {
        const fetchAvailableCaracs = async () => {
            try {
                const response = await apiRequest('/api/caracteristique'); // endpoint exemple
                const data = await response.json();
                setAvailableCaracs(data);
            } catch (error) {
                console.error("Erreur lors de la récupération des caractéristiques disponibles", error);
            }
        };
        fetchAvailableCaracs();
    }, []);


    useEffect(() => {
        if (siteData) {
            setValue('nom', siteData.nom || '');
            setValue('description', siteData.description || '');
            setValue('image', siteData.image || '');
        }
    }, [siteData, setValue]);

    useEffect(() => {

        setSiteData(bien);
        setFormValues({
            nom: bien.nom || "",
            description: bien.description || "",
            image: bien.image || "",
        })

    }, []);

    // Récupération des caractéristiques au montage du composant
    useEffect(() => {
        const fetchCaracteristiques = async () => {
            try {
                const response = await apiRequest(`/api/bien/${bien.id}/caracteristiques`);
                const data = await response.json();
                setCaracteristiques(data.sort((a, b) => a.priorite - b.priorite));
            } catch (error) {
                console.error("Erreur lors de la récupération des caractéristiques :", error);
            }
        };
        fetchCaracteristiques();
    }, [bien.id]);

    const handleRemoveExistingCarac = async (id) => {
        try {
            // Appel de l'API pour supprimer la caractéristique existante
            await apiRequest(`/api/bien/caracteristique/${bien.id}`, 'DELETE', {
                id: id,
            });
            // Mise à jour de l'état local en filtrant l'élément supprimé
            setCaracteristiques((prev) =>
                prev.filter((c) => c.caracteristique.id !== id)
            );
        } catch (error) {
            console.error("Erreur lors de la suppression de la caractéristique :", error);
        }
    };

    const handleSelectChange = (uid, selectedOption) => {
        const updated = newCaracs.map(item =>
            item.uid === uid
                ? {
                    ...item,
                    id: selectedOption.value,
                    typeChamp: selectedOption.typeChamp,
                    listeValeurs: selectedOption.listeValeurs
                }
                : item
        );
        setNewCaracs(updated);
    };
    const handleValueChange = (uid, newValue) => {
        const updated = newCaracs.map(item =>
            item.uid === uid
                ? {...item, value: newValue}
                : item
        );
        setNewCaracs(updated);
    };
    // Sauvegarde des caractéristiques éditées
    const handleSaveCaracteristiques = async () => {
        try {
            // Préparation des mises à jour pour les caractéristiques existantes
            const existingUpdates = Object.keys(editedCaracteristiques)
                .map((id) => {
                    const value = editedCaracteristiques[id];
                    const caract = caracteristiques.find(
                        (c) => c.caracteristique.id === parseInt(id, 10)
                    );
                    if (!caract) return null;
                    return {
                        id: parseInt(id, 10),
                        value,
                        priorite: caract.priorite,
                    };
                })
                .filter((item) => item !== null);

            // Filtrage des nouvelles caractéristiques pour n'inclure que celles sélectionnées
            const validNewCaracs = newCaracs.filter(carac => carac.id !== null && carac.id !== undefined);

            const combinedPayload = [...existingUpdates, ...validNewCaracs];

            await apiRequest(`/api/bien/caracteristiques/${bien.id}`, 'POST', combinedPayload);

            // Mise à jour de l'état local avec les caractéristiques existantes et ajout des nouvelles
            setCaracteristiques((prev) => {
                const updatedExisting = prev.map((caract) => {
                    const update = existingUpdates.find(
                        (u) => u.id === caract.caracteristique.id
                    );
                    return update ? {...caract, valeur: update.value} : caract;
                });
                const addedNew = validNewCaracs.map(carac => {
                    // Récupération des infos de la caractéristique sélectionnée
                    const caracDetails = availableCaracs.find(c => c.id === carac.id);
                    return {
                        caracteristique: caracDetails,
                        valeur: carac.value,
                        priorite: prev.length + 1
                    };
                });
                return [...updatedExisting, ...addedNew];
            });

            // Réinitialisation des états d'édition
            setEditedCaracteristiques({});
            setNewCaracs([]);
            setIsEditingAll(false);
        } catch (error) {
            console.error("Erreur lors de l'enregistrement des caractéristiques :", error);
        }
    };


    const getFilteredOptions = (currentUid) => {
        // IDs déjà utilisés dans la liste existante
        const usedIds = caracteristiques.map(c => c.caracteristique.id);
        // IDs déjà sélectionnés dans d'autres nouveaux ajouts (hors l'élément courant)
        const selectedNewIds = newCaracs
            .filter(carac => carac.uid !== currentUid && carac.id)
            .map(carac => carac.id);
        return availableCaracs
            .filter(c => !usedIds.includes(c.id) && !selectedNewIds.includes(c.id))
            .map(c => ({
                value: c.id,
                label: c.nom + (c.unite ? ' (' + c.unite?.libelle + ')' : ''),
                typeChamp: c.typeChamp,
                listeValeurs: c.listeValeurs
            }));
    };
    const handleAddCarac = () => {
        const newItem = {
            uid: Date.now() + Math.random(),
            id: null,
            value: '',
            typeChamp: null,
            listeValeurs: null
        };
        setNewCaracs([...newCaracs, newItem]);
    };

    // Fonction pour sauvegarder l'image après confirmation
    const onSubmit = async (data) => {
        try {
            let imagePayload = siteData.image;
            if (selectedImageFile) {
                imagePayload = await convertToBase64(selectedImageFile);
            }
            const payload = {
                ...data,
                image: imagePayload,
            };
            await apiRequest(`/api/bien/${bien.id}`, "PUT", payload);
            setSiteData(prev => ({...prev, ...data, image: imagePayload}));
            setImagePreviewUrl(imagePayload)
            setIsEditingInfo(false);
            addToast({message: i18n.t('successUser.userCreated'), type: 'success'});
        } catch (error) {
            console.error("Erreur lors de la soumission du formulaire :", error);
            addToast({message: i18n.t('errorMessage'), type: 'error'});
        }
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    // Gestion de la sélection du fichier
    const handleFileChange = (files) => {
        if (files && files.length > 0) {
            const file = files[0];
            setSelectedImageFile(file);
        } else {
            setSelectedImageFile(null);
        }
    };

    const removeImage = async () => {
        const response = await apiRequest(`/api/bien/deleteimage/${bien.id}`, 'DELETE')
        if (response.ok) {
            setIsEditingInfo(false)
            addToast({message: i18n.t('toast.deleteSuccess'), type: 'success'})
            setImagePreviewUrl(null)
        } else {
            addToast({message: i18n.t('errorMessage'), type: 'failure'})
        }
    }

    const handleRemoveNewCarac = (uid) => {
        const updated = newCaracs.filter(item => item.uid !== uid);
        setNewCaracs(updated);
    };
    return (
        <div className="p-6 space-y-4">
            {/* Bandeau d'en-tête */}
            <div className="p-4 border bg-white rounded-md shadow-md">
                {isEditingInfo ? (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <Label>{i18n.t('fields.nom')} <span className="text-red-500">*</span></Label>
                            <TextInput
                                type="text"
                                className=""
                                defaultValue={formValues.nom}
                                {...register('nom')}
                            />
                            {errors.nom && <p className="text-red-500 text-sm">{errors.nom.message}</p>}
                        </div>
                        <div>
                            <Label>{i18n.t('fields.desc')}</Label>
                            <Textarea
                                className=""
                                defaultValue={formValues.description}
                                {...register('description')}
                            />
                        </div>
                        <div>

                            <div className={"flex flex-col"}>
                                {imagePreviewUrl &&
                                    <div className="flex flex-col">
                                        <Label>{i18n.t('fields.imageNow')}</Label>
                                        <div className={'flex flex-row gap-4'}>
                                            <div className="relative w-[100px] h-[100px]">
                                                <Image
                                                    src={imagePreviewUrl}
                                                    alt={`Image de ${bien.nom}`}
                                                    layout="fill"
                                                    objectFit="cover"
                                                    className="rounded-md"
                                                />
                                            </div>
                                            <div className={'flex items-start'}>
                                                <BioButton
                                                    color={'failure'}
                                                    onClick={() => removeImage()}
                                                    className={'flex items-center h-fit'}
                                                >
                                                    <FaTrashAlt
                                                        className="text-white text-center"/>
                                                </BioButton>
                                            </div>
                                        </div>
                                    </div>}
                                <Label
                                    className={'w-36 mt-4'}>{imagePreviewUrl ? i18n.t('fields.replaceBy') : i18n.t('fields.image')}</Label>
                                <div className={''}>
                                    <FileInput
                                        allowMultiple={false}
                                        isImage={true}
                                        onFilesSelected={handleFileChange}
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Boutons de soumission et d'annulation placés à l'intérieur du formulaire */}
                        <div className="flex flex-row mt-2 justify-between">
                            <BioButton
                                color="gray"
                                onClick={() => setIsEditingInfo(false)}
                                type="button"
                            >
                                <FaTimes className="mt-0.5 mr-2"/> {i18n.t('cancel')}
                            </BioButton>
                            <BioButton color="success" type="submit">
                                <FaSave className="mt-0.5 mr-2"/> {i18n.t('save')}
                            </BioButton>
                        </div>
                    </form>
                ) : (
                    <div>
                        <div className="flex flex-row justify-between">
                            <div className="flex-grow">
                                <h1 className="text-4xl font-bold text-primary flex w-full gap-2">
                                    <p className="text-4xl font-bold text-primary w-full">
                                        {siteData?.nom}
                                    </p>
                                </h1>
                                <p>
                                    <strong>{i18n.t('type')} :</strong> {bien.typeBien.nom}
                                </p>
                                <p>
                                    <strong>{i18n.t('tags')} :</strong> {bien.tags?.join(', ') || i18n.t('noTags')}
                                </p>
                                <p>
                                    <strong>{i18n.t('description')} :</strong> {siteData?.description || i18n.t('noDescription')}
                                </p>
                            </div>

                            {/* Affichage de l'image avec option d'édition */}
                            <div className="flex-shrink-0 ml-4">
                                <div className="relative w-[100px] h-[100px]">
                                    {imagePreviewUrl &&
                                        <div className="relative group w-[100px] h-[100px]">
                                            <Image
                                                src={imagePreviewUrl}
                                                alt={`Image de ${bien.nom}`}
                                                layout="fill"
                                                objectFit="cover"
                                                className="rounded-md"
                                            />
                                        </div>

                                    }
                                </div>
                            </div>
                        </div>
                        <div className={'flex flex-row justify-between'}>
                            <BioButton
                                color={"primary"}
                                onClick={() => setIsEditingInfo(true)}
                                className={'ml-auto mt-2'}
                            >
                                <FaEdit size={15} className="mt-0.5 mr-2"/> {i18n.t('edit')}
                            </BioButton>
                        </div>
                    </div>
                )}
            </div>
            {/* Bloc des caractéristiques */}
            <div className="p-4 border rounded-md bg-white shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-primary">
                        {i18n.t('characteristics')}
                    </h2>
                </div>
                <div
                    className={`grid grid-cols-1 sm:grid-cols-5 md:grid-cols-5 gap-4 `}>
                    {caracteristiques.map((caract) => (
                        <div
                            key={caract.caracteristique.id}
                            className={`"p-2 bg-gray-100 rounded-md shadow-md relative"  ${isEditingAll ? 'h-28' : 'h-12'}`}
                        >

                            <span className="text-sm font-medium text-gray-800 ml-2">
                            {caract.caracteristique.nom}{" "}
                                {caract.caracteristique.unite
                                    ? `(${caract.caracteristique.unite.libelle})`
                                    : ""}
                          </span>
                            {isEditingAll ? (
                                <div className={'flex flex-row mx-2 items-center gap-4 relative mt-3'}>
                                    <DynamicInput

                                        caracteristique={caract.caracteristique}
                                        value={
                                            editedCaracteristiques[caract.caracteristique.id] ??
                                            caract.valeur
                                        }
                                        onChange={(value) =>
                                            setEditedCaracteristiques({
                                                ...editedCaracteristiques,
                                                [caract.caracteristique.id]: value,
                                            })
                                        }
                                        showLabel={false}
                                    />
                                    <button
                                        onClick={() => handleRemoveExistingCarac(caract.caracteristique.id)}
                                        className={'absolute right-2 -top-7 bg-red-500 p-1 rounded'}
                                    >
                                        <FaTrashAlt className={'text-white'} size={12}/>
                                    </button>
                                </div>
                            ) : (
                                <p title={caract.valeur}
                                   className="truncate mt-1 text-sm text-gray-600 ml-2">{caract.caracteristique.typeChamp === 'date' ? i18n.format(caract.valeur)
                                    : caract.caracteristique.typeChamp === 'month' ? i18n.format(caract.valeur, 'month')
                                        : caract.valeur}</p>
                            )}
                        </div>
                    ))}
                    {isEditingAll &&
                        <>
                            {newCaracs.map((carac) => (
                                <div key={carac.uid}
                                     className="p-2 bg-gray-100 rounded-md shadow-md relative h-28">
                                    <div className={'flex flex-col space-y-3'}>
                                        <Select
                                            noOptionsMessage={() => i18n.t('noOption')}
                                            className={'max-w-52 text-sm'}
                                            options={getFilteredOptions(carac.uid)}
                                            placeholder={i18n.t('form.selectOption')}
                                            onChange={(option) => handleSelectChange(carac.uid, option)}
                                            styles={{
                                                input: (provided) => ({
                                                    ...provided,
                                                    padding: 0,
                                                    height: "22px",
                                                    margin: 0,
                                                    "input[type='text']:focus": {boxShadow: "none"},
                                                }),
                                                control: (provided) => ({
                                                    ...provided,
                                                    backgroundColor: "#f8fafc",
                                                }),
                                                // Personnalisation de la largeur du menu déroulant
                                                menu: (provided) => ({
                                                    ...provided,
                                                    width: 290, // Vous pouvez définir ici la largeur souhaitée pour la liste
                                                }),
                                            }}
                                            components={{
                                                DropdownIndicator: () => null,
                                                MultiValue: () => null,
                                            }}
                                        />
                                        {carac.id && (
                                            <div className={'w-52'}>
                                                <DynamicInput
                                                    caracteristique={carac}
                                                    showLabel={false}
                                                    value={carac.value}
                                                    onChange={(val) => handleValueChange(carac.uid, val)}
                                                />
                                            </div>
                                        )}
                                        <button onClick={() => handleRemoveNewCarac(carac.uid)} color="failure"
                                                className={'absolute right-2 -top-1 bg-red-500 p-1 rounded'}
                                        >
                                            <FaTrashAlt className={'text-white'} size={12}/>
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <div className="flex items-center justify-center h-28">
                                <BioButton
                                    onClick={handleAddCarac}
                                    color="gray"
                                    className="flex items-center justify-center w-full h-full bg-gray-100 hover:bg-gray-200 shadow-md"
                                >
                                    <FaPlus size={48} className={'text-green-700'}/>
                                </BioButton>
                            </div>
                        </>
                    }
                </div>
                <div>
                    {isEditingAll ? (
                        <div className={'flex flex-row mt-6 space between'}>
                            <BioButton color={'gray'} onClick={() => setIsEditingAll(false)}>
                                <FaTimes className="mt-0.5 mr-2"/> {i18n.t('cancel')}
                            </BioButton>
                            <BioButton color={'success'} onClick={() => handleSaveCaracteristiques()}
                                       className={'ml-auto'}>
                                <FaSave className="mt-0.5 mr-2"/> {i18n.t('save')}
                            </BioButton>
                        </div>
                    ) : (
                        <BioButton
                            color={"primary"}
                            onClick={() => setIsEditingAll(true)}
                            className={'ml-auto mt-2'}
                        >
                            <FaEdit size={15} className="mt-0.5 mr-2"/> {i18n.t('edit')}
                        </BioButton>
                    )
                    }
                </div>
            </div>

            <ChildSearch bien={bien}/>
        </div>
    );
}
