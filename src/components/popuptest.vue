<template>
  <v-dialog :value="value" persistent>
    <v-card>
      <v-card-title class="text-h5"> {{ title }} </v-card-title>
      <v-card-text>{{ content }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="green-darken-1"
          variant="text"
          @click.native="$emit('close')"
        >
          Disagree
        </v-btn>
        <v-btn
          color="green-darken-1"
          variant="text"
          @click.native="$emit('save', false)"
        >
          Agree
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: "value",
    title: String,
    content: String,
  },
};
</script>

<style lang="scss" scoped></style>
