"use client"
import React, {useEffect, useState} from "react";
import Link from "next/link";
import {
    FaCheck,
    FaEdit,
    FaEnvelope,
    FaMinus,
    FaPhone,
    FaPlus,
    FaSave,
    FaSearch,
    FaTimes,
    FaTrashAlt,
    FaUser
} from "react-icons/fa";
import {useRouter} from "next/navigation";
import {Label, Modal, TextInput} from "flowbite-react";
import {HiOutlineExclamationCircle} from "react-icons/hi";
import BioButton from "../../../../components/button/BioButton";
import i18n from "../../../../i18n";
import {useToast} from "../../../../providers/toastProvider";
import {useBreadcrumb} from "../../../../providers/BreadCrumbContext";
import {useNavigation} from "../../../../providers/NavigationContext";
import {useAPIRequest} from "../../../../components/api/apiRequest";
import * as yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";

const schema = yup.object().shape({
    nom: yup.string().required(i18n.t('Form.validation.required', {field: i18n.t('fields.nom')})),
    username: yup.string().required(i18n.t('Form.validation.required', {field: i18n.t('fields.username')})),
    prenom: yup.string().required(i18n.t('Form.validation.required', {field: i18n.t('fields.firstName')})),
    email: yup
        .string()
        .email(i18n.t('Form.validation.email'))
        .required(i18n.t('Form.validation.required', {field: i18n.t('fields.email')}))
});

const UserTreeView = () => {
    const [userData, setUserData] = useState(null);
    const apiRequest = useAPIRequest();
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [expandedNodes, setExpandedNodes] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredData, setFilteredData] = useState(null);
    const [formValues, setFormValues] = useState({
        username: "",
        nom: "",
        prenom: "",
        email: "",
        tel1: null,
        tel2: null
    });
    const {
        register,
        handleSubmit,
        setValue,
        formState: {errors}
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            username: formValues.username,
            nom: formValues.nom,
            prenom: formValues.prenom,
            email: formValues.email,
            tel1: formValues.tel1,
            tel2: formValues.tel2,
        }
    });
    const {setActiveLabel} = useNavigation();
    const {setBreadcrumbs} = useBreadcrumb();
    const {addToast} = useToast();

    // Etats pour la modale
    const [showModal, setShowModal] = useState(false);
    const [showModalCantDelete, setShowModalCantDelete] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        setBreadcrumbs([
            {label: i18n.t("breadcrumbUser.parametrage"), href: null},
        ]);
    }, [setBreadcrumbs]);

    useEffect(() => {
        setActiveLabel(i18n.t("userTree.title"));
    }, [setActiveLabel]);

    useEffect(() => {
        apiRequest("/api/utilisateur/tree")
            .then((res) => res.json())
            .then((data) => {
                setUserData(data);
                setFormValues({
                    nom: data.nom || "",
                    prenom: data.prenom || "",
                    email: data.email || "",
                    tel1: data.tel1 || "",
                    tel2: data.tel2 || "",
                });
                setFilteredData(data);
            })
            .catch((error) =>
                console.error(i18n.t("error.fetchUserTree"), error)
            );
    }, []);

    useEffect(() => {
        if (userData) {
            setValue('username', userData.username || '');
            setValue('nom', userData.nom || '');
            setValue('prenom', userData.prenom || '');
            setValue('email', userData.email || '');
            setValue('tel1', userData.tel1 || '');
            setValue('tel2', userData.tel2 || '');
        }
    }, [userData, setValue]);

    const onSubmit = async (data) => {
        try {
            await apiRequest(`/api/utilisateur/${userData.id}`, "PUT", {...data, username: userData.username});
            setUserData(prev => ({...prev, ...data}));
            setIsEditing(false);
            addToast({message: i18n.t('successUser.userCreated'), type: 'success'})

        } catch (error) {
            console.error(error);
            addToast({message: i18n.t('errorMessage'), type: 'error'})
        }
    };

    const toggleNode = (id) => {
        setExpandedNodes((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        if (query === "") {
            setFilteredData(userData);
            return;
        }

        // Filtrer uniquement sur la liste des employés
        const filteredEmployees = userData.employe
            .map((node) => filterTree(node, query))
            .filter((node) => node !== null);

        setFilteredData({...userData, employe: filteredEmployees});
    };

// Adaptation de la fonction récursive pour inclure la query en paramètre
    const filterTree = (node, query) => {
        if (node === null) {
            return null
        }
        console.log(node.nom)
        const isMatch =
            node.nom.toLowerCase().includes(query) ||
            node.prenom.toLowerCase().includes(query) ||
            node.email.toLowerCase().includes(query);

        if (node.employe) {
            const filteredChildren = node.employe
                .map((child) => filterTree(child, query))
                .filter((child) => child !== null);
            if (isMatch || filteredChildren.length > 0) {
                return {...node, employe: filteredChildren};
            }
        }

        return isMatch ? {...node} : null;
    };

    // Appel API de suppression
    const handleDelete = async (id) => {
        return await apiRequest(`/api/utilisateur/${id}`, "DELETE");
    };

    // Fonction récursive pour retirer l'utilisateur de l'arbre
    const removeUserFromTreeById = (node, id) => {
        if (!node) return null;
        if (node.id === id) {
            return null;
        }
        if (node.employe && node.employe.length > 0) {
            const updatedChildren = node.employe
                .map(child => removeUserFromTreeById(child, id))
                .filter(child => child !== null);
            return {...node, employe: updatedChildren};
        }
        return node;
    };

    const updateTreeAfterDeletion = (id) => {
        setUserData((prev) => removeUserFromTreeById(prev, id));
        setFilteredData((prev) => removeUserFromTreeById(prev, id));
    };

    // Lors du clic sur le bouton de suppression d'un utilisateur
    const handleDeleteClick = (user) => {
        setSelectedUser(user);
        if (user.employe && user.employe.filter(e => e !== null).length > 0) {
            setShowModalCantDelete(true);
        } else {
            setShowModal(true);
        }
    };

    // Confirmation de la suppression
    const confirmDeletion = async () => {
        if (!selectedUser) return;
        const response = await handleDelete(selectedUser.id);
        if (response.ok) {
            addToast({message: i18n.t("deleteConfirmationTitle"), type: "success"});
            updateTreeAfterDeletion(selectedUser.id);
        } else {
            addToast({message: i18n.t("error.occurred"), type: "error"});
        }
        setShowModal(false);
        setSelectedUser(null);
    };

    const renderTree = (people, level) => {
        // Filtrer les éléments null dans employe
        const children = people.employe ? people.employe.filter(child => child !== null) : [];

        const sortedChildren = [...children].sort((a, b) => a.nom.localeCompare(b.nom));

        return (
            <div key={people.id} className={`pl-${level * 4} border border-gray-200 rounded shadow pr-4 my-2`}>
                <div className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-2 w-full">
                        {sortedChildren.length > 0 ? (
                            <button
                                onClick={() => toggleNode(people.id)}
                                className="mr-2 text-sm text-gray-600 hover:text-primary ml-2"
                            >
                                {expandedNodes[people.id] ? <FaMinus/> : <FaPlus/>}
                            </button>
                        ) : (
                            <span className="mr-2 ml-2 w-4"/>
                        )}
                        <div className="grid grid-cols-4 gap-2 w-full">
                            <p className="font-bold text-md truncate" title={`${people.nom} ${people.prenom}`}>
                                {people.nom} {people.prenom}
                            </p>
                            <p className="font-bold text-md truncate hover:underline" title={people.email}>
                                <a href={`mailto:${people.email}`}> {people.email} </a>
                            </p>
                            <p className="font-bold text-md truncate" title={people.tel1}>
                                {people.tel1}
                            </p>
                            <p className="font-bold text-md truncate" title={people.tel2}>
                                {people.tel2}
                            </p>
                        </div>
                    </div>
                    <BioButton
                        color={"primary"}
                        className={"w-52 m-3"}
                        onClick={() => router.push(`/utilisateur/droit/${people.id}`)}
                    >
                        {i18n.t("manageRights")}
                    </BioButton>
                    <BioButton color={"primary"}
                               onClick={() => router.push(`/parametrage/utilisateur/edit/${people.id}`)}
                               className={"m-3 p-1.5"}>
                        <FaEdit/>
                    </BioButton>
                    <BioButton color={"failure"} onClick={() => handleDeleteClick(people)} className={"m-3 p-1.5"}>
                        <FaTrashAlt/>
                    </BioButton>
                </div>
                {expandedNodes[people.id] && sortedChildren.length > 0 && (
                    <div className="ml-4">
                        {sortedChildren.map((child) => renderTree(child, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    if (!userData) {
        return <div>{i18n.t("loading")}</div>;
    }

    return (
        <div className="p-4 space-y-6">

            <div className="p-4 bg-white shadow-md rounded">
                {isEditing ? (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <Label>{i18n.t("fields.username")} <span className="text-red-500">*</span></Label>
                            <TextInput
                                type="text"
                                {...register('username')}
                                defaultValue={formValues.username}
                                icon={FaUser}
                                className="w-full"
                            />
                            {errors.nom && <p className="text-red-500 text-sm">{errors.username.message}</p>}
                        </div>
                        <div>
                            <Label>{i18n.t("fields.name")} <span className="text-red-500">*</span></Label>
                            <TextInput
                                type="text"
                                {...register('nom')}
                                defaultValue={formValues.nom}
                                icon={FaUser}
                                className="w-full"
                            />
                            {errors.nom && <p className="text-red-500 text-sm">{errors.nom.message}</p>}
                        </div>
                        <div>
                            <Label>{i18n.t("fields.firstName")} <span className="text-red-500">*</span></Label>
                            <TextInput
                                type="text"
                                {...register('prenom')}
                                defaultValue={formValues.prenom}
                                icon={FaUser}
                                className="w-full"
                            />
                            {errors.prenom && <p className="text-red-500 text-sm">{errors.prenom.message}</p>}
                        </div>
                        <div>
                            <Label>{i18n.t("fields.email")} <span className="text-red-500">*</span></Label>
                            <TextInput
                                type="email"
                                {...register('email')}
                                defaultValue={formValues.email}
                                icon={FaEnvelope}
                                className="w-full"
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                        </div>
                        <div>
                            <Label>{i18n.t("fields.tel")} </Label>
                            <TextInput
                                type="tel"
                                icon={FaPhone}
                                defaultValue={formValues.tel1}
                                {...register('tel1')}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <Label>{i18n.t("fields.tel2")}</Label>
                            <TextInput
                                type="tel"
                                icon={FaPhone}
                                defaultValue={formValues.tel2}
                                {...register('tel2')}
                                className="w-full"
                            />
                        </div>
                        <div className="flex justify-between items-center gap-4">
                            <BioButton onClick={() => setIsEditing(false)} color={"gray"}>
                                <FaTimes size={15} className="mt-0.5 mr-2"/> {i18n.t("cancel")}
                            </BioButton>
                            <BioButton type="submit" color={"success"}>
                                <FaSave size={15} className="mt-0.5 mr-2"/> {i18n.t("save")}
                            </BioButton>
                        </div>
                    </form>
                ) : (
                    <div>
                        <div className="flex flex-row justify-between text-primary w-full text-3xl">
                            <div>{userData.nom} {userData.prenom}</div>
                            <div>{userData.societe}</div>
                        </div>
                        <div className="flex flex-col mb-3">
                            <p><strong>{i18n.t("fields.email")} :</strong> {userData.email}</p>
                            <p><strong>{i18n.t("fields.tel")} :</strong> {userData.tel1}</p>
                            {userData.tel2 && <p><strong>{i18n.t("fields.tel2")} :</strong> {userData.tel2}</p>}
                        </div>
                        <BioButton
                            onClick={() => setIsEditing(true)}
                            className={"ml-auto"}
                            color={"primary"}
                        >
                            <FaEdit size={15} className="mt-0.5 mr-2"/> {i18n.t("edit")}
                        </BioButton>
                    </div>
                )}
            </div>

            {userData.responsable && (
                <div className="p-4 bg-white shadow-md rounded flex flex-row space-x-8">
                    <h2 className="text-xl font-semibold">{i18n.t("manager")}</h2>
                    <div>
                        <strong>{i18n.t("fields.name")}:</strong> {userData.responsable.nom}
                    </div>
                    <div>
                        <strong>{i18n.t("fields.firstName")}:</strong> {userData.responsable.prenom}
                    </div>
                    <div>
                        <strong>{i18n.t("fields.email")}:</strong> {userData.responsable.email}
                    </div>
                    <div>
                        <strong>{i18n.t("fields.tel")}:</strong> {userData.responsable.tel1}
                    </div>
                    <div>
                        <strong>{i18n.t("fields.tel2")}:</strong> {userData.responsable.tel2}
                    </div>
                </div>
            )}

            <div className="p-4 bg-white rounded shadow">
                <div className="flex flex-row justify-between">
                    <h2 className="text-xl font-semibold">{i18n.t("employees")}</h2>
                    <Link href="/parametrage/utilisateur/ajout">
                        <BioButton color={"success"}>
                            <FaPlus size={15} className="mt-0.5 mr-2"/> {i18n.t("add")}
                        </BioButton>
                    </Link>
                </div>
                <div className="my-4">
                    <TextInput
                        type="text"
                        placeholder={i18n.t("search")}
                        icon={FaSearch}
                        value={searchQuery}
                        onChange={handleSearch}
                        className="w-full rounded py-2"
                    />
                </div>
                {filteredData && filteredData.employe &&
                    [...filteredData.employe]
                        .sort((a, b) => a?.nom.localeCompare(b?.nom))
                        .map((people) => people !== null ? renderTree(people, 0) : '')
                }
            </div>

            <Modal show={showModalCantDelete} size="md" onClose={() => {
                setShowModalCantDelete(false);
                setSelectedUser(null);
            }} popup dismissible>
                <Modal.Header/>
                <Modal.Body>
                    <HiOutlineExclamationCircle
                        className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200"/>
                    <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400 w-full text-center">{i18n.t('nodelete')}</h3>
                </Modal.Body>
                <Modal.Footer>
                    <div className="flex justify-center items-center w-full gap-4">
                        <BioButton color="gray" onClick={() => {
                            setShowModalCantDelete(false);
                            setSelectedUser(null);
                        }}>
                            <FaCheck size={15} className="mt-0.5 mr-3"/> {i18n.t('modal.understood')}
                        </BioButton>
                    </div>
                </Modal.Footer>
            </Modal>
            <Modal show={showModal} size={"xl"} onClose={() => {
                setShowModal(false);
                setSelectedUser(null);
            }} popup dismissible>
                <Modal.Header/>
                <Modal.Body>
                    <HiOutlineExclamationCircle
                        className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200"/>
                    <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400 w-full text-center">{i18n.t('modal.delete.confirm')}</h3>
                </Modal.Body>
                <Modal.Footer>
                    <div className="flex justify-center gap-4 items-center w-full">
                        <BioButton color="failure" onClick={confirmDeletion}>
                            <FaTrashAlt size={15} className="mt-0.5 mr-2"/> {i18n.t('deleteConfirmationTitle')}
                        </BioButton>
                        <BioButton color="gray" onClick={() => {
                            setShowModal(false);
                            setSelectedUser(null);
                        }}>
                            <FaTimes size={15} className="mt-0.5 mr-2"/> {i18n.t('cancel')}
                        </BioButton>
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default UserTreeView;
