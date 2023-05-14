<style lang="scss" scoped></style>
<template>
  <v-card elevation="0" style="width: 100%">
    <v-card-title class="text-center">
      <v-icon icon="mdi-plus" style="role: #fbc02d" class="mb-2"></v-icon>
      <span class="text-h5" style="role: #fbc02d">Add role</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              label="Name*"
              v-model="role.title"
              required
              hint="Required"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              required
              v-model="role.number"
              label="priority*"
              hint="Required"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
      <small>*indicates required field</small>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue-darken-1" variant="text"> Close </v-btn>
      <v-btn color="green-darken-1" variant="text" @click="add"> Save </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from "axios";
import sweetalert from "sweetalert";
export default {
  data: () => ({
    role: {
      title: "",
      number: "",
    },
  }),

  methods: {
    add() {
      // this.url = URL.createObjectURL(this.role.img);
      console.log("im alive");
      axios
        .post("/api/role", {
          title: this.role.title,
          number: this.role.number,
        })
        .then((response) => {
          if (response.data.errors) {
            console.log(response);
            swal("error", response.data.errors[0].msg, "error");
          } else {
            swal("success", "role added successfully", "success");
            this.$router.push({ path: "/utils/role/all" });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
