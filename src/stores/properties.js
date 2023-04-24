import { defineStore } from "pinia";

export const usestore = defineStore("properties", {
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
        property: "ma2s",
        quantity: "14",
      },
      {
        ID: "2",
        property: "ma2sat",
        quantity: "4",
      },
      {
        ID: "12",
        property: "mastra",
        quantity: "2",
      },
    ],
  }),
});
