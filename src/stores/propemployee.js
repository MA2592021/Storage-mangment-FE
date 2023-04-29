import { defineStore } from "pinia";

export const usepropemp = defineStore("propemp", {
  state: () => ({
    data: [
      {
        _id: "1",
        name: "ma2s",
        totalQuantity: "14",
        note: "test 1",
        lastDate: "2023/4/22",
        history: [
          { quantity: 12, date: "2023/4/23", op: "add" },
          { quantity: 2, date: "2023/4/25", op: "sub" },
          { quantity: 4, date: "2023/4/27", op: "add" },
        ],
      },
      {
        _id: "2",
        name: "ma2sat",
        totalQuantity: "4",
        note: "test 2",
        lastDate: "2023/4/22",
        history: [
          { quantity: 12, date: "2023/4/23", op: "add" },
          { quantity: 2, date: "2023/4/25", op: "sub" },
          { quantity: 4, date: "2023/4/27", op: "add" },
        ],
      },
      {
        _id: "12",
        name: "mastra",
        totalQuantity: "2",
        note: "test 3 ",
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

    propfind: (state) => {
      return (id) => state.data.find((prop) => prop.custody_id === id);
    },
  },
});
