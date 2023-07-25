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
                <span v-else key="1"> stages to produce {{ name }} </span>
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
              <v-btn class="ml-2" color="red" @click="update()">Edit </v-btn>
            </div></v-col
          >
        </v-row>
      </v-expansion-panel-text> </v-expansion-panel
    ><v-expansion-panel>
      <v-expansion-panel-title>
        <template v-slot:default="{ expanded }">
          <v-row no-gutters>
            <v-col cols="4" class="d-flex justify-start"> orders </v-col>
            <v-col cols="8" class="text-grey">
              <v-fade-transition leave-absolute>
                <span v-if="expanded" key="0">
                  {{ name }}
                </span>
                <span v-else key="1"> orders in {{ name }} </span>
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
              :headers="headers2"
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
    <v-expansion-panel>
      <v-expansion-panel-title>
        <template v-slot:default="{ expanded }">
          <v-row no-gutters>
            <v-col cols="4" class="d-flex justify-start"> consumptions </v-col>
            <v-col cols="8" class="text-grey">
              <v-fade-transition leave-absolute>
                <span v-if="expanded" key="0">
                  {{ name }}
                </span>
                <span v-else key="1"> materials used in {{ name }} </span>
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
              :items="consumption"
              item-value="name"
              class="elevation-1"
            >
              <template v-slot:item.colors="{ item }">
                <h4 v-for="color in item.raw.colors" :key="color">
                  {{ color.name }}
                </h4>
              </template>
              <template v-slot:item.sizes="{ item }">
                <h4 v-for="size in item.raw.sizes" :key="size">
                  {{ size.name }}
                </h4>
              </template>
            </v-data-table>
            <div align="center" class="ma-2">
              <v-btn class="mx-auto" color="info" @click="printo(3)"
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
              consumptions calculator
            </v-col>
            <v-col cols="8" class="text-grey">
              <v-fade-transition leave-absolute>
                <span v-if="expanded" key="0">
                  {{ name }}
                </span>
                <span v-else key="1"> calculate materials in {{ name }} </span>
              </v-fade-transition>
            </v-col>
          </v-row>
        </template>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-row class="ma-2"
          ><v-col cols="12" sm="4"
            ><v-text-field label="quantity" v-model="calcQty"></v-text-field
          ></v-col>
          <v-col cols="12" sm="3"
            ><v-autocomplete
              label="select color"
              :items="colors"
              v-model="calcolor"
              item-title="name"
              return-object
            ></v-autocomplete></v-col
          ><v-col cols="12" sm="3"
            ><v-autocomplete
              label="select size"
              :items="sizes"
              v-model="calcsize"
              item-title="name"
              return-object
            ></v-autocomplete></v-col
          ><v-col cols="12" sm="2" class="mt-2"
            ><v-btn @click="calc">calculate</v-btn></v-col
          ></v-row
        >
        <v-row>
          <v-col col="6" xs="12" align="center">
            <v-data-table
              v-model:items-per-page="itemsPerPage"
              :headers="headers4"
              :items="calcs"
              item-value="name"
              class="elevation-1"
            >
            </v-data-table>
            <div align="center" class="ma-2">
              <v-btn class="mx-auto" color="info" @click="printo(4)"
                >print
              </v-btn>
            </div></v-col
          >
        </v-row>
      </v-expansion-panel-text>
    </v-expansion-panel></v-expansion-panels
  >
</template>

<script>
import axios from "axios";
import { usedata } from "../stores/print_data";
import Stageupdate from "../views/models/stageupdate.vue";
export default {
  data() {
    return {
      calcQty: "",
      calcsize: null,
      calcolor: null,
      itemsPerPage: 5,
      dis: true,
      headers: [
        {
          title: "material name",
          align: "start",
          sortable: false,
          key: "material.name",
        },
        { title: "quantity", key: "quantity" },
        { title: "colors", key: "colors" },
        { title: "sizes", key: "sizes" },
      ],
      headers4: [
        {
          title: "material name",
          align: "start",
          sortable: false,
          key: "name",
        },
        { title: "quantity", key: "quantity" },
        { title: "available", key: "available" },
      ],
      headers1: [
        {
          title: "name",
          align: "start",
          sortable: false,
          key: "id.name",
        },
        {
          title: "Type",
          align: "start",
          sortable: false,
          key: "id.type",
        },
        {
          title: "priority",
          align: "start",
          sortable: false,
          key: "priority",
        },
      ],
      headers2: [
        {
          title: "name",
          align: "start",
          sortable: false,
          key: "name",
        },
        {
          title: "quantity",
          align: "start",
          sortable: false,
          key: "quantity",
        },
        {
          title: "size",
          align: "start",
          sortable: false,
          key: "size",
        },
        {
          title: "color",
          align: "start",
          sortable: false,
          key: "color",
        },
      ],
      orders: [],
      calcs: [],
    };
  },

  created() {
    axios.get("/api/order/model/" + this.$route.params.id).then((response) => {
      this.orders = response.data.data;
    });
    //console.log(this.stages);
  },

  props: {
    stages: Array,
    consumption: Array,
    name: String,
    id: String,
    colors: Array,
    sizes: Array,
  },
  setup() {
    const print_data = usedata();
    return { print_data };
  },
  methods: {
    update() {
      this.$router.push({
        path: "/model/stageUpdate/" + this.$route.params.id,
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
    calc() {
      axios
        .post("/api/order/consumption/", {
          models: [
            {
              id: this.id,
              color: this.calcolor._id,
              size: this.calcsize._id,
              quantity: this.calcQty,
            },
          ],
        })
        .then((res) => {
          console.log("here", res);
          res.data.data.forEach((element) => {
            const x = {};
            x.name = element.id.name;
            x.available = element.id.available + " " + element.id.unit;
            x.quantity = element.quantity + " " + element.id.unit;
            this.calcs.push(x);
          });
        });
    },
  },
};
</script>
