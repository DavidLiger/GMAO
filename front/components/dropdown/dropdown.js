import {usePathname} from "next/navigation";
import {AiOutlineDown, AiOutlineUp} from "react-icons/ai";

const Dropdown = ({menu, isOpen, toggleDropdown}) => {
    const pathname = usePathname();

    const isActive = (data) => {

        if (data.link === pathname) {
            return true;
        }

        if (data.menus) {
            return data.menus.some((menu) => isActive(menu, pathname));
        }

        return false;
    };

    return (
        <div className="relative">
            <div onClick={() => toggleDropdown(menu.id)}
                 className={"flex items-center justify-center w-full pt-1 pb-1 cursor-pointer"}>
                <div className={`w-1 h-1 ${
                    isActive(menu) ? "bg-rose-400 rounded-full" : ""
                }`}>
                </div>
                <div className={`flex-1 ml-2 text-muted-500 dark:text-muted-300 text-sm  ${
                    isActive(menu) ? "" : "hover:text-rose-300"
                }`}>
                    {menu.label}
                </div>
                {isOpen ? (
                    <AiOutlineUp className="w-1/12 text-lightTextSecondary dark:text-darkTextSecondary"/>
                ) : (
                    <AiOutlineDown className="w-1/12 text-lightTextSecondary dark:text-darkTextSecondary"/>
                )}
            </div>
            {isOpen && (
                <div className="w-48 bg-white z-10 transition ease-in-out duration-200 transform origin-top scale-y-100"
                     style={{transform: isOpen ? "scaleY(1)" : "scaleY(0)"}}
                >
                    <ul className="py-1">
                        {menu.menus.map((option, index) => (
                            <li key={index}>
                                <a
                                    href={option.link}
                                    className={`ml-4 text-xs p-2  ${
                                        isActive(option) ? "text-rose-400" : "text-muted-400 hover:text-rose-300"
                                    }`}>
                                    {option.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Dropdown;