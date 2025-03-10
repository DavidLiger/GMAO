import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

// const API_URL = 'http://localhost:8080/api/arbo_entite_type'; // Remplacez par l'URL correcte
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const BIEN_API_URL = `${BASE_URL}/api/bien`;
const SITE_API_URL = `${BASE_URL}/api/site`;


const initialState = {
    sites: [], // Initialisez avec null ou un objet vide
    tree: [],
    ouvrages: [],
    equipements: [],
    composants: [],
    loading: false,
    error: null
};

export const fetchSites = createAsyncThunk('action/fetchSites', async ({token}) => {
    const response = await fetch(`${SITE_API_URL}`, {
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

export const fetchTree = createAsyncThunk('action/fetchTree', async ({entityId, token}) => {
    const response = await fetch(`${BIEN_API_URL}/tree/${entityId}`, {
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

const actionSlice = createSlice({
    name: 'action',
    initialState,
    reducers: {
        setButtonentites: (state, action) => {
            state.buttonModels = action.payload; // Mettez à jour les typeEntites des boutons
        },
        setEntity: (state, action) => {
            state.model = action.payload;
        }
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
                state.sites = filteredEntities; // Mettez à jour l'état des boutons
            })
            .addCase(fetchSites.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchTree.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchTree.fulfilled, (state, action) => {
                state.loading = false;
                // Mettez à jour les typeEntites des boutons
                const filteredEntities = action.payload.map(entity => ({
                    id: entity.id,
                    nom: entity.nom,
                    nature: entity.nature,
                    children: entity.children
                }));
                state.tree = filteredEntities; // Mettez à jour l'état des boutons
            })
            .addCase(fetchTree.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            
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
} = actionSlice.actions;

// Export du reducer
export default actionSlice.reducer;