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
            </v-data-table></v-col
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
      headers1: [
        {
          title: "name",
          align: "start",
          sortable: false,
          key: "id.name",
        },
        {
          title: "machine type",
          align: "start",
          sortable: false,
          key: "machineType.name",
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
    };
  },

  created() {
    axios.get("/api/order/model/" + this.$route.params.id).then((response) => {
      this.orders = response.data.data;
      console.log(this.orders);
    });
  },
  props: {
    stages: Array,
    consumption: Array,
  },
};
</script>
