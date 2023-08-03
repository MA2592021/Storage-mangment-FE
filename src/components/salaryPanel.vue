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
                <span v-else key="1"> Salary Details </span>
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
              :items="salary"
              :group-by="groupBy"
              class="elevation-1"
            >
              <template v-slot:item.workRate="{ item }">
                <v-chip :color="+item.raw.workRate < 60 ? 'red' : 'green'">
                  {{ item.raw.workRate }}%
                </v-chip>
              </template>
              <template v-slot:item.errorRate="{ item }">
                <v-chip :color="+item.raw.errorRate > 20 ? 'red' : 'green'">
                  {{ item.raw.errorRate }}%
                </v-chip>
              </template>
              <template v-slot:item.workEff="{ item }">
                <v-chip :color="+item.raw.workEff < 75 ? 'red' : 'green'">
                  {{ item.raw.workEff }}%
                </v-chip>
              </template>
            </v-data-table>
            <div align="center" class="ma-2">
              <v-btn class="mx-auto" color="info" @click="printo()"
                >print
              </v-btn>
            </div></v-col
          >
        </v-row>
      </v-expansion-panel-text>
    </v-expansion-panel>
    <v-expansion-panel>
      <v-expansion-panel-title>
        <template v-slot:default="{ expanded }">
          <v-row no-gutters>
            <v-col cols="4" class="d-flex justify-start">
              Month Work History
            </v-col>
            <v-col cols="8" class="text-grey">
              <v-fade-transition leave-absolute>
                <span v-if="expanded" key="0"> </span>
                <span v-else key="1"> Work History Details </span>
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
              :headers="headers2"
              :search="search"
              :items="work"
              :group-by="groupBy1"
              class="elevation-1"
            >
              <template v-slot:item.quantity="{ item }">
                <v-chip :color="getdaycolor(item.raw)">
                  {{ item.raw.quantity }}
                </v-chip>
              </template>
            </v-data-table>
            <div align="center" class="ma-2">
              <v-btn class="mx-auto" color="info" @click="printo()"
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
          key: "stage[name]",
        },

        {
          title: "work quantity",
          align: "start",
          key: "qty",
        },
        {
          title: "error quantity",
          align: "start",
          key: "err",
        },

        {
          title: "Work percentage ",
          align: "start",
          key: "workRate",
        },
        {
          title: "error percentage ",
          align: "start",
          key: "errorRate",
        },
        {
          title: "Work efficiency ",
          align: "start",
          key: "workEff",
        },
      ],
      groupBy1: [
        { key: "month", order: "asc" },
        { key: "day", order: "asc" },
      ],
      headers2: [
        {
          title: "card",
          align: "start",
          key: "card",
        },

        {
          title: "stage",
          align: "start",
          key: "stage",
        },

        {
          title: "type",
          align: "start",
          key: "type",
        },
        {
          title: "date",
          align: "start",
          key: "date",
        },
      ],
      salary: [],
      work: [],
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
        console.log("here", res.data.data);
        res.data.data.forEach((element) => {
          element.totalWorkPerMonth.forEach((el) => {
            let x = {};
            x.month = "month " + element.date.month;
            x.stage = el.stage;
            x.qty = el.quantity;
            x.err = el.noOfErrors;
            x.workRate = (
              (+el.quantity / (+el.stage.rate * 8 * 26)) *
              100
            ).toFixed(4);
            x.errorRate = ((+el.noOfErrors / +el.quantity) * 100).toFixed(2);
            x.workEff = (+x.workRate - +x.errorRate).toFixed(2);
            this.salary.push(x);
          });
          // element.workDetails.forEach((el) => {
          //   el.work.forEach((e) => {
          //     const x = {};
          //     x.day = "day " + el.day;
          //     x.month = "month " + element.date.month;
          //     x.stage = e.stage;
          //     x.quantity = e.quantity;
          //     x.noOfErrors = e.noOfErrors;
          //     console.log(x);
          //     this.work.push(x);
          //   });
          // });
        });
        axios.get(`/api/work/employee/${this.$route.params.id}`).then((res) => {
          console.log(res);
          res.data.data.forEach((element) => {
            element.workHistory.forEach((ele) => {
              ele.cards.forEach((el) => {
                const x = {};
                x.month = `month (${element.date.month})`;
                x.day = `day (${ele.day}) `;
                x.card = el.card.code;
                x.stage = el.stage.name + ` (${el.stage.code})`;
                if (el.type === 1) {
                  x.type = "add tracking";
                } else if (el.type === 2) {
                  x.type = "add error";
                } else if (el.type === 3) {
                  x.type = "repair";
                } else {
                  x.type = "confirm error";
                }

                x.date = moment(el.date).calendar();
                this.work.push(x);
              });
            });
          });
          console.log("work", this.work);
        });
        console.log("work", this.work);
        console.log(this.salary);
      });
    },

    printo() {
      this.print_data.title = this.name + " work salary";
      this.print_data.data = this.salary;
      this.print_data.header = this.headers1;
      this.$router.push({ path: "/print" });
    },
    getdaycolor(item) {
      const rate = (+item.quantity / (+item.stage.rate * 8)) * 100;
      if (rate < 60) {
        return "red";
      } else if (rate > 60 && rate < 90) {
        return "yellow";
      } else {
        return "green";
      }
    },
  },
  props: {
    name: String,
  },
};
</script>
