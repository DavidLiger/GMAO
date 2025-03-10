import React, {useEffect, useRef, useState} from "react";
import {useAPIRequest} from "../api/apiRequest";
import {ImWarning} from "react-icons/im";
import DynamicInput from "../dynamicInput/dynamicInput";
import Select from "react-select";
import {FaPlus, FaTrashAlt} from "react-icons/fa";
import BioButton from "../button/BioButton";
import {Label} from "flowbite-react";
import i18n from "../../i18n";


const Characteristics = ({modelCaracs, setCharacteristique}) => {

    const apiRequest = useAPIRequest();
    const [loading, setLoading] = useState(false);
    const [duplicate, setDuplicate] = useState(false);
    const [caracteristiques, setCaracteristiques] = useState([]);
    const [selectedCaracteristiques, setSelectedCaracteristiques] = useState([]);
    const dragCarac = useRef(0)
    const draggedOverCarac = useRef(0)

    useEffect(() => {
        const fetchCarac = async () => {
            setLoading(true);
            try {
                const response = await apiRequest('/api/caracteristique', 'GET');
                const data = await response.json()
                setCaracteristiques(data);
            } catch (error) {
                console.error(i18n.t('errorMessage : ' + error));
            } finally {
                setLoading(false);
            }
        };
        fetchCarac();
    }, []);

    function addOneCarac() {
        setSelectedCaracteristiques([
            ...selectedCaracteristiques,
            {
                id: 1,
                value: '',
                order: selectedCaracteristiques.length,
                disabled: false
            }
        ])
    }

    useEffect(() => {
        setSelectedCaracteristiques(
            selectedCaracteristiques.filter(a =>
                a.disabled !== true
            )
        );
        modelCaracs.forEach((modelCarac) => {
            setSelectedCaracteristiques((prev) => [
                ...prev,
                {
                    id: modelCarac.id,
                    value: modelCarac.typeChamp === "select" ? modelCarac.listeValeurs[0] : '',
                    order: prev.length,
                    disabled: true,
                },
            ]);
        });
    }, [])

    useEffect(() => {

        const hasDuplicate = selectedCaracteristiques.some((item, index, array) =>
            array.findIndex(i => i.id === item.id) !== index
        );
        if (!hasDuplicate) {
            setCharacteristique(selectedCaracteristiques)
            setDuplicate(false)
        } else {
            setDuplicate(true)
        }
    }, []);

    function handleChange(value, index, field) {
        setSelectedCaracteristiques((prevCaracteristiques) => {
            const updatedCaracteristiques = [...prevCaracteristiques];
            updatedCaracteristiques[index] = {
                ...updatedCaracteristiques[index],
                [field]: field === 'id' ? parseInt(value) : value,
                ['order']: index
            };
            return updatedCaracteristiques;
        });
    }

    function handleSort() {
        const result = [...selectedCaracteristiques]; // Copier le tableau pour éviter de muter l'original
        const step = dragCarac.current < draggedOverCarac.current ? 1 : -1; // Déterminer le sens du déplacement
        const temp = result[dragCarac.current]; // Sauvegarder l'élément du premier index

        // Déplacer les éléments entre les deux positions
        for (let i = dragCarac.current; i !== draggedOverCarac.current; i += step) {
            result[i] = result[i + step];
            result[i].order = i; // Mettre à jour l'ordre
        }

        // Placer l'élément sauvegardé à la position finale
        result[draggedOverCarac.current] = temp;
        result[draggedOverCarac.current].order = draggedOverCarac.current; // Mettre à jour l'ordre du dernier élément

        setSelectedCaracteristiques(result)

    }

    // Préparer les options pour react-select
    const options = caracteristiques
        .filter(caracteristique => caracteristique && caracteristique.nom && caracteristique.unite?.nom)
        .map(caracteristique => ({
            value: caracteristique.id,
            label: `${caracteristique.nom}${caracteristique.unite?.libelle ? ` (${caracteristique.unite.libelle})` : ''}`,
        }));

    return (
        <div className="bg-gray-50 border gap-8  shadow p-6">
            <BioButton color="success" onClick={addOneCarac} className="mt-5 mb-8">
                <FaPlus size={15} className="mt-0.5 mr-2"/> {i18n.t('form.addCharacteristic')}
            </BioButton>
            {duplicate &&
                <div
                    className="flex  mt-2 text-red-600 font-bold   mb-3">
                    <p className="flex border-2 border-red-600 justify-center items-center p-1">
                        <ImWarning/>

                        {i18n.t('duplicateCharacteristic')}</p>
                </div>
            }
            {selectedCaracteristiques.map((char, index) => (
                <div key={index}
                     className="relative flex items-center gap-4 mb-2 pb-2 p-4 bg-white rounded shadow"
                     draggable
                     onDragStart={() => (dragCarac.current = index)}
                     onDragEnter={() => (draggedOverCarac.current = index)}
                     onDragEnd={handleSort}
                     onDragOver={(e) => e.preventDefault()}
                >
                    <div className="flex flex-col w-1/3">
                        <Label>Nom <span
                            className="text-red-500">*</span></Label>
                        <Select
                            value={options.find(option => option.value === char.id) || null}
                            options={options}
                            isSearchable
                            isDisabled={char.disabled || loading}
                            onChange={(selectedOption) => handleChange(selectedOption.value, index, 'id')}
                            placeholder={i18n.t('form.selectOption')}
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
                    <div className="flex flex-col flex-grow">
                        <DynamicInput
                            key={index}
                            caracteristique={caracteristiques.find((c) => c.id === char.id) || null}
                            value={char.value}
                            onChange={(newValue) => handleChange(newValue, index, 'value')}
                        />
                    </div>
                    <BioButton
                        color={"failure"}
                        className="ml-auto"
                        onClick={() => {
                            setSelectedCaracteristiques(
                                selectedCaracteristiques.filter((a, deleteIndex) => deleteIndex !== index)
                            );
                        }}
                    >
                        <FaTrashAlt/>
                    </BioButton>
                </div>
            ))}
        </div>
    );
};


export default Characteristics;