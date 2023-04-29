import { defineStore } from "pinia";

export const usepropemp = defineStore("propemp", {
  state: () => ({
    headers: [
      {
        align: "start",
        key: "custody_id",
        sortable: false,
        title: "ID",
      },
      { title: "property", key: "property" },
      { title: "quantity", key: "totalQuantity" },
    ],
    historyheaders: [
      {
        align: "start",
        key: "quantity",
        sortable: false,
        title: "quantity",
      },
      { title: "operation", key: "op" },
      { title: "date", key: "date" },
    ],
    data: [
      {
        custody_id: "1",
        property: "ma2s",
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
        custody_id: "2",
        property: "ma2sat",
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
        custody_id: "12",
        property: "mastra",
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
    propfind: (state) => {
      return (id) => state.data.find((prop) => prop.custody_id === id);
    },
  },
});
