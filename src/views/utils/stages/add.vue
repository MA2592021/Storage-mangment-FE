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
              :items="['preparations', 'production', 'finishing', 'quality']"
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
              prefix="£"
              hint="Required"
            ></v-text-field
          ></v-col>
          <v-col cols="12" sm="6" md="6">
            <v-row
              ><v-text-field
                v-model="textInput"
                label="Enter a error"
                @keydown.enter="addString"
                persistent-hint
                hint="press enter to add "
              ></v-text-field></v-row
            ><v-row>
              <v-chip
                v-for="(item, index) in stringArray"
                :key="index"
                color="red"
                class="ma-1"
                variant="outlined"
                label
                closable
                @click:close="removeString(index)"
              >
                {{ item }}
              </v-chip></v-row
            >
          </v-col>
          <v-col cols="12" sm="6" md="6">
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
    textInput: "", // User input string
    stringArray: [], // Array to store the strings
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
          stageErrors: this.stringArray,
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
    addString() {
      if (this.textInput) {
        this.stringArray.push(this.textInput);
        this.textInput = ""; // Clear the text field
      }
    },
    removeString(index) {
      this.stringArray.splice(index, 1);
    },
  },
};
</script>
