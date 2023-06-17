<template>
  <v-card class="mx-auto" elevation="2" style="width: 100%">
    <v-row class="ma-3">
      <v-col cols="12" sm="6">
        <v-text-field
          label="code "
          required
          readonly
          v-model="card.code"
          variant="underlined"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          label="order "
          required
          readonly
          v-model="card.code"
          variant="underlined"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          label="model "
          required
          readonly
          v-model="card.code"
          variant="underlined"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          label="current Stage "
          required
          readonly
          v-model="card.code"
          variant="underlined"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-card-actions class="mx-auto">
      <v-btn @click="deletee()" color="red" prepend-icon=" mdi-delete-forever">
        Delete
      </v-btn>
    </v-card-actions>
  </v-card>
  <cardPanel v-bind:card="card" class="mt-4" />
</template>

<script>
import axios from "axios";
import swal from "sweetalert";
import cardPanel from "../../../components/cardPanel.vue";
export default {
  components: { cardPanel },
  data() {
    return {
      card: {},
    };
  },
  created() {
    //Get route
    axios.get("/api/card/" + this.$route.params.id).then((response) => {
      console.log(response);
      this.card = response.data.data;
    });
  },
  methods: {
    deletee() {
      swal({
        title: "Are you sure?",
        text: "Are you sure that you want to delete this card?",
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
                    .delete("/api/card/" + this.$route.params.id)
                    .then((response) => {
                      if (response.data.errors) {
                        swal("error", response.data.errors[0].msg, "error");
                      } else {
                        swal(
                          "success",
                          "card deleted suuccessfully",
                          "success"
                        ).then(() => {
                          this.$router.push({ path: "/utils/cards/all" });
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
