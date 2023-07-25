<template>
  <v-card style="width: 100%" class="mt-5">
    <v-tabs v-model="tabs" grow color="#770f30">
      <v-tab value="one">{{ $t("production") }}</v-tab>
      <v-tab value="two">{{ $t("errors") }}</v-tab>
    </v-tabs>

    <v-card-text>
      <v-window v-model="tabs">
        <v-window-item value="one">
          <v-row>
            <v-col cols="12">
              <v-checkbox
                v-model="verify"
                @update:modelValue="error = false"
                :label="$t('verifing')"
                color="green"
                value="true"
                hide-details
              ></v-checkbox>
            </v-col>
            <v-col cols="12">
              <v-autocomplete
                v-model="selected_order"
                :items="orders"
                item-title="name"
                inputmode="numeric"
                return-object
                :label="$t('order')"
                v-if="!assist"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12">
              <v-autocomplete
                v-model="selected_model"
                :items="selected_order.models"
                item-title="name"
                inputmode="numeric"
                return-object
                :label="$t('model')"
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
                :label="$t('employee code')"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12">
              <v-autocomplete
                v-model="selected_card"
                :items="assist_card"
                item-title="code"
                return-object
                inputmode="numeric"
                :label="$t('card code')"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12">
              <v-autocomplete
                v-model="selected_stage"
                :items="
                  verify === false ? stageerror : selected_card.currentErrors
                "
                return-object
                :item-title="verify === false ? `name` : `name`"
                inputmode="numeric"
                :label="$t('stage code')"
              ></v-autocomplete></v-col
            ><v-col cols="12" align="center"
              ><v-btn
                outlined
                color="green"
                @click="submitproduction"
                :loading="loading"
                >{{ $t("submit") }}</v-btn
              ></v-col
            ></v-row
          >
        </v-window-item>

        <v-window-item value="two">
          <v-row
            ><v-col cols="12">
              <v-autocomplete
                v-model="selected_card_error"
                :items="orders"
                item-title="name"
                return-object
                inputmode="numeric"
                :label="$t('order')"
                v-if="!assist"
              ></v-autocomplete> </v-col
            ><v-col cols="12">
              <v-autocomplete
                v-model="selected_model_error"
                :items="
                  selected_card_error === null ? '' : selected_card_error.models
                "
                item-title="name"
                return-object
                inputmode="numeric"
                :label="$t('model')"
                v-if="!assist"
                @update:modelValue="load_card_error_admin"
              ></v-autocomplete>
            </v-col>
          </v-row>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
          <v-data-table
            :headers="headers"
            :items="card_errors"
            :group-by="groupBy"
            :search="search"
            class="elevation-1"
          ></v-data-table>
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>
<script>
import axios from "axios";
import swal from "sweetalert";
import { connectSocket } from "../../../socket.js";
export default {
  data() {
    return {
      verify: false,
      loading: false,
      tabs: "one",
      search: "",
      selected_card_error: "",
      selected_model_error: "",
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
      card_errors: [],
      groupBy: [
        {
          title: "card",
          align: "start",
          sortable: false,
          key: "card",
        },
      ],
      headers: [{ title: "stage", key: "stage" }],
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
        model = this.selected_model._id;
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
    load_card_error_assist() {
      let order = localStorage.getItem("order");
      let model = localStorage.getItem("model");
      axios
        .get(`/api/card/order/${order}/model/${model}/errors`)
        .then((res) => {
          res.data.data.forEach((element) => {
            element.currentErrors.forEach((el) => {
              let x = {};
              x.card = element.code;
              x.stage = el.name;
              this.card_errors.push(x);
            });
          });
          console.log(this.card_errors);
        });
    },
    load_card_error_admin() {
      let order = this.selected_card_error._id;
      let model = this.selected_model_error._id;
      axios
        .get(`/api/card/order/${order}/model/${model}/errors`)
        .then((res) => {
          res.data.data.forEach((element) => {
            element.currentErrors.forEach((el) => {
              let x = {};
              x.card = element.code;
              x.stage = el.name;
              this.card_errors.push(x);
            });
          });
          console.log(this.card_errors);
        });
    },
    loadorder() {
      axios.get("/api/order").then((res) => {
        res.data.data.forEach((element) => {
          let x = { models: [] };
          x.name = element.name;
          x._id = element._id;
          element.models.forEach((el) => {
            let y = {};
            y.name = el.id.name + ` (${el.code})`;
            y._id = el.id._id;
            x.models.push(y);
          });
          this.orders.push(x);
        });
      });
    },
    start() {
      this.selected_card = null;
      this.selected_card_error = null;
      this.selected_employee = null;
      this.selected_model_error = null;
      this.selected_stage = null;
      this.verify = false;
      if (localStorage.getItem("order")) {
        this.loadassist();
        this.load_card_error_assist();
      } else {
        this.loadorder();
        this.assist = false;
      }
    },
    submitproduction() {
      //console.log("card", this.selected_card);
      //console.log("employee", this.selected_employee);
      //console.log("model", this.selected_stage);
      this.loading = true;
      if (this.verify === false) {
        axios
          .patch(`/api/card/${this.selected_card._id}/tracking/add`, {
            stage: this.selected_stage.id,
            employee: this.selected_employee.id,
            enteredBy: localStorage.getItem("employee"),
          })
          .then((res) => {
            //console.log(res);
            swal("success", "تم رصد المرحلة بنجاح", "success").then(() => {
              this.start();
              this.loading = false;
            });
          });
      } else {
        axios
          .patch(`/api/card/${this.selected_card._id}/errors/repair`, {
            stage: this.selected_stage._id,
            doneBy: this.selected_employee.id,
            enteredBy: localStorage.getItem("id"),
          })
          .then((res) => {
            swal("success", "تم رصد الاصلاحات بنجاح", "success").then(() => {
              this.start();
              this.loading = false;
            });
          });
      }
      this.loading = false;
    },
  },
  computed: {
    displayText() {
      return this.employees
        .filter((employee) => employee.role.number > 3)
        .map((employee) => ({
          name: `${employee.name} (${employee.code})`,
          id: employee._id,
        }));
    },
    stageview() {
      if (verify === false) {
      } else {
      }
    },
    stageerror() {
      return this.assist_stages
        .filter((element) => element.id.type !== "quality")
        .map((el) => ({
          name: `${el.id.name} (${el.id.code})`,
          id: el.id._id,
        }));
    },
  },
  created() {
    this.start();
    this.loademployee();
  },
  mounted() {
    const socket = connectSocket();
    socket.on("errors", (message) => {
      console.log(message);
      if (!this.assist) {
        this.load_card_error_admin();
      } else {
        this.load_card_error_assist();
      }
    });
    socket.on("repairs", (message) => {
      console.log(message);
      if (!this.assist) {
        this.load_card_error_admin();
      } else {
        this.load_card_error_assist();
      }
    });
    socket.on("addTracking", (message) => {
      console.log(message);
      if (!this.assist) {
        this.load_card_error_admin();
      } else {
        this.load_card_error_assist();
      }
    });
    socket.on("errorConfirm", (message) => {
      console.log(message);
      if (!this.assist) {
        this.load_card_error_admin();
      } else {
        this.load_card_error_assist();
      }
    });
    socket.on("assistantUpdated", () => {
      console.log("im in assistant updated");
      if (!this.assist) {
      } else {
        axios
          .get("/api/userEmployee/" + localStorage.getItem("useremployee"))
          .then((res) => {
            localStorage.setItem(
              "order",
              res.data.data.work[res.data.data.work.length - 1].order._id
            );
            localStorage.setItem(
              "model",
              res.data.data.work[res.data.data.work.length - 1].model._id
            );
            this.start();
          });
      }
    });
  },
};
</script>
