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
    :headers="properties.headers"
    :items="properties.data"
    :search="search"
    :items-per-page="itemsPerPage"
    v-model:sort-by="sortBy"
    hover
    hide-default-footer
    @update:options="options = $event"
  >
    <template v-slot:item="{ item }">
      <tr @click="onClick(item.columns)" v-ripple>
        <td v-for="h in properties.headers" :key="h.key">
          {{ item.columns[`${h.key}`] }}
        </td>
      </tr>
    </template>
    <template v-slot:bottom>
      <div class="text-center pt-2">
        <v-pagination
          v-model="page"
          class="my-4"
          :length="pages"
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
  {{ pages }}
</template>
<script>
import { usestore } from "../stores/employees";
import { useproperties } from "../stores/properties";
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
      return this[`${table}.total`] / this.itemsPerPage + 0.4;
    },
  },
  setup() {
    const employees = usestore();
    const properties = useproperties();
    return { employees, properties };
  },
  emits: ["tableClicked"],

  methods: {
    onClick(row) {
      console.log(row);
      this.$emit("tableClicked", row);
    },
  },
};
</script>
