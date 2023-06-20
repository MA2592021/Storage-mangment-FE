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
          <v-chip
            class="ma-2"
            :color="item.columns.errors === 0 ? `green` : `red`"
            text-color="white"
          >
            {{ item.columns.errors }}
          </v-chip>
        </template>
        <template v-slot:item.stage="{ item }">
          <v-chip
            class="ma-2"
            :color="getChipColor(item.raw.currentstage.type)"
          >
            {{
              item.raw.currentstage.name
                ? item.raw.currentstage.name
                : "not started yet"
            }}
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
      { title: "quantity", key: "qty" },
      { title: "errors", key: "errors" },
      { title: "current stage", key: "stage" },
      { title: "last stage done", key: "date" },
    ],

    cards: [],
  }),
  methods: {
    getChipColor(type) {
      if (type === "preperation") {
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
  },
  created() {
    axios.get("/api/card/last/100").then((res) => {
      this.cards = [];
      console.log(res.data.data);
      res.data.data.forEach((element) => {
        let x = {};
        x._id = element._id;
        x.model = element.model.name;
        x.order = element.order.name;
        x.qty = element.quantity;
        x.currentstage =
          element.tracking.length === 0
            ? ""
            : element.tracking[element.tracking.length - 1].stage;
        x.errors = element.cardErrors.length;
        x.date = moment(element.updatedAt).calendar();
        this.cards.push(x);
      });
      console.log(this.cards);
    });
  },
};
</script>
<style scoped>
.green {
  color: green;
}
.red {
  color: red;
}
.pur {
  color: purple;
}
</style>
