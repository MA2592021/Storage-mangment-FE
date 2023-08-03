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
    <v-row>
      <v-col cols="6" class="ml-4">
        <v-autocomplete
          v-model="selectedOrder"
          :items="orders"
          item-title="name"
          return-object
          :label="$t('order')"
        ></v-autocomplete>
      </v-col>
      <v-col cols="5" class="ml-4">
        <v-autocomplete
          v-model="selectedModel"
          :items="selectedOrder.models"
          item-title="name"
          item-value="id"
          :label="$t('model')"
          @update:modelValue="loadtrack()"
        ></v-autocomplete> </v-col
    ></v-row>
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
        hover
      >
        <template v-slot:item.piecesGotErrors="{ item }">
          <v-badge
            dot
            inline
            :color="item.raw.currentErrorsLength > 0 ? 'red' : 'green'"
          >
            <v-chip
              class="ma-2"
              :color="item.columns.piecesGotErrors === 0 ? `green` : `red`"
              text-color="white"
            >
              {{ item.columns.piecesGotErrors }}
            </v-chip></v-badge
          >
        </template>
        <template v-slot:item.color="{ item }">
          {{ item.raw.colorName }} ({{ item.raw.colorCode }})
        </template>
        <template v-slot:item.code="{ item }">
          <v-chip @click="card(item.raw.cardID)" class="ma-2">
            {{ item.columns.code }}
          </v-chip>
        </template>
        <template v-slot:item.lastStage="{ item }">
          <v-chip class="ma-2" :color="getChipColor(item.raw.lastStageType)">
            {{ item.raw.lastStage }}
          </v-chip>
        </template>
        <template v-slot:item.lastStageDate="{ item }">
          <v-chip class="ma-2" :color="timeago(item.raw.lastStageDate)">
            {{ momentdate(item.raw.lastStageDate) }}
          </v-chip>
        </template>
      </v-data-table>
    </v-col>
    <v-col>
      <!-- <v-checkbox
        v-model="groupBy"
        label="group by Stage"
        value="{ key: `currentstage[name]`, order: `asc` }"
      ></v-checkbox>
      {{ groupBy }} -->
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
import { connectSocket } from "../../socket.js";
export default {
  data: () => ({
    search: "",
    sortBy: [],
    groupBy: [
      //{ key: `order[name]`, order: `asc` },
    ],
    headers: [
      // { key: "order[name]", title: "order" },

      { title: "card", align: "start", key: "code" },
      { title: "quantity", align: "center", key: "quantity" },
      { title: "size", key: "size" },
      { title: "color", key: "color" },
      { title: "errors", key: "piecesGotErrors" },
      { title: "last stage", key: "lastStage" },
      { title: "time finished", key: "lastStageDate" },
    ],
    orders: "",
    selectedOrder: "",
    selectedModel: "",
    cards: [],
  }),
  methods: {
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

    card(id) {
      this.$router.push({ path: "/utils/cards/" + id });
    },
    stage(id) {
      this.$router.push({ path: "/utils/stage/" + id });
    },
    momentdate(value) {
      if (value === "not started yet") {
        return "not started yet";
      } else {
        return moment(value).calendar();
      }
    },
    load_order() {
      axios.get("/api/order").then((res) => {
        this.orders = res.data.data.map((order) => ({
          name: order.name,
          id: order._id,
          models: order.models
            .filter(
              (person, index, self) =>
                index === self.findIndex((p) => p.name === person.name)
            )
            .map((model) => ({
              name: model.id.name,
              id: model.id._id,
            })),
        }));
        //console.log(res.data.data);
      });
    },
    loadtrack() {
      console.log(this.selectedOrder.id, this.selectedModel);
      axios
        .get(
          `/api/card/order/${this.selectedOrder.id}/model/${this.selectedModel}/production`
        )
        .then((res) => {
          this.cards = res.data.data;
          console.log(res);
        });
    },
  },
  created() {
    //this.loadtrack();
    this.load_order();
  },
  mounted() {
    const socket = connectSocket();
    let index = 0;
    socket.on("errors", (message) => {
      console.log(message);
      index = this.cards.findIndex((card) => card.cardID === message.cardID);
      this.cards[index].currentErrorsLength = message.currentErrorsLength;
      this.cards[index].piecesGotErrors = message.pieceErrors;
      this.cards[index].lastStageDate = moment(message.date).calendar();

      //this.loadtrack();
    });
    socket.on("repairs", (message) => {
      console.log(message);
      // index = this.cards.findIndex((card) => card.cardID === message.cardID);
      // this.cards[index].lastStageDate = moment(message.date).calendar();
      this.loadtrack();
    });
    socket.on("addTracking", (message) => {
      index = this.cards.findIndex((card) => card.cardID === message.cardID);
      this.cards[index].lastStage = message.lastStageName;
      this.cards[index].lastStageType = message.lastStageType;
      this.cards[index].lastStageDate = message.lastStageDate;
      this.cards[index].done = message.cardDone;
    });
    socket.on("errorConfirm", (message) => {
      index = this.cards.findIndex((card) => card.cardID === message.cardID);
      this.cards[index].currentErrorsLength = message.currentErrorsLength;
      this.cards[index].lastStageDate = moment(message.date).calendar();
    });
  },
};
</script>
