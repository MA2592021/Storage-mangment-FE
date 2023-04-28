<template>
  <tabs v-if="routePath !== '/'" />
  <div>homePage</div>
</template>

<script>
import tabs from "../components/layout/tabs.vue";
export default {
  components: { tabs },
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
