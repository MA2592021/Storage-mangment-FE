<template>
  <v-card class="mx-auto" elevation="2" style="width: 100%"
    ><v-row class="ma-2">
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          :label="$t('name')"
          required
          :readonly="dis === true"
          v-model="carton.name"
          variant="underlined"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          required
          :label="$t('quantity')"
          :readonly="dis === true"
          v-model="carton.quantity"
          variant="underlined"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          :label="$t('model')"
          variant="underlined"
          :readonly="dis === true"
          v-model="carton.model.name"
          required
        ></v-text-field>
      </v-col>

      <v-col cols="12" sm="6"
        ><v-textarea
          :clearable="dis === false"
          :label="$t('note')"
          v-model="carton.note"
          :readonly="dis === true"
          prepend-icon="mdi-note-text-outline"
        ></v-textarea>
      </v-col>
    </v-row>
    <v-card-actions class="mx-auto">
      <v-btn
        @click="cancel()"
        :prepend-icon="dis ? 'mdi-circle-edit-outline' : 'mdi-cancel'"
      >
        {{ dis ? $t("edit") : $t("cancel") }}
      </v-btn>
      <v-btn
        @click="deletee()"
        class="mx-auto"
        :disabled="dis === true"
        prepend-icon=" mdi-delete-forever"
        color="red"
      >
        {{ $t("delete") }}
      </v-btn>
      <v-btn
        :disabled="dis === true"
        prepend-icon="mdi-check-outline"
        color="green"
        @click="save()"
      >
        {{ $t("save") }}
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
      carton: { model: { name: "" } },
      sizes: [],
      colors: [],
      orgcarton: {},
      dis: true,
    };
  },
  created() {
    //Get route
    this.cartonload();
    this.sizesload();
    this.colorsload();
  },
  methods: {
    cartonload() {
      axios.get("/api/carton/" + this.$route.params.id).then((response) => {
        console.log(response);
        this.orgcarton = response.data.data;
        this.clone();
      });
    },
    sizesload() {
      axios.get("/api/size").then((response) => {
        this.sizes = response.data.data;
        console.log(response.data.data);
      });
    },
    colorsload() {
      axios.get("/api/color").then((response) => {
        this.colors = response.data.data;
      });
    },
    save() {
      this.dis = !this.dis;
      swal({
        title: "Are you sure?",
        text: "Are you sure that you want to edit this carton?",
        icon: "warning",
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          axios
            .patch("/api/carton/" + this.$route.params.id, {
              name: this.carton.name,
              quantity: this.carton.quantity,
              model: this.carton.model,
              shipment: this.carton.shipment,
              colors: this.carton.colors,
              sizes: this.carton.sizes,

              note: this.carton.note,
            })
            .then((response) => {
              if (response.data.errors) {
                swal("error", response.data.errors[0].msg, "error");
              } else {
                swal("success", "carton updated successfully", "success");
                this.cartonload();
              }
            });
        }
      });
    },
    clone() {
      this.carton.id = this.orgcarton._id;
      this.carton.name = this.orgcarton.name;
      this.carton.quantity = this.orgcarton.quantity;
      this.carton.model = this.orgcarton.model;
      this.carton.shipment = this.orgcarton.shipment;
      this.carton.colors = this.orgcarton.colors;
      this.carton.sizes = this.orgcarton.sizes;

      this.carton.note = this.orgcarton.note;
    },
    cancel() {
      if (this.dis) {
        this.dis = !this.dis;
      } else {
        this.dis = !this.dis;
        this.clone();
      }
    },
    deletee() {
      swal({
        title: "Are you sure?",
        text: "Are you sure that you want to delete this carton?",
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
                    .delete("/api/carton/" + this.$route.params.id)
                    .then((response) => {
                      if (response.data.errors) {
                        swal("error", response.data.errors[0].msg, "error");
                      } else {
                        swal(
                          "success",
                          "carton deleted suuccessfully",
                          "success"
                        ).then(() => {
                          this.$router.push({ path: "/utils/carton/all" });
                        });
                      }
                    });
                }
              });
          });
        }
      });
    },
  },
};
</script>
