import { createApp } from "vue";
import { createPinia } from "pinia";
import axios from "axios";

import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
const pinia = createPinia();
loadFonts();
axios.defaults.baseURL = " http://192.168.1.2:5000";

createApp(App).use(router, axios).use(pinia).use(vuetify).mount("#app");
