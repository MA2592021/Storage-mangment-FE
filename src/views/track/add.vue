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
              <v-checkbox
                v-model="verify"
                label="verifing error?"
                color="green"
                value="green"
                hide-details
              ></v-checkbox>
            </v-col>
            <v-col cols="12">
              <v-autocomplete
                v-model="values"
                :items="displayText"
                item-title="name"
                inputmode="numeric"
                label="employee code"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12">
              <v-autocomplete
                v-model="values"
                :items="items"
                inputmode="numeric"
                label="card code"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12">
              <v-autocomplete
                v-model="values"
                :items="items"
                inputmode="numeric"
                label="stage code"
              ></v-autocomplete> </v-col
            ><v-col cols="12" align="center"
              ><v-btn outlined color="green">Submit</v-btn></v-col
            ></v-row
          >
        </v-window-item>

        <v-window-item value="two">
          <v-row>
            <v-col cols="12">
              <v-checkbox
                v-model="verify"
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
                :items="items"
                inputmode="numeric"
                label="card code"
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
                    <strong>{{ error.errors.length }}</strong> in piece
                    <strong>{{ index + 1 }}</strong></span
                  >
                </v-col>
                <v-col cols="4" align="end"
                  ><v-btn color="info" @click="increment1(index)">
                    +
                  </v-btn></v-col
                >
                <v-col cols="12">
                  <v-row v-for="(er, index) in error.errors" :key="er">
                    <v-col cols="12" align="center">
                      <span>error number {{ index + 1 }}</span></v-col
                    >

                    <v-col cols="12" md="6"
                      ><v-autocomplete
                        v-model="er.error"
                        :items="selected_model.id.stages"
                        item-title="id.name"
                        label="select stage error"
                        return-object
                      ></v-autocomplete
                    ></v-col>
                    <v-col cols="12" md="6"
                      ><v-autocomplete
                        v-model="er.desc"
                        :items="test(er)"
                        label="select error decription"
                      ></v-autocomplete></v-col
                    ><v-divider :thickness="1"></v-divider> </v-row
                ></v-col>
                <v-divider :thickness="1"></v-divider>
              </v-row>
            </v-col>
            <v-col cols="12" align="center"
              ><v-btn outlined color="green">Submit</v-btn></v-col
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
    orders: "",
    selected_order: "",
    selected_model: "",
    selected_card: "",
    employees: [],
    c: 0,
    d: 0,
  }),
  methods: {
    increment() {
      if (this.selected_model === "") {
        swal("error", "please select model first", "error");
      } else {
        this.errors.push({
          id: this.c,
          errors: [{ id: this.d, error: "", desc: null }],
        });
        this.c++;
        this.d++;
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
      this.errors[index].errors.push({
        id: this.d,
        error: "",
        desc: null,
      });
      this.d++;
    },
    decrement1(index) {
      if (
        this.errors[index].errors[this.errors[index].errors.length - 1]
          .error === ""
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
        this.orders = res.data.data;
      });
    },
    loadmodel() {
      axios.get("/api/model/" + this.selected_model.id._id).then((res) => {
        this.selected_model.id = res.data.data;
      });
    },
    loademployee() {
      axios.get("/api/employee").then((res) => {
        this.employees = res.data.data;
      });
    },
    test(t) {
      if (t.error) {
        if (t.error.id) {
          return t.error.id.stageErrors;
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
    this.loadorders();
    this.loademployee();
    console.log(this.rolenum);
  },
};
</script>
