import React, {useEffect, useState} from "react";
import {useAPIRequest} from "../../api/apiRequest";
import {FaChevronRight, FaHome} from "react-icons/fa";
import {useRouter} from "next/navigation";
import i18n from "../../../i18n";

export default function Breadcrumbs({bienId}) {
    const apiRequest = useAPIRequest();
    const [breadcrumbs, setBreadcrumbs] = useState([]);
    const router = useRouter();

    useEffect(() => {
        async function fetchBreadcrumbs(id) {
            try {
                const response = await apiRequest(`/api/bien/breadcrumbs/${id}`);
                const data = await response.json();
                setBreadcrumbs(data);
            } catch (error) {
                console.error(i18n.t("breadcrumbsError"), error);
            }
        }

        fetchBreadcrumbs(bienId);
    }, [bienId]);


    const handleNavigation = (id) => {
        // Naviguer vers la même page avec le nouvel ID
        router.push(`/bien/${id}`);
    };

    return (
        <nav className="flex items-center space-x-2 text-gray-700 font-medium">
            <FaHome
                className="text-primary cursor-pointer hover:underline"
                onClick={() => router.push("/")}
                title={i18n.t("home")}
            />
            {breadcrumbs.map((bien, index) => (
                <div key={bien.id} className="flex items-center">
                    {index > 0 && <FaChevronRight className="mx-1 text-gray-400"/>}
                    <span
                        className={`cursor-pointer hover:underline ${
                            index === breadcrumbs.length - 1 ? "text-primary" : ""
                        }`}
                        onClick={() => handleNavigation(bien.id)}
                    >
                        {bien.nom}
                    </span>
                </div>
            ))}
        </nav>
    );
}
