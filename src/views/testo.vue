<template>
  <v-btn @click="test()">tetst</v-btn>
  <p>State: {{ connected }}</p>
  <v-btn @click="connect()">Connect</v-btn>
  <v-btn @click="disconnect()">Disconnect</v-btn>
  <v-btn @click="send()">send test</v-btn>
</template>

<script>
import { toast } from "vue3-toastify";
import { state, socket } from "@/socket";
export default {
  created() {
    socket.on("test", (...args) => {
      console.log(args);
      toast.success(args, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    });
    toast.success("Wow so easy!", {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
    toast.success("Wow so easy!", {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
    toast.success("Wow so easy!", {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
    console.log(import.meta.env.VITE_PRODUCTION);
  },
  methods: {
    test() {
      toast.success("Wow so sseasy!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    },
    connect() {
      socket.connect();
    },
    disconnect() {
      socket.disconnect();
    },
    send() {
      socket.timeout(1000).emit("test", "mydataisherebbe", () => {
        console.log("done sent");
      });
    },
  },
  computed: {
    connected() {
      return state.connected;
    },
  },
};
</script>
