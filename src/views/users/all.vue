<template>
  <v-row>
    <v-col cols="12" class="text-center mt-4"
      ><span
        ><v-icon
          icon=" mdi-badge-account"
          style="color: #fbc02d"
          class="mb-2 mr-2"
        ></v-icon>
        <span class="text-h5" style="color: #fbc02d">{{
          $t("users.all")
        }}</span></span
      ></v-col
    >

    <v-col cols="12">
      <tt
        v-bind:data="employees"
        v-bind:header="headers.employee_header"
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
  //test
  data() {
    return {
      employees: [],
    };
  },
  created() {
    //Get route
    axios.get("/api/user/").then((response) => {
      console.log(response);
      response.data.data.forEach((element) => {
        const x = {};
        x._id = element._id;
        x.code = element.code;
        x.name = element.name;
        x.role = element.role.title;
        this.employees.push(x);
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
      // console.log(this.employees.employee);
      this.$router.push({
        path: `/user/${value._id}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
