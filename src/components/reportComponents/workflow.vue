<template>
  <v-row v-if="!loading">
    <v-col cols="12" class="text-center">Work Flow</v-col>

    <v-col cols="4">
      <v-autocomplete
        v-model="selectedOrder"
        :items="orders"
        item-title="name"
        return-object
        :label="$t('order')"
      ></v-autocomplete>
    </v-col>
    <v-col cols="4">
      <v-autocomplete
        v-model="selectedModel"
        :items="selectedOrder?.models"
        item-title="name"
        return-object
        :label="$t('model')"
      ></v-autocomplete>
    </v-col>
    <v-col cols="4">
      <input
        style="width: 100%; height: 70%"
        v-model="date"
        type="date"
        id="dateInput"
        name="dateInput"
    /></v-col>
    <v-col cols="12">
      <DynamicCardButtons :data="allCardButtons" @clicked="workflow"
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
import { GetStats } from "../../services/cards";
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
      date: "",
      allCardButtons: Button.WorkFLowButtons,
      orders: "",
      selectedOrder: "",
      selectedModel: "",
      headerAllStagesMainStats: [
        { title: "stage name", align: "start", key: "stageName" },
        { title: "stage type", align: "center", key: "stageType" },
        { title: "total Production", key: "totalTrack" },
        { title: "total Errors", key: "totalErrors" },
      ],
      headerAllStagesDetailStats: [
        { title: "stage name", align: "start", key: "stageName" },
      ],
    };
  },

  created() {
    this.load_order();
  },
  methods: {
    workflow(data) {
      if (
        this.selectedModel === "" ||
        this.selectedOrder === "" ||
        this.date === ""
      ) {
        swal("error", "please select order and model and date", "error");
      } else {
        this.loading = true;
        if (data.value === 0) {
          this.getWorkFlow(false).then((data) => {
            console.log(data);
            this.printo(
              `Order ${this.selectedOrder.name} - Model ${this.selectedModel.name} - Date ${this.date}`,
              data,
              this.headerAllStagesMainStats
            );
          });
        } else if (data.value === 1) {
          this.getWorkFlow(true).then((data) => {
            console.log(data);
            this.printo(
              `Order ${this.selectedOrder.name} - Model ${this.selectedModel.name} - Date ${this.date}`,
              data,
              this.headerAllStagesDetailStats
            );
          });
        }
        this.loading=false
      }
    },
    getWorkFlow(detailed) {
      return new Promise((resolve, reject) => {
        GetStats(this.selectedOrder.id, this.selectedModel.id, this.date)
          .then((res) => {
            if (detailed === true) {
              console.log("test");
              const data = res.map((data) => ({
                stageID: data.stageID,
                stageName: data.stageName,
                stageType: data.stageType,
                totalTrack: data.totalTrack,
                totalError: data.totalError,
                track: data.track.map((value) => (value === null ? 0 : value)),
              }));
              const maxTrackLength = Math.max(
                ...res.map((item) => item.track.length)
              );

              // Generate header columns for each hour
              const hourColumns = Array.from(
                { length: maxTrackLength },
                (_, index) => ({
                  title: `Hour ${index + 8}`,
                  key: `track[${index}]`,
                })
              );
              const header = [
                ...this.headerAllStagesDetailStats,
                ...hourColumns,
              ];
              this.headerAllStagesDetailStats = header;
              resolve(data);
            } else {
              resolve(res);
            }
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
<style scoped>
/* Apply some basic styling to the date input */
input[type="date"] {
  appearance: none;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
}

/* Style the date input arrow button */
input[type="date"]::-webkit-calendar-picker-indicator {
  color: #333;
  font-size: 1.2em;
  padding: 4px;
}
</style>
