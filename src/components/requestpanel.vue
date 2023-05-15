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
        <v-row
          ><v-col cols="12"
            ><v-autocomplete
              label="select type"
              :items="['material', 'property']"
              v-model="selectedtype"
              :disabled="dis"
              @update:modelValue="resett()"
            ></v-autocomplete
          ></v-col>
          <v-col cols="6" xs="12"
            ><v-autocomplete
              label="select item"
              :items="selectedtype === 'material' ? material : properties"
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
            <h3>properties</h3>
            <v-data-table
              v-model:items-per-page="itemsPerPage"
              :headers="headers"
              :items="dataprop"
              class="elevation-1"
            >
              <template v-slot:item="{ item }">
                <tr v-ripple>
                  <td>
                    {{ item.columns.name }}
                  </td>
                  <td>
                    <h4>{{ item.raw.quantity }} {{ item.raw.unit }}</h4>
                  </td>
                  <td>
                    <v-btn
                      color="red"
                      :disabled="dis"
                      @click="deleteitem(item.raw._id, 'property')"
                      >Delete</v-btn
                    >
                  </td>
                </tr>
              </template></v-data-table
            ></v-col
          >
          <v-col col="6" xs="12" align="center">
            <h3>materials</h3>
            <v-data-table
              v-model:items-per-page="itemsPerPage"
              :headers="headers"
              :items="datamat"
              class="elevation-1"
            >
              <template v-slot:item="{ item }">
                <tr>
                  <td>
                    {{ item.columns.name }}
                  </td>
                  <td>
                    <h4>{{ item.raw.quantity }} {{ item.raw.type }}</h4>
                  </td>
                  <td>
                    <v-btn
                      color="red"
                      :disabled="dis"
                      @click="deleteitem(item.raw._id, 'material')"
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
            :disabled="status === 'Approved' || status === 'Delivered'"
          >
            Edit {{ panelname }}
          </v-btn>
          <v-btn
            color="green "
            :disabled="dis"
            class="ml-auto"
            @click="appendreq"
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
        { title: "quantity", key: "quantity" },
      ],

      material: [],
      property: [],
      datamat: [],
      dataprop: [],
      qty: "",
    };
  },
  methods: {
    appendtable() {
      if (this.selectedtype === "material") {
        const found = this.datamat.find(
          (element) => element._id === this.selected._id
        );

        if (found) {
          swal("error", "you cant append same item twice in request", "error");
        } else {
          if (this.qty === "" || this.qty === "0") {
            swal("error", "please enter the quantity", "error");
          } else {
            const x = {};

            x.quantity = this.qty;
            x.name = this.selected.name;
            x._id = this.selected._id;
            this.datamat.push(x);
            this.resett();
          }
        }
      } else {
        const found = this.dataprop.find(
          (element) => element._id === this.selected._id
        );

        if (found) {
          swal("error", "you cant append same item twice in request", "error");
        } else {
          if (this.qty === "" || this.qty === "0") {
            swal("error", "please enter the quantity", "error");
          } else {
            const x = {};

            x.quantity = this.qty;
            x.name = this.selected.name;
            x._id = this.selected._id;
            this.dataprop.push(x);
            this.resett();
          }
        }
      }
    },
    resett() {
      this.selected = null;
      this.qty = "";
    },
    deleteitem(id, type) {
      if (type === "material") {
        const index = this.datamat.findIndex((element) => element._id === id);
        this.datamat.splice(index, 1);
      } else {
        const index = this.dataprop.findIndex((element) => element._id === id);
        this.dataprop.splice(index, 1);
      }
    },
    appendreq() {
      const materials = [];
      const custodies = [];
      this.datamat.forEach((element) => {
        const x = {};
        x.material = element._id;
        x.quantity = element.quantity;
        materials.push(x);
      });
      this.$emit("material", materials);
      this.dataprop.forEach((element) => {
        const y = {};
        y.custody = element._id;
        y.quantity = element.quantity;
        custodies.push(y);
      });
      this.dis = true;
      this.$emit("property", custodies);
    },
    dothings() {
      console.log(this.reqmaterial);
      this.reqmaterial.forEach((element) => {
        const x = {};
        x.name = element.id.name;
        x._id = element._id;
        x.id = element.id._id;
        x.quantity = element.quantity;
        // console.log(x);
        // x.suppliername = element.supplier.name;
        this.datamat.push(x);
      });
      this.reqproperty.forEach((element) => {
        const x = {};
        x.name = element.id.name;
        x._id = element._id;
        x.id = element.id._id;
        x.quantity = element.quantity;
        console.log(x);
        // x.suppliername = element.supplier.name;
        this.dataprop.push(x);
      });
    },
  },
  created() {
    axios.get("/api/material").then((response) => {
      this.material = response.data.data;
      axios.get("/api/custody").then((response) => {
        this.properties = response.data.data;
      });
    });
    this.dothings();
  },
  props: {
    name: String,
    closedtitle: String,
    reqmaterial: Array,
    reqproperty: Array,
    panelname: String,
    status: String,
  },
};
</script>
