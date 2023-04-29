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
        v-bind:data="employees.data"
        v-bind:header="employees.headers"
        @tableClicked="tableClicked"
      /> </v-col
  ></v-row>
</template>

<script>
import tt from "../../components/table.vue";
import { useemployee } from "../../stores/employees";
import { usetable } from "../../stores/tabledata";

export default {
  components: {
    tt,
  },
  data() {
    return {};
  },
  created() {
    this.table.data = this.employees.data;
    this.table.headers = this.employees.headers;
  },
  setup() {
    const employees = useemployee();
    const table = usetable();
    return { table, employees };
  },
  methods: {
    tableClicked(value) {
      // console.log(value);
      // console.log(this.employees.employee);
      this.$router.push({
        path: `/employee/${value.code}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
