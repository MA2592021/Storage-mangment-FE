import { defineStore } from "pinia";

export const usedata = defineStore("main", {
  state: () => ({
    rolenum: localStorage.getItem("rolenum"),
  }),
  actions: {
    setrole(value) {
      this.rolenum = value;
    },
  },
  getters: {},
});
