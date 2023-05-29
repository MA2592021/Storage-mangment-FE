<template>
  <v-card class="mx-auto" elevation="2" style="width: 100%">
    <v-row class="ma-3">
      <v-col cols="12">
        <v-text-field
          label="Name "
          required
          readonly
          v-model="size.name"
          variant="underlined"
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-text-field
          label="code "
          required
          readonly
          v-model="size.code"
          variant="underlined"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-card-actions class="mx-auto">
      <v-btn @click="deletee()" prepend-icon=" mdi-delete-forever" color="red">
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
  methods: {
    deletee() {
      swal({
        title: "Are you sure?",
        text: "Are you sure that you want to delete this size?",
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
                    .delete("/api/size/" + this.$route.params.id)
                    .then((response) => {
                      if (response.data.errors) {
                        swal("error", response.data.errors[0].msg, "error");
                      } else {
                        swal(
                          "success",
                          "size deleted suuccessfully",
                          "success"
                        ).then(() => {
                          this.$router.push({ path: "/utils/size/all" });
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
