import React, {useEffect, useState} from "react";
import Select from "react-select";
import {Popover} from "flowbite-react";
import {useAPIRequest} from "../api/apiRequest";
import i18n from "../../i18n";
import {useDebouncedCallback} from "use-debounce";

const Filter = ({column}) => {
    const columnFilterValue = column.getFilterValue();
    const {filterVariant} = column.columnDef.meta ?? {};
    const apiRequest = useAPIRequest();
    const [unites, setUnites] = useState([]);

    useEffect(() => {
        if (filterVariant === 'unite') {
            apiRequest("/api/unite/gmao")
                .then((res) => res.json())
                .then((data) => setUnites(data));
        }
    }, []);

    const selectStyle = {
        valueContainer: (provided) => ({
            ...provided,
            marginLeft: 0,
            paddingBottom: 0,
            paddingTop: 0,
            textAlign: "left",
            height: "22px"
        }),
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
            fontSize: '13px',
            boxShadow: 'none',
            minHeight: 0,
            padding: 0,
            '&:hover': {
                borderColor: 'rgb(107 114 128)',
            },
            minWidth: '200px',
            outline: 'none',
            height: '22px'
        }),
        option: (provided, state) => ({
            ...provided,
            padding: 0,
            margin: 0,
            paddingLeft: 10,
            paddingTop: 3,
            backgroundColor: state.isSelected
                ? 'rgb(59 130 246)'
                : state.isFocused
                    ? 'rgb(219 234 254)'
                    : undefined,
            color: state.isSelected ? 'white' : 'black',
            fontSize: '0.8rem',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            textAlign: "left"
        }),
        menu: (provided) => ({
            ...provided,
            maxWidth: 'auto',
            minWidth: '200px',
        }),
    };

    if (filterVariant === 'text') {
        return (
            <DebouncedInput
                className="w-full border shadow rounded py-1 px-2 text-sm"
                onChange={(value) => column.setFilterValue(value)}
                placeholder={i18n.t("searchPlaceholder")}
                type="text"
                value={columnFilterValue ?? ''}
            />
        );
    }

    if (filterVariant === "date") {
        const minDate = columnFilterValue?.min || "";
        const maxDate = columnFilterValue?.max || "";

        return (
            <Popover content={
                <div className="flex flex-row gap-1 p-4 border-2 border-gray-300 rounded shadow-xl">
                    <input
                        type="date"
                        value={minDate}
                        onChange={(e) =>
                            column.setFilterValue({
                                ...columnFilterValue,
                                min: e.target.value || undefined,
                            })
                        }
                        className="w-full border shadow rounded py-1 px-2 text-sm"
                        placeholder={i18n.t("dateMinPlaceholder")}
                    />
                    <span className="text-white"> - </span>
                    <input
                        type="date"
                        value={maxDate}
                        onChange={(e) =>
                            column.setFilterValue({
                                ...columnFilterValue,
                                max: e.target.value || undefined,
                            })
                        }
                        className="w-full border shadow rounded py-1 px-2 text-sm"
                        placeholder={i18n.t("dateMaxPlaceholder")}
                    />
                </div>
            }>
                <button
                    className="bg-white text-primary w-full mb-1 py-0 hover:bg-primaryHoverText hover:text-white rounded text-sm"
                    aria-label={i18n.t("filter")}
                >
                    {i18n.t("filter")}
                </button>
            </Popover>
        );
    }

    if (filterVariant === 'typeChamp') {
        const options = [
            {value: "", label: i18n.t("all")},
            {value: i18n.t("options.number"), label: i18n.t("options.number")},
            {value: i18n.t("options.text"), label: i18n.t("options.text")},
            {value: i18n.t("options.date"), label: i18n.t("options.date")},
            {value: i18n.t("options.month"), label: i18n.t("options.month")},
            {value: i18n.t("options.select"), label: i18n.t("options.select")},
            {value: i18n.t("options.year"), label: i18n.t("options.year")},
        ];
        return (
            <Select
                value={options.find((option) => option.value === columnFilterValue) || options[0]}
                onChange={(selectedOption) =>
                    column.setFilterValue(selectedOption?.value || '')
                }
                isSearchable
                options={options}
                styles={selectStyle}
                classNames={{control: () => 'p-0'}}
                components={{
                    DropdownIndicator: () => null,
                    MultiValue: () => null,
                }}
            />
        );
    }

    if (filterVariant === 'unite') {
        const options = [
            {value: '', label: i18n.t('all')},
            ...unites.map((unite) => ({
                value: unite.nom,
                label: `${unite.nom} (${unite.libelle})`,
            })),
        ];

        return (
            <Select
                options={options}
                value={options.find((option) => option.value === columnFilterValue) || options[0]}
                onChange={(selectedOption) =>
                    column.setFilterValue(selectedOption?.value || '')
                }
                placeholder={i18n.t('all')}
                isSearchable
                styles={selectStyle}
                classNames={{control: () => 'p-0'}}
                components={{
                    DropdownIndicator: () => null,
                    MultiValue: () => null,
                }}
            />
        );
    }
    return null;
};

const DebouncedInput = ({
                            value: initialValue,
                            onChange,
                            debounce = 500,
                            ...props
                        }) => {
    const [value, setValue] = useState(initialValue);
    const debounced = useDebouncedCallback((v) => {
        onChange(v);
    }, debounce);

    return (
        <input
            {...props}
            value={value}
            onChange={e => {
                setValue(e.target.value);
                debounced(e.target.value);
            }}
            className={"w-full rounded py-0 px-2 text-sm"}
        />
    )
}

export default Filter;
