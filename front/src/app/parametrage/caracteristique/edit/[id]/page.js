'use client'
import React, {useEffect, useState} from 'react';
import {useParams, useRouter} from 'next/navigation';
import {useAPIRequest} from '../../../../../../components/api/apiRequest';
import {Label, TextInput} from 'flowbite-react';
import {useToast} from '../../../../../../providers/toastProvider';
import {useNavigation} from '../../../../../../providers/NavigationContext';
import {useBreadcrumb} from '../../../../../../providers/BreadCrumbContext';
import BioButton from '../../../../../../components/button/BioButton';
import {FaPlus, FaSave, FaTimes, FaTrashAlt} from 'react-icons/fa';
import Select from 'react-select';
import i18n from '../../../../../../i18n';
import * as yup from "yup";

// Définition du schéma de validation pour une caractéristique
const caracteristiqueSchema = yup.object().shape({
    nom: yup
        .string()
        .trim()
        .required(i18n.t("Form.validation.required", {field: i18n.t("nomLabel")})),
    typeChamp: yup
        .string()
        .required(i18n.t("Form.validation.required", {field: i18n.t("typeLabel")})),
    listeValeurs: yup.array().when("typeChamp", {
        is: "select",
        then: () => yup.array().min(1, i18n.t("Form.validation.minSelect", {min: 1})),
        otherwise: () => yup.array().notRequired()
    }),
    valeurDefaut: yup.string(),
    unite: yup.number().notRequired()
});

export default function EditCaracteristique() {
    const {id} = useParams();
    const apiRequest = useAPIRequest();
    const router = useRouter();
    const {addToast} = useToast();
    const [caracteristique, setCaracteristique] = useState(null);
    const [unites, setUnites] = useState([]);
    const {setActiveLabel} = useNavigation();
    const {setBreadcrumbs} = useBreadcrumb();

    useEffect(() => {
        setBreadcrumbs([
            {label: "Parametrage", href: null},
            {label: "Caractéristique", href: "/parametrage/caracteristique"},
        ]);
    }, [setBreadcrumbs]);

    useEffect(() => {
        setActiveLabel(i18n.t("editTitle")); // Définir le titre de la page
    }, [setActiveLabel]);

    useEffect(() => {
        // Charger les données de la caractéristique
        apiRequest(`/api/caracteristique/${id}`)
            .then((res) => res.json())
            .then((data) => {
                const updatedData = {
                    ...data
                };
                setCaracteristique(updatedData);
            })
            .catch((error) =>
                console.error("Erreur de chargement de la caractéristique:", error)
            );

        // Charger les unités disponibles
        apiRequest('/api/unite/gmao')
            .then((res) => res.json())
            .then((data) => setUnites(data))
            .catch((error) =>
                console.error("Erreur de chargement des unités:", error)
            );
    }, [id]);

    const updateCaracteristique = (key, value) => {
        setCaracteristique((prev) => {
            const updated = {...prev, [key]: value};

            if (key === 'typeChamp') {
                if (value === 'select') {
                    updated.listeValeurs = updated.listeValeurs || [];
                    updated.valeurDefaut = '';
                } else {
                    updated.listeValeurs = [];
                    updated.valeurDefaut = '';
                }
            }

            return updated;
        });
    };

    // Ajout de la validation avant la mise à jour
    const handleUpdate = () => {
        // Valider l'objet "caracteristique" via Yup
        caracteristiqueSchema.validate(caracteristique, {abortEarly: false})
            .then((validatedData) => {
                // Si la validation réussit, on procède à la mise à jour
                apiRequest(`/api/caracteristique/${id}`, 'PUT', caracteristique)
                    .then((res) => res.json())
                    .then(() => {
                        addToast({message: i18n.t('toast.success'), type: 'success'});
                        router.push('/parametrage/caracteristique');
                    })
                    .catch((error) => {
                        console.error("Erreur de mise à jour de la caractéristique:", error);
                        addToast({message: i18n.t('toast.error'), type: 'error'});
                    });
            })
            .catch((err) => {
                // En cas d'erreur, on met à jour le state pour indiquer les erreurs
                console.log(err)
                let invalidNom = false;
                let invalidValeurs = false;
                if (err.inner && err.inner.length > 0) {
                    err.inner.forEach((error) => {
                        if (error.path === 'nom') {
                            invalidNom = true;
                        }
                        if (error.path === 'listeValeurs') {
                            invalidValeurs = true;
                        }
                    });
                }
                setCaracteristique({...caracteristique, invalidNom, invalidValeurs});
                // Affichage des erreurs dans la console pour debug
                console.error(err);
            });
    };

    if (!caracteristique) {
        return <p>{i18n.t('loading')}</p>;
    }

    // Options pour le select du type de champ
    const typeOptions = [
        {value: 'text', label: i18n.t('text')},
        {value: 'number', label: i18n.t('number')},
        {value: 'select', label: i18n.t('select')},
        {value: 'date', label: i18n.t('date')},
        {value: 'month', label: i18n.t('month')},
    ];
    const selectedTypeOption = typeOptions.find(
        (option) => option.value === caracteristique.typeChamp
    );

    // Options pour la valeur par défaut (pour le type "select")
    const defaultValueOptions = [{value: '', label: i18n.t('noDefaultValue')}].concat(
        (caracteristique.listeValeurs || []).map((valeur) => ({
            value: valeur,
            label: valeur,
        }))
    );
    const selectedDefaultValueOption = defaultValueOptions.find(
        (option) => option.value === caracteristique.valeurDefaut
    );

    // Options pour le select d'unité
    const uniteOptions = [{value: '', label: i18n.t('selectUnite')}].concat(
        (unites || []).map((unite) => ({
            value: unite.id,
            label: unite.nom,
        }))
    );
    const selectedUniteOption = uniteOptions.find(
        (option) => option.value === (caracteristique.unite || '')
    );

    return (
        <div className="space-y-8 p-6 bg-gray-50 rounded-md shadow-md">
            <div className="border border-gray-200 bg-white rounded-md p-4 shadow-sm space-y-4 relative">
                <div>
                    <Label>{i18n.t('nomLabel')} <span className="text-red-500">*</span></Label>
                    <TextInput
                        type="text"
                        className={`w-full ${caracteristique.invalidNom ? 'border-red-500' : 'border-gray-300'}`}
                        value={caracteristique.nom}
                        required
                        onChange={(e) => updateCaracteristique('nom', e.target.value)}
                    />
                    {caracteristique.invalidNom && (
                        <p className="text-red-500 text-sm font-bold mt-1">
                            {i18n.t("Form.validation.required", {field: i18n.t("nomLabel")})}
                        </p>
                    )}
                </div>
                <div>
                    <Label>{i18n.t('typeLabel')} <span className="text-red-500">*</span></Label>
                    <Select
                        value={selectedTypeOption}
                        onChange={(option) =>
                            updateCaracteristique('typeChamp', option.value)
                        }
                        options={typeOptions}
                        className="w-full"
                        classNamePrefix="react-select"
                        isSearchable={false}
                        styles={{
                            input: (provided) => ({
                                ...provided,
                                padding: 0,
                                height: "22px",
                                margin: 0,
                                fontSize: '0.875rem',
                                "input[type='text']:focus": {boxShadow: 'none'},
                            }),
                            control: (provided) => ({
                                ...provided,
                                backgroundColor: "#f8fafc"
                            })
                        }}
                    />
                </div>

                {caracteristique.typeChamp === 'select' && (
                    <div>
                        <div className="space-y-2 border p-4">
                            <Label>{i18n.t('possibleValueLabel')} <span className="text-red-500">*</span></Label>
                            {caracteristique.listeValeurs.map((valeur, i) => (
                                <div key={i} className="w-2/3 py-1">
                                    <div className="flex items-center gap-2">
                                        <TextInput
                                            type="text"
                                            value={valeur}
                                            required
                                            className={`w-full ${caracteristique.invalidValeurs ? 'border-red-500' : 'border-gray-300'}`}
                                            onChange={(e) => {
                                                const newValues = [...caracteristique.listeValeurs];
                                                newValues[i] = e.target.value;
                                                updateCaracteristique('listeValeurs', newValues);
                                            }}
                                        />
                                        <BioButton
                                            color={'failure'}
                                            onClick={() => {
                                                const newValues = caracteristique.listeValeurs.filter((_, idx) => idx !== i);
                                                updateCaracteristique('listeValeurs', newValues);
                                            }}
                                        >
                                            <FaTrashAlt size={12} className="mt-0.5 mr-2"/>
                                            {i18n.t('delete')}
                                        </BioButton>
                                    </div>
                                </div>
                            ))}
                            {caracteristique.invalidValeurs && (
                                <p className="text-red-500 text-sm font-bold mt-1">
                                    {i18n.t("Form.validation.minSelect", {min: 1})}
                                </p>
                            )}
                            <BioButton
                                color={'primary'}
                                className="w-full"
                                onClick={() =>
                                    updateCaracteristique('listeValeurs', [
                                        ...caracteristique.listeValeurs,
                                        '',
                                    ])
                                }
                            >
                                <FaPlus size={12} className="mt-0.5 mr-2"/>
                                {i18n.t('addValue')}
                            </BioButton>
                        </div>
                        <div>
                            <Label>{i18n.t('defaultValueLabel')}</Label>
                            <Select
                                value={selectedDefaultValueOption}
                                onChange={(option) => updateCaracteristique('valeurDefaut', option.value)}
                                options={defaultValueOptions}
                                className="w-full"
                                classNamePrefix="react-select"
                                isSearchable={false}
                                isDisabled={caracteristique.typeChamp !== 'select'}
                                styles={{
                                    input: (provided) => ({
                                        ...provided,
                                        padding: 0,
                                        height: "22px",
                                        margin: 0,
                                        fontSize: '0.875rem',
                                        "input[type='text']:focus": {boxShadow: 'none'},
                                    }),
                                    control: (provided) => ({
                                        ...provided,
                                        backgroundColor: "#f8fafc"
                                    })
                                }}
                            />
                        </div>
                    </div>
                )}

                {caracteristique.typeChamp !== 'select' && (
                    <div>
                        <Label>{i18n.t('defaultValueLabel')}</Label>
                        <div className="flex">
                            <TextInput
                                required
                                type={caracteristique.typeChamp}
                                placeholder={i18n.t('primaryPlaceholder')}
                                className={`w-full ${caracteristique.invalidValeurParDefaut ? 'border-red-500' : 'border-gray-300'}`}
                                value={caracteristique.valeurDefaut}
                                onChange={(e) => updateCaracteristique('valeurDefaut', e.target.value)}
                                disabled={caracteristique.typeChamp === 'select'}
                            />
                        </div>
                    </div>
                )}

                <div>
                    <Label>{i18n.t('uniteLabel')}</Label>
                    <Select
                        value={selectedUniteOption}
                        onChange={(option) => updateCaracteristique('unite', option.value)}
                        options={uniteOptions}
                        className="w-full"
                        classNamePrefix="react-select"
                        isSearchable={false}
                        styles={{
                            input: (provided) => ({
                                ...provided,
                                padding: 0,
                                height: "22px",
                                margin: 0,
                                fontSize: '0.875rem',
                                "input[type='text']:focus": {boxShadow: 'none'},
                            }),
                            control: (provided) => ({
                                ...provided,
                                backgroundColor: "#f8fafc"
                            })
                        }}
                    />
                </div>
            </div>

            <div className="flex justify-between">
                <BioButton
                    color={'gray'}
                    onClick={() => router.push('/parametrage/caracteristique')}
                >
                    <FaTimes size={12} className="mt-0.5 mr-2"/> {i18n.t('cancel')}
                </BioButton>

                <BioButton color={'success'} onClick={handleUpdate}>
                    <FaSave size={12} className="mt-0.5 mr-2"/> {i18n.t('update')}
                </BioButton>
            </div>
        </div>
    );
}
