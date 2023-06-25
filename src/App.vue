<template>
  <v-app>
    <navbarVue v-if="routePath" />
    <v-main class="ma-4">
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import navbarVue from "./components/layout/navbar.vue";
import { socket } from "./socket.js";
import { toast } from "vue3-toastify";
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
  data() {
    return {
      fooEvents: [],
    };
  },
  mounted() {
    socket.on("test", (...args) => {
      console.log("test");
    });
    socket.on("message", (message) => {
      console.log("Received message:", message);
      toast.success(message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    });
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
