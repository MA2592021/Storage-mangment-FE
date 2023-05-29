<template>
  <v-card class="mx-auto" elevation="2" style="width: 100%"
    ><v-row
      ><v-col cols="9" sm="10">
        <v-row>
          <v-col cols="12" class="ma-4">
            <v-text-field
              label="Name "
              required
              readonly
              v-model="types.type"
              variant="underlined"
            ></v-text-field>
          </v-col>
        </v-row> </v-col></v-row
    ><v-card-actions class="mx-auto">
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
      types: {},
    };
  },
  created() {
    //Get route
    axios.get("/api/materialType/" + this.$route.params.id).then((response) => {
      console.log(response);
      this.types = response.data.data;
    });
  },
  methods: {
    deletee() {
      swal({
        title: "Are you sure?",
        text: "Are you sure that you want to delete this type?",
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
                    .delete("/api/materialType/" + this.$route.params.id)
                    .then((response) => {
                      if (response.data.errors) {
                        swal("error", response.data.errors[0].msg, "error");
                      } else {
                        swal(
                          "success",
                          "type deleted suuccessfully",
                          "success"
                        ).then(() => {
                          this.$router.push({ path: "/utils/type/all" });
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
