<template>
  <nav>
    <v-toolbar theme="dark" app style="background-color: #770f30">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title> {{ $t("arkan") }}</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn flat color="grey">
        <span class="mr-2" @click="signout()"> {{ $t("sign out") }}</span>
        <v-icon right size="large" icon="mdi-logout"></v-icon>
      </v-btn>
    </v-toolbar>
    <v-navigation-drawer
      theme="dark"
      v-model="drawer"
      app
      width="295"
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
          <v-avatar
            :image="image ? image : `/arkan_logo-no-text.png`"
            class="ma-1"
          ></v-avatar>
          <p class="text-subtitle-1">{{ username }}</p>
          <p class="text-subtitle-1">{{ rolename }}</p>
        </v-col>
      </v-row>
      <v-row>
        <v-switch
          class="ml-10"
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
          v-for="link in filteredItems"
          :key="link.text"
          :title="link.text"
          :prepend-icon="link.icon"
          router
          :to="link.route"
        >
        </v-list-item>

        <v-list-group value="Storage" v-if="look(storageview)">
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
            v-for="link in utilsfilteredItems"
            :key="link.text"
            :title="link.text"
            :prepend-icon="link.icon"
            router
            :to="link.route"
          ></v-list-item>
        </v-list-group>
        <v-list-group value="prod">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              :title="$t(`navbar.prod`)"
              prepend-icon="mdi-data-matrix-scan"
            ></v-list-item>
          </template>

          <v-list-item
            v-for="link in prodfilteredItems"
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
import axios from "axios";
import { usedata } from "../../stores/mainStore";

export default {
  setup() {
    const maindata = usedata();
    const updaterole = (value) => {
      // Call the 'setPiniaAttribute' action to update the state
      maindata.setrole(value);
    };
    return { updaterole };
  },
  data() {
    return {
      username: localStorage.getItem("username"),
      rolename: localStorage.getItem("rolename"),
      model: localStorage.getItem("locale") === "ar" ? "العربية" : "english",
      drawer: false,
      links: [
        {
          icon: "mdi-view-dashboard",
          text: this.$t("navbar.dashboard"),
          route: "/",
          view: "dashboard",
        },
        {
          icon: "mdi-badge-account",
          text: this.$t("navbar.users"),
          view: "users",
          route: "/user/dashboard",
        },
        {
          icon: "mdi-account-group",
          text: this.$t("navbar.employees"),
          route: "/employee/dashboard",
          view: "employees",
        },
        {
          icon: "mdi-currency-usd",
          text: this.$t("navbar.salary"),
          route: "/salary/dashboard",
          view: "salary",
        },

        {
          icon: "mdi-hanger",
          text: this.$t("navbar.models"),
          route: "/model/dashboard",
          view: "models",
        },
        {
          icon: "mdi-cart",
          text: this.$t("navbar.orders"),
          route: "/order/dashboard",
          view: "orders",
        },

        {
          icon: "mdi-ticket-account",
          text: this.$t("navbar.suppliers"),
          route: "/supplier/dashboard",
          view: "suppliers",
        },
        {
          icon: "mdi-account-tie",
          text: this.$t("navbar.clients"),
          route: "/client/dashboard",
          view: "clients",
        },

        {
          icon: "mdi-truck",
          text: this.$t("navbar.shipments"),
          route: "/shipment/dashboard",
          view: "shipments",
        },
        {
          icon: "mdi-note-multiple",
          text: this.$t("navbar.requests"),
          route: "/request/dashboard",
          view: "requests",
        },
        {
          icon: "mdi-track-light",
          text: this.$t("navbar.track"),
          route: "/track/dashboard",
          view: "track",
        },
        {
          icon: "mdi-chart-donut-variant",
          text: this.$t("navbar.employees follow-up"),
          route: "/emptrack/dashboard",
          view: "track",
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
      productionlinks: [
        {
          icon: "mdi-wrench-outline",
          text: this.$t("navbar.stage"),
          route: "/utils/prodEntry/",
          view: "prodEntry",
        },
        {
          icon: "mdi-ruler",
          text: this.$t("navbar.quality"),
          route: "/utils/quality/",
          view: "quality",
        },
      ],
      storageview: "storage",
      Utils: [
        {
          icon: "mdi mdi-palette",
          text: this.$t("navbar.colors"),
          route: "/utils/color/dashboard",
          view: "colors",
        },
        {
          icon: "mdi-size-xl",
          text: this.$t("navbar.sizes"),
          route: "/utils/size/dashboard",
          view: "sizes",
        },
        {
          icon: "mdi-account-cog-outline",
          text: this.$t("navbar.roles"),
          route: "/utils/role/dashboard",
          view: "roles",
        },
        {
          icon: "mdi-badge-account-horizontal",
          text: this.$t("navbar.user_role"),
          route: "/utils/user_role/dashboard",
          view: "user_role",
        },
        {
          icon: "mdi-sitemap",
          text: this.$t("navbar.stages"),
          route: "/utils/Stage/dashboard",
          view: "stages",
        },
        {
          icon: "mdi-format-list-bulleted-type",
          text: this.$t("navbar.types"),
          route: "/utils/type/dashboard",
          view: "types",
        },
        {
          icon: "mdi-sitemap",
          text: this.$t("navbar.machinetypes"),
          route: "/utils/machinetype/dashboard",
          view: "machinetypes",
        },
        {
          icon: "mdi-hard-hat",
          text: this.$t("navbar.assistants"),
          route: "/utils/assist/dashboard",
          view: "assistant",
        },
        {
          icon: "mdi-card-bulleted-settings-outline",
          text: this.$t("navbar.cards"),
          route: "/utils/cards/dashboard",
          view: "cards",
        },
      ],
      image: null,
      priv: localStorage.getItem("privileges")
        ? localStorage.getItem("privileges")
        : [],
    };
  },
  created() {
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
    signout: function () {
      axios.get("/api/auth/logout").then(() => {
        localStorage.clear();
        this.updaterole("");
        this.$router.push({
          path: "/login",
        });
      });
    },

    test() {
      //console.log("testt");
      if (this.model === "العربية") {
        this.$i18n.locale = "ar";
        localStorage.setItem("locale", "ar");
      } else {
        this.$i18n.locale = "en";
        localStorage.setItem("locale", "en");
      }
    },
    look(value) {
      return this.priv.includes(value);
    },
  },
  watch: {
    "$i18n.locale"(newLocale) {
      // Perform logic when the i18n locale changes
      this.links[0].text = this.$t("navbar.dashboard");
      this.links[1].text = this.$t("navbar.users");
      this.links[2].text = this.$t("navbar.employees");
      this.links[3].text = this.$t("navbar.salary");
      this.links[4].text = this.$t("navbar.models");
      this.links[5].text = this.$t("navbar.orders");
      this.links[6].text = this.$t("navbar.suppliers");
      this.links[7].text = this.$t("navbar.clients");
      this.links[8].text = this.$t("navbar.shipments");
      this.links[9].text = this.$t("navbar.requests");
      this.links[10].text = this.$t("navbar.track");
      this.links[11].text = this.$t("navbar.employees follow-up");
      this.storagelinks[0].text = this.$t("navbar.properties");
      this.storagelinks[1].text = this.$t("navbar.materials");
      this.storagelinks[2].text = this.$t("navbar.cartons");
      this.Utils[0].text = this.$t("navbar.colors");
      this.Utils[1].text = this.$t("navbar.sizes");
      this.Utils[2].text = this.$t("navbar.roles");
      this.Utils[3].text = this.$t("navbar.user_role");

      this.Utils[4].text = this.$t("navbar.stages");
      this.Utils[5].text = this.$t("navbar.types");
      this.Utils[6].text = this.$t("navbar.machinetypes");
      this.Utils[7].text = this.$t("navbar.assistants");
      this.Utils[8].text = this.$t("navbar.cards");
      this.productionlinks[0].text = this.$t("navbar.stage");
      this.productionlinks[1].text = this.$t("navbar.quality");
    },
  },
  computed: {
    filteredItems() {
      return this.links.filter((item) => this.priv.includes(item.view));
    },
    utilsfilteredItems() {
      return this.Utils.filter((item) => this.priv.includes(item.view));
    },
    prodfilteredItems() {
      return this.productionlinks.filter((item) =>
        this.priv.includes(item.view)
      );
    },
  },
};
</script>

<style lang="scss" scoped></style>
