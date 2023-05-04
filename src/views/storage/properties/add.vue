<template>
  <v-card elevation="0" style="width: 100%">
    <v-card-title class="text-center">
      <v-icon icon="mdi-plus" style="color: #fbc02d" class="mb-2"></v-icon>
      <span class="text-h5" style="color: #fbc02d">Add property</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              label="Name*"
              v-model="property.name"
              required
              hint="Required"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="3" md="3">
            <v-text-field
              required
              v-model="property.unit"
              label="unit*"
              hint="Required"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="3" md="3">
            <v-text-field
              label="type*"
              v-model="property.type"
              hint="Required"
              required
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="6">
            <v-autocomplete
              label="Role*"
              chips
              v-model="property.role"
              persistent-hint
              hint="Required"
              :items="roles"
              item-title="title"
              return-object
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" sm="3" md="3">
            <v-text-field
              required
              v-model="property.max"
              label="max*"
              hint="Required"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="3" md="3">
            <v-text-field
              required
              v-model="property.min"
              label="min*"
              hint="Required"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6"
            ><v-textarea
              clearable
              label="Note"
              v-model="property.note"
              prepend-inner-icon="mdi-note-text-outline"
            ></v-textarea>
          </v-col>

          <v-col cols="12" sm="6"
            ><v-textarea
              clearable
              label="details"
              v-model="property.details"
              prepend-inner-icon="mdi-note-text-outline"
            ></v-textarea>
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
import imageuploader from "../../../components/imageuploader.vue";
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
    property: {
      name: "",
      unit: "",
      type: "",
      max: "",
      min: "",
      img: "",
      role: null,
      note: "    ",
      details: "    ",
    },
    roles: [],
  }),
  created() {
    axios.get("/api/role").then((response) => {
      this.roles = response.data.data;
    });
  },
  methods: {
    add() {
      // this.url = URL.createObjectURL(this.property.img);
      console.log("im alive");
      axios
        .post("/api/custody/", {
          name: this.property.name,
          unit: this.property.unit,
          "role.title": this.property.role.title,
          "role.num": this.property.role.number,
          type: this.property.type,
          max: this.property.max,
          min: this.property.min,
          note: this.property.note,
          details: this.property.details,
        })
        .then((response) => {
          if (response.data.errors) {
            console.log(response);
            swal("error", response.data.errors[0].msg, "error");
          } else {
            swal("success", "yay", "success");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    imageup(image) {
      this.property.img = image[0];
    },
  },
};
</script>
