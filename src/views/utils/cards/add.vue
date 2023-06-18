<style lang="scss" scoped></style>
<template>
  <v-card elevation="0" style="width: 100%">
    <v-card-title class="text-center">
      <v-icon icon="mdi-plus" style="color: #fbc02d" class="mb-2"></v-icon>
      <span class="text-h5" style="color: #fbc02d">Add card</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              required
              v-model="card.code"
              label="code*"
              hint="Required"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-autocomplete
              v-model="selectedOrder"
              :items="orders"
              label="select order"
              item-title="name"
              return-object
            ></v-autocomplete
          ></v-col>
          <v-col cols="12" sm="6" md="6">
            <v-autocomplete
              v-model="card.model"
              :items="selectedOrder.models"
              label="select model"
              item-title="id.name"
              return-object
            ></v-autocomplete
          ></v-col>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              required
              v-model="card.qty"
              label="Quantity*"
              hint="Required"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
      <small>*indicates required field</small>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue-darken-1" variant="text"> Close </v-btn>
      <v-btn color="green-darken-1" variant="text" @click="add"> Save </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from "axios";
import swal from "sweetalert";
export default {
  data: () => ({
    card: {
      code: "",
      model: "",
      qty: "",
    },
    orders: [],
    selectedOrder: "",
  }),

  methods: {
    add() {
      // this.url = URL.createObjectURL(this.color.img);
      console.log("im alive");
      axios
        .post("/api/card/", {
          code: this.card.code,
          quantity: this.card.qty,
          order: this.selectedOrder._id,
          model: this.card.model.id._id,
          details: "test",
        })
        .then((response) => {
          if (response.data.errors) {
            console.log(response);
            swal("error", response.data.errors[0].msg, "error");
          } else {
            swal("success", "card added successfully", "success");
            this.$router.push({ path: "/utils/cards/all" });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    loadorder() {
      axios.get("/api/order").then((res) => {
        console.log(res.data.data);
        res.data.data.forEach((element) => {
          let x = {};
          let uniqueArray = [];

          // Filter out repeated objects from the array
          element.models.forEach((obj) => {
            const foundObject = uniqueArray.find(
              (item) => item.id._id === obj.id._id
            );
            if (!foundObject) {
              uniqueArray.push(obj);
            }
          });
          x.name = element.name;
          x._id = element._id;
          x.models = uniqueArray;
          this.orders.push(x);
        });
        console.log(this.orders);
      });
    },
  },
  created() {
    this.loadorder();
  },
};
</script>
