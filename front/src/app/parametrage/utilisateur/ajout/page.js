"use client"

import React, {useEffect} from "react";
import i18n from "i18next";
import {useNavigation} from "../../../../../providers/NavigationContext";
import {useBreadcrumb} from "../../../../../providers/BreadCrumbContext";
import UserFormPage from "../../../../../components/form/userForm/UserForm";

const CreateUserPage = () => {

    const {setActiveLabel} = useNavigation();
    const {setBreadcrumbs} = useBreadcrumb();

    useEffect(() => {
        setBreadcrumbs([
            {label: i18n.t("breadcrumbUser.parametrage"), href: null},
            {label: i18n.t("breadcrumbUser.myAccount"), href: "/parametrage/utilisateur"}
        ]);
        setActiveLabel(i18n.t("createUser.title")); // Par exemple "Création de compte utilisateur"
    }, [setActiveLabel, setBreadcrumbs]);

    return (
        <UserFormPage/>
    );
};

export default CreateUserPage;
