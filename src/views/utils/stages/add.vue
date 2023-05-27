<style lang="scss" scoped></style>
<template>
  <v-card elevation="0" style="width: 100%">
    <v-card-title class="text-center">
      <v-icon icon="mdi-plus" style="stage: #fbc02d" class="mb-2"></v-icon>
      <span class="text-h5" style="stage: #fbc02d">Add Stage</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              label="Name*"
              v-model="stage.name"
              required
              hint="Required"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              required
              v-model="stage.code"
              label="code*"
              hint="Required"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-autocomplete
              label="type*"
              chips
              v-model="stage.type"
              persistent-hint
              hint="Required"
              :items="['prepairs', 'production', 'finishing']"
              item-title="type"
            ></v-autocomplete
          ></v-col>
          <v-col cols="12" sm="6">
            <v-autocomplete
              label="machine type*"
              chips
              v-model="stage.machinetype"
              persistent-hint
              hint="Required"
              :items="types"
              item-value="_id"
              item-title="name"
            ></v-autocomplete
          ></v-col>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              required
              v-model="stage.rate"
              label="rate/hour*"
              hint="Required"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              required
              v-model="stage.price"
              label="price/piece*"
              hint="Required"
            ></v-text-field
          ></v-col>
          <v-col cols="12">
            <v-textarea
              clearable
              label="Note"
              v-model="stage.note"
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
    stage: {
      name: "",
      code: "",
      type: null,
      rate: "",
      price: "",
      note: "    ",
    },
    types: [],
  }),
  created() {
    axios
      .get("/api/machineType/")
      .then((response) => (this.types = response.data.data));
  },
  methods: {
    add() {
      // this.url = URL.createObjectURL(this.stage.img);
      console.log("im alive");
      axios
        .post("/api/stage", {
          name: this.stage.name,
          code: this.stage.code,
          type: this.stage.type,
          rate: this.stage.rate,
          price: this.stage.price,
          note: this.stage.note,
          machineType: this.stage.machinetype,
        })
        .then((response) => {
          if (response.data.errors) {
            console.log(response);
            swal("error", response.data.errors[0].msg, "error");
          } else {
            swal("success", "stage added successfully", "success");
            this.$router.push({ path: "/utils/stage/all" });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
