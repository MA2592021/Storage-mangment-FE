import { reactive } from "vue";
import { io } from "socket.io-client";

export const state = reactive({
  connected: false,
  fooEvents: [],
  barEvents: [],
});

// "undefined" means the URL will be computed from the `window.location` object
const URL = import.meta.env.VITE_SOCKET_URL;

export const socket = io(URL);

// socket.on("message", (message) => {
//   console.log("Received message:", message);
// });

socket.on("connect", () => {
  state.connected = true;
});

socket.on("disconnect", () => {
  state.connected = false;
});

// socket.on("test", (...args) => {
//   state.fooEvents.push(args);
//   console.log(args);
// });

socket.on("bar", (...args) => {
  state.barEvents.push(args);
});
