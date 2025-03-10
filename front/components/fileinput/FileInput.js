import React, {useEffect, useRef, useState} from "react";
import {FaTrashAlt} from "react-icons/fa";
import BioButton from "../button/BioButton";
import Image from "next/image";
import i18n from "../../i18n";

const FileInput = ({allowMultiple = true, onFilesSelected, isImage = false, initialPreview = "", isInActionPage}) => {
    const [dragging, setDragging] = useState(false);
    const [filesState, setFilesState] = useState([]);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);
    const isUpdating = useRef(false);

    // Si une image initiale est fournie et non vide, on la met dans l'état
    useEffect(() => {
        if (initialPreview) {
            setFilesState([{preview: initialPreview, name: "initial"}]);
        }
    }, [initialPreview]);

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = () => {
        setDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        setError(null);

        const droppedFiles = Array.from(e.dataTransfer.files);
        if (!droppedFiles.length) {
            setError(i18n.t("error.multiple"));
            return;
        }

        // Filtrer uniquement les fichiers valides et avec la propriété 'name'
        const newFiles = droppedFiles.filter(
            (file) => file && file.name && (!isImage || file.type.startsWith("image/"))
        );

        if (!newFiles.length) {
            setError(i18n.t("error.multiple"));
            return;
        }

        if (!allowMultiple && newFiles.length > 1) {
            setError(i18n.t("error.multiple"));
            return;
        }

        updateFiles(newFiles);
    };

    const filterFiles = (files) =>
        files.filter(
            (file) => file && file.name && (!isImage || file.type.startsWith("image/"))
        );

    useEffect(() => {
        if (isUpdating.current) {
            onFilesSelected?.(filesState);
            isUpdating.current = false;
        }
    }, [filesState, onFilesSelected]);

    const handleFileSelect = (e) => {
        const newFiles = filterFiles(Array.from(e.target.files));
        if (!allowMultiple && newFiles.length > 1) {
            setError(i18n.t("error.multiple"));
            return;
        }
        updateFiles(newFiles);
    };

    const updateFiles = (newFiles) => {
        const validFiles = newFiles.filter((file) => file && file.name);
        setFilesState((prevFiles) => {
            let updatedFiles = allowMultiple
                ? [...prevFiles, ...validFiles]
                : [validFiles[0]];
            // Supprimer les doublons en se basant sur le nom du fichier
            updatedFiles = Array.from(new Map(updatedFiles.map(file => [file.name, file])).values());
            onFilesSelected && onFilesSelected(updatedFiles);
            return updatedFiles;
        });

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const removeFile = (fileName) => {
        isUpdating.current = true;
        setFilesState((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
    };

    return (
        <div>
            <div
                className={`border-2 border-dashed p-4 rounded-lg text-center ${
                    dragging ? "border-primary bg-sky-100" : "border-gray-300"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <p className="text-gray-600">
                    {allowMultiple ? i18n.t("file.multiple") : i18n.t("file.single")}
                </p>
                <input
                    type="file"
                    multiple={allowMultiple}
                    onChange={handleFileSelect}
                    accept={isImage ? "image/*" : undefined}
                    className="hidden"
                    id="file-input"
                    ref={fileInputRef}
                />
                <label htmlFor="file-input" className="cursor-pointer text-primary hover:underline">
                    {i18n.t("file.click")}
                </label>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {filesState.length > 0 && (
                <div className="mt-4">
                    {isImage ? (
                        <div className="grid grid-cols-3 gap-4">
                            {filesState.map((file, index) => (
                                <div key={index} className="relative group w-[100px] h-[100px]">
                                    <Image
                                        src={file.preview ? file.preview : URL.createObjectURL(file)}
                                        alt={file.name}
                                        layout="fill"
                                        objectFit="cover"
                                        className="rounded-md"
                                    />
                                    <div
                                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-red-600 bg-opacity-50 cursor-pointer"
                                        onClick={() => removeFile(file.name)}
                                    >
                                        <FaTrashAlt className="text-white text-2xl"/>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        // <ul className="text-gray-700">
                        <ul className={`text-gray-700 ${isInActionPage ? 'overflow-auto h-28' : ''}`}>
                            {filesState.map((file, index) => (
                                <li
                                    key={index}
                                    className="flex items-center justify-between border p-2 rounded-lg bg-white shadow my-2"
                                >
                                    <span>{file.name}</span>
                                    <BioButton color="failure" onClick={() => removeFile(file.name)}>
                                        <FaTrashAlt size={15}/>
                                    </BioButton>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default FileInput;
