<template>
  <tabs v-if="routePath !== '/'" />
  <h3>homepage</h3>
</template>

<script>
import tabs from "../components/layout/tabs.vue";

export default {
  components: { tabs },

  computed: {
    routePath() {
      return this.$route.path;
    },
  },
};
</script>
