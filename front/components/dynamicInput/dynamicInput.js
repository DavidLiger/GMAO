import {Label, TextInput} from "flowbite-react";
import React from "react";
import Select from "react-select";
import i18n from "../../i18n";

const DynamicInput = ({caracteristique, value, onChange, showLabel = true}) => {

    console.log(caracteristique)
    const options = caracteristique?.listeValeurs?.map((valeur) => ({
        value: valeur,
        label: valeur,
    })) || [];

    const selectedOption = options.find(option => option.value === value) || null;

    if (!caracteristique) {
        return (
            <div className="text-red-500">
                <p>{i18n.t('error.undefinedCharacteristic')}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col flex-grow">
            {showLabel &&
                <Label>{i18n.t('form.value')}<span className="text-red-500">*</span></Label>
            }
            {caracteristique.typeChamp === "select" ? (
                <Select
                    value={selectedOption}
                    onChange={(option) => onChange(option.value)}
                    options={options}
                    placeholder={i18n.t('form.selectOption')}
                    className="border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
                    classNamePrefix="react-select"
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
            ) : (
                <TextInput
                    type={
                        ["date", "month", "text", "number"].includes(caracteristique.typeChamp)
                            ? caracteristique.typeChamp
                            : "text"
                    }
                    value={value ?? ""}
                    onChange={(e) => onChange(e.target.value)}
                    required
                />
            )}
        </div>
    );
};

export default DynamicInput;
