<template>
  <!-- <v-btn @click="emit_test">test emit</v-btn> -->
</template>
<script>
import { usedata } from "./stores/mainStore";
import { state, connectSocket } from "./socket.js";
import { toast } from "vue3-toastify";
import notifySound from "./assets/notify.mp3";
import warningSound from "./assets/simplewarning.mp3";
import repairSound from "./assets/repair.mp3";
import successSound from "./assets/success.mp3";
export default {
  data() {
    return {
      socket: connectSocket(),
    };
  },
  mounted() {
    if (
      parseInt(this.maindata.rolenum) === 1 ||
      parseInt(this.maindata.rolenum) === 0
    ) {
      this.startlisten();
    }
  },

  methods: {
    success_sound() {
      const audio = new Audio(notifySound);
      audio.play();
    },
    error_sound() {
      const audio = new Audio(warningSound);
      audio.play();
    },
    confirm_sound() {
      const audio = new Audio(repairSound);
      audio.play();
    },
    repair_sound() {
      const audio = new Audio(successSound);
      audio.play();
    },
    emit_test() {
      console.log("im in test");
      this.socket.emit("message", 55555, () => {});
    },
    startlisten() {
      console.log("socket now is listening");
      this.socket = connectSocket();
      this.socket.on("errors", (message) => {
        console.log("errors", message);
        toast.error(` some errors in card ` + message.cardCode, {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        this.error_sound();
      });
      this.socket.on("repairs", (message) => {
        console.log("repair", message);
        toast.info(` ${message.card.code} card errors has been repaired `, {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        this.repair_sound();
      });
      this.socket.on("addTracking", (message) => {
        console.log("add tracking", message);
        toast.success(
          `stage ${message.lastStageName} tracked in card ` + message.cardCode,
          {
            position: toast.POSITION.BOTTOM_RIGHT,
          }
        );
        this.success_sound();
      });
      this.socket.on("errorConfirm", (message) => {
        console.log("error confirm", message);
        toast.success(` ${message.cardCode} card errors has been Fixed   `, {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        this.success_sound();
      });
      this.socket.on("message", (message) => {
        console.log("Received message:", message);
        toast.success(message, {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      });
    },
  },
  setup() {
    const maindata = usedata();
    return { maindata };
  },
  watch: {
    // Watcher for maindata.rolenum
    "maindata.rolenum": function (newValue) {
      console.log("role Updated : ", newValue);

      if (newValue === 1 || newValue === 0) {
        this.startlisten();
      } else {
        this.socket.disconnect();
        console.log("socket disconnected", !state.connected);
      }
    },
  },
};
</script>
