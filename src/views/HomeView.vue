<template>
  <tabs v-if="routePath !== '/'" />
  <!-- <v-btn @click="darko()"> dark</v-btn> -->
  <v-card
    class="mx-auto"
    color="pink-darken-4"
    theme="dark"
    max-width="600"
    :title="username"
  >
    <template v-slot:prepend>
      <v-avatar
        :image="image ? image : `/arkan_logo-no-text.png`"
        class="ma-1"
      ></v-avatar>
    </template>

    <v-card-text class="text-h5 py-2" align="center">
      {{ $t("welcome") }}</v-card-text
    >
    <br /><br />
  </v-card>
  <br /><br />
  <h1 align="center">{{ $t("dashboard") }}</h1>
  <v-row align="center" justify="space-around" class="ma-4">
    <v-col
      cols="12"
      align="center"
      sm="6"
      md="3"
      class="mb-5"
      v-if="look('users')"
    >
      <v-progress-circular
        :rotate="360"
        :size="100"
        :width="15"
        :model-value="100"
        color="pink-darken-4"
      >
        {{ user.length }}
      </v-progress-circular>
      <p class="text-h5">
        {{ $t("arkan have") }} {{ user.length }} {{ $t("userss") }}
      </p></v-col
    >
    <v-col
      cols="12"
      align="center"
      sm="6"
      md="3"
      class="mb-5"
      v-if="look('employees')"
    >
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
      <p class="text-h5">
        {{ $t("arkan have") }} {{ employee.length }} {{ $t("employeess") }}
      </p></v-col
    >
    <v-col
      cols="12"
      align="center"
      sm="6"
      md="3"
      class="mb-5"
      v-if="look('models')"
    >
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
      <p class="text-h5">
        {{ $t("arkan have") }} {{ model.length }} {{ $t("modelss") }}
      </p></v-col
    >
    <v-col
      cols="12"
      align="center"
      sm="6"
      md="3"
      class="mb-5"
      v-if="look('storage')"
    >
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
      <p class="text-h5">
        {{ $t("arkan have") }} {{ property.length }} {{ $t("properties") }}
      </p></v-col
    >
    <v-col
      cols="12"
      align="center"
      sm="6"
      md="3"
      class="mb-5"
      v-if="look('storage')"
    >
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
      <p class="text-h5">
        {{ $t("arkan have") }} {{ material.length }} {{ $t("materials") }}
      </p></v-col
    >
    <v-col
      cols="12"
      align="center"
      sm="6"
      md="3"
      class="mb-5"
      v-if="look('clients')"
    >
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
      <p class="text-h5">
        {{ $t("arkan have") }} {{ client.length }} {{ $t("clients") }}
      </p></v-col
    ><v-col
      cols="12"
      align="center"
      sm="6"
      md="3"
      class="mb-5"
      v-if="look('suppliers')"
    >
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
      <p class="text-h5">
        {{ $t("arkan have") }} {{ supplier.length }} {{ $t("suppliers") }}
      </p></v-col
    >
    <v-col
      cols="12"
      align="center"
      sm="6"
      md="3"
      class="mb-5"
      v-if="look('orders')"
    >
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
      <p class="text-h5">
        {{ $t("arkan have") }} {{ order.length }} {{ $t("orderss") }}
      </p></v-col
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
      username: localStorage.getItem("username"),
      user: "",
      employee: "",
      property: "",
      material: "",
      model: "",
      order: "",
      supplier: "",
      client: "",

      image: null,
      priv: JSON.parse(localStorage.getItem("privileges")),
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
    if (localStorage.getItem("refreshToken")) {
      axios.get("/api/user/" + localStorage.getItem("id")).then((res) => {
        if (res.data.data.image) {
          this.image = res.data.data.image.data;
        }
        //console.log(res);
      });
    }
  },

  methods: {
    darko() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      console.log(this.$vuetify.theme.dark);
    },
    loaduser() {
      axios.get("/api/user/").then((response) => {
        //console.log(response);
        this.user = response.data.data;
      });
    },
    loademployee() {
      axios.get("/api/employee/").then((response) => {
        //console.log(response);
        this.employee = response.data.data;
      });
    },
    loadproperty() {
      axios.get("/api/custody/").then((response) => {
        //console.log(response);
        this.property = response.data.data;
      });
    },
    loadmaterial() {
      axios.get("/api/material/").then((response) => {
        //console.log(response);
        this.material = response.data.data;
      });
    },
    loadmodel() {
      axios.get("/api/model/").then((response) => {
        //console.log(response);
        this.model = response.data.data;
      });
    },
    loadorder() {
      axios.get("/api/order/").then((response) => {
        //console.log(response);
        this.order = response.data.data;
      });
    },
    loadsupplier() {
      axios.get("/api/supplier/").then((response) => {
        //console.log(response);
        this.supplier = response.data.data;
      });
    },
    loadclient() {
      axios.get("/api/client/").then((response) => {
        //console.log(response);
        this.client = response.data.data;
      });
    },
    look(name) {
      return this.priv.includes(name);
    },
  },
};
</script>
