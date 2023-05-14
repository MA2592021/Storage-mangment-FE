<style lang="scss" scoped></style>
<template>
  <v-card elevation="0" style="width: 100%">
    <v-card-title class="text-center">
      <v-icon icon="mdi-plus" style="size: #fbc02d" class="mb-2"></v-icon>
      <span class="text-h5" style="size: #fbc02d">Add size</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              label="Name*"
              v-model="size.name"
              required
              hint="Required"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              required
              v-model="size.code"
              label="code*"
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
    size: {
      name: "",
      code: "",
    },
  }),

  methods: {
    add() {
      // this.url = URL.createObjectURL(this.size.img);
      console.log("im alive");
      axios
        .post("/api/size", {
          name: this.size.name,
          code: this.size.code,
        })
        .then((response) => {
          if (response.data.errors) {
            console.log(response);
            swal("error", response.data.errors[0].msg, "error");
          } else {
            swal("success", "size added successfully", "success");
            this.$router.push({ path: "/utils/size/all" });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
