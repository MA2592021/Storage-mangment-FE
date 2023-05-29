<template>
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-title>
        <template v-slot:default="{ expanded }">
          <v-row no-gutters>
            <v-col cols="4" class="d-flex justify-start"> models </v-col>
            <v-col cols="8" class="text-grey">
              <v-fade-transition leave-absolute>
                <span v-if="expanded" key="0">
                  {{ name }}
                </span>
                <span v-else key="1"> models in {{ name }} </span>
              </v-fade-transition>
            </v-col>
          </v-row>
        </template>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-row>
          <v-col cols="6" xs="12"
            ><v-autocomplete
              label="select model"
              :items="model"
              item-title="name"
              v-model="selected"
              :disabled="dis"
              @update:modelValue="this.qty = ''"
              return-object
            ></v-autocomplete
          ></v-col>
          <v-col cols="6" xs="12"
            ><v-autocomplete
              label="select color"
              :items="selected ? selected.colors : ''"
              item-title="name"
              v-model="color"
              :disabled="dis"
              return-object
            ></v-autocomplete
          ></v-col>
          <v-col cols="6" xs="12"
            ><v-autocomplete
              label="select size"
              :items="selected ? selected.sizes : ''"
              item-title="name"
              v-model="size"
              :disabled="dis"
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
            <h3>models</h3>
            <v-data-table
              v-model:items-per-page="itemsPerPage"
              :headers="headers"
              :items="reqmodel"
              item-value="name"
              class="elevation-1"
            >
              <template v-slot:item="{ item }">
                <tr v-ripple>
                  <td>
                    {{ item.raw.id ? item.raw.id.name : item.raw.name }}
                  </td>
                  <td>
                    {{ item.columns.size.name }}
                  </td>
                  <td>
                    {{ item.columns.color.name }}
                  </td>
                  <td>
                    {{ item.raw.quantity ? item.raw.quantity : item.raw.qty }}
                  </td>
                  <td>
                    <v-btn
                      color="red"
                      :disabled="dis"
                      @click="deleteitem(item.raw._id)"
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
            :disabled="status === 'Delivered'"
          >
            Edit models
          </v-btn>
          <v-btn
            color="green "
            :disabled="dis"
            class="ml-auto"
            @click="appendreq()"
          >
            Append models
          </v-btn></v-row
        >
        <div align="center" class="ma-2">
          <v-btn class="mx-auto" color="info" @click="printo()">print </v-btn>
        </div>
      </v-expansion-panel-text> </v-expansion-panel
    ><v-expansion-panel>
      <v-expansion-panel-title>
        <template v-slot:default="{ expanded }">
          <v-row no-gutters>
            <v-col cols="4" class="d-flex justify-start"> shipments </v-col>
            <v-col cols="8" class="text-grey">
              <v-fade-transition leave-absolute>
                <span v-if="expanded" key="0">
                  {{ name }}
                </span>
                <span v-else key="1"> shipments in {{ name }} </span>
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
              :items="ship1"
              item-value="name"
              class="elevation-1"
            >
            </v-data-table>
            <div align="center" class="ma-2">
              <v-btn class="mx-auto" color="info" @click="printo1()"
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
            <v-col cols="4" class="d-flex justify-start"> consumption </v-col>
            <v-col cols="8" class="text-grey">
              <v-fade-transition leave-absolute>
                <span v-if="expanded" key="0">
                  {{ name }}
                </span>
                <span v-else key="1"> consumption in {{ name }} </span>
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
              :items="total1"
              item-value="name"
              class="elevation-1"
            >
            </v-data-table>
            <div align="center" class="ma-2">
              <v-btn class="mx-auto" color="info" @click="printo3()"
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
              Client material
            </v-col>
            <v-col cols="8" class="text-grey">
              <v-fade-transition leave-absolute>
                <span v-if="expanded" key="0">
                  {{ name }}
                </span>
                <span v-else key="1"> Client material {{ name }} </span>
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
              :headers="headers3"
              :items="clientmat1"
              item-value="name"
              class="elevation-1"
            >
            </v-data-table>
            <div align="center" class="ma-2">
              <v-btn class="mx-auto" color="success" @click="dialog = !dialog"
                >append Material
              </v-btn>
            </div>
            <div align="center" class="ma-2">
              <v-btn class="mx-auto" color="info" @click="printo2()"
                >print
              </v-btn>
            </div></v-col
          >
          <appendpop
            v-bind:link="link"
            v-model="dialog"
            v-if="dialog"
            @close="dialog = !dialog"
            @submit="submit"
          />
        </v-row>
      </v-expansion-panel-text> </v-expansion-panel
  ></v-expansion-panels>
</template>

<script>
import axios from "axios";
import appendpop from "./appendpop.vue";
import { usedata } from "../stores/print_data";

import swal from "sweetalert";
import moment from "moment";
export default {
  components: { appendpop },
  setup() {
    const print_data = usedata();
    return { print_data };
  },
  data() {
    return {
      selectedtype: null,
      selected: null,
      itemsPerPage: 5,
      color: null,
      size: null,
      dis: true,
      dialog: false,
      link: { get: "/api/material/" },
      headers: [
        {
          title: "name",
          align: "start",
          sortable: false,
          key: "name",
        },
        { title: "size", key: "size" },
        { title: "color", key: "color" },
        { title: "quantity", key: "quantity" },
      ],
      headers1: [
        {
          title: "name",
          align: "start",
          sortable: false,
          key: "name",
        },
        {
          title: "date",
          align: "start",
          sortable: false,
          key: "date",
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
          title: "total needed",
          align: "start",
          sortable: false,
          key: "quantity",
        },
        {
          title: "available",
          align: "start",
          sortable: false,
          key: "available",
        },
      ],
      headers3: [
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
          title: "available",
          align: "start",
          sortable: false,
          key: "available",
        },
        {
          title: "date",
          align: "start",
          sortable: false,
          key: "date",
        },
      ],
      model: [],
      qty: "",
      ship1: [],
      clientmat1: [],
      total1: [],
    };
  },
  methods: {
    appendtable() {
      if (
        this.qty === "" ||
        this.qty === "0" ||
        this.color === null ||
        this.color === "" ||
        this.size === null ||
        this.size === ""
      ) {
        swal("error", "please fill all  information", "error");
      } else {
        const x = {};

        x.qty = this.qty;
        x.name = this.selected.name;
        x._id = this.selected._id;
        x.size = this.size;
        x.color = this.color;
        console.log(x);
        this.reqmodel.push(x);
        this.resett();
      }
    },
    printo() {
      this.print_data.title = "models in order " + this.name;
      this.print_data.data = this.reqmodel;
      this.print_data.header = this.headers;
      this.$router.push({ path: "/orderMPrint" });
    },
    printo1() {
      this.print_data.title = "shipments done in order " + this.name;
      this.print_data.data = this.ship1;
      this.print_data.header = this.headers1;
      this.$router.push({ path: "/print" });
    },
    printo2() {
      this.print_data.title = "Client Material in order " + this.name;
      this.print_data.data = this.clientmat1;
      this.print_data.header = this.headers3;
      this.$router.push({ path: "/print" });
    },
    printo3() {
      this.print_data.title = "Order " + this.name + " Consumptions";
      this.print_data.data = this.total1;
      this.print_data.header = this.headers2;
      this.$router.push({ path: "/print" });
    },
    dosomething(value) {
      this.$router.push({ path: "/shipment/" + value._id });
    },
    resett() {
      this.selected = null;
      this.color = null;
      this.size = null;
      this.qty = "";
    },
    deleteitem(id) {
      const index = this.reqmodel.findIndex((element) => element._id === id);
      this.reqmodel.splice(index, 1);
    },
    appendreq() {
      const models = [];
      this.reqmodel.forEach((element) => {
        const x = {};
        x.id = element.id ? element.id._id : element._id;
        x.quantity = element.quantity ? element.quantity : element.qty;
        x.size = element.size._id;
        x.color = element.color._id;
        models.push(x);
      });
      this.$emit("models", models);
    },
    loadmodel() {
      axios.get("/api/model/").then((response) => {
        this.model = response.data.data;
        //console.log(this.model);
      });
    },
    submit(value) {
      console.log(value);
      this.dialog = !this.dialog;
      axios
        .patch("/api/client/updateMaterials/" + this.client, {
          order: this.order,
          clientMaterials: [{ material: value._id, quantity: value.qty }],
        })
        .then((res) => {
          console.log(res);
          swal("success", "material appended successfully", "success");
          this.$router.go(0);
        });
    },
  },

  created() {
    this.loadmodel();
    console.log(this.reqmodel);
    this.ship.forEach((element) => {
      const x = {};
      x.name = element.name;
      x.date = moment(element.createdAt).calendar();
      //console.log(x);
      this.ship1.push(x);
    });
    const y = [];
    this.clientmat.forEach((element) => {
      const x = {};
      x.name = element.material.name;
      x.available = element.material.available + " " + element.material.unit;
      x.quantity = element.quantity + " " + element.material.unit;
      x.date = moment(element.date).calendar();
      y.push(x);
    });

    this.clientmat1 = y;
    const y2 = [];
    this.total.forEach((element) => {
      const x = {};
      x.name = element.id.name;
      x.available = element.id.available + " " + element.id.unit;
      x.quantity = element.quantity + " " + element.id.unit;
      y2.push(x);
    });
    this.total1 = y2;
  },
  props: {
    name: String,
    reqmodel: Array,
    ship: Array,
    total: Array,
    clientmat: Array,
    client: String,
    order: String,
  },
};
</script>
