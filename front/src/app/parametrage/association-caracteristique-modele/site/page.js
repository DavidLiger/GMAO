// pages/index.js
"use client"
import React, {useEffect} from 'react';
import DndWrapper from '../../../../../components/patrimonySetter/DndWrapper';
import ModelSetter from '../../../../../components/modelSetter/ModelSetter';
import {useNavigation} from "../../../../../providers/NavigationContext";
import {useBreadcrumb} from "../../../../../providers/BreadCrumbContext";
import i18n from "i18next";

const PatrimonySetter = () => {
    const {setActiveLabel} = useNavigation();
    const {setBreadcrumbs} = useBreadcrumb();

    useEffect(() => {
        setBreadcrumbs([
            {label: i18n.t("parametrage"), href: '/'}, 
            {label: i18n.t("models"), href: null}
        ]);
    }, [setBreadcrumbs]);

    useEffect(() => {
        setActiveLabel(i18n.t('titleCaracSite')); // Définir le titre de la page
    }, [setActiveLabel]);
    return (
        <DndWrapper>
            <ModelSetter typeSetted={'site'}/>
        </DndWrapper>
    );
};

export default PatrimonySetter;


