<template>
  <v-card elevation="0" style="width: 100%">
    <v-card-title class="text-center">
      <v-icon icon="mdi-plus" style="color: #fbc02d" class="mb-2"></v-icon>
      <span class="text-h5" style="color: #fbc02d">Add shipment</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              label="Name*"
              v-model="shipment.name"
              required
              hint="Required"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-autocomplete
              label="order*"
              chips
              v-model="shipment.order"
              persistent-hint
              hint="Required"
              :items="order"
              item-title="name"
              return-object
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" sm="6"
            ><v-textarea
              clearable
              label="details"
              v-model="shipment.details"
              prepend-icon="mdi-note-text-outline"
            ></v-textarea>
          </v-col>
          <v-col cols="12" sm="6"
            ><v-textarea
              clearable
              label="Note"
              v-model="shipment.note"
              prepend-icon="mdi-note-text-outline"
            ></v-textarea>
          </v-col>
        </v-row>
      </v-container>
      <small>*indicates required field</small>
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
    url: null,
    image: null,
    shipment: {
      name: "",
      order: null,
      details: "",
      note: "    ",
    },
    order: [],
  }),
  created() {
    axios.get("/api/order").then((response) => {
      this.order = response.data.data;
    });
  },
  methods: {
    add() {
      console.log("im alive");
      axios
        .post("/api/shipment/", {
          name: this.shipment.name,
          details: this.shipment.details,
          order: this.shipment.order._id,
          note: this.shipment.note,
        })
        .then((response) => {
          if (response.data.errors) {
            console.log(response);
            swal("error", response.data.errors[0].msg, "error");
          } else {
            swal("success", "shipment added successfully", "success");
            this.$router.push({ path: "/shipment/all" });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    imageup(image) {
      this.shipment.img = image[0];
    },
  },
};
</script>
