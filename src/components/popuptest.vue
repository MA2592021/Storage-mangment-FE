<template>
  <v-dialog :value="value" @input="$emit('input', $event)">
    <v-btn color="red" @click.native="$emit('close', false)">Close</v-btn>
  </v-dialog>
</template>

<script>
export default {
  props: ["value"],
};
</script>

<style lang="scss" scoped></style>
