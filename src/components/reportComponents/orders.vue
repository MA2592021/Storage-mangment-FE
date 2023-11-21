<template>
  <v-row v-if="!loading">
    <v-col cols="12" class="text-center">All Order</v-col>

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
      <DynamicCardButtons :data="allModelButtons" @clicked="allForOrders"
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
import { usedata } from "@/stores/print_data";
import { useheaders } from "@/stores/headers";
import axios from "axios";
import swal from "sweetalert";

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
      allModelButtons: Button.orderButtons,
      orders: [],
      selectedOrder: "",
      modelDetails: "",
      headerAllOrderForModel: [
        // { key: "order[name]", title: "order" },
        { title: "Code", align: "start", key: "code" },
        { title: "model Name", align: "start", key: "id.name" },
        { title: "size", key: "size[name]" },
        { title: "color", key: "color[name]" },
        { title: "quantity", align: "center", key: "quantity" },
        { title: "produced", key: "produced" },
      ],
    };
  },
  created() {
    this.load_order();
  },
  methods: {
    allForOrders(data) {
      console.log(this.selectedOrder);
      if (this.selectedOrder === "") {
        swal("error", "please Select Order", "error");
      } else {
        this.loading = true;
        if (data.value === 0) {
          axios.get(`/api/order/${this.selectedOrder._id}`).then((res) => {
            console.log(data);
            this.printo(
              `Models Requested in ${this.selectedOrder.name}`,
              res.data.data.models,
              this.headerAllOrderForModel
            );
          });
          this.loading = false;
        }
      }
    },
    load_order() {
      axios.get("/api/order").then((res) => {
        console.log(res);
        this.orders = res.data.data;
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
