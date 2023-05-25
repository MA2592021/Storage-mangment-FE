<template>
  <tabs v-if="routePath !== '/'" />
  <h3>homepage</h3>
  <p>{{ $t("welcome") }}</p>
  <div>
    <p>Current Locale: {{ $i18n.locale }}</p>
    <button @click="changeLocale('ar')">Switch to arabic</button>
    <button @click="changeLocale('en')">Switch to English</button>
  </div>
  <br /><br />
  <v-btn @click="testreg">test regenrate token</v-btn>
  <v-btn @click="testlog">test logout</v-btn>
</template>

<script>
import tabs from "../components/layout/tabs.vue";
import swal from "sweetalert";
import axios from "axios";
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
    testreg() {
      axios
        .post("/api/auth/token", {
          refreshToken: localStorage.getItem("refreshToken"),
        })
        .then((res) => {
          if (res.data.errors) {
            swal("a7aaa");
          } else {
            swal("success", "eshta", "success");
          }
        });
    },
    testlog() {
      axios.get("/api/auth/logout").then((res) => {
        swal("success", "eshta", "success");
      });
    },
  },
};
</script>
