<template>
  <v-text-field
    v-model="search"
    label="Search"
    single-line
    hide-details
    class="mt-10"
  ></v-text-field>
  <v-data-table
    v-model:page="page"
    :headers="headers"
    :items="desserts"
    :search="search"
    :items-per-page="itemsPerPage"
    v-model:sort-by="sortBy"
    hover
    hide-default-footer
    @update:options="options = $event"
  >
    <template v-slot:item="{ item }">
      <tr @click="test = item.columns.code">
        <td v-for="h in headers" v-ripple :key="h.key">
          {{ item.columns[`${h.key}`] }}
        </td>
      </tr>
      <v-btn>a7a{{ item.columns.code }}</v-btn>
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
  {{ test }}
</template>
<script>
export default {
  data() {
    return {
      test: "a7a",
      sortBy: [{ key: "", order: "asc" }],
      options: {
        pageCount: 5,
      },
      search: "",

      page: 1,
      itemsPerPage: 5,
      headers: [
        {
          align: "start",
          key: "code",
          sortable: false,
          title: "code",
        },
        { title: "name", key: "name" },
        { title: "Role", key: "Role" },
        { title: "number", key: "number" },
      ],
      desserts: [
        {
          code: "254",
          name: "tomy",
          Role: "Admin",
          number: "01110133639",
        },
        {
          code: "1234",
          name: "sherif mohamed",
          Role: "employee",
          number: "01110133639",
        },
        {
          code: "876",
          name: "el gamal",
          Role: "Admin",
          number: "01110133639",
        },
        {
          code: "655",
          name: "amir",
          Role: "Admin",
          number: "01110133639",
        },
        {
          code: "254",
          name: "gamalko",
          Role: "Admin",
          number: "01110133639",
        },
      ],
    };
  },
  computed: {
    pages: function () {
      return this.desserts.length / this.itemsPerPage + 0.4;
    },
  },
};
</script>
