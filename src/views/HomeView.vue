<template>
  <tabs v-if="routePath !== '/'" />
  <div>homePage</div>
  <popuptest v-model="dialog" @close="dialog = !dialog" />
  <tablepinia />
  <v-btn @click="dialog = !dialog">click me</v-btn>
</template>

<script>
import tabs from "../components/layout/tabs.vue";
import popuptest from "../components/popuptest.vue";
import tablepinia from "../components/tablepinia.vue";
export default {
  components: { tabs, popuptest, tablepinia },
  setup() {
    return {};
  },
  data() {
    return {
      dialog: false,
    };
  },
  computed: {
    routePath() {
      return this.$route.path;
    },
  },
};
</script>

<style lang="scss" scoped></style>
