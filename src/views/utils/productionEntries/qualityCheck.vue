<template>
  <v-row>
    <v-col cols="12">
      <v-checkbox
        v-model="verify"
        @update:modelValue="error = false"
        label="verifing error?"
        color="green"
        value="green"
        hide-details
      ></v-checkbox>
    </v-col>
    <v-col cols="12">
      <v-autocomplete
        v-model="selected_order"
        :items="orders"
        item-title="name"
        label="order"
        return-object
      ></v-autocomplete>
    </v-col>
    <v-col cols="12">
      <v-autocomplete
        v-model="selected_model"
        :items="selected_order.models"
        item-title="id.name"
        label="model"
        return-object
        @update:modelValue="loadmodel()"
      ></v-autocomplete>
    </v-col>

    <v-col cols="12">
      <v-autocomplete
        v-model="selected_card"
        :items="cards"
        item-title="code"
        return-object
        inputmode="numeric"
        label="card code"
        @update:modelValue="loadstages()"
      ></v-autocomplete>
    </v-col>
    <v-col cols="12">
      <v-autocomplete
        v-model="selected_quality"
        :items="quality"
        item-title="id.name"
        return-object
        inputmode="numeric"
        label="quality phase code"
      ></v-autocomplete>
    </v-col>
    <v-col cols="12">
      <v-autocomplete
        v-model="selected_stage"
        :items="unstages"
        inputmode="numeric"
        item-title="name"
        return-object
        label="stage code"
        v-if="verify"
      ></v-autocomplete>
    </v-col>
    <v-col cols="12">
      <v-autocomplete
        v-model="selected_employee"
        :items="displayText"
        item-title="name"
        inputmode="numeric"
        return-object
        v-if="verify"
        label=" done by employee "
      ></v-autocomplete>
    </v-col>
    <v-col cols="12">
      <v-checkbox
        v-model="error"
        label="have errors?"
        color="red"
        value="red"
        hide-details
        v-if="!verify"
      ></v-checkbox>
    </v-col>
    <v-col cols="12" v-if="error">
      <v-row>
        <v-col cols="4"
          ><v-btn block color="red" @click="decrement"> - </v-btn></v-col
        >
        <v-col class="mt-2" cols="4" align="center">
          <span
            >number of pices <strong>{{ errors.length }}</strong></span
          >
        </v-col>
        <v-col cols="4"
          ><v-btn block color="green" @click="increment"> + </v-btn></v-col
        >
      </v-row>
      <v-row v-for="(error, index) in errors" :key="error">
        <v-divider :thickness="8"></v-divider>
        <v-col cols="12" align="center"
          ><span> piece {{ index + 1 }} </span></v-col
        >
        <v-col cols="4"
          ><v-btn color="pink" @click="decrement1(index)"> - </v-btn></v-col
        >
        <v-col class="mt-2" cols="4" align="center">
          <span>
            number of errors
            <strong>{{ error.length }}</strong> in piece
            <strong>{{ index + 1 }}</strong></span
          >
        </v-col>
        <v-col cols="4" align="end"
          ><v-btn color="info" @click="increment1(index)"> + </v-btn></v-col
        >
        <v-col cols="12">
          <v-row v-for="(er, index) in error" :key="er">
            <v-col cols="12" align="center">
              <span>error number {{ index + 1 }}</span></v-col
            >

            <v-col cols="12" md="6"
              ><v-autocomplete
                v-model="er.stage"
                :items="selected_model.id.stages"
                item-title="id.name"
                label="select stage error"
                return-object
              ></v-autocomplete
            ></v-col>
            <v-col cols="12" md="6"
              ><v-autocomplete
                v-model="er.description"
                :items="test(er)"
                label="select error decription"
              ></v-autocomplete></v-col
            ><v-divider :thickness="1"></v-divider> </v-row
        ></v-col>
        <v-divider :thickness="1"></v-divider>
      </v-row>
    </v-col>
    <v-col cols="12" align="center"
      ><v-btn outlined color="green" @click="submitquality"
        >Submit</v-btn
      ></v-col
    >
  </v-row>
</template>

<script>
import axios from "axios";
import swal from "sweetalert";
export default {
  data: () => ({
    error: false,
    verify: false,
    errors: [],
    orders: [],
    quality: [],
    cards: [],
    unstages: [],
    employees: [],
    selected_order: localStorage.getItem("quality_order")
      ? JSON.parse(localStorage.getItem("quality_order"))
      : "",
    selected_model: localStorage.getItem("quality_model")
      ? JSON.parse(localStorage.getItem("quality_model"))
      : "",
    selected_card: "",
    selected_employee: "",
    selected_stage: "",

    selected_quality: null,
  }),
  methods: {
    increment() {
      if (this.selected_model === "") {
        swal("error", "please select model first", "error");
      } else {
        this.errors.push([
          {
            stage: "",
            enteredBy: localStorage.getItem("id"),
            description: null,
          },
        ]);
      }
    },
    decrement() {
      if (this.errors.length < 2) {
        swal(
          "danger",
          "are you sure you want to delete last element",
          "warning"
        ).then((val) => {
          if (val) {
            this.errors.pop();
          }
        });
      }
      this.errors.pop();
    },
    increment1(index) {
      this.errors[index].push({
        stage: "",
        enteredBy: localStorage.getItem("id"),
        description: null,
      });
    },
    decrement1(index) {
      console.log(this.errors[index][this.errors[index].length - 1]);
      if (this.errors[index][this.errors[index].length - 1].stage === "") {
        this.errors[index].pop();
      } else {
        swal(
          "danger",
          "are you sure you want to delete last element",
          "warning"
        ).then((val) => {
          if (val) {
            this.errors[index].pop();
          }
        });
      }
    },
    loadorders() {
      axios.get("/api/order").then((res) => {
        console.log(res.data.data);
        res.data.data.forEach((element) => {
          let x = {};
          let uniqueArray = [];

          // Filter out repeated objects from the array
          element.models.forEach((obj) => {
            const foundObject = uniqueArray.find(
              (item) => item.id._id === obj.id._id
            );
            if (!foundObject) {
              uniqueArray.push(obj);
            }
          });
          x.name = element.name;
          x._id = element._id;
          x.models = uniqueArray;
          this.orders.push(x);
        });
        console.log(this.orders);
      });
    },
    loadstages() {
      axios
        .get(`/api/card/${this.selected_card._id}/errors/unconfirmed`)
        .then((res) => {
          this.unstages = res.data.data;
        });
    },
    loadmodel() {
      axios
        .get("/api/model/" + this.selected_model.id._id)
        .then((res) => {
          this.selected_model.id = res.data.data;
        })
        .then(() => {
          this.loadcards();
          this.loadquality();
        });
    },
    loadquality() {
      this.selected_model.id.stages.forEach((element) => {
        if (element.id.type === "quality") {
          this.quality.push(element);
        }

        console.log(element.id.type);
      });
      console.log(this.quality);
    },
    loadcards() {
      axios
        .get(
          "/api/card/order/" +
            this.selected_order._id +
            "/model/" +
            this.selected_model.id._id
        )
        .then((res) => {
          console.log(res);
          this.cards = res.data.data;
        });
    },
    submitquality() {
      localStorage.setItem(
        "quality_order",
        JSON.stringify(this.selected_order)
      );
      localStorage.setItem(
        "quality_model",
        JSON.stringify(this.selected_model)
      );
      let cardErrors = [];
      this.errors.forEach((element) => {
        let y = [];
        element.forEach((el) => {
          let x = {};
          x.enteredBy = el.enteredBy;
          x.stage = el.stage.id._id;
          x.description = el.description;
          y.push(x);
        });
        cardErrors.push(y);
      });
      console.log(cardErrors);
      console.log(this.errors);
      if (this.error) {
        axios
          .patch("/api/card/" + this.selected_card._id + "/errors/add", {
            cardErrors: cardErrors,
          })
          .then(() => {
            swal("success", "quality check done", "success");
            // axios.patch(`/api/card/${this.selected_card._id}/tracking/add`, {});
          });
      } else if (this.verify) {
        axios
          .patch(`/api/card/${this.selected_card._id}/errors/confirm`, {
            stage: this.selected_stage._id,
            verifiedBy: localStorage.getItem("id"),
            doneBy: this.selected_employee.id,
          })
          .then((res) => {
            console.log(res);
            swal("success", "verify done", "success");
          });
      }
    },
    loademployee() {
      axios.get("/api/employee").then((res) => {
        this.employees = res.data.data;
      });
    },
    test(t) {
      if (t.stage) {
        if (t.stage.id) {
          return t.stage.id.stageErrors;
        }
      } else {
        return [];
      }
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
    this.loadorders();
    this.loademployee();
    if (localStorage.getItem("quality_model")) {
      this.loadcards();
      this.loadquality();
    }
  },
};
</script>
