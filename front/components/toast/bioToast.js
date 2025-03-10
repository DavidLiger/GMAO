import React, {useEffect, useState} from "react";
import {HiCheck, HiExclamation, HiInformationCircle, HiX} from "react-icons/hi";
import {Toast} from "flowbite-react";

const BioToast = ({
                      id,
                      type = "info",
                      message = "Message dynamique",
                      duration = 5000,
                      onClose = () => {
                      },
                  }) => {
    const [progress, setProgress] = useState(100);
    const [timer, setTimer] = useState(null);

    useEffect(() => {
        if (duration > 0) {
            const interval = setInterval(() => {
                setProgress((prev) => {
                    const nextProgress = prev - (100 / (duration / 100));
                    if (nextProgress <= 0) {
                        clearInterval(interval);
                        onClose(id, false); // Fermeture automatique
                    }
                    return Math.max(nextProgress, 0);
                });
            }, 100);

            setTimer(interval);

            return () => clearInterval(interval);
        }
    }, [duration, id, onClose]);

    const handleClose = () => {
        if (timer) clearInterval(timer);
        setProgress(0);
        onClose(id, false);
    };

    const getTypeClassesBorder = () => {
        switch (type) {
            case "success":
                return "border-green-800";
            case "error":
                return "border-red-800";
            case "warning":
                return "border-yellow-800";
            case "primary":
                return "border-primary";
            default:
                return "border-blue-800";
        }
    };

    const getTypeClassesIcon = () => {
        switch (type) {
            case "success":
                return "bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200";
            case "error":
                return "bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200";
            case "warning":
                return "bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200";
            case "primary":
                return "bg-primaryLight text-primary dark:bg-primaryDark";
            default:
                return "bg-blue-100 text-blue-500 dark:bg-blue-700 dark:text-blue-200";
        }
    };

    const getIcons = () => {
        switch (type) {
            case "success":
                return <HiCheck className="h-5 w-5"/>;
            case "error":
                return <HiX className="h-5 w-5"/>;
            case "warning":
                return <HiExclamation className="h-5 w-5"/>;
            case "primary":
                return <HiInformationCircle className="h-5 w-5 text-primary"/>;
            default:
                return <HiInformationCircle className="h-5 w-5"/>;
        }
    };

    const getColor = () => {
        switch (type) {
            case "success":
                return "bg-green-500";
            case "error":
                return "bg-red-500";
            case "warning":
                return "bg-yellow-500";
            case "primary":
                return "bg-primary";
            default:
                return "bg-blue-500";
        }
    };

    return (
        <Toast className={`block border-l-4 ${getTypeClassesBorder()}`}>
            <div className="inline-flex w-full items-center">
                <div
                    className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${getTypeClassesIcon()}`}>
                    {getIcons()}
                </div>
                <div className="pl-4 text-sm font-normal">{message}</div>
                <div className="ml-auto flex items-center space-x-2">
                    <Toast.Toggle onClick={handleClose}/>
                </div>
            </div>

            {duration !== -1 && (
                <div className="inline-flex h-3 w-full">
                    <div
                        className={`h-1 block mt-2 rounded ${getColor()}`}
                        style={{width: `${progress}%`, transition: "width 0.1s linear"}}
                    />
                </div>
            )}
        </Toast>
    );
};

export default BioToast;
