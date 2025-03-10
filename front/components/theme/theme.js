"use client"

import {useEffect, useState} from "react";
import {HiOutlineSun} from "react-icons/hi2";
import {HiOutlineMoon} from "react-icons/hi";

const Theme = ({}) => {
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme) {
            setTheme(storedTheme);
            document.documentElement.classList.add(storedTheme);
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        document.documentElement.classList.remove(theme);
        document.documentElement.classList.add(newTheme);
        localStorage.setItem("theme", newTheme);
    };

    return (
        <div
            onClick={toggleTheme}
            className="ml-1 mr-1 cursor-pointer w-8 h-8 rounded-full flex items-center justify-center border bg-lightBackgroundSecondary border-lightBorderColor hover:bg-lightBackgroundHover dark:bg-darkBackgroundSecondary dark:border-darkBorderColor dark:hover:bg-darkBackgroundHover">
            {theme === "light"
                ? <HiOutlineSun className={"text-darkBackgroundSecondary h-5 w-5"}/>
                : <HiOutlineMoon className={"dark:text-lightBackgroundSecondary h-5 w-5"}/>}
        </div>
    );
};

export default Theme;
