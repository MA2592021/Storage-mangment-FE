<template>
  <v-card class="mx-auto" elevation="2" style="width: 100%"
    ><v-row
      ><v-col cols="3" sm="2"
        ><v-img
          class="bg-white"
          width="300"
          :aspect-ratio="1"
          :src="size.img"
          cover
        ></v-img></v-col
      ><v-col cols="9" sm="10">
        <v-row>
          <v-col cols="12">
            <v-text-field
              label="Name "
              required
              :readonly="dis === true"
              v-model="size.name"
              variant="underlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              label="code "
              required
              :readonly="dis === true"
              v-model="size.code"
              variant="underlined"
            ></v-text-field>
          </v-col>
        </v-row> </v-col></v-row
    ><v-card-actions class="mx-auto">
      <v-btn @click="cancel()" prepend-icon=" mdi-delete-forever" color="red">
        Delete
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      size: {},
    };
  },
  created() {
    //Get route
    axios.get("/api/size/" + this.$route.params.id).then((response) => {
      console.log(response);
      this.size = response.data.data;
    });
  },
};
</script>
