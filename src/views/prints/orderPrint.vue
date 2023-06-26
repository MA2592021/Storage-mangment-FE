<template>
  <v-img
    class="bg-white"
    width="100"
    :aspect-ratio="1"
    src="/arkan_logo-withtext.png"
    cover
  ></v-img>
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
    <template v-slot:item.color="{ item }">
      <h4 v-for="model in item.raw.models" :key="model">
        {{ model.color.name }}
      </h4>
    </template>

    <template v-slot:item.size="{ item }">
      <h4 v-for="model in item.raw.models" :key="model">
        {{ model.size.name }}
      </h4>
    </template>
    <template v-slot:item.quantity="{ item }">
      <h4 v-for="model in item.raw.models" :key="model">
        {{ model.quantity }}
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
