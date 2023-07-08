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
        {{ $t("arkan have") }} {{ datalength }} {{ $t("requests") }}
      </p>
    </v-col>
  </v-row>
</template>

<script>
import axios from "axios";
export default {
  created() {
    axios.get("/api/buyRequest/").then((response) => {
      console.log(response);
      this.data = response.data.data;
    });
  },
  data() {
    return {
      data: [],
      chartData: {
        labels: ["requests"],
        datasets: [
          {
            label: " working on 1 stage",
            data: [40],
            backgroundColor: "#770f30",
            borderRadius: 10,
          },
          {
            label: " working on 2 stages ",
            data: [20],
            backgroundColor: "#FED579",
            borderRadius: 10,
          },
          {
            label: "working on more than 2 stages ",
            data: [14],
            backgroundColor: "#ABBAC2",
            borderRadius: 10,
          },
        ],
      },
    };
  },
  computed: {
    datalength() {
      return this.data.length;
    },
  },
};
</script>
