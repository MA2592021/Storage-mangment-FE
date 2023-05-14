<style lang="scss" scoped></style>
<template>
  <v-card elevation="0" style="width: 100%">
    <v-card-title class="text-center">
      <v-icon icon="mdi-plus" style="type: #fbc02d" class="mb-2"></v-icon>
      <span class="text-h5" style="type: #fbc02d">Add type</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-text-field
              label="Name*"
              v-model="type.name"
              required
              hint="Required"
            ></v-text-field>
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
import axios from "axios";
import sweetalert from "sweetalert";
export default {
  data: () => ({
    type: {
      name: "",
    },
  }),

  methods: {
    add() {
      // this.url = URL.createObjectURL(this.type.img);
      console.log("im alive");
      axios
        .post("/api/materialType", {
          type: this.type.name,
        })
        .then((response) => {
          if (response.data.errors) {
            console.log(response);
            swal("error", response.data.errors[0].msg, "error");
          } else {
            swal("success", "type added successfully", "success");
            this.$router.push({ path: "/utils/type/all" });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
