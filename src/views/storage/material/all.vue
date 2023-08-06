<template>
  <v-row>
    <v-col cols="12" class="text-center mt-4"
      ><span
        ><v-icon
          icon=" mdi-palette-swatch"
          style="color: #fbc02d"
          class="mb-2 mr-2"
        ></v-icon>
        <span class="text-h5" style="color: #fbc02d">{{
          $t("all_mats")
        }}</span></span
      ></v-col
    >

    <v-col cols="12">
      <v-text-field
        v-model="search"
        label="Search"
        single-line
        hide-details
        class="mt-5"
      ></v-text-field>
      <v-data-table
        :headers="header"
        :items="materials"
        :search="search"
        :group-by="groupBy"
        :items-per-page="itemsPerPage"
        v-model:sort-by="sortBy"
        hover
        hide-default-footer
        @update:options="options = $event"
        @click:row="tableClicked"
      ></v-data-table> </v-col
  ></v-row>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      materials: [],
      groupBy: [{ key: "type", order: "asc" }],

      sortBy: [{ key: "", order: "asc" }],
      options: {
        pageCount: 5,
      },
      dialog: false,
      search: "",
      page: 1,
      itemsPerPage: 5,
      header: [
        {
          align: "start",
          key: "name",
          sortable: false,
          title: "name",
        },

        { title: "quantity", key: "quantity" },
        { title: "available", key: "available" },
        { title: "role", key: "role" },
      ],
    };
  },
  created() {
    //Get route
    axios.get("/api/material/").then((response) => {
      console.log(response);
      response.data.data.forEach((element) => {
        const x = {};
        x._id = element._id;
        x.name = element.name;
        x.type = element.type.type;
        x.quantity = element.quantity;
        x.available = element.available;
        x.max = element.max;
        x.min = element.min;
        x.role = element.role.title;
        this.materials.push(x);
      });
    });
  },

  methods: {
    tableClicked(e, value) {
      console.log(value);
      // console.log(this.materials.employee);
      this.$router.push({
        path: `/storage/material/${value.item.raw._id}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
