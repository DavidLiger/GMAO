import React, {useEffect, useState} from 'react';
import {Button, Checkbox, Label, Modal, TextInput} from 'flowbite-react';
import {useAPIRequest} from '../../api/apiRequest';
import i18n from '../../../i18n';
import FileInput from "../../fileinput/FileInput";
import Select from "react-select";
import {FaSave, FaTimes} from "react-icons/fa"; // Assurez-vous du bon chemin

export default function ChildAdditionModal({selectedNode, onChildAdded, onClose}) {
    const apiRequest = useAPIRequest();
    const [listTypeBien, setListTypeBien] = useState([]);

    console.log(selectedNode)
    // Etat du formulaire commun et spécifique
    const [formData, setFormData] = useState({
        nom: '',
        description: '',
        image: null,
        typeBien: null,
        // Le champ type est géré par childType (et peut être stocké dans formData si besoin)
        position: '',        // Pour les ouvrages
        relevable: false, // Pour l'équipement
    });

    useEffect(() => {
        // Remplacez 'https://votre-api.com/types-bien' par l'URL de votre API
        apiRequest('/api/typebien')
            .then((response) => response.json())
            .then((data) => {
                setListTypeBien(data);
            })
            .catch((error) => {
                console.error('Erreur lors de la récupération des types de bien:', error);
            });
    }, []);

    // Mise à jour des champs texte et number / checkbox
    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // Gestion de la sélection de fichier pour l'image
    const handleFileChange = (files) => {
        setFormData(prev => ({
            ...prev,
            image: files[0] // On suppose une sélection d'un seul fichier
        }));
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Préparation du payload à envoyer
            const payload = {
                nom: formData.nom,
                description: formData.description,
                typeBienId: formData.typeBien
            };

            if (formData.image) {
                // Selon votre implémentation, vous pourriez avoir besoin de traiter l'image (ex : en FormData)
                payload.image = await convertToBase64(formData.image);
            }
            let response = null;
            if (selectedNode.nature === 'site' && selectedNode.hasOuvrage === true) {
                payload.position = parseInt(formData.position, 10);
                response = await apiRequest(`/api/site/child/ouvrage/${selectedNode.id}`, 'POST', payload);
            } else if (selectedNode.nature === 'site' && selectedNode.hasOuvrage === false) {
                payload.relevable = formData.relevable;
                response = await apiRequest(`/api/site/child/equipement/${selectedNode.id}`, 'POST', payload);
            } else if (selectedNode.nature === 'ouvrage') {
                payload.relevable = formData.relevable;
                response = await apiRequest(`/api/ouvrage/child/${selectedNode.id}`, 'POST', payload);
            } else if (selectedNode.nature === 'equipement') {
                response = await apiRequest(`/api/equipement/child/${selectedNode.id}`, 'POST', payload);
            }

            if (response !== null) {
                const newChild = await response.json()
                // Mettre à jour l'arbre avec le nouvel enfant via le callback
                onChildAdded(newChild);
                onClose();
            }
        } catch (error) {
            console.error("Erreur lors de l'ajout de l'enfant:", error);
        }
    };
    console.log(selectedNode)
    const filteredOptions = listTypeBien
        .filter((item) => {
            if (selectedNode.nature === 'site' && selectedNode.hasOuvrage === true) {
                return item.nature === 'ouvrage';
            } else if (selectedNode.nature === 'ouvrage' || (selectedNode.nature === 'site' && selectedNode.hasOuvrage === false)) {
                return item.nature === 'equipement';
            } else if (selectedNode.nature === 'equipement') {
                return item.nature === 'composant';
            }
            // Pour les autres natures, on affiche uniquement celles qui correspondent
            return item.nature === selectedNode.nature;
        })
        .map((item) => ({value: item.id, label: item.nom}));


    return (
        <Modal show={true} size="xl" onClose={onClose}>
            <Modal.Header>{i18n.t('addEntityChild')} {selectedNode.nom}</Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    {/* Sélecteur du type si plusieurs options sont possibles */}
                    <div className="mb-4">
                        <Label className="block text-gray-700">{i18n.t('type')}</Label>
                        <Select
                            options={filteredOptions}
                            placeholder={i18n.t('slectPlaceHolder')}
                            onChange={(selectedOption) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    typeBien: parseInt(selectedOption.value, 10),
                                }))
                            }
                        />
                    </div>

                    {/* Champs communs */}
                    <div className="mb-4">
                        <Label>{i18n.t('nomLabel')}</Label>
                        <TextInput
                            name="nom"
                            value={formData.nom}
                            onChange={handleChange}
                            placeholder={`Nom du bien`}
                        />
                    </div>

                    <div className="mb-4">
                        <Label>{i18n.t('description')}</Label>
                        <TextInput
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Description"
                        />
                    </div>

                    <div className="mb-4">
                        <Label>{i18n.t('image')}</Label>
                        <FileInput onFilesSelected={handleFileChange} isImage={true} allowMultiple={false}/>
                    </div>

                    {/* Champs spécifiques */}
                    {(selectedNode.nature === 'site' && selectedNode.hasOuvrage === true) && (
                        <div className="mb-4">
                            <Label>{i18n.t('order')}</Label>
                            <TextInput
                                name="position"
                                type="number"
                                value={formData.position}
                                onChange={handleChange}
                                placeholder="Ordre de l'ouvrage"
                            />
                        </div>
                    )}

                    {(selectedNode.nature === 'ouvrage' || (selectedNode.nature === 'site' && selectedNode.hasOuvrage === false)) && (
                        <div className="mb-4">
                            <Label>
                                <Checkbox
                                    name="relevable"
                                    checked={formData.relevable}
                                    onChange={handleChange}
                                    className="mr-2 text-primary"
                                />
                                {i18n.t('relevable')}
                            </Label>
                        </div>
                    )}

                    <div className="flex justify-between">
                        <Button color={"gray"} onClick={onClose}>
                            <FaTimes className={'mt-0.5 mr-2'}/> {i18n.t('cancel')}
                        </Button>
                        <Button type="submit" color={"success"}>
                            <FaSave className={'mt-0.5 mr-2'}/> {i18n.t('add')}
                        </Button>
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    );
}
