<script>
import { usedata } from "./stores/mainStore";
import { state, connectSocket } from "./socket.js";
import { toast } from "vue3-toastify";
import { watch } from "vue";

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
    startlisten() {
      console.log("socket now is listening");

      this.socket.on("errors", (message) => {
        console.log(message);
        toast.error("error in card " + message.card.code, {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      });
      this.socket.on("repairs", (message) => {
        console.log(message);
        toast.info(
          `stage ${message.stage.code} repaired in card ` + message.card.code,
          {
            position: toast.POSITION.BOTTOM_RIGHT,
          }
        );
      });
      this.socket.on("addTracking", (message) => {
        console.log(message);
        toast.success(
          `stage ${message.stage.code} tracked in card ` + message.card.code,
          {
            position: toast.POSITION.BOTTOM_RIGHT,
          }
        );
      });
      this.socket.on("errorConfirm", (message) => {
        console.log(message);
        toast.success(
          `stage ${message.stage.code} repaired & confirmed in card ` +
            message.card.code,
          {
            position: toast.POSITION.BOTTOM_RIGHT,
          }
        );
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
