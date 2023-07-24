<template>
  <v-card>
    <v-tabs grow v-model="tab" show-arrows color="#770f30" align-tabs="center">
      <v-tab :value="1" router :to="`${parentPath}dashboard`">{{
        $t("tabs.dashboard")
      }}</v-tab>
      <v-tab :value="2" router :to="`${parentPath}all`">{{
        $t("tabs.all")
      }}</v-tab>
      <v-tab :value="3" router :to="`${parentPath}add`" v-if="checkpath">{{
        $t("tabs.add")
      }}</v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item v-for="n in 3" :key="n" :value="n" disabled>
        <router-view />
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
    checkpath() {
      if (this.parentPath === "/utils/assist/") {
        return false;
      } else if (this.parentPath === "/track/") {
        return false;
      } else if (this.parentPath === "/salary/") {
        return false;
      }
      return true;
    },
  },
};
</script>
