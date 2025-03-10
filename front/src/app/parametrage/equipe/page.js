'use client';

import {useEffect, useMemo, useState} from 'react';
import {FaPlus, FaSearch} from 'react-icons/fa';
import {useAPIRequest} from '../../../../components/api/apiRequest';
import TeamCard from "../../../../components/team/card";
import {useRouter} from "next/navigation";
import Masonry from "react-masonry-css";
import {useNavigation} from "../../../../providers/NavigationContext";
import {useBreadcrumb} from "../../../../providers/BreadCrumbContext";
import BioButton from "../../../../components/button/BioButton";
import {TextInput} from "flowbite-react";
import i18n from "../../../../i18n";

const TeamManagement = () => {
    const apiRequest = useAPIRequest();
    const router = useRouter();
    const [teams, setTeams] = useState([]);
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const breakpoints = {
        default: 3, // Nombre de colonnes par défaut
        768: 2,  // 2 colonnes sur tablette
        480: 1   // 1 colonne sur mobile
    };
    const {setActiveLabel} = useNavigation();
    const {setBreadcrumbs} = useBreadcrumb();

    useEffect(() => {
        setBreadcrumbs([
            {label: i18n.t('parametrage'), href: null}
        ]);
    }, [setBreadcrumbs]);

    useEffect(() => {
        setActiveLabel('Vos équipes'); // Définir le titre de la page
    }, [setActiveLabel]);

    useEffect(() => {
        const fetchTeams = async () => {
            const response = await apiRequest('/api/equipe/membre', 'GET');
            const data = await response.json()
            setTeams(data);
        };
        const fetchUsers = async () => {
            const response = await apiRequest('/api/utilisateur/employe', 'GET');
            const data = await response.json()
            setUsers(data);
        };
        fetchTeams();
        fetchUsers();
    }, []);

    const filteredTeams = useMemo(() => {
        return teams?.filter(team =>
            team.nom.toLowerCase().includes(search.toLowerCase()) ||
            team.equipeUtilisateurs?.some(member =>
                (`${member.utilisateur.prenom} ${member.utilisateur.nom}`).toLowerCase().includes(search.toLowerCase())
            )
        ) || [];
    }, [search, teams]);
    const handleAddMember = async (teamId, userId) => {
        if (!userId) return;
        try {
            await apiRequest(`/api/equipe/${teamId}/ajoutmembre`, 'POST', {userId});
            setTeams(prevTeams =>
                prevTeams.map(team =>
                    team.id === teamId
                        ? {
                            ...team,
                            equipeUtilisateurs: [
                                ...team.equipeUtilisateurs,
                                {utilisateur: users.find(user => user.id === userId), responsable: false},
                            ],
                        }
                        : team
                )
            );
        } catch (error) {
            console.error('Erreur lors de l\'ajout du membre:', error);
        }
    };

    const handleDeleteTeam = (teamId) => {
        setTeams(prevTeams => prevTeams.filter(team => team.id !== teamId));
    };
    return (
        <div className="mx-8 p-6 bg-white shadow w-full">
            <div className="flex items-center gap-2 mb-4 p-2 rounded-lg bg-white justify-between">
                <div className="w-4/5 flex flex-row items-center justify-center text-2xl gap-2">
                    <TextInput
                        icon={FaSearch}
                        type="text"
                        placeholder="Rechercher une équipe ou un membre..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full outline-none border-0 focus:ring-0"
                    />
                </div>
                <BioButton color={"success"}
                           onClick={() => router.push('/parametrage/equipe/ajout')}>
                    <FaPlus size={15} className={"mt-0.5 mr-2"}/> Ajouter une équipe
                </BioButton>
            </div>
            <Masonry
                breakpointCols={breakpoints}
                className="flex gap-4"
                columnClassName="masonry-column"
            >
                {filteredTeams.map(team => (
                    <TeamCard key={team.id} team={team} onAddMember={handleAddMember} users={users}
                              onDeleteTeam={handleDeleteTeam}/>
                ))}
            </Masonry>
        </div>
    );
};

export default TeamManagement;
