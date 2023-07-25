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
    :sort-by="sortBy"
    item-value="name"
    class="elevation-1 mt-4"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title align="center">Add Stages</v-toolbar-title>
        <v-btn @click="add" variant="tonal" color="info">+ Add stage</v-btn>
      </v-toolbar></template
    >
    <template v-slot:item.parallel="{ item, index }">
      <v-checkbox
        class="ml-4"
        :disabled="index === 0"
        @update:modelValue="parallelize(index)"
        v-model="item.raw.parallel"
      ></v-checkbox>
    </template>
    <template v-slot:item.id[name]="props">
      <v-autocomplete
        :error="props.item.raw.error"
        :error-messages="
          props.item.raw.error === true ? 'please check this stage' : ''
        "
        label="stages"
        :items="data"
        item-title="name"
        return-object
        v-model="props.item.raw.id"
      ></v-autocomplete>
    </template>
    <template v-slot:item.actions="{ item, index }">
      <v-btn
        color="warning"
        :disabled="index === 0 || item.raw.parallel === true"
        @click="up(index)"
        class="mr-2"
        >&#8593;</v-btn
      >
      <v-btn
        color="info"
        :disabled="index === items.length - 1 || item.raw.parallel === true"
        @click="down(index)"
        >&#8595;</v-btn
      >
      <v-btn
        color="red"
        :disabled="item.raw.parallel === true"
        @click="deletee(index)"
        icon="mdi-delete-circle"
        class="ml-2"
      ></v-btn>
    </template>
  </v-data-table>
  {{ items }}
  <v-btn variant="tonal" color="success" @click="save" class="mt-2">Save</v-btn>
</template>

<script>
// import { toast } from "vue3-toastify";
// import { state, socket } from "@/socket";
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
    // test() {
    //   toast.success("Wow so sseasy!", {
    //     position: toast.POSITION.BOTTOM_RIGHT,
    //   });
    // },
    // connect() {
    //   socket.connect();
    // },
    // disconnect() {
    //   socket.disconnect();
    // },
    // send() {
    //   socket.timeout(1000).emit("test", "mydataisherebbe", () => {
    //     console.log("done sent");
    //   });
    // },
    add() {
      this.counter++;
      this.items.push({
        id: "",
        priority: this.counter,
        error: false,
        parallel: false,
      });
    },
    parallelize(index) {
      console.log(index);
      if (index === 0) {
        console.log("oh no");
      } else {
        if (this.items[index].parallel === false) {
          console.log("parallel here bbe");
          if (this.items[index].priority === this.items[index - 1].priority) {
          } else {
            for (let i = index; i < this.items.length; i++) {
              console.log(i);
              this.items[i].priority = this.items[i].priority - 1;
            }
            this.counter = this.items[this.items.length - 1].priority;
            this.sortByAttribute("priority");
          }
        } else {
          if (this.items[index].priority === this.items[index - 1].priority) {
            console.log("unparallel here bbe");
            for (let i = index; i < this.items.length; i++) {
              console.log(i);
              this.items[i].priority = this.items[i].priority + 1;
            }
            this.counter = this.items[this.items.length - 1].priority;
            this.sortByAttribute("priority");
          }
        }
      }
    },
    async save() {
      let er = 0;
      this.items.forEach((element) => {
        if (element.name) {
          if (element.name.name) {
            element.error = false;
          } else {
            element.error = true;
            er++;
          }
        } else {
          element.error = true;
          er++;
        }
      });
      if (er === 0) {
        const dublicate = await this.getDuplicateIndices();
        console.log("dublicates", dublicate);
        if (dublicate.length === 0) {
          this.items.forEach((element) => {
            element.error = false;
          });
          console.log("here do my things", this.items);
        } else {
          dublicate.forEach((element) => {
            const index = this.items.findIndex(
              (item) => item.priority === element.priority
            );
            this.items[index].error = true;
          });
          swal("error", "there is dublicated stages", "error");
        }
      } else {
        swal("error", "there is empty stages", "error");
      }
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
    deletee(index) {
      const pir = this.items[index].priority;
      swal("Are you sure want to delete this stage").then((val) => {
        if (val) {
          for (let i = index + 1; i < this.items.length; i++) {
            this.items[i].priority = this.items[i].priority - 1;
          }

          this.items.splice(index, 1);
          this.counter = +this.items[this.items.length - 1].priority;
          swal("success", "stage deleted successfully", "success");
        }
      });
    },
    async getDuplicateIndices() {
      const lookup = await this.items.reduce((a, e) => {
        a[e.name._id] = ++a[e.name._id] || 0;
        return a;
      }, {});

      return this.items.filter((e) => lookup[e.name._id]);
    },
  },
  computed: {
    // connected() {
    //   return state.connected;
    // },
    duplicateIndices() {
      return this.getDuplicateIndices(this.myArray, "name.name");
    },
  },
  data() {
    return {
      data: [],
      counter: 1,
      itemsPerPage: 5,
      headers: [
        {
          title: "parallel",
          align: "center",
          key: "parallel",
          width: "10%",
          sortable: false,
        },
        { title: "priority", align: "center", key: "priority", width: "10%" },
        {
          title: "Choose stage",
          align: "center",
          sortable: false,
          key: "id[name]",
          width: "30%",
        },

        { title: "type", align: "end", key: "id.type" },
        {
          title: "machine type",
          align: "center",
          key: "id.machineType.name",
        },
        { title: "rate", align: "end", key: "id.rate" },
        { title: "Actions", align: "center", key: "actions" },
      ],
      sortBy: [{ key: "priority", order: "asc" }],
      items: [
        {
          id: "",
          priority: 1,
          error: false,
          parallel: false,
        },
      ],
    };
  },
};
</script>
