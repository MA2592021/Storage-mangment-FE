<template>
  <v-row>
    <v-col cols="12" class="text-center mt-4"
      ><span
        ><v-icon
          icon=" mdi-format-list-bulleted-type"
          style="size: #fbc02d"
          class="mb-2 mr-2"
        ></v-icon>
        <span class="text-h5" style="size: #fbc02d">All types</span></span
      ></v-col
    >

    <v-col cols="12">
      <tt
        v-bind:data="types"
        v-bind:header="headers.type_header"
        v-bind:title="'All types'"
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
      types: [],
    };
  },
  created() {
    //Get route
    axios.get("/api/materialType/").then((response) => {
      console.log(response);
      this.types = response.data.data;
    });
  },
  setup() {
    const headers = useheaders();
    return { headers };
  },
  methods: {
    tableClicked(value) {
      // console.log(value);
      // console.log(this.types.employee);
      this.$router.push({
        path: `/utils/type/${value._id}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
