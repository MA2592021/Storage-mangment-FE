<template>
  <v-card elevation="0" style="width: 100%">
    <v-card-title class="text-center">
      <v-icon icon="mdi-plus" style="color: #fbc02d" class="mb-2"></v-icon>
      <span class="text-h5" style="color: #fbc02d">Add client</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              label="Name*"
              v-model="client.name"
              required
              hint="Required"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="3" md="3">
            <v-text-field
              required
              v-model="client.phoneNo"
              label="phoneNo*"
              hint="Required"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="3" md="3">
            <v-text-field
              label="state*"
              v-model="client.state"
              hint="Required"
              required
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="6">
            <v-textarea
              clearable
              label="address"
              v-model="client.address"
              prepend-inner-icon="mdi-note-text-outline"
            ></v-textarea>
          </v-col>

          <v-col cols="12" sm="6"
            ><v-textarea
              clearable
              label="Note"
              v-model="client.note"
              prepend-inner-icon="mdi-note-text-outline"
            ></v-textarea>
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
      <v-btn color="blue-darken-1" variant="text"> Close </v-btn>
      <v-btn color="green-darken-1" variant="text" @click="add"> Save </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import imageuploader from "../../components/imageuploader.vue";
import axios from "axios";
import sweetalert from "sweetalert";
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
    url: null,
    image: null,
    client: {
      name: "",
      phoneNo: "",
      state: "",
      address: "",
      img: "",
      note: "    ",
    },
  }),

  methods: {
    add() {
      // this.url = URL.createObjectURL(this.client.img);
      console.log("im alive");
      axios
        .post("/api/client", {
          name: this.client.name,
          phoneNo: this.client.phoneNo,
          state: this.client.state,
          address: this.client.address,
          note: this.client.note,
          image: this.client.img,
        })
        .then((response) => {
          if (response.data.errors) {
            console.log(response);
            swal("error", response.data.errors[0].msg, "error");
          } else {
            swal("success", "yay", "success").then(() =>
              this.$router.push({ path: "/client/all" })
            );
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    imageup(image) {
      this.client.img = image;
    },
  },
};
</script>
