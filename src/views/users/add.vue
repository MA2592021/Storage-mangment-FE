<template>
  <v-card elevation="0" style="width: 100%">
    <v-card-title class="text-center">
      <v-icon icon="mdi-plus" style="color: #fbc02d" class="mb-2"></v-icon>
      <span class="text-h5" style="color: #fbc02d">{{ $t("users.add") }}</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-checkbox
              v-model="exist"
              label="are you creating account for employee"
              color="#770f30"
              hide-details
            ></v-checkbox>
          </v-col>
          <v-col cols="12" sm="6" md="6" v-if="exist === false">
            <v-text-field
              :label="$t(`name`) + '*'"
              v-model="user.name"
              required
              hint="Required"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6" v-if="exist === false">
            <v-text-field
              required
              v-model="user.code"
              :label="$t(`code`) + '*'"
              hint="Required"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" v-if="exist === true">
            <v-autocomplete
              :label="$t(`employees.employees`) + '*'"
              chips
              v-model="selectedEmployee"
              persistent-hint
              hint="Required"
              :items="displayText"
              item-title="name"
              return-object
            ></v-autocomplete>
            {{ selectedEmployee }}
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
            <imageuploader @image="imageup" />
          </v-col>
        </v-row>
      </v-container>
      <small>*indicates required field</small>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <!-- <v-btn color="blue-darken-1" variant="text"> {{ $t("close") }} </v-btn> -->
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
          "Avatar size should be less than 10 MB!"
        );
      },
    ],
    exist: false,
    roles: [],
    url: null,
    image: null,
    user: {
      name: "",
      code: "",
      password: "",
      role: null,
    },
    selectedEmployee: null,
    employees: [],
  }),
  created() {
    axios.get("/api/userRole/").then((response) => {
      this.roles = response.data.data;
    });
    axios.get("/api/employee").then((res) => {
      this.employees = res.data.data;
      console.log(res.data.data);
    });
  },
  computed: {
    displayText() {
      return this.employees.map((employee) => ({
        name: `${employee.name} (${employee.code})`,
        name1: employee.name,
        id: employee._id,
        code: employee.code,
      }));
    },
  },
  methods: {
    add() {
      if (this.exist === false) {
        console.log("im alive");
        axios
          .post("/api/user/", {
            name: this.user.name,
            code: this.user.code,
            role: this.user.role._id,
            password: this.user.password,
            image: this.user.img,
          })
          .then((response) => {
            if (response.data.errors) {
              console.log(response);
              swal("error", response.data.errors[0].msg, "error");
            } else {
              swal("success", "user added successfully", "success");
              console.log(response);
              this.$router.push({
                path: "/user/all",
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        axios
          .post("/api/user/", {
            name: this.selectedEmployee.name1,
            code: this.selectedEmployee.code,
            role: this.user.role._id,
            password: this.user.password,
            image: this.user.img,
          })
          .then((res) => {
            axios
              .post("/api/userEmployee/", {
                user: res.data.data._id,
                employee: this.selectedEmployee.id,
              })
              .then((res) => {
                swal("success", "user added successfully", "success");
                console.log(response);
                this.$router.push({
                  path: "/user/all",
                });
              });
          });
      }
    },

    imageup(image) {
      this.user.img = image;
    },
  },
};
</script>
