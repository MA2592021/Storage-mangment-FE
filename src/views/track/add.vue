<template>
  <div>
    <v-text-field
      v-model="textInput"
      label="Enter a string"
      @keydown.enter="addString"
    ></v-text-field>

    <v-chip
      v-for="(item, index) in stringArray"
      :key="index"
      color="primary"
      label
      closable
      @click:close="removeString(index)"
    >
      {{ item }}
    </v-chip>
  </div>
</template>

<script>
export default {
  data() {
    return {
      textInput: "", // User input string
      stringArray: [], // Array to store the strings
    };
  },
  methods: {
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
