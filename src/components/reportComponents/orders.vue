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
      headerDetailedModelStatus: [
        { title: "Code", align: "start", key: "model[code]" },
        { title: "size", key: "model.size[name]" },
        { title: "color", key: "model.color[name]" },
        { title: "Cut", key: "cut" },
      ],
      headerMainModelStatus: [
        { title: "Code", align: "start", key: "model[code]" },
        { title: "name", key: "model[name]" },
        { title: "quantity", key: "model[quantity]" },
        { title: "Cut", key: "cut" },
        { title: "produced", key: "model[produced]" },
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
            this.loading = false;
          });
        } else if (data.value === 1) {
          this.loadMainModel();
        } else if (data.value === 2) {
          this.loadDetailModel();
        }
      }
    },
    load_order() {
      axios.get("/api/order").then((res) => {
        console.log(res);
        this.orders = res.data.data;
      });
    },
    async loadDetailModel() {
      try {
        const res = await axios.get(
          `/api/card/order/${this.selectedOrder._id}/groupsProduction`
        );
        console.log(res);

        const data = res.data.result;
        let count = 1;
        this.loading = false;

        // Use Promise.all to wait for all asynchronous operations to complete
        await Promise.all(
          data[0].stages.map(async (element, index) => {
            if (element.group) {
              this.headerDetailedModelStatus.push({
                title: `Group ${count}`,
                key: `stages[${index}].done`,
              });
              count++;
            } else {
              this.headerDetailedModelStatus.push({
                title:
                  element.stage.type === "preparations"
                    ? element.stage.type
                    : element.stage.type === "quality"
                    ? element.stage.type
                    : element.stage.name,
                key: `stages[${index}].done`,
              });
            }
          })
        );

        console.log(this.headerDetailedModelStatus);

        // Now that the forEach loop has completed, call the printo method
        this.printo(
          `order ${this.selectedOrder.name} models Detailed Status`,
          data,
          this.headerDetailedModelStatus
        );
      } catch (error) {
        // Handle errors here
        console.error(error);
      }
    },
    async loadMainModel() {
      try {
        const res = await axios.get(
          `/api/card/order/${this.selectedOrder._id}/orderProduction`
        );
        console.log(res);

        const data = res.data.result;
        let count = 1;
        this.loading = false;

        // Use Promise.all to wait for all asynchronous operations to complete
        await Promise.all(
          data[0].stages.map(async (element, index) => {
            if (element.group) {
              this.headerMainModelStatus.push({
                title: `Group ${count}`,
                key: `stages[${index}].done`,
              });
              count++;
            } else {
              this.headerMainModelStatus.push({
                title:
                  element.stage.type === "preparations"
                    ? element.stage.type
                    : element.stage.type === "quality"
                    ? element.stage.type
                    : element.stage.name,
                key: `stages[${index}].done`,
              });
            }
          })
        );

        console.log(this.headerMainModelStatus);

        // Now that the forEach loop has completed, call the printo method
        this.printo(
          `order ${this.selectedOrder.name} models Main Status`,
          data,
          this.headerMainModelStatus
        );
      } catch (error) {
        // Handle errors here
        console.error(error);
      }
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
