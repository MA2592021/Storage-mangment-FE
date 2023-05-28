<template>
  <v-row>
    <v-col cols="12" class="text-center mt-4"
      ><span
        ><v-icon
          icon=" mdi-size-xl"
          style="size: #fbc02d"
          class="mb-2 mr-2"
        ></v-icon>
        <span class="text-h5" style="size: #fbc02d">All sizes</span></span
      ></v-col
    >

    <v-col cols="12">
      <tt
        v-bind:data="sizes"
        v-bind:header="headers.color_size_header"
        v-bind:title="'All Sizes'"
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
      sizes: [],
    };
  },
  created() {
    //Get route
    axios.get("/api/size/").then((response) => {
      console.log(response);
      this.sizes = response.data.data;
    });
  },
  setup() {
    const headers = useheaders();
    return { headers };
  },
  methods: {
    tableClicked(value) {
      // console.log(value);
      // console.log(this.sizes.employee);
      this.$router.push({
        path: `/utils/size/${value._id}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
