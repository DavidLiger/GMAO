'use client';
import Link from 'next/link';
import {FaListUl} from 'react-icons/fa';
import {useNavigation} from '../../../../providers/NavigationContext';
import {useEffect} from 'react';
import i18n from "../../../../i18n";
import {useBreadcrumb} from '../../../../providers/BreadCrumbContext';

const ButtonNavigator = () => {
    const {setActiveLabel} = useNavigation();
    const {setBreadcrumbs} = useBreadcrumb();

    useEffect(() => {
        setActiveLabel(i18n.t('listManagement.title')); // Définir le titre de la page
    }, [setActiveLabel]);

    useEffect(() => {
        setBreadcrumbs([
            {label: i18n.t("breadcrumb.listManagement"), href: null},
            // {label: i18n.t("breadcrumb.listManagement"), href: '/gestion-listes'},
            // {label: i18n.t("breadcrumb.teams"), href: '/utilisateur/equipe'},
        ]);
    }, [setBreadcrumbs]);

    return (
        <div className="flex flex-col items-center mt-6 p-6 bg-gray-100 rounded-lg shadow-md max-w-md mx-auto">
            <div className="flex flex-col gap-4 w-full">
                <Link href="/parametrage/gestion-listes/cause"
                      className="flex items-center justify-between p-4 bg-primary text-white rounded-lg shadow hover:bg-primaryLight hover:text-black transition duration-200">
                    <span>{i18n.t("menucauses")}</span>
                    <FaListUl className="mr-2"/>
                </Link>
                <Link href="/parametrage/gestion-listes/criticite"
                      className="flex items-center justify-between p-4 bg-primary text-white rounded-lg shadow hover:bg-primaryLight hover:text-black transition duration-200">
                    <span>{i18n.t("menucriticities")}</span>
                    <FaListUl className="mr-2"/>
                </Link>
                <Link href="/parametrage/gestion-listes/remediation"
                      className="flex items-center justify-between p-4 bg-primary text-white rounded-lg shadow hover:bg-primaryLight hover:text-black transition duration-200">
                    <span>{i18n.t("menuremediations")}</span>
                    <FaListUl className="mr-2"/>
                </Link>
                <Link href="/parametrage/gestion-listes/type-action"
                      className="flex items-center justify-between p-4 bg-primary text-white rounded-lg shadow hover:bg-primaryLight hover:text-black transition duration-200">
                    <span>{i18n.t("menuactionTypes")}</span>
                    <FaListUl className="mr-2"/>
                </Link>
                <Link href="/parametrage/gestion-listes/type-releve"
                      className="flex items-center justify-between p-4 bg-primary text-white rounded-lg shadow hover:bg-primaryLight hover:text-black transition duration-200">
                    <span>{i18n.t("menurecordTypes")}</span>
                    <FaListUl className="mr-2"/>
                </Link>
            </div>
        </div>
    );
};

export default ButtonNavigator;