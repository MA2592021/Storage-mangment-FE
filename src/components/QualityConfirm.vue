<template>
  <v-row>
    <v-col cols="12">
      <v-autocomplete
        v-model="selectedOrder"
        :items="orders"
        item-title="name"
        return-object
        :label="$t('order')"
      ></v-autocomplete>
    </v-col>
    <v-col cols="12">
      <v-autocomplete
        v-model="selectedModel"
        :items="selectedOrder.models"
        item-title="name"
        item-value="id"
        :label="$t('model')"
        @update:modelValue="load_cards()"
      ></v-autocomplete>
    </v-col>
    <v-col cols="12">
      <v-autocomplete
        v-model="selectedCard"
        :items="cards"
        item-title="code"
        item-value="id"
        inputmode="numeric"
        :label="$t('card code')"
        :disabled="selected_confirm.length !== 0"
        @update:modelValue="load_card_Errors"
      ></v-autocomplete>
    </v-col>
  </v-row>

  <v-data-table
    :headers="headers1"
    :items="stages"
    show-select
    class="elevation-1"
    v-model="selected_confirm"
    return-object
  >
  </v-data-table>
  <v-row
    ><v-col align="center" class="mt-4"
      ><v-btn color="success" :loading="loading" @click="submit()">{{
        $t("submit")
      }}</v-btn></v-col
    ></v-row
  >
</template>

<script>
import axios from "axios";
import swal from "sweetalert";
export default {
  data() {
    return {
      selectedOrder: localStorage.getItem("quality_order")
        ? JSON.parse(localStorage.getItem("quality_order"))
        : "",
      selectedModel: localStorage.getItem("quality_model")
        ? localStorage.getItem("quality_model")
        : "",
      selected_confirm: [],
      cards: [],
      selectedCard: "",
      stages: [],
      headers1: [{ title: "stage", key: "name" }],
      loading: false,
    };
  },
  methods: {
    load_cards() {
      console.log(this.selected_confirm);
      if (this.selectedModel !== null) {
        this.cards = [];
        axios
          .get(
            `/api/card/order/${this.selectedOrder.id}/model/${this.selectedModel}`
          )
          .then((res) => {
            this.cards = res.data.data
              .filter((card) => !card.done)
              .map((card) => ({
                code: card.code + ` (box '${card.boxNumber}' )`,

                id: card._id,
              }));
          });
      }
    },
    load_card_Errors() {
      if (this.selectedCard !== null) {
        axios
          .get(`/api/card/${this.selectedCard}/errors/repair`)
          .then((res) => {
            this.stages = res.data.data.map((stage) => ({
              name: stage.stage.name + `( ${stage.stage.code})`,
              id: stage.stage._id,
            }));
          });
        console.log(this.stages);
      }
    },
    submit() {
      if (this.selected_confirm.length !== 0) {
        this.loading = true;
        const stages = [];
        this.selected_confirm.forEach((element) => {
          stages.push(element.id);
        });
        axios
          .patch(`/api/card/${this.selectedCard}/errors/confirm/all`, {
            verifiedBy: localStorage.getItem("employee"),
            stages: stages,
          })
          .then(() => {
            swal("success", "Errors Confirmed successfully", "success");
            this.loading = false;
          })
          .then((val) => {
            if (val) {
              this.restart();
            }
          })
          .catch(() => (this.loading = false));
      }
    },
    restart() {
      this.$router.go(0);
    },
  },
  props: {
    orders: Array,
  },
  created() {
    if (this.selectedModel !== "") {
      this.load_cards();
    }
  },
};
</script>
