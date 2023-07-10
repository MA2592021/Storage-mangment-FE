<template>
  <v-row>
    <v-col cols="12" class="text-center mt-4"
      ><span
        ><v-icon
          icon=" mdi-sitemap"
          style="size: #fbc02d"
          class="mb-2 mr-2"
        ></v-icon>
        <span class="text-h5" style="size: #fbc02d">{{
          $t("orders.allOrders")
        }}</span></span
      ></v-col
    >

    <v-col cols="12">
      <v-text-field
        v-model="search"
        append-inner-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>

      <v-data-table
        :group-by="groupBy"
        :headers="headers"
        :items="cards"
        :sort-by="sortBy"
        :search="search"
        multi-sort
        items-per-page="50"
        class="elevation-1"
        item-value="name"
      >
        <template v-slot:item.errors="{ item }">
          <v-badge
            dot
            inline
            :color="item.raw.currentErrors.length > 0 ? 'red' : 'green'"
          >
            <v-chip
              @click="test(item)"
              class="ma-2"
              :color="item.columns.errors === 0 ? `green` : `red`"
              text-color="white"
            >
              {{ item.columns.errors }}
            </v-chip></v-badge
          >
        </template>
        <template v-slot:item.model="{ item }">
          <v-chip @click="model(item.raw.model._id)" class="ma-2">
            {{ item.columns.model.name }}
          </v-chip>
        </template>
        <template v-slot:item.code="{ item }">
          <v-chip @click="card(item.raw._id)" class="ma-2">
            {{ item.columns.code }}
          </v-chip>
        </template>
        <template v-slot:item.stage="{ item }">
          <v-chip
            class="ma-2"
            :color="getChipColor(item.raw.currentstage.type)"
            @click="
              item.raw.currentstage.name ? stage(item.raw.currentstage._id) : ''
            "
          >
            {{
              item.raw.currentstage.name
                ? item.raw.currentstage.name
                : "not started yet"
            }}
          </v-chip>
        </template>
        <template v-slot:item.date="{ item }">
          <v-chip class="ma-2" :color="timeago(item.raw.dato)">
            {{ item.raw.date }}
          </v-chip>
        </template>
      </v-data-table>
    </v-col>
    <v-col cols="12"
      ><p style="color: red">* red is for not started yet</p>
      <p style="color: orange">* yellow is for preperation</p>
      <p style="color: #42a5f5">* blue is for production</p>
      <p style="color: purple">* purpule is for quality</p>
      <p style="color: green">* green is for finishing</p></v-col
    >
  </v-row>
</template>

<script>
import axios from "axios";
import moment from "moment";
import { socket } from "../../socket.js";
export default {
  data: () => ({
    search: "",
    sortBy: [
      { key: "date", order: "dsc" },
      { order: "asc", key: "model" },
    ],
    groupBy: [{ key: "order[name]", order: "asc" }],
    headers: [
      { title: "model", key: "model" },
      { title: "card", align: "start", key: "code" },
      { title: "quantity", align: "center", key: "qty" },
      { title: "errors", key: "errors" },
      { title: "last stage", key: "stage" },
      { title: "time finished", key: "date" },
    ],

    cards: [],
  }),
  methods: {
    test(item) {
      console.log(item);
    },
    getChipColor(type) {
      if (type === "preparations") {
        return "orange";
      } else if (type === "production") {
        return "info";
      } else if (type === "finshing") {
        return "green";
      } else if (type === "quality") {
        return "deep-purple-darken-4";
      } else {
        return "red";
      }
    },
    timeago(time) {
      const currentTime = moment();
      const inputTime = moment(time);
      const duration = moment.duration(currentTime.diff(inputTime));
      const minutesDifference = duration.asMinutes();

      if (minutesDifference < 30) {
        return "green";
      }
      return "red";
    },
    model(id) {
      this.$router.push({ path: "/model/" + id });
    },
    card(id) {
      this.$router.push({ path: "/utils/cards/" + id });
    },
    stage(id) {
      this.$router.push({ path: "/utils/stage/" + id });
    },
    loadtrack() {
      axios.get("/api/card/last/100").then((res) => {
        this.cards = [];
        console.log(res.data.data);
        res.data.data.forEach((element) => {
          let x = {};
          x._id = element._id;
          x.code = element.code;
          x.model = element.model;
          x.order = element.order;
          x.qty = element.quantity;
          x.currentErrors = element.currentErrors;
          x.currentstage =
            element.tracking.length === 0
              ? ""
              : element.tracking[element.tracking.length - 1].stage;
          x.errors = element.cardErrors.length;
          x.date =
            element.tracking.length === 0
              ? "not started yet"
              : moment(element.tracking[element.tracking.length - 1].dateOut)
                  .subtract(3, "hours")
                  .fromNow();
          x.dato =
            element.tracking.length === 0
              ? ""
              : element.tracking[element.tracking.length - 1].dateOut;
          this.cards.push(x);
        });
        //console.log(this.cards);
      });
    },
  },
  created() {
    this.loadtrack();
  },
  mounted() {
    socket.on("errors", (message) => {
      console.log(message);
      this.loadtrack();
    });
    socket.on("repairs", (message) => {
      console.log(message);
      this.loadtrack();
    });
    socket.on("addTracking", (message) => {
      console.log(message);
      this.loadtrack();
    });
    socket.on("errorConfirm", (message) => {
      console.log(message);
      this.loadtrack();
    });
  },
};
</script>
