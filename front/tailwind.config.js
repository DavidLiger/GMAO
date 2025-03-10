import colors from "tailwindcss/colors";

/** @type {import('tailwindcss').Config} */
const flowbiteReact = require("flowbite-react/tailwind");

module.exports = {
    darkMode: 'class',
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        flowbiteReact.content(),
    ],
    theme: {
        extend: {
            colors: {
                // Background principal
                lightBackground: colors.slate["100"],
                darkBackground: colors.slate["900"],
                lightText: colors.slate["800"],
                darkText: colors.slate["200"],

                // Couleur principale
                primaryActive: colors.sky["400"],
                primaryHoverText: colors.sky["700"],
                primaryLight: colors.sky["200"],
                primary: {
                    200: colors.sky['200'],
                    300: colors.sky['300'],
                    400: colors.sky['400'],
                    600: colors.sky['600'],
                    700: colors.sky['700'],
                    800: colors.sky['800'],
                    DEFAULT: colors.sky['500']
                },

                // Bacground secondaire (pour les composants d'UI / menu et header)
                lightBackgroundSecondary: colors.slate["50"],
                darkBackgroundSecondary: colors.slate["800"],
                lightBackgroundTitle: colors.slate["300"],
                darkBackgroundTitle: colors.slate["950"],
                lightBackgroundHover: colors.slate["200"],
                darkBackgroundHover: colors.slate["950"],
                lightTextSecondary: colors.slate["700"],
                darkTextSecondary: colors.slate["300"],
                lightTextTitle: colors.slate["800"],
                darkTextTitle: colors.slate["100"],
                lightTextDropdown: colors.slate["500"],
                darkTextDropdown: colors.slate["200"],

                // Border pour les composants d'UI / menu et header
                lightBorderColor: colors.slate["300"],
                darkBorderColor: colors.slate["700"],

                // Accordion
                lightBackgroundTitleClose: colors.slate["200"],
                darkBackgroundTitleClose: colors.slate["900"],

                // Button
                buttonEnabledHover: colors.sky["700"],
                buttonLightEnabledHoverClose: colors.slate["200"],
                buttonDarkEnabledHoverClose: colors.slate["900"],

                // Modal
                lightCloseBgHover: colors.slate["300"],
                lightCloseTextHover: colors.slate["600"],
                darkCloseBgHover: colors.slate["600"],
                darkCloseTextHover: colors.slate["400"],
                enteteModalRed: "#FF0000",

                // Progress bar
                lightBgBase: colors.slate["200"],
                darkBgBase: colors.slate["700"],
                textBarLabel: colors.slate["200"],

                // Tabs
                lightBgTabsNotActive: colors.slate["200"],
                darkBgTabsNotActive: colors.slate["700"],
                lightBackgroundHoverTabs: colors.slate["300"],
                darkBackgroundHoverTabs: colors.slate["600"],
                lightTabsUnderline: colors.slate["500"],
                darkTabsUnderline: colors.slate["300"],
                lightHoverTabsUnderline: colors.slate["600"],
                darkHoverTabsUnderline: colors.slate["400"],

                // Timeline
                lightBgTimeline: colors.sky["200"],
                darkBgTimeline: colors.sky["900"],
                lightTextBodyTimeline: colors.slate["600"],
                darkTextBodyTimeline: colors.slate["300"],
                lightTextTimeTimeline: colors.slate["500"],
                darkTextTimeTimeline: colors.slate["400"],
                lightTextTitleTimeline: colors.slate["50"],
                darkTextTitleTimeline: colors.slate["50"],

                // Page
                lightBgToast: colors.sky["100"],
                darkBgToast: colors.sky["800"],
                darkTextToast: colors.sky["200"],

                // Tooltip
                lightDarkTooltip: colors.sky["900"],
                lightTooltip: colors.slate["50"],
                textTooltip: colors.sky["900"],
                textDarkTooltip: colors.slate["50"],
                borderTooltip: colors.sky["200"],
                darkDarkTooltip: colors.sky["700"],

            },
            boxShadow: {
                dark: "0px 0px 5px 2px #020617",
                light: "0px 0px 5px 2px #94a3b8",
            },
            inset: {
                "3rem": "3.1rem",
                "18rem": "18.2rem",
            },
            fontFamily: {
                sans: ["Satoshi", "Roboto"],
            },
        },
    },
    plugins: [
        flowbiteReact.plugin(),
    ],
}
