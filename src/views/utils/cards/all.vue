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
      />
    </v-col>
    <v-col cols="12" align="center"
      ><v-btn @click="swap()" color="red" v-if="!all">view all cards</v-btn
      ><v-btn @click="swap()" color="green" v-if="all"
        >view 100 cards</v-btn
      ></v-col
    >
  </v-row>
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
      all: false,
    };
  },
  created() {
    //Get route
    this.load100card();
  },

  setup() {
    const headers = useheaders();
    return { headers };
  },
  methods: {
    swap() {
      if (this.all === false) {
        this.loadallcard();
        this.all = true;
      } else {
        this.load100card();
        this.all = false;
      }
    },
    load100card() {
      axios.get("/api/card/last/100").then((response) => {
        console.log(response);

        this.cards = response.data.data;
      });
    },
    loadallcard() {
      axios.get("/api/card/").then((response) => {
        console.log(response);

        this.cards = response.data.data;
      });
    },
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
