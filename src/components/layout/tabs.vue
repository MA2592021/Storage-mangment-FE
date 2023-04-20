<template>
  <v-card>
    <v-tabs grow v-model="tab" show-arrows color="#770f30" align-tabs="center">
      <v-tab :value="1" router :to="`${parentPath}dashboard`">Dashboard</v-tab>
      <v-tab :value="2" router :to="`${parentPath}all`">All</v-tab>
      <v-tab :value="3" router :to="`${parentPath}add`">Add</v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item v-for="n in 3" :key="n" :value="n" disabled>
        <v-container fluid>
          <v-row>
            <router-view />
          </v-row>
        </v-container>
      </v-window-item>
    </v-window>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    tab: null,
  }),
  computed: {
    parentPath() {
      return this.$route.matched[0].path;
    },
  },
};
</script>
