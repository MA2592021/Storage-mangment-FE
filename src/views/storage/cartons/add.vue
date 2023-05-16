<style lang="scss" scoped></style>
<template>
  <v-card elevation="0" style="width: 100%">
    <v-card-title class="text-center">
      <v-icon icon="mdi-plus" style="carton: #fbc02d" class="mb-2"></v-icon>
      <span class="text-h5" style="carton: #fbc02d">Add carton</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              label="Name*"
              v-model="carton.name"
              required
              hint="Required"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              required
              v-model="carton.quantity"
              label="quantity*"
              hint="Required"
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="6">
            <v-autocomplete
              label="model*"
              chips
              v-model="carton.model"
              persistent-hint
              hint="Required"
              :items="models"
              item-title="name"
              item-value="_id"
            ></v-autocomplete
          ></v-col>
          <v-col cols="12" sm="6">
            <v-autocomplete
              label="sizes*"
              chips
              multiple
              v-model="carton.sizes"
              persistent-hint
              hint="Required"
              :items="sizes"
              item-title="name"
              item-value="_id"
            ></v-autocomplete
          ></v-col>
          <v-col cols="12" sm="6">
            <v-autocomplete
              label="colors*"
              chips
              v-model="carton.colors"
              persistent-hint
              hint="Required"
              multiple
              :items="colors"
              item-title="name"
              item-value="_id"
            ></v-autocomplete
          ></v-col>
          <v-col cols="12" sm="6" md="6">
            <v-textarea
              clearable
              label="Note"
              v-model="carton.note"
              prepend-inner-icon="mdi-note-text-outline"
            ></v-textarea>
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
    carton: {
      name: "",
      quantity: "",
      model: null,
      colors: null,
      sizes: null,
      note: "    ",
    },
    models: [],
    sizes: [],
    colors: [],
  }),
  created() {
    this.modelload();
    this.colorload();
    this.sizeload();
  },
  methods: {
    modelload() {
      axios.get("/api/model/").then((response) => {
        this.models = response.data.data;
        console.log(this.models);
      });
    },
    sizeload() {
      axios.get("/api/size/").then((response) => {
        this.sizes = response.data.data;
      });
    },
    colorload() {
      axios.get("/api/color/").then((response) => {
        this.colors = response.data.data;
      });
    },
    add() {
      // this.url = URL.createObjectURL(this.carton.img);
      console.log("im alive");
      axios
        .post("/api/carton", {
          name: this.carton.name,
          quantity: this.carton.quantity,
          model: this.carton.model,
          size: this.carton.size,
          color: this.carton.color,
          note: this.carton.note,
        })
        .then((response) => {
          if (response.data.errors) {
            console.log(response);
            swal("error", response.data.errors[0].msg, "error");
          } else {
            swal("success", "carton added successfully", "success");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
