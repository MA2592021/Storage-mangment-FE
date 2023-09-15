<template>
  <v-text-field
    v-model="search"
    label="Search"
    single-line
    hide-details
    Append-inner-icon="mdi-magnify"
    class="mt-5 mb-4"
  ></v-text-field>
  <v-row>
    <v-col cols="6" v-for="employee in data"
      ><v-card class="mx-auto" max-width="368">
        <v-card-item :title="employee.employeeName">
          <template v-slot:subtitle>
            <v-icon
              icon="mdi-barcode"
              size="18"
              color="error"
              class="me-1 pb-1"
            ></v-icon>

            {{ employee.employeeCode }}
          </template>
        </v-card-item>

        <v-card-text class="py-0">
          <v-row align="center" no-gutters>
            <v-col cols="6">
              <v-progress-circular
                :model-value="employee.monthWorkRate"
                :size="70"
                :color="employee.monthWorkRate < 60 ? 'red' : 'green'"
                ><p>{{ employee.monthWorkRate }}%</p>
              </v-progress-circular>
              <p>Month Work Rate</p>
            </v-col>

            <v-col cols="6">
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
</template>
<script>
import axios from "axios";
export default {
  data: () => ({
    data: [],
    value: 10,
    labels: { 0: "SU", 1: "MO", 2: "TU", 3: "WED", 4: "TH", 5: "FR", 6: "SA" },
    time: 0,
    forecast: [
      {
        day: "Tuesday",
        icon: "mdi-white-balance-sunny",
        temp: "24\xB0/12\xB0",
      },
      {
        day: "Wednesday",
        icon: "mdi-white-balance-sunny",
        temp: "22\xB0/14\xB0",
      },
      { day: "Thursday", icon: "mdi-cloud", temp: "25\xB0/15\xB0" },
    ],
  }),
  methods: {
    loadsalaries() {
      axios.get("/api/Salary/summary").then((res) => {
        console.log(res.data);
        this.data = res.data.data;
        this.data.forEach((obj) => {
          obj.expand = false;
        });

        console.log(this.data);
        this.totalPages = Math.ceil(res.data.data.length / 10);
      });
    },
  },
  created() {
    this.loadsalaries();
  },
};
</script>
