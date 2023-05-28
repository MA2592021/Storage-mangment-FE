<template>
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
  >
    <template v-slot:item.colors="{ item }">
      <h4 v-for="color in item.raw.colors" :key="color">
        {{ color.name }}
      </h4>
    </template>
    <template v-slot:item.sizes="{ item }">
      <h4 v-for="size in item.raw.sizes" :key="size">
        {{ size.name }}
      </h4>
    </template>
  </v-data-table>
</template>

<script>
import { usedata } from "../../stores/print_data";

export default {
  mounted() {
    setTimeout(() => {
      window.print();
    }, 2000);
  },

  created() {
    console.log(this.data);
    console.log(this.print_data);
  },
  setup() {
    const print_data = usedata();
    return { print_data };
  },
};
</script>

<style>
tbody tr:nth-of-type(odd) {
  background-color: rgba(248, 0, 0, 0.06) !important;
}
</style>
