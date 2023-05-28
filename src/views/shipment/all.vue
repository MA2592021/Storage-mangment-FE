<template>
  <v-row>
    <v-col cols="12" class="text-center mt-4"
      ><span
        ><v-icon
          icon=" mdi-truck"
          style="color: #fbc02d"
          class="mb-2 mr-2"
        ></v-icon>
        <span class="text-h5" style="color: #fbc02d">All shipments</span></span
      ></v-col
    >

    <v-col cols="12">
      <tt
        v-bind:data="shipment"
        v-bind:header="headers.shipment_header"
        v-bind:title="$t(`'all shipments'`)"
        @tableClicked="tableClicked"
      /> </v-col
  ></v-row>
</template>

<script>
import moment from "moment";
import tt from "../../components/table.vue";
import { useheaders } from "../../stores/headers";
import axios from "axios";
export default {
  components: {
    tt,
  },
  //test
  data() {
    return {
      shipment: [],
    };
  },
  created() {
    //Get route
    axios.get("/api/shipment/").then((response) => {
      console.log(response);
      response.data.data.forEach((element) => {
        const x = {};
        x._id = element._id;
        x.order = element.order.name;
        x.name = element.name;
        x.time = moment(element.createdAt).calendar();
        this.shipment.push(x);
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
      // console.log(this.shipment.employee);
      this.$router.push({
        path: `/shipment/${value._id}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
