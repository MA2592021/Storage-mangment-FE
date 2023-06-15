<template>
  <v-row>
    <v-col cols="12" class="text-center mt-4"
      ><span
        ><v-icon
          icon=" mdi-palette"
          style="color: #fbc02d"
          class="mb-2 mr-2"
        ></v-icon>
        <span class="text-h5" style="color: #fbc02d">All cards</span></span
      ></v-col
    >

    <v-col cols="12">
      <tt
        v-bind:data="cards"
        v-bind:header="headers.card_header"
        v-bind:title="'All cards'"
        @tableClicked="tableClicked"
      /> </v-col
  ></v-row>
</template>

<script>
import tt from "../../../components/table.vue";
import { useheaders } from "../../../stores/headers";
import axios from "axios";
export default {
  components: {
    tt,
  },
  data() {
    return {
      cards: [],
    };
  },
  created() {
    //Get route
    axios.get("/api/card/").then((response) => {
      console.log(response);

      this.cards = response.data.data;
    });
  },
  setup() {
    const headers = useheaders();
    return { headers };
  },
  methods: {
    tableClicked(value) {
      // console.log(value);
      // console.log(this.cards.employee);
      this.$router.push({
        path: `/utils/cards/${value._id}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
