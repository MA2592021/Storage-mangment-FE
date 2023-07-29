<template>
  <div class="container">
    <v-row align="center" class="d-flex align-center justify-center">
      <v-col cols="6">
        <v-img
          class="bg-white"
          width="300"
          :aspect-ratio="1"
          src="/arkan_logo-withtext.png"
          cover
        ></v-img
      ></v-col>
      <v-col cols="6"
        ><h1>Sorry you are not authenticated to view this page ...</h1>
        <p>
          if you face any problems please contact
          <strong>System Adminstration</strong>
        </p>
      </v-col>
      <v-col align="center"
        ><v-btn @click="goback" color="red">Go Back</v-btn></v-col
      >
    </v-row>
  </div>
</template>
<script>
export default {
  methods: {
    goback() {
      this.$router.go(-1);
    },
  },
};
</script>
<style>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
