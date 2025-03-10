import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import {DateTime} from 'luxon';
import messagesEN from './messages/en.json';
import messagesFR from './messages/fr.json';

// Initialiser i18n avec les fichiers de trad + définition du mécanisme de formatage (de date)
// Pour changer de langue, il faudra appeler la fonction i18n.changeLanguage(lng)

i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
        supportedLngs: ['en', 'fr'],
        detection: {
            // Ici, LanguageDetector va lui-même se charger de trouver la langue dans localStorage, les cookies ou
            // la langue du navigateur (à priori, même si le navigateur a pour code langue "fr-FR",
            // i18next se chargera de faire correspondre ça avec les 'supportedLngs')
            order: ['localStorage', 'cookie', 'navigator'],
            // Ici, LanguageDetector va lui-même se charger de stocker dans le localStorage ou les cookies la langue choisie
            // Lorsqu'on invoque la fonction i18n.changeLanguage(lng)
            caches: ['localStorage', 'cookie']
        },
        resources: {
            en: {messages: messagesEN},
            fr: {messages: messagesFR},
        },
        fallbackLng: 'fr',
        saveMissing: true,
        missingKeyHandler: (_lngs, _ns, key) => {
            console.warn(`Missing translation key: ${key}`);
        },
        ns: ['messages'],
        defaultNS: 'messages',
        interpolation: {
            escapeValue: false,
            format: (value, format, lng = i18n.language) => {
                let valueType = value instanceof Date || value instanceof DateTime ? 'date' : typeof value;
                if (valueType === 'string') {
                    if (/^-?\d+(\.\d+)?$/.test(value)) {
                        // Test si nunmérique
                        value = parseFloat(value);
                        valueType = 'number';
                    } else {
                        // Test si date
                        const luxdate = DateTime.fromISO(value);
                        if (luxdate.isValid) {
                            value = luxdate.setLocale(lng);
                            valueType = 'date';
                        }
                    }
                }
                switch (valueType) {
                    case 'number':
                    case 'bigint':
                        return new Intl.NumberFormat(lng).format(value);
                    case 'date':
                        if (!format)
                            format = 'short';
                        let messages = i18n.getResourceBundle(lng, 'messages');
                        let dateFormat = messages?.format?.date?.[format.toLowerCase()] || format;
                        if (value instanceof Date)
                            value = DateTime.fromJSDate(value).setLocale(lng);
                        return value instanceof DateTime ? value.toFormat(dateFormat) : value;
                }
                return value;
            },
        },
    });

export default i18n;
