import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

// const API_URL = 'http://localhost:8080/api/arbo_entite_type'; // Remplacez par l'URL correcte
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const API_URL = `${BASE_URL}/api/arboentitetype`;
const TYPE_BIEN_API_URL = `${BASE_URL}/api/typebien`;
const CARACTERISTIQUE_API_URL = `${BASE_URL}/api/caracteristique`;
const CARACTERISTIQUE_TYPE_BIEN_API_URL = `${BASE_URL}/api/caracteristiqueTypeBien`;


const initialState = {
    typeEntites: [], // Initialisez avec null ou un objet vide
    typeOuvrages: [],
    typeEquipements: [],
    typeComposants: [],
    model: [],
    buttonModels: [],
    caracteristiques: [],
    loading: false,
    error: null,
    isPersistanceUpdated: true, // Ajoutez cet état
    waitingPath: null
};

export const fetchSites = createAsyncThunk('typeEntites/fetchSites', async ({token}) => {
    const response = await fetch(`${TYPE_BIEN_API_URL}/nature/site`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`, // Déplacez Authorization ici
        },
    });

    if (!response.ok) {
        throw new Error('Échec de la récupération des typeEntites');
    }

    return await response.json(); // Assuming the response is in JSON format
});

export const fetchOuvrages = createAsyncThunk('typeEntites/fetchOuvrages', async ({token}) => {
    const response = await fetch(`${TYPE_BIEN_API_URL}/nature/ouvrage`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`, // Déplacez Authorization ici
        },
    });

    if (!response.ok) {
        throw new Error('Échec de la récupération des ouvrages');
    }

    return await response.json(); // Assuming the response is in JSON format
});

export const fetchEquipements = createAsyncThunk('typeEntites/fetchEquipements', async ({token}) => {
    const response = await fetch(`${TYPE_BIEN_API_URL}/nature/equipement`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`, // Déplacez Authorization ici
        },
    });

    if (!response.ok) {
        throw new Error('Échec de la récupération des equipements');
    }

    return await response.json(); // Assuming the response is in JSON format
});

export const fetchComposants = createAsyncThunk('typeEntites/fetchComposants', async ({token}) => {
    const response = await fetch(`${TYPE_BIEN_API_URL}/nature/composant`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`, // Déplacez Authorization ici
        },
    });

    if (!response.ok) {
        throw new Error('Échec de la récupération des composants');
    }

    return await response.json(); // Assuming the response is in JSON format
});

// Add a new entite to the API
export const addEntite = createAsyncThunk(
    'typeEntites/addEntite',
    async ({entity, token}) => {
        const response = await fetch(TYPE_BIEN_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(entity),
        });
        if (!response.ok) {
            throw new Error('Échec de l\'ajout du entite');
        }
        return await response.json(); // Assuming the response is in JSON format
    }
);

// Update an existing entity in the API
export const updateEntite = createAsyncThunk(
    'typeEntites/updateEntite',
    async ({entity, token}) => {
        const response = await fetch(`${TYPE_BIEN_API_URL}/${entity.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(entity),
        });
        if (!response.ok) {
            throw new Error('Échec de la mise à jour de l\'entité');
        }
        return await response.json(); // Assuming the response is in JSON format
    }
);

// Fetch typeEntites from the API
export const fetchCaracteristiques = createAsyncThunk(
    'typeEntites/fetchCaracteristiques',
    async ({token}) => {
        const response = await fetch(CARACTERISTIQUE_API_URL, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`, // Déplacez Authorization ici
            },
        });

        if (!response.ok) {
            throw new Error('Échec de la récupération des typeEntites');
        }

        return await response.json(); // Assuming the response is in JSON format
    });

// Fetch caracteristiques by typeBienId from the API
export const fetchCaracteristiquesByTypeBienId = createAsyncThunk(
    'typeEntites/fetchCaracteristiquesByTypeBienId',
    async ({typeBienId, token}) => {
        const response = await fetch(`${CARACTERISTIQUE_TYPE_BIEN_API_URL}/type-bien/${typeBienId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Échec de la récupération des caractéristiques');
        }

        return await response.json(); // Assuming the response is in JSON format
    }
);

export const createCaracteristiqueTypeBien = createAsyncThunk(
    'typeEntites/createCaracteristiqueTypeBien',
    async ({caracteristique, token}) => {
        const response = await fetch(CARACTERISTIQUE_TYPE_BIEN_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(caracteristique),
        });

        if (!response.ok) {
            throw new Error('Échec de l\'ajout de la caractéristique');
        }

        return await response.json(); // Assuming the response is in JSON format
    }
);

export const updateCaracteristiqueTypeBien = createAsyncThunk(
    'caracteristiqueTypeBien/update',
    async ({caracteristiques, token}) => {
        // const token = getState().auth.token; // Assurez-vous d'avoir le token d'authentification dans votre état
        const response = await fetch(`${CARACTERISTIQUE_TYPE_BIEN_API_URL}/bulk-update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(caracteristiques), // Envoyer le tableau de caractéristiques
        });

        if (!response.ok) {
            throw new Error('Échec de la mise à jour des caractéristiques');
        }

        return await response.json(); // Assuming the response is in JSON format
    }
);

export const deleteAllCaracteristiquesTypeBien = createAsyncThunk(
    'caracteristiqueTypeBien/delete',
    async ({typeBienId, token}) => {
        const response = await fetch(`${CARACTERISTIQUE_TYPE_BIEN_API_URL}/deleteAllByTypeBien/${typeBienId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            // Pas de corps pour une requête DELETE
        });

        if (!response.ok) {
            throw new Error('Échec de la suppression des caractéristiques');
        }

        return await response.json(); // Assuming the response is in JSON format
    }
);

// Update a entite in the database
export const updateentite = createAsyncThunk('typeEntites/updateentite', async ({entite, token}) => {
    const response = await fetch(`${API_URL}/${entite.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Déplacez Authorization ici
        },
        body: JSON.stringify(entite),
    });
    return await response.json(); // Return the updated entite
});

// Delete a entite from the API
export const deleteEntite = createAsyncThunk('typeEntites/deleteEntite', async ({entite, token}) => {
    const response = await fetch(`${TYPE_BIEN_API_URL}/${entite}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Déplacez Authorization ici
        },
    });

    if (!response.ok) {
        throw new Error('Failed to delete the entite'); // Handle error
    }
    return entite; // Return the ID of the deleted entite
});

// Fetch a entite by ID from the API
export const fetchentiteById = createAsyncThunk('typeEntites/fetchById', async ({entite, token}) => {
    console.log(token);

    const response = await fetch(`${TYPE_BIEN_API_URL}/${entite}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Déplacez Authorization ici
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch the entite'); // Handle error
    }

    return await response.json(); // Return the entite data
});

export const addOuvrage = createAsyncThunk(
    'typeEntites/addOuvrage',
    async ({entiteId, ouvrage}, {getState}) => {
        // retourner les données
        return {entiteId, ouvrage: {id: ouvrage.id, ...ouvrage, show: true}};
    }
);

export const addEquipement = createAsyncThunk(
    'typeEntites/addEquipement',
    async ({entiteId, ouvrageId, equipement}, {getState}) => {
        // retourner les données
        return {entiteId, ouvrageId, equipement: {id: equipement.id, ...equipement, show: true}};
    }
);

export const addEquipementForentitePR = createAsyncThunk(
    'typeEntites/addEquipementForentitePR',
    async ({entiteId, equipement}, {getState}) => {
        // retourner les données
        return {entiteId, equipement: {id: equipement.id, ...equipement, show: true}};
    }
);

export const addComposant = createAsyncThunk(
    'typeEntites/addComposant',
    async ({entiteId, ouvrageId, equipementId, composant}, {getState}) => {
        // retourner les données
        return {entiteId, ouvrageId, equipementId, composant: {id: composant.id, ...composant, show: true}};
    }
);

export const addComposantForentitePR = createAsyncThunk(
    'typeEntites/addComposantForentitePR',
    async ({entiteId, equipementId, composant}, {getState}) => {
        // retourner les données
        return {entiteId, equipementId, composant: {id: composant.id, ...composant, show: true}};
    }
);

export const deleteOuvrage = createAsyncThunk(
    'typeEntites/deleteOuvrage',
    async ({entiteId, ouvrageId}, {getState}) => {
        // retourner les identifiants
        return {entiteId, ouvrageId};
    }
);

export const deleteEquipement = createAsyncThunk(
    'typeEntites/deleteEquipement',
    async ({entiteId, ouvrageId, equipementId}, {getState}) => {
        // retourner les identifiants
        return {entiteId, ouvrageId, equipementId};
    }
);

export const deleteEquipementForentitePR = createAsyncThunk(
    'typeEntites/deleteEquipementForentitePR',
    async ({entiteId, equipementId}, {getState}) => {
        // retourner les identifiants
        return {entiteId, equipementId};
    }
);

export const deleteComposant = createAsyncThunk(
    'typeEntites/deleteComposant',
    async ({entiteId, ouvrageId, equipementId, composantId}, {getState}) => {
        // retourner les identifiants
        return {entiteId, ouvrageId, equipementId, composantId};
    }
);

export const deleteComposantForentitePR = createAsyncThunk(
    'typeEntites/deleteComposantForentitePR',
    async ({entiteId, equipementId, composantId}, {getState}) => {
        // retourner les identifiants
        return {entiteId, equipementId, composantId};
    }
);

export const updateOrder = createAsyncThunk(
    'typeEntites/updateOrder',
    async ({parentId, newOrder}, {getState}) => {
        // retourner les données
        return {parentId, newOrder};
    }
);

export const updateOrderForentitePR = createAsyncThunk(
    'typeEntites/updateOrderForentitePR',
    async ({parentId, newOrder}, {getState}) => {
        // Retournez les données pour la mise à jour
        return {parentId, newOrder};
    }
);

export const toggleShow = createAsyncThunk(
    'typeEntites/toggleShow',
    async ({entiteId, itemId}) => {
        // Logique pour inverser l'état d'affichage (peut-être une API)
        return {entiteId, itemId}; // Retournez les données nécessaires
    }
);

export const toggleShowForentitePR = createAsyncThunk(
    'typeEntites/toggleShowForentitePR',
    async ({entiteId, itemId}) => {
        // Logique pour inverser l'état d'affichage (peut-être une API)
        return {entiteId, itemId}; // Retournez les données nécessaires
    }
);

const modelSetterSlice = createSlice({
    name: 'typeEntites',
    initialState,
    reducers: {
        setButtonentites: (state, action) => {
            state.buttonModels = action.payload; // Mettez à jour les typeEntites des boutons
        },
        setEntity: (state, action) => {
            state.model = action.payload;
        },
        addAvailableItem: (state, action) => {
            const {entiteId, item} = action.payload; // Assurez-vous d'extraire item correctement
            const buttonentite = state.buttonModels.find(entite => entite.id === entiteId);
            if (buttonentite) {
                buttonentite.items.push(item); // Ajoutez l'item au tableau items
            }
        },
        updateButtonentiteItems: (state, action) => {
            const {entiteId, items} = action.payload;
            const buttonentite = state.buttonModels.find(entite => entite.id === entiteId);
            if (buttonentite) {
                buttonentite.items = items; // Mettez à jour les items du buttonentite
            }
        },
        setCaracteristiquesForEntite: (state, action) => {
            const {entiteId, caracteristiques} = action.payload;
            const entite = state.buttonModels.find(s => s.id === entiteId);
            if (entite) {
                entite.caracteristiques = caracteristiques; // Ajoutez les caractéristiques au entite
            }
        },
        addCaracteristiqueToEntite: (state, action) => {
            // console.log(action.payload);
            const {entiteId, caracteristique} = action.payload;
            const entite = state.buttonModels.find(entite => entite.id === entiteId);
            if (entite) {
                // Assurez-vous que caracteristiques est un tableau
                entite.caracteristiques = entite.caracteristiques || [];

                // Vérifier si la caractéristique existe déjà
                const caracteristiqueExists = entite.caracteristiques.some(car => car.caracteristique.id === caracteristique.caracteristique.id);

                if (!caracteristiqueExists) {
                    // Ajoutez la caractéristique à la liste des caractéristiques du entite
                    entite.caracteristiques.push(caracteristique);
                } else {
                    console.log("La caractéristique existe déjà dans le entite, aucune action effectuée.");
                }
            }
        },
        removeCaracteristiqueFromEntite: (state, action) => {
            const {entiteId, caracteristiqueId} = action.payload;

            // Trouver le entite correspondant
            const entite = state.buttonModels.find(entite => entite.id === entiteId);
            if (entite && entite.caracteristiques) {
                // Filtrer les caractéristiques pour exclure celle à supprimer
                entite.caracteristiques = entite.caracteristiques.filter(car => car.caracteristique.id !== caracteristiqueId);
            }
        },
        setPersistanceUpdated: (state, action) => {
            state.isPersistanceUpdated = action.payload; // Met à jour l'état isPersistanceUpdated
        },
        setWaitingPath: (state, action) => {
            state.waitingPath = action.payload; // Met à jour l'état isPersistanceUpdated
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSites.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchSites.fulfilled, (state, action) => {
                state.loading = false;
                // Mettez à jour les typeEntites des boutons
                const filteredEntities = action.payload.map(entity => ({
                    id: entity.id,
                    nature: entity.nature,
                    nom: entity.nom,
                    arbo: entity.arbo
                }));
                state.buttonModels = filteredEntities; // Mettez à jour l'état des boutons
            })
            .addCase(fetchSites.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchOuvrages.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchOuvrages.fulfilled, (state, action) => {
                state.loading = false;
                // Mettez à jour les typeEntites des boutons
                const filteredEntities = action.payload.map(entity => ({
                    id: entity.id,
                    nature: entity.nature,
                    nom: entity.nom,
                    arbo: entity.arbo
                }));
                state.buttonModels = filteredEntities; // Mettez à jour l'état des boutons
            })
            .addCase(fetchOuvrages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchEquipements.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchEquipements.fulfilled, (state, action) => {
                state.loading = false;
                // Mettez à jour les typeEntites des boutons
                const filteredEntities = action.payload.map(entity => ({
                    id: entity.id,
                    nature: entity.nature,
                    nom: entity.nom,
                    arbo: entity.arbo
                }));
                state.buttonModels = filteredEntities; // Mettez à jour l'état des boutons
            })
            .addCase(fetchEquipements.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchComposants.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchComposants.fulfilled, (state, action) => {
                state.loading = false;
                // Mettez à jour les typeEntites des boutons
                const filteredEntities = action.payload.map(entity => ({
                    id: entity.id,
                    nature: entity.nature,
                    nom: entity.nom,
                    arbo: entity.arbo
                }));
                state.buttonModels = filteredEntities; // Mettez à jour l'état des boutons
            })
            .addCase(fetchComposants.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchCaracteristiques.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCaracteristiques.fulfilled, (state, action) => {
                state.loading = false;
                // Mettez à jour les typeEntites des boutons
                const filteredCaracteristiques = action.payload.map(caracteristique => ({
                    id: caracteristique.id,
                    societe: caracteristique.societe,
                    nom: caracteristique.nom,
                    listeValeurs: caracteristique.listeValeurs,
                    typeChamp: caracteristique.typeChamp,
                    unite: caracteristique.unite ? caracteristique.unite.nom : "",
                    libelle: caracteristique.unite ? caracteristique.unite.libelle : "",
                }));
                state.caracteristiques = filteredCaracteristiques; // Mettez à jour l'état des boutons
            })
            .addCase(fetchCaracteristiques.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchCaracteristiquesByTypeBienId.pending, (state) => {
                state.loading = true;
                state.error = null; // Réinitialise l'erreur
            })
            .addCase(fetchCaracteristiquesByTypeBienId.fulfilled, (state, action) => {
                const {typeBienId, caracteristiques} = action.payload; // Assurez-vous que l'API renvoie le typeBienId
                state.caracteristiques = caracteristiques; // Mettez à jour l'état avec les caractéristiques récupérées
                // Mettez à jour les caractéristiques pour le entite correspondant
                state.buttonModels.forEach(entite => {
                    if (entite.typeBienId === typeBienId) {
                        entite.caracteristiques = caracteristiques; // Ajoutez les caractéristiques au entite
                    }
                });
                state.loading = false;
            })
            .addCase(fetchCaracteristiquesByTypeBienId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message; // Gérer l'erreur
            })
            .addCase(createCaracteristiqueTypeBien.pending, (state) => {
                state.loading = true;
                state.error = null; // Réinitialiser l'erreur
            })
            .addCase(createCaracteristiqueTypeBien.fulfilled, (state, action) => {
                state.loading = false;
                // state.caracteristiques.push(action.payload); // Ajouter la nouvelle caractéristique à l'état
            })
            .addCase(createCaracteristiqueTypeBien.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message; // Enregistrer l'erreur
            })
            .addCase(updateCaracteristiqueTypeBien.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCaracteristiqueTypeBien.fulfilled, (state, action) => {
                state.loading = false;
                // Mettez à jour l'état avec les nouvelles données
                // state.data = action.payload; // Mettez à jour avec la réponse de l'API
            })
            .addCase(updateCaracteristiqueTypeBien.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addEntite.pending, (state) => {
                state.loading = true; // Indique que l'ajout est en cours
            })
            .addCase(addEntite.fulfilled, (state, action) => {
                const newentite = {id: action.payload.id, ...action.payload};
                // state.buttonModels.push(newentite); // Ajoute le nouveau entite à la liste
                //   state.justAddedentite = newentite
                state.loading = false; // L'ajout est terminé
            })
            .addCase(addEntite.rejected, (state, action) => {
                state.loading = false; // L'ajout a échoué
                state.error = action.error.message; // Enregistre l'erreur
            })
            .addCase(updateEntite.fulfilled, (state, action) => {
                const index = state.buttonModels.findIndex(entite => entite.id === action.payload.id);
                if (index !== -1) {
                    state.buttonModels[index] = action.payload; // Mettez à jour le entite dans l'état
                    // state.model = action.payload;
                }
            })
            .addCase(updateEntite.rejected, (state, action) => {
                console.error(action.error.message); // Gérer l'erreur si nécessaire
            })
            .addCase(updateentite.fulfilled, (state, action) => {
                const index = state.typeEntites.findIndex(entite => entite.id === action.payload.id);
                if (index !== -1) {
                    state.typeEntites[index] = action.payload; // Mettez à jour le entite dans l'état
                }
            })
            .addCase(addOuvrage.pending, (state) => {
                state.loading = true; // Indique que l'ajout est en cours
                state.error = null; // Réinitialise l'erreur
            })
            .addCase(addOuvrage.fulfilled, (state, action) => {
                const {entiteId, ouvrage} = action.payload;
                const entite = state.typeEntites.find((entite) => entite.id === entiteId);
                if (entite) {
                    entite.ouvrages = entite.ouvrages ? [...entite.ouvrages, ouvrage] : [ouvrage]; // Ajoute l'ouvrage
                }
                state.loading = false; // L'ajout est terminé
            })
            .addCase(addOuvrage.rejected, (state, action) => {
                state.loading = false; // L'ajout a échoué
                state.error = action.error.message; // Capturez l'erreur
            })
            .addCase(addEquipement.pending, (state) => {
                state.loading = true; // Indique que l'ajout est en cours
                state.error = null; // Réinitialise l'erreur
            })
            .addCase(addEquipement.fulfilled, (state, action) => {
                const {entiteId, ouvrageId, equipement} = action.payload;
                const entite = state.typeEntites.find((entite) => entite.id === entiteId);
                if (entite) {
                    const ouvrage = entite.ouvrages.find((ouvrage) => ouvrage.id === ouvrageId);
                    if (ouvrage) {
                        ouvrage.equipements = ouvrage.equipements ? [...ouvrage.equipements, equipement] : [equipement]; // Ajoute l'équipement
                    }
                }
                state.loading = false; // L'ajout est terminé
            })
            .addCase(addEquipement.rejected, (state, action) => {
                state.loading = false; // L'ajout a échoué
                state.error = action.error.message; // Capturez l'erreur
            })
            .addCase(addEquipementForentitePR.pending, (state) => {
                state.loading = true; // Indique que l'ajout est en cours
                state.error = null; // Réinitialise l'erreur
            })
            .addCase(addEquipementForentitePR.fulfilled, (state, action) => {
                const {entiteId, equipement} = action.payload;
                const entite = state.typeEntites.find((entite) => entite.id === entiteId);
                if (entite) {
                    entite.equipements = entite.equipements ? [...entite.equipements, equipement] : [equipement]; // Ajoute l'équipement
                }
                state.loading = false; // L'ajout est terminé
            })
            .addCase(addEquipementForentitePR.rejected, (state, action) => {
                state.loading = false; // L'ajout a échoué
                state.error = action.error.message; // Capturez l'erreur
            })
            .addCase(addComposant.pending, (state) => {
                state.loading = true; // Indique que l'ajout est en cours
                state.error = null; // Réinitialise l'erreur
            })
            .addCase(addComposant.fulfilled, (state, action) => {
                const {entiteId, ouvrageId, equipementId, composant} = action.payload;
                const entite = state.typeEntites.find((entite) => entite.id === entiteId);
                if (entite) {
                    const ouvrage = entite.ouvrages.find((ouvrage) => ouvrage.id === ouvrageId);
                    if (ouvrage) {
                        const equipement = ouvrage.equipements.find((equipement) => equipement.id === equipementId);
                        if (equipement) {
                            equipement.composants = equipement.composants ? [...equipement.composants, composant] : [composant]; // Ajoute le composant
                        }
                    }
                }
                state.loading = false; // L'ajout est terminé
            })
            .addCase(addComposant.rejected, (state, action) => {
                state.loading = false; // L'ajout a échoué
                state.error = action.error.message; // Capturez l'erreur
            })
            .addCase(addComposantForentitePR.pending, (state) => {
                state.loading = true; // Indique que l'ajout est en cours
                state.error = null; // Réinitialise l'erreur
            })
            .addCase(addComposantForentitePR.fulfilled, (state, action) => {
                const {entiteId, equipementId, composant} = action.payload;
                const entite = state.typeEntites.find((entite) => entite.id === entiteId);
                if (entite) {
                    const equipement = entite.equipements.find((equipement) => equipement.id === equipementId);
                    if (equipement) {
                        equipement.composants = equipement.composants ? [...equipement.composants, composant] : [composant]; // Ajoute le composant
                    }
                }
                state.loading = false; // L'ajout est terminé
            })
            .addCase(addComposantForentitePR.rejected, (state, action) => {
                state.loading = false; // L'ajout a échoué
                state.error = action.error.message; // Capturez l'erreur
            })
            .addCase(deleteOuvrage.pending, (state) => {
                state.loading = true; // Indique que la suppression est en cours
                state.error = null; // Réinitialise l'erreur
            })
            .addCase(deleteOuvrage.fulfilled, (state, action) => {
                const {entiteId, ouvrageId} = action.payload;
                const entite = state.typeEntites.find((entite) => entite.id === entiteId);
                if (entite) {
                    entite.ouvrages = entite.ouvrages.filter((ouvrage) => ouvrage.id !== ouvrageId); // Supprime l'ouvrage
                }
                state.loading = false; // La suppression est terminée
            })
            .addCase(deleteOuvrage.rejected, (state, action) => {
                state.loading = false; // La suppression a échoué
                state.error = action.error.message; // Capturez l'erreur
            })
            .addCase(deleteEquipement.pending, (state) => {
                state.loading = true; // Indique que la suppression est en cours
                state.error = null; // Réinitialise l'erreur
            })
            .addCase(deleteEquipement.fulfilled, (state, action) => {
                const {entiteId, ouvrageId, equipementId} = action.payload;
                const entite = state.typeEntites.find((entite) => entite.id === entiteId);
                if (entite) {
                    const ouvrage = entite.ouvrages.find((ouvrage) => ouvrage.id === ouvrageId);
                    if (ouvrage) {
                        ouvrage.equipements = ouvrage.equipements.filter((equipement) => equipement.id !== equipementId); // Supprime l'équipement
                    }
                }
                state.loading = false; // La suppression est terminée
            })
            .addCase(deleteEquipement.rejected, (state, action) => {
                state.loading = false; // La suppression a échoué
                state.error = action.error.message; // Capturez l'erreur
            })
            .addCase(deleteEquipementForentitePR.pending, (state) => {
                state.loading = true; // Indique que la suppression est en cours
                state.error = null; // Réinitialise l'erreur
            })
            .addCase(deleteEquipementForentitePR.fulfilled, (state, action) => {
                const {entiteId, equipementId} = action.payload;
                const entite = state.typeEntites.find((entite) => entite.id === entiteId);
                if (entite) {
                    entite.equipements = entite.equipements.filter((equipement) => equipement.id !== equipementId); // Supprime l'équipement
                }
                state.loading = false; // La suppression est terminée
            })
            .addCase(deleteEquipementForentitePR.rejected, (state, action) => {
                state.loading = false; // La suppression a échoué
                state.error = action.error.message; // Capturez l'erreur
            })
            .addCase(deleteComposant.pending, (state) => {
                state.loading = true; // Indique que la suppression est en cours
                state.error = null; // Réinitialise l'erreur
            })
            .addCase(deleteComposant.fulfilled, (state, action) => {
                const {entiteId, ouvrageId, equipementId, composantId} = action.payload;
                const entite = state.typeEntites.find((entite) => entite.id === entiteId);
                if (entite) {
                    const ouvrage = entite.ouvrages.find((ouvrage) => ouvrage.id === ouvrageId);
                    if (ouvrage) {
                        const equipement = ouvrage.equipements.find((equipement) => equipement.id === equipementId);
                        if (equipement) {
                            equipement.composants = equipement.composants.filter((composant) => composant.id !== composantId); // Supprime le composant
                        }
                    }
                }
                state.loading = false; // La suppression est terminée
            })
            .addCase(deleteComposant.rejected, (state, action) => {
                state.loading = false; // La suppression a échoué
                state.error = action.error.message; // Capturez l'erreur
            })
            .addCase(deleteComposantForentitePR.pending, (state) => {
                state.loading = true; // Indique que la suppression est en cours
                state.error = null; // Réinitialise l'erreur
            })
            .addCase(deleteComposantForentitePR.fulfilled, (state, action) => {
                const {entiteId, equipementId, composantId} = action.payload;
                const entite = state.typeEntites.find((entite) => entite.id === entiteId);
                if (entite) {
                    const equipement = entite.equipements.find((equipement) => equipement.id === equipementId);
                    if (equipement) {
                        equipement.composants = equipement.composants.filter((composant) => composant.id !== composantId); // Supprime le composant
                    }
                }
                state.loading = false; // La suppression est terminée
            })
            .addCase(deleteComposantForentitePR.rejected, (state, action) => {
                state.loading = false; // La suppression a échoué
                state.error = action.error.message; // Capturez l'erreur
            })
            .addCase(updateOrder.pending, (state) => {
                state.loading = true; // Indique que la mise à jour est en cours
                state.error = null; // Réinitialise l'erreur
            })
            .addCase(updateOrder.fulfilled, (state, action) => {
                const {parentId, newOrder} = action.payload;
                const entite = state.typeEntites.find((entite) => entite.id === parentId);
                if (entite) {
                    entite.ouvrages = newOrder; // Mettez à jour les ouvrages
                } else {
                    const ouvrage = state.typeEntites.flatMap((entite) => entite.ouvrages).find((ouvrage) => ouvrage.id === parentId);
                    if (ouvrage) {
                        ouvrage.equipements = newOrder; // Mettez à jour les équipements
                    } else {
                        const equipement = state.typeEntites.flatMap((entite) => entite.ouvrages.flatMap((ouvrage) => ouvrage.equipements)).find((equipement) => equipement.id === parentId);
                        if (equipement) {
                            equipement.composants = newOrder; // Mettez à jour les composants
                        }
                    }
                }
                state.loading = false; // La mise à jour est terminée
            })
            .addCase(updateOrder.rejected, (state, action) => {
                state.loading = false; // La mise à jour a échoué
                state.error = action.error.message; // Capturez l'erreur
            })
            .addCase(updateOrderForentitePR.pending, (state) => {
                state.loading = true; // Indique que la mise à jour est en cours
                state.error = null; // Réinitialise l'erreur
            })
            .addCase(updateOrderForentitePR.fulfilled, (state, action) => {
                const {parentId, newOrder} = action.payload;
                const entite = state.typeEntites.find((entite) => entite.id === parentId);
                if (entite) {
                    entite.equipements = newOrder; // Mettez à jour les équipements
                } else {
                    const equipement = state.typeEntites.flatMap((entite) => entite.equipements).find((equipement) => equipement.id === parentId);
                    if (equipement) {
                        equipement.composants = newOrder; // Mettez à jour les composants
                    }
                }
                state.loading = false; // La mise à jour est terminée
            })
            .addCase(updateOrderForentitePR.rejected, (state, action) => {
                state.loading = false; // La mise à jour a échoué
                state.error = action.error.message; // Capturez l'erreur
            })
            .addCase(toggleShow.fulfilled, (state, action) => {
                const {entiteId, itemId} = action.payload;
                const entite = state.typeEntites.find((entite) => entite.id === entiteId);
                if (entite) {
                    const ouvrage = entite.ouvrages.find((ouvrage) => ouvrage.id === itemId);
                    if (ouvrage) {
                        ouvrage.show = !ouvrage.show;
                    } else {
                        for (const ouvrage of entite.ouvrages) {
                            if (ouvrage.equipements) {
                                const equipement = ouvrage.equipements.find((equipement) => equipement.id === itemId);
                                if (equipement) {
                                    equipement.show = !equipement.show;
                                    break;
                                }
                            }
                        }
                    }
                } else {
                    console.warn(`Aucun entite trouvé avec l'ID ${entiteId}`);
                }
            })
            .addCase(toggleShowForentitePR.fulfilled, (state, action) => {
                const {entiteId, itemId} = action.payload;
                const entite = state.typeEntites.find((entite) => entite.id === entiteId);
                if (entite) {
                    const equipement = entite.equipements.find((equipement) => equipement.id === itemId);
                    if (equipement) {
                        equipement.show = !equipement.show;
                    }
                } else {
                    console.warn(`Aucun entite trouvé avec l'ID ${entiteId}`);
                }
            })
            .addCase(toggleShow.pending, (state) => {
                state.loading = true; // Indique que l'opération est en cours
            })
            .addCase(toggleShow.rejected, (state, action) => {
                state.loading = false; // Réinitialise l'état de chargement
                state.error = action.error.message; // Capture l'erreur
            })
            .addCase(toggleShowForentitePR.pending, (state) => {
                state.loading = true; // Indique que l'opération est en cours
            })
            .addCase(toggleShowForentitePR.rejected, (state, action) => {
                state.loading = false; // Réinitialise l'état de chargement
                state.error = action.error.message; // Capture l'erreur
            })
            .addCase(deleteEntite.pending, (state) => {
                state.loading = true; // Set loading state
            })
            .addCase(deleteEntite.fulfilled, (state, action) => {
                state.loading = false; // Reset loading state
                state.buttonModels = state.buttonModels.filter(entite => entite.id !== action.payload); // Remove the deleted entite from the state
            })
            .addCase(deleteEntite.rejected, (state, action) => {
                state.loading = false; // Reset loading state
                state.error = action.error.message; // Capture error message
            })
            .addCase(fetchentiteById.pending, (state) => {
                state.loading = true; // Set loading state
            })
            .addCase(fetchentiteById.fulfilled, (state, action) => {
                state.loading = false; // Réinitialiser l'état de chargement
                // state.typeEntites = [action.payload.arbo]; // Stocker le entite récupéré dans un tableau
                state.typeEntites = [action.payload]; // Stocker le entite récupéré dans un tableau
            })
            .addCase(fetchentiteById.rejected, (state, action) => {
                state.loading = false; // Reset loading state
                state.error = action.error.message; // Capture error message
            });
    },
});

// Export des actions
export const {
    setEntity,
    setCaracteristiquesForEntite,
    addAvailableItem,
    updateButtonentiteItems,
    removeAvailableItem,
    addCaracteristiqueToEntite,
    removeCaracteristiqueFromEntite,
    setPersistanceUpdated,
    setWaitingPath
} = modelSetterSlice.actions;

// Export du reducer
export default modelSetterSlice.reducer;