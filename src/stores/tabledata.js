import { defineStore } from "pinia";

export const usetable = defineStore("tabledata", {
  state: () => ({
    headers1: [
      {
        align: "start",
        key: "code",
        sortable: false,
        title: "code",
      },
      { title: "name", key: "name" },
      { title: "Role", key: "Role" },
      { title: "number", key: "number" },
    ],
    data1: [
      {
        code: "254",
        name: "tomy",
        Role: "Admin",
        number: "01110133639",
      },
      {
        code: "1234",
        name: "sherif mohamed",
        Role: "employee",
        number: "01110133639",
      },
      {
        code: "876",
        name: "el gamal",
        Role: "Admin",
        number: "01110133639",
      },
      {
        code: "655",
        name: "amir",
        Role: "Admin",
        number: "01110133639",
      },
      {
        code: "254",
        name: "gamalko",
        Role: "Admin",
        number: "01110133639",
      },
    ],
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
    headers2: [
      {
        align: "start",
        key: "ID",
        sortable: false,
        title: "ID",
      },
      { title: "property", key: "property" },
      { title: "quantity", key: "quantity" },
    ],
    data2: [
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
  getters: {
    total: (state) => {
      return state.data.length;
    },
    total1: (state) => {
      return state.data1.length;
    },
    total2: (state) => {
      return state.data2.length;
    },
  },
});
