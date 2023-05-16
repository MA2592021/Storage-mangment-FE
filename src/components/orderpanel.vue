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
                    {{ item.raw.id.name }}
                  </td>
                  <td>
                    {{ item.columns.size.name }}
                  </td>
                  <td>
                    {{ item.columns.color.name }}
                  </td>
                  <td>
                    {{ item.columns.quantity }}
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
            </v-data-table
          ></v-col>
        </v-row>
      </v-expansion-panel-text> </v-expansion-panel
  ></v-expansion-panels>
</template>

<script>
import axios from "axios";
import swal from "sweetalert";
import moment from "moment";
export default {
  data() {
    return {
      selectedtype: null,
      selected: null,
      itemsPerPage: 5,
      color: null,
      size: null,
      dis: true,
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
      model: [],
      qty: "",
      ship1: [],
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
        swal("error", "please enter the information", "error");
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
        x.id = element._id;
        x.quantity = element.qty;
        x.size = element.size._id;
        x.color = element.color._id;
        models.push(x);
      });
      this.$emit("models", models);
    },
    loadmodel() {
      axios.get("/api/model/").then((response) => {
        this.model = response.data.data;
        console.log(this.model);
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
      console.log(x);
      this.ship1.push(x);
    });
  },
  props: {
    name: String,
    reqmodel: Array,
    ship: Array,
  },
};
</script>
