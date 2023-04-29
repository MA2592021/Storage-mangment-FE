<template>
  <v-dialog :value="value" @input="$emit('input', $event)" persistent>
    <v-card>
      <v-card-title class="text-h5">
        Please Enter your Password to Confirm Changes
      </v-card-title>
      <v-card-text
        ><v-text-field
          variant="underlined"
          v-model="password"
          label="Password"
          type="password"
          required
          :rules="passwordRules"
        ></v-text-field
      ></v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="green-darken-1"
          variant="text"
          @click.native="$emit('closed')"
        >
          cancel
        </v-btn>
        <v-btn color="green-darken-1" variant="text" @click.native="check()">
          Submit
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      password: "",
    };
  },
  methods: {
    check() {
      this.$emit("checked");
    },
  },
  props: {
    value: "value",
    title: String,
    content: String,
  },
};
</script>

<style lang="scss" scoped></style>
