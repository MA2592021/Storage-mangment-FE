<template>
  <v-row align="center" justify="space-around" class="ma-4">
    <v-col cols="12" align="center" md="4">
      <v-progress-circular
        :rotate="360"
        :size="100"
        :width="15"
        :model-value="100"
        color="pink-darken-4
  "
      >
        {{ datalength }}
      </v-progress-circular>
      <p class="text-h5">
        {{ $t("arkan have") }} {{ datalength }} {{ $t("properties") }}
      </p>
    </v-col>
  </v-row>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      data: "",
      chartData: {
        labels: ["daily used materials"],
        datasets: [
          {
            label: " white 2omash",
            data: [40],
            backgroundColor: "#770f30",
            borderRadius: 10,
          },
          {
            label: " black 2omash ",
            data: [20],
            backgroundColor: "#FED579",
            borderRadius: 10,
          },
          {
            label: "zorar ",
            data: [90],
            backgroundColor: "#ABBAC2",
            borderRadius: 10,
          },
        ],
      },
    };
  },
  created() {
    axios.get("/api/custody").then((response) => {
      this.data = response.data.data;
    });
  },
  computed: {
    datalength() {
      return this.data.length;
    },
  },
};
</script>
