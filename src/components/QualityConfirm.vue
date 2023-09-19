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
    <v-col cols="8">
      <v-text-field
        v-model="selectedCard"
        clearable
        label="card code"
        inputmode="numeric"
        variant="outlined"
        :disabled="selected_confirm.length !== 0"
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
      <v-btn
        class="mt-2"
        color="success"
        :disabled="selected_confirm.length !== 0"
        block
        @click="loadCard()"
        >Check</v-btn
      >
    </v-col>
    <v-col cols="2">
      <v-btn class="mt-2" color="info" block @click="viewCard">view</v-btn>
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
    <template v-slot:item.global="{ item }">
      <v-checkbox
        readonly
        color="red"
        class="ml-4"
        v-model="item.raw.global"
      ></v-checkbox>
    </template>
    <template v-slot:item.piece="{ item }">
      <h3 v-if="item.raw.piece === 0">{{ $t("global") }}</h3>
      <h3 v-else>{{ item.raw.piece }}</h3>
    </template>
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
      card: "",
      found: false,
      selectedOrder: localStorage.getItem("quality_order")
        ? JSON.parse(localStorage.getItem("quality_order"))
        : "",
      selectedModel: localStorage.getItem("quality_model")
        ? localStorage.getItem("quality_model")
        : "",
      selected_confirm: [],
      selectedCard: "",
      stages: [],
      headers1: [
        { title: "المرحلة", key: "name" },
        { title: "رقم القطعة", key: "piece" },
        { title: "مشكلة كارتة", key: "global" },
      ],
      loading: false,
    };
  },
  methods: {
    blurs() {
      document.activeElement.blur();
    },
    load_cards() {
      console.log(this.selected_confirm);
      if (this.selectedModel !== null) {
        this.cards = [];
        axios
          .get(
            `/api/card/order/${this.selectedOrder.id}/model/${this.selectedModel}`
          )
          .then((res) => {
            console.log("res", res);
            this.cards = res.data.data
              .filter((card) => !card.done)
              .map((card) => ({
                code: card.code + ` (box '${card.boxNumber}' )`,
                global: card.globalErrors,
                id: card._id,
              }));
            this.blurs();
          });
      }
    },
    loadCard() {
      console.log(this.selectedModel, "---", this.selectedOrder);
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
    load_card_Errors() {
      if (this.card !== "") {
        console.log(this.card);
        axios.get(`/api/card/${this.card._id}/errors/repair`).then((res) => {
          this.stages = res.data.data.map((stage) => ({
            name: stage.stage.name + `( ${stage.stage.code})`,
            id: stage.stage._id,
          }));
          this.card.globalErrors.forEach((el) => {
            console.log(el);
            if (!el.verifiedBy) {
              const x = {};
              x.name = el.description;
              x.id = el._id;
              x.piece = el.pieceNo;
              x.global = true;
              this.stages.push(x);
            }
          });
        });
        console.log("here bbe", this.stages);
        this.blurs();
      }
    },
    viewCard() {
      if (this.card !== "") {
        this.$router.push({
          path: `/card/public/${this.card._id}`,
        });
      } else {
        swal("error", "please enter card code", "error");
      }
    },
    submit() {
      if (this.selected_confirm.length !== 0) {
        this.loading = true;

        const stages = [];
        const globalErrors = [];
        this.selected_confirm.forEach((element) => {
          if (element.global) {
            globalErrors.push(element.id);
          } else {
            stages.push(element.id);
          }
        });
        if (stages.length !== 0) {
          axios
            .patch(`/api/card/${this.card._id}/errors/confirm/all`, {
              verifiedBy: localStorage.getItem("employee"),
              stages: stages,
            })
            .then(() => {
              this.loading = false;
              swal("success", "Errors Confirmed successfully", "success").then(
                () => {
                  this.restart();
                }
              );
            })

            .catch(() => (this.loading = false));
        }
        if (globalErrors.length !== 0) {
          globalErrors.forEach((element) => {
            axios
              .patch(`/api/card/${this.card._id}/errors/global/confirm`, {
                verifyBy: localStorage.getItem("employee"),
                globalErrorIndex: element,
              })
              .then(() => {
                this.loading = false;
                swal(
                  "success",
                  "Global Errors Confirmed successfully",
                  "success"
                ).then(() => {
                  this.restart();
                });
              })

              .catch(() => (this.loading = false));
          });
        }
      }
    },
    restart() {
      this.selected_confirm = [];
      this.card = "";
      this.found = false;
      this.selectedCard = "";
      this.stages = [];
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
