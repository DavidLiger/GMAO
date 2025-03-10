import React from "react";
import BioToast from "./bioToast";

const ToastManager = ({toasts = [], removeToast}) => {
    return (
        <div className="fixed bottom-8 right-8 space-y-2 z-50">
            {toasts.map((toast) => (
                <BioToast
                    key={toast.id}
                    {...toast}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
};

export default ToastManager;
