<template>
  <v-row v-if="!loading">
    <v-col cols="12" class="text-center">All Cards</v-col>
    <v-col cols="6">
      <v-autocomplete
        v-model="selectedOrder"
        :items="orders"
        item-title="name"
        return-object
        :label="$t('order')"
      ></v-autocomplete>
    </v-col>
    <v-col cols="6">
      <v-autocomplete
        v-model="selectedModel"
        :items="selectedOrder?.models"
        item-title="name"
        return-object
        :label="$t('model')"
      ></v-autocomplete>
    </v-col>
    <v-col cols="12">
      <DynamicCardButtons :data="allCardButtons" @clicked="allForCards"
    /></v-col>
  </v-row>
  <v-row v-if="loading"
    ><v-col cols="4"></v-col
    ><v-col cols="2"
      ><v-progress-circular
        color="green"
        indeterminate
        :size="71"
        :width="5" /></v-col
    ><v-col cols="4" class="mt-4"
      ><h3 class="gradient-text">let the magic happen</h3></v-col
    >
  </v-row>
</template>

<script>
import DynamicCardButtons from "../DynamicCardButtons.vue";
import * as Button from "../../services/ReportButtons";
import { GetProductionFollowUp } from "../../services/cards";
import { usedata } from "@/stores/print_data";
import { useheaders } from "@/stores/headers";
import axios from "axios";
import swal from "sweetalert";
import moment from "moment";
export default {
  setup() {
    const print_data = usedata();
    const headers = useheaders();

    return { print_data, headers };
  },
  components: {
    DynamicCardButtons,
  },
  data() {
    return {
      loading: false,
      allCardButtons: Button.AllCardsButtons,
      orders: "",
      selectedOrder: "",
      selectedModel: "",
      headerAllCards: [
        // { key: "order[name]", title: "order" },

        { title: "card", align: "start", key: "code" },
        { title: "quantity", align: "center", key: "quantity" },
        { title: "size", key: "size" },
        { title: "color", key: "colorName" },
        { title: "Box number", key: "boxNumber" },
        { title: "errors", key: "piecesGotErrors" },
        { title: "last stage", key: "lastStage" },
        { title: "last Stage Date", key: "lastStageDate" },
        { title: "Progress", key: "trackingLength" },
      ],
    };
  },
  created() {
    this.load_order();
  },
  methods: {
    allForCards(data) {
      this.loading = true;
      if (this.selectedModel === "" || this.selectedOrder === "") {
        swal("error", "please select order and model", "error");
      } else {
        if (data.value === 0) {
          this.getCards().then((data) => {
            this.printo(
              `Order ${this.selectedOrder.name} - Model ${this.selectedModel.name} Cards`,
              data,
              this.headerAllCards
            );
          });
        } else if (data.value === 1) {
          this.getCards().then((data) => {
            console.log(data);
            this.printo(
              `Order ${this.selectedOrder.name} - Model ${this.selectedModel.name} Cards`,
              data.filter((el) => el.done === true),
              this.headerAllCards
            );
          });
        } else if (data.value === 2) {
          this.getCards().then((data) => {
            console.log(data);
            this.printo(
              `Order ${this.selectedOrder.name} - Model ${this.selectedModel.name} Cards`,
              data.filter((el) => el.done === false),
              this.headerAllCards
            );
          });
        }
      }
    },
    getCards() {
      return new Promise((resolve, reject) => {
        GetProductionFollowUp(this.selectedOrder.id, this.selectedModel.id)
          .then((res) => {
            const data = res.map((card) => {
              // Edit the attribute you want, for example, incrementing age by 1
              return {
                ...card,
                lastStageDate: moment(card.lastStageDate).calendar(),
              };
            });

            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      });
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
      });
    },
    printo(title, data, header) {
      this.print_data.title = title;
      this.print_data.data = data;
      this.print_data.header = header;
      setTimeout(() => {
        this.$router.push({ path: "/print" });
      }, 500);
    },
  },
};
</script>
