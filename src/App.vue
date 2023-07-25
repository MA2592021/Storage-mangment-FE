<template>
  <v-app>
    <navbarVue v-if="routePath" />
    <v-main class="ma-4">
      <router-view />
    </v-main>
  </v-app>
  <notification />
</template>

<script>
import navbarVue from "./components/layout/navbar.vue";
import notification from "./notification.vue";
import axios from "axios";

export default {
  name: "App",
  components: {
    navbarVue,
    notification,
  },

  created() {
    console.log("Client request received: Vue app is created");
    // Perform any initial setup or fetch data here
    axios.get("/").then((res) => {
      console.log(res.data.msg);
    });

    if (localStorage.getItem("locale")) {
    } else {
      localStorage.setItem("locale", "en");
    }
    console.log(localStorage.getItem("locale"));
  },

  computed: {
    routePath() {
      if (this.$route.path === "/login" || this.$route.path === "/print") {
        return false;
      } else {
        return true;
      }
    },
  },
};
</script>
