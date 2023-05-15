<template>
  <tabs v-if="routePath !== '/'" />
  <h3>homepage</h3>
  <p>{{ $t("welcome") }}</p>
  <div>
    <p>Current Locale: {{ $i18n.locale }}</p>
    <button @click="changeLocale('ar')">Switch to arabic</button>
    <button @click="changeLocale('en')">Switch to English</button>
  </div>
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
  methods: {
    changeLocale(locale) {
      this.$i18n.locale = locale;
    },
  },
};
</script>
