import {useAuth} from "../../providers/AuthProvider";
import {redirect} from "next/navigation";

export const useAPIRequest = () => {
    const {token, setToken, logout, refreshtoken, setRefreshToken} = useAuth();
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    return async (url, method = "GET", body = null) => {
        const defaultHeaders = {
            Authorization: `Bearer ${token}`,
        };

        const headers =
            body instanceof FormData
                ? {...defaultHeaders} // Laisser le navigateur gérer Content-Type
                : {...defaultHeaders, "Content-Type": "application/json"};
        try {
            // Effectue la requête API
            const response = await fetch(baseUrl + url, {
                method,
                headers,
                body: body instanceof FormData ? body : body ? JSON.stringify(body) : null,
            });

            // Si la réponse est OK, retourne les données
            if (response.ok) {
                return await response;
            }


            const errorData = await response.json();
            if (errorData.message === "Expired token.") {
                // Essayons de rafraîchir le token
                const refreshResponse = await fetch(baseUrl + "/token", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        refresh_token: refreshtoken,
                        grant_type: "refresh_token",
                        client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
                        client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET
                    }),
                });

                if (refreshResponse.ok) {
                    const newToken = await refreshResponse.json();

                    // Met à jour le token et réessaye la requête initiale
                    setToken(newToken["access_token"]);
                    setRefreshToken(newToken["refresh_token"])
                    localStorage.setItem("authToken", newToken["access_token"]);

                    // Réessaye la requête initiale avec le nouveau token
                    const retryResponse = await fetch(baseUrl + url, {
                        method,
                        headers: {
                            ...defaultHeaders,
                            Authorization: `Bearer ${newToken["access_token"]}`,
                        },
                        body: body ? JSON.stringify(body) : null,
                    });

                    // Retourne la réponse si la requête réussit après rafraîchissement
                    if (retryResponse.ok) {
                        return await retryResponse.json();
                    }
                }

                // Si le rafraîchissement échoue, déconnecte l'utilisateur
                logout();
                redirect("/login");
            }

        } catch (error) {
            console.error("API Request Error:", error);
            // Redirige vers /login si une erreur critique survient
            if (error.message === "Failed to retry request after token refresh.") {
                //logout();
                //redirect("/login");
            }
            throw error;
        }
    };
};