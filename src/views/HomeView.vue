<template>
  <tabs v-if="routePath !== '/'" />
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
                  {{ closedtitle }}
                </span>
                <span v-else key="1">
                  {{ openedtitle }} {{ closedtitle }}
                </span>
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
              @update:modelValue="resett()"
            ></v-autocomplete
          ></v-col>
          <v-col cols="6" xs="12"
            ><v-autocomplete
              label="select item"
              :items="selectedtype === 'material' ? material : properties"
              item-title="name"
              v-model="selected"
              @update:modelValue="this.qty = ''"
              return-object
            ></v-autocomplete></v-col
          ><v-col cols="3" xs="6"
            ><v-text-field label="quantity" v-model="qty"></v-text-field></v-col
          ><v-col cols="3" xs="6" align="center"
            ><v-btn block color="green" @click="appendtable()"
              >Append</v-btn
            ></v-col
          >
        </v-row>
        <v-row>
          <v-col col="6" xs="12">
            <v-data-table
              v-model:items-per-page="itemsPerPage"
              :headers="headers"
              :items="requestproperty"
              item-value="name"
              class="elevation-1"
            >
              <template v-slot:item="{ item }">
                <tr v-ripple>
                  <td>
                    {{ item.columns.name }}
                  </td>
                  <td>
                    <h4>{{ item.raw.qty }} {{ item.raw.type }}</h4>
                  </td>
                  <td>
                    <v-btn color="red">Delete</v-btn>
                  </td>
                </tr>
              </template></v-data-table
            ></v-col
          >
          <v-col col="6" xs="12">
            <v-data-table
              v-model:items-per-page="itemsPerPage"
              :headers="headers"
              :items="requestmaterial"
              item-value="name"
              class="elevation-1"
            >
              <template v-slot:item="{ item }">
                <tr v-ripple>
                  <td>
                    {{ item.columns.name }}
                  </td>
                  <td>
                    <h4>{{ item.raw.qty }} {{ item.raw.type }}</h4>
                  </td>
                  <td>
                    <v-btn
                      color="red"
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
          <v-btn color="primary " @click="dialog = !dialog">
            Append {{ panelname }}
          </v-btn></v-row
        >
      </v-expansion-panel-text>
    </v-expansion-panel></v-expansion-panels
  >
  {{ selected }} -- {{ qty }}
</template>

<script>
import axios from "axios";
import tabs from "../components/layout/tabs.vue";
import swal from "sweetalert";
export default {
  components: { tabs },

  data() {
    return {
      panelname: "Inclusions",
      selectedtype: null,
      selected: null,
      closedtitle: "properties and material in request",
      openedtitle: "request",
      itemsPerPage: 5,
      headers: [
        {
          title: "name",
          align: "start",
          sortable: false,
          key: "name",
        },
        { title: "quantity", key: "qty" },
      ],

      material: [],
      property: [],
      requestmaterial: [],
      requestproperty: [],
      qty: "",
    };
  },
  methods: {
    appendtable() {
      if (this.selectedtype === "material") {
        const found = this.requestmaterial.find(
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
            this.requestmaterial.push(x);
            console.log(this.requestmaterial);
          }
        }
      } else {
        const found = this.requestproperty.find(
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
            this.requestproperty.push(x);
            console.log(this.requestproperty);
          }
        }
      }
    },
    resett() {
      this.selected = null;
      console.log("test");
      this.qty = "";
    },
    deleteitem(id, type) {
      if (type === "material") {
        const index = this.requestmaterial.findIndex(
          (element) => element._id === id
        );
        this.requestmaterial.splice(index, 1);
      }
    },
  },
  created() {
    axios.get("/api/material").then((response) => {
      this.material = response.data.data;
      axios.get("/api/custody").then((response) => {
        this.properties = response.data.data;
      });
    });
  },
  computed: {
    routePath() {
      return this.$route.path;
    },
  },
};
</script>
