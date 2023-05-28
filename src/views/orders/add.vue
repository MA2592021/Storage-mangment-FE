<style lang="scss" scoped></style>
<template>
  <v-card elevation="0" style="width: 100%">
    <v-card-title class="text-center">
      <v-icon icon="mdi-plus" style="order: #fbc02d" class="mb-2"></v-icon>
      <span class="text-h5" style="order: #fbc02d">{{
        $t("orders.addOrders")
      }}</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              :label="$t(`name`) + '*'"
              v-model="order.name"
              required
              hint="Required"
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="6">
            <v-autocomplete
              :label="$t(`client`) + '*'"
              chips
              v-model="order.client"
              persistent-hint
              hint="Required"
              :items="clients"
              item-title="name"
              return-object
            ></v-autocomplete
          ></v-col>

          <v-col cols="12" sm="6" md="6">
            <v-textarea
              clearable
              :label="$t(`details`) + '*'"
              v-model="order.details"
              prepend-inner-icon="mdi-note-text-outline"
            ></v-textarea>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-textarea
              clearable
              :label="$t(`note`) + '*'"
              v-model="order.note"
              prepend-inner-icon="mdi-note-text-outline"
            ></v-textarea>
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
import axios from "axios";
import swal from "sweetalert";
export default {
  data: () => ({
    order: {
      name: "",
      client: null,
      details: "",
      note: "    ",
    },
    clients: [],
  }),
  created() {
    axios
      .get("/api/client/")
      .then((response) => (this.clients = response.data.data));
  },
  methods: {
    add() {
      // this.url = URL.createObjectURL(this.order.img);
      console.log("im alive");
      axios
        .post("/api/order/", {
          name: this.order.name,
          client: this.order.client._id,
          details: this.order.details,
          note: this.order.note,
        })
        .then((response) => {
          if (response.data.errors) {
            console.log(response);
            swal("error", response.data.errors[0].msg, "error");
          } else {
            swal("success", "order added succesfully", "success");
            this.$router.push({ path: "/order/all" });
          }
        })
        .catch((err) => {
          swal("error", response.data.errors[0].msg, "error");
        });
    },
  },
};
</script>
