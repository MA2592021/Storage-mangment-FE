<template>
  <v-bottom-navigation
    grow
    v-model="nav"
    mode="shift"
    absolute
    :bg-color="bar_color()"
  >
    <v-btn value="track">
      <v-icon>mdi-flag-plus</v-icon>

      {{ $t("track") }}
    </v-btn>

    <v-btn value="repair">
      <v-icon>mdi-hammer-screwdriver</v-icon>

      {{ $t("repair") }}
    </v-btn>

    <v-btn value="errors" @click="errorbadge = 0">
      <v-badge color="error" v-if="errorbadge !== 0" :content="errorbadge">
        <v-icon>mdi-alert-circle-outline</v-icon></v-badge
      >
      <v-icon v-if="errorbadge === 0">mdi-alert-circle-outline</v-icon>
      {{ $t("errors") }}
    </v-btn>
  </v-bottom-navigation>
  <v-card style="width: 100%" class="mt-5">
    <v-card-text>
      <v-window v-model="nav" disabled>
        <v-window-item value="track">
          <v-row>
            <!-- <v-col cols="12">
              <v-checkbox
                v-model="verify"
                @update:modelValue="error = false"
                :label="$t('verifing')"
                color="green"
                value="true"
                hide-details
              ></v-checkbox>
            </v-col> -->
            <v-col cols="12">
              <v-autocomplete
                v-model="selected_order"
                :items="orders"
                item-title="name"
                return-object
                :label="$t('order')"
                v-if="!assist"
                @update:modelValue="blurs"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12">
              <v-autocomplete
                v-model="selected_model"
                :items="selected_order.models"
                item-title="name"
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
                @update:modelValue="blurs"
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
                @update:modelValue="blurs"
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
                @update:modelValue="blurs"
              ></v-autocomplete></v-col
            ><v-col cols="12" align="center"
              ><v-btn
                outlined
                color="green"
                @click="submitproduction"
                :loading="loading"
                >{{ $t("submit") }}</v-btn
              ><v-btn
                outlined
                color="red"
                class="ml-4"
                v-if="!assist"
                @click="replacetrack"
                :loading="loading"
                >{{ $t("replace") }}</v-btn
              >
            </v-col></v-row
          >
        </v-window-item>
        <v-window-item value="repair">
          <v-row>
            <v-col cols="12">
              <v-autocomplete
                v-model="selected_order"
                :items="orders"
                item-title="name"
                return-object
                :label="$t('order')"
                v-if="!assist"
                @update:modelValue="blurs"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12">
              <v-autocomplete
                v-model="selected_model"
                :items="selected_order.models"
                item-title="name"
                return-object
                :label="$t('model')"
                v-if="!assist"
                @update:modelValue="loadassist()"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12">
              <v-autocomplete
                v-model="selected_repair_card"
                :items="assist_card"
                item-title="code"
                item-value="_id"
                inputmode="numeric"
                :label="$t('card code')"
                :disabled="selected_repairs.length !== 0"
                @update:modelValue="load_repairs"
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
            :headers="headers1"
            :items="repiarstages"
            :search="search"
            show-select
            class="elevation-1"
            v-model="selected_repairs"
            return-object
          >
            <template v-slot:item.check="{ item, index }">
              <v-checkbox class="ml-4" v-model="item.raw.check"></v-checkbox>
            </template>
            <template v-slot:item.employee[name]="props">
              <v-autocomplete
                label="employee"
                :items="displayText"
                item-title="name"
                item-value="_id"
                v-model="props.item.raw.employee"
                :readonly="props.item.raw.check === false"
                @update:modelValue="blurs"
              ></v-autocomplete>
            </template>
          </v-data-table>
          <v-row
            ><v-col align="center" class="mt-4"
              ><v-btn color="success" :loading="loading" @click="repiar()">{{
                $t("submit")
              }}</v-btn></v-col
            ></v-row
          >
        </v-window-item>
        <v-window-item value="errors">
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
                @update:modelValue="blurs"
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
          >
            <template v-slot:item.global="{ item }">
              <v-checkbox
                readonly
                color="red"
                class="ml-4"
                v-model="item.raw.global"
              ></v-checkbox> </template
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
      errorbadge: 0,
      nav: "track",
      search: "",
      selected_card_error: "",
      selected_model_error: "",
      selected_card: "",
      selected_repair_card: "",
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
      headers: [
        { title: "المرحلة", key: "stage" },
        { title: "رقم القطعة", key: "piece" },
        { title: "مشكلة عامة", key: "global" },
      ],
      headers1: [
        { title: "المرحلة", key: "stage[name]" },
        {
          title: "العامل",
          key: "employee[name]",
        },
        { title: "عامل اخر", key: "check" },
      ],
      repiarstages: [],
      selected_repairs: [],
    };
  },
  methods: {
    blurs() {
      document.activeElement.blur();
    },
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
        .get(`/api/card/order/${order}/model/${model}/codes`)
        .then((res) => {
          this.assist_card = res.data.data;
          console.log(res.data.data);
        })
        .then(() => {
          axios
            .get("/api/model/" + model)
            .then((res) => (this.assist_stages = res.data.data.stages));
        });
      this.blurs();
    },
    load_card_error_assist() {
      const order = localStorage.getItem("order")
        ? localStorage.getItem("order")
        : "";
      const model = localStorage.getItem("model")
        ? localStorage.getItem("model")
        : "";
      if (model !== "") {
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
      }
    },
    load_card_error_admin() {
      const order =
        this.selected_card_error !== null ? this.selected_card_error._id : "";
      const model =
        this.selected_model_error !== null ? this.selected_model_error._id : "";
      if (model !== "") {
        axios
          .get(`/api/card/order/${order}/model/${model}/errors`)
          .then((res) => {
            console.log("res", res);
            res.data.data.forEach((element) => {
              element.currentErrors.forEach((el) => {
                let x = {};
                x.card = element.code;
                x.stage = el.name;
                this.card_errors.push(x);
              });
              element.globalErrors.forEach((el) => {
                if (!el.verifiedBy) {
                  const x = {};
                  x.stage = el.description;
                  x.card = element.code;
                  x.piece = el.pieceNo;
                  x.global = true;
                  this.card_errors.push(x);
                }
              });
            });
            console.log(this.card_errors);
            this.blurs();
          });
      }
    },
    loadorder() {
      axios.get("/api/order").then((res) => {
        console.log("res", res.data.data);
        res.data.data.forEach((element) => {
          let x = { models: [] };
          x.name = element.name;
          x._id = element._id;
          (x.models = element.models
            .filter(
              (person, index, self) =>
                index === self.findIndex((p) => p.id._id === person.id._id)
            )
            .map((model) => ({
              name: model.id.name,
              _id: model.id._id,
            }))),
            // element.models.forEach((el) => {
            //   let y = {};
            //   y.name = el.id.name + ` (${el.code})`;
            //   y._id = el.id._id;
            //   x.models.push(y);
            // });
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
      if (this.selected_card === null) {
        swal("error", "please select card", "error");
      } else {
        this.loading = true;

        axios
          .patch(`/api/card/${this.selected_card._id}/tracking/add`, {
            stage: this.selected_stage.id,
            employee: this.selected_employee.id,
            enteredBy: localStorage.getItem("employee"),
          })
          .then((res) => {
            //console.log(res);
            swal("success", "تم رصد المرحلة بنجاح", "success").then(() => {
              console.log("add track", res);
              this.start();
              this.loading = false;
            });
          })
          .catch(() => (this.loading = false));
      }
    },
    load_repairs() {
      if (this.selected_repair_card !== null) {
        console.log(this.selected_repair_card);
        this.repiarstages = [];
        axios
          .get(`/api/card/${this.selected_repair_card}/errors/repair`)
          .then((res) => {
            console.log(res.data.data);

            res.data.data.forEach((element) => {
              const x = {};
              element.employee
                ? (x.employee = {
                    name:
                      `${element.employee.name} ` +
                      ` ( ${element.employee.code} )`,
                    _id: element.employee._id,
                  })
                : "";
              x.stage = {
                name: `${element.stage.name} ` + ` ( ${element.stage.code} )`,
                _id: element.stage._id,
              };
              x.check = false;
              this.repiarstages.push(x);
            });
          });
        console.log(this.repiarstages);
        this.blurs();
      }
    },
    replacetrack() {
      console.log(this.selected_employee.id);
      if (this.selected_card === null) {
        swal("error", "please select card", "error");
      } else {
        this.loading = true;
        axios
          .patch(`/api/card/${this.selected_card._id}/tracking/replace`, {
            stage: this.selected_stage.id,
            employee: this.selected_employee.id,
            enteredBy: localStorage.getItem("employee"),
          })
          .then((res) => {
            swal(
              "success",
              "replace employee done successfully",
              "success"
            ).then(() => {
              this.start();
              this.loading = false;
              this.$router.go(0);
            });
          })
          .catch(() => {
            this.loading = false;
          });
      }
    },
    repiar() {
      if (this.selected_repairs.length === 0) {
        swal("error", "برجاء اختيار مراحل للاصلاح", "error");
      } else {
        this.loading = true;
        const data = [];
        this.selected_repairs.forEach((element) => {
          const x = {};
          x.stage = element.stage._id;
          if (element.employee) {
            x.employee = element.employee._id;
          } else {
            return;
          }
          data.push(x);
        });
        console.log(data);
        axios
          .patch(`/api/card/${this.selected_repair_card}/errors/repair/all`, {
            enteredBy: localStorage.getItem("employee"),
            repairs: data,
          })
          .then((res) => {
            console.log(res);
            this.loading = false;
            swal("success", "تم رصد الاصلاحات بنجاح", "success").then(() => {
              this.$router.go(0);
            });
          })
          .catch((err) => {
            this.loading = false;
          });
      }
    },
    bar_color() {
      if (this.nav === "track") {
        return "success";
      } else if (this.nav === "repair") {
        return "info";
      } else {
        return "red";
      }
    },
  },
  computed: {
    displayText() {
      return this.employees
        .filter((employee) => employee.role.number >= 3)
        .map((employee) => ({
          name: `${employee.name} (${employee.code})`,
          id: employee._id,
        }));
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
      //console.log(message);
      this.errorbadge++;
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
