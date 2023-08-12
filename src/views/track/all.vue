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
          return-object
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
          <v-badge dot inline :color="get_dot_color(item.raw)">
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
        <template v-slot:item.trackingLength="{ item }">
          <v-chip class="ma-2">
            {{
              (
                (+item.raw.trackingLength / this.modelstageslength) *
                100
              ).toFixed(2)
            }}%
          </v-chip>
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
      <div align="center">
        <v-btn class="mx-auto" color="info" @click="printo()"
          >{{ $t("print") }}
        </v-btn>
      </div>
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
import { usedata } from "../../stores/print_data";

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
      { title: "Box number", key: "boxNumber" },
      { title: "errors", key: "piecesGotErrors" },
      { title: "last stage", key: "lastStage" },
      { title: "time finished", key: "lastStageDate" },
      { title: "Progress", key: "trackingLength" },
    ],
    orders: "",
    selectedOrder: "",
    selectedModel: "",
    cards: [],
    modelstageslength: "",
  }),
  setup() {
    const print_data = usedata();
    return { print_data };
  },
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
    printo() {
      this.print_data.title = `${this.selectedModel.name} Production State (stages No. ${this.modelstageslength})`;
      this.print_data.data = this.cards;
      this.print_data.header = this.headers;
      console.log(this.print_data);
      this.$router.push({ path: "/print" });
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
    get_dot_color(item) {
      if (item.currentErrorsLength !== 0 || item.globalErrorLength !== 0) {
        return "red";
      } else {
        return "green";
      }
    },
    card(id) {
      this.$router.push({ path: "/utils/cards/" + id });
    },
    stage(id) {
      this.$router.push({ path: "/utils/stage/" + id });
    },
    momentdate(value) {
      if (value === null) {
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
                index === self.findIndex((p) => p.id._id === person.id._id)
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
      console.log(this.selectedOrder.id, this.selectedModel.id);
      if (this.selectedModel !== null) {
        axios
          .get("/api/model/" + this.selectedModel.id)
          .then((res) => {
            console.log(res);
            this.modelstageslength = res.data.data.stages.length;
            console.log(this.modelstageslength);
          })
          .then(() => {
            axios
              .get(
                `/api/card/order/${this.selectedOrder.id}/model/${this.selectedModel.id}/production`
              )
              .then((res) => {
                this.cards = res.data.data;
                console.log(res);
              });
          });
      }
    },
  },
  created() {
    //this.loadtrack();
    this.load_order();
  },
  mounted() {
    const socket = connectSocket();
    socket.on("errors", (message) => {
      setTimeout(() => {
        console.log(message);
        const index = this.cards.findIndex(
          (card) => card.cardID === message.cardID
        );
        this.cards[index].currentErrorsLength = message.currentErrorsLength;
        this.cards[index].globalErrorsLength = message.globalErrorsLength;
        this.cards[index].piecesGotErrors = message.pieceErrors;
        this.cards[index].lastStageDate = message.date;
      }, 1500);

      //this.loadtrack();
    });
    // socket.on("repairs", (message) => {
    //   console.log(message);
    //   // index = this.cards.findIndex((card) => card.cardID === message.cardID);
    //   // this.cards[index].lastStageDate = moment(message.date).calendar();
    //   this.loadtrack();
    // });
    socket.on("addTracking", (message) => {
      setTimeout(() => {
        const index = this.cards.findIndex(
          (card) => card.cardID === message.cardID
        );
        this.cards[index].lastStage = message.lastStageName;
        this.cards[index].lastStageType = message.lastStageType;
        this.cards[index].lastStageDate = message.lastStageDate;
        this.cards[index].done = message.cardDone;
        this.cards[index].trackingLength = message.trackingLength;
      }, 1500);
    });
    socket.on("errorConfirm", (message) => {
      setTimeout(() => {
        console.log(message);
        const index = this.cards.findIndex(
          (card) => card.cardID === message.cardID
        );
        this.cards[index].globalErrorsLength = message.globalErrorsLength;

        this.cards[index].currentErrorsLength = message.currentErrorsLength;
        this.cards[index].lastStageDate = message.date;
      }, 1500);
    });
  },
};
</script>
