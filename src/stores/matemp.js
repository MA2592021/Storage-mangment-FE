import { defineStore } from "pinia";

export const usematemp = defineStore("matemp", {
  state: () => ({
    data: [
      {
        _id: "1",
        name: "white 2omash",
        totalQuantity: "14",
        note: "teso tesotes testo tesot e",
        lastDate: "2023/4/22",
        history: [
          { quantity: 12, date: "2023/4/23", op: "add" },
          { quantity: 2, date: "2023/4/25", op: "sub" },
          { quantity: 4, date: "2023/4/27", op: "add" },
        ],
      },
      {
        _id: "2",
        name: "black 2omash",
        totalQuantity: "4",
        note: "teso tesotes testo tesot e",
        lastDate: "2023/4/22",
        history: [
          { quantity: 12, date: "2023/4/23", op: "add" },
          { quantity: 2, date: "2023/4/25", op: "sub" },
          { quantity: 4, date: "2023/4/27", op: "add" },
        ],
      },
      {
        _id: "12",
        name: "zorar",
        totalQuantity: "2",
        note: "teso tesotes testo tesot e",
        lastDate: "2023/4/22",
        history: [
          { quantity: 12, date: "2023/4/23", op: "add" },
          { quantity: 2, date: "2023/4/25", op: "sub" },
          { quantity: 4, date: "2023/4/27", op: "add" },
        ],
      },
    ],
  }),
  getters: {
    total: (state) => {
      return state.data.length;
    },
    matfind: (state) => {
      return (id) => state.data.find((prop) => prop.id === id);
    },
  },
});
