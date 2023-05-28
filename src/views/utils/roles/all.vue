<template>
  <v-row>
    <v-col cols="12" class="text-center mt-4"
      ><span
        ><v-icon
          icon=" mdi-script"
          style="role: #fbc02d"
          class="mb-2 mr-2"
        ></v-icon>
        <span class="text-h5" style="role: #fbc02d">All roles</span></span
      ></v-col
    >

    <v-col cols="12">
      <tt
        v-bind:data="roles"
        v-bind:header="headers.role_header"
        v-bind:title="'All Roles'"
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
      roles: [],
    };
  },
  created() {
    //Get route
    axios.get("/api/role/").then((response) => {
      console.log(response);
      this.roles = response.data.data;
    });
  },
  setup() {
    const headers = useheaders();
    return { headers };
  },
  methods: {
    tableClicked(value) {
      // console.log(value);
      // console.log(this.roles.employee);
      this.$router.push({
        path: `/utils/role/${value._id}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
