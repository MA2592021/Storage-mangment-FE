<template>
  <v-card-text>
    <v-row>
      <v-col class="justify-center" :cols="col" v-for="button in data"
        ><v-btn rounded="l" height="72" block @click="$emit('clicked', button)">
          <span class="ma-2"> {{ button.name }}</span>
          <v-icon right size="large" :icon="button.icon"></v-icon> </v-btn
      ></v-col> </v-row
  ></v-card-text>
</template>
<script>
export default {
  props: { data: Array, col: Number },
  methods: {},

  created() {
    console.log(this.data);
  },
};
</script>
