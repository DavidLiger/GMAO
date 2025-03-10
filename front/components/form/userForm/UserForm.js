'use client';

import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import Select from "react-select";
import {FaEnvelope, FaPhone, FaSave, FaTimes, FaUser} from "react-icons/fa";
import {Checkbox, Label, TextInput} from "flowbite-react";
import {useForm} from "react-hook-form";
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from "yup";
import i18n from "../../../i18n";
import BioButton from "../../button/BioButton";
import {useAPIRequest} from "../../api/apiRequest";
import {useToast} from "../../../providers/toastProvider";

const UserFormPage = ({id}) => {
    const apiRequest = useAPIRequest();
    const router = useRouter();
    const {addToast} = useToast();

    const [teamsOptions, setTeamsOptions] = useState([]);
    const [modules, setModules] = useState({});

    // Schéma de validation Yup
    const schema = yup.object().shape({
        username: yup
            .string()
            .required(i18n.t("Form.validation.required", {field: i18n.t("fields.username")})),
        prenom: yup
            .string()
            .required(i18n.t("Form.validation.required", {field: i18n.t("fields.prenom")})),
        nom: yup
            .string()
            .required(i18n.t("Form.validation.required", {field: i18n.t("fields.nom")})),
        email: yup
            .string()
            .email(i18n.t("Form.validation.email"))
            .required(i18n.t("Form.validation.required", {field: i18n.t("fields.email")})),
        tel1: yup.string(), // facultatif
        tel2: yup.string(), // facultatif
        acces_gmao: yup.boolean(),
        acces_data: yup.boolean(),
        acces_sandre: yup.boolean(),
        acces_spa: yup.boolean(),
        teams: yup.array(),
        // Champ fictif pour vérifier qu'au moins une case d'accès est cochée
        accessGroup: yup.mixed().test(
            "atLeastOne",
            i18n.t("Form.validation.oneCheckboxRequired"),
            function () {
                const {acces_gmao, acces_data, acces_sandre, acces_spa} = this.parent;
                return acces_gmao || acces_data || acces_sandre || acces_spa;
            }
        )
    });

    const {register, handleSubmit, setValue, reset, formState: {errors}} = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            username: '',
            prenom: '',
            nom: '',
            email: '',
            tel1: '',
            tel2: '',
            acces_gmao: true,
            acces_data: false,
            acces_sandre: false,
            acces_spa: false,
            teams: [],
            accessGroup: true
        }
    });

    // Chargement des équipes
    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await apiRequest('/api/equipe', 'GET');
                const data = await response.json();
                const options = data.map(team => ({
                    value: team.id,
                    Label: team.nom,
                    color: team.color.toLowerCase()
                }));
                setTeamsOptions(options);
            } catch (error) {
                console.error(i18n.t("errorUser.fetchTeams"), error);
            }
        };
        fetchTeams();
    }, []);

    // Chargement des modules d'accès
    useEffect(() => {
        const fetchAccess = async () => {
            try {
                const response = await apiRequest('/api/utilisateur/responsable/access', 'GET');
                const data = await response.json();
                setModules(data);
            } catch (error) {
                console.error(i18n.t("errorUser.fetchTeams"), error);
            }
        };
        fetchAccess();
    }, []);

    // En mode édition, chargement des données utilisateur
    useEffect(() => {
        if (id) {
            const fetchUserData = async () => {
                try {
                    const response = await apiRequest(`/api/utilisateur/${id}`, "GET");
                    if (response.ok) {
                        const userData = await response.json();
                        const teamsIds = userData.equipeUtilisateurs.map(item => item.equipe.id);
                        reset({
                            username: userData.username,
                            prenom: userData.prenom,
                            nom: userData.nom,
                            email: userData.email,
                            tel1: userData.tel1,
                            tel2: userData.tel2,
                            acces_gmao: userData.acces_gmao,
                            acces_data: userData.acces_data,
                            acces_sandre: userData.acces_sandre,
                            acces_spa: userData.acces_spa,
                            teams: teamsIds,
                            accessGroup: true // permet de satisfaire la validation si une case est cochée
                        });
                    }
                } catch (error) {
                    console.error("Erreur lors de la récupération des données utilisateur", error);
                }
            };

            fetchUserData();
        }
    }, []);

    // Gestion de la sélection des équipes via react-select
    const handleTeamsChange = (selectedOptions) => {
        setValue('teams', selectedOptions ? selectedOptions.map(option => option.value) : []);
    };

    const onSubmit = async (data) => {
        // Supprimer le champ accessGroup qui est uniquement utilisé pour la validation
        const {accessGroup, ...formData} = data;
        let response;
        if (id) {
            response = await apiRequest(`/api/utilisateur/${id}`, "PUT", formData);
        } else {
            response = await apiRequest('/api/utilisateur', 'POST', formData);
        }
        if (response.ok) {
            const responseData = await response.json();
            if (responseData === "Exist") {
                addToast({message: i18n.t("errorUser.usernameExists"), type: "error"});
            } else {
                addToast({
                    message: id ? i18n.t("successUser.userUpdated") : i18n.t("successUser.userCreated"),
                    type: "success"
                });
                router.push('/parametrage/utilisateur');
            }
        } else {
            addToast({message: i18n.t("errorUser.generic"), type: "error"});
        }
    };

    return (
        <div className="p-8 bg-white rounded-lg shadow-md">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Username */}
                <div>
                    <Label>
                        {i18n.t("fields.username")} <span className="text-red-500">*</span>
                    </Label>
                    <TextInput
                        type="text"
                        {...register('username')}
                        placeholder={i18n.t("fields.username")}
                        icon={FaUser}
                    />
                    {errors.username && (
                        <p className="text-red-500 text-sm font-bold mt-1">{errors.username.message}</p>
                    )}
                </div>
                {/* Prénom */}
                <div>
                    <Label>
                        {i18n.t("fields.prenom")} <span className="text-red-500">*</span>
                    </Label>
                    <TextInput
                        type="text"
                        {...register('prenom')}
                        placeholder={i18n.t("fields.prenom")}
                        icon={FaUser}
                    />
                    {errors.prenom && (
                        <p className="text-red-500 text-sm font-bold mt-1">{errors.prenom.message}</p>
                    )}
                </div>
                {/* Nom */}
                <div>
                    <Label>
                        {i18n.t("fields.nom")} <span className="text-red-500">*</span>
                    </Label>
                    <TextInput
                        type="text"
                        {...register('nom')}
                        placeholder={i18n.t("fields.nom")}
                        icon={FaUser}
                    />
                    {errors.nom && (
                        <p className="text-red-500 text-sm font-bold mt-1">{errors.nom.message}</p>
                    )}
                </div>
                {/* Email */}
                <div>
                    <Label>
                        {i18n.t("fields.email")} <span className="text-red-500">*</span>
                    </Label>
                    <TextInput
                        type="email"
                        {...register('email')}
                        placeholder={i18n.t("fields.email")}
                        icon={FaEnvelope}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm font-bold mt-1">{errors.email.message}</p>
                    )}
                </div>
                {/* Téléphone 1 */}
                <div>
                    <Label>{i18n.t("fields.tel1")}</Label>
                    <TextInput
                        type="tel"
                        {...register('tel1')}
                        placeholder={i18n.t("fields.tel1")}
                        icon={FaPhone}
                    />
                </div>
                {/* Téléphone 2 */}
                <div>
                    <Label>{i18n.t("fields.tel2")}</Label>
                    <TextInput
                        type="tel"
                        {...register('tel2')}
                        placeholder={i18n.t("fields.tel2")}
                        icon={FaPhone}
                    />
                </div>
                {/* Sélection des équipes */}
                <div>
                    <Label>{i18n.t("fields.teams")}</Label>
                    <Select
                        isMulti
                        options={teamsOptions}
                        onChange={handleTeamsChange}
                        placeholder={i18n.t("fields.selectTeams")}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        getOptionLabel={(e) => (
                            <div className="flex flex-row space-x-2 items-center">
                                <p className={`${e.color} rounded-full w-4 h-4 border border-gray-500`}></p>
                                <p>{e.Label}</p>
                            </div>
                        )}
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
                            })
                        }}
                    />
                </div>
                {/* Modules d'accès */}
                <div>
                    <Label>{i18n.t('moduleAccess')}</Label>
                    <div className="flex flex-row justify-start gap-4">
                        {modules.acces_gmao !== undefined && (
                            <Label>
                                <Checkbox type="checkbox" {...register('acces_gmao')} className={"text-primary mr-2"}/>
                                {i18n.t("tab.gmao")}
                            </Label>
                        )}
                        {modules.acces_data !== undefined && (
                            <Label>
                                <Checkbox type="checkbox" {...register('acces_data')} className={"text-primary mr-2"}/>
                                {i18n.t("tab.data")}
                            </Label>
                        )}
                        {modules.acces_sandre !== undefined && (
                            <Label>
                                <Checkbox type="checkbox" {...register('acces_sandre')}
                                          className={"text-primary mr-2"}/>
                                {i18n.t("tab.sandre")}
                            </Label>
                        )}
                        {modules.acces_spa !== undefined && (
                            <Label>
                                <Checkbox type="checkbox" {...register('acces_spa')} className={"text-primary mr-2"}/>
                                {i18n.t("tab.spa")}
                            </Label>
                        )}
                    </div>
                    {errors.accessGroup && (
                        <p className="text-red-500 text-sm font-bold mt-1">
                            {errors.accessGroup.message}
                        </p>
                    )}
                </div>
                {/* Boutons */}
                <div className="flex flex-row justify-between">
                    <BioButton
                        onClick={() => router.push("/parametrage/utilisateur")}
                        color={"gray"}
                    >
                        <FaTimes size={15} className="mt-0.5 mr-2"/> {i18n.t("cancel")}
                    </BioButton>
                    <BioButton color={"success"} type="submit" className="ml-auto">
                        <FaSave size={15} className="mt-0.5 mr-2"/> {i18n.t("save")}
                    </BioButton>
                </div>
            </form>
        </div>
    );
};

export default UserFormPage;
