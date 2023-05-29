<style lang="scss" scoped></style>
<template>
  <v-card elevation="0" style="width: 100%">
    <v-card-title class="text-center">
      <v-icon icon="mdi-plus" style="carton: #fbc02d" class="mb-2"></v-icon>
      <span class="text-h5" style="carton: #fbc02d">Add carton</span>
    </v-card-title>
    <v-window v-model="step">
      <v-window-item :value="1"
        ><v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  :label="$t('name') + `*`"
                  v-model="carton.name"
                  required
                  hint="Required"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-autocomplete
                  :label="$t('model') + `*`"
                  chips
                  v-model="carton.model"
                  persistent-hint
                  hint="Required"
                  :items="models"
                  item-title="name"
                  return-object
                ></v-autocomplete
              ></v-col>

              <v-col cols="12" sm="6" md="6">
                <v-textarea
                  clearable
                  :label="$t('note')"
                  v-model="carton.note"
                  prepend-inner-icon="mdi-note-text-outline"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text></v-window-item
      ><v-window-item :value="2">
        <v-card-text>
          <cartonstyleinput
            @styles_done="styless"
            v-if="step === 2"
            v-bind:colors="this.carton.model.colors"
            v-bind:sizes="this.carton.model.sizes"
          />
        </v-card-text>
      </v-window-item>
    </v-window>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        color="blue-darken-1"
        variant="text"
        @click="step--"
        v-if="step > 1"
      >
        {{ $t("back") }}
      </v-btn>
      <v-btn
        color="green-darken-1"
        variant="text"
        @click="steps()"
        v-if="step < 2"
      >
        {{ $t("next") }}
      </v-btn>
      <v-btn
        color="green-darken-1"
        variant="text"
        @click="add"
        v-if="step === 2"
      >
        {{ $t("save") }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from "axios";
import cartonstyleinput from "../../../components/cartonstyleinput.vue";
import swal from "sweetalert";
export default {
  components: {
    cartonstyleinput,
  },
  data: () => ({
    step: 1,
    carton: {
      name: "",
      model: null,

      note: "    ",
    },
    styles: null,
    models: [],
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
      if (this.styles === null) {
        swal("error", "please save all information first");
      } else {
        console.log("im alive");
        axios
          .post("/api/carton", {
            name: this.carton.name,
            model: this.carton.model._id,
            note: this.carton.note,
          })
          .then((response) => {
            if (response.data.errors) {
              console.log(response);
              swal("error", response.data.errors[0].msg, "error");
            } else {
              axios
                .patch("/api/carton/updateStyles/" + response.data.data._id, {
                  styles: this.styles,
                })
                .then((response) => {
                  if (response.data.errors) {
                    console.log(response);
                    swal("error", response.data.errors[0].msg, "error");
                  } else {
                    swal("success", "carton added successfully", "success");
                  }
                });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    styless(value) {
      console.log("styles from child", value);
      this.styles = value;
    },
    steps() {
      if (this.step === 1) {
        if (
          this.carton.model === null ||
          this.carton.name === "" ||
          this.carton.quantity === ""
        ) {
          swal("error", "please fill all information first");
        } else {
          this.step++;
        }
      }
    },
  },
};
</script>
