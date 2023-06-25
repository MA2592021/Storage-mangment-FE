<template>
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-title>
        <template v-slot:default="{ expanded }">
          <v-row no-gutters>
            <v-col cols="4" class="d-flex justify-start">
              Month Salary Details
            </v-col>
            <v-col cols="8" class="text-grey">
              <v-fade-transition leave-absolute>
                <span v-if="expanded" key="0"> </span>
                <span v-else key="1"> Work history </span>
              </v-fade-transition>
            </v-col>
          </v-row>
        </template>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-row>
          <v-col col="6" xs="12" align="center">
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
            <v-data-table
              v-model:items-per-page="itemsPerPage"
              :headers="headers1"
              :search="search"
              :items="data"
              :group-by="groupBy"
              class="elevation-1"
            >
              <template v-slot:item.duration="{ item }">
                <v-chip>
                  {{ item.raw.duration }}
                </v-chip>
              </template>
            </v-data-table>
            <div align="center" class="ma-2">
              <v-btn class="mx-auto" color="info" @click="printo(1)"
                >print
              </v-btn>
            </div></v-col
          >
        </v-row>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import moment from "moment";
import { usedata } from "../stores/print_data";
import axios from "axios";
export default {
  data() {
    return {
      itemsPerPage: 5,
      dis: true,
      search: "",
      groupBy: [{ key: "month", order: "asc" }],
      headers1: [
        {
          title: "stage",
          align: "start",
          key: "stage",
        },

        {
          title: "qty",
          align: "start",
          key: "qty",
        },
        {
          title: "salary",
          align: "start",
          key: "salary",
        },
        {
          title: "time",
          align: "start",
          key: "time",
        },
      ],
      data: [
        {
          month: 1,
          order: "dafa",
          model: "abo el feda",
          card: "250",
          qty: 15,
          salary: 150,
          time: "test1",
        },
        {
          month: 1,
          order: "dafa",
          model: "abo el feda",
          card: "250",
          qty: 15,
          salary: 150,
          time: "test2",
        },
        {
          month: 1,
          order: "dafa",
          model: "abo el feda",
          card: "250",
          qty: 15,
          salary: 150,
          time: "test6",
        },
        {
          month: 2,
          order: "dafa",
          model: "abo el feda",
          card: "250",
          qty: 15,
          salary: 150,
          time: "test6",
        },
        {
          month: 2,
          order: "dafa",
          model: "abo el feda",
          card: "250",
          qty: 15,
          salary: 150,
          time: "test5",
        },
        {
          month: 2,
          order: "dafa",
          model: "abo el feda",
          card: "250",
          qty: 15,
          salary: 150,
          time: "test6",
        },
      ],
      salary: "",
      stages: "",
      id: 1,
    };
  },

  created() {
    this.loadsalary();
  },
  setup() {
    const print_data = usedata();
    return { print_data };
  },
  methods: {
    loadsalary() {
      axios.get("/api/salary/employee/" + this.$route.params.id).then((res) => {
        this.salary = res.data.data;
      });
    },

    printo(x) {
      if (x === 1) {
        this.print_data.title = "stages to produce " + this.name;
        this.print_data.data = this.stages;
        this.print_data.header = this.headers1;
        this.$router.push({ path: "/print" });
      } else if (x === 2) {
        this.print_data.title = "orders with " + this.name;
        this.print_data.data = this.orders;
        this.print_data.header = this.headers2;
        console.log(this.print_data);
        this.$router.push({ path: "/orderPrint" });
      } else if (x === 3) {
        this.print_data.title = this.name + "  conspumtions";
        this.print_data.data = this.consumption;
        this.print_data.header = this.headers;
        this.$router.push({ path: "/consumptionPrint" });
      } else {
        this.print_data.title =
          this.name +
          "  conspumtions for " +
          this.calcQty +
          " " +
          this.calcolor.name +
          " " +
          this.calcsize.name +
          " pices";
        this.print_data.data = this.calcs;
        this.print_data.header = this.headers4;
        this.$router.push({ path: "/consumptionPrint" });
      }
    },
  },
};
</script>
