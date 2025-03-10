"use client"

import React, {useEffect} from "react";
import UserFormPage from "../../../../../../components/form/userForm/UserForm";
import {useBreadcrumb} from "../../../../../../providers/BreadCrumbContext";
import {useNavigation} from "../../../../../../providers/NavigationContext";
import i18n from "../../../../../../i18n";
import {useParams} from "next/navigation";


const EditUserPage = () => {

    const {setActiveLabel} = useNavigation();
    const {setBreadcrumbs} = useBreadcrumb();
    const {id} = useParams();

    // Configuration des breadcrumbs et du titre selon le mode
    useEffect(() => {
        setActiveLabel(i18n.t("editUser.title"));
        setBreadcrumbs([
            {label: i18n.t("breadcrumbUser.parametrage"), href: null},
            {label: i18n.t("breadcrumbUser.myAccount"), href: "/parametrage/utilisateur"}
        ]);
    }, [setBreadcrumbs, setActiveLabel, id]);
    return (
        <UserFormPage id={id}/>
    );
};

export default EditUserPage;
