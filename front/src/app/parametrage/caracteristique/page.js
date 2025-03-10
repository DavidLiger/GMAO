'use client';
import {useAPIRequest} from "../../../../components/api/apiRequest";
import {createColumnHelper} from "@tanstack/react-table";
import React, {useCallback, useEffect, useMemo, useState} from "react";

import {useRouter} from "next/navigation";
import {Modal} from "flowbite-react";
import {HiOutlineExclamationCircle} from "react-icons/hi";
import {FaEdit, FaPlus, FaTrashAlt} from "react-icons/fa";
import {useToast} from "../../../../providers/toastProvider";
import BioButton from "../../../../components/button/BioButton";
import {useNavigation} from "../../../../providers/NavigationContext";
import {useBreadcrumb} from "../../../../providers/BreadCrumbContext";
import ReactTable from "../../../../components/reacttable/reactTable";
import i18n from "../../../../i18n";
import ProtectedRoute from "../../../../components/protectedRoute/ProtectedRoute";

export default function Caracteristique() {

    const apiRequest = useAPIRequest();
    const router = useRouter();
    const [data, setData] = useState([]);
    const [error, setError] = useState(null); // Gestion des erreurs
    const [openModalConfirm, setOpenModalConfirm] = useState(false);
    const [openModalCantDelete, setOpenModalCantDelete] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState(null);
    const {addToast} = useToast();
    const {setActiveLabel} = useNavigation();
    const {setBreadcrumbs} = useBreadcrumb();

    useEffect(() => {
        setBreadcrumbs([
            {label: i18n.t('breadcrumb.parametrage'), href: null},
        ]);
    }, [setBreadcrumbs]);

    useEffect(() => {
        setActiveLabel(i18n.t('caracTableTitle')); // Définir le titre de la page
    }, [setActiveLabel]);

    useEffect(() => {
        apiRequest("/api/caracteristique")
            .then((res) => res.json())
            .then((data) => {
                const formattedData = data.map((item) => {
                    return {
                        id: item.id,
                        nom: item.nom,
                        typeChamp: i18n.t(`${item.typeChamp}`, {defaultValue: item.typeChamp}), // Traduction
                        unite: item.unite ? `${item.unite.nom} (${item.unite.libelle})` : "",
                        valeurDefaut: (item.typeChamp === "date" || item.typeChamp === "month") && item.valeurDefaut ? formatDate(item.valeurDefaut, item.typeChamp) : item.valeurDefaut,
                        listeValeurs: Array.isArray(item.listeValeurs) ? item.listeValeurs.join(", ") : item.listeValeurs,
                    };
                });
                setData(formattedData);
            })
            .catch((e) => {
                console.log(e);

                setError(i18n.t("fetchError")); // Message d'erreur traduit
            });
    }, []);

    const handleEdit = useCallback((rowData) => {
        router.push(`/parametrage/caracteristique/edit/${rowData.id}`);
    }, []);

    const handleDelete = useCallback(async () => {
        if (selectedRowData) {
            try {
                await apiRequest(`/api/caracteristique/${selectedRowData.id}`, 'DELETE');
                addToast({message: i18n.t('success.characteristicAdded'), type: "success"});
                setData((prevData) => prevData.filter((row) => row.id !== selectedRowData.id));
                router.push(`/parametrage/caracteristique`);
            } catch (err) {
                addToast({message: i18n.t("toast.error"), type: "error"});
            }
        }
        setOpenModalConfirm(false);
    }, []);

    const formatDate = (dateString, typeChamp) => {
        if (!dateString) return ""; // Si vide, on retourne une chaîne vide

        if (typeChamp === "month") {
            // Cas particulier : format MM-YYYY
            const [month, year] = dateString.split("-");
            if (!month || !year) return dateString; // Si format incorrect, on renvoie tel quel
            return `${year}/${month.padStart(2, "0")}`; // Format correct: MM/YYYY
        }

        if (typeChamp === "date") {
            // Cas normal : Date classique formatée en français
            return new Intl.DateTimeFormat("fr-FR", {dateStyle: "short"}).format(new Date(dateString));
        }

        return dateString; // Pour les autres cas, on retourne tel quel
    };

    const columnHelper = createColumnHelper();

    const columns = useMemo(() => [
            columnHelper.accessor("id", {
                header: i18n.t("fields.id"),
                canSort: false,
            }),
            columnHelper.accessor("nom", {
                header: i18n.t("fields.nom"),
                meta: {
                    filterVariant: 'text',
                }
            }),
            columnHelper.accessor("typeChamp", {
                header: i18n.t("fields.field"),
                meta: {
                    filterVariant: 'typeChamp',
                }
            }),
            columnHelper.accessor("unite", {
                header: i18n.t("fields.unit"),
                meta: {
                    filterVariant: 'unite',
                }
            }),
            columnHelper.accessor("valeurDefaut", {
                header: i18n.t("fields.defaultValue"),
                cell: (info) => {
                    const row = info.row.original; // Récupérer les données de la ligne
                    const value = row.typeChamp === "date" && row.valeurDefaut ? formatDate(row.valeurDefaut) : row.valeurDefaut;
                    return value;
                },
                meta: {
                    filterVariant: 'text',
                }
            }),
            columnHelper.accessor("listeValeurs", {
                header: i18n.t("fields.valueList"),
                meta: {
                    filterVariant: 'text',
                }
            }),
            {
                header: i18n.t("fields.action"),
                canSort: false,
                cell: ({row}) => (
                    <div className="flex gap-2 justify-center">
                        <BioButton
                            color={"gray"}
                            onClick={() => confirmDelete(row.original)}
                        >
                            <FaTrashAlt className={"text-red-500"}/>
                        </BioButton>
                        <BioButton
                            color={"primary"}
                            onClick={() => handleEdit(row.original)}
                        >
                            <FaEdit/>
                        </BioButton>
                    </div>
                ),
            },
        ]
        , []);

    if (error) {
        return (
            <div className="space-y-8 p-6 bg-red-50 rounded-md shadow-md">
                <h1 className="text-2xl font-bold text-red-600">{i18n.t("errorMessage")}</h1>
                <p>{error}</p>
            </div>
        );
    }

    const confirmDelete = async (rowData) => {
        setSelectedRowData(rowData); // Stocke rowData dans l'état
        apiRequest(`/api/caracteristique/${rowData.id}/allowdelete`)
            .then((res) => res.json())
            .then((data) => {
                if (data) {
                    setOpenModalConfirm(true);
                } else {
                    setOpenModalCantDelete(true);
                }
            });
    };


    return (
        <ProtectedRoute>
            <div className="p-6 h-fit bg-gray-50 rounded-md shadow-md relative">
                <div className="right-6 mr-4 absolute z-10">
                    <BioButton
                        color={"success"}
                        onClick={() => router.push("/parametrage/caracteristique/ajout")}
                    >
                        <FaPlus size={12} className={"mt-1 mr-2"}/> {i18n.t("add")}
                    </BioButton>
                </div>
                <div className={"mt-2"}>
                    <ReactTable
                        defaultData={data}
                        columns={columns}
                        showableColumn={true}
                        onDelete={(rowData) => confirmDelete(rowData)}
                        onEdit={(rowData) => handleEdit(rowData)}
                    />
                </div>
                <Modal show={openModalConfirm} size="md" onClose={() => setOpenModalConfirm(false)} popup>
                    <Modal.Header/>
                    <Modal.Body>
                        <div className="text-center">
                            <HiOutlineExclamationCircle
                                className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200"/>
                            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                {i18n.t("modal.delete.confirm")}
                            </h3>
                            <div className="flex justify-center gap-4">
                                <BioButton color="failure" onClick={handleDelete}>
                                    {i18n.t("confirm")}
                                </BioButton>
                                <BioButton color="gray" onClick={() => setOpenModalConfirm(false)}>
                                    {i18n.t("cancel")}
                                </BioButton>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>

                <Modal show={openModalCantDelete} size="md" onClose={() => setOpenModalCantDelete(false)} popup>
                    <Modal.Header/>
                    <Modal.Body>
                        <div className="text-center">
                            <HiOutlineExclamationCircle
                                className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200"/>
                            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                {i18n.t("nodelete")}
                            </h3>
                            <div className="flex justify-center gap-4">
                                <BioButton color="gray" onClick={() => setOpenModalCantDelete(false)}>
                                    {i18n.t("modal.understood")}
                                </BioButton>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        </ProtectedRoute>
    );
}
