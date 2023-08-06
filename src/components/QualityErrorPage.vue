<template>
  <v-row
    ><v-col cols="12">
      <v-autocomplete
        :label="$t(`order`)"
        :items="orders"
        item-title="name"
        return-object
        v-model="selectedOrder"
      ></v-autocomplete>
    </v-col>
    <v-col cols="12">
      <v-autocomplete
        :label="$t(`model`)"
        :items="selectedOrder !== null ? selectedOrder.models : ''"
        item-title="name"
        item-value="id"
        v-model="selectedModel"
        @update:modelValue="load_cards"
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
      ></v-checkbox>
    </template>
  </v-data-table>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      selectedOrder: localStorage.getItem("quality_order")
        ? JSON.parse(localStorage.getItem("quality_order"))
        : "",
      selectedModel: localStorage.getItem("quality_model")
        ? localStorage.getItem("quality_model")
        : "",
      card_errors: [],
      headers: [
        {
          title: "الكارتة",
          align: "start",

          key: "card",
        },
        { sortable: false, title: "مرحلة", key: "stage" },
        { sortable: false, title: "رقم القطعة", key: "piece" },
        { sortable: false, title: " مشكلة كارتة", key: "global" },
      ],
      groupBy: [
        {
          title: "الكارتة",
          align: "start",
          sortable: false,
          key: "card",
        },
      ],
      search: "",
    };
  },
  props: {
    orders: Array,
  },
  created() {
    if (this.selectedModel !== "") {
      this.load_cards();
    }
  },
  methods: {
    load_cards() {
      if (this.selectedModel !== "") {
        axios
          .get(
            `/api/card/order/${this.selectedOrder.id}/model/${this.selectedModel}/errors`
          )
          .then((res) => {
            console.log(res);
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
                  x.piece = el.pieceNo;
                  x.global = true;
                  x.card = element.code;
                  this.card_errors.push(x);
                }
              });
            });
            console.log(this.card_errors);
          });
      }
    },
  },
};
</script>
