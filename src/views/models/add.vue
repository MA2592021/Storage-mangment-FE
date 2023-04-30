<template>
  <v-card elevation="0" style="width: 100%">
    <v-card-title class="text-center">
      <v-icon icon="mdi-plus" style="color: #fbc02d" class="mb-2"></v-icon>
      <span class="text-h5" style="color: #fbc02d">Add Model</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-text-field
              label="Name*"
              v-model="model.name"
              required
              hint="Required"
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="6">
            <v-autocomplete
              label="colors*"
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
              label="sizes*"
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

          <v-col cols="12">
            <v-autocomplete
              label="stages*"
              chips
              v-model="model.stages"
              persistent-hint
              multiple
              hint="Required"
              :items="stages"
              item-title="name"
              return-object
              closable-chips
              @update:modelValue="test"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12">
            <v-autocomplete
              label="materials*"
              chips
              v-model="model.material"
              persistent-hint
              multiple
              hint="Required"
              :items="materials"
              item-title="name"
              return-object
            >
            </v-autocomplete>
          </v-col>
          <v-col cols="12" sm="6"
            ><v-textarea
              clearable
              label="Note"
              v-model="model.note"
              prepend-inner-icon="mdi-note-text-outline"
            ></v-textarea>
          </v-col>
          <v-col cols="12" sm="6"
            ><v-textarea
              clearable
              label="details"
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
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue-darken-1" variant="text"> Close </v-btn>
      <v-btn color="green-darken-1" variant="text" @click="add"> Next </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import imageuploader from "../../components/imageuploader.vue";

export default {
  components: { imageuploader },
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
    url: null,
    image: null,
    model: {
      name: "",
      details: "",
      colors: null,
      sizes: null,
      img: "",
      stages: null,
      materials: null,
      note: "",
    },
    stages: [{ name: "2as" }, { name: "kawy" }, { name: "testo" }],
    materials: [
      { name: "zorar", id: "232" },
      { name: "white 2omash ", id: "231" },
    ],
    colors: [
      { name: "red", code: "123" },
      { name: "white", code: "2312" },
      { name: "black", code: "432" },
    ],
    sizes: [
      { name: "XL", code: "65" },
      { name: "L", code: "53" },
      { name: "S", code: "44" },
    ],
  }),

  methods: {
    add() {
      this.url = URL.createObjectURL(this.employee.img);
    },

    imageup(image) {
      this.employee.img = image[0];
    },
    test(e) {
      console.log("test");
      console.log(e);
    },
  },
};
</script>
