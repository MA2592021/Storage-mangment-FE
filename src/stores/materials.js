import { defineStore } from "pinia";

export const usematerials = defineStore("materials", {
  state: () => ({
    headers: [
      {
        align: "start",
        key: "ID",
        sortable: false,
        title: "ID",
      },
      { title: "property", key: "property" },
      { title: "quantity", key: "quantity" },
    ],
    data: [
      {
        ID: "1",
        property: "white 2omash",
        quantity: "14",
      },
      {
        ID: "2",
        property: "black 2omash",
        quantity: "4",
      },
      {
        ID: "12",
        property: "zorar",
        quantity: "2",
      },
    ],
  }),
  getters: {
    total: (state) => {
      return state.data.length;
    },
  },
});
