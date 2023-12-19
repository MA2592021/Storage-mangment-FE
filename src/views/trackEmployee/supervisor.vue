<template>
  <v-row>
    <v-col cols="9">
      <v-text-field
        v-model="search"
        label="Search"
        single-line
        append-inner-icon="mdi-magnify"
        class="mt-5 ml-2"
        @update:modelValue="searchpls()"
      ></v-text-field>
    </v-col>
    <v-col cols="3"
      ><v-select
        class="mt-5"
        label="sort"
        clearable
        v-model="sort"
        :items="selectSort"
        item-title="title"
        return-object
        @update:modelValue="sortpls()"
      ></v-select></v-col
    ><v-col cols="3" class="ml-3">
      <v-btn @click="dialog = true" style="text-transform: none" color="warning"
        >Change Order</v-btn
      >
    </v-col>
  </v-row>

  <v-row>
    <v-col
      xs="12"
      sm="12"
      md="6"
      lg="4"
      xl="3"
      xxl="2"
      v-for="group in showdata"
      ><v-card class="mx-auto" max-width="300">
        <v-card-item :title="group.groupAdminName" />

        <v-card-text class="py-0">
          <v-row align="center" no-gutters>
            <v-col cols="12" align="center">
              <v-progress-circular
                :model-value="group.workRate"
                :size="70"
                :color="group.workRate ? 'red' : 'green'"
                ><p>{{ group.workRate }}%</p>
              </v-progress-circular>
              <p>Today Work Rate</p>
            </v-col>

            <!-- <v-col cols="6" align="center">
              <v-progress-circular
                :model-value="group.errorRate"
                :size="70"
                :color="group.errorRate > 20 ? 'red' : 'green'"
                ><p>{{ group.errorRate }}%</p>
              </v-progress-circular>
              <p>today Error Rate</p>
            </v-col> -->
          </v-row>
        </v-card-text>

        <div class="d-flex py-3 justify-space-evenly">
          <v-list-item
            style="margin-right: -10px"
            density="compact"
            prepend-icon="mdi-tshirt-crew"
          >
            <v-list-item-subtitle>{{ group.totalTrack }}</v-list-item-subtitle>
          </v-list-item>
          <!-- <v-list-item
            style="margin-right: -10px"
            density="compact"
            prepend-icon="mdi-alert-circle"
          >
            <v-list-item-subtitle>{{ group.totalError }}</v-list-item-subtitle>
          </v-list-item> -->
        </div>

        <v-expand-transition>
          <div v-if="group.expand">
            <p class="mx-2">Today</p>

            <div v-for="(hour, index) in group.track">
              <div v-if="hour">
                <v-divider></v-divider>
                <p class="mx-2">hour {{ index }}</p>
                <v-list-item title="Work Rate" :subtitle="`${hour} pieces`">
                  <v-progress-linear
                    :model-value="(hour / (group.required / 8)) * 100"
                    :color="
                      (hour / (group.required / 8)) * 100 < 50 ? 'red' : 'green'
                    "
                    stream
                  ></v-progress-linear>
                </v-list-item>
                <!-- <v-list-item
                  title="Error Rate"
                  :subtitle="`${group.error[index] ? group.error[index] : 0}%`"
                >
                  <v-progress-linear
                    :model-value="(group.error[index] / hour) * 100"
                    :color="
                      (group.error[index] / hour) * 100 > 20 ? 'red' : 'green'
                    "
                    stream
                  ></v-progress-linear>
                </v-list-item> -->
              </div>
            </div>
          </div>
        </v-expand-transition>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn @click="group.expand = !group.expand">
            {{ !group.expand ? "Full Report" : "Hide Report" }}
          </v-btn>
        </v-card-actions>
      </v-card></v-col
    >
  </v-row>
  <v-pagination
    v-model="page"
    class="my-4"
    :length="totalPages"
    :total-visible="7"
  ></v-pagination>
  <v-dialog v-model="dialog">
    <v-card>
      <v-card-title>Change Order or Model</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="6" class="ml-4">
            <v-autocomplete
              v-model="selectedOrder"
              :items="orders"
              item-title="name"
              return-object
              :label="$t('order')"
            ></v-autocomplete>
          </v-col>
          <v-col cols="5" class="ml-4">
            <v-autocomplete
              v-model="selectedModel"
              :items="selectedOrder?.models"
              item-title="name"
              return-object
              :label="$t('model')"
            ></v-autocomplete> </v-col
        ></v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn color="info">close</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="success" @click="loadGroups">change</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import axios from "axios";
import moment from "moment";
import { socket } from "../../socket";
export default {
  data: () => ({
    dialog: false,
    interval: null,
    data: [],
    page: 1,
    sort: "",
    selectedOrder: "",
    selectedModel: "",
    totalPages: 0,
    showdata: [],
    searchresult: [],
    orders: [],
    selectSort: [
      { title: "today work rate (asc)", key: "workRate", sort: "asc" },
      { title: "today work rate (desc)", key: "workRate", sort: "desc" },
      { title: "today error rate (asc)", key: "errorRate", sort: "asc" },
      { title: "today error rate (desc)", key: "errorRate", sort: "desc" },
    ],
    search: "",
    test: "monthErrorRate",
  }),
  methods: {
    loadGroups() {
      const currentDate = moment();

      // Format the date as 'YYYY-MM-D'
      const formattedDate = currentDate.format("YYYY-MM-DD");
      axios
        .get(
          `/api/group/production/order/${this.selectedOrder.id}/model/${this.selectedModel.id}/date/${formattedDate}`
        )
        .then((res) => {
          console.log(res.data);
          this.data = res.data.result;

          console.log(this.data);
          this.data.forEach((obj) => {
            obj.expand = false;
            obj.workRate = ((obj.totalTrack / obj.required) * 100).toFixed(2);
            obj.errorRate = ((obj.totalError / obj.totalTrack) * 100).toFixed(
              2
            );
          });
          this.showdata = this.data.slice((+this.page - 1) * 8, +this.page * 8);
          console.log(this.showdata);
          this.totalPages = Math.ceil(this.data.length / 8);
        });
      this.dialog = false;
      this.workview();
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
    searchpls() {
      if (this.search !== null || this.search !== "") {
        this.searchresult = this.data.filter((employee) => {
          return employee.employee.name
            .toLowerCase()
            .includes(this.search.toLowerCase());
        });
        console.log(this.searchresult.slice(0, 8));
        this.showdata = this.searchresult.slice(0, 8);
        this.totalPages = Math.ceil(this.searchresult.length / 8);
      } else {
        this.searchresult = [];
        this.showdata = this.data.slice(0, 8);
        this.totalPages = Math.ceil(this.data.length / 8);
      }
      this.page = 1;
    },
    sortpls() {
      if (this.sort.sort === "asc") {
        this.data.sort((a, b) => {
          if (+a[this.sort.key] < +b[this.sort.key]) {
            return -1; // a should come before b in the sorted order
          }
          if (+a[this.sort.key] > +b[this.sort.key]) {
            return 1; // a should come after b in the sorted order
          }
          return 0; // a and b are equal, no change in order
        });
      } else {
        this.data.sort((a, b) => {
          if (+a[this.sort.key] < +b[this.sort.key]) {
            return 1; // a should come before b in the sorted order
          }
          if (+a[this.sort.key] > +b[this.sort.key]) {
            return -1; // a should come after b in the sorted order
          }
          return 0; // a and b are equal, no change in order
        });
      }
      if (this.search !== "") {
        console.log(this.search);
        this.searchpls();
      } else {
        this.showdata = this.data.slice((+this.page - 1) * 8, +this.page * 8);
        //this.page = 1;
      }
    },
    workview() {
      if (this.interval === null) {
        this.interval = setInterval(() => {
          if (this.data.length === 0) {
          } else if (+this.page >= +this.totalPages) {
            this.page = 1;
          } else {
            this.page++;
            console.log(page);
          }
          console.log(this.page, this.totalPages);
        }, 1000);
      }
    },
  },
  created() {
    this.load_order();
  },
  beforeUnmount() {
    clearInterval(this.interval);
  },
  mounted() {
    socket.on("addTracking", (message) => {
      message.groups.forEach((obj) => {
        const index = this.data.findIndex((el) => el.groupID === obj);
        console.log(index);
        if (index !== -1) {
          this.data[index].totalTrack += message.quantity;
          this.data[index].workRate = (
            (this.data[index].totalTrack / this.data[index].required) *
            100
          ).toFixed(2);
        }
        console.log(this.data[index]);
      });
    });
    socket.on("errors", (message) => {
      message.groups.forEach((obj) => {
        const index = this.data.findIndex((el) => el.groupID === obj);
        console.log(index);
        if (index !== -1) {
          this.data[index].totalError += message.quantity;
          this.data[index].workRate = (
            (this.data[index].totalError / this.data[index].totalTrack) *
            100
          ).toFixed(2);
        }
        console.log(this.data[index]);
      });
    });
  },
  watch: {
    page: {
      handler(newValue) {
        if (this.search === null || this.search === "") {
          this.showdata = this.data.slice((+newValue - 1) * 8, +newValue * 8);
        } else {
          this.showdata = this.searchresult.slice(
            (+newValue - 1) * 8,
            +newValue * 8
          );
        }
      },
    },
  },
};
</script>
