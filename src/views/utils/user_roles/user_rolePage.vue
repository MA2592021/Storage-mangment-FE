<template>
  <v-card class="mx-auto" elevation="2" style="width: 100%">
    <v-row class="ma-3">
      <v-col cols="12">
        <v-text-field
          label="Name "
          required
          :readonly="dis"
          v-model="role.title"
          variant="underlined"
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-text-field
          label="priority "
          required
          :readonly="dis"
          v-model="role.number"
          variant="underlined"
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-autocomplete
          label="select privileges"
          v-model="role.privileges"
          multiple
          chips
          closable-chips
          :items="privs"
          item-title="name"
          item-value="key"
        ></v-autocomplete
      ></v-col>
    </v-row>
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
      role: {},
      orgrole: {},
      dis: true,
      privs: [
        { name: "Dashboard", key: "dashboard" },
        { name: "Storage", key: "storage" },
        { name: "Users", key: "users" },
        { name: "Orders", key: "orders" },
        { name: "Shipments", key: "shipments" },
        { name: "Models", key: "models" },
        { name: "Employees", key: "employees" },
        { name: "Suppliers", key: "suppliers" },
        { name: "Clients", key: "clients" },
        { name: "Requests", key: "requests" },
        { name: "Colors", key: "colors" },
        { name: "Sizes", key: "sizes" },
        { name: "Roles", key: "roles" },
        { name: "User Roles", key: "user_role" },
        { name: "Stages ", key: "stages" },
        { name: "Machine Types", key: "machinetypes" },
        { name: "Types ", key: "types" },
        { name: "Assistant ", key: "assistant" },
        { name: "Production Follow-up ", key: "track" },
        { name: "cards ", key: "cards" },
      ],
    };
  },
  created() {
    //Get route
    this.loadrole();
  },
  methods: {
    deletee() {
      swal({
        title: "Are you sure?",
        text: "Are you sure that you want to delete this role?",
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
                    .delete("/api/userRole/" + this.$route.params.id)
                    .then((response) => {
                      if (response.data.errors) {
                        swal("error", response.data.errors[0].msg, "error");
                      } else {
                        swal(
                          "success",
                          "role deleted suuccessfully",
                          "success"
                        ).then(() => {
                          this.$router.push({ path: "/utils/user_role/all" });
                        });
                      }
                    });
                }
              });
          });
        }
      });
    },
    loadrole() {
      axios.get("/api/userRole/" + this.$route.params.id).then((response) => {
        console.log(response);
        this.role = response.data.data;
        this.orgrole.title = this.role.title;
        this.orgrole.pirority = this.role.pirority;
        this.orgrole.privileges = this.role.privileges;
      });
    },
    cancel() {
      this.dis = !this.dis;
      this.role.title = this.orgrole.title;
      this.role.pirority = this.orgrole.pirority;
      this.role.privileges = this.orgrole.privileges;
    },
    save() {
      axios
        .patch("/api/userRole/" + this.$route.params.id, {
          title: this.role.title,
          pirority: this.role.pirority,
          privileges: this.role.privileges,
        })
        .then((response) => {
          if (response.data.errors) {
            swal("error", response.data.errors[0].msg, "error");
          } else {
            swal("success", "role updated successfully", "success");
            this.loadrole();
            this.dis = true;
          }
        });
    },
  },
};
</script>
