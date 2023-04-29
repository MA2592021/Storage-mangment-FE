import { defineStore } from "pinia";

export const usematerials = defineStore("materials", {
  state: () => ({
    data: [
      {
        _id: "1",
        name: "white 2omash",
        quantity: "14",
        available: "6",
      },
      {
        _id: "2",
        name: "black 2omash",
        quantity: "4",
        available: "3",
      },
      {
        _id: "12",
        name: "zorar",
        quantity: "2",
        available: "1",
      },
    ],
  }),
  getters: {
    total: (state) => {
      return state.data.length;
    },
  },
});
