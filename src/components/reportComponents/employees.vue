<template>
  <v-conatianer v-if="!loading">
    <v-row>
      <v-col cols="12" class="text-center">All Employees</v-col>
      <DynamicCardButtons :data="Allemployee" @clicked="selectFromAll" />
    </v-row>

    <v-row>
      <v-col cols="12" class="text-center">One Employee</v-col>
      <v-col cols="12">
        <v-autocomplete
          label="All Employees"
          :items="allEmployees"
          v-model="selected"
          item-title="name"
          return-object
        ></v-autocomplete>
      </v-col>
      <DynamicCardButtons :data="oneEmployee" @clicked="selectFromOne" />
    </v-row>
  </v-conatianer>
  <v-row v-if="loading"
    ><v-col cols="4"></v-col
    ><v-col cols="2"
      ><v-progress-circular
        color="green"
        indeterminate
        :size="71"
        :width="5" /></v-col
    ><v-col cols="4" class="mt-4"
      ><h3 class="gradient-text">let the magic happen</h3></v-col
    >
  </v-row>
</template>
<script>
import DynamicCardButtons from "../DynamicCardButtons.vue";
import * as Button from "@/services/ReportButtons.js";
import * as employee from "../../services/employees";
import { usedata } from "@/stores/print_data";
import { useheaders } from "@/stores/headers";
import swal from "sweetalert";
export default {
  components: {
    DynamicCardButtons,
  },
  setup() {
    const print_data = usedata();
    const headers = useheaders();

    return { print_data, headers };
  },
  data() {
    return {
      loading: false,
      selected: "",
      Allemployee: Button.AllEmployeesButtons,
      oneEmployee: Button.OneEmployeeButtons,
      allEmployees: [],
      headerEmployeeSalary: [
        {
          title: "stage",
          align: "start",
          key: "stage[name]",
        },

        {
          title: "work quantity",
          align: "start",
          key: "qty",
        },
        {
          title: "error quantity",
          align: "start",
          key: "err",
        },

        {
          title: "Work percentage ",
          align: "start",
          key: "workRate",
        },
        {
          title: "error percentage ",
          align: "start",
          key: "errorRate",
        },
        {
          title: "Work efficiency ",
          align: "start",
          key: "workEff",
        },
      ],
    };
  },
  created() {
    this.getallemployees();
  },
  methods: {
    selectFromAll(data) {
      if (data.value === 0) {
        this.printAllEmployees();
      }
    },
    selectFromOne(data) {
      console.log(data);
      if (this.selected === "") {
        swal("error", "please Choose Employee", "error");
      } else {
        if (data.value === 0) {
          this.printEmployeeSalary();
        }
      }
    },
    getallemployees() {
      employee.GetAll().then((res) => {
        this.allEmployees = res;
      });
    },
    printAllEmployees() {
      const data = [];
      const header = this.headers.employee_header;
      const title = this.$t(`employees.all`);
      employee.GetAll().then((response) => {
        response.forEach((element) => {
          const x = {};
          x._id = element._id;
          x.code = element.code;
          x.name = element.name;
          x.role = element.role.title;
          data.push(x);
        });
      });
      this.printo(title, data, header);
    },
    printEmployeeSalary() {
      const salary = [];
      employee.GetSalary(this.selected._id).then((res) => {
        console.log("here", res);
        res.forEach((element) => {
          element.totalWorkPerMonth.forEach((el) => {
            let x = {};
            x.month = "month " + element.date.month;
            x.stage = el.stage;
            x.qty = el.quantity;
            x.err = el.noOfErrors;
            x.workRate = (
              (+el.quantity / (+el.stage.rate * 8 * 26)) *
              100
            ).toFixed(4);
            x.errorRate = ((+el.noOfErrors / +el.quantity) * 100).toFixed(2);
            x.workEff = (+x.workRate - +x.errorRate).toFixed(2);
            salary.push(x);
          });
        });
        this.printo(
          `${this.selected.name} work Details`,
          salary,
          this.headerEmployeeSalary
        );
      });
    },
    printo(title, data, header) {
      this.print_data.title = title;
      this.print_data.data = data;
      this.print_data.header = header;
      setTimeout(() => {
        this.$router.push({ path: "/print" });
      }, 500);
    },
  },
};
</script>
