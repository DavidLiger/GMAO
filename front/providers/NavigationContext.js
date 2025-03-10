import {createContext, useContext, useState} from "react";

const NavigationContext = createContext();

export const NavigationProvider = ({children}) => {
    const [activeLabel, setActiveLabel] = useState("Non trouvé");

    return (
        <NavigationContext.Provider value={{activeLabel, setActiveLabel}}>
            {children}
        </NavigationContext.Provider>
    );
};

export const useNavigation = () => useContext(NavigationContext);
