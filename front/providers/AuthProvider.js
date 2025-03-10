'use client';
import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const router = useRouter();
    const exceptions = ['/login', '/reset', '/forgot'];

    const [token, setToken] = useState(() => {
        return localStorage.getItem("authToken") || null;
    });

    const [refreshtoken, setRefreshToken] = useState(() => {
        return localStorage.getItem("refreshToken") || null;
    });

    const logout = () => {
        setToken(null);
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        router.push('/login'); // Redirige vers la page de connexion
    };

    // Vérifie si l'utilisateur est authentifié
    useEffect(() => {
        if (!token && !exceptions.includes(window.location.pathname)) {
            router.push('/login'); // Redirige vers la page de connexion
        }
    }, [token, exceptions, router]);

    // Sauvegarde le token dans localStorage à chaque mise à jour
    useEffect(() => {
        if (token) {
            localStorage.setItem("authToken", token);
        } else {
            localStorage.removeItem("authToken");
        }
    }, [token]);

    return (
        <AuthContext.Provider value={{ token, setToken, logout, refreshtoken, setRefreshToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

// 'use client'
// import React, {createContext, useContext, useEffect, useState} from "react";
// import {redirect} from "next/navigation";

// const AuthContext = createContext();

// export const AuthProvider = ({children}) => {

//     const exceptions = ['/login', '/reset', '/forgot'];


//     const [token, setToken] = useState(() => {
//         // Charger le token depuis localStorage au démarrage
//         return localStorage.getItem("authToken") || null;
//     });

//     const [refreshtoken, setRefreshToken] = useState(() => {
//         // Charger le token depuis localStorage au démarrage
//         return localStorage.getItem("refreshToken") || null;
//     });

//     const logout = () => {
//         setToken(null); // Supprime le token du contexte
//         localStorage.removeItem("authToken"); // Supprime le token du localStorage
//         localStorage.removeItem("refreshToken");
//         setTimeout(() => {
//             redirect('/login');
//         }, 0)
//     };


//     if (!token && !exceptions.includes(location.pathname)) {
//         redirect('/login')
//     }

//     // Sauvegarder le token dans localStorage à chaque mise à jour
//     useEffect(() => {
//         if (token) {
//             localStorage.setItem("authToken", token);
//         } else {
//             localStorage.removeItem("authToken");
//         }
//     }, [token]);

//     return (
//         <AuthContext.Provider value={{token, setToken, logout, refreshtoken, setRefreshToken}}>
//             {children}
//         </AuthContext.Provider>
//     );
// };
// export const useAuth = () => useContext(AuthContext);
