import {Sidebar} from "flowbite-react";
import {usePathname, useRouter} from "next/navigation";
import categories from "@/json/categories.json";
import {useEffect, useState} from "react";
import {FiChevronDown, FiChevronRight} from "react-icons/fi";
import {BsPin, BsPinAngle} from "react-icons/bs";
import * as FaIcons from "react-icons/fa";
import {FaBars} from "react-icons/fa";
import {useDispatch, useSelector} from 'react-redux';
import {setWaitingPath} from '@/redux/features/modelSetterSlice';
import i18n from "../../i18n";

const Sidenav = ({logo, appName, userRoles, sideBarCustom}) => {
    const pathname = usePathname();
    const dispatch = useDispatch();
    const [hovered, setHovered] = useState(false);
    const [reduced, setReduced] = useState(false);
    const [opened, setOpened] = useState(false);
    const [expandedItems, setExpandedItems] = useState({});
    const router = useRouter();
    const isModelUpdated = useSelector((state) => state.models.isPersistanceUpdated);
    const waitingPath = useSelector((state) => state.models.waitingPath);
    const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

    const isActive = (link) => pathname === link;

    useEffect(() => {
        if (isModelUpdated && waitingPath && waitingPath !== '/logout') {
            router.push(waitingPath);
            dispatch(setWaitingPath(false));
        }
    }, [isModelUpdated, waitingPath]);

    const hasPermission = (category) => {
        if (!category.droit) return true;

        if (category.droit.type === "some") {
            return category.droit.roles.some(role => userRoles.includes(role));
        }

        if (category.droit.type === "every") {
            return category.droit.roles.every(role => userRoles.includes(role));
        }

        if (category.droit.type === "mixed" && category.droit.rules) {
            return category.droit.rules.every(rule => {
                if (rule.type === "some") {
                    return rule.roles.some(role => userRoles.includes(role));
                }
                if (rule.type === "every") {
                    return rule.roles.every(role => userRoles.includes(role));
                }
                return false;
            });
        }

        return false;
    };

    const toggleExpand = (label) => {
        setExpandedItems(prev => {
            const updatedState = {...prev};

            if (updatedState[label]) {
                // On ferme uniquement cet élément sans impacter son parent
                delete updatedState[label];
            } else {
                // On l'ouvre et on garde les autres intacts
                updatedState[label] = true;
            }

            return {...updatedState};
        });
    };

    const isParentActive = (category) => {
        if (isActive(category.link)) return true; // Si lui-même est actif
        if (category.children) {
            return category.children.some(isParentActive); // Vérifier si un enfant est actif
        }
        return false;
    };

    const handleItemClick = (category, event) => {
        let path = category.link;
        if (event.button === 1) {
            window.open(path, '_blank');
        } else {
            if (isModelUpdated) {
                router.push(path);
            } else {
                dispatch(setWaitingPath(path));
            }
        }
    };

    const renderMenuItems = (items, level = 0, insideActiveParent = false) => {
        return items.filter(hasPermission).map((category) => {
            const Icon = FaIcons[category.icon] || null;
            const hasChildren = !!category.children;
            const isActiveLink = isActive(category.link);
            const isActiveParent = isParentActive(category); // Vérifie si parent d'un élément actif
            const isInsideActiveParent = level === 0 ? isActiveParent : insideActiveParent; // Propagation du style

            const activeClasses = isActiveLink ? 'text-white bg-primary' : '';
            const parentActiveClasses = isInsideActiveParent ? 'bg-primaryLight' : 'bg-gray-100';

            return (
                <div
                    key={category.label}
                    className={`rounded flex flex-col 
                    ${reduced && !hovered ? "items-center p-1 w-fit" : `pl-${level * 4} pb-0.5`} ${parentActiveClasses} my-1`}
                >
                    <Sidebar.Item
                        active={isActiveLink}
                        icon={() => Icon ? <Icon
                            size={isMobile ? (level === 0 ? 25 : level === 1 ? 20 : 15) : (level === 0 ? 20 : level === 1 ? 15 : 10)}/> : ""}
                        className={`w-full flex items-center justify-center rounded hover:text-white hover:bg-primary cursor-pointer text-gray-800 ${activeClasses} 
                                    ${level === 0 ? 'font-bold' : ''}`}
                        onClick={(event) => hasChildren ? toggleExpand(category.label) : handleItemClick(category, event)}
                        onMouseDown={(event) => {
                            if (event.button === 1) { // Clic du milieu
                                event.preventDefault(); // Empêche le comportement par défaut
                                window.open(category.link, '_blank'); // Ouvre le lien dans un nouvel onglet
                            }
                        }}
                    >
                        <div className="flex items-center justify-between w-full">
                            {i18n.t(category.label)}
                            {hasChildren && (
                                <button className="ml-auto">
                                    {expandedItems[category.label] ? <FiChevronDown/> : <FiChevronRight/>}
                                </button>
                            )}
                        </div>
                    </Sidebar.Item>
                    {(hasChildren && expandedItems[category.label]) && (
                        <div className="">
                            {renderMenuItems(category.children, level + 1, isInsideActiveParent)}
                        </div>
                    )}
                </div>
            );
        });
    };

    return (
        <>
            <button
                className="fixed top-2 left-4 z-50 hover:bg-gray-200 p-2 rounded-full sm:hidden text-primary"
                onClick={() => setOpened(true)}
            >
                <FaBars size={24}/>
            </button>
            {opened && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-50 sm:hidden"
                    onClick={() => setOpened(false)}
                ></div>
            )}
            <div
                className={`w-4/5 fixed top-0 left-0 h-full bg-white z-50 border-r border-gray-300 transition-transform  ${opened ? 'w-4/5 translate-x-0' : ' -translate-x-full'} sm:w-auto sm:translate-x-0 sm:relative flex flex-col`}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                <button
                    className="absolute top-6 -right-3 z-50 bg-gray-200 p-1 rounded-full md:block hidden"
                    onClick={() => setReduced(!reduced)}
                >
                    {reduced ? <BsPinAngle size={16}/> : <BsPin size={16}/>}
                </button>
                <Sidebar collapsed={(!opened && reduced && !hovered) || (isMobile && !opened)} className="w-auto">
                    <Sidebar.Logo href="#" img={logo} imgAlt={appName}
                                  className={`mt-1 flex items-center justify-center text-3xl pl-0 pr-1 ${!reduced || hovered ? "w-64" : ""}`}>
                        {!reduced || hovered ? appName : ""}
                    </Sidebar.Logo>
                    <Sidebar.ItemGroup>
                        {sideBarCustom}
                    </Sidebar.ItemGroup>
                    <Sidebar.Items className="flex-1 flex flex-col justify-between items-stretch overflow-y-auto">
                        <Sidebar.ItemGroup>
                            {renderMenuItems(categories, 0)}
                        </Sidebar.ItemGroup>
                    </Sidebar.Items>
                </Sidebar>
            </div>
        </>
    );
};

export default Sidenav;