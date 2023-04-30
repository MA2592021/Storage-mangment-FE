<template>
  <v-row>
    <v-col cols="12" class="text-center mt-4"
      ><span
        ><v-icon
          icon=" mdi-account-group"
          style="color: #fbc02d"
          class="mb-2 mr-2"
        ></v-icon>
        <span class="text-h5" style="color: #fbc02d">All Employees</span></span
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
  data() {
    return {
      employees: [
        {
          note: "lailo lailo",
          img: "https://cdn.vuetifyjs.com/images/parallax/material.jpg",
          nid: "12312312313",
          code: "254",
          name: "tomy",
          role: "Supervisor",
          phone: "01110133639",
        },
        {
          note: "lailo lailo",
          img: "https://cdn.vuetifyjs.com/images/parallax/material.jpg",
          nid: "12312312313",
          code: "1234",
          name: "sherif mohamed",
          role: "employee",
          phone: "01110133639",
        },
        {
          code: "876",
          name: "el gamal",
          role: "Admin",
          phone: "01110133639",
          note: "lailo lailo",
          img: "",
          nid: "12312312313",
        },
        {
          code: "655",
          name: "amir",
          role: "Admin",
          phone: "01110133639",
          note: "lailo lailo",
          img: "",
          nid: "12312312313",
        },
        {
          code: "254",
          name: "gamalko",
          role: "Admin",
          phone: "01110133639",
          note: "lailo lailo",
          img: "",
          nid: "12312312313",
        },
      ],
    };
  },
  created() {
    //Get route
    axios.get("/api/employee/").then((response) => {
      console.log(response);
      this.employees = response.data.date;
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
        path: `/employee/${value._id}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
