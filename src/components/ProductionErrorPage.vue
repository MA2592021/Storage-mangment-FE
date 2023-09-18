<template>
  <v-row
    ><v-col cols="12">
      <v-autocomplete
        v-model="selected_order"
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
        v-model="selected_model"
        :items="selected_order === null ? '' : selected_order.models"
        item-title="name"
        return-object
        inputmode="numeric"
        :label="$t('model')"
        v-if="!assist"
        @update:modelValue="loadModelErrors"
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
    :items="model_errors"
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
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      //logic
      assist: false,
      search: "",

      rolenum: localStorage.getItem("rolenum"),
      headers: [
        { title: "المرحلة", key: "stage" },
        { title: "رقم القطعة", key: "piece" },
        { title: "مشكلة عامة", key: "global" },
      ],
      groupBy: [
        {
          title: "card",
          align: "start",
          sortable: false,
          key: "card",
        },
      ],
      // arrays and selects
      orders: [],
      model_errors: [],
      selected_order: localStorage.getItem("savedOrder")
        ? JSON.parse(localStorage.getItem("savedOrder"))
        : "",
      selected_model: localStorage.getItem("savedModel")
        ? JSON.parse(localStorage.getItem("savedModel"))
        : "",
    };
  },
  methods: {
    blurs() {
      document.activeElement.blur();
    },
    //loaders
    loadModelErrors() {
      axios
        .get(
          `/api/card/order/${this.selected_order._id}/model/${this.selected_model._id}/errors`
        )
        .then((res) => {
          console.log("res", res);
          res.data.data.forEach((element) => {
            element.currentErrors.forEach((el) => {
              let x = {};
              x.card = element.code;
              x.stage = el.name;
              this.model_errors.push(x);
            });
            element.globalErrors.forEach((el) => {
              if (!el.verifiedBy) {
                const x = {};
                x.stage = el.description;
                x.card = element.code;
                x.piece = el.pieceNo;
                x.global = true;
                this.model_errors.push(x);
              }
            });
          });
          console.log(this.model_errors);
          this.blurs();
        });
    },
    //logic
  },
  created() {
    if (localStorage.getItem("order") !== null) {
      this.assist = true;
      this.selected_order = { _id: localStorage.getItem("order") };
      this.selected_model = { _id: localStorage.getItem("model") };
      this.loadModelErrors();
    }
  },
  props: {
    orders: Array,
  },
};
</script>
