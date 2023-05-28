<template>
  <v-row>
    <v-col cols="12" class="text-center mt-4"
      ><span
        ><v-icon
          icon=" mdi-ticket-account"
          style="color: #fbc02d"
          class="mb-2 mr-2"
        ></v-icon>
        <span class="text-h5" style="color: #fbc02d">All Suppliers</span></span
      ></v-col
    >

    <v-col cols="12">
      <tt
        v-bind:data="suppliers"
        v-bind:header="headers.supplier_header"
        v-bind:title="'All Suppliers'"
        @tableClicked="tableClicked"
      /> </v-col
  ></v-row>
</template>

<script>
import tt from "../../components/table.vue";
import { useheaders } from "../../stores/headers";
import axios from "axios";
export default {
  components: {
    tt,
  },
  data() {
    return {
      suppliers: [],
    };
  },
  created() {
    //Get route
    axios.get("/api/supplier/").then((response) => {
      console.log(response);
      this.suppliers = response.data.data;
    });
  },
  setup() {
    const headers = useheaders();
    return { headers };
  },
  methods: {
    tableClicked(value) {
      // console.log(value);
      // console.log(this.suppliers.employee);
      this.$router.push({
        path: `/supplier/${value._id}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
