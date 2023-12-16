<template>
  <v-card>
    <v-tabs grow v-model="tab" show-arrows color="#770f30" align-tabs="center">
      <v-tab :value="1" router :to="`${parentPath}dashboard`">{{
        $t("tabs.dashboard")
      }}</v-tab>
      <v-tab :value="2" router :to="`${parentPath}all`" v-if="checkAllPath">{{
        $t("tabs.all")
      }}</v-tab>
      <v-tab :value="3" router :to="`${parentPath}add`" v-if="checkAddPath">{{
        $t("tabs.add")
      }}</v-tab>
      <v-tab
        :value="4"
        router
        :to="`${parentPath}hall`"
        v-if="checkEmployeeFollowUpPath"
        >{{ $t("tabs.hall") }}</v-tab
      >
      <v-tab
        :value="5"
        router
        :to="`${parentPath}management`"
        v-if="checkEmployeeFollowUpPath"
        >{{ $t("tabs.management") }}</v-tab
      >
      <v-tab
        :value="6"
        router
        :to="`${parentPath}supervisor`"
        v-if="checkEmployeeFollowUpPath"
        >{{ $t("navbar.superVisors") }}</v-tab
      >
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item v-for="n in 6" :key="n" :value="n" disabled>
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
    checkAddPath() {
      if (this.parentPath === "/utils/assist/") {
        return false;
      } else if (this.parentPath === "/track/") {
        return false;
      } else if (this.parentPath === "/salary/") {
        return false;
      } else if (this.parentPath === "/emptrack/") {
        return false;
      }
      return true;
    },
    checkAllPath() {
      if (this.parentPath === "/emptrack/") {
        return false;
      }
      return true;
    },
    checkEmployeeFollowUpPath() {
      if (this.parentPath === "/emptrack/") {
        return true;
      }
      return false;
    },
  },
};
</script>
