<template>
  <nav>
    <v-toolbar theme="dark" app style="background-color: #770f30">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title> Arkan</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn flat color="grey">
        <span class="mr-2" @click="signout()">sign out</span>
        <v-icon right size="large" icon="mdi-logout"></v-icon>
      </v-btn>
    </v-toolbar>
    <v-navigation-drawer
      theme="dark"
      v-model="drawer"
      app
      style="background-color: #770f30"
    >
      <v-row class="hidden-sm-and-down"
        ><v-col align="right"
          ><v-icon
            size="x-large"
            icon="mdi-close"
            @click="drawer = !drawer"
          ></v-icon></v-col
      ></v-row>

      <v-row align="center" class="ma-10">
        <v-col align="center">
          <v-avatar image="/arkan_logo-no-text.png" class="ma-1"></v-avatar>
          <p class="text-subtitle-1">username</p>
        </v-col>
      </v-row>

      <v-list>
        <v-list-item
          v-for="link in links"
          :key="link.text"
          :title="link.text"
          :prepend-icon="link.icon"
          router
          :to="link.route"
        ></v-list-item>

        <v-list-group value="Storage">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              title="Storage"
              prepend-icon="mdi-warehouse"
            ></v-list-item>
          </template>

          <v-list-item
            v-for="link in storagelinks"
            :key="link.text"
            :title="link.text"
            :prepend-icon="link.icon"
            router
            :to="link.route"
          ></v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script>
export default {
  setup() {
    return {};
  },
  data() {
    return {
      drawer: false,
      links: [
        { icon: "mdi-login", text: "login(test)", route: "/login" },
        { icon: "mdi-view-dashboard", text: "Dashboard", route: "/" },

        {
          icon: "mdi-account-group",
          text: "employees",
          route: "/employee/dashboard",
        },

        { icon: "mdi-hanger", text: "models", route: "/model/dashboard" },
        { icon: "mdi-cart", text: "Oreders", route: "/order/" },

        { icon: "mdi-ticket-account", text: "suppliers", route: "/supplier/" },
        { icon: "mdi-account-tie", text: "Clients", route: "/client/" },

        { icon: "mdi-truck", text: "shipment", route: "/shipment/" },
        {
          icon: "mdi-note-multiple",
          text: "Requests",
          route: "/request/",
        },
      ],

      storagelinks: [
        {
          icon: "mdi-hammer-wrench",
          text: "properties",
          route: "/propertie/",
        },
        {
          icon: "mdi-palette-swatch",
          text: "material",
          route: "/material/",
        },
        {
          icon: "mdi-package-variant-closed",
          text: "cartons",
          route: "/carton/",
        },
      ],
    };
  },
  methods: {
    signout: function () {
      this.$router.push({
        path: "/login",
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
