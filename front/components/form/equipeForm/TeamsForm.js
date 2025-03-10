'use client';
import React, {useEffect, useState} from "react";
import Select from "react-select";
import {FaSave, FaTimes, FaTrashAlt} from "react-icons/fa";
import {useRouter} from "next/navigation";
import {useAPIRequest} from "../../api/apiRequest";
import BioButton from "../../button/BioButton";
import {Checkbox, Label, TextInput} from "flowbite-react";
import i18n from "../../../i18n";
import {useToast} from "../../../providers/toastProvider";

// Import de react-hook-form et yup
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";

// Schéma de validation Yup pour les champs obligatoires (ceux affichant une *)
const schema = yup.object().shape({
    teamName: yup
        .string()
        .required(i18n.t("Form.validation.required", {field: i18n.t("teamName")})),
    teamColor: yup
        .object()
        .required(i18n.t("Form.validation.required", {field: i18n.t("teamColor")})),
    selectedUsers: yup
        .array()
        .min(1, i18n.t("Form.validation.minSelect"))
});

const TeamForm = ({teamId}) => {
    const router = useRouter();
    const apiRequest = useAPIRequest();
    const {addToast} = useToast();

    // On garde la gestion de la liste globale des utilisateurs
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(!!teamId);

    const colorOptions = [
        { value: "bg-white", label: i18n.t("white") },
        { value: "bg-red-500", label: i18n.t("red") },
        { value: "bg-green-500", label: i18n.t("green") },
        { value: "bg-yellow-200", label: i18n.t("yellow") },
        { value: "bg-orange-400", label: i18n.t("orange") },
        { value: "bg-blue-500", label: i18n.t("blue") },
        { value: "bg-purple-600", label: i18n.t("purple") },
        { value: "bg-black", label: i18n.t("black") },
        { value: "bg-cyan-500", label: i18n.t("cyan") },
    ];

    // Initialisation de react-hook-form
    const {register, handleSubmit, setValue, reset, watch, formState: {errors}} = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            teamName: "",
            teamLabel: "",
            teamColor: {value: "white", label: i18n.t("white")},
            selectedUsers: [],
            teamLeader: null
        }
    });

    // Chargement des utilisateurs et tri alphabétique (ne touche pas aux conditions)
    useEffect(() => {
        apiRequest("/api/utilisateur/employe")
            .then((response) => response.json())
            .then((data) =>
                setUsers(
                    data.sort((a, b) =>
                        a.nom.localeCompare(b.nom, 'fr', {sensitivity: 'base'})
                    )
                )
            );
    }, []);

    // Chargement des données de l'équipe en mode édition (ne modifiez pas la condition)
    useEffect(() => {
        if (teamId) {
            const fetchTeamData = async () => {
                try {
                    const response = await apiRequest(`/api/equipe/${teamId}`, "GET");
                    const team = await response.json();
                    // Trouver l'option de couleur correspondant à celle de l'équipe
                    const selectedColor = colorOptions.find((c) => c.value === team.color) || {
                        value: "white",
                        label: i18n.t("white")
                    };
                    // Trier les membres sélectionnés par ordre alphabétique
                    const sortedMembers = (team.equipeUtilisateurs || []).sort((a, b) =>
                        a.nom.localeCompare(b.nom, 'fr', {sensitivity: 'base'})
                    );
                    // On réinitialise les valeurs du formulaire via react-hook-form
                    reset({
                        teamName: team.nom,
                        teamLabel: team.label || "",
                        teamColor: selectedColor,
                        selectedUsers: sortedMembers,
                        teamLeader: team.equipeUtilisateurs.find((user) => user.responsable === true) || null
                    });
                } catch (error) {
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            };
            fetchTeamData();
        }
    }, [teamId]);

    // Gestion de la sélection des membres via react-select
    // On affiche uniquement les utilisateurs non déjà sélectionnés
    const currentSelected = watch("selectedUsers") || [];
    const handleAddUser = (option) => {
        if (option && option.user) {
            // Ajoute l'utilisateur et trie par nom
            const updated = [...currentSelected, option.user].sort((a, b) =>
                a.nom.localeCompare(b.nom, 'fr', {sensitivity: 'base'})
            );
            setValue("selectedUsers", updated);
        }
    };

    // Retrait d'un utilisateur et, si nécessaire, réinitialisation du teamLeader
    const handleRemoveUser = (userId) => {
        const updated = currentSelected.filter((user) => user.id !== userId);
        setValue("selectedUsers", updated);
        const currentLeader = watch("teamLeader");
        if (currentLeader && currentLeader.id === userId) {
            setValue("teamLeader", null);
        }
    };

    // Gestion du changement de chef d'équipe
    const handleTeamLeaderChange = (user) => {
        setValue("teamLeader", user);
    };

    // Soumission du formulaire (les validations se font via yupResolver)
    const onSubmit = async (data) => {
        const payload = {
            nom: data.teamName,
            label: data.teamLabel,
            color: data.teamColor.value,
            responsable: data.teamLeader ? data.teamLeader.id : null,
            membres: data.selectedUsers.map((user) => user.id),
        };

        try {
            if (teamId) {
                await apiRequest(`/api/equipe/${teamId}`, "PUT", payload);
            } else {
                await apiRequest("/api/equipe", "POST", payload);
            }
            addToast({message: i18n.t("successMessage"), type: "success"});
            router.push("/parametrage/equipe");
        } catch (error) {
            console.error(error);
            addToast({message: i18n.t("errorMessage"), type: "failure"});
        }
    };

    return (
        <div className="p-8 bg-white rounded-lg shadow-md">
            {loading ? (
                <p>{i18n.t("loading")}</p>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <Label className="block text-sm font-medium mb-2">
                            {i18n.t("teamName")} <span className="text-red-500">*</span>
                        </Label>
                        <TextInput
                            type="text"
                            placeholder={i18n.t("teamName")}
                            {...register("teamName")}
                        />
                        {errors.teamName && (
                            <p className="text-red-500 text-sm font-bold mt-1">{errors.teamName.message}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <Label className="block text-sm font-medium mb-2">
                            {i18n.t("teamLabel")}
                        </Label>
                        <TextInput
                            type="text"
                            placeholder={i18n.t("teamLabel")}
                            {...register("teamLabel")}
                        />
                    </div>

                    <div className="mb-4">
                        <Label className="block text-sm font-medium mb-2">
                            {i18n.t("teamColor")} <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            value={watch("teamColor")}
                            onChange={(option) => setValue("teamColor", option)}
                            options={colorOptions.map((color) => ({
                                value: color.value,
                                label: (
                                    <div key={color.value} className="flex items-center gap-2">
                                        <span className={`${color.value} rounded-full w-4 h-4 border border-gray-500`}/>
                                        {color.label}
                                    </div>
                                ),
                                // On conserve également l'objet complet pour la validation
                                color
                            }))}
                            isSearchable
                            placeholder={i18n.t("slectPlaceHolder")}
                            getOptionLabel={(e) => e.label}
                            styles={{
                                input: (provided) => ({
                                    ...provided,
                                    padding: 0,
                                    height: "22px",
                                    margin: 0,
                                    fontSize: "0.875rem",
                                    "input[type='text']:focus": {boxShadow: "none"}
                                }),
                                control: (provided) => ({
                                    ...provided,
                                    backgroundColor: "#f8fafc"
                                }),
                            }}
                        />
                        {errors.teamColor && (
                            <p className="text-red-500 text-sm font-bold mt-1">{errors.teamColor.message}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <Label className="block text-sm font-medium mb-2">
                            {i18n.t("addMembers")} <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            options={users
                                .filter(user => !currentSelected.some(selected => selected.id === user.id))
                                .map(user => ({
                                    value: user.id,
                                    label: `${user.prenom} ${user.nom}`,
                                    user: user
                                }))
                            }
                            onChange={(option) => handleAddUser(option)}
                            isSearchable
                            placeholder={i18n.t("slectPlaceHolder")}
                            value=""
                            styles={{
                                input: (provided) => ({
                                    ...provided,
                                    padding: 0,
                                    height: "22px",
                                    margin: 0,
                                    fontSize: "0.875rem",
                                    "input[type='text']:focus": {boxShadow: "none"}
                                }),
                                control: (provided) => ({
                                    ...provided,
                                    backgroundColor: "#f8fafc"
                                }),
                            }}
                        />
                        {errors.selectedUsers && (
                            <p className="text-red-500 text-sm font-bold mt-1">{errors.selectedUsers.message}</p>
                        )}
                    </div>

                    {currentSelected.length > 0 && (
                        <div className="mb-4">
                            <h2 className="text-lg font-medium mb-2">{i18n.t("selectedMembers")}</h2>
                            <ul>
                                {currentSelected.map((user) => (
                                    <li key={user.id} className="flex items-center justify-between py-2 border-b">
                                        <span>{user.prenom} {user.nom}</span>
                                        <div className="flex items-center gap-4">
                                            <Checkbox
                                                type="checkbox"
                                                checked={watch("teamLeader")?.id === user.id}
                                                onChange={() => handleTeamLeaderChange(user)}
                                                className="text-primary bg-white"
                                            />
                                            <Label className="mr-2">{i18n.t("teamLeader")}</Label>
                                            <BioButton color="failure" onClick={() => handleRemoveUser(user.id)}>
                                                <FaTrashAlt/>
                                            </BioButton>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="w-full flex justify-between">
                        <BioButton color="gray" onClick={() => router.push('/parametrage/equipe')}>
                            <FaTimes size={15} className="mt-0.5 mr-2"/> {i18n.t("cancel")}
                        </BioButton>
                        <BioButton color="success" type="submit">
                            <FaSave size={15} className="mt-0.5 mr-2"/> {teamId ? i18n.t("edit") : i18n.t("save")}
                        </BioButton>
                    </div>
                </form>
            )}
        </div>
    );
};

export default TeamForm;
