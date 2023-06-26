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
import { state, socket } from "./socket.js";
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
    console.log(state);
  },
  data() {
    return {
      fooEvents: [],
    };
  },
  mounted() {
    socket.on("errors", (message) => {
      console.log(message);
      toast.error("error in card " + message.card.code, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    });
    socket.on("repairs", (message) => {
      console.log(message);
      toast.info(
        `stage ${message.stage.code} repaired in card ` + message.card.code,
        {
          position: toast.POSITION.BOTTOM_RIGHT,
        }
      );
    });
    socket.on("addTracking", (message) => {
      console.log(message);
      toast.success(
        `stage ${message.stage.code} tracked in card ` + message.card.code,
        {
          position: toast.POSITION.BOTTOM_RIGHT,
        }
      );
    });
    socket.on("errorConfirm", (message) => {
      console.log(message);
      toast.success(
        `stage ${message.stage.code} repaired & confirmed in card ` +
          message.card.code,
        {
          position: toast.POSITION.BOTTOM_RIGHT,
        }
      );
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
