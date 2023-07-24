<template>
  <!-- <v-btn @click="test()">tetst</v-btn>
  <p>State: {{ connected }}</p>
  <v-btn @click="connect()">Connect</v-btn>
  <v-btn @click="disconnect()">Disconnect</v-btn>
  <v-btn @click="send()">send test</v-btn> -->

  <v-data-table
    v-model:items-per-page="itemsPerPage"
    :headers="headers"
    :items="items"
    item-value="name"
    class="elevation-1 mt-4"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title align="center">Add Stages</v-toolbar-title>
        <v-btn @click="add" variant="tonal" color="info">+ Add stage</v-btn>
      </v-toolbar></template
    >

    <template v-slot:item.name[name]="props">
      <v-autocomplete
        :error="props.item.raw.error"
        :error-messages="
          props.item.raw.error === true ? 'please check here' : ''
        "
        label="stages"
        :items="data"
        item-title="name"
        return-object
        v-model="props.item.raw.name"
      ></v-autocomplete>
    </template>
    <template v-slot:item.actions="{ props, index }">
      <v-btn
        color="warning"
        :disabled="index === 0"
        @click="up(index)"
        class="mr-2"
        >&#8593;</v-btn
      >
      <v-btn
        color="info"
        :disabled="index === items.length - 1"
        @click="down(index)"
        >&#8595;</v-btn
      >
    </template>
  </v-data-table>
  <v-btn variant="tonal" color="success" @click="save" class="mt-2">Save</v-btn>
</template>

<script>
import { toast } from "vue3-toastify";
import { state, socket } from "@/socket";
import axios from "axios";
import swal from "sweetalert";
export default {
  created() {
    axios.get("/api/stage").then((res) => {
      //console.log(res);
      this.data = res.data.data;
    });
    // socket.on("test", (...args) => {
    //   console.log(args);
    //   toast.success(args, {
    //     position: toast.POSITION.BOTTOM_RIGHT,
    //   });
    // });
    // toast.success("Wow so easy!", {
    //   position: toast.POSITION.BOTTOM_RIGHT,
    // });
    // toast.success("Wow so easy!", {
    //   position: toast.POSITION.BOTTOM_RIGHT,
    // });
    // toast.success("Wow so easy!", {
    //   position: toast.POSITION.BOTTOM_RIGHT,
    // });
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
    add() {
      this.counter++;
      this.items.push({
        name: "",
        priority: this.counter,
        error: false,
      });
    },
    parallelize(index) {
      console.log(index);
      if (index === 0) {
        console.log("oh no");
      } else {
        if (+this.items[index].priority === +this.items[index - 1].priority) {
          console.log("here bbe");
          for (let i = index + 1; i < this.items.length; i++) {
            console.log(i);
            this.items[i].priority = this.items[i].priority - 1;
          }
          this.counter = this.items[this.items.length - 1].priority;
        }
      }
    },
    save() {
      this.sortByAttribute("priority");
      console.log(this.items);
      this.items.forEach((element, index) => {
        if (this.items.length === +index + 1) {
        } else {
          const next = this.items[index + 1];
          console.log(next);
          if (+element.priority + 1 < +next.priority) {
            swal("error", "please check stages priorities", "error");
            element.error = true;
            next.error = true;
          } else {
            element.error = false;
            next.error = false;
          }
        }
      });
    },
    sortByAttribute(attribute) {
      this.items.sort((a, b) => {
        if (a[attribute] < b[attribute]) {
          return -1;
        } else if (a[attribute] > b[attribute]) {
          return 1;
        } else {
          return 0;
        }
      });
    },
    up(index) {
      const temp = this.items[index].priority;
      this.items[index].priority = this.items[index - 1].priority;
      this.items[index - 1].priority = temp;
      this.sortByAttribute("priority");
    },
    down(index) {
      const temp = this.items[index].priority;
      this.items[index].priority = this.items[index + 1].priority;
      this.items[index + 1].priority = temp;
      this.sortByAttribute("priority");
    },
  },
  computed: {
    connected() {
      return state.connected;
    },
  },
  data() {
    return {
      data: [],
      counter: 1,
      itemsPerPage: 5,
      headers: [
        { title: "priority", align: "center", key: "priority", width: "10%" },
        {
          title: "Choose stage",
          align: "center",
          sortable: false,
          key: "name[name]",
          width: "30%",
        },

        { title: "type", align: "end", key: "name.type" },
        {
          title: "machine type",
          align: "center",
          key: "name.machineType.name",
        },
        { title: "rate", align: "end", key: "name.rate" },
        { title: "Actions", align: "center", key: "actions" },
      ],
      items: [
        {
          name: "",
          priority: 1,
          error: false,
        },
      ],
    };
  },
};
</script>
