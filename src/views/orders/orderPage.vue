<template>
  <v-card class="mx-auto" elevation="2" style="width: 100%"
    ><v-row class="ma-2">
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          label="Name "
          required
          :readonly="dis === true"
          v-model="order.name"
          variant="underlined"
        ></v-text-field>
      </v-col>

      <v-col cols="12" sm="6">
        <v-autocomplete
          label="client "
          v-model="order.client"
          variant="underlined"
          :readonly="dis === true"
          :items="clients"
          item-title="name"
        ></v-autocomplete>
      </v-col>
      <v-col cols="12" sm="6"
        ><v-textarea
          :clearable="dis === false"
          label="details"
          v-model="order.details"
          :readonly="dis === true"
          prepend-icon="mdi-note-text-outline"
        ></v-textarea>
      </v-col>
      <v-col cols="12" sm="6"
        ><v-textarea
          :clearable="dis === false"
          label="Note"
          v-model="order.note"
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
        {{ dis ? "edit" : "cancel" }}
      </v-btn>
      <v-btn
        @click="deletee()"
        class="mx-auto"
        :disabled="dis === true"
        prepend-icon=" mdi-delete-forever"
        color="red"
      >
        Delete
      </v-btn>
      <v-btn
        :disabled="dis === true"
        prepend-icon="mdi-check-outline"
        color="green"
        @click="save()"
      >
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
  <orderpanel
    class="mt-2"
    v-bind:name="order.name"
    v-bind:reqmodel="order.models"
    v-bind:ship="order.shipments"
    @models="updatemodels"
    v-if="x === 1"
  />
</template>

<script>
import axios from "axios";
import swal from "sweetalert";
import orderpanel from "../../components/orderpanel.vue";
export default {
  components: { orderpanel },
  data() {
    return {
      order: {},
      clients: [],
      orgorder: {},
      dis: true,
      x: 0,
    };
  },
  created() {
    //Get route
    this.orderload();
    this.clientsload();
  },
  methods: {
    orderload() {
      axios.get("/api/order/" + this.$route.params.id).then((response) => {
        console.log(response);
        this.orgorder = response.data.data;
        this.clone();
        this.x = 1;
      });
    },
    clientsload() {
      axios.get("/api/client").then((response) => {
        this.clients = response.data.data;
      });
    },
    save() {
      this.dis = !this.dis;
      swal({
        title: "Are you sure?",
        text: "Are you sure that you want to edit this order?",
        icon: "warning",
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          axios
            .patch("/api/order/" + this.$route.params.id, {
              name: this.order.name,

              details: this.order.details,
              client: this.order.client,
              note: this.order.note,
            })
            .then((response) => {
              if (response.data.errors) {
                swal("error", response.data.errors[0].msg, "error");
              } else {
                swal("success", "order updated successfully", "success");
                this.orderload();
              }
            });
        }
      });
    },
    clone() {
      this.order.id = this.orgorder._id;
      this.order.name = this.orgorder.name;
      this.order.models = this.orgorder.models;
      this.order.shipments = this.orgorder.shipments;
      this.order.totalmat = this.orgorder.totalMaterialsRequired;
      this.totalqty = this.orgorder.totalQuantity;
      this.order.details = this.orgorder.details;
      this.order.client = this.orgorder.client;
      this.order.note = this.orgorder.note;
    },
    cancel() {
      this.dis = !this.dis;

      this.clone();
    },
    deletee() {
      swal({
        title: "Are you sure?",
        text: "Are you sure that you want to delete this order?",
        icon: "warning",
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          axios
            .delete("/api/order/" + this.$route.params.id)
            .then((response) => {
              if (response.data.errors) {
                swal("error", response.data.errors[0].msg, "error");
              } else {
                swal("success", "order deleted suuccessfully", "success").then(
                  () => {
                    this.$router.push({ path: "/order/all" });
                  }
                );
              }
            });
        }
      });
    },
    updatemodels(value) {
      console.log(value);
      axios
        .patch("/api/order/models/" + this.$route.params.id, {
          models: value,
        })
        .then((response) => {
          if (response.data.errors) {
            swal("error", response.data.errors[0].msg, "error");
          } else {
            swal("success", "models updated successfully", "success");
          }
        });
    },
  },
};
</script>
