<template>
  <v-card elevation="0" style="width: 100%">
    <v-card-title class="text-center">
      <v-icon icon="mdi-plus" style="color: #fbc02d" class="mb-2"></v-icon>
      <span class="text-h5" style="color: #fbc02d">{{
        $t("models.addModel")
      }}</span>
    </v-card-title>
    <v-window v-model="step">
      <v-window-item :value="1">
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  :label="$t(`name`) + '*'"
                  v-model="model.name"
                  required
                  hint="Required"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-autocomplete
                  :label="$t(`colors`) + '*'"
                  chips
                  v-model="model.colors"
                  persistent-hint
                  multiple
                  hint="Required"
                  :items="colors"
                  item-title="name"
                  return-object
                ></v-autocomplete>
              </v-col>

              <v-col cols="12" sm="6">
                <v-autocomplete
                  :label="$t(`sizes`) + '*'"
                  chips
                  v-model="model.sizes"
                  persistent-hint
                  multiple
                  hint="Required"
                  :items="sizes"
                  item-title="name"
                  return-object
                ></v-autocomplete>
              </v-col>

              <v-col cols="12" sm="6"
                ><v-textarea
                  clearable
                  :label="$t(`note`) + '*'"
                  v-model="model.note"
                  prepend-inner-icon="mdi-note-text-outline"
                ></v-textarea>
              </v-col>
              <v-col cols="12" sm="6"
                ><v-textarea
                  clearable
                  :label="$t(`details`) + '*'"
                  v-model="model.details"
                  prepend-inner-icon="mdi-note-text-outline"
                ></v-textarea>
              </v-col>

              <v-col cols="12" sm="12">
                <imageuploader @selected="imageup" />
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
      </v-window-item>
      <v-window-item :value="2">
        <v-card-text>
          <stageinput @stages_done="stagethings" />
        </v-card-text>
      </v-window-item>
      <v-window-item :value="3">
        <consumption
          v-bind:colors="model.colors"
          v-bind:sizes="model.sizes"
          @material_done="materialthings"
          v-if="step === 3"
        />
      </v-window-item>
      <v-window-item :value="4">
        <div class="pa-4 text-center">
          <v-img
            class="mb-4"
            contain
            height="128"
            src="/arkan_logo-no-text.png"
          ></v-img>
          <h3 class="text-h6 font-weight-light mb-2">
            are you sure want to add this model?
          </h3>
          <span class="text-caption text-grey"
            >please be sure of data entered you can go back
          </span>
        </div>
      </v-window-item>
    </v-window>

    <v-card-actions>
      <v-btn v-if="step > 1" variant="text" @click="step--" class="border">
        {{ $t("back") }}
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn v-if="step < 4" color="primary" variant="flat" @click="steps">
        {{ $t("next") }}
      </v-btn>
      <v-btn
        color="green-darken-1"
        variant="text"
        @click="add"
        v-if="step === 4"
      >
        {{ $t("tabs.add") }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import imageuploader from "../../components/imageuploader.vue";
import stageinput from "../../components/stageinput.vue";
import consumption from "../../components/consumption.vue";
import axios from "axios";
import swal from "sweetalert";
export default {
  components: { imageuploader, stageinput, consumption },
  data: () => ({
    rules: [
      (value) => {
        return (
          !value ||
          !value.length ||
          value[0].size < 2000000 ||
          "Avatar size should be less than 2 MB!"
        );
      },
    ],
    step: 1,
    url: null,
    image: null,
    model: {
      name: "",
      details: "",
      colors: null,
      sizes: null,
      img: "",
      stages: null,
      consumption: null,
      note: "",
    },
    materials: [
      { name: "zorar", id: "232" },
      { name: "white 2omash ", id: "231" },
    ],
    colors: [],
    sizes: [],
  }),
  created() {
    this.colorload();
    this.sizeload();
  },
  methods: {
    add() {
      // this.url = URL.createObjectURL(this.employee.img);
      axios
        .post("/api/model", {
          name: this.model.name,
          details: this.model.details,
          note: this.model.note,
        })
        .then((response) => {
          axios.patch("/api/model/stages/add/" + response.data.data._id, {
            stages: this.model.stages,
          });
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
    steps() {
      if (
        this.model.colors === null ||
        this.model.colors.length === 0 ||
        this.model.sizes === null ||
        this.model.sizes.length === 0 ||
        this.model.name === ""
      ) {
        swal("error", "please fill all information", "error");
      } else if (this.step === 2 && this.model.stages === null) {
        swal("error", "please save stages before go to next step", "error");
      } else if (this.step === 3 && this.model.consumption === null) {
        swal(
          "error",
          "please save consumptions before go to next step",
          "error"
        );
      } else {
        this.step += 1;
      }
    },
    imageup(image) {
      this.employee.img = image[0];
    },
    stagethings(value) {
      this.model.stages = value;
      console.log(this.model.stages);
    },
    materialthings(value) {
      this.model.consumption = value;
      console.log(this.model.consumption);
    },
  },
};
</script>
