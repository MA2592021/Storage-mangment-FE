<template>
  <v-row>
    <v-col cols="9">
      <v-text-field
        v-model="search"
        label="Search"
        single-line
        append-inner-icon="mdi-magnify"
        class="mt-5 mb-4 ml-2"
        @update:modelValue="searchpls()"
      ></v-text-field>
    </v-col>
    <v-col cols="3"
      ><v-select
        class="mt-5 mb-4"
        label="sort"
        clearable
        v-model="sort"
        :items="selectSort"
        item-title="title"
        return-object
        @update:modelValue="sortpls()"
      ></v-select
    ></v-col>
  </v-row>

  <v-row>
    <v-col
      xs="12"
      sm="6"
      md="4"
      lg="3"
      xl="3"
      xxl="2"
      v-for="employee in showdata"
      ><v-card class="mx-auto" max-width="400">
        <v-card-item :title="employee.employeeName">
          <template v-slot:subtitle>
            <v-icon icon="mdi-barcode" size="18" class="me-1 pb-1"></v-icon>

            {{ employee.employeeCode }}
          </template>
        </v-card-item>

        <v-card-text class="py-0">
          <v-row align="center" no-gutters>
            <v-col cols="6" align="center">
              <v-progress-circular
                :model-value="employee.monthWorkRate"
                :size="70"
                :color="employee.monthWorkRate < 60 ? 'red' : 'green'"
                ><p>{{ employee.monthWorkRate }}%</p>
              </v-progress-circular>
              <p>Month Work Rate</p>
            </v-col>

            <v-col cols="6" align="center">
              <v-progress-circular
                :model-value="employee.monthErrorRate"
                :size="70"
                :color="employee.monthErrorRate > 20 ? 'red' : 'green'"
                ><p>{{ employee.monthErrorRate }}%</p>
              </v-progress-circular>
              <p>Month Error Rate</p>
            </v-col>
          </v-row>
        </v-card-text>

        <div class="d-flex py-3 justify-space-between">
          <v-list-item density="compact" prepend-icon="mdi-cash">
            <v-list-item-subtitle>{{
              employee.totalCost
            }}</v-list-item-subtitle>
          </v-list-item>

          <v-list-item density="compact" prepend-icon="mdi-tshirt-crew">
            <v-list-item-subtitle>{{
              employee.totalPieces
            }}</v-list-item-subtitle>
          </v-list-item>
          <v-list-item density="compact" prepend-icon="mdi-alert-circle">
            <v-list-item-subtitle>{{
              employee.totalErrors
            }}</v-list-item-subtitle>
          </v-list-item>
        </div>

        <v-expand-transition>
          <div v-if="employee.expand">
            <p class="mx-2">Today</p>
            <div class="d-flex py-3 justify-space-between">
              <v-list-item density="compact" prepend-icon="mdi-cash">
                <v-list-item-subtitle>{{
                  employee.todayCost
                }}</v-list-item-subtitle>
              </v-list-item>

              <v-list-item density="compact" prepend-icon="mdi-tshirt-crew">
                <v-list-item-subtitle>{{
                  employee.todayPieces
                }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item density="compact" prepend-icon="mdi-alert-circle">
                <v-list-item-subtitle>{{
                  employee.todayErrors
                }}</v-list-item-subtitle>
              </v-list-item>
            </div>
            <div>
              <v-list-item
                title="Work Rate"
                :subtitle="`${employee.todayWorkRate}%`"
              >
                <v-progress-linear
                  :model-value="employee.todayWorkRate"
                  :color="employee.todayWorkRate < 50 ? 'red' : 'green'"
                  stream
                ></v-progress-linear>
              </v-list-item>
              <v-list-item
                title="Error Rate"
                :subtitle="`${employee.todayErrorRate}%`"
              >
                <v-progress-linear
                  :model-value="employee.todayErrorRate"
                  :color="employee.todayErrorRate > 20 ? 'red' : 'green'"
                  stream
                ></v-progress-linear>
              </v-list-item>
            </div>
            <v-list class="bg-transparent">
              <v-list-item
                v-for="item in employee.todayDetails"
                :key="item.stage._id"
                :title="item.stage.name"
                :subtitle="`quantity: ${item.quantity} -- NO.Errors: ${item.noOfErrors}`"
              >
                <v-progress-linear
                  :model-value="item.quantity / (+item.stage.rate * 8)"
                  :color="
                    item.quantity / (+item.stage.rate * 8) < 50
                      ? 'red'
                      : 'green'
                  "
                  stream
                ></v-progress-linear>
              </v-list-item>
            </v-list>
          </div>
        </v-expand-transition>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn @click="employee.expand = !employee.expand">
            {{ !employee.expand ? "Full Report" : "Hide Report" }}
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
</template>
<script>
import axios from "axios";
import { socket } from "../../socket";
export default {
  data: () => ({
    data: [],
    page: 1,
    sort: "",
    totalPages: 0,
    showdata: [],
    searchresult: [],
    selectSort: [
      { title: "month work rate (asc)", key: "monthWorkRate", sort: "asc" },
      { title: "month work rate (desc)", key: "monthWorkRate", sort: "desc" },
      { title: "month error rate (asc)", key: "monthErrorRate", sort: "asc" },
      { title: "month error rate (desc)", key: "monthErrorRate", sort: "desc" },
      { title: "today work rate (asc)", key: "todayWorkRate", sort: "asc" },
      { title: "today work rate (desc)", key: "todayWorkRate", sort: "desc" },
      { title: "today error rate (asc)", key: "todayErrorRate", sort: "asc" },
      { title: "today error rate (desc)", key: "todayErrorRate", sort: "desc" },
    ],
    search: "",
    test: "monthErrorRate",
  }),
  methods: {
    loadsalaries() {
      axios.get("/api/Salary/summary").then((res) => {
        //console.log(res.data);
        this.data = res.data.data;
        this.data.forEach((obj) => {
          obj.expand = false;
        });
        this.showdata = this.data.slice((+this.page - 1) * 8, +this.page * 8);
        console.log(this.showdata);
        this.totalPages = Math.ceil(res.data.data.length / 8);
      });
    },
    searchpls() {
      if (this.search !== null || this.search !== "") {
        this.searchresult = this.data.filter((employee) => {
          return employee.employeeName
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
  },
  created() {
    this.loadsalaries();
  },
  mounted() {
    socket.on("errorConfirm", (message) => {
      setTimeout(() => {
        this.loadsalaries();
      }, 500);
      if (this.sort.length !== 0) {
        this.sortpls();
      }
    });
    socket.on("addTracking", (message) => {
      this.loadsalaries();
      setTimeout(() => {
        if (this.sort.length !== 0) {
          this.sortpls();
        }
      }, 500);
    });
    socket.on("errors", (message) => {
      setTimeout(() => {
        this.loadsalaries();
      }, 500);
      if (this.sort.length !== 0) {
        this.sortpls();
      }
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
