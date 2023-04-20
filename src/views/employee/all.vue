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

    <v-col cols="12"> <tt v-bind:data="data" v-bind:header="headers" /> </v-col
  ></v-row>
</template>

<script>
import tt from "../../components/table.vue";
export default {
  components: {
    tt,
  },
  data() {
    return {
      headers: [
        {
          align: "start",
          key: "code",
          sortable: false,
          title: "code",
        },
        { title: "name", key: "name" },
        { title: "Role", key: "Role" },
        { title: "number", key: "number" },
      ],
      data: [
        {
          code: "254",
          name: "tomy",
          Role: "Admin",
          number: "01110133639",
        },
        {
          code: "1234",
          name: "sherif mohamed",
          Role: "employee",
          number: "01110133639",
        },
        {
          code: "876",
          name: "el gamal",
          Role: "Admin",
          number: "01110133639",
        },
        {
          code: "655",
          name: "amir",
          Role: "Admin",
          number: "01110133639",
        },
        {
          code: "254",
          name: "gamalko",
          Role: "Admin",
          number: "01110133639",
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped></style>
