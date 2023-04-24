import { defineStore } from "pinia";

export const usestore = defineStore("employees", {
  state: () => ({
    headers: [
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
    data: [
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
  }),
  getters: {
    total: (state) => {
      return state.data.length;
    },
  },
});
