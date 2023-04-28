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
        {{ employees.total }}
      </v-progress-circular>
      <p class="text-h5">Arkan have {{ employees.total }} employees</p>
    </v-col>
    <v-col cols="12" md="4"> <barChart v-bind:chartData="chartData" /> </v-col
  ></v-row>
</template>

<script>
import barChart from "../../components/barChart.vue";
import { useemployee } from "../../stores/employees";
export default {
  components: {
    barChart,
  },
  setup() {
    const employees = useemployee();
    return { employees };
  },
  data() {
    return {
      chartData: {
        labels: ["employees"],
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
};
</script>
