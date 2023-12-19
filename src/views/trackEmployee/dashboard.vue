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
        {{ $t("arkan have") }} {{ datalength }} {{ $t("employees") }} Tracked
        Work Today
      </p>
    </v-col>
  </v-row>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return { data: [] };
  },
  computed: {
    datalength() {
      return this.data.length;
    },
  },
  created() {
    axios.get("/api/Salary/summary").then((res) => {
      console.log(res.data);
      this.data = res.data.data.filter((obj) => +obj.todayPieces > 0);
    });
  },
};
</script>
