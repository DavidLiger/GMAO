import React from 'react';
import Select from 'react-select';
import i18n from '../../i18n';
import {useRouter} from "next/navigation";

const languageOptions = [
    {value: 'fr', label: 'Français', flag: '🇫🇷'},
    {value: 'en', label: 'English', flag: '🇬🇧'},
];

const formatOptionLabel = ({label, flag}) => (
    <div style={{display: 'flex', alignItems: 'center'}}>
        <span style={{marginRight: 8}}>{flag}</span>
        <span>{label}</span>
    </div>
);

const customStyles = {
    control: (provided) => ({
        ...provided,
        minWidth: 120,
        cursor: 'pointer',
    }),
    option: (provided) => ({
        ...provided,
        cursor: 'pointer',
    }),
};

const LanguageSelect = () => {
    const router = useRouter()
    const currentLanguage = languageOptions.find(
        (option) => option.value === i18n.language
    ) || languageOptions[0];

    const handleChange = (selectedOption) => {
        console.log(selectedOption)
        i18n.changeLanguage(selectedOption.value);
        router.refresh()
    };

    return (
        <Select
            value={currentLanguage}
            onChange={handleChange}
            options={languageOptions}
            formatOptionLabel={formatOptionLabel}
            styles={customStyles}
            isSearchable={false}
            menuPlacement="auto"
        />
    );
};

export default LanguageSelect;
