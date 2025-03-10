import {useEffect, useState} from "react";
import {Popover} from "flowbite-react";
import {useAPIRequest} from "../api/apiRequest";
import {FaBell} from "react-icons/fa";
import {useRouter} from "next/navigation";
import BioButton from "../button/BioButton";
import {setWaitingPath} from "@/redux/features/modelSetterSlice";
import {useDispatch, useSelector} from 'react-redux';
import i18n from "../../i18n";

const notif = [
    {
        "id": 1,
        "nom": "Nouvelle commande",
        "date": "2025-02-06 14:30",
        "description": "Une nouvelle commande a été passée.",
        "hasBeenSeen": false,
        "link": "/"
    },
    {
        "id": 2,
        "nom": "Mise à jour système",
        "date": "2025-02-06 12:15",
        "description": "Une mise à jour du système a été effectuée.",
        "hasBeenSeen": true,
        "link": "/toast"
    },
    {
        "id": 3,
        "nom": "Message de support",
        "date": "2025-02-05 18:45",
        "description": "Vous avez reçu un nouveau message du support.",
        "hasBeenSeen": false,
        "link": null
    }
]

const Notification = () => {
    const dispatch = useDispatch();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const apiRequest = useAPIRequest();
    const router = useRouter()
    const isModelUpdated = useSelector((state) => state.models.isPersistanceUpdated);
    const waitingPath = useSelector((state) => state.models.waitingPath);

    useEffect(() => {
        if (isModelUpdated && waitingPath && waitingPath !== '/logout') {
            router.push(waitingPath)
            dispatch(setWaitingPath(false))
        }
    }, [isModelUpdated, waitingPath])

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Rafraîchissement toutes les 30 sec
        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            //TODO mettre en place la route
            //const response = await apiRequest('/api/notifications', 'GET');
            const response = notif
            setNotifications(response);
            setUnreadCount(response.filter(n => !n.hasBeenSeen).length);
        } catch (error) {
            console.error('Erreur lors de la récupération des notifications', error);
        }
    };

    const markAsSeen = async (id) => {
        try {
            await apiRequest(`/api/notifications/${id}`, 'PATCH', {hasBeenSeen: true});
            setNotifications(notifications.map(n =>
                n.id === id ? {...n, hasBeenSeen: true} : n
            ));
            setUnreadCount(unreadCount - 1);
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la notification', error);
        }
    };

    const handleItemClick = (path) => {
        if (isModelUpdated) {
            router.push(path)
        } else {
            dispatch(setWaitingPath(path))
        }
    };

    return (
        <Popover content={
            <div className="w-64 p-4 bg-white shadow-lg rounded-lg">
                <h3 className="text-lg font-semibold">{i18n.t("notifications")}</h3>
                <div className="pt-2 space-y-2">
                    {notifications.length === 0 ? (
                        <p className="text-gray-500">{i18n.t("noNotification")}</p>
                    ) : (
                        notifications.map((notif) => (
                            <div
                                key={notif.id}
                                className="flex items-start p-2 border-b last:border-b-0 cursor-pointer hover:bg-gray-100"
                                onClick={() => markAsSeen(notif.id)}
                            >
                                {!notif.hasBeenSeen ? (
                                    <span className="h-2 w-2 rounded-full bg-red-500 mr-2 mt-1"></span>
                                ) : (
                                    <span className="h-2 w-2 rounded-full mr-2 mt-1"></span>
                                )}
                                <div>
                                    <p className="text-sm font-medium">{notif.nom}</p>
                                    <p className="text-xs text-gray-500">{notif.date}</p>
                                    <p className="text-sm text-gray-800">{notif.description}</p>
                                    {notif.link &&
                                        <p className="text-md hover:text-primaryHoverText hover:underline"
                                           onClick={() => handleItemClick(notif.link)}>{i18n.t("view")}</p>
                                    }
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        }>
            <BioButton color={"gray"} className="relative rounded-full">
                <FaBell size={24} className="text-gray-600"/>
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500"></span>
                )}
            </BioButton>
        </Popover>
    );
}

export default Notification;