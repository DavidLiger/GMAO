'use client';

import "./globals.sass";
import Header from "../../components/layouts/header";
import Sidenav from "../../components/layouts/sidenav";
import {useEffect, useState} from "react";
import {AuthProvider} from "../../providers/AuthProvider";
import {usePathname} from "next/navigation";
import {Flowbite, Spinner} from "flowbite-react";
import {ToastProvider} from "../../providers/toastProvider";
import {NavigationProvider} from "../../providers/NavigationContext";
import LocalFont from "next/font/local";
import {BreadcrumbProvider} from "../../providers/BreadCrumbContext";
import {Provider} from "react-redux";
import store from "@/redux/store";
import i18n from "../../i18n";
import {appWithTranslation} from "next-i18next";

const satoshi = LocalFont({src: './fonts/Satoshi-Variable.ttf'});

function RootLayout({children}) {
    const pathname = usePathname();
    const hiddenLoginRoutes = ['/login', '/reset', '/forgot'];
    const showLayout = !hiddenLoginRoutes.includes(pathname);
    const [locale, setLocale] = useState('fr'); // Langue par défaut
    const [loading, setLoading] = useState(true);

    // Charger les messages pour la langue sélectionnée
    useEffect(() => {
        loadTrad()
    }, []);

    const loadTrad = async () => {
        console.log(i18n.language)
        setLocale(i18n.language);
        setLoading(false)
    };

    return (
        <Provider store={store}>
            <html lang={locale}>
            <body className={`antialiased`}>

            {loading ? <Spinner/> :
                <Flowbite>
                    <AuthProvider>
                        <NavigationProvider>
                            <BreadcrumbProvider>
                                <ToastProvider>
                                    <div className="flex h-dvh">

                                        {showLayout && (
                                            <Sidenav
                                                appName={"ePerf BIOTRADE"}
                                                logo={"/images/logo.png"}
                                                userRoles={["ROLE_ADMIN", "ROLE_MANAGER"]}
                                            />
                                        )}
                                        <div className="flex-1 h-screen flex flex-col w-screen">
                                            {showLayout &&
                                                <Header/>}
                                            <main
                                                className={`${satoshi.className} ${showLayout ? "w-full flex-1 overflow-auto p-4" : ""}`}>
                                                {children}
                                            </main>
                                        </div>
                                    </div>
                                </ToastProvider>
                            </BreadcrumbProvider>
                        </NavigationProvider>
                    </AuthProvider>
                </Flowbite>
            }
            </body>
            </html>
        </Provider>
    );
}

export default appWithTranslation(RootLayout);