'use client'
import {useParams} from "next/navigation";
import TeamForm from "../../../../../../components/form/equipeForm/TeamsForm";
import {useNavigation} from "../../../../../../providers/NavigationContext";
import {useBreadcrumb} from "../../../../../../providers/BreadCrumbContext";
import {useEffect} from "react";
import i18n from "../../../../../../i18n";

export default function EditTeamPage() {
    const {setActiveLabel} = useNavigation();
    const {setBreadcrumbs} = useBreadcrumb();

    useEffect(() => {
        setBreadcrumbs([
            {label: i18n.t("breadcrumbUser.parametrage"), href: null},
            {label: i18n.t("breadcrumbUser.teams"), href: '/parametrage/equipe'},
        ]);
    }, [setBreadcrumbs]);

    useEffect(() => {
        setActiveLabel(i18n.t("editTeam.title")); // Par exemple "Ajouter une équipe"
    }, [setActiveLabel]);
    const {id} = useParams();
    return <TeamForm teamId={id}/>;
}
