<style lang="scss" scoped></style>
<template>
  <v-card elevation="0" style="width: 100%">
    <v-card-title class="text-center">
      <v-icon icon="mdi-plus" style="color: #fbc02d" class="mb-2"></v-icon>
      <span class="text-h5" style="color: #fbc02d">Add color</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              label="Name*"
              v-model="color.name"
              required
              hint="Required"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              required
              v-model="color.code"
              label="code*"
              hint="Required"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="12">
            <imageuploader @image="imageup" />
          </v-col>
        </v-row>
      </v-container>
      <small>*indicates required field</small>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="green-darken-1" variant="text" @click="add"> Save </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import imageuploader from "../../../components/imageuploader.vue";
import axios from "axios";
import sweetalert from "sweetalert";
export default {
  components: { imageuploader },
  data: () => ({
    color: {
      name: "",
      code: "",
      image: "",
    },
  }),

  methods: {
    imageup(image) {
      this.color.image = image;
    },
    add() {
      // this.url = URL.createObjectURL(this.color.img);
      console.log("im alive");
      console.log(this.color);
      axios
        .post("/api/color", {
          name: this.color.name,
          code: this.color.code,
          image: this.color.image,
        })
        .then((response) => {
          if (response.data.errors) {
            console.log(response);
            swal("error", response.data.errors[0].msg, "error");
          } else {
            swal("success", "color added successfully", "success");
            this.$router.push({ path: "/utils/color/all" });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
