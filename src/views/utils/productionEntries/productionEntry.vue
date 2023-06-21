<template>
  <v-row>
    <v-col cols="12">
      <v-autocomplete
        v-model="selected_order"
        :items="orders"
        item-title="name"
        inputmode="numeric"
        return-object
        label="order"
        v-if="!assist"
      ></v-autocomplete>
    </v-col>
    <v-col cols="12">
      <v-autocomplete
        v-model="selected_model"
        :items="selected_order.models"
        item-title="id.name"
        inputmode="numeric"
        return-object
        label="model"
        v-if="!assist"
        @update:modelValue="loadassist()"
      ></v-autocomplete>
    </v-col>
    <v-col cols="12">
      <v-autocomplete
        v-model="selected_employee"
        :items="displayText"
        item-title="name"
        inputmode="numeric"
        return-object
        label="employee code"
      ></v-autocomplete>
    </v-col>
    <v-col cols="12">
      <v-autocomplete
        v-model="selected_card"
        :items="assist_card"
        item-title="code"
        return-object
        inputmode="numeric"
        label="card code"
      ></v-autocomplete>
    </v-col>
    <v-col cols="12">
      <v-autocomplete
        v-model="selected_stage"
        :items="assist_stages"
        return-object
        item-title="id.name"
        inputmode="numeric"
        label="stage code"
      ></v-autocomplete> </v-col
    ><v-col cols="12" align="center"
      ><v-btn outlined color="green" @click="submitproduction"
        >Submit</v-btn
      ></v-col
    ></v-row
  >
</template>
<script>
import axios from "axios";
import swal from "sweetalert";
export default {
  data() {
    return {
      selected_card: "",
      selected_employee: "",
      selected_stage: "",
      selected_order: "",
      selected_model: "",
      employees: [],
      cards: [],
      assist_card: [],
      assist_stages: [],
      assist: true,
      orders: [],
    };
  },
  methods: {
    loademployee() {
      axios.get("/api/employee").then((res) => {
        this.employees = res.data.data;
      });
    },
    loadassist() {
      let order = {};
      let model = {};
      if (this.assist) {
        order = localStorage.getItem("order");
        model = localStorage.getItem("model");
      } else {
        order = this.selected_order._id;
        model = this.selected_model.id._id;
      }
      axios
        .get(`/api/card/order/${order}/model/${model}`)
        .then((res) => {
          this.assist_card = res.data.data;
          console.log(res.data.data);
        })
        .then(() => {
          axios
            .get("/api/model/" + model)
            .then((res) => (this.assist_stages = res.data.data.stages));
        });
    },
    loadorder() {
      axios.get("/api/order").then((res) => {
        this.orders = res.data.data;
      });
    },
    start() {
      if (localStorage.getItem("order")) {
        this.loadassist();
      } else {
        this.loadorder();
        this.assist = false;
      }
    },
    submitproduction() {
      console.log("card", this.selected_card);
      console.log("employee", this.selected_employee);
      console.log("model", this.selected_stage);
      axios
        .patch(`/api/card/${this.selected_card._id}/tracking/add`, {
          stage: this.selected_stage.id._id,
          employee: this.selected_employee.id,
          enteredBy: localStorage.getItem("id"),
        })
        .then((res) => {
          console.log(res);
          swal("success", "stages appended successfully", "success").then(
            () => {
              this.$router.go(0);
            }
          );
        });
    },
  },
  computed: {
    displayText() {
      return this.employees.map((employee) => ({
        name: `${employee.name} (${employee.code})`,
        id: employee._id,
      }));
    },
  },
  created() {
    this.start();
    this.loademployee();
  },
};
</script>
