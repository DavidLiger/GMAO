"use client"

import React, {useEffect, useState} from "react";
import {useAPIRequest} from "../../../../../components/api/apiRequest";
import FileInput from "../../../../../components/fileinput/FileInput";
import {useNavigation} from "../../../../../providers/NavigationContext";
import {useBreadcrumb} from "../../../../../providers/BreadCrumbContext";
import BioButton from "../../../../../components/button/BioButton";
import {FaUpload} from "react-icons/fa";
import {FaDownload} from "react-icons/fa6";
import {Spinner} from "flowbite-react";
import i18n from "../../../../../i18n";

const FileManagementPage = () => {
    const apiRequest = useAPIRequest();
    const [statusUpload, setStatusUpload] = useState(null);
    const [statusUploadError, setStatusUploadError] = useState(null);
    const [statusDownloadError, setStatusDownloadError] = useState(null);
    const [statusDownload, setStatusDownload] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoadingUpload, setIsLoadingUpload] = useState(false);
    const [isLoadingDownload, setIsLoadingDownload] = useState(false);
    const {setActiveLabel} = useNavigation();
    const {setBreadcrumbs} = useBreadcrumb();
    const [dateActuelle, setDateActuelle] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setDateActuelle(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        setBreadcrumbs(
            [
                {label: i18n.t("breadcrumb.patrimoine"), href: '/'}, 
                {label: i18n.t("breadcrumb.siteManagement"), href: null}
            ])
    }, [setBreadcrumbs]);

    useEffect(() => {
        setActiveLabel(i18n.t("fileManagement.title")); // Par exemple : "Gestion des fichiers"
    }, [setActiveLabel]);

    const isExcelFile = (file) => {
        const allowedMimeTypes = [
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-excel"
        ];
        return allowedMimeTypes.includes(file.type);
    };

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const day = ("0" + date.getDate()).slice(-2);
        const hours = ("0" + date.getHours()).slice(-2);
        const minutes = ("0" + date.getMinutes()).slice(-2);
        return `-${year}${month}${day}-${hours}${minutes}`;
    };

    const handleDownload = async () => {
        setIsLoadingUpload(true);
        setStatusDownload(null);
        setStatusUpload('');
        setStatusUploadError('');
        await apiRequest("/api/typebien/export/caracteristique", "GET")
            .then(resp => resp.blob())
            .then(blob => {
                if (!isExcelFile(blob)) {
                    setStatusUploadError(i18n.t("download.invalidFile"));
                    return;
                }
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.style.display = "none";
                a.href = url;
                a.download = `eperf-caracteristique${formatDate(dateActuelle)}.xlsx`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                setStatusUpload(i18n.t("download.success"));
                setIsLoadingUpload(false);
            })
            .catch(() => {
                setStatusUploadError(i18n.t("download.error"));
                setIsLoadingUpload(false);
            });
    };

    const handleFileSelect = (files) => {
        if (files.length === 0) return;
        const file = files[0];
        if (!isExcelFile(file)) {
            setStatusDownloadError(i18n.t("upload.invalidFile"));
            return;
        }
        setSelectedFile(file);
        setStatusDownload(null);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;
        setStatusUploadError(null);
        setStatusDownload(null);
        setIsLoadingDownload(true);

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            await apiRequest("/api/typebien/import/caracteristique", "POST", formData);
            setStatusDownload(i18n.t("upload.success"));
            setSelectedFile(null);
        } catch (error) {
            setStatusDownloadError(i18n.t("upload.error"));
        } finally {
            setIsLoadingDownload(false);
        }
    };

    return (
        <div className="p-8 m-8 rounded bg-white shadow-md">
            <div className="mb-6 bg-gray-100 p-4 rounded border border-gray-300">
                <h2 className="text-lg font-semibold mb-2">{i18n.t("tutorial.title")}</h2>
                <ol className="list-decimal list-inside space-y-2">
                    <li>{i18n.t("tutorial.step1")}</li>
                    <li>{i18n.t("tutorial.step2")}</li>
                    <p className="text-red-400 pl-3">{i18n.t("tutorial.step2Warning")}</p>
                    <li>{i18n.t("tutorial.step3")}</li>
                    <li>{i18n.t("tutorial.step4")}</li>
                </ol>
                <p className="mt-4 text-red-500">{i18n.t("tutorial.warning")}</p>
            </div>

            <div className="flex items-center mb-8 gap-8">
                <BioButton
                    onClick={handleDownload}
                    color={"success"}
                    disabled={isLoadingUpload}
                >
                    <FaDownload size={15} className="mt-0.5 mr-2"/> {i18n.t("download.button")}
                </BioButton>
                {isLoadingUpload && <Spinner/>}
                {statusUpload && <p className="text-xl font-bold text-green-500">{statusUpload}</p>}
                {statusUploadError && <p className="text-xl font-bold text-red-500">{statusUploadError}</p>}
            </div>
            <FileInput allowMultiple={false} onFilesSelected={handleFileSelect}/>
            <div className="flex items-center mt-4 gap-8">
                <BioButton
                    onClick={handleUpload}
                    color={"success"}
                    disabled={isLoadingDownload || !selectedFile || !statusUpload}
                >
                    <FaUpload size={15} className="mt-0.5 mr-2"/> {i18n.t("upload.confirm")}
                </BioButton>
                {isLoadingDownload && <Spinner/>}
                {statusDownload && <p className="text-xl font-bold text-green-500">{statusDownload}</p>}
                {statusDownloadError && <p className="text-xl font-bold text-red-500">{statusDownloadError}</p>}
            </div>
        </div>
    );
};

export default FileManagementPage;
