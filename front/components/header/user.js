import {Popover, Spinner} from "flowbite-react";
import {useAuth} from "../../providers/AuthProvider";
import {BiLogOut} from "react-icons/bi";
import {FaEdit} from "react-icons/fa";
import {setWaitingPath} from "@/redux/features/modelSetterSlice";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import i18n from "../../i18n";

const User = ({userInfo}) => {
    const dispatch = useDispatch();
    const {logout} = useAuth();
    const isModelUpdated = useSelector((state) => state.models.isPersistanceUpdated);
    const waitingPath = useSelector((state) => state.models.waitingPath);

    useEffect(() => {
        if (isModelUpdated && waitingPath && waitingPath === '/logout') {
            dispatch(setWaitingPath(false)); // Décommentez si nécessaire
            logout();
        }
    }, [isModelUpdated, waitingPath]);

    const handleItemClick = () => {
        if (isModelUpdated) {
            logout();
        } else {
            dispatch(setWaitingPath('/logout'));
        }
    };

    return (
        <>
            {userInfo ? (
                <Popover
                    content={
                        <div className="w-[200px] text-sm dark:text-slate-300 bg-white">
                            <div className="flex items-center w-full justify-center mt-4">
                                <div
                                    className="text-white bg-primary p-4 text-3xl rounded-full w-fit gap font-extrabold">
                                    {userInfo.nom[0].toUpperCase()}{userInfo.prenom[0].toUpperCase()}
                                </div>
                            </div>
                            <div id="shortcut-popover" className="text-lg leading-5 p-3 text-center font-semibold">
                                {userInfo.nom} {userInfo.prenom}
                            </div>
                            <div className={"text-xs w-full text-center text-gray-400"}>
                                {userInfo.email}
                            </div>
                            <div className="h-1 border-b-2 dark:border-muted-300 mt-4"></div>

                            <div className={"flex flex-row text-gray-800 w-full"}>
                                <ul className="w-full">
                                    <li className="text-black cursor-pointer p-3 pl-8 text-sm font-medium flex flex-row items-center gap-2 hover:bg-gray-200">
                                        <FaEdit/> {i18n.t("profile")}
                                    </li>
                                    <li className="text-black cursor-pointer p-3 pl-8 text-sm font-medium flex flex-row items-center gap-2 hover:bg-gray-200"
                                        onClick={handleItemClick}>
                                        <BiLogOut/> {i18n.t("logout")}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    }
                >
                    <div
                        className="text-white bg-primary p-1.5 rounded-full gap font-black shadow border boder-gray-300">
                        {userInfo.nom[0].toUpperCase()}{userInfo.prenom[0].toUpperCase()}
                    </div>
                </Popover>
            ) : (
                <Spinner/>
            )}
        </>
    );
};

export default User;