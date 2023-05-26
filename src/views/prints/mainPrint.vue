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
      <v-data-table
        :headers="headers.employee_header"
        :items="employees"
        :pagination="false"
        :items-per-page="employees.length"
        hide-default-footer
        item-value="name"
        class="elevation-1"
      ></v-data-table> </v-col
  ></v-row>
</template>

<script>
import axios from "axios";
export default {
  mounted() {
    setTimeout(() => {
      window.print();
    }, 2000);
  },

  props: {
    data: Array,
    headers: Array,
  },
};
</script>

<style lang="scss" scoped></style>
