<template>
  <v-card elevation="0" style="width: 100%">
    <v-card-title class="text-center">
      <v-icon icon="mdi-plus" style="color: #fbc02d" class="mb-2"></v-icon>
      <span class="text-h5" style="color: #fbc02d">{{
        $t("employees.add")
      }}</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              :label="$t(`name`) + '*'"
              v-model="employee.name"
              required
              hint="Required"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              required
              v-model="employee.code"
              :label="$t(`code`) + '*'"
              hint="Required"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              :label="$t(`phone`)"
              v-model="employee.phone"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              v-model="employee.nid"
              :label="$t(`nid`)"
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="6">
            <v-autocomplete
              :label="$t(`role`) + '*'"
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
              :label="$t(`note`) + '*'"
              v-model="employee.note"
              prepend-icon="mdi-note-text-outline"
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
      <!-- <v-btn color="blue-darken-1" variant="text"> Close </v-btn> -->
      <v-btn color="green-darken-1" variant="text" @click="add">
        {{ $t("save") }}
      </v-btn>
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
          value[0].size < 10000000 ||
          "image size should be less than 10 MB!"
        );
      },
    ],
    roles: [],
    url: null,
    image: null,
    employee: {
      name: "",
      code: "",
      phone: null,
      nid: null,
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
      let data = {};
      if (this.employee.phone === null && this.employee.nid === null) {
        data = {
          name: this.employee.name,
          code: this.employee.code,
          role: this.employee.role._id,
          note: this.employee.note,
          image: this.employee.img,
        };
      } else if (this.employee.phone === null) {
        data = {
          name: this.employee.name,
          code: this.employee.code,
          role: this.employee.role._id,
          note: this.employee.note,
          image: this.employee.img,
          phoneNo: this.employee.phone,
        };
      } else if (this.employee.nid === null) {
        data = {
          name: this.employee.name,
          code: this.employee.code,
          role: this.employee.role._id,
          NID: this.employee.nid,
          note: this.employee.note,
          image: this.employee.img,
        };
      } else {
        data = {
          name: this.employee.name,
          code: this.employee.code,
          role: this.employee.role._id,
          phoneNo: this.employee.phone,
          NID: this.employee.nid,
          note: this.employee.note,
          image: this.employee.img,
        };
      }
      axios
        .post("/api/employee", data)
        .then((response) => {
          if (response.data.errors) {
            console.log(response);
            swal("error", response.data.errors[0].msg, "error");
          } else {
            swal("success", "employee added successfully", "success");
            this.$router.push({
              path: "/employee/all",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    imageup(image) {
      this.employee.img = image;
    },
  },
};
</script>
