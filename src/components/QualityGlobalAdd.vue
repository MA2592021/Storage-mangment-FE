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
    <v-col cols="8">
      <v-text-field
        v-model="selectedCard"
        clearable
        label="card code"
        inputmode="numeric"
        variant="outlined"
        @update:modelValue="found = false"
      >
        <template v-slot:append-inner>
          <v-fade-transition leave-absolute>
            <v-progress-circular
              v-if="loading"
              color="info"
              indeterminate
              size="24"
            ></v-progress-circular>

            <v-icon v-if="found" color="green" icon="mdi-check-bold"></v-icon>
          </v-fade-transition>
        </template>
      </v-text-field>
    </v-col>
    <v-col cols="2">
      <v-btn class="mt-2" color="success" block @click="loadCard()"
        >Check</v-btn
      >
    </v-col>
    <v-col cols="2">
      <v-btn class="mt-2" color="info" block @click="viewCard">view</v-btn>
    </v-col>
    <v-col cols="12">
      <v-autocomplete
        :label="$t(`description`)"
        :items="['استعواض', 'قطعة مفقودة ', 'خطا في الترقيم', 'خطا في المقاس ']"
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
      card: "",
      found: false,
      ///////
      selectedOrder: localStorage.getItem("quality_order")
        ? JSON.parse(localStorage.getItem("quality_order"))
        : "",
      selectedModel: localStorage.getItem("quality_model")
        ? localStorage.getItem("quality_model")
        : "",
      selectedCard: "",
      selecteddesc: "",
      selectedpiece: "",
      ////////
      cards: [],
    };
  },
  methods: {
    loadCard() {
      axios
        .post(`/api/card/code/${this.selectedCard}`, {
          model: this.selectedModel,
          order: this.selectedOrder.id,
        })
        .then((res) => {
          this.loading = false;
          this.found = true;
          this.card = res.data.data;
          this.load_card_Errors();
        })
        .catch((err) => {
          this.loading = false;
        });
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
        .patch(`/api/card/${this.card._id}/errors/global/add`, data)
        .then((response) => {
          swal("success", "global error added successfully", "success").then(
            () => {
              this.restart();
            }
          );
        });
    },
    restart() {
      this.found = false;
      this.selectedCard = "";
      this.card = "";
      this.selecteddesc = "";
      this.havePiece = false;
      this.selectedpiece = "";
    },
    viewCard() {
      if (this.card !== "") {
        this.$router.push({
          path: `/card/public/${this.card}`,
        });
      } else {
        swal("error", "please enter card code", "error");
      }
    },
  },
  props: {
    orders: Array,
  },
};
</script>
