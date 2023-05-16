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
            </v-data-table
          ></v-col>
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
              :headers="headers1"
              :items="reqmodel"
              item-value="name"
              class="elevation-1"
            >
              <template v-slot:item="{ item }">
                <tr v-ripple @click="dosomething(item.raw)">
                  <td>
                    {{ item.columns.name }}
                  </td>
                </tr>
              </template></v-data-table
            ></v-col
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
              :headers="headers1"
              :items="reqmodel"
              item-value="name"
              class="elevation-1"
            >
              <template v-slot:item="{ item }">
                <tr v-ripple @click="dosomething(item.raw)">
                  <td>
                    {{ item.columns.name }}
                  </td>
                </tr>
              </template></v-data-table
            ></v-col
          >
        </v-row>
      </v-expansion-panel-text>
    </v-expansion-panel></v-expansion-panels
  >
</template>

<script>
import axios from "axios";
import swal from "sweetalert";
import stages from "./stageinput.vue";
export default {
  components: {
    stages,
  },
  data() {
    return {
      selectedtype: null,
      selected: null,
      itemsPerPage: 5,
      dis: true,
      headers: [
        {
          title: "name",
          align: "start",
          sortable: false,
          key: "name",
        },
        { title: "sizes", key: "sizes" },
        { title: "colors", key: "colors" },
        { title: "quantity", key: "qty" },
      ],
      headers1: [
        {
          title: "name",
          align: "start",
          sortable: false,
          key: "id",
        },
        {
          title: "machine type",
          align: "start",
          sortable: false,
          key: "machineType",
        },
        {
          title: "priority",
          align: "start",
          sortable: false,
          key: "priority",
        },
      ],

      model: [],

      qty: "",
    };
  },
  methods: {
    appendtable() {
      const found = this.reqmodel.find(
        (element) => element._id === this.selected._id
      );

      if (found) {
        swal("error", "you cant append same item twice in request", "error");
      } else {
        if (this.qty === "" || this.qty === "0") {
          swal("error", "please enter the quantity", "error");
        } else {
          const x = {};

          x.qty = this.qty;
          x.name = this.selected.name;
          x._id = this.selected._id;
          this.reqmodel.push(x);
          this.resett();
        }
      }
    },
    dosomething(value) {
      this.$router.push({ path: "/shipment/" + value._id });
    },
    resett() {
      this.selected = null;
      this.qty = "";
    },
    deleteitem(id) {
      const index = this.reqmodel.findIndex((element) => element._id === id);
      this.reqmodel.splice(index, 1);
    },
  },
  appendreq() {
    const models = [];
    this.reqmodel.forEach((element) => {
      const x = {};
      x.model = element._id;
      x.quantity = element.qty;
      models.push(x);
    });
    this.$emit("models", models);
  },
  created() {
    axios.get("/api/model/").then((response) => {
      this.model = response.data.data;
    });
  },
  props: {
    stages: Array,
    consumption: Array,
  },
};
</script>
