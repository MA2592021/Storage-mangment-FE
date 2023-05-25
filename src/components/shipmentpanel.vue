<template>
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-title>
        <template v-slot:default="{ expanded }">
          <v-row no-gutters>
            <v-col cols="4" class="d-flex justify-start">
              {{ panelname }}
            </v-col>
            <v-col cols="8" class="text-grey">
              <v-fade-transition leave-absolute>
                <span v-if="expanded" key="0">
                  {{ name }}
                </span>
                <span v-else key="1"> {{ closedtitle }} {{ name }} </span>
              </v-fade-transition>
            </v-col>
          </v-row>
        </template>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-row>
          <v-col cols="6" xs="12"
            ><v-autocomplete
              label="select item"
              :items="carton"
              item-title="name"
              v-model="selected"
              :disabled="dis"
              @update:modelValue="this.qty = ''"
              return-object
            ></v-autocomplete></v-col
          ><v-col cols="3" xs="6"
            ><v-text-field
              label="quantity"
              :disabled="dis"
              v-model="qty"
            ></v-text-field></v-col
          ><v-col cols="3" xs="6" align="center"
            ><v-btn block color="green" :disabled="dis" @click="appendtable()"
              >Append</v-btn
            ></v-col
          >
        </v-row>
        <v-row>
          <v-col col="6" xs="12" align="center">
            <h3>cartons</h3>
            <v-data-table
              v-model:items-per-page="itemsPerPage"
              :headers="headers"
              :items="reqcarton"
              item-value="name"
              class="elevation-1"
            >
              <template v-slot:item="{ item }">
                <tr v-ripple>
                  <td>
                    {{ item.raw.id ? item.raw.id.name : item.columns.name }}
                  </td>
                  <td>
                    <h4>
                      {{ item.raw.quantity ? item.raw.quantity : item.raw.qty }}
                    </h4>
                  </td>
                  <td>
                    <v-btn color="red" @click="deleteitem()" :disabled="dis"
                      >Delete</v-btn
                    >
                  </td>
                </tr>
              </template></v-data-table
            ></v-col
          >
        </v-row>

        <v-row justify="center" class="mt-4">
          <v-btn
            color="red "
            @click="dis = !dis"
            :disabled="status === 'Approved' || status === 'Shipped'"
          >
            Edit {{ panelname }}
          </v-btn>
          <v-btn
            color="green "
            :disabled="dis"
            class="ml-auto"
            @click="appendreq()"
          >
            Append {{ panelname }}
          </v-btn></v-row
        >
      </v-expansion-panel-text>
    </v-expansion-panel></v-expansion-panels
  >
</template>

<script>
import axios from "axios";
import swal from "sweetalert";
export default {
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
        { title: "quantity", key: "qty" },
      ],

      carton: [],

      qty: "",
    };
  },
  methods: {
    appendtable() {
      const found = this.reqcarton.find(
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
          this.reqcarton.push(x);
          this.resett();
        }
      }
    },
    resett() {
      this.selected = null;
      this.qty = "";
    },
    deleteitem(id) {
      const index = this.reqcarton.findIndex((element) => element._id === id);
      this.reqcarton.splice(index, 1);
    },
    appendreq() {
      const cartons = [];
      this.reqcarton.forEach((element) => {
        const x = {};
        x.id = element._id;
        x.quantity = element.qty;
        cartons.push(x);
      });
      this.dis = true;
      this.$emit("cartons", cartons);
      console.log("emited");
    },
  },

  created() {
    axios.get("/api/carton").then((response) => {
      this.carton = response.data.data;
    });
  },
  props: {
    name: String,
    closedtitle: String,
    reqcarton: Array,
    panelname: String,
    status: String,
  },
};
</script>
