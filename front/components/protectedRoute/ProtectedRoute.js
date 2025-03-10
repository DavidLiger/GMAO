// components/ProtectedRoute.js
import { useEffect } from 'react';
import { useAuth } from '../../providers/AuthProvider';
import { useRouter } from 'next/navigation';

const ProtectedRoute = ({ children }) => {
    const router = useRouter();
    const { token } = useAuth(); // Utilisez le token pour vérifier l'authentification

    useEffect(() => {
        if (!token) {
            router.push(`/auth?redirect=${encodeURIComponent(router.asPath)}`);
        }
    }, [token, router]);

    if (!token) {
        return <div>Chargement...</div>; // Affichez un message de chargement pendant la redirection
    }

    return children; // Rendre les enfants si l'utilisateur est authentifié
};

export default ProtectedRoute;