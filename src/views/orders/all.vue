<template>
  <v-row>
    <v-col cols="12" class="text-center mt-4"
      ><span
        ><v-icon
          icon=" mdi-sitemap"
          style="size: #fbc02d"
          class="mb-2 mr-2"
        ></v-icon>
        <span class="text-h5" style="size: #fbc02d">{{
          $t("orders.allOrders")
        }}</span></span
      ></v-col
    >

    <v-col cols="12">
      <tt
        v-bind:data="order"
        v-bind:header="headers.order_header"
        @tableClicked="tableClicked"
      /> </v-col
  ></v-row>
</template>

<script>
import tt from "../../components/table.vue";
import { useheaders } from "../../stores/headers";
import axios from "axios";
import moment from "moment";
export default {
  components: {
    tt,
  },
  data() {
    return {
      order: [],
    };
  },
  created() {
    //Get route
    axios.get("/api/order/").then((response) => {
      console.log(response);
      response.data.data.forEach((element) => {
        console.log(element);
        const x = {};
        x._id = element._id;
        x.name = element.name;
        x.client = element.client.name;
        x.time = moment(element.createdAt).calendar();
        console.log(x);
        this.order.push(x);
      });
    });
  },
  setup() {
    const headers = useheaders();
    return { headers };
  },
  methods: {
    tableClicked(value) {
      // console.log(value);
      // console.log(this.order.employee);
      this.$router.push({
        path: `/order/${value._id}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
