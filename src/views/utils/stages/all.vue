<template>
  <v-row>
    <v-col cols="12" class="text-center mt-4"
      ><span
        ><v-icon
          icon=" mdi-sitemap"
          style="size: #fbc02d"
          class="mb-2 mr-2"
        ></v-icon>
        <span class="text-h5" style="size: #fbc02d">All stages</span></span
      ></v-col
    >

    <v-col cols="12">
      <tt
        v-bind:data="stage"
        v-bind:header="headers.stage_header"
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
      stage: [],
    };
  },
  created() {
    //Get route
    axios.get("/api/stage/").then((response) => {
      console.log(response);
      this.stage = response.data.data;
    });
  },
  setup() {
    const headers = useheaders();
    return { headers };
  },
  methods: {
    tableClicked(value) {
      // console.log(value);
      // console.log(this.stage.employee);
      this.$router.push({
        path: `/utils/stage/${value._id}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
