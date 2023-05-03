<template>
  <v-row>
    <v-col cols="12" class="text-center mt-4"
      ><span
        ><v-icon
          icon=" mdi-palette"
          style="color: #fbc02d"
          class="mb-2 mr-2"
        ></v-icon>
        <span class="text-h5" style="color: #fbc02d">All colors</span></span
      ></v-col
    >

    <v-col cols="12">
      <tt
        v-bind:data="colors"
        v-bind:header="headers.color_size_header"
        @tableClicked="tableClicked"
      /> </v-col
  ></v-row>
</template>

<script>
import tt from "../../../components/table.vue";
import { useheaders } from "../../../stores/headers";
import axios from "axios";
export default {
  components: {
    tt,
  },
  data() {
    return {
      colors: [],
    };
  },
  created() {
    //Get route
    axios.get("/api/color/").then((response) => {
      console.log(response);
      this.colors = response.data.data;
    });
  },
  setup() {
    const headers = useheaders();
    return { headers };
  },
  methods: {
    tableClicked(value) {
      // console.log(value);
      // console.log(this.colors.employee);
      this.$router.push({
        path: `/utils/color/${value._id}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
