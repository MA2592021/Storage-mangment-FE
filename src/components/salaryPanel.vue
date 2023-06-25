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
              :items="salary"
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
          title: "qty",
          align: "start",
          key: "qty",
        },
      ],

      salary: [],
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
        res.data.data.forEach((element) => {
          element.totalWorkPerMonth.forEach((el) => {
            let x = {};
            x.month = element.date.month;
            x.stage = el.stage;
            x.qty = el.quantity;
            this.salary.push(x);
          });
        });
        console.log(this.salary);
      });
    },

    printo() {
      this.print_data.title = this.name + " work salary";
      this.print_data.data = this.salary;
      this.print_data.header = this.headers1;
      this.$router.push({ path: "/print" });
    },
  },
  props: {
    name: String,
  },
};
</script>
