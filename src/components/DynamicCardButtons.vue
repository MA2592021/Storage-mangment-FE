<template>
  <v-row>
    <v-col class="justify-center" sm="12" md="6" lg="4" v-for="button in data"
      ><v-btn
        :disabled="button.disabled"
        rounded="l"
        height="72"
        style="text-transform: capitalize"
        block
        @click="$emit('clicked', button)"
      >
        <span class="ma-2"> {{ button.name }}</span>
        <v-icon right size="large" :icon="button.icon"></v-icon> </v-btn
    ></v-col>
  </v-row>
</template>
<script>
export default {
  props: { data: Array },
  methods: {},

  created() {
    console.log(this.data);
  },
};
</script>
