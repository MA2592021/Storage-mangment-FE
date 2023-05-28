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
    <template v-slot:item="{ item }">
      <tr v-ripple>
        <td>
          {{ item.raw.id ? item.raw.id.name : item.raw.name }}
        </td>
        <td>
          {{ item.columns.size.name }}
        </td>
        <td>
          {{ item.columns.color.name }}
        </td>
        <td>
          {{ item.raw.quantity ? item.raw.quantity : item.raw.qty }}
        </td>
      </tr>
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
