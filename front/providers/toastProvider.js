import {createContext, useContext, useState} from "react";
import ToastManager from "../components/toast/toastManager";


const ToastContext = createContext();

export const ToastProvider = ({children}) => {
    const [toasts, setToasts] = useState([]);

    const addToast = (toast) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, {...toast, id}]);
    };

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{addToast}}>
            {children}
            <ToastManager toasts={toasts} removeToast={removeToast}/>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    return useContext(ToastContext);
};
