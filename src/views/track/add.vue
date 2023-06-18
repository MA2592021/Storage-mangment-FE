<template>
  <v-card style="width: 100%" class="mt-5">
    <v-tabs v-model="tab" grow color="#770f30">
      <v-tab value="one" v-if="rolenum != 2">Production</v-tab>
      <v-tab value="two" v-if="rolenum != 3">Quality</v-tab>
    </v-tabs>

    <v-card-text>
      <v-window v-model="tabs">
        <v-window-item value="one">
          <v-row>
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
        </v-window-item>

        <v-window-item value="two">
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
                v-model="values"
                :items="cards"
                item-title="code"
                return-object
                inputmode="numeric"
                label="card code"
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
                v-model="values"
                :items="items"
                inputmode="numeric"
                label="stage code"
                v-if="verify"
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
                  ><v-btn block color="red" @click="decrement">
                    -
                  </v-btn></v-col
                >
                <v-col class="mt-2" cols="4" align="center">
                  <span
                    >number of pices <strong>{{ errors.length }}</strong></span
                  >
                </v-col>
                <v-col cols="4"
                  ><v-btn block color="green" @click="increment">
                    +
                  </v-btn></v-col
                >
              </v-row>
              <v-row v-for="(error, index) in errors" :key="error">
                <v-divider :thickness="8"></v-divider>
                <v-col cols="12" align="center"
                  ><span> piece {{ index + 1 }} </span></v-col
                >
                <v-col cols="4"
                  ><v-btn color="pink" @click="decrement1(index)">
                    -
                  </v-btn></v-col
                >
                <v-col class="mt-2" cols="4" align="center">
                  <span>
                    number of errors
                    <strong>{{ error.length }}</strong> in piece
                    <strong>{{ index + 1 }}</strong></span
                  >
                </v-col>
                <v-col cols="4" align="end"
                  ><v-btn color="info" @click="increment1(index)">
                    +
                  </v-btn></v-col
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
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>

<script>
import axios from "axios";
import swal from "sweetalert";
export default {
  data: () => ({
    rolenum: localStorage.getItem("rolenum"),
    tab: null,
    error: false,
    verify: false,
    errors: [],
    orders: [],
    quality: [],
    cards: [],
    assist_card: [],
    assist_stages: [],
    selected_order: "",
    selected_model: "",
    selected_card: "",
    selected_employee: "",
    selected_stage: "",

    employees: [],
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
      if (
        this.errors[index].errors[this.errors[index].errors.length - 1]
          .stage === ""
      ) {
        this.errors[index].errors.pop();
      } else {
        swal(
          "danger",
          "are you sure you want to delete last element",
          "warning"
        ).then((val) => {
          if (val) {
            this.errors[index].errors.pop();
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
      let cardErrors = [];
      this.errors.forEach((element) => {
        let x = {};
        let y = [];
        element.forEach((el) => {
          x.enteredBy = el.enteredBy;
          x.stage = el.stage.id._id;
          x.description = el.description;
          y.push(x);
        });
        cardErrors.push(y);
      });
      console.log(cardErrors);
      if (error) {
        axios
          .patch("/api/card/" + this.selected_card._id + "/errors/add", {
            cardErrors: cardErrors,
          })
          .then(() => {
            axios.patch(`/api/card/${this.selected_card._id}/tracking/add`, {});
          });
      } else {
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
        })
        .then((res) => {
          swal("success", "stages appended successfully", "success").then(
            () => {
              this.$router.go(0);
            }
          );
        });
    },
    loademployee() {
      axios.get("/api/employee").then((res) => {
        this.employees = res.data.data;
      });
    },
    loadassist() {
      let order = localStorage.getItem("order");
      let model = localStorage.getItem("model");
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
    tabs() {
      if (this.rolenum === "2") {
        return "two";
      } else if (this.rolenum === "3") {
        return "one";
      } else {
        return this.tab;
      }
    },
  },
  created() {
    if (localStorage.getItem("rolenum") === "3") {
      this.loadassist();
    }
    this.loadorders();
    this.loademployee();
    console.log(this.rolenum);
  },
};
</script>
