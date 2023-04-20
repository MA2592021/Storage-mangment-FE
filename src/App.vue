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
import messagebar from "./components/messagebar.vue";
export default {
  name: "App",
  components: {
    navbarVue,
    messagebar,
  },

  computed: {
    routePath() {
      return this.$route.path;
    },
  },
};
</script>
