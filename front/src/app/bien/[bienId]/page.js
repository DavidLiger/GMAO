'use client'
import React, {useEffect, useState} from 'react';
import {useAPIRequest} from "../../../../components/api/apiRequest";
import {useParams} from "next/navigation";
import BienDetails from "../../../../components/bienDetail/BienDetails";
import i18n from "../../../../i18n";
import {useBreadcrumb} from '../../../../providers/BreadCrumbContext';
import {useNavigation} from "../../../../providers/NavigationContext";

const BienPage = () => {
    const apiRequest = useAPIRequest();
    const {setActiveLabel} = useNavigation();
    const {bienId} = useParams();
    const [bien, setBien] = useState(null);
    const {setBreadcrumbs} = useBreadcrumb();

    useEffect(() => {
        apiRequest(`/api/bien/${bienId}`)
            .then((res) => res.json())
            .then((data) => {
                const updatedBien = {
                    ...data,
                    nature: data.typeBien?.nature, // Remonte la propriété 'nature'
                };
                setBien(updatedBien);
            })
            .catch((err) => console.error('Erreur:', err));
    }, [bienId]);

    useEffect(() => {
        async function fetchBreadcrumbs(id) {
            try {
                const response = await apiRequest(`/api/bien/breadcrumbs/${id}`);
                const data = await response.json();

                // Trier le tableau retourné (ici par id croissant)
                const orderedData = data.sort((a, b) => a.id - b.id);

                // Transformer les données en format breadcrumb
                const dynamicBreadcrumbs = orderedData.map(item => ({
                    label: item.nom,
                    href: `/bien/${item.id}` // Adaptez l’URL selon votre logique
                }));

                // Combiner le breadcrumb statique avec les breadcrumbs dynamiques
                setBreadcrumbs([
                    {label: i18n.t("patrimoineTitle"), href: '/bien'},
                    ...dynamicBreadcrumbs
                ]);
            } catch (error) {
                console.error(i18n.t("breadcrumbsError"), error);
            }
        }

        fetchBreadcrumbs(bienId);
    }, [bienId, setBreadcrumbs]);


    useEffect(() => {
        setActiveLabel(i18n.t("yourHeritage")); // Par exemple "Votre Patrimoine"
    }, [setActiveLabel]);

    if (!bien) {
        return <div>{i18n.t("loading")}</div>;
    }

    return (
        <div>
            <BienDetails bien={bien}/>
        </div>
    );
}
export default BienPage;
