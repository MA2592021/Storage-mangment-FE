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
              item-title="name"
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
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              required
              v-model="card.startRange"
              label="First Piece Number*"
              hint="Required"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              required
              v-model="card.endRange"
              label="Last Piece Number*"
              hint="Required"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              required
              v-model="card.cutNumber"
              label="Cut Number*"
              hint="Required"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              required
              v-model="card.boxNumber"
              label="Box number*"
              hint="Required"
            ></v-text-field>
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
    card: {
      code: "",
      model: "",
      qty: "",
      endRange: "",
      startRange: "",
      cutNumber: "",
      boxNumber: "",
    },
    orders: [],
    selectedOrder: "",
  }),

  methods: {
    add() {
      // this.url = URL.createObjectURL(this.color.img);
      console.log("im alive");
      console.log(this.card);
      console.log(this.selectedOrder._id);
      axios
        .post("/api/card/", {
          code: this.card.code,
          quantity: parseInt(this.card.qty),
          order: this.selectedOrder._id,
          modelIndex: this.card.model._id,
          details: "test",
          startRange: parseInt(this.card.startRange),
          endRange: parseInt(this.card.endRange),
          cutNumber: parseInt(this.card.cutNumber),
          boxNumber: parseInt(this.card.boxNumber),
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
      axios.post("/api/order").then((res) => {
        console.log(res.data.data);
        res.data.data.forEach((element) => {
          let x = { models: [] };
          x.name = element.name;
          x._id = element._id;
          element.models.forEach((el) => {
            let y = {};
            y.name =
              el.id.name +
              ` (${el.code}) (${el.color.name}-${el.color.code}) (${el.size.name})`;
            y._id = el._id;
            x.models.push(y);
          });
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
