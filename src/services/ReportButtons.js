// Report Buttons.js

const MainButtons = [
  {
    name: "Users",
    icon: "mdi-badge-account",
    data: "users",
  },
  {
    name: "Employees",
    icon: "mdi-account-group",
    data: "EmployeeButtons",
  },
  {
    name: "Orders",
    icon: "mdi-cart",
    data: "orders",
  },
  {
    name: "Models",
    icon: "mdi-hanger",
    data: "models",
  },
  {
    name: "Cards",
    icon: "mdi-card-bulleted-settings-outline",
    data: "cards",
  },
  {
    name: "Storage",
    icon: "mdi-warehouse",
    data: "storage",
  },
];
const EmployeeButtons = [
  {
    name: "All Employees",
    icon: "mdi-account-group",
    data: "AllEmployeesButtons",
  },
  {
    name: "one Employee",
    icon: "mdi-account",
    data: "OneEmployeeButtons",
    choose: true,
    chooseNumber: 2,
    chooseMethods: ["employee.getAll"],
    selectTitles: ["Select Employee", "test"],
  },
];
const AllEmployeesButtons = [
  {
    name: "All Employees",
    icon: "mdi-badge-account",
    data: "allEmployees",
    end: true,
    value: 0,
  },
  {
    name: "Today Attended Employees",
    icon: "mdi-fingerprint",
    data: "allEmployees",
    end: true,
    value: 1,
    disabled: true,
  },
  {
    name: "Today Not Attended Employees",
    icon: "mdi-fingerprint-off",
    data: "allEmployees",
    end: true,
    value: 2,
    disabled: true,
  },
];
const AllCardsButtons = [
  {
    name: "All Cards",
    icon: "mdi-cards-outline",
    value: 0,
  },
  {
    name: "Finished Cards",
    icon: "mdi-card-text",
    value: 1,
  },
  {
    name: "unFinished Employees",
    icon: "mdi-card-text-outline",
    value: 2,
  },
];
const modelsButtons = [
  {
    name: "All Orders Requested This Model",
    icon: "mdi-order-bool-ascending-variant",
    value: 0,
  },
];
const WorkFLowButtons = [
  {
    name: "All Stages Main Stats",
    icon: "mdi-state-machine",
    value: 0,
  },
  {
    name: "All Stages Detailed Stats",
    icon: "mdi-state-machine",
    value: 1,
  },
];
const OneEmployeeButtons = [
  {
    name: "Employee Work Details",
    icon: "mdi-tshirt-crew",
    data: "EmployeeWork",
    end: true,
    value: 0,
    disabled: false,
  },
  {
    name: "Employee Storage Details",
    icon: "mdi-package-variant-closed",
    data: "EmployeeStorage",
    value: 1,
    end: true,
    disabled: true,
  },
];
const UsersButtons = [
  {
    name: "All Users",
    icon: "mdi-account-group",
    data: "AllEmployeesButtons",
  },
  {
    name: "one User",
    icon: "mdi-account",
    data: "OneEmployeeButtons",
  },
];

export {
  UsersButtons,
  OneEmployeeButtons,
  AllEmployeesButtons,
  EmployeeButtons,
  MainButtons,
  modelsButtons,
  WorkFLowButtons,
  AllCardsButtons,
};
