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
import { usedata } from "./stores/mainStore";
import { state, connectSocket } from "./socket.js";
import { toast } from "vue3-toastify";
import { watch } from "vue";
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
    // setTimeout(() => {
    //   console.log(
    //     "socket state",
    //     state.connected === true ? "connected" : "not connected"
    //   );
    // }, 300);
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
  mounted() {},
  // setup() {
  //   const maindata = usedata();
  //   watch(
  //     () => maindata.rolenum,
  //     (newValue) => {
  //       // This function will be triggered when the 'piniaAttribute' changes

  //       console.log("role Updated : ", newValue);

  //       if (newValue === 1 || newValue === 0) {
  //         const socket = connectSocket();
  //         console.log("socket now is listening");

  //         socket.on("errors", (message) => {
  //           console.log(message);
  //           toast.error("error in card " + message.card.code, {
  //             position: toast.POSITION.BOTTOM_RIGHT,
  //           });
  //         });
  //         socket.on("repairs", (message) => {
  //           console.log(message);
  //           toast.info(
  //             `stage ${message.stage.code} repaired in card ` +
  //               message.card.code,
  //             {
  //               position: toast.POSITION.BOTTOM_RIGHT,
  //             }
  //           );
  //         });
  //         socket.on("addTracking", (message) => {
  //           console.log(message);
  //           toast.success(
  //             `stage ${message.stage.code} tracked in card ` +
  //               message.card.code,
  //             {
  //               position: toast.POSITION.BOTTOM_RIGHT,
  //             }
  //           );
  //         });
  //         socket.on("errorConfirm", (message) => {
  //           console.log(message);
  //           toast.success(
  //             `stage ${message.stage.code} repaired & confirmed in card ` +
  //               message.card.code,
  //             {
  //               position: toast.POSITION.BOTTOM_RIGHT,
  //             }
  //           );
  //         });
  //         socket.on("message", (message) => {
  //           console.log("Received message:", message);
  //           toast.success(message, {
  //             position: toast.POSITION.BOTTOM_RIGHT,
  //           });
  //         });
  //       } else {
  //         const socket = connectSocket();
  //         socket.disconnect();
  //         console.log("socket disconnected", !state.connected);
  //       }
  //     }
  //   );
  //   return { maindata };
  // },
};
</script>
