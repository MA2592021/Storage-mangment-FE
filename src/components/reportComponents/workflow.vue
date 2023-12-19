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
      />
      <p style="font-size: 12px">for Main and Detailed Stats</p></v-col
    >
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
import { GetStats, GetDateBounds } from "../../services/cards";
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
      date: "",
      allCardButtons: Button.WorkFLowButtons,
      orders: "",
      selectedOrder: "",
      selectedModel: "",
      headerAllStagesMainStats: [
        { title: "stage name", align: "start", key: "stageName" },
        { title: "stage type", align: "center", key: "stageType" },
        { title: "total Production", key: "totalTrack" },
        { title: "total Errors", key: "totalError" },
        { title: "Day Rate", key: "required" },
      ],
      headerAllStagesDetailStats: [
        { title: "stage name", align: "start", key: "stageName" },
      ],
      DateBoundHeaders: [
        { title: "size", align: "start", key: "size" },
        { title: "color", align: "start", key: "color" },
        { title: "group 1 Start", align: "start", key: "g1Start" },
        { title: "group 1 End", align: "start", key: "g1End" },
        { title: "group 2 Start", align: "start", key: "g2Start" },
        { title: "group 2 End", align: "start", key: "g2End" },
        { title: "group 3 Start", align: "start", key: "g3Start" },
        { title: "group 3 End", align: "start", key: "g3End" },
      ],
      supervisorsHeaders: [
        { title: "supervisor", align: "start", key: "groupAdminName" },
        { title: "Start Stage", align: "start", key: "startStageName" },
        { title: "end Stage", align: "start", key: "endStageName" },
        { title: " Day Work", align: "start", key: "totalTrack" },
        { title: " Day Rate", align: "start", key: "workRate" },
        { title: " Day Error ", align: "start", key: "totalError" },
        { title: " Day Rate ", align: "start", key: "errorRate" },
        { title: "Day Required Production ", align: "start", key: "required" },
      ],
    };
  },

  created() {
    this.load_order();
  },
  methods: {
    workflow(data) {
      if (this.selectedModel === "" || this.selectedOrder === "") {
        swal("error", "please select order and model ", "error");
      } else {
        this.loading = true;
        if (data.value === 0) {
          if (this.date === "") {
            swal("error", "please select Date ", "error");
          } else {
            this.getWorkFlow(false).then((data) => {
              console.log(data);
              this.printo(
                `Order ${this.selectedOrder.name} - Model ${this.selectedModel.name} - Date ${this.date}`,
                data,
                this.headerAllStagesMainStats
              );
              this.loading = false;
            });
          }
        } else if (data.value === 1) {
          if (this.date === "") {
            swal("error", "please select Date ", "error");
          } else {
            this.getWorkFlow(true).then((data) => {
              console.log(data);
              this.printo(
                `Order ${this.selectedOrder.name} - Model ${this.selectedModel.name} - Date ${this.date}`,
                data,
                this.headerAllStagesDetailStats,
                "Production | Error"
              );
              this.loading = false;
            });
          }
        } else if (data.value === 2) {
          this.getDateBoundries().then((data) => {
            console.log(data);
            this.printo(
              `Order ${this.selectedOrder.name} - Model ${this.selectedModel.name} Sizes In/Out Dates`,
              data,
              this.DateBoundHeaders
            );
          });
        } else if (data.value === 3) {
          let data = "";
          axios
            .get(
              `/api/group/production/order/${this.selectedOrder.id}/model/${this.selectedModel.id}/date/${this.date}`
            )
            .then((res) => {
              console.log(res.data);
              data = res.data.result;
              data.forEach((obj) => {
                obj.workRate = `${(
                  (obj.totalTrack / obj.required) *
                  100
                ).toFixed(2)}%`;

                obj.errorRate = `${(
                  (obj.totalError / obj.totalTrack) *
                  100
                ).toFixed(2)}%`;
              });
              console.log(data);
              this.printo(
                `Order ${this.selectedOrder.name} - Model ${this.selectedModel.name} supervisors work`,
                data,
                this.supervisorsHeaders,
                "Day Records from Day start untill the moment of report creation"
              );
            });
        }
      }
    },
    getDateBoundries() {
      return GetDateBounds(this.selectedOrder.id, this.selectedModel.id).then(
        (res) => {
          console.log(res);
          const data = res.map((element) => ({
            color: element.model.color.name,
            size: element.model.size.name,
            g1Start:
              element.group1.start === null
                ? "not Started Yet"
                : moment(element.group1.start).format("YYYY-MM-DD HH:mm"),
            g1End:
              element.group1.end === null
                ? "not Finished Yet"
                : moment(element.group1.end).format("YYYY-MM-DD HH:mm"),
            g2Start:
              element.group2.start === null
                ? "not Started Yet"
                : moment(element.group2.start).format("YYYY-MM-DD HH:mm"),
            g2End:
              element.group2.end === null
                ? "not Finished Yet"
                : moment(element.group2.end).format("YYYY-MM-DD HH:mm"),
            g3Start:
              element.group3.start === null
                ? "not Started Yet"
                : moment(element.group3.start).format("YYYY-MM-DD HH:mm"),
            g3End:
              element.group3.end === null
                ? "not Finished Yet"
                : moment(element.group3.end).format("YYYY-MM-DD HH:mm"),
          }));
          return data;
        }
      );
    },
    getWorkFlow(detailed) {
      return GetStats(this.selectedOrder.id, this.selectedModel.id, this.date)
        .then((res) => {
          if (detailed === true) {
            console.log("test");
            const data = res.map((data) => ({
              stageID: data.stageID,
              stageName: data.stageName,
              stageType: data.stageType,
              totalTrack: data.totalTrack,
              totalError: data.totalError,
              required: data.required / 8,
              track: data.track.map((value) => (value === null ? 0 : value)),
              error: data.error.map((value) => (value === null ? 0 : value)),
              combine: this.combineArrays(
                data.track.splice(9),
                data.error.splice(9)
              ),
            }));

            const maxTrackLength = Math.max(
              ...res.map((item) => item.track.length)
            );

            // Generate header columns for each hour
            const hourColumns = Array.from(
              { length: maxTrackLength },
              (_, index) => ({
                title: `Hour ${index + 8}`,
                key: `combine[${index}]`,
              })
            );
            const required = { title: "Hour Rate", key: "required" };
            const header = [
              ...this.headerAllStagesDetailStats,
              ...hourColumns,
              required,
            ];
            this.headerAllStagesDetailStats = header;
            return data;
          } else {
            return res;
          }
        })
        .catch((error) => {
          console.error(error);
          throw error; // Rethrow the error to propagate it down the chain
        });
    },
    combineArrays(array1, array2) {
      const combinedArray = [];
      const min_length = Math.min(array1.length, array2.length);

      for (let i = 0; i < min_length; i++) {
        console.log("2");
        const value1 =
          array1[i] !== null && array1[i] !== undefined ? array1[i] : 0;
        const value2 =
          array2[i] !== null && array2[i] !== undefined ? array2[i] : 0;
        combinedArray.push(`${value1} | ${value2}`);
      }

      if (array1.length > min_length) {
        console.log("1");
        combinedArray.push(
          ...array1
            .slice(min_length)
            .map(
              (value) =>
                `${value !== null && value !== undefined ? value : 0} | ${
                  array2[array2.length - 1] !== null &&
                  array2[array2.length - 1] !== undefined
                    ? array2[array2.length - 1]
                    : 0
                }`
            )
        );
      } else if (array2.length > min_length) {
        console.log(3);
        combinedArray.push(
          ...array2
            .slice(min_length)
            .map(
              (value) =>
                `${
                  array1[array1.length - 1] !== null &&
                  array1[array1.length - 1] !== undefined
                    ? array1[array1.length - 1]
                    : 0
                } | ${value !== null && value !== undefined ? value : 0}`
            )
        );
      }

      return combinedArray;
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
    printo(title, data, header, subtitle) {
      this.print_data.title = title;
      this.print_data.subtitle = subtitle;
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
