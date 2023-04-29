import { defineStore } from "pinia";

export const useemployee = defineStore("employees", {
  state: () => ({
    data: [
      {
        note: "lailo lailo",
        img: "https://cdn.vuetifyjs.com/images/parallax/material.jpg",
        nid: "12312312313",
        code: "254",
        name: "tomy",
        role: "Supervisor",
        phone: "01110133639",
      },
      {
        note: "lailo lailo",
        img: "https://cdn.vuetifyjs.com/images/parallax/material.jpg",
        nid: "12312312313",
        code: "1234",
        name: "sherif mohamed",
        role: "employee",
        phone: "01110133639",
      },
      {
        code: "876",
        name: "el gamal",
        role: "Admin",
        phone: "01110133639",
        note: "lailo lailo",
        img: "",
        nid: "12312312313",
      },
      {
        code: "655",
        name: "amir",
        role: "Admin",
        phone: "01110133639",
        note: "lailo lailo",
        img: "",
        nid: "12312312313",
      },
      {
        code: "254",
        name: "gamalko",
        role: "Admin",
        phone: "01110133639",
        note: "lailo lailo",
        img: "",
        nid: "12312312313",
      },
    ],
    employee: {
      name: "amir",
      code: "2323",
      phone: "01110133639",
      role: "suprervisor",
      note: "lailo lailo",
      img: "https://cdn.vuetifyjs.com/images/parallax/material.jpg",
      nid: "12312312313",
    },
  }),
  getters: {
    total: (state) => {
      return state.data.length;
    },
    empfind: (state) => {
      return (empcode) => state.data.find((user) => user.code === empcode);
    },
  },
});
