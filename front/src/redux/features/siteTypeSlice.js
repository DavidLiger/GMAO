import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// const API_URL = 'http://localhost:8080/api/arbo_site_type'; // Remplacez par l'URL correcte
const API_URL = 'http://api.eperf.local/api/arbositetype';
const TYPE_BIEN_API_URL = 'http://api.eperf.local/api/typebien';
const CARACTERISTIQUE_API_URL = 'http://api.eperf.local/api/caracteristique';
const CARACTERISTIQUE_TYPE_BIEN_API_URL = 'http://api.eperf.local/api/caracteristiqueTypeBien';


const initialState = {
  typeSites: [], // Initialisez avec null ou un objet vide
  buttonSites: [],
  caracteristiques: [],
  justAddedSite: null,
  loading: false,
  error: null,
};

// Fetch typeSites from the API
// export const fetchSites = createAsyncThunk('typeSites/fetchSites', async ({ token }) => {
//   const response = await fetch(TYPE_BIEN_API_URL, {
//     method: 'GET',
//     headers: {
//       Authorization: `Bearer ${token}`, // Déplacez Authorization ici
//     },
//   });

//   if (!response.ok) {
//     throw new Error('Échec de la récupération des typeSites');
//   }

//   return await response.json(); // Assuming the response is in JSON format
// });

export const fetchSites = createAsyncThunk('typeSites/fetchSites', async ({ token }) => {
  const response = await fetch(`${TYPE_BIEN_API_URL}/nature/site`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`, // Déplacez Authorization ici
    },
  });

  if (!response.ok) {
    throw new Error('Échec de la récupération des typeSites');
  }

  return await response.json(); // Assuming the response is in JSON format
});

// Add a new site to the API
export const addSite = createAsyncThunk(
    'typeSites/addSite',
    async ({ site, token }) => {
        const response = await fetch(TYPE_BIEN_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(site),
        });
        if (!response.ok) {
            throw new Error('Échec de l\'ajout du site');
        }
        return await response.json(); // Assuming the response is in JSON format
    }
);

// Fetch typeSites from the API
export const fetchCaracteristiques = createAsyncThunk('typeSites/fetchCaracteristiques', async ({ token }) => {
    const response = await fetch(CARACTERISTIQUE_API_URL, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`, // Déplacez Authorization ici
      },
    });
  
    if (!response.ok) {
      throw new Error('Échec de la récupération des typeSites');
    }
    
    return await response.json(); // Assuming the response is in JSON format
  });

// Fetch caracteristiques by typeBienId from the API
export const fetchCaracteristiquesByTypeBienId = createAsyncThunk(
  'typeSites/fetchCaracteristiquesByTypeBienId',
  async ({ typeBienId, token }) => {
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
  'typeSites/createCaracteristiqueTypeBien',
  async ({ caracteristique,token }) => {
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
  async ({ typeBienId, token }) => {
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

// Update a site in the database
export const updateSite = createAsyncThunk('typeSites/updateSite', async ({site, token }) => {
  const response = await fetch(`${API_URL}/${site.id}`, {
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
export const deleteSite = createAsyncThunk('typeSites/deleteSite', async ({ site, token }) => {
  const response = await fetch(`${TYPE_BIEN_API_URL}/${site}`, {
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
export const fetchSiteById = createAsyncThunk('typeSites/fetchById', async ({ site, token }) => {
  console.log(token);
  
  const response = await fetch(`${TYPE_BIEN_API_URL}/${site}`,{
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
  'typeSites/addOuvrage',
  async ({ siteId, ouvrage }, { getState }) => {
     // retourner les données
    return { siteId, ouvrage: { id: ouvrage.id, ...ouvrage, show: true } };
  }
);

export const addEquipement = createAsyncThunk(
  'typeSites/addEquipement',
  async ({ siteId, ouvrageId, equipement }, { getState }) => {
     // retourner les données
    return { siteId, ouvrageId, equipement: { id: equipement.id, ...equipement, show: true } };
  }
);

export const addEquipementForSitePR = createAsyncThunk(
  'typeSites/addEquipementForSitePR',
  async ({ siteId, equipement }, { getState }) => {
    // retourner les données
    return { siteId, equipement: { id: equipement.id, ...equipement, show: true } };
  }
);

export const addComposant = createAsyncThunk(
  'typeSites/addComposant',
  async ({ siteId, ouvrageId, equipementId, composant }, { getState }) => {
     // retourner les données
    return { siteId, ouvrageId, equipementId, composant: { id: composant.id, ...composant, show: true } };
  }
);

export const addComposantForSitePR = createAsyncThunk(
  'typeSites/addComposantForSitePR',
  async ({ siteId, equipementId, composant }, { getState }) => {
    // retourner les données
    return { siteId, equipementId, composant: { id: composant.id, ...composant, show: true } };
  }
);

export const deleteOuvrage = createAsyncThunk(
  'typeSites/deleteOuvrage',
  async ({ siteId, ouvrageId }, { getState }) => {
    // retourner les identifiants
    return { siteId, ouvrageId };
  }
);

export const deleteEquipement = createAsyncThunk(
  'typeSites/deleteEquipement',
  async ({ siteId, ouvrageId, equipementId }, { getState }) => {
    // retourner les identifiants
    return { siteId, ouvrageId, equipementId };
  }
);

export const deleteEquipementForSitePR = createAsyncThunk(
  'typeSites/deleteEquipementForSitePR',
  async ({ siteId, equipementId }, { getState }) => {
    // retourner les identifiants
    return { siteId, equipementId };
  }
);

export const deleteComposant = createAsyncThunk(
  'typeSites/deleteComposant',
  async ({ siteId, ouvrageId, equipementId, composantId }, { getState }) => {
    // retourner les identifiants
    return { siteId, ouvrageId, equipementId, composantId };
  }
);

export const deleteComposantForSitePR = createAsyncThunk(
  'typeSites/deleteComposantForSitePR',
  async ({ siteId, equipementId, composantId }, { getState }) => {
    // retourner les identifiants
    return { siteId, equipementId, composantId };
  }
);

export const updateOrder = createAsyncThunk(
  'typeSites/updateOrder',
  async ({ parentId, newOrder }, { getState }) => {
    // retourner les données
    return { parentId, newOrder };
  }
);

export const updateOrderForSitePR = createAsyncThunk(
  'typeSites/updateOrderForSitePR',
  async ({ parentId, newOrder }, { getState }) => {
    // Retournez les données pour la mise à jour
    return { parentId, newOrder };
  }
);

export const toggleShow = createAsyncThunk(
  'typeSites/toggleShow',
  async ({ siteId, itemId }) => {
    // Logique pour inverser l'état d'affichage (peut-être une API)
    return { siteId, itemId }; // Retournez les données nécessaires
  }
);

export const toggleShowForSitePR = createAsyncThunk(
  'typeSites/toggleShowForSitePR',
  async ({ siteId, itemId }) => {
    // Logique pour inverser l'état d'affichage (peut-être une API)
    return { siteId, itemId }; // Retournez les données nécessaires
  }
);

const siteTypeSlice = createSlice({
  name: 'typeSites',
  initialState,
  reducers: {
    setButtonSites: (state, action) => {
      state.buttonSites = action.payload; // Mettez à jour les typeSites des boutons
    },
    setSite: (state, action) => {
      state.typeSites = action.payload;
    },
    addAvailableItem: (state, action) => {
      const { siteId, item } = action.payload; // Assurez-vous d'extraire item correctement
      const buttonSite = state.buttonSites.find(site => site.id === siteId);
      if (buttonSite) {
        buttonSite.items.push(item); // Ajoutez l'item au tableau items
      }
    },
    updateButtonSiteItems: (state, action) => {
      const { siteId, items } = action.payload;
      const buttonSite = state.buttonSites.find(site => site.id === siteId);
      if (buttonSite) {
        buttonSite.items = items; // Mettez à jour les items du buttonSite
      }
    },
    setCaracteristiquesForSite: (state, action) => {
      const { siteId, caracteristiques } = action.payload;
      const site = state.buttonSites.find(s => s.id === siteId);
      if (site) {
        site.caracteristiques = caracteristiques; // Ajoutez les caractéristiques au site
      }
    },
    addCaracteristiqueToSite: (state, action) => {
      const { siteId, caracteristique } = action.payload;
      const site = state.buttonSites.find(site => site.id === siteId);
      if (site) {
          // Assurez-vous que caracteristiques est un tableau
          site.caracteristiques = site.caracteristiques || []; 
          
          // Vérifier si la caractéristique existe déjà
          const caracteristiqueExists = site.caracteristiques.some(car => car.caracteristique.id === caracteristique.caracteristique.id);
          
          if (!caracteristiqueExists) {
              // Ajoutez la caractéristique à la liste des caractéristiques du site
              site.caracteristiques.push(caracteristique);
          } else {
              console.log("La caractéristique existe déjà dans le site, aucune action effectuée.");
          }
      }
    },
    removeCaracteristiqueFromSite: (state, action) => {
      const { siteId, caracteristiqueId } = action.payload;

      // Trouver le site correspondant
      const site = state.buttonSites.find(site => site.id === siteId);
      if (site && site.caracteristiques) {
          // Filtrer les caractéristiques pour exclure celle à supprimer
          site.caracteristiques = site.caracteristiques.filter(car => car.caracteristique.id !== caracteristiqueId);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSites.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSites.fulfilled, (state, action) => {
        state.loading = false;
        // Mettez à jour les typeSites des boutons
        const filteredSites = action.payload.map(site => ({
          id: site.id,
          nature: site.nature,
          nom: site.nom,
          arbo: site.arbo
        }));
        state.buttonSites = filteredSites; // Mettez à jour l'état des boutons
      })
      .addCase(fetchSites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchCaracteristiques.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCaracteristiques.fulfilled, (state, action) => {
        state.loading = false;
        // Mettez à jour les typeSites des boutons
        const filteredCaracteristiques = action.payload.map(caracteristique => ({
          id: caracteristique.id,
          societe: caracteristique.societe,
          nom: caracteristique.nom,
          listeValeurs: caracteristique.listeValeurs,
          typeChamp: caracteristique.typeChamp,
          Unite: caracteristique.Unite,
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
        const { typeBienId, caracteristiques } = action.payload; // Assurez-vous que l'API renvoie le typeBienId
        state.caracteristiques = caracteristiques; // Mettez à jour l'état avec les caractéristiques récupérées
        // Mettez à jour les caractéristiques pour le site correspondant
        state.buttonSites.forEach(site => {
          if (site.typeBienId === typeBienId) {
            site.caracteristiques = caracteristiques; // Ajoutez les caractéristiques au site
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
      .addCase(addSite.pending, (state) => {
        state.loading = true; // Indique que l'ajout est en cours
      })
      .addCase(addSite.fulfilled, (state, action) => {
          const newSite = { id: action.payload.id, ...action.payload };
          // state.buttonSites.push(newSite); // Ajoute le nouveau site à la liste
          state.justAddedSite = newSite
          state.loading = false; // L'ajout est terminé
      })
      .addCase(addSite.rejected, (state, action) => {
          state.loading = false; // L'ajout a échoué
          state.error = action.error.message; // Enregistre l'erreur
      })
      .addCase(updateSite.fulfilled, (state, action) => {
        const index = state.typeSites.findIndex(site => site.id === action.payload.id);
        if (index !== -1) {
          state.typeSites[index] = action.payload; // Mettez à jour le site dans l'état
        }
      })
      .addCase(addOuvrage.pending, (state) => {
        state.loading = true; // Indique que l'ajout est en cours
        state.error = null; // Réinitialise l'erreur
      })
      .addCase(addOuvrage.fulfilled, (state, action) => {
        const { siteId, ouvrage } = action.payload;
        const site = state.typeSites.find((site) => site.id === siteId);
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
        const { siteId, ouvrageId, equipement } = action.payload;
        const site = state.typeSites.find((site) => site.id === siteId);
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
        const { siteId, equipement } = action.payload;
        const site = state.typeSites.find((site) => site.id === siteId);
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
        const { siteId, ouvrageId, equipementId, composant } = action.payload;
        const site = state.typeSites.find((site) => site.id === siteId);
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
        const { siteId, equipementId, composant } = action.payload;
        const site = state.typeSites.find((site) => site.id === siteId);
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
        const { siteId, ouvrageId } = action.payload;
        const site = state.typeSites.find((site) => site.id === siteId);
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
        const { siteId, ouvrageId, equipementId } = action.payload;
        const site = state.typeSites.find((site) => site.id === siteId);
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
        const { siteId, equipementId } = action.payload;
        const site = state.typeSites.find((site) => site.id === siteId);
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
        const { siteId, ouvrageId, equipementId, composantId } = action.payload;
        const site = state.typeSites.find((site) => site.id === siteId);
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
        const { siteId, equipementId, composantId } = action.payload;
        const site = state.typeSites.find((site) => site.id === siteId);
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
        const { parentId, newOrder } = action.payload;
        const site = state.typeSites.find((site) => site.id === parentId);
        if (site) {
          site.ouvrages = newOrder; // Mettez à jour les ouvrages
        } else {
          const ouvrage = state.typeSites.flatMap((site) => site.ouvrages).find((ouvrage) => ouvrage.id === parentId);
          if (ouvrage) {
            ouvrage.equipements = newOrder; // Mettez à jour les équipements
          } else {
            const equipement = state.typeSites.flatMap((site) => site.ouvrages.flatMap((ouvrage) => ouvrage.equipements)).find((equipement) => equipement.id === parentId);
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
      .addCase(updateOrderForSitePR.pending, (state) => {
        state.loading = true; // Indique que la mise à jour est en cours
        state.error = null; // Réinitialise l'erreur
      })
      .addCase(updateOrderForSitePR.fulfilled, (state, action) => {
        const { parentId, newOrder } = action.payload;
        const site = state.typeSites.find((site) => site.id === parentId);
        if (site) {
          site.equipements = newOrder; // Mettez à jour les équipements
        } else {
          const equipement = state.typeSites.flatMap((site) => site.equipements).find((equipement) => equipement.id === parentId);
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
        const { siteId, itemId } = action.payload;
        const site = state.typeSites.find((site) => site.id === siteId);
        if (site) {
          const ouvrage = site.ouvrages.find((ouvrage) => ouvrage.id === itemId);
          if (ouvrage) {
            ouvrage.show = !ouvrage.show;
          } else {
            for (const ouvrage of site.ouvrages) {
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
          console.warn(`Aucun site trouvé avec l'ID ${siteId}`);
        }
      })
      .addCase(toggleShowForSitePR.fulfilled, (state, action) => {
        const { siteId, itemId } = action.payload;
        const site = state.typeSites.find((site) => site.id === siteId);
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
        state.loading = false; // Réinitialiser l'état de chargement
        // state.typeSites = [action.payload.arbo]; // Stocker le site récupéré dans un tableau
        state.typeSites = [action.payload]; // Stocker le site récupéré dans un tableau
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
  setCaracteristiquesForSite,
  addAvailableItem, 
  updateButtonSiteItems,
  removeAvailableItem,
  addCaracteristiqueToSite,
  removeCaracteristiqueFromSite
} = siteTypeSlice.actions;

// Export du reducer
export default siteTypeSlice.reducer;