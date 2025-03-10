'use client';

import {useEffect, useState} from 'react';
import {Popover} from 'flowbite-react';
import {FiGrid} from 'react-icons/fi';
import * as FaIcons from 'react-icons/fa'; // Importation dynamique des icônes
import {useRouter} from 'next/navigation';
import shortcutData from "../../src/json/shortcut.json"
import BioButton from "../button/BioButton";
import i18n from "../../i18n";


const ShortCutMenu = ({role}) => {
    const [shortcuts, setShortcuts] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const loadShortcuts = async () => {
            const data = shortcutData;
            const userShortcuts = data.find((item) => item.role === role);

            if (userShortcuts) {
                // Associer les icônes dynamiquement
                const mappedShortcuts = userShortcuts.shortcuts.map((shortcut) => ({
                    ...shortcut,
                    icon: FaIcons[shortcut.icon] ? FaIcons[shortcut.icon] : FaIcons.FaQuestionCircle, // Icône par défaut si inexistante
                }));
                setShortcuts(mappedShortcuts);
            }
        };
        loadShortcuts();
    }, [role]);

    return (
        <Popover content={
            <div className="p-4 bg-white rounded-lg shadow-lg w-48">
                <h3 className="text-lg font-semibold mb-2">{i18n.t("shortcuts")}</h3>
                <ul className="space-y-2">
                    {shortcuts.map((shortcut, index) => (
                        <li
                            key={index}
                            className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded cursor-pointer text-gray-500"
                            onClick={() => router.push(shortcut.link)}
                        >
                            <span className="text-xl">{shortcut.icon && <shortcut.icon/>}</span>
                            <span>{shortcut.name}</span>
                        </li>
                    ))}
                </ul>
            </div>
        }>
            <BioButton color={"gray"} className="rounded-full transition">
                <FiGrid size={24} className={"text-gray-600"}/>
            </BioButton>
        </Popover>
    );
};

export default ShortCutMenu;
