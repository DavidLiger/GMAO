import {createContext, useContext, useState} from "react";

const BreadcrumbContext = createContext();

export const BreadcrumbProvider = ({children}) => {
    const [breadcrumbs, setBreadcrumbs] = useState([]);
    return (
        <BreadcrumbContext.Provider value={{breadcrumbs, setBreadcrumbs}}>
            {children}
        </BreadcrumbContext.Provider>
    );
};

export const useBreadcrumb = () => useContext(BreadcrumbContext);
