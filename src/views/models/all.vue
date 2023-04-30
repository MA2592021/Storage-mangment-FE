<template>
  <v-row>
    <v-col cols="12" class="text-center mt-4"
      ><span
        ><v-icon
          icon=" mdi-hanger"
          style="color: #fbc02d"
          class="mb-2 mr-2"
        ></v-icon>
        <span class="text-h5" style="color: #fbc02d">All Models</span></span
      ></v-col
    >

    <v-col cols="12">
      <tt
        v-bind:data="models"
        v-bind:header="headers.model_header"
        @tableClicked="tableClicked"
      /> </v-col
  ></v-row>
</template>

<script>
import tt from "../../components/table.vue";
import { useheaders } from "../../stores/headers";

export default {
  components: {
    tt,
  },
  data() {
    return {
      models: [
        {
          _id: 1,
          name: "dafa",
          colors: [
            { name: "red", code: "231" },
            { name: "black", code: "231" },
          ],
          sizes: [
            { name: "XL", code: "65" },
            { name: "L", code: "65" },
          ],
          details: "any details here bbe",
          note: "asdasd",
          image: "",
          stages: [
            { name: "stage1", id: "2", priorty: "1", machine_type: "singer" },
          ],
          materials: [{ name: "zorar", id: "22", qty: "12" }],
        },

        {
          _id: 2,
          name: "abo el feda",
          colors: [
            { name: "red", code: "231" },
            { name: "black", code: "231" },
          ],
          sizes: [
            { name: "XL", code: "65" },
            { name: "L", code: "65" },
          ],
          details: "any details here bbe",
          note: "asdasd",
          image: "",
          stages: [
            { name: "stage1", id: "2", priorty: "1", machine_type: "singer" },
          ],
          materials: [{ name: "zorar", id: "22", qty: "12" }],
        },

        {
          _id: 3,
          name: "mnasek",
          colors: [
            { name: "red", code: "231" },
            { name: "black", code: "231" },
          ],
          sizes: [
            { name: "XL", code: "65" },
            { name: "L", code: "65" },
          ],
          details: "any details here bbe",
          note: "asdasd",
          image: "",
          stages: [
            { name: "stage1", id: "2", priorty: "1", machine_type: "singer" },
          ],
          materials: [{ name: "zorar", id: "22", qty: "12" }],
        },
      ],
    };
  },
  created() {
    //Get route here
  },
  setup() {
    const headers = useheaders();
    return { headers };
  },
  methods: {
    tableClicked(value) {
      console.log(value);
      // console.log(this.employees.employee);
      this.$router.push({
        path: `/model/${value._id}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
