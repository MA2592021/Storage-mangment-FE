import enTranslations from "./locales/en.json";
import { reactive } from "vue";

import arTranslations from "./locales/ar.json";

const translations = {
  en: enTranslations,
  ar: arTranslations,
};

const translationModule = reactive({
  locale: "en",
  getTranslation(key) {
    const translation = translations[this.locale][key];
    if (translation) {
      return translation;
    }
    // Fallback to the key itself if translation is not found
    return key;
  },
  setLocale(locale) {
    this.locale = locale;
  },
});

export default translationModule;
