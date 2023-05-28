<template>
  <v-row>
    <v-col cols="12" class="text-center mt-4"
      ><span
        ><v-icon
          icon=" mdi-package-variant-closed"
          style="size: #fbc02d"
          class="mb-2 mr-2"
        ></v-icon>
        <span class="text-h5" style="size: #fbc02d">All cartons</span></span
      ></v-col
    >

    <v-col cols="12">
      <tt
        v-bind:data="carton"
        v-bind:header="headers.carton_header"
        v-bind:title="'all cartons'"
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
      carton: [],
    };
  },
  created() {
    //Get route
    axios.get("/api/carton/").then((response) => {
      console.log(response);
      this.carton = response.data.data;
    });
  },
  setup() {
    const headers = useheaders();
    return { headers };
  },
  methods: {
    tableClicked(value) {
      // console.log(value);
      // console.log(this.carton.employee);
      this.$router.push({
        path: `/storage/carton/${value._id}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
