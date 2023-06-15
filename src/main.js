import { createApp } from "vue";
import { createPinia } from "pinia";
import { createI18n } from "vue-i18n";
import en from "./locales/en";
import ar from "./locales/ar";
import axios from "axios";
import swal from "sweetalert";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import vue3Highlightjs from "vue3-highlightjs";
import "highlight.js/styles/dracula.css";
const pinia = createPinia();
loadFonts();
axios.defaults.baseURL = " http://192.168.1.3:5000";
axios.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const originalRequest = error.config;
    const refreshToken = localStorage.getItem("refreshToken");
    if (error.response) {
      if (
        error.response.status === 401 &&
        !originalRequest._retry &&
        refreshToken
      ) {
        originalRequest._retry = true;

        // Make a request to refresh the access token using the refresh token
        return axios
          .post("/api/auth/token", { refreshToken })
          .then((response) => {
            const { accessToken } = response.data;
            console.log("token refresh");
            // Update the stored access token and refresh token
            localStorage.setItem("accessToken", accessToken);

            // Update the Authorization header with the new access token
            axios.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${accessToken}`;

            // Retry the original request
            originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
            return axios(originalRequest);
          })
          .catch((error) => {
            // Handle refresh token request error
            // For example, redirect the user to the login page
            localStorage.clear();
            router.push("/login");
            swal("error", "sorry you have to login again", "error");
            return Promise.reject(error);
          });
      }
      if (error.response.status !== 405) {
        swal(
          "error",
          error.response.data.errors
            ? error.response.data.errors[0].msg
            : error.message,
          "error"
        );
      }
    }

    return Promise.reject(error);
  }
);
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
  .use(vue3Highlightjs)
  .mount("#app");
