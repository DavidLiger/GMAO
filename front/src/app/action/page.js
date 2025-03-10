"use client";

import React, {useEffect, useState} from 'react';
import {FaCubes, FaDraftingCompass, FaPlus, FaProjectDiagram, FaSave, FaTimes, FaToolbox, FaUpload} from "react-icons/fa";
import {Label, Textarea, TextInput} from "flowbite-react";
import ActionItem from './actionItem';
import { useAPIRequest } from '../../../components/api/apiRequest';
import i18n from '../../../i18n';
import { useAuth } from '../../../providers/AuthProvider';
import { useBreadcrumb } from '../../../providers/BreadCrumbContext';
import { useNavigation } from '../../../providers/NavigationContext';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { fetchSites, fetchTree } from '@/redux/features/actionSlice';
import { EditorState, convertToRaw } from 'draft-js';
import { convertToHTML } from 'draft-convert';
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import BioButton from '../../../components/button/BioButton';
import WysiwygEditor from '../../../components/wysiwygEditor/WysiwygEditor';
import Switch from '@mui/material/Switch';
import FileInput from '../../../components/fileinput/FileInput';

const ActionSetter = () => {
    const dispatch = useDispatch();
    const apiRequest = useAPIRequest();
    const [statusUploadError, setStatusUploadError] = useState(null);
    const [data, setData] = useState([]);
    const [dataSousType, setDataSousType] = useState([]);
    const buttonEntities = useSelector((state) => state.actions.sites);
    const [sites, setSites] = useState([]);
    const [ouvrages, setOuvrages] = useState([]);
    const [equipements, setEquipements] = useState([]);
    const [composants, setComposants] = useState([]);
    const [selectedSite, setSelectedSite] = useState(null);
    const [selectedOuvrage, setSelectedOuvrage] = useState(null);
    const [selectedEquipement, setSelectedEquipement] = useState(null);
    const [selectedTypeAction, setSelectedTypeAction] = useState(null);
    const [selectedSubTypeAction, setSelectedSubTypeAction] = useState(null);
    const [childLabel, setChildLabel] = useState('');
    const [grandChildLabel, setGrandChildLabel] = useState('');
    const [editColor, setEditColor] = useState('');
    const [user, setUser] = useState('');
    const [isCreatingSubType, setIsCreatingSubType] = useState(false);
    const [typeSetted, setTypeSetted] = useState('site');
    const {setActiveLabel} = useNavigation();
    const {setBreadcrumbs} = useBreadcrumb();
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [criticites, setCriticites] = useState([])
    const [causes, setCauses] = useState([])
    const [equipes, setEquipes] = useState([])
    const [emailToSend, setEmailToSend] = useState(true)
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoadingUpload, setIsLoadingUpload] = useState(false);
    const [statusUpload, setStatusUpload] = useState(null);
    const [isUploadError, setIsUploadError] = useState(false);
    const [filesUploadedIds, setFilesUploadedIds] = useState([])


    const {token} = useAuth()
    // console.log(token);

    useEffect(() => {
        setBreadcrumbs([
            // {label: i18n.t("breadcrumb.listManagement"), href: '/parametrage/gestion-listes'},
            {label: i18n.t("newActionTitle"), href: null},
        ]);
    }, [setBreadcrumbs]);

    useEffect(() => {
        setActiveLabel(i18n.t('newActionTitle'));
    }, [setActiveLabel]);

    useEffect(() => {
        apiRequest("/api/criticite")
            .then((res) => res.json())
            .then((data) => {
                const formattedData = data.map((item) => ({
                    id: item.id,
                    nom: item.nom,
                    idSociete: item.societe.id
                }));
                formattedData.sort((a, b) => a.nom.localeCompare(b.nom));
                setCriticites(formattedData);
            })
            .catch(() => {
                // Gérer l'erreur ici
            });
    }, []);

    useEffect(() => {
        apiRequest("/api/cause")
            .then((res) => res.json())
            .then((data) => {
                const formattedData = data.map((item) => ({
                    id: item.id,
                    nom: item.nom,
                    idSociete: item.societe.id
                }));
                formattedData.sort((a, b) => a.nom.localeCompare(b.nom));
                setCauses(formattedData);
            })
            .catch(() => {
                // Gérer l'erreur ici
            });
    }, []);

    useEffect(() => {
        apiRequest("/api/equipe")
            .then((res) => res.json())
            .then((data) => {
                const formattedData = data.map((item) => ({
                    id: item.id,
                    nom: item.nom,
                    libelle: item.libelle
                }));
                formattedData.sort((a, b) => a.nom.localeCompare(b.nom));
                setEquipes(formattedData);
            })
            .catch(() => {
                // Gérer l'erreur ici
            });
    }, []);

    useEffect(() => {
        apiRequest("/api/typeaction")
            .then((res) => res.json())
            .then((data) => {
                const formattedData = data.map((item) => ({
                    id: item.id,
                    nom: item.nom,
                    idSociete: item.societe.id,
                    color: item.color,
                }));

                formattedData.sort((a, b) => a.nom.localeCompare(b.nom));
                setData(formattedData);
            })
            .catch(() => {
                // Gérer l'erreur ici
            });
    }, []);

    useEffect(() => {
        if (!user) {
            apiRequest("/api/utilisateur")
                .then((res) => res.json())
                .then((data) => {
                    setUser(data);
                })
                .catch(() => {
                    // Gérer l'erreur ici
                });
        } else {
            console.log(user);
        }
    }, [user]);

    useEffect(() => {
        const loadEntities = async () => {
            switch (typeSetted) {
                case 'site':
                    await dispatch(fetchSites({token}));
                    break;
                default:
                    return null;
            }
        };

        loadEntities();
    }, [dispatch, typeSetted]);

    useEffect(()=>{
        if(buttonEntities && buttonEntities.length > 0 && typeSetted === 'site'){
            setSites(buttonEntities)
        }
        if(buttonEntities && buttonEntities.length > 0 && typeSetted === 'ouvrage'){
            setOuvrages(buttonEntities)
        }
        if(buttonEntities && buttonEntities.length > 0 && typeSetted === 'equipement'){
            setEquipements(buttonEntities)
        }
        if(buttonEntities && buttonEntities.length > 0 && typeSetted === 'ouvrage'){
            setComposants(buttonEntities)
        }
    }, [buttonEntities, typeSetted])

    useEffect(() => {
        console.log(editorState);
        
    }, [editorState])

    const handleSelectSite = async (site) => {
        console.log(site.value);
        setSelectedSite(site);
        setOuvrages([]); // Réinitialiser l'état des ouvrages
        setEquipements([]);
        setComposants([])

        const resultAction = await dispatch(fetchTree({ entityId: site.value, token: token }));
        if (fetchTree.fulfilled.match(resultAction)) {
            const fetchedOuvrages = resultAction.payload;
            console.log(fetchedOuvrages);
            
            setOuvrages(fetchedOuvrages);
            if(fetchedOuvrages[0].nature === 'ouvrage'){
                setChildLabel(i18n.t('actionSelectTitles.ouvrages'))
                setGrandChildLabel(i18n.t('actionSelectTitles.equipements'))
            }else{
                setChildLabel(i18n.t('actionSelectTitles.equipements'))
                setGrandChildLabel(i18n.t('actionSelectTitles.composants'))
            }

            // Sélectionner automatiquement la première option si elle existe
            if (ouvrages && ouvrages.length > 0) {
                setSelectedOuvrage(ouvrages[0]); // Sélectionner le premier ouvrage
            }
        } else {
            console.error('Erreur lors de la récupération des ouvrages:', resultAction.error);
        }
    };

    const handleSelectSiteChildren = (ouvrage) => {
        console.log(ouvrage);
        const ouvrageParent = ouvrages.find(thisOuvrage => thisOuvrage.id === ouvrage.value);
        if (ouvrageParent) {
            console.log(ouvrageParent);
            
            setSelectedOuvrage(ouvrageParent)
            setEquipements([]);
            setComposants([])
            if(ouvrageParent.children && ouvrageParent.children.length > 0){
                console.log(ouvrageParent.children);
                
                setEquipements(ouvrageParent.children)
            }
        }
    }

    const handleSelectGrandSiteChildren = (equipement) => {
        console.log(equipement);
        const equipementParent = equipements.find(thisEquipement => thisEquipement.id === equipement.value);
        if (equipementParent) {
            console.log(equipementParent);
            
            setSelectedEquipement(equipementParent)
            if(equipementParent.children && equipementParent.children.length > 0){
                console.log(equipementParent.children);
                
                setComposants(equipementParent.children)
            }
        }
    }

    const handleSelectTypeAction = (typeaction) => {
        console.log(typeaction);
        
        setSelectedTypeAction(typeaction);
        apiRequest(`/api/typeaction/${typeaction.id}/sous_types`)
            .then((res) => res.json())
            .then((data) => {
                const formattedSousTypes = data.map((item) => ({
                    id: item.id,
                    nom: item.nom,
                    typeActionParentId: item.typeActionParent.id
                }));
                setDataSousType(formattedSousTypes);
            })
            .catch(() => {
                // Gérer l'erreur ici
            });
    };

    const handleSelectSubTypeAction = (typeaction) => {
        console.log(typeaction);
        
        setSelectedSubTypeAction(typeaction);
    };

    // Fonction pour gérer les changements d'état de l'éditeur
    const onEditorStateChange = (editorState) => {
        setEditorState(editorState);
    };

    const handleSaveDescription = async () => {
        const rawContentState = convertToRaw(editorState.getCurrentContent());
        const htmlContent = convertToHTML(editorState.getCurrentContent());
        console.log(rawContentState, htmlContent);
        
        // await saveDataToServer({ rawContentState, htmlContent });
    };

    const saveDataToServer = async (data) => {
        // await fetch('https://votre-api.com/save', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(data),
        // });
    };

    const handleChange = () => {
        // Gérer les changements ici
        setEmailToSend(!emailToSend)
    }

    const isImageOrPdfFile = (file) => {
        const allowedMimeTypes = [
            "application/pdf", // PDF
            "image/jpeg",      // JPEG
            "image/pjpeg",     // PJPEG
            "image/png"        // PNG
        ];
        return allowedMimeTypes.includes(file.type);
    };

    const handleFileSelect = (files) => {
        if (files.length === 0) return;
        setStatusUpload(null);
        files.forEach((file)=>{
            if (!isImageOrPdfFile(file)) {
                setStatusUpload(i18n.t("upload.invalidFile"));
                return;}
        })
        setSelectedFile(files);
    };

    //ici, le file[] indique qu'on upload en tableau de fichiers
    const handleUpload = async () => {
        if (!selectedFile) return;
        setStatusUpload(null);
        setIsLoadingUpload(true);
        const formData = new FormData();
        selectedFile.forEach((file)=>{
            formData.append('file[]', file)
        })
        try {
            let response = await apiRequest("/api/file/upload", "POST", formData)
            let resultAction = await response.json(); // Extraire le corps de la réponse

            if('error' in resultAction){
                setStatusUpload(i18n.t("upload.error"));
                setIsUploadError(true)
            }else{
                setStatusUpload(i18n.t("upload.success"));
                setIsUploadError(false);
                console.log(resultAction.uploaded_files); // Utilisez uploaded_files avec un underscore
                setFilesUploadedIds(resultAction.uploaded_files)
            }
            setSelectedFile(null);
        } catch (error) {
            setStatusUpload(i18n.t("upload.error"));
            setIsUploadError(true)
        } finally {
            setIsLoadingUpload(false);
        }
    };

    return (
        <>
            <div className="flex p-4 bg-gray-100 rounded-lg shadow-md">
                <div className="flex-none w-4/5 ml-[10%] min-h-[240px]">
                    <h2 className="text-lg font-semibold">{i18n.t('types.title')}</h2>
                        <div className="flex mt-4 justify-center gap-6">
                            {data.length > 0 ? (
                                data.map(typeaction => (
                                    <ActionItem
                                        key={typeaction.id}
                                        typeaction={typeaction}
                                        color={editColor}
                                        onEdit={(typeaction) => handleEdit(typeaction, false)}
                                        onSelect={handleSelectTypeAction}
                                        isSelected={selectedTypeAction && selectedTypeAction.id === typeaction.id}
                                        setIsCreatingSubType={setIsCreatingSubType}
                                        isCreatingSubType={isCreatingSubType}
                                    />
                                ))
                            ) : (
                                <p>{i18n.t('types.null')}</p>
                            )}
                        </div>
                        <h2 className="text-lg font-semibold">{i18n.t('subTypes.title')}</h2>
                        <div className="flex mt-4 justify-center gap-6">
                            {dataSousType && dataSousType.length > 0 ? (
                                dataSousType.map(typeaction => (
                                    <ActionItem
                                        key={typeaction.id}
                                        typeaction={typeaction}
                                        onEdit={(typeaction) => handleEdit(typeaction, true)}
                                        onSelect={handleSelectSubTypeAction}
                                        dataSousTypeList={true}
                                        isSelected={selectedSubTypeAction && selectedSubTypeAction.id === typeaction.id}
                                        setIsCreatingSubType={setIsCreatingSubType}
                                        isCreatingSubType={isCreatingSubType}
                                    />
                                ))
                            ) : (
                                <p>{i18n.t('subTypes.null')}</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex-1 flex-col bg-gray-100 rounded-lg shadow-md">
                    <div className='grid grid-cols-4 p-4 mt-2 justify-center gap-6'>
                        {sites && sites.length > 0 && (
                            <div className={"flex-1"}>
                                <div className={"flex flex-col"}>
                                    <div className="flex flex-row items-center gap-4 mb-2"> {/* Ajout d'une marge en bas */}
                                        <FaProjectDiagram className="text-sm text-gray-600" />
                                        <span className='text-lg font-semibold'>{i18n.t('actionSelectTitles.sites')}</span>
                                    </div>
                                    <Select 
                                        options={sites.map(site => ({ value: site.id, label: site.nom }))}
                                        onChange={handleSelectSite} // Utiliser la nouvelle fonction ici
                                        className={"flex-1 w-full"}
                                    />
                                </div>
                            </div>
                        )}
                        {ouvrages && ouvrages.length > 0 && (
                            <div className={"flex-1"}>
                                <div className={"flex flex-col"}>
                                    <div className="flex flex-row items-center gap-4 mb-2"> {/* Ajout d'une marge en bas */}
                                        <FaDraftingCompass className="text-sm text-gray-600" />
                                        <span className='text-lg font-semibold'>{childLabel}</span>
                                    </div>
                                    <Select 
                                        options={ouvrages.map(ouvrage => ({ value: ouvrage.id, label: ouvrage.nom }))}
                                        onChange={handleSelectSiteChildren} // Mettez à jour l'état pour l'ouvrage sélectionné
                                        className={"flex-1 w-full"}
                                    />
                                </div>
                            </div>
                        )}
                        {equipements && equipements.length > 0 && (
                            <div className={"flex-1"}>
                                <div className={"flex flex-col"}>
                                    <div className="flex flex-row items-center gap-4 mb-2"> {/* Ajout d'une marge en bas */}
                                        <FaToolbox className="text-sm text-gray-600" />
                                        <span className='text-lg font-semibold'>{grandChildLabel}</span>
                                    </div>
                                        <Select 
                                            options={equipements.map(equipement => ({ value: equipement.id, label: equipement.nom }))}
                                            onChange={handleSelectGrandSiteChildren} // Mettez à jour l'état pour l'équipement sélectionné
                                            className={"flex-1 w-full"}
                                        />
                                </div>
                            </div>
                        )}
                        {composants && composants.length > 0 && (
                            <div className={"flex-1"}>
                                <div className={"flex flex-col"}>
                                    <div className="flex flex-row items-center gap-4 mb-2"> {/* Ajout d'une marge en bas */}
                                        <FaCubes className="text-sm text-gray-600" />
                                        <span className='text-lg font-semibold'>{i18n.t('actionSelectTitles.composants')}</span>
                                    </div>
                                    <Select 
                                        options={composants.map(composant => ({ value: composant.id, label: composant.nom }))}
                                        onChange={handleSelectGrandSiteChildren} // Mettez à jour l'état pour le composant sélectionné
                                        className={"flex-1 w-full"}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                    <div>
                        <span className='ml-4 text-lg font-semibold'>{i18n.t('actionPageObjectTitle')}</span>
                        <TextInput
                            placeholder={i18n.t('actionPageObjectPlaceholder')}
                            className={'w-full p-2 ml-2'}
                        />
                    </div>
                    <div className='flex-1 w-full flex-row'>
                    <div className='w-full p-2'> {/* Ajout d'un padding pour espacer les éléments */}
                        <div className="flex flex-row items-center gap-4 mb-2 ml-2"> {/* Ajout d'une marge en bas */}
                            <span className='text-lg font-semibold'>{i18n.t('description')}</span>
                        </div>
                        <div className="grid grid-cols-2 mt-2 ml-2 justify-center gap-6">
                            <Textarea 
                                className='flex-1 w-full h-64'
                            />
                            <div className={"flex-1 w-full flex-col"}>
                                <FileInput allowMultiple={true} onFilesSelected={handleFileSelect} isImage={false} isInActionPage={true}/>
                                <div className={"grid grid-cols-2"}>
                                    <div className='flex w-full items-center justify-center'>
                                        {statusUpload && <p className={`text-xl font-bold ${isUploadError ? 'text-red-500' : 'text-green-500'}`}>{statusUpload}</p>}
                                    </div>
                                    <BioButton
                                        color={"success"}
                                        onClick={handleUpload}
                                        disabled={isLoadingUpload || !selectedFile || statusUpload !== null}
                                        className={'flex w-full mt-2'}
                                    >
                                        <FaUpload size={15} className={"mt-0.5 mr-2"}/> {i18n.t("upload.confirm")}
                                    </BioButton>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='w-full p-2'> {/* Ajout d'un padding pour espacer les éléments */}
                        <div className='grid grid-cols-4 p-4 mt-2 justify-center gap-6'>
                            {criticites && criticites.length > 0 && (
                                <div className={"flex-1"}>
                                    <div className={"flex flex-col"}>
                                        <div className="flex flex-row items-center gap-4 mb-2"> {/* Ajout d'une marge en bas */}
                                            <span className='text-lg font-semibold'>{i18n.t('menucriticities')}</span>
                                        </div>
                                        <Select 
                                            options={criticites.map(criticite => ({ value: criticite.id, label: criticite.nom }))}
                                            onChange={handleSelectSiteChildren} // Mettez à jour l'état pour l'ouvrage sélectionné
                                            className={"flex-1 w-full"}
                                        />
                                    </div>
                                </div>
                            )}
                            {causes && causes.length > 0 && (
                                <div className={"flex-1"}>
                                    <div className={"flex flex-col"}>
                                        <div className="flex flex-row items-center gap-4 mb-2"> {/* Ajout d'une marge en bas */}
                                            <span className='text-lg font-semibold'>{i18n.t('menucauses')}</span>
                                        </div>
                                        <Select 
                                            options={causes.map(cause => ({ value: cause.id, label: cause.nom }))}
                                            onChange={handleSelectSiteChildren} // Mettez à jour l'état pour l'ouvrage sélectionné
                                            className={"flex-1 w-full"}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className='w-full p-2 ml-3'>
                        <div className='flex flex-row mt-2 items-center justify-between'>
                            {equipes && equipes.length > 0 && (
                                <div className={"flex-1"}>
                                    <div className={"flex flex-col"}>
                                        <div className="flex flex-row items-center mb-2"> {/* Ajout d'une marge en bas */}
                                            <span className='text-lg font-semibold'>{i18n.t('menuAffectation')}</span>
                                        </div>
                                        <Select 
                                            options={equipes.map(equipe => ({ value: equipe.id, label: equipe.nom }))}
                                            onChange={handleSelectSiteChildren} // Mettez à jour l'état pour l'ouvrage sélectionné
                                            className={"w-full"}
                                        />
                                    </div>
                                </div>
                            )}
                            <div className={"flex-1 flex-col w-full items-start mt-8"}> {/* Changement ici */}
                                <span className='ml-8'>{i18n.t('menuEmailSent')}</span> {/* Suppression de mt-16 */}
                                <Switch
                                    checked={emailToSend}
                                    onChange={handleChange}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                    className='ml-8' // Suppression de mt-8
                                />
                            </div>
                        </div>
                    </div>
                    <div className='w-full p-2'>
                        <span className='text-lg font-semibold ml-4'>{i18n.t('menuDureeEstimee')}</span>
                        <div className='flex items-center mt-2 gap-6 items-start'>
                            <TextInput
                                // placeholder={i18n.t('actionPageObjectPlaceholder')}
                                className={'w-1/4 ml-2'}
                            />
                            <span className='mt-2'>{i18n.t('menuHours')}</span>
                            <TextInput
                                // placeholder={i18n.t('actionPageObjectPlaceholder')}
                                className={'w-1/4'}
                            />
                            <span className='mt-2'>{i18n.t('menuMinutes')}</span>
                        </div>
                    </div>
                    
                </div>
                {/* Boutons de soumission et d'annulation placés à l'intérieur du formulaire */}
                <div className="flex flex-row mt-4 justify-between p-4">
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
                    
            </div>
        </>
    );
}

export default ActionSetter