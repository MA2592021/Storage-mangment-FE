<template>
  <v-app>
    <navbarVue v-if="routePath !== '/login'" />
    <v-main class="ma-4">
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import navbarVue from "./components/layout/navbar.vue";
import axios from "axios";
export default {
  name: "App",
  components: {
    navbarVue,
  },
  created() {
    console.log("Client request received: Vue app is created");
    // Perform any initial setup or fetch data here
    axios.get("/");
  },
  computed: {
    routePath() {
      return this.$route.path;
    },
  },
};
</script>
