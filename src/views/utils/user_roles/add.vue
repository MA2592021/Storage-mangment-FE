<style lang="scss" scoped></style>
<template>
  <v-card elevation="0" style="width: 100%">
    <v-card-title class="text-center">
      <v-icon icon="mdi-plus" style="role: #fbc02d" class="mb-2"></v-icon>
      <span class="text-h5" style="role: #fbc02d">Add role</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              label="Name*"
              v-model="role.title"
              required
              hint="Required"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              required
              v-model="role.number"
              label="priority*"
              hint="number 2 reserved for quality and number 3 reserved for assistants "
              persistent-hint
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
      </v-container>
      <small>* indicates required field</small>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="green-darken-1" variant="text" @click="add"> Save </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from "axios";
import swal from "sweetalert";
export default {
  data: () => ({
    role: {
      title: "",
      number: "",
      privileges: [],
    },
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
      { name: "Production Entry ", key: "prodEntry" },
      { name: "Quality Check ", key: "quality" },
      { name: "cards ", key: "cards" },
    ],
  }),

  methods: {
    add() {
      // this.url = URL.createObjectURL(this.role.img);
      console.log("im alive");
      axios
        .post("/api/userRole/", {
          title: this.role.title,
          number: this.role.number,
          privileges: this.role.privileges,
        })
        .then((response) => {
          if (response.data.errors) {
            console.log(response);
            swal("error", response.data.errors[0].msg, "error");
          } else {
            swal("success", "role added successfully", "success");
            this.$router.push({ path: "/utils/user_role/all" });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
