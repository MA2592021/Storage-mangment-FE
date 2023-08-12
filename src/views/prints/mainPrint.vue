<template>
  <v-row>
    <v-col cols="9">
      <v-img
        class="bg-white"
        width="100"
        :aspect-ratio="1"
        src="/arkan_logo-withtext.png"
        cover
      ></v-img
    ></v-col>
    <v-col cols="3"
      ><p align="end">Date : {{ currentDate }}</p>
    </v-col>
  </v-row>
  <h1 align="center">{{ print_data.title }}</h1>

  <br />
  <v-data-table
    :headers="print_data.header"
    :items="print_data.data"
    prev-icon="no"
    next-icon="no"
    last-icon="ss"
    first-icon="ss"
    items-per-page-text=""
    :items-per-page="print_data.data.length"
  ></v-data-table>
</template>

<script>
import { usedata } from "../../stores/print_data";
import moment from "moment";
export default {
  mounted() {
    setTimeout(() => {
      window.print();
    }, 2000);
  },

  setup() {
    const print_data = usedata();
    return { print_data };
  },
  data() {
    return {
      currentDate: moment().format("YYYY-MM-DD HH:mm"),
    };
  },
};
</script>

<style>
@media print {
  /* Hide headers and footers when printing */
  @page {
    size: auto;
    margin: 0;
  }
}
</style>
