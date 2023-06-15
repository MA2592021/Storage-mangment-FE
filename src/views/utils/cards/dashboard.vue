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
      <p class="text-h5">Arkan have {{ datalength }} Cards</p>
    </v-col>
  </v-row>
</template>

<script>
import axios from "axios";
export default {
  created() {
    axios.get("/api/card/").then((response) => {
      this.data = response.data.data;
    });
  },

  data() {
    return { data: [] };
  },
  computed: {
    datalength() {
      return this.data.length;
    },
  },
};
</script>
