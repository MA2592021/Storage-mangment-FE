<template>
  <v-card elevation="0" style="width: 100%">
    <v-card-title class="text-center">
      <v-icon icon="mdi-plus" style="color: #fbc02d" class="mb-2"></v-icon>
      <span class="text-h5" style="color: #fbc02d">Add request</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              label="Name*"
              v-model="request.name"
              required
              hint="Required"
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="6"
            ><v-textarea
              clearable
              label="details"
              v-model="request.details"
              prepend-icon="mdi-note-text-outline"
            ></v-textarea>
          </v-col>
          <v-col cols="12"
            ><v-textarea
              clearable
              label="Note"
              v-model="request.note"
              prepend-icon="mdi-note-text-outline"
            ></v-textarea>
          </v-col>
          <v-col cols="12" sm="12">
            <imageuploader @image="imageup"></imageuploader
          ></v-col>
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
import imageuploader from "../../components/imageuploader.vue";
import swal from "sweetalert";
export default {
  components: {
    imageuploader,
  },
  data: () => ({
    request: {
      name: "",
      details: "",
      note: "    ",
      img: null,
    },
  }),

  methods: {
    add() {
      console.log("im alive");
      axios
        .post("/api/buyRequest/", {
          name: this.request.name,
          details: this.request.details,
          image: this.request.img,
          note: this.request.note,
        })
        .then((response) => {
          if (response.data.errors) {
            console.log(response);
            swal("error", response.data.errors[0].msg, "error");
          } else {
            swal("success", "request added successfully", "success");
            this.$router.push({ path: "/request/all" });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    imageup(image) {
      this.requset.img = image;
    },
  },
};
</script>
