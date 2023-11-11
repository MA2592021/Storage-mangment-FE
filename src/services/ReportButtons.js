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
  },
];
const AllEmployeesButtons = [
  {
    name: "All Employees",
    icon: "mdi-badge-account",
    data: "allEmployees",
    end: true,
  },
  {
    name: "Today Attended Employees",
    icon: "mdi-fingerprint",
    data: "allEmployees",
    end: true,
  },
  {
    name: "Today Not Attended Employees",
    icon: "mdi-fingerprint-off",
    data: "allEmployees",
    end: true,
  },
];
const OneEmployeeButtons = [
  {
    name: "Employee Main Details",
    icon: "mdi-account-details-outline",
    data: "EmployeeData",
    end: true,
  },
  {
    name: "Employee Work Details",
    icon: "mdi-tshirt-crew",
    data: "EmployeeWork",
    end: true,
  },
  {
    name: "Employee Storage Details",
    icon: "mdi-package-variant-closed",
    data: "EmployeeStorage",
    end: true,
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
};
