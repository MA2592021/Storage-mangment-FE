<template>
  <v-card class="mx-auto" elevation="2" style="width: 100%">
    <v-row class="ma-3">
      <v-col cols="3" sm="2"
        ><v-img
          class="bg-white"
          width="300"
          :aspect-ratio="1"
          :src="color.image ? color.image.data : '/arkan_logo-no-text.png'"
          cover
        ></v-img></v-col
      ><v-col cols="9" sm="10">
        <v-row>
          <v-col cols="12">
            <v-text-field
              label="Name "
              required
              readonly
              v-model="color.name"
              variant="underlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              label="code "
              required
              readonly
              v-model="color.code"
              variant="underlined"
            ></v-text-field>
          </v-col> </v-row></v-col
    ></v-row>
    <v-card-actions class="mx-auto">
      <v-btn @click="deletee()" color="red" prepend-icon=" mdi-delete-forever">
        Delete
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from "axios";
import swal from "sweetalert";
export default {
  data() {
    return {
      color: {},
    };
  },
  created() {
    //Get route
    axios.get("/api/color/" + this.$route.params.id).then((response) => {
      console.log(response);
      this.color = response.data.data;
    });
  },
  methods: {
    deletee() {
      swal({
        title: "Are you sure?",
        text: "Are you sure that you want to delete this color?",
        icon: "warning",
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          swal("enter your password", {
            content: "input",
          }).then((value) => {
            axios
              .post("/api/auth/testCredentials", {
                code: localStorage.getItem("code"),
                password: value,
              })
              .then((response) => {
                if (response.data.errors) {
                  swal("error", response.data.errors[0].msg, "error");
                } else {
                  axios
                    .delete("/api/color/" + this.$route.params.id)
                    .then((response) => {
                      if (response.data.errors) {
                        swal("error", response.data.errors[0].msg, "error");
                      } else {
                        swal(
                          "success",
                          "color deleted suuccessfully",
                          "success"
                        ).then(() => {
                          this.$router.push({ path: "/utils/color/all" });
                        });
                      }
                    });
                }
              });
          });
        }
      });
    },
  },
};
</script>
