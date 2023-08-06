<template>
  <v-row>
    <v-col cols="12">
      <v-autocomplete
        :label="$t(`order`)"
        :items="orders"
        item-title="name"
        return-object
        inputmode="numeric"
        v-model="selectedOrder"
      ></v-autocomplete>
    </v-col>
    <v-col cols="12">
      <v-autocomplete
        :label="$t(`model`)"
        :items="selectedOrder !== null ? selectedOrder.models : ''"
        item-title="name"
        item-value="id"
        inputmode="numeric"
        v-model="selectedModel"
        @update:modelValue="load_cards"
      ></v-autocomplete>
    </v-col>
    <v-col cols="12">
      <v-autocomplete
        :label="$t(`card code`)"
        :items="cards"
        inputmode="numeric"
        item-title="code"
        v-model="selectedCard"
        return-object
      ></v-autocomplete> </v-col
    ><v-col cols="12">
      <v-autocomplete
        :label="$t(`description`)"
        :items="['استعواض', 'قطعة مفقودة ', 'خطا في الترقيم']"
        v-model="selecteddesc"
        return-object
      ></v-autocomplete>
    </v-col>
    <v-col cols="12">
      <v-checkbox label="خطا في قطعة محددة؟" v-model="havePiece"></v-checkbox>
    </v-col>
    <v-col cols="12" v-if="havePiece">
      <v-autocomplete
        :label="$t(`piece`)"
        :items="selectedCard.range"
        v-model="selectedpiece"
        return-object
      ></v-autocomplete>
    </v-col>
    <v-col cols="12" align="center">
      <v-btn @click="submit" color="success">
        {{ $t("submit") }}
      </v-btn>
    </v-col>
    <v-col></v-col>
  </v-row>
</template>

<script>
import axios from "axios";
import swal from "sweetalert";
export default {
  data() {
    return {
      havePiece: false,
      ///////
      selectedOrder: "",
      selectedModel: "",
      selectedCard: "",
      selecteddesc: "",
      selectedpiece: "",
      ////////
      cards: [],
    };
  },
  methods: {
    load_cards() {
      if (this.selectedModel !== null) {
        axios
          .get(
            `/api/card/order/${this.selectedOrder.id}/model/${this.selectedModel}`
          )
          .then((res) => {
            this.cards = res.data.data
              .filter((card) => !card.done)
              .map((card) => ({
                code: card.code + ` (box '${card.boxNumber}' )`,
                tracking: card.tracking,
                start: card.startRange,
                end: card.endRange,
                range: this.card_piece_range(card.startRange, card.endRange),
                id: card._id,
              }));
            console.log("cards", this.cards);
          });
      }
    },
    card_piece_range(start, end) {
      //console.log(start, "start", "end", end);
      const pieces = [];
      for (let i = parseInt(start); i <= parseInt(end); i++) {
        pieces.push(i);
      }
      return pieces;
    },
    submit() {
      let data = {};
      if (this.havePiece === true) {
        data = {
          pieceNo: this.selectedpiece,
          description: this.selecteddesc,
          addedBy: localStorage.getItem("employee"),
        };
      } else {
        data = {
          description: this.selecteddesc,
          addedBy: localStorage.getItem("employee"),
        };
      }
      axios
        .patch(`/api/card/${this.selectedCard.id}/errors/global/add`, data)
        .then((response) => {
          swal("success", "global error added successfully", "success").then(
            () => {
              this.restart();
            }
          );
        });
    },
    restart() {
      this.selectedCard = "";
      this.selecteddesc = "";
      this.havePiece = false;
      this.selectedpiece = "";
    },
  },
  props: {
    orders: Array,
  },
};
</script>
