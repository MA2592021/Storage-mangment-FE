<template>
  <tabs v-if="routePath !== '/'" />
  <h1 align="center">Dashboard</h1>
  <v-btn @click="darko()"> dark</v-btn>
  <br /><br />
  <v-row align="center" justify="space-around" class="ma-4">
    <v-col cols="12" align="center" sm="6" md="3" class="mb-5">
      <v-progress-circular
        :rotate="360"
        :size="100"
        :width="15"
        :model-value="100"
        color="pink-darken-4
    "
      >
        {{ user.length }}
      </v-progress-circular>
      <p class="text-h5">Arkan have {{ user.length }} Users</p></v-col
    >
    <v-col cols="12" align="center" sm="6" md="3" class="mb-5">
      <v-progress-circular
        :rotate="360"
        :size="100"
        :width="15"
        :model-value="100"
        color="purple-darken-4
    "
      >
        {{ employee.length }}
      </v-progress-circular>
      <p class="text-h5">Arkan have {{ employee.length }} Employees</p></v-col
    >
    <v-col cols="12" align="center" sm="6" md="3" class="mb-5">
      <v-progress-circular
        :rotate="360"
        :size="100"
        :width="15"
        :model-value="100"
        color="deep-purple-accent-2
    "
      >
        {{ model.length }}
      </v-progress-circular>
      <p class="text-h5">Arkan have {{ model.length }} Models</p></v-col
    >
    <v-col cols="12" align="center" sm="6" md="3" class="mb-5">
      <v-progress-circular
        :rotate="360"
        :size="100"
        :width="15"
        :model-value="100"
        color="light-blue-lighten-1
    "
      >
        {{ property.length }}
      </v-progress-circular>
      <p class="text-h5">Arkan have {{ property.length }} Properties</p></v-col
    >
    <v-col cols="12" align="center" sm="6" md="3" class="mb-5">
      <v-progress-circular
        :rotate="360"
        :size="100"
        :width="15"
        :model-value="100"
        color="light-green-darken-1
    "
      >
        {{ material.length }}
      </v-progress-circular>
      <p class="text-h5">Arkan have {{ material.length }} Materials</p></v-col
    >
    <v-col cols="12" align="center" sm="6" md="3" class="mb-5">
      <v-progress-circular
        :rotate="360"
        :size="100"
        :width="15"
        :model-value="100"
        color="yellow-darken-1
    "
      >
        {{ client.length }}
      </v-progress-circular>
      <p class="text-h5">Arkan have {{ client.length }} Clients</p></v-col
    ><v-col cols="12" align="center" sm="6" md="3" class="mb-5">
      <v-progress-circular
        :rotate="360"
        :size="100"
        :width="15"
        :model-value="100"
        color="orange-darken-4
    "
      >
        {{ supplier.length }}
      </v-progress-circular>
      <p class="text-h5">Arkan have {{ supplier.length }} Suppliers</p></v-col
    >
    <v-col cols="12" align="center" sm="6" md="3" class="mb-5">
      <v-progress-circular
        :rotate="360"
        :size="100"
        :width="15"
        :model-value="100"
        color="brown-darken-1
    "
      >
        {{ order.length }}
      </v-progress-circular>
      <p class="text-h5">Arkan have {{ order.length }} Orders</p></v-col
    ></v-row
  >
</template>

<script>
import tabs from "../components/layout/tabs.vue";
import axios from "axios";
export default {
  components: { tabs },

  computed: {
    routePath() {
      return this.$route.path;
    },
  },
  data() {
    return {
      user: "",
      employee: "",
      property: "",
      material: "",
      model: "",
      order: "",
      supplier: "",
      client: "",
    };
  },
  created() {
    this.loaduser();
    this.loademployee();
    this.loadproperty();
    this.loadmaterial();
    this.loadorder();
    this.loadmodel();
    this.loadclient();
    this.loadsupplier();
  },
  methods: {
    darko() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      console.log(this.$vuetify.theme.dark);
    },
    loaduser() {
      axios.get("/api/user/").then((response) => {
        console.log(response);
        this.user = response.data.data;
      });
    },
    loademployee() {
      axios.get("/api/employee/").then((response) => {
        console.log(response);
        this.employee = response.data.data;
      });
    },
    loadproperty() {
      axios.get("/api/custody/").then((response) => {
        console.log(response);
        this.property = response.data.data;
      });
    },
    loadmaterial() {
      axios.get("/api/material/").then((response) => {
        console.log(response);
        this.material = response.data.data;
      });
    },
    loadmodel() {
      axios.get("/api/model/").then((response) => {
        console.log(response);
        this.model = response.data.data;
      });
    },
    loadorder() {
      axios.get("/api/order/").then((response) => {
        console.log(response);
        this.order = response.data.data;
      });
    },
    loadsupplier() {
      axios.get("/api/supplier/").then((response) => {
        console.log(response);
        this.supplier = response.data.data;
      });
    },
    loadclient() {
      axios.get("/api/client/").then((response) => {
        console.log(response);
        this.client = response.data.data;
      });
    },
  },
};
</script>
