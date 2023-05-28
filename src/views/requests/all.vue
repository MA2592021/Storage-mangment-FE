<template>
  <v-row>
    <v-col cols="12" class="text-center mt-4"
      ><span
        ><v-icon
          icon=" mdi-note-multiple"
          style="color: #fbc02d"
          class="mb-2 mr-2"
        ></v-icon>
        <span class="text-h5" style="color: #fbc02d">All request</span></span
      ></v-col
    >

    <v-col cols="12">
      <tt
        v-bind:data="request"
        v-bind:header="headers.request_header"
        v-bind:title="'All request'"
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
      request: [],
    };
  },
  created() {
    //Get route
    axios.get("/api/buyRequest/").then((response) => {
      console.log(response);
      response.data.data.forEach((element) => {
        const x = {};
        x._id = element._id;
        x.status = element.history[element.history.length - 1].state;
        x.name = element.name;
        x.time = moment(element.createdAt).calendar();
        this.request.push(x);
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
      // console.log(this.request.employee);
      this.$router.push({
        path: `/request/${value._id}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
