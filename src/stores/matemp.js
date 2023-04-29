import { defineStore } from "pinia";

export const usematemp = defineStore("matemp", {
  state: () => ({
    headers: [
      {
        align: "start",
        key: "material_id",
        sortable: false,
        title: "ID",
      },
      { title: "material", key: "material" },
      { title: "quantity", key: "totalQuantity" },
    ],
    data: [
      {
        material_id: "1",
        material: "white 2omash",
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
        material_id: "2",
        material: "black 2omash",
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
        material_id: "12",
        material: "zorar",
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
