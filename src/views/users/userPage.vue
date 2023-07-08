<template>
  <v-card class="mx-auto" elevation="2" style="width: 100%">
    <v-row class="ma-3">
      <v-col cols="3" sm="2"
        ><v-img
          class="bg-white"
          width="300"
          :aspect-ratio="1"
          :src="user.image ? user.image.data : '/arkan_logo-no-text.png'"
          cover
        ></v-img></v-col
      ><v-col cols="9" sm="10">
        <v-row>
          <v-col cols="12">
            <v-text-field
              :label="$t('name')"
              required
              :readonly="dis"
              v-model="user.name"
              variant="underlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              :label="$t('code')"
              required
              :readonly="dis"
              v-model="user.code"
              variant="underlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-autocomplete
              :label="$t('role')"
              v-model="user.role"
              chips
              :disabled="dis"
              return-object
              :items="roles"
            ></v-autocomplete>
          </v-col> </v-row></v-col
    ></v-row>
    <v-card-actions class="mx-auto">
      <v-btn
        @click="cancel()"
        color="info"
        :prepend-icon="dis ? 'mdi-circle-edit-outline' : 'mdi-cancel'"
      >
        {{ dis ? $t(`edit`) : $t(`cancel`) }}
      </v-btn>
      <v-btn
        class="ml-auto text-red"
        @click="deletee()"
        :disabled="dis === true"
        prepend-icon="mdi-delete-forever"
      >
        {{ $t(`delete`) }}
      </v-btn>
      <v-btn
        class="ml-auto"
        :disabled="dis === true || isEditing === true"
        prepend-icon="mdi-check-outline"
        color="green"
        @click="save()"
      >
        {{ $t(`save`) }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from "axios";
import swal from "sweetalert";
export default {
  data() {
    return {
      user: {},
      orguser: {},
      dis: true,
      roles: "",
    };
  },
  created() {
    //Get route
    this.loaduser();
    this.loadroles();
  },
  methods: {
    deletee() {
      swal({
        title: "Are you sure?",
        text: "Are you sure that you want to delete this user?",
        icon: "warning",
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          swal("enter your password", {
            content: "input",
          }).then((value) => {
            axios
              .post("/api/auth/testCredentials", {
                code: localStorage.getItem("code"),
                password: value,
              })
              .then((response) => {
                if (response.data.errors) {
                  swal("error", response.data.errors[0].msg, "error");
                } else {
                  axios
                    .delete("/api/user/" + this.$route.params.id)
                    .then((response) => {
                      if (response.data.errors) {
                        swal("error", response.data.errors[0].msg, "error");
                      } else {
                        swal(
                          "success",
                          "user deleted suuccessfully",
                          "success"
                        ).then(() => {
                          this.$router.push({ path: "/user/all" });
                        });
                      }
                    });
                }
              });
          });
        }
      });
    },
    loaduser() {
      axios.get("/api/user/" + this.$route.params.id).then((response) => {
        console.log(response);
        this.user = response.data.data;
        this.orguser.name = this.user.name;
        this.orguser.role = this.user.role;
        this.orguser.code = this.user.code;
      });
    },
    loadroles() {
      axios.get("/api/userRole/").then((response) => {
        this.roles = response.data.data;
      });
    },
    cancel() {
      this.dis = !this.dis;
      this.user.title = this.orguser.title;
      this.user.pirority = this.orguser.pirority;
      this.user.role = this.orguser.role;
    },
    save() {
      axios
        .patch("/api/user/" + this.$route.params.id, {
          name: this.user.name,
          pirority: this.user.pirority,
          role: this.user.role._id,
        })
        .then((response) => {
          if (response.data.errors) {
            swal("error", response.data.errors[0].msg, "error");
          } else {
            swal("success", "user updated successfully", "success");
            this.loaduser();
            this.dis = true;
          }
        });
    },
  },
};
</script>
