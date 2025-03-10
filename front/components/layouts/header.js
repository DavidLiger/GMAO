import {useEffect, useState} from "react";
import {FaEllipsisV, FaTimes} from "react-icons/fa"; // Import des icônes
import Breadcrumb from "../header/breadcrumb";
import User from "../header/user";
import {useNavigation} from "../../providers/NavigationContext";
import Notification from "../header/notification";
import Shortcut from "../header/shortcut";
import Search from "../header/search";
import {useAPIRequest} from "../api/apiRequest";
import {Spinner} from "flowbite-react";
import LanguageSelector from "../header/languageSelector";

const Header = () => {
    const {activeLabel} = useNavigation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const apiRequest = useAPIRequest()
    const [userInfo, setUserInfo] = useState({});


    useEffect(() => {
        const fetchUser = async () => {
            const response = await apiRequest('/api/utilisateur/info');
            const data = await response.json();
            setUserInfo(data);

        };
        fetchUser();
    }, []);

    return (
        <>
            {userInfo.nom ? (
                    <header
                        className="px-4 py-2 text-primary bg-white shadow flex flex-row items-center z-40 sticky top-0 left-0">
                        <div className="flex flex-col">
                            <h1 className="pl-2 md:text-2xl font-bold ml-10 md:!ml-0">{activeLabel}</h1>
                            <div className="hidden md:block">
                                <Breadcrumb/>
                            </div>
                        </div>

                        {/* Bouton pour afficher le menu sur mobile */}
                        <button
                            className="ml-auto md:hidden p-2 rounded-md hover:bg-gray-200"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <FaTimes size={24}/> : <FaEllipsisV size={24}/>}
                        </button>

                        {/* Menu affiché en desktop et conditionnellement en mobile */}
                        <div
                            className={`ml-auto flex flex-col md:flex-row gap-5 items-center ${isMenuOpen ? "flex" : "hidden"} md:flex absolute md:relative top-14 right-4 md:top-0 md:right-0 bg-white md:bg-transparent shadow-md md:shadow-none p-4 md:p-0 rounded-lg`}>
                            <LanguageSelector/>
                            <Search/>
                            <Shortcut role={userInfo.role}/>
                            <Notification/>
                            <User userInfo={userInfo}/>
                        </div>
                    </header>) :
                <Spinner/>
            }

        </>
    );
};

export default Header;
