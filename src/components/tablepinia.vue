<template>
  <v-text-field
    v-model="search"
    label="Search"
    single-line
    hide-details
    class="mt-5"
  ></v-text-field>
  <v-data-table
    v-model:page="page"
    :headers="type === '1' ? data.headers : data.headers1"
    :items="type === '1' ? data.data : data.data1"
    :search="search"
    :items-per-page="itemsPerPage"
    v-model:sort-by="sortBy"
    hover
    hide-default-footer
    @update:options="options = $event"
  >
    <template v-slot:item="{ item }">
      <tr @click="onClick(item.columns)">
        <td
          v-ripple
          v-for="h in type === '1' ? data.headers : data.headers1"
          :key="h.key"
        >
          {{ item.columns[`${h.key}`] }}
        </td>
      </tr>
    </template>
    <template v-slot:bottom>
      <div class="text-center pt-2">
        <v-pagination
          v-model="page"
          class="my-4"
          :length="pages.toFixed()"
        ></v-pagination>
        <v-text-field
          :model-value="itemsPerPage"
          class="pa-2"
          label="Items per page"
          type="number"
          min="-1"
          max="15"
          hide-details
          @update:model-value="itemsPerPage = parseInt($event, 10)"
        ></v-text-field>
      </div>
    </template>
  </v-data-table>
</template>
<script>
import { usetable } from "../stores/tabledata";
export default {
  data() {
    return {
      sortBy: [{ key: "", order: "asc" }],
      options: {
        pageCount: 5,
      },
      search: "",
      table: "properties",
      page: 1,
      itemsPerPage: 5,
    };
  },
  computed: {
    pages: function () {
      return (
        (this.type === "1" ? this.data.total : this.data.total1) /
          this.itemsPerPage +
        0.4
      );
    },
  },
  props: {
    type: String,
  },
  setup() {
    const data = usetable();
    return { data };
  },
  emits: ["tableClicked"],

  methods: {
    onClick(row) {
      this.$emit("tableClicked", row);
    },
  },
};
</script>
