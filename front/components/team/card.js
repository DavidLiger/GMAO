import React, {useState} from "react";
import {FaChevronDown, FaChevronUp, FaEdit, FaPlus, FaSave, FaTimes, FaTrashAlt} from "react-icons/fa";
import Select from "react-select";
import {useRouter} from "next/navigation";
import BioButton from "../button/BioButton";
import i18n from "../../i18n";
import {useAPIRequest} from "../api/apiRequest";
import {useToast} from "../../providers/toastProvider";

const TeamCard = ({team, onAddMember, users, onDeleteTeam}) => {
    const router = useRouter();
    const [expanded, setExpanded] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [adding, setAdding] = useState(false);
    const apiRequest = useAPIRequest()
    const {addToast} = useToast()

    const responsable = team.equipeUtilisateurs?.find(member => member.responsable);
    const membresSansResponsable = team.equipeUtilisateurs?.filter(member => !member.responsable);

    // Exclure les membres déjà présents
    const existingUserIds = team.equipeUtilisateurs?.map(member => member.utilisateur.id) || [];
    const filteredUsers = users.filter(user => !existingUserIds.includes(user.id));

    const deleteTeam = async () => {
        const response = await apiRequest(`/api/equipe/${team.id}`, 'DELETE');
        if (response.ok) {
            addToast({message: i18n.t('toast.deleteSuccess'), type: 'success'});
            if (onDeleteTeam) {
                onDeleteTeam(team.id);  // Mise à jour de la liste dans le parent
            }
        } else {
            addToast({message: i18n.t('errorMessage'), type: 'failure'});
        }
    };

    return (
        <div
            className="px-4 py-2 rounded-lg shadow-md mb-4 border-4"
        >
            <div className="flex items-center cursor-pointer" onClick={() => setExpanded(!expanded)}>
                <span className={`${team.color} rounded-full w-6 h-6 border border-gray-500`}/>
                <h2 className="text-xl font-extrabold ml-2">{team.nom}</h2>


                {expanded ? <FaChevronUp className={'ml-auto'}/> : <FaChevronDown className={'ml-auto'}/>}
            </div>
            {expanded && (
                <div className="mt-2 relative min-h-7">
                    {responsable && (
                        <p className="font-bold mb-2">
                            Responsable: {responsable.utilisateur.prenom} {responsable.utilisateur.nom}
                        </p>
                    )}
                    {membresSansResponsable?.sort((a, b) => a?.utilisateur.nom.localeCompare(b?.utilisateur.nom)).map(member => (
                        <p key={member.utilisateur.id}>
                            {member.utilisateur.prenom} {member.utilisateur.nom}
                        </p>
                    ))}
                    {adding ? (
                        <div className="flex items-center gap-2 mt-2 w-full">
                            <Select
                                options={filteredUsers.map(user => ({
                                    value: user.id,
                                    label: `${user.prenom} ${user.nom}`,
                                }))}
                                onChange={option => setSelectedUser(option.value)}
                                isSearchable
                                className="w-full mr-4"
                                styles={{
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
                                        backgroundColor: "#f8fafc"
                                    })
                                }}
                            />
                            <BioButton
                                onClick={() => {
                                    onAddMember(team.id, selectedUser);
                                    setAdding(false); // Ferme la fenêtre après l'ajout
                                }}
                                color={"success"}
                            >
                                <FaSave/>
                            </BioButton>
                            <BioButton
                                onClick={() => setAdding(false)}
                                color={"gray"}
                            >
                                <FaTimes/>
                            </BioButton>
                        </div>
                    ) : (
                        <div className={"flex flex-row justify-between mt-2"}>
                            <BioButton
                                onClick={() => deleteTeam()}
                                className="flex flex-row items-center justify-center"
                                color={"failure"}
                            >
                                <FaTrashAlt size={12} className={"mt-1 mr-2"}/> {i18n.t('delete')}
                            </BioButton>
                            <BioButton
                                className={"flex flex-row items-center justify-center"}
                                onClick={() => router.push(`/parametrage/equipe/edit/${team.id}`)}
                                color={"primary"}
                            >
                                <FaEdit size={12} className={"mt-1 mr-2"}/> {i18n.t('edit')}
                            </BioButton>
                            <BioButton
                                onClick={() => setAdding(true)}
                                className="flex flex-row items-center justify-center"
                                color={"success"}
                            >
                                <FaPlus size={12} className={"mt-1 mr-2"}/> {i18n.t('add')}
                            </BioButton>
                        </div>
                    )}
                </div>
            )
            }
        </div>
    )
        ;
};

export default TeamCard;
