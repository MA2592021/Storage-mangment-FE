<template>
  <v-card class="mx-auto" elevation="2" style="width: 100%">
    <v-row class="ma-3">
      <v-col cols="12">
        <v-text-field
          label="Name "
          required
          :readonly="dis"
          v-model="user.title"
          variant="underlined"
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-text-field
          label="priority "
          required
          :readonly="dis"
          v-model="user.number"
          variant="underlined"
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-autocomplete
          label="select privileges"
          v-model="user.privileges"
          multiple
          chips
          closable-chips
          :disabled="dis"
          :items="[
            'dashboard',
            'storage',
            'utils',
            'users',
            'orders',
            'shipments',
            'models',
            'employees',
            'suppliers',
            'clients',
            'requests',
          ]"
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
      user: {},
      orguser: {},
      dis: true,
    };
  },
  created() {
    //Get route
    this.loaduser();
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
          axios
            .delete("/api/useruser/" + this.$route.params.id)
            .then((response) => {
              if (response.data.errors) {
                swal("error", response.data.errors[0].msg, "error");
              } else {
                swal("success", "user deleted suuccessfully", "success").then(
                  () => {
                    this.$router.push({ path: "/utils/user_user/all" });
                  }
                );
              }
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
    cancel() {
      this.dis = !this.dis;
      this.user.title = this.orguser.title;
      this.user.pirority = this.orguser.pirority;
      this.user.privileges = this.orguser.privileges;
    },
    save() {
      axios
        .patch("/api/useruser/" + this.$route.params.id, {
          title: this.user.title,
          pirority: this.user.pirority,
          privileges: this.user.privileges,
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
