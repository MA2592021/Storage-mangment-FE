<template>
  <v-card elevation="0" style="width: 100%">
    <v-card-title class="text-center">
      <v-icon icon="mdi-plus" style="color: #fbc02d" class="mb-2"></v-icon>
      <span class="text-h5" style="color: #fbc02d">Add Employee</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              label="Name*"
              v-model="employee.name"
              required
              hint="Required"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              required
              v-model="employee.code"
              label="Code*"
              hint="Required"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              label="Phone number*"
              v-model="employee.phone"
              hint="Required"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              required
              v-model="employee.nid"
              label="National ID*"
              hint="Required"
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="6">
            <v-autocomplete
              label="Role*"
              chips
              v-model="employee.role"
              persistent-hint
              hint="Required"
              :items="roles"
              item-title="title"
              return-object
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" sm="6"
            ><v-textarea
              clearable
              label="Note"
              v-model="employee.note"
              prepend-icon="mdi-note-text-outline"
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
    roles: "",
    url: null,
    image: null,
    employee: {
      name: "",
      code: "",
      phone: "",
      nid: "",
      img: "",
      role: null,
      note: "    ",
    },
  }),
  created() {
    axios.get("/api/role/").then((response) => {
      this.roles = response.data.data;
    });
  },

  methods: {
    add() {
      // this.url = URL.createObjectURL(this.employee.img);
      console.log("im alive");
      axios
        .post("/api/employee", {
          name: this.employee.name,
          code: this.employee.code,
          "role.title": this.employee.role.title,
          "role.num": this.employee.role.number,
          phoneNo: this.employee.phone,
          NID: this.employee.nid,
          note: this.employee.note,
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
      this.employee.img = image[0];
    },
  },
};
</script>
