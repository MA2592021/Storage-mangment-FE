<template>
  <v-card elevation="0" style="width: 100%">
    <v-card-title class="text-center">
      <v-icon icon="mdi-plus" style="color: #fbc02d" class="mb-2"></v-icon>
      <span class="text-h5" style="color: #fbc02d">{{
        $t("models.addModel")
      }}</span>
    </v-card-title>

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
          <v-col cols="12">
            <v-text-field
              :label="$t(`code`) + '*'"
              v-model="model.code"
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
              item-value="_id"
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
              item-value="_id"
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
            <imageuploader @image="imageup" />
          </v-col>
        </v-row>
      </v-container>
      <small>*indicates required field</small>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        color="green-darken-1"
        variant="text"
        @click="add"
        :loading="loading"
      >
        {{ $t("tabs.add") }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import imageuploader from "../../components/imageuploader.vue";
import axios from "axios";
import swal from "sweetalert";
export default {
  components: { imageuploader },
  data: () => ({
    rules: [
      (value) => {
        return (
          !value ||
          !value.length ||
          value[0].size < 10000000 ||
          "Avatar size should be less than 10 MB!"
        );
      },
    ],
    loading: false,
    model: {
      name: "",
      code: "",
      details: "    ",
      colors: null,
      sizes: null,
      img: "",
      stages: null,
      consumption: null,
      note: "    ",
    },

    colors: [],
    sizes: [],
  }),
  created() {
    this.colorload();
    this.sizeload();
  },
  methods: {
    add() {
      this.loading = true;
      // this.url = URL.createObjectURL(this.employee.img);
      axios
        .post("/api/model", {
          name: this.model.name,
          code: this.model.code,
          details: this.model.details,
          note: this.model.note,
          colors: this.model.colors,
          sizes: this.model.sizes,
          image: this.model.img,
        })
        .then((response) => {
          swal("success", "model added successfully", "success").then((val) => {
            if (val) {
              this.$router.push({ path: "/model/all" });
            }
          });
        });
      this.loading = false;
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

    imageup(image) {
      this.model.img = image;
    },
  },
};
</script>
