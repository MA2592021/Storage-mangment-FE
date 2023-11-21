<template>
  <v-row v-if="!loading">
    <v-col cols="12" class="text-center">All Models</v-col>

    <v-col cols="12">
      <v-autocomplete
        v-model="selectedModel"
        :items="models"
        @update:modelValue="load_model_test"
        item-title="name"
        return-object
        :label="$t('model')"
      ></v-autocomplete>
    </v-col>
    <v-divider></v-divider>
    <v-col cols="4">
      <v-text-field
        label="Quantity"
        hint="for consumptions"
        v-model="cons.quantity"
      ></v-text-field> </v-col
    ><v-col cols="4">
      <v-autocomplete
        v-model="cons.size"
        :items="modelDetails.sizes"
        item-title="name"
        return-object
        hint="for consumptions"
        :label="$t('size')"
      ></v-autocomplete> </v-col
    ><v-col cols="4">
      <v-autocomplete
        v-model="cons.color"
        :items="modelDetails.colors"
        item-title="name"
        return-object
        hint="for consumptions"
        :label="$t('color')"
      ></v-autocomplete>
    </v-col>
    <v-col cols="12">
      <DynamicCardButtons :data="allModelButtons" @clicked="allForModels"
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
      allModelButtons: Button.modelsButtons,
      models: [],
      selectedModel: "",
      modelDetails: "",
      cons: { quantity: "", color: "", size: "" },
      headerAllOrderForModel: [
        // { key: "order[name]", title: "order" },
        { title: "Code", align: "start", key: "code" },
        { title: "Order Name", align: "start", key: "orderName" },
        { title: "size", key: "size[name]" },
        { title: "color", key: "color[name]" },
        { title: "quantity", align: "center", key: "quantity" },
        { title: "Produced", key: "produced" },
      ],
      consumptionsHeaders: [
        {
          title: "material name",
          align: "start",
          sortable: false,
          key: "material.name",
        },
        { title: "quantity", key: "quantity" },
        { title: "colors", key: "colors" },
        { title: "sizes", key: "sizes" },
      ],
      conscalheader: [
        {
          title: "material name",
          align: "start",
          sortable: false,
          key: "name",
        },
        { title: "quantity", key: "quantity" },
        { title: "available", key: "available" },
      ],
    };
  },
  created() {
    this.load_model();
  },
  methods: {
    allForModels(data) {
      if (this.selectedModel === "") {
        swal("error", "please Select Model", "error");
      } else {
        this.loading = true;
        if (data.value === 0) {
          axios
            .get(`/api/order/model/${this.selectedModel._id}`)
            .then((res) => {
              const data = [];
              res.data.data.forEach((element) => {
                element.models.forEach((el) => {
                  data.push({ ...el, orderName: element.name });
                });
              });
              console.log(data);
              this.printo(
                `Orders Requested ${this.selectedModel.name}`,
                data,
                this.headerAllOrderForModel
              );
            });
        } else if (data.value === 1) {
          this.printoConsum(
            `${this.selectedModel.name} Consumptions`,
            this.modelDetails.consumptions,
            this.consumptionsHeaders
          );
        } else if (data.value === 2) {
          axios
            .post("/api/order/consumption/", {
              models: [
                {
                  id: this.selectedModel._id,
                  color: this.cons.color._id,
                  size: this.cons.size._id,
                  quantity: this.cons.quantity,
                  code: this.selectedModel.code,
                },
              ],
            })
            .then((res) => {
              let calcs = [];
              console.log("here", res);
              res.data.data.forEach((element) => {
                const x = {};
                x.name = element.id.name;
                x.available = element.id.available + " " + element.id.unit;
                x.quantity = element.quantity + " " + element.id.unit;
                calcs.push(x);
              });
              this.printoConsum(
                `${this.selectedModel.name} Consumptions for ${this.cons.quantity} size ${this.cons.size.name} color ${this.cons.color.name}`,
                calcs,
                this.conscalheader
              );
            });
        }
        this.loading = false;
      }
    },
    load_model() {
      axios.get("/api/model").then((res) => {
        console.log(res);
        this.models = res.data.data;
      });
    },
    load_model_test() {
      axios.get("/api/model/" + this.selectedModel._id).then((res) => {
        console.log(res);
        this.modelDetails = res.data.data;
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
    printoConsum(title, data, header) {
      this.print_data.title = title;
      this.print_data.data = data;
      this.print_data.header = header;
      setTimeout(() => {
        this.$router.push({ path: "/consumptionPrint" });
      }, 500);
    },
  },
};
</script>
