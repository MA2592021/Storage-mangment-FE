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

    <v-btn value="hold_up_time">
      <v-icon>mdi-clock-time-eight</v-icon>

      {{ $t("hold_up_time") }}
    </v-btn>
  </v-bottom-navigation>
  <v-card style="width: 100%" class="mt-5">
    <v-card-text>
      <v-window v-model="nav" disabled>
        <v-window-item value="track">
          <ProductionAddTracking
            v-bind:orders="orders"
            v-bind:employees="employees"
          />
        </v-window-item>
        <v-window-item value="repair">
          <ProductionRepair
            v-bind:orders="orders"
            v-bind:employees="employees"
          />
        </v-window-item>
        <v-window-item value="errors">
          <ProductionErrorPage v-bind:orders="orders" />
        </v-window-item>
        <v-window-item value="hold_up_time">
          <hold_up_time />
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>
<script>
import axios from "axios";
import { socket } from "../../../socket.js";
import ProductionAddTracking from "../../../components/ProductionAddTracking.vue";
import ProductionRepair from "../../../components/ProductionRepair.vue";
import ProductionErrorPage from "../../../components/ProductionErrorPage.vue";
import hold_up_time from "../../../components/hold_up_time.vue";
export default {
  components: {
    ProductionAddTracking,
    ProductionRepair,
    ProductionErrorPage,
    hold_up_time,
  },
  data() {
    return {
      errorbadge: 0,
      nav: "track",
      orders: [],
      employees: [],
    };
  },
  methods: {
    loademployee() {
      axios.get("/api/employee").then((res) => {
        this.employees = res.data.data
          .filter((employee) => employee.role.number >= 3)
          .map((employee) => ({
            name: `${employee.name} (${employee.code})`,
            _id: employee._id,
          }));
      });
    },
    loadorders() {
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
    bar_color() {
      if (this.nav === "track") {
        return "success";
      } else if (this.nav === "repair") {
        return "info";
      } else if (this.nav === "hold_up_time") {
        return "warning";
      } else {
        return "red";
      }
    },
  },
  created() {
    this.loademployee();
    this.loadorders();
  },
  mounted() {
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
