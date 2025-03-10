import {Breadcrumb} from "flowbite-react";
import {FaHome} from "react-icons/fa";
import {useBreadcrumb} from "../../providers/BreadCrumbContext";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/navigation";
import {setWaitingPath} from "@/redux/features/modelSetterSlice";
import {useEffect} from "react";
import Link from "next/link";
import i18n from "../../i18n";

const BreadcrumbComponent = () => {
    const {breadcrumbs} = useBreadcrumb();
    const dispatch = useDispatch();
    const router = useRouter();
    const isModelUpdated = useSelector((state) => state.models.isPersistanceUpdated);
    const waitingPath = useSelector((state) => state.models.waitingPath);

    useEffect(() => {
        if (isModelUpdated && waitingPath && waitingPath !== '/logout') {
            router.push(waitingPath);
            dispatch(setWaitingPath(false));
        }
    }, [isModelUpdated, waitingPath]);

    const handleItemClick = (href, event) => {
        if (isModelUpdated) {
            router.push(href);
        } else {
            dispatch(setWaitingPath(href));
        }
    };

    if (breadcrumbs.length === 0) return null;

    return (
        <Breadcrumb className="pt-2 pl-2 bg-white rounded-lg">
            <Breadcrumb.Item icon={FaHome}>
                <Link
                    href="/"
                    onClick={(event) => handleItemClick('/', event)}
                    className="text-gray-600 hover:underline text-xs"
                >
                    {i18n.t("home")}
                </Link>
            </Breadcrumb.Item>
            {breadcrumbs.map((crumb, index) => (
                <Breadcrumb.Item key={index}>
                    {crumb.href ? (
                        <Link
                            href={crumb.href}
                            onClick={(event) => handleItemClick(crumb.href, event)}
                            className={`text-xs hover:underline text-gray-600`}
                        >
                            {crumb.label}
                        </Link>
                    ) : (
                        <span className={`text-xs text-gray-600`}>
                            {crumb.label}
                        </span>
                    )}
                </Breadcrumb.Item>
            ))}
        </Breadcrumb>
    );
};

export default BreadcrumbComponent;