<template>
  <v-row>
    <v-col cols="12" class="text-center mt-4"
      ><span
        ><v-icon
          icon=" mdi-palette-swatch"
          style="color: #fbc02d"
          class="mb-2 mr-2"
        ></v-icon>
        <span class="text-h5" style="color: #fbc02d">All Materials</span></span
      ></v-col
    >

    <v-col cols="12">
      <tt
        v-bind:data="materials"
        v-bind:header="headers.mat_header"
        v-bind:title="'all Materials'"
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
      materials: [],
    };
  },
  created() {
    //Get route
    axios.get("/api/material/").then((response) => {
      console.log(response);
      response.data.data.forEach((element) => {
        const x = {};
        x._id = element._id;
        x.name = element.name;
        x.type = element.type.type;
        x.quantity = element.quantity;
        x.available = element.available;
        x.max = element.max;
        x.min = element.min;
        x.role = element.role.title;
        this.materials.push(x);
      });
    });
  },
  setup() {
    const headers = useheaders();
    return { headers };
  },
  methods: {
    tableClicked(value) {
      // console.log(value);
      // console.log(this.materials.employee);
      this.$router.push({
        path: `/storage/material/${value._id}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
