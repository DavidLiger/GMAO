'use client'
import React, {useEffect, useState} from "react";
import Select from "react-select";
import {useAPIRequest} from "../../../../../components/api/apiRequest";
import {useRouter} from "next/navigation";
import {useNavigation} from "../../../../../providers/NavigationContext";
import {useBreadcrumb} from "../../../../../providers/BreadCrumbContext";
import {useToast} from "../../../../../providers/toastProvider";
import BioButton from "../../../../../components/button/BioButton";
import {FaPlus, FaSave, FaTrashAlt} from "react-icons/fa";
import {Label, TextInput} from "flowbite-react";
import i18n from "../../../../../i18n";
import * as yup from "yup";

// Définition du schéma de validation Yup
const caracteristiquesSchema = yup.array().of(
    yup.object().shape({
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
    })
);

export default function CaracteristiquesForm() {
    const apiRequest = useAPIRequest();
    const router = useRouter();
    const {addToast} = useToast();
    const [caracteristiques, setCaracteristiques] = useState([
        {
            nom: "",
            typeChamp: "text",
            valeurDefaut: "",
            listeValeurs: [],
            unite: null,
        },
    ]);
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
        setActiveLabel(i18n.t("formTitle")); // Définir le titre de la page
    }, [setActiveLabel]);

    useEffect(() => {
        apiRequest("/api/unite/gmao")
            .then((res) => res.json())
            .then((data) => setUnites(data));
    }, []);

    const ajouterCaracteristique = () => {
        setCaracteristiques([
            ...caracteristiques,
            {
                nom: "",
                typeChamp: "text",
                valeurDefaut: "",
                listeValeurs: [],
                unite: "",
            },
        ]);
    };

    // Options pour le select du type de champ
    const typeOptions = [
        {value: "text", label: i18n.t("text")},
        {value: "number", label: i18n.t("number")},
        {value: "select", label: i18n.t("select")},
        {value: "date", label: i18n.t("date")},
        {value: "month", label: i18n.t("month")},
    ];

    const updateCaracteristique = (index, key, value) => {
        const updated = [...caracteristiques];
        updated[index][key] = value;

        if (key === "typeChamp" && value !== "select") {
            updated[index].listeValeurs = [];
            updated[index].valeurDefaut = "";
        }
        setCaracteristiques(updated);
    };

    const supprimerCaracteristique = (index) => {
        const updated = caracteristiques.filter((_, idx) => idx !== index);
        setCaracteristiques(updated);
    };

    const handleSubmit = () => {
        const updatedCaracteristiques = caracteristiques.map((carac, index) => ({
            ...carac,
            invalidNom: !carac.nom.trim(),
            invalidValeurs:
                carac.typeChamp === "select" && carac.listeValeurs.length === 0,
        }));

        setCaracteristiques(updatedCaracteristiques);

        const hasErrors = updatedCaracteristiques.some(
            (carac) => carac.invalidNom || carac.invalidValeurs
        );

        if (hasErrors) {
            return;
        }

        // Validation via Yup avant soumission (pour debug, on peut loguer les erreurs)
        caracteristiquesSchema
            .validate(caracteristiques, {abortEarly: false})
            .then(() => {
                apiRequest("/api/caracteristique/batch", "POST", caracteristiques)
                    .then((res) => res.json())
                    .then(() => {
                        addToast({message: i18n.t("toast.success"), type: "success"});
                        router.push("/parametrage/caracteristique");
                    });
            })
            .catch((err) => {
                // En cas d'erreur, on peut laisser la mise à jour du state précédente (les invalidNom / invalidValeurs)
                console.error(err);

            });
    };

    return (
        <div className="space-y-8 p-6 bg-gray-50 rounded-md shadow-md">
            {caracteristiques.map((carac, index) => {
                // Sélection du type de champ via react‑select
                const selectedTypeOption = typeOptions.find(
                    (option) => option.value === carac.typeChamp
                );

                // Options pour la valeur par défaut quand le type est "select"
                const defaultValueOptions = [{value: "", label: i18n.t("noDefaultValue")}].concat(
                    carac.listeValeurs.map((valeur) => ({value: valeur, label: valeur}))
                );
                const selectedDefaultValueOption = defaultValueOptions.find(
                    (option) => option.value === carac.valeurDefaut
                );

                // Options pour le select d'unité
                const uniteOptions = [{value: null, label: i18n.t("selectUnite")}].concat(
                    unites.map((unite) => ({
                        value: unite.id,
                        label: `${unite.nom} (${unite.libelle})`,
                    }))
                );
                const selectedUniteOption = uniteOptions.find(
                    (option) => option.value === carac.unite
                );

                return (
                    <div
                        key={index}
                        className="border border-gray-200 bg-white rounded-md p-4 shadow-sm space-y-4 relative"
                    >
                        <BioButton
                            onClick={() => supprimerCaracteristique(index)}
                            color={"failure"}
                            className={"ml-auto"}
                        >
                            <FaTrashAlt/>
                        </BioButton>

                        <div>
                            <Label>
                                {i18n.t("nomLabel")} <span className="text-red-500">*</span>
                            </Label>
                            <TextInput
                                type="text"
                                className={`w-full ${carac.invalidNom ? "border-red-500" : "border-gray-300"}`}
                                value={carac.nom}
                                required
                                onChange={(e) =>
                                    updateCaracteristique(index, "nom", e.target.value)
                                }
                            />
                            {carac.invalidNom && (
                                <p className="text-red-500 text-sm font-bold mt-1">
                                    {i18n.t("Form.validation.required", {field: i18n.t("nomLabel")})}
                                </p>
                            )}
                        </div>
                        <div>
                            <Label>
                                {i18n.t("typeLabel")} <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={selectedTypeOption}
                                onChange={(option) =>
                                    updateCaracteristique(index, "typeChamp", option.value)
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
                                        fontSize: "0.875rem",
                                        "input[type='text']:focus": {boxShadow: "none"},
                                    }),
                                    control: (provided) => ({
                                        ...provided,
                                        backgroundColor: "#f8fafc",
                                    }),
                                }}
                            />
                        </div>

                        {carac.typeChamp === "select" && (
                            <div>
                                <div className="space-y-2 border p-4">
                                    <Label>{i18n.t("possibleValueLabel")} <span
                                        className="text-red-500">*</span></Label>
                                    {carac.listeValeurs.map((valeur, i) => (
                                        <div key={i} className="w-2/3 py-1">
                                            <div className="flex items-center gap-2">
                                                <TextInput
                                                    type="text"
                                                    value={valeur}
                                                    required
                                                    className={`w-full ${carac.invalidValeurs ? "border-red-500" : "border-gray-300"}`}
                                                    onChange={(e) => {
                                                        const newValues = [...carac.listeValeurs];
                                                        newValues[i] = e.target.value;
                                                        updateCaracteristique(index, "listeValeurs", newValues);
                                                    }}
                                                />
                                                <BioButton
                                                    color={"failure"}
                                                    onClick={() => {
                                                        const newValues = carac.listeValeurs.filter((_, idx) => idx !== i);
                                                        updateCaracteristique(index, "listeValeurs", newValues);
                                                    }}
                                                >
                                                    <FaTrashAlt size={15} className="mt-0.5 mr-2"/>
                                                </BioButton>
                                            </div>
                                        </div>
                                    ))}
                                    {carac.invalidValeurs && (
                                        <p className="text-red-500 text-sm font-bold mt-1">
                                            {i18n.t("Form.validation.minSelect", {min: 1})}
                                        </p>
                                    )}
                                    <BioButton
                                        color={"primary"}
                                        className="w-full"
                                        onClick={() =>
                                            updateCaracteristique(index, "listeValeurs", [
                                                ...carac.listeValeurs,
                                                "",
                                            ])
                                        }
                                    >
                                        <FaPlus size={15} className="mr-2 mt-0.5"/>{" "}
                                        {i18n.t("addValue")}
                                    </BioButton>
                                </div>
                                <div>
                                    <Label>{i18n.t("defaultValueLabel")}</Label>
                                    <Select
                                        value={selectedDefaultValueOption}
                                        onChange={(option) =>
                                            updateCaracteristique(index, "valeurDefaut", option.value)
                                        }
                                        options={defaultValueOptions}
                                        className="w-full"
                                        classNamePrefix="react-select"
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
                                </div>
                            </div>
                        )}

                        {carac.typeChamp !== "select" && (
                            <div>
                                <Label>{i18n.t("defaultValueLabel")}</Label>
                                <div className="flex">
                                    <TextInput
                                        required
                                        type={carac.typeChamp}
                                        placeholder={i18n.t("primaryPlaceholder")}
                                        className={`w-full ${carac.invalidValeurParDefaut ? "border-red-500" : "border-gray-300"}`}
                                        value={carac.valeurDefaut}
                                        onChange={(e) =>
                                            updateCaracteristique(index, "valeurDefaut", e.target.value)
                                        }
                                        disabled={carac.typeChamp === "select"}
                                    />
                                </div>
                            </div>
                        )}
                        <div>
                            <Label>{i18n.t("uniteLabel")}</Label>
                            <Select
                                value={selectedUniteOption}
                                onChange={(option) =>
                                    updateCaracteristique(index, "unite", option.value)
                                }
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
                                        fontSize: "0.875rem",
                                        "input[type='text']:focus": {boxShadow: "none"},
                                    }),
                                    control: (provided) => ({
                                        ...provided,
                                        backgroundColor: "#f8fafc",
                                    }),
                                }}
                            />
                        </div>
                    </div>
                );
            })}

            <div className="flex justify-between">
                <BioButton color={"primary"} onClick={ajouterCaracteristique}>
                    <FaPlus size={15} className="mt-0.5 mr-2"/>{" "}
                    {i18n.t("addCaracteristique")}
                </BioButton>

                <BioButton color={"success"} onClick={handleSubmit}>
                    <FaSave size={15} className="mt-0.5 mr-2"/> {i18n.t("submit")}
                </BioButton>
            </div>
        </div>
    );
}
