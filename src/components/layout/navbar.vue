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

        <v-switch
          class="ml-8"
          v-model="model"
          hide-details
          true-value="العربية"
          false-value="english"
          :label="` ${model}`"
          @update:modelValue="test"
        ></v-switch>
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
              :title="$t(`navbar.storage`)"
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
        <v-list-group value="utils">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              :title="$t(`navbar.utils`)"
              prepend-icon="mdi-toolbox"
            ></v-list-item>
          </template>

          <v-list-item
            v-for="link in Utils"
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
      model: "english",
      drawer: false,
      links: [
        { icon: "mdi-login", text: "login(test)", route: "/login" },
        {
          icon: "mdi-view-dashboard",
          text: this.$t("navbar.dashboard"),
          route: "/",
        },

        {
          icon: "mdi-account-group",
          text: this.$t("navbar.employees"),
          route: "/employee/dashboard",
        },

        {
          icon: "mdi-hanger",
          text: this.$t("navbar.models"),
          route: "/model/dashboard",
        },
        {
          icon: "mdi-cart",
          text: this.$t("navbar.orders"),
          route: "/order/dashboard",
        },

        {
          icon: "mdi-ticket-account",
          text: this.$t("navbar.suppliers"),
          route: "/supplier/dashboard",
        },
        {
          icon: "mdi-account-tie",
          text: this.$t("navbar.clients"),
          route: "/client/dashboard",
        },

        {
          icon: "mdi-truck",
          text: this.$t("navbar.shipments"),
          route: "/shipment/dashboard",
        },
        {
          icon: "mdi-note-multiple",
          text: this.$t("navbar.requests"),
          route: "/request/dashboard",
        },
      ],

      storagelinks: [
        {
          icon: "mdi-hammer-wrench",
          text: this.$t("navbar.properties"),
          route: "/storage/property/dashboard",
        },
        {
          icon: "mdi-palette-swatch",
          text: this.$t("navbar.materials"),
          route: "/storage/material/dashboard",
        },
        {
          icon: "mdi-package-variant-closed",
          text: this.$t("navbar.cartons"),
          route: "/storage/carton/dashboard",
        },
      ],
      Utils: [
        {
          icon: "mdi mdi-palette",
          text: this.$t("navbar.colors"),
          route: "/utils/color/dashboard",
        },
        {
          icon: "mdi-size-xl",
          text: this.$t("navbar.sizes"),
          route: "/utils/size/dashboard",
        },
        {
          icon: "mdi-account-cog-outline",
          text: this.$t("navbar.roles"),
          route: "/utils/role/dashboard",
        },
        {
          icon: "mdi-format-list-bulleted-type",
          text: this.$t("navbar.types"),
          route: "/utils/type/dashboard",
        },
        {
          icon: "mdi-sitemap",
          text: this.$t("navbar.stages"),
          route: "/utils/Stage/dashboard",
        },
        {
          icon: "mdi-sitemap",
          text: this.$t("navbar.machinetypes"),
          route: "/utils/Stage/dashboard",
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
    test() {
      console.log("testt");
      if (this.model === "العربية") {
        this.$i18n.locale = "ar";
      } else {
        this.$i18n.locale = "en";
      }
    },
  },
  watch: {
    "$i18n.locale"(newLocale) {
      // Perform logic when the i18n locale changes
      this.links[1].text = this.$t("navbar.dashboard");
      this.links[2].text = this.$t("navbar.employees");
      this.links[3].text = this.$t("navbar.models");
      this.links[4].text = this.$t("navbar.orders");
      this.links[5].text = this.$t("navbar.suppliers");
      this.links[6].text = this.$t("navbar.clients");
      this.links[7].text = this.$t("navbar.shipments");
      this.links[8].text = this.$t("navbar.requests");
      this.storagelinks[0].text = this.$t("navbar.properties");
      this.storagelinks[1].text = this.$t("navbar.materials");
      this.storagelinks[2].text = this.$t("navbar.cartons");
      this.Utils[0].text = this.$t("navbar.colors");
      this.Utils[1].text = this.$t("navbar.sizes");
      this.Utils[2].text = this.$t("navbar.roles");
      this.Utils[3].text = this.$t("navbar.types");
      this.Utils[4].text = this.$t("navbar.stages");
      this.Utils[5].text = this.$t("navbar.machinetypes");
    },
  },
};
</script>

<style lang="scss" scoped></style>
