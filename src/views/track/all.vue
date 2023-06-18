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
        :items="desserts"
        :sort-by="sortBy"
        :search="search"
        multi-sort
        items-per-page="50"
        class="elevation-1"
        item-value="name"
      >
        <template v-slot:item.errors="{ item }">
          <v-chip
            class="ma-2"
            :color="item.columns.errors === '0' ? `green` : `red`"
            text-color="white"
          >
            {{ item.columns.errors }}
          </v-chip>
        </template>
        <template v-slot:item.stage.name="{ item }">
          <v-chip class="ma-2" :color="getChipColor(item.raw.stage.type)">
            {{ item.columns.stage.name }}
          </v-chip>
        </template>
      </v-data-table>
    </v-col></v-row
  >
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    search: "",
    sortBy: [
      { key: "date", order: "dsc" },
      { order: "asc", key: "model" },
    ],
    groupBy: [{ key: "order", order: "asc" }],
    headers: [
      { title: "model", key: "model" },
      { title: "card", key: "card" },
      { title: "errors", key: "errors" },
      { title: "current stage", key: "stage.name" },
      { title: "last stage done", key: "date" },
    ],
    desserts: [
      {
        order: "dafa1",
        model: "dafa",
        card: "231",
        errors: "1",
        stage: { name: "ta2te3", type: "preperation" },
        date: "2023-05-13T20:58:16",
      },
      {
        order: "dafa1",
        model: "abo el feda",
        card: "510",
        errors: "0",
        stage: { name: "geb", type: "production" },
        date: "2023-05-15T20:58:16",
      },
      {
        order: "dafa1",
        model: "dafa",
        card: "632",
        errors: "2",
        stage: { name: "ta3leb", type: "finshing" },
        date: "2023-06-5T20:58:16",
      },
      {
        order: "dafa2",
        model: "dafa",
        card: "547",
        errors: "0",
        stage: { name: "banda", type: "production" },
        date: "2023-05-13T20:58:16",
      },
      {
        order: "dafa2",
        model: "abo el feda",
        card: "912",
        errors: "4",
        stage: { name: "ta3leb", type: "finshing" },
        date: "2023-05-13T21:58:16",
      },
      {
        order: "dafa2",
        model: "abo el feda",
        card: "312",
        errors: "0",
        stage: { name: "lol", type: "production" },
        date: "2023-05-13T18:58:16",
      },
    ],
    cards: [],
  }),
  methods: {
    getChipColor(type) {
      if (type === "preperation") {
        return "pink";
      } else if (type === "production") {
        return "info";
      } else if (type === "finshing") {
        return "green";
      } else {
        return "default";
      }
    },
  },
  created() {
    axios.get("/api/card/last/100").then((res) => {
      this.cards = [];
      console.log(res.data.data);
      res.data.data.forEach((element) => {
        let x = {};
        x.model = element.model.name;
        x.order = element.order.name;
        x.qty = element.quantity;
        x.currentstage = element.tracking[element.tracking.length - 1];
        x.errors = element.cardErrors.length;
        x.date = element.updatedAt;
        this.cards.push(x);
      });
      console.log(this.cards);
    });
  },
};
</script>
