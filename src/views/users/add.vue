<template>
  <v-card elevation="0" style="width: 100%">
    <v-card-title class="text-center">
      <v-icon icon="mdi-plus" style="color: #fbc02d" class="mb-2"></v-icon>
      <span class="text-h5" style="color: #fbc02d">{{ $t("users.add") }}</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              :label="$t(`name`) + '*'"
              v-model="user.name"
              required
              hint="Required"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              required
              v-model="user.code"
              :label="$t(`code`) + '*'"
              hint="Required"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              :label="$t(`password`) + '*'"
              v-model="user.password"
              hint="Required"
              required
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="6">
            <v-autocomplete
              :label="$t(`role`) + '*'"
              chips
              v-model="user.role"
              persistent-hint
              hint="Required"
              :items="roles"
              item-title="title"
              return-object
            ></v-autocomplete>
          </v-col>

          <v-col cols="12" sm="12">
            <imageuploader @selected="imageup" />
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
import imageuploader from "../../components/imageuploader.vue";
import axios from "axios";
import swal from "sweetalert";
export default {
  components: { imageuploader },
  data: () => ({
    rules: [
      (value) => {
        return (
          !value ||
          !value.length ||
          value[0].size < 2000000 ||
          "Avatar size should be less than 2 MB!"
        );
      },
    ],
    roles: [],
    url: null,
    image: null,
    user: {
      name: "",
      code: "",
      password: "",
      role: null,
    },
  }),
  created() {
    axios.get("/api/userRole/").then((response) => {
      this.roles = response.data.data;
    });
  },

  methods: {
    add() {
      // this.url = URL.createObjectURL(this.user.img);
      console.log("im alive");
      axios
        .post("/api/user/", {
          name: this.user.name,
          code: this.user.code,
          role: this.user.role._id,
          password: this.user.password,
        })
        .then((response) => {
          if (response.data.errors) {
            console.log(response);
            swal("error", response.data.errors[0].msg, "error");
          } else {
            swal("success", "user added successfully", "success");
            this.$router.push({
              path: "/user/all",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    imageup(image) {
      this.user.img = image[0];
    },
  },
};
</script>
