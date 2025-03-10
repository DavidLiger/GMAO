import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

// const API_URL = 'http://localhost:8080/api/arbo_site_type'; // Remplacez par l'URL correcte
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const API_URL = `${BASE_URL}/api/arbositetype`;
const TYPE_BIEN_API_URL = `${BASE_URL}/api/typebien`;

const initialState = {
    sites: [], // Initialisez avec null ou un objet vide
    buttonSites: [],
    loading: false,
    error: null,
};

// Fetch sites from the API
export const fetchSites = createAsyncThunk('sites/fetchSites', async ({token}) => {
    const response = await fetch(`${TYPE_BIEN_API_URL}/nature/site`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`, // Déplacez Authorization ici
        },
    });

    if (!response.ok) {
        throw new Error('Échec de la récupération des sites');
    }

    return await response.json(); // Assuming the response is in JSON format
});

// Fetch ouvrages from the API
export const fetchOuvrages = createAsyncThunk('sites/fetchOuvrages', async ({token}) => {
    const response = await fetch(`${TYPE_BIEN_API_URL}/nature/ouvrage`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`, // Déplacez Authorization ici
        },
    });

    if (!response.ok) {
        throw new Error('Échec de la récupération des sites');
    }

    return await response.json(); // Assuming the response is in JSON format
});

// Fetch equipements from the API
export const fetchEquipements = createAsyncThunk('sites/fetchEquipements', async ({token}) => {
    const response = await fetch(`${TYPE_BIEN_API_URL}/nature/equipement`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`, // Déplacez Authorization ici
        },
    });

    if (!response.ok) {
        throw new Error('Échec de la récupération des sites');
    }

    return await response.json(); // Assuming the response is in JSON format
});

// Fetch composants from the API
export const fetchComposants = createAsyncThunk('sites/fetchComposants', async ({token}) => {
    const response = await fetch(`${TYPE_BIEN_API_URL}/nature/composant`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`, // Déplacez Authorization ici
        },
    });

    if (!response.ok) {
        throw new Error('Échec de la récupération des sites');
    }

    return await response.json(); // Assuming the response is in JSON format
});

// Add a new site to the API
export const addSite = createAsyncThunk('sites/addSite', async ({site, token}) => {
    console.log(token); // Cela devrait maintenant afficher le token correctement
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Déplacez Authorization ici
        },
        body: JSON.stringify(site),
    });
    if (!response.ok) {
        throw new Error('Échec de l\'ajout du site');
    }
    return await response.json(); // Retourne le site ajouté
});

// Update a site in the database
export const updateSite = createAsyncThunk('sites/updateSite', async ({site, token}) => {
    const response = await fetch(`${TYPE_BIEN_API_URL}/${site.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Déplacez Authorization ici
        },
        body: JSON.stringify(site),
    });
    return await response.json(); // Return the updated site
});

// Delete a site from the API
export const deleteSite = createAsyncThunk('sites/deleteSite', async ({site, token}) => {
    const response = await fetch(`${API_URL}/${site}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Déplacez Authorization ici
        },
    });

    if (!response.ok) {
        throw new Error('Failed to delete the site'); // Handle error
    }
    return site; // Return the ID of the deleted site
});

// Fetch a site by ID from the API
export const fetchSiteById = createAsyncThunk('sites/fetchById', async ({site, token}) => {
    // console.log(token);

    const response = await fetch(`${TYPE_BIEN_API_URL}/getOne/${site}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Déplacez Authorization ici
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch the site'); // Handle error
    }

    return await response.json(); // Return the site data
});

export const addOuvrage = createAsyncThunk(
    'sites/addOuvrage',
    async ({siteId, ouvrage}, {getState}) => {
        // retourner les données
        return {siteId, ouvrage: {id: ouvrage.id, ...ouvrage, show: true}};
    }
);

export const addEquipement = createAsyncThunk(
    'sites/addEquipement',
    async ({siteId, ouvrageId, equipement}, {getState}) => {
        // retourner les données
        return {siteId, ouvrageId, equipement: {id: equipement.id, ...equipement, show: true}};
    }
);

export const addEquipementForSitePR = createAsyncThunk(
    'sites/addEquipementForSitePR',
    async ({siteId, equipement}, {getState}) => {
        // retourner les données
        return {siteId, equipement: {id: equipement.id, ...equipement, show: true}};
    }
);

export const addComposant = createAsyncThunk(
    'sites/addComposant',
    async ({siteId, ouvrageId, equipementId, composant}, {getState}) => {
        // retourner les données
        return {siteId, ouvrageId, equipementId, composant: {id: composant.id, ...composant, show: true}};
    }
);

export const addComposantForSitePR = createAsyncThunk(
    'sites/addComposantForSitePR',
    async ({siteId, equipementId, composant}, {getState}) => {
        // retourner les données
        return {siteId, equipementId, composant: {id: composant.id, ...composant, show: true}};
    }
);

export const deleteOuvrage = createAsyncThunk(
    'sites/deleteOuvrage',
    async ({siteId, ouvrageId}, {getState}) => {
        // retourner les identifiants
        return {siteId, ouvrageId};
    }
);

export const deleteEquipement = createAsyncThunk(
    'sites/deleteEquipement',
    async ({siteId, ouvrageId, equipementId}, {getState}) => {
        // retourner les identifiants
        return {siteId, ouvrageId, equipementId};
    }
);

export const deleteEquipementForSitePR = createAsyncThunk(
    'sites/deleteEquipementForSitePR',
    async ({siteId, equipementId}, {getState}) => {
        // retourner les identifiants
        return {siteId, equipementId};
    }
);

export const deleteComposant = createAsyncThunk(
    'sites/deleteComposant',
    async ({siteId, ouvrageId, equipementId, composantId}, {getState}) => {
        // retourner les identifiants
        return {siteId, ouvrageId, equipementId, composantId};
    }
);

export const deleteComposantForSitePR = createAsyncThunk(
    'sites/deleteComposantForSitePR',
    async ({siteId, equipementId, composantId}, {getState}) => {
        // retourner les identifiants
        return {siteId, equipementId, composantId};
    }
);

export const updateOrder = createAsyncThunk(
    'sites/updateOrder',
    async ({parentId, newOrder}, {getState}) => {
        // retourner les données
        return {parentId, newOrder};
    }
);

export const updateOrderForSitePR = createAsyncThunk(
    'sites/updateOrderForSitePR',
    async ({parentId, newOrder}, {getState}) => {
        // Retournez les données pour la mise à jour
        return {parentId, newOrder};
    }
);

export const toggleShow = createAsyncThunk(
    'sites/toggleShow',
    async ({siteId, itemId}) => {
        // Logique pour inverser l'état d'affichage (peut-être une API)
        return {siteId, itemId}; // Retournez les données nécessaires
    }
);

export const toggleShowForSitePR = createAsyncThunk(
    'sites/toggleShowForSitePR',
    async ({siteId, itemId}) => {
        // Logique pour inverser l'état d'affichage (peut-être une API)
        return {siteId, itemId}; // Retournez les données nécessaires
    }
);

const siteSlice = createSlice({
    name: 'sites',
    initialState,
    reducers: {
        setButtonSites: (state, action) => {
            state.buttonSites = action.payload; // Mettez à jour les sites des boutons
        },
        setSite: (state, action) => {
            state.sites = action.payload.arbo; // Remplacez l'état par le nouveau site
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSites.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchSites.fulfilled, (state, action) => {
                state.loading = false;
                // Mettez à jour les sites des boutons
                state.buttonSites = action.payload.map(site => ({
                    id: site.id,
                    nom: site.nom,
                    arbo: site.arbo
                })); // Mettez à jour l'état des boutons
            })
            .addCase(fetchSites.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addSite.pending, (state) => {
                state.loading = true; // Indique que l'ajout est en cours
                state.error = null; // Réinitialise l'erreur
            })
            .addCase(addSite.fulfilled, (state, action) => {
                const newSite = {id: action.payload.id, ...action.payload};
                state.loading = false; // L'ajout est terminé
            })
            .addCase(addSite.rejected, (state, action) => {
                state.loading = false; // L'ajout a échoué
                state.error = action.error.message; // Capturez l'erreur
            })
            .addCase(updateSite.fulfilled, (state, action) => {
                const index = state.sites.findIndex(site => site.id === action.payload.id);
                if (index !== -1) {
                    state.sites[index] = action.payload; // Mettez à jour le site dans l'état
                }
            })
            .addCase(addOuvrage.pending, (state) => {
                state.loading = true; // Indique que l'ajout est en cours
                state.error = null; // Réinitialise l'erreur
            })
            .addCase(addOuvrage.fulfilled, (state, action) => {
                const {siteId, ouvrage} = action.payload;
                const site = state.sites.find((site) => site.id === siteId);
                if (site) {
                    site.ouvrages = site.ouvrages ? [...site.ouvrages, ouvrage] : [ouvrage]; // Ajoute l'ouvrage
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
                const {siteId, ouvrageId, equipement} = action.payload;
                const site = state.sites.find((site) => site.id === siteId);
                if (site) {
                    const ouvrage = site.ouvrages.find((ouvrage) => ouvrage.id === ouvrageId);
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
            .addCase(addEquipementForSitePR.pending, (state) => {
                state.loading = true; // Indique que l'ajout est en cours
                state.error = null; // Réinitialise l'erreur
            })
            .addCase(addEquipementForSitePR.fulfilled, (state, action) => {
                const {siteId, equipement} = action.payload;
                const site = state.sites.find((site) => site.id === siteId);
                if (site) {
                    site.equipements = site.equipements ? [...site.equipements, equipement] : [equipement]; // Ajoute l'équipement
                }
                state.loading = false; // L'ajout est terminé
            })
            .addCase(addEquipementForSitePR.rejected, (state, action) => {
                state.loading = false; // L'ajout a échoué
                state.error = action.error.message; // Capturez l'erreur
            })
            .addCase(addComposant.pending, (state) => {
                state.loading = true; // Indique que l'ajout est en cours
                state.error = null; // Réinitialise l'erreur
            })
            .addCase(addComposant.fulfilled, (state, action) => {
                const {siteId, ouvrageId, equipementId, composant} = action.payload;
                const site = state.sites.find((site) => site.id === siteId);
                if (site) {
                    const ouvrage = site.ouvrages.find((ouvrage) => ouvrage.id === ouvrageId);
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
            .addCase(addComposantForSitePR.pending, (state) => {
                state.loading = true; // Indique que l'ajout est en cours
                state.error = null; // Réinitialise l'erreur
            })
            .addCase(addComposantForSitePR.fulfilled, (state, action) => {
                const {siteId, equipementId, composant} = action.payload;
                const site = state.sites.find((site) => site.id === siteId);
                if (site) {
                    const equipement = site.equipements.find((equipement) => equipement.id === equipementId);
                    if (equipement) {
                        equipement.composants = equipement.composants ? [...equipement.composants, composant] : [composant]; // Ajoute le composant
                    }
                }
                state.loading = false; // L'ajout est terminé
            })
            .addCase(addComposantForSitePR.rejected, (state, action) => {
                state.loading = false; // L'ajout a échoué
                state.error = action.error.message; // Capturez l'erreur
            })
            .addCase(deleteOuvrage.pending, (state) => {
                state.loading = true; // Indique que la suppression est en cours
                state.error = null; // Réinitialise l'erreur
            })
            .addCase(deleteOuvrage.fulfilled, (state, action) => {
                const {siteId, ouvrageId} = action.payload;
                const site = state.sites.find((site) => site.id === siteId);
                if (site) {
                    site.ouvrages = site.ouvrages.filter((ouvrage) => ouvrage.id !== ouvrageId); // Supprime l'ouvrage
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
                const {siteId, ouvrageId, equipementId} = action.payload;
                const site = state.sites.find((site) => site.id === siteId);
                if (site) {
                    const ouvrage = site.ouvrages.find((ouvrage) => ouvrage.id === ouvrageId);
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
            .addCase(deleteEquipementForSitePR.pending, (state) => {
                state.loading = true; // Indique que la suppression est en cours
                state.error = null; // Réinitialise l'erreur
            })
            .addCase(deleteEquipementForSitePR.fulfilled, (state, action) => {
                const {siteId, equipementId} = action.payload;
                const site = state.sites.find((site) => site.id === siteId);
                if (site) {
                    site.equipements = site.equipements.filter((equipement) => equipement.id !== equipementId); // Supprime l'équipement
                }
                state.loading = false; // La suppression est terminée
            })
            .addCase(deleteEquipementForSitePR.rejected, (state, action) => {
                state.loading = false; // La suppression a échoué
                state.error = action.error.message; // Capturez l'erreur
            })
            .addCase(deleteComposant.pending, (state) => {
                state.loading = true; // Indique que la suppression est en cours
                state.error = null; // Réinitialise l'erreur
            })
            .addCase(deleteComposant.fulfilled, (state, action) => {
                const {siteId, ouvrageId, equipementId, composantId} = action.payload;
                const site = state.sites.find((site) => site.id === siteId);
                if (site) {
                    const ouvrage = site.ouvrages.find((ouvrage) => ouvrage.id === ouvrageId);
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
            .addCase(deleteComposantForSitePR.pending, (state) => {
                state.loading = true; // Indique que la suppression est en cours
                state.error = null; // Réinitialise l'erreur
            })
            .addCase(deleteComposantForSitePR.fulfilled, (state, action) => {
                const {siteId, equipementId, composantId} = action.payload;
                const site = state.sites.find((site) => site.id === siteId);
                if (site) {
                    const equipement = site.equipements.find((equipement) => equipement.id === equipementId);
                    if (equipement) {
                        equipement.composants = equipement.composants.filter((composant) => composant.id !== composantId); // Supprime le composant
                    }
                }
                state.loading = false; // La suppression est terminée
            })
            .addCase(deleteComposantForSitePR.rejected, (state, action) => {
                state.loading = false; // La suppression a échoué
                state.error = action.error.message; // Capturez l'erreur
            })
            .addCase(updateOrder.pending, (state) => {
                state.loading = true; // Indique que la mise à jour est en cours
                state.error = null; // Réinitialise l'erreur
            })
            .addCase(updateOrder.fulfilled, (state, action) => {
                const {parentId, newOrder} = action.payload;
                // Accéder directement au site
                const site = state.sites[0]; // Il n'y a qu'un seul site

                // Vérifiez si le parentId correspond à l'ID du site
                if (site.id === parentId) {
                    console.log(`Site trouvé : ${site.id}`);
                    site.ouvrages = newOrder; // Mettez à jour les ouvrages
                    state.loading = false; // La mise à jour a échoué
                } else {
                    // Vérifiez si le parentId correspond à un ouvrage
                    const ouvrageIndex = site.ouvrages.findIndex(ouvrage => ouvrage.id === parentId);
                    if (ouvrageIndex !== -1) {
                        console.log(`Ouvrage trouvé : ${site.ouvrages[ouvrageIndex].id}`);
                        site.ouvrages[ouvrageIndex].equipements = newOrder; // Mettez à jour les équipements
                        state.loading = false; // La mise à jour a échoué
                    } else {
                        // Vérifiez si le parentId correspond à un équipement
                        for (let ouvrage of site.ouvrages) {
                            const equipementIndex = ouvrage.equipements.findIndex(equipement => equipement.id === parentId);
                            if (equipementIndex !== -1) {
                                console.log(`Équipement trouvé : ${ouvrage.equipements[equipementIndex].id}`);
                                ouvrage.equipements[equipementIndex].composants = newOrder; // Mettez à jour les composants
                                state.loading = false; // La mise à jour a échoué
                                return; // Sortir de la fonction une fois que la mise à jour est effectuée
                            }
                        }
                        console.log(`Aucun ouvrage ou équipement trouvé pour parentId : ${parentId}`);
                    }
                }

                state.loading = false; // La mise à jour est terminée
            })
            .addCase(updateOrder.rejected, (state, action) => {
                state.loading = false; // La mise à jour a échoué
                state.error = action.error.message; // Capturez l'erreur
            })
            .addCase(updateOrderForSitePR.pending, (state) => {
                state.loading = true; // Indique que la mise à jour est en cours
                state.error = null; // Réinitialise l'erreur
            })
            .addCase(updateOrderForSitePR.fulfilled, (state, action) => {
                const {parentId, newOrder} = action.payload;
                const site = state.sites.find((site) => site.id === parentId);
                if (site) {
                    site.equipements = newOrder; // Mettez à jour les équipements
                } else {
                    const equipement = state.sites.flatMap((site) => site.equipements).find((equipement) => equipement.id === parentId);
                    if (equipement) {
                        equipement.composants = newOrder; // Mettez à jour les composants
                    }
                }
                state.loading = false; // La mise à jour est terminée
            })
            .addCase(updateOrderForSitePR.rejected, (state, action) => {
                state.loading = false; // La mise à jour a échoué
                state.error = action.error.message; // Capturez l'erreur
            })
            .addCase(toggleShow.fulfilled, (state, action) => {
                const {siteId, itemId} = action.payload;
                const site = state.sites.find((site) => site.id === siteId);
                if (site) {
                    const ouvrage = site.ouvrages.find((ouvrage) => ouvrage.id === itemId);
                    if (ouvrage) {
                        ouvrage.show = !ouvrage.show;
                        state.loading = false; // Réinitialise l'état de chargement
                    } else {
                        for (const ouvrage of site.ouvrages) {
                            if (ouvrage.equipements) {
                                const equipement = ouvrage.equipements.find((equipement) => equipement.id === itemId);
                                if (equipement) {
                                    equipement.show = !equipement.show;
                                    state.loading = false; // Réinitialise l'état de chargement
                                    break;
                                }
                            }
                        }
                    }
                } else {
                    console.warn(`Aucun site trouvé avec l'ID ${siteId}`);
                }
            })
            .addCase(toggleShowForSitePR.fulfilled, (state, action) => {
                const {siteId, itemId} = action.payload;
                const site = state.sites.find((site) => site.id === siteId);
                if (site) {
                    const equipement = site.equipements.find((equipement) => equipement.id === itemId);
                    if (equipement) {
                        equipement.show = !equipement.show;
                    }
                } else {
                    console.warn(`Aucun site trouvé avec l'ID ${siteId}`);
                }
            })
            .addCase(toggleShow.pending, (state) => {
                state.loading = true; // Indique que l'opération est en cours
            })
            .addCase(toggleShow.rejected, (state, action) => {
                state.loading = false; // Réinitialise l'état de chargement
                state.error = action.error.message; // Capture l'erreur
            })
            .addCase(toggleShowForSitePR.pending, (state) => {
                state.loading = true; // Indique que l'opération est en cours
            })
            .addCase(toggleShowForSitePR.rejected, (state, action) => {
                state.loading = false; // Réinitialise l'état de chargement
                state.error = action.error.message; // Capture l'erreur
            })
            .addCase(deleteSite.pending, (state) => {
                state.loading = true; // Set loading state
            })
            .addCase(deleteSite.fulfilled, (state, action) => {
                state.loading = false; // Reset loading state
                state.buttonSites = state.buttonSites.filter(site => site.id !== action.payload); // Remove the deleted site from the state
            })
            .addCase(deleteSite.rejected, (state, action) => {
                state.loading = false; // Reset loading state
                state.error = action.error.message; // Capture error message
            })
            .addCase(fetchSiteById.pending, (state) => {
                state.loading = true; // Set loading state
            })
            .addCase(fetchSiteById.fulfilled, (state, action) => {
                state.sites = [action.payload.arbo]; // Stocker le site récupéré dans un tableau
                state.loading = false; // Réinitialiser l'état de chargement
            })
            .addCase(fetchSiteById.rejected, (state, action) => {
                state.loading = false; // Reset loading state
                state.error = action.error.message; // Capture error message
            });
    },
});

// Export des actions
export const {
    setSite,
} = siteSlice.actions;

// Export du reducer
export default siteSlice.reducer;