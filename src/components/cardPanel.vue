<template>
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-title>
        <template v-slot:default="{ expanded }">
          <v-row no-gutters>
            <v-col cols="4" class="d-flex justify-start"> stages </v-col>
            <v-col cols="8" class="text-grey">
              <v-fade-transition leave-absolute>
                <span v-if="expanded" key="0">
                  {{ name }}
                </span>
                <span v-else key="1"> stages History {{ name }} </span>
              </v-fade-transition>
            </v-col>
          </v-row>
        </template>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-row>
          <v-col col="6" xs="12" align="center">
            <v-data-table
              v-model:items-per-page="itemsPerPage"
              :headers="headers1"
              :items="stages"
              class="elevation-1"
            >
            </v-data-table>
            <div align="center" class="ma-2">
              <v-btn class="mx-auto" color="info" @click="printo(1)"
                >print
              </v-btn>
            </div></v-col
          >
        </v-row>
      </v-expansion-panel-text> </v-expansion-panel
    ><v-expansion-panel>
      <v-expansion-panel-title>
        <template v-slot:default="{ expanded }">
          <v-row no-gutters>
            <v-col cols="4" class="d-flex justify-start"> Errors </v-col>
            <v-col cols="8" class="text-grey">
              <v-fade-transition leave-absolute>
                <span v-if="expanded" key="0">
                  {{ name }}
                </span>
                <span v-else key="1"> Errors in {{ name }} </span>
              </v-fade-transition>
            </v-col>
          </v-row>
        </template>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-row>
          <v-col col="6" xs="12" align="center">
            <v-data-table
              v-model:items-per-page="itemsPerPage"
              :headers="headers"
              :items="orders"
              item-value="name"
              class="elevation-1"
            >
              <template v-slot:item.color="{ item }">
                <h4 v-for="model in item.raw.models" :key="model">
                  {{ model.color.name }}
                </h4>
              </template>

              <template v-slot:item.size="{ item }">
                <h4 v-for="model in item.raw.models" :key="model">
                  {{ model.size.name }}
                </h4>
              </template>
              <template v-slot:item.quantity="{ item }">
                <h4 v-for="model in item.raw.models" :key="model">
                  {{ model.quantity }}
                </h4>
              </template></v-data-table
            >
            <div align="center" class="ma-2">
              <v-btn class="mx-auto" color="info" @click="printo(2)"
                >print
              </v-btn>
            </div></v-col
          >
        </v-row>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
  {{ card }}
</template>

<script>
import { usedata } from "../stores/print_data";
export default {
  data() {
    return {
      itemsPerPage: 5,
      dis: true,
      headers: [
        {
          title: "stage",
          align: "start",
          sortable: false,
          key: "stage",
        },
        { title: "describtion", key: "desc" },
        { title: "fixed", key: "fixed" },
        { title: "Date in", key: "datein" },
        { title: "Date out", key: "date out" },
      ],

      headers1: [
        {
          title: "name",
          align: "start",
          sortable: false,
          key: "name",
        },
        {
          title: "code",
          align: "start",
          key: "code",
        },
        {
          title: "employee",
          align: "start",
          key: "employee",
        },
        {
          title: "time finished",
          align: "start",
          key: "date",
        },
      ],

      orders: [],
      calcs: [],
    };
  },
  mounted() {
    console.log(this.card);
  },
  props: {
    card: Array,
  },
  setup() {
    const print_data = usedata();
    return { print_data };
  },
  methods: {
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
