<template>
  <v-bottom-navigation
    grow
    v-model="nav"
    absolute
    mode="shift"
    :bg-color="bar_color()"
  >
    <v-btn value="track">
      <v-icon>mdi-flag-plus</v-icon>

      {{ $t("track") }}
    </v-btn>

    <v-btn value="confirm">
      <v-icon>mdi-check-decagram</v-icon>

      {{ $t("confirm") }}
    </v-btn>
    <v-btn value="global">
      <v-icon>mdi-alert-outline</v-icon>

      {{ $t("add global error") }}
    </v-btn>

    <v-btn value="errors" @click="errorBadge = 0">
      <v-badge color="error" v-if="errorBadge !== 0" :content="errorBadge">
        <v-icon>mdi-alert-circle-outline</v-icon></v-badge
      >
      <v-icon v-if="errorBadge === 0">mdi-alert-circle-outline</v-icon>
      {{ $t("errors") }}
    </v-btn>
  </v-bottom-navigation>
  <v-card style="width: 100%" class="mt-5">
    <v-card-text>
      <v-window v-model="nav" disabled>
        <v-window-item value="track">
          <QualityTrack v-bind:orders="orders" />
        </v-window-item>
        <v-window-item value="confirm">
          <QualityConfirm v-bind:orders="orders" />
        </v-window-item>
        <v-window-item value="errors">
          <QualityErrorPage v-bind:orders="orders" v-if="nav === 'errors'" />
        </v-window-item>
        <v-window-item value="global">
          <QualityGlobalAdd v-bind:orders="orders" />
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>

<script>
import QualityTrack from "../../../components/QualityTrack.vue";
import QualityErrorPage from "../../../components/QualityErrorPage.vue";
import QualityConfirm from "../../../components/QualityConfirm.vue";
import QualityGlobalAdd from "../../../components/QualityGlobalAdd.vue";
import { connectSocket } from "../../../socket.js";
import axios from "axios";
export default {
  components: {
    QualityTrack,
    QualityErrorPage,
    QualityConfirm,
    QualityGlobalAdd,
  },
  data() {
    return {
      nav: "track",
      errorBadge: 0,

      orders: [],
    };
  },
  methods: {
    ////// loaders
    load_order() {
      axios.get("/api/order").then((res) => {
        this.orders = res.data.data.map((order) => ({
          name: order.name,
          id: order._id,
          models: order.models
            .filter(
              (person, index, self) =>
                index === self.findIndex((p) => p.id._id === person.id._id)
            )
            .map((model) => ({
              name: model.id.name,
              id: model.id._id,
            })),
        }));

        //console.log(res.data.data);
      });
    },

    ////// styles
    bar_color() {
      if (this.nav === "track") {
        return "info";
      } else if (this.nav === "confirm") {
        return "success";
      } else {
        return "red";
      }
    },
  },
  created() {
    this.load_order();
  },
  mounted() {
    const socket = connectSocket();
    socket.on("errors", (message) => {
      console.log("im here");
      this.errorBadge++;
    });
  },
};
</script>
