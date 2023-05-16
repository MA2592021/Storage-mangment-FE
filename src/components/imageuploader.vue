<template>
  <v-card height="50vh">
    <v-card-text>
      <v-img
        :src="image ? imagePreview : '/arkan_logo-no-text.png'"
        lazy-src="/arkan_logo-no-text.png"
        height="30vh"
      ></v-img>
      <v-file-input
        v-model="image"
        accept="image/png, image/jpeg, image/bmp"
        :placeholder="$t(`pickImage`)"
        prepend-icon="mdi-camera"
        @change="selectImage"
        @click:clear="clearImagePreview()"
        :label="$t(`image`)"
      ></v-file-input>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "image-upload-preview",
  data() {
    return {
      image: null,
      imagePreview: "",
    };
  },

  methods: {
    selectImage() {
      this.imagePreview = URL.createObjectURL(this.image[0]);
      this.$emit("selected", this.image);
    },

    clearImagePreview() {
      this.imagePreview = "";
    },
  },
};
</script>
