'use client';

import React, {useEffect, useState} from 'react';
import 'leaflet/dist/leaflet.css';
import Select from 'react-select';
import {useAPIRequest} from "../../../components/api/apiRequest";
import {MapContainer, Marker, Popup, TileLayer, useMap} from "react-leaflet";
import {useRouter} from "next/navigation";
import {FaEdit} from "react-icons/fa";
import L from 'leaflet';
import {useNavigation} from "../../../providers/NavigationContext";
import {useBreadcrumb} from "../../../providers/BreadCrumbContext";
import BioButton from "../../../components/button/BioButton";
import {TextInput} from "flowbite-react";
import i18n from "../../../i18n";

const customIcon = new L.Icon({
    iconUrl: "/images/mapPin.png", // Remplacez par le chemin de votre icône
    iconSize: [41, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});

export default function SitesWithMap() {
    const apiRequest = useAPIRequest();
    const router = useRouter();
    const {setActiveLabel} = useNavigation();
    const {setBreadcrumbs} = useBreadcrumb();
    const [sites, setSites] = useState([]);
    const [filteredSites, setFilteredSites] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [citySearch, setCitySearch] = useState('');
    const [isLoadingCities, setIsLoadingCities] = useState(false);
    const [userLocation, setUserLocation] = useState([48.8566, 2.3522]); // Paris par défaut
    const [selectedSite, setSelectedSite] = useState(null);

    useEffect(() => {
        setActiveLabel(i18n.t("yourHeritage")); // Par exemple "Votre Patrimoine"
    }, [setActiveLabel]);

    useEffect(() => {
        setBreadcrumbs([
            {label: i18n.t("patrimoineTitle"), href: null}
        ]);
    }, [setBreadcrumbs]);

    // Récupérer les sites
    useEffect(() => {
        const fetchSites = async () => {
            const response = await apiRequest('/api/site');
            const data = await response.json();
            setSites(data);
            setFilteredSites(data);
        };

        const fetchTags = async () => {
            const response = await apiRequest('/api/tags');
            const data = await response.json();
            setTags(data.map(tag => ({value: tag.id, label: tag.nom})));
        };

        fetchSites();
        //fetchTags();
    }, []);

    // Recherche dynamique des villes
    useEffect(() => {
        const fetchCities = async () => {
            if (!citySearch) {
                setCities([]);
                return;
            }
            setIsLoadingCities(true);
            const response = await apiRequest(`/api/ville/search?search=${citySearch}`);
            const data = await response.json();
            setCities(data.map(city => ({value: city.nom, label: `${city.nom} (${city.codePostal})`})));
            setIsLoadingCities(false);
        };

        const debounceTimeout = setTimeout(() => fetchCities(), 300);
        return () => clearTimeout(debounceTimeout);
    }, [citySearch]);

    // Filtrer les sites
    useEffect(() => {
        if (!sites || sites.length === 0) {
            setFilteredSites([]);
            return;
        }

        const filtered = sites
            .filter(site => site.nom && site.nom.toLowerCase().includes(searchQuery.toLowerCase()))
            .filter(site => (selectedCity ? site['ville'] && site['ville'].nom === selectedCity.value : true))
            .filter(site =>
                selectedTags.length === 0 ||
                selectedTags.some(tag => site.tags && site.tags.some(siteTag => siteTag.id === tag.value))
            );

        setFilteredSites(filtered);
    }, [searchQuery, selectedCity, selectedTags, sites]);

    // Récupérer la géolocalisation de l'utilisateur
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const {latitude, longitude} = position.coords;
                    setUserLocation([latitude, longitude]);
                },
                (error) => console.error("Geolocation error:", error)
            );
        }
    }, []);

    function handleDetail(id) {
        router.push(`/bien/${id}`);
    }

    function MapUpdater({selectedSite}) {
        const map = useMap();
        useEffect(() => {
            if (selectedSite) {
                map.setView([selectedSite.latitude, selectedSite.longitude], 13);
            }
        }, [selectedSite, map]);
        return null;
    }

    return (
        <div className="flex justify-center items-center">
            <div className="border rounded-md shadow-lg w-11/12 max-h-[89vh] min-h-[89vh]">
                <div className="p-4 bg-white border-b shadow-md flex flex-wrap gap-4 items-center">
                    <TextInput
                        type="text"
                        placeholder={i18n.t('searchByName')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />

                    <Select
                        options={cities}
                        value={selectedCity}
                        onChange={setSelectedCity}
                        placeholder={i18n.t('filterByCity')}
                        isClearable
                        isLoading={isLoadingCities}
                        className="w-64"
                        onInputChange={setCitySearch}
                        menuPortalTarget={document.body}
                        menuPortalStyle={{zIndex: 9999}}
                        styles={{
                            input: (provided) => ({
                                ...provided,
                                padding: 0,
                                height: "22px",
                                margin: 0,
                                fontSize: '0.875rem',
                                "input[type='text']:focus": {boxShadow: 'none'},
                            }),
                            control: (provided) => ({
                                ...provided,
                                backgroundColor: "#f8fafc"
                            })
                        }}
                    />

                    <Select
                        options={tags}
                        value={selectedTags}
                        onChange={setSelectedTags}
                        placeholder={i18n.t('filterByTags')}
                        isMulti
                        className="w-64"
                        menuPortalTarget={document.body}
                        menuPortalStyle={{zIndex: 9999}}
                        styles={{
                            input: (provided) => ({
                                ...provided,
                                padding: 0,
                                height: "22px",
                                margin: 0,
                                fontSize: '0.875rem',
                                "input[type='text']:focus": {boxShadow: 'none'},
                            }),
                            control: (provided) => ({
                                ...provided,
                                backgroundColor: "#f8fafc"
                            })
                        }}
                    />
                </div>

                <div className="flex h-full">
                    <div className="w-1/3 p-4 border-r overflow-y-auto bg-white max-h-[85vh]">
                        <h2 className="text-lg font-bold mb-4">{i18n.t('siteList')}</h2>
                        <ul>
                            {filteredSites.map(site => (
                                <li
                                    key={site.id}
                                    onClick={() => setSelectedSite(site)}
                                    className="mb-4 p-4 border rounded-md shadow-md flex items-center justify-between gap-4"
                                >
                                    <div className="flex flex-col">
                                        <h3 className="font-bold text-primary text-xl">{site.nom}</h3>
                                        <p className="text-gray-700 text-xl">
                                            {site['ville'] && site['ville'].nom ? site['ville'].nom : i18n.t('noCity')}
                                        </p>
                                    </div>
                                    <BioButton
                                        color={"primary"}
                                        className="text-center ml-auto"
                                        onClick={() => handleDetail(site.id)}
                                    >
                                        <FaEdit/>
                                    </BioButton>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex-1 bg-white h-[90vh]">
                        <MapContainer
                            center={userLocation}
                            zoom={13}
                            style={{height: '100%', width: '100%', zIndex: 0}}
                        >
                            <MapUpdater selectedSite={selectedSite}/>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {filteredSites.map(site => (
                                <Marker
                                    key={site.id}
                                    position={[site.latitude, site.longitude]}
                                    icon={customIcon}
                                >
                                    <Popup>
                                        <div className="p-2">
                                            <h3 className="font-bold text-lg">{site.nom}</h3>
                                            <p>
                                                {site['ville'] && site['ville'].nom ? site['ville'].nom : i18n.t('noCity')}
                                            </p>
                                            <button
                                                className="mt-2 py-1 px-3 bg-primary hover:bg-primaryHoverText text-white rounded-md"
                                                onClick={() => handleDetail(site.id)}
                                            >
                                                {i18n.t('viewDetails')}
                                            </button>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
