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
    :headers="header"
    :items="data"
    :search="search"
    :items-per-page="itemsPerPage"
    v-model:sort-by="sortBy"
    hover
    hide-default-footer
    @update:options="options = $event"
  >
    <template v-slot:item="{ item }">
      <tr @click="onClick(item.raw)" v-ripple>
        <td
          v-for="h in header"
          :key="h.key"
          :class="
            item.raw.available >= item.raw.max
              ? 'bg-green'
              : item.raw.available <= item.raw.min
              ? 'bg-red'
              : ''
          "
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
export default {
  data() {
    return {
      sortBy: [{ key: "", order: "asc" }],
      options: {
        pageCount: 5,
      },
      search: "",

      page: 1,
      itemsPerPage: 5,
    };
  },
  computed: {
    pages: function () {
      return this.data.length / this.itemsPerPage + 0.4;
    },
  },
  emits: ["tableClicked"],
  props: {
    data: {
      type: Array,
    },
    header: {
      type: Array,
    },
  },

  methods: {
    onClick(obj) {
      console.log(obj);
      this.$emit("tableClicked", obj);
    },
  },
};
</script>
