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
        v-bind:header="headers.mat_prop_header"
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
      materials: [
        {
          role: "aaa",
          _id: "644f5e907b81fa9ea02ba947",
          name: "material 1",
          quantity: 1000,
          available: 1000,
          max: 1000,
          min: 10,
          unit: "a",
        },
        {
          role: "aaa",
          _id: "644f5ec27b81fa9ea02ba949",
          name: "material 2",
          quantity: 0,
          available: 0,
          max: 1000,
          min: 10,
          details: "test",
          unit: "a",
          note: "test",
        },
        {
          role: "aaa",
          _id: "644f6c2810221101348d7a88",
          name: "material 3",
          quantity: 500,
          available: 495,
          max: 1000,
          min: 10,
          details: "test",
          unit: "a",
          note: "test",
        },
        {
          role: "employee",
          _id: "644f6eac10221101348d7aa1",
          name: "testtt",
          quantity: 1000,
          available: 1000,
          max: 1000,
          min: 50,
          unit: "ttt",
          note: "    ",
        },
      ],
    };
  },
  created() {
    //Get route
    // axios.get("/api/material/").then((response) => {
    //   console.log(response);
    //   this.materials = response.data.data;
    // });
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
