import { configureStore } from '@reduxjs/toolkit';
import siteReducer from './features/siteSlice'; // Assurez-vous que le chemin est correct
import siteTypeReducer from './features/siteTypeSlice'; // Assurez-vous que le chemin est correct
import modelSetterReducer from './features/modelSetterSlice'; // Assurez-vous que le chemin est correct
import actionReducer from './features/actionSlice'; // Assurez-vous que le chemin est correct

const store = configureStore({
  reducer: {
    sites: siteReducer, // Ajout du reducer pour gérer l'état des sites
    typeSites: siteTypeReducer, // Ajout du reducer pour gérer l'état des types de sites
    models: modelSetterReducer, // Ajout du reducer pour gérer les models
    actions: actionReducer
  },
});

export default store;