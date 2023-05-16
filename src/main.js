import { createApp } from "vue";
import { createPinia } from "pinia";
import { createI18n } from "vue-i18n";
import en from "./locales/en";
import ar from "./locales/ar";
import axios from "axios";

import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
const pinia = createPinia();
loadFonts();
axios.defaults.baseURL = " http://192.168.1.3:5000";

const i18n = createI18n({
  locale: "en", // Default language
  messages: {
    en,
    ar,
    // Add more languages as needed
  },
});

createApp(App)
  .use(router, axios)
  .use(pinia)
  .use(i18n)
  .use(vuetify)
  .mount("#app");
