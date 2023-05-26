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
  </v-data-table>
  <div align="center">
    <v-btn class="mx-auto" color="info" @click="printo()">print</v-btn>
  </div>
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
    printo() {},
  },
};
</script>
<style>
.list-enter-active,
.list-leave-active {
  transition: all 0.8s;
}
.list-enter,
.list-leave-to {
  opacity: 0;
  transform: translateY(100%);
}
.list-move {
  transition: transform 0.5s;
}
.item-row {
  display: table-row;
}
</style>
