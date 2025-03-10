import React, {useEffect, useState} from 'react';
import {MapContainer, TileLayer, useMap, useMapEvents} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapPoint = ({onMapClick}) => {
    // Initialisation avec les coordonnées de Toulouse
    const [userLocation, setUserLocation] = useState({lat: 43.604652, lng: 1.444209});
    const [hasCentered, setHasCentered] = useState(false);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // Optionnel : si vous souhaitez remplacer la localisation par celle de l'utilisateur
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error("Erreur de géolocalisation :", error);
                    // En cas d'erreur, la carte restera centrée sur Toulouse
                }
            );
        }
    }, []);

    const MapEvents = () => {
        const map = useMap();

        useEffect(() => {
            if (userLocation && !hasCentered) {
                map.setView([userLocation.lat, userLocation.lng], 13);
                setHasCentered(true);
            }
        }, [userLocation, hasCentered, map]);

        return null;
    };

    const MapClickHandler = () => {
        useMapEvents({
            click: (e) => {
                const {lat, lng} = e.latlng;
                const villeId = null; // Vous pouvez ajouter une logique d'API ici.
                onMapClick(lat, lng, villeId);
            },
        });
        return null;
    };

    return (
        <div className="relative" style={{height: '400px', width: '100%'}}>
            <MapContainer
                center={[userLocation.lat, userLocation.lng]}
                zoom={13}
                style={{height: '100%', width: '100%'}}
                whenReady={(map) => {
                    console.log('Map is ready:', map);
                }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <MapClickHandler/>
                <MapEvents/>
            </MapContainer>
        </div>
    );
};

export default MapPoint;
