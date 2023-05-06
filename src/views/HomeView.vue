<template>
  <tabs v-if="routePath !== '/'" />
  HomePage
</template>

<script>
import tabs from "../components/layout/tabs.vue";
export default {
  components: { tabs },

  data() {
    return {
      data: [
        { name: "2as", stage_id: "1", desc: "bn2os" },
        { name: "geb", stage_id: "2", desc: "bngeb" },
        { name: "manika", stage_id: "3", desc: "bnmanik" },
      ],
      test: "",
    };
  },
  methods: {
    dosomething(value) {
      this.test = value;
    },
  },

  computed: {
    routePath() {
      return this.$route.path;
    },
  },
};
</script>
