import React from 'react';
import {FaImage} from 'react-icons/fa';
import Image from "next/image"
import i18n from "../../../i18n";

export default function ChildCard({child, onClick}) {
    const isImageAvailable = child.image && typeof child.image === 'string' && /\.(jpg|jpeg|png|gif|svg)$/i.test(child.image);

    return (
        <div
            className="flex items-center p-4 border rounded-md shadow-md bg-gray-100 cursor-pointer hover:bg-gray-200"
            onClick={onClick}
        >
            <div className="flex-1">
                <h3 className="font-bold text-lg">{child.nom}</h3>
                <p className="text-sm text-gray-700">{child.description || i18n.t("noDescription")}</p>
                <p className="text-sm text-gray-600 mt-2">
                    {i18n.t("tagsLabel")} {child.tags?.join(', ') || i18n.t("noTags")}
                </p>
            </div>
            <div className="ml-4 w-16 h-16 flex-shrink-0">
                {isImageAvailable ? (
                    <Image
                        src={child.image}
                        alt={i18n.t("childImageAlt", {name: child.nom})}
                        className="w-full h-full object-cover rounded-md border"
                        width={64} // Correspond à 16 * 4 (taille en pixels)
                        height={64}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-md border">
                        <FaImage className="text-gray-400 text-2xl"/>
                    </div>
                )}
            </div>
        </div>
    );
}
