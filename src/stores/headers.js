import { defineStore } from "pinia";

export const useheaders = defineStore("headers", {
  state: () => ({
    mat_prop_header: [
      {
        align: "start",
        key: "name",
        sortable: false,
        title: "name",
      },

      { title: "quantity", key: "quantity" },
      { title: "available", key: "available" },
      { title: "role", key: "role" },
    ],
    mat_header: [
      {
        align: "start",
        key: "name",
        sortable: false,
        title: "name",
      },

      { title: "quantity", key: "quantity" },
      { title: "available", key: "available" },
      { title: "role", key: "role" },
      { title: "type", key: "type" },
    ],
    employee_hand_header: [
      {
        align: "start",
        key: "name",
        sortable: false,
        title: "name",
      },

      { title: "total quantity", key: "totalQuantity" },
      { title: "last date", key: "lastDate" },
    ],
    supplier_supply: [
      {
        align: "start",
        key: "name",
        sortable: false,
        title: "name",
      },

      { title: "last Quantity", key: "lastQuantity" },
      { title: "last Price", key: "lastPrice" },
      { title: "last Date", key: "lastDate" },
      { title: "total Quantity", key: "totalQuantity" },
      { title: "total cost", key: "totalCost" },
    ],
    historyheader: [
      {
        align: "start",
        key: "quantity",
        sortable: false,
        title: "quantity",
      },
      { title: "operation", key: "operation" },
      { title: "date", key: "date" },
    ],
    color_size_header: [
      {
        align: "start",
        key: "name",
        sortable: false,
        title: "name",
      },
      { title: "code", key: "code" },
    ],
    card_header: [
      { title: "code", key: "code" },
      { title: "order", key: "order[name]" },
      { title: "model", key: "model[name]" },
      { title: "quantity", key: "quantity" },
    ],
    role_header: [
      {
        align: "start",
        key: "title",
        sortable: false,
        title: "name",
      },
      { title: "priority", key: "number" },
    ],
    model_header: [
      {
        align: "start",
        key: "name",
        sortable: false,
        title: "name",
      },
      { title: "code", key: "code" },
      { title: "details", key: "details" },
    ],
    request_header: [
      {
        align: "start",
        key: "name",
        sortable: false,
        title: "name",
      },
      { title: "status", key: "status" },
      { title: "created at", key: "time" },
    ],
    order_header: [
      {
        align: "start",
        key: "name",
        sortable: false,
        title: "name",
      },
      { title: "client", key: "client" },
      { title: "created at", key: "time" },
    ],
    shipment_header: [
      {
        align: "start",
        key: "name",
        sortable: false,
        title: "name",
      },
      { title: "order", key: "order" },
      { title: "created at", key: "time" },
    ],
    carton_header: [
      {
        align: "start",
        key: "name",
        sortable: false,
        title: "name",
      },
      { title: "quantity", key: "quantity" },
      { title: "model", key: "model" },
    ],
    type_header: [{ title: "name", key: "type" }],
    machinetype_header: [{ title: "name", key: "name" }],
    stage_header: [
      {
        align: "start",
        key: "name",
        sortable: false,
        title: "name",
      },
      { title: "code", key: "code" },
      { title: "type", key: "type" },
      { title: "rate/h", key: "rate" },
      { title: "price/p", key: "price" },
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
    supplier_header: [
      {
        align: "start",
        key: "name",
        sortable: false,
        title: "name",
      },
      { title: "Phone", key: "phoneNo" },
      { title: "state", key: "state" },
    ],
  }),
  getters: {},
});
