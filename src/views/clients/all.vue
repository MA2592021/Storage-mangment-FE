<template>
  <v-row>
    <v-col cols="12" class="text-center mt-4"
      ><span
        ><v-icon
          icon=" mdi-account-tie"
          style="color: #fbc02d"
          class="mb-2 mr-2"
        ></v-icon>
        <span class="text-h5" style="color: #fbc02d">All clients</span></span
      ></v-col
    >

    <v-col cols="12">
      <tt
        v-bind:data="clients"
        v-bind:header="headers.supplier_header"
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
      clients: [],
    };
  },
  created() {
    //Get route
    axios.get("/api/client/").then((response) => {
      console.log(response);
      this.clients = response.data.data;
    });
  },
  setup() {
    const headers = useheaders();
    return { headers };
  },
  methods: {
    tableClicked(value) {
      // console.log(value);
      // console.log(this.clients.employee);
      this.$router.push({
        path: `/client/${value._id}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
