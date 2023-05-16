<template>
  <v-row>
    <v-col cols="12" class="text-center mt-4"
      ><span
        ><v-icon
          icon=" mdi-hanger"
          style="color: #fbc02d"
          class="mb-2 mr-2"
        ></v-icon>
        <span class="text-h5" style="color: #fbc02d">{{
          $t("models.allModels")
        }}</span></span
      ></v-col
    >

    <v-col cols="12">
      <tt
        v-bind:data="models"
        v-bind:header="headers.model_header"
        @tableClicked="tableClicked"
      /> </v-col
  ></v-row>
</template>

<script>
import tt from "../../components/table.vue";
import axios from "axios";
import { useheaders } from "../../stores/headers";

export default {
  components: {
    tt,
  },
  data() {
    return {
      models: [],
    };
  },
  created() {
    //Get route here
    axios.get("/api/model/").then((response) => {
      this.models = response.data.data;
    });
  },
  setup() {
    const headers = useheaders();
    return { headers };
  },
  methods: {
    tableClicked(value) {
      console.log(value);
      // console.log(this.employees.employee);
      this.$router.push({
        path: `/model/${value._id}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
