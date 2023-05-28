import { defineStore } from "pinia";

export const usedata = defineStore("data", {
  state: () => ({
    data: [],
    header: [],
    title: "",
  }),
  getters: {},
});
