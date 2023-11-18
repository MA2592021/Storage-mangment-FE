<template>
  <v-row v-if="!loading">
    <v-col cols="12" class="text-center">All Models</v-col>

    <v-col cols="12">
      <v-autocomplete
        v-model="selectedModel"
        :items="models"
        item-title="name"
        return-object
        :label="$t('model')"
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
      headerAllOrderForModel: [
        // { key: "order[name]", title: "order" },
        { title: "Code", align: "start", key: "code" },
        { title: "Order Name", align: "start", key: "orderName" },
        { title: "size", key: "size[name]" },
        { title: "color", key: "color[name]" },
        { title: "quantity", align: "center", key: "quantity" },
        { title: "Produced", key: "produced" },
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
    printo(title, data, header) {
      this.print_data.title = title;
      this.print_data.data = data;
      this.print_data.header = header;
      setTimeout(() => {
        this.$router.push({ path: "/print" });
      }, 500);
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
