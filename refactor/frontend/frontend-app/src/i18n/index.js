import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import hi from "./hi.json";

// Adding a new language later means: 1) add a JSON file here with the same
// key shape as en.json, 2) add it to `resources` and this map, 3) add an
// <option> in the language <select>. No component code changes needed.
export const LANGUAGE_TO_VOICE_LOCALE = {
  en: "en-US",
  hi: "hi-IN",
};

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
