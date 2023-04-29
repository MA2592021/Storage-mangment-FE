import { defineStore } from "pinia";

export const useheaders = defineStore("headers", {
  state: () => ({
    mat_prop_header: [
      {
        align: "start",
        key: "_id",
        sortable: false,
        title: "ID",
      },
      { title: "name", key: "name" },
      { title: "quantity", key: "quantity" },
      { title: "available", key: "available" },
    ],
    employee_hand_header: [
      {
        align: "start",
        key: "_id",
        sortable: false,
        title: "ID",
      },
      { title: "name", key: "name" },
      { title: "quantity", key: "totalQuantity" },
    ],
    historyheader: [
      {
        align: "start",
        key: "quantity",
        sortable: false,
        title: "quantity",
      },
      { title: "operation", key: "op" },
      { title: "date", key: "date" },
    ],

    employee_header: [
      {
        align: "start",
        key: "code",
        sortable: false,
        title: "code",
      },
      { title: "name", key: "name" },
      { title: "role", key: "role" },
    ],
  }),
  getters: {},
});
