<template>
  <v-card class="mx-auto" elevation="2" style="width: 100%">
    <v-row class="ma-3">
      <v-col cols="12" sm="12">
        <v-text-field
          label="order"
          required
          readonly
          v-model="stageDetails.order.name"
          variant="underlined"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="12">
        <v-text-field
          label="model"
          required
          readonly
          v-model="stageDetails.model.name"
          variant="underlined"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="12">
        <v-text-field
          label="stage"
          required
          readonly
          v-model="stageDetails.stage.name"
          variant="underlined"
        ></v-text-field>
      </v-col>
      <!-- <v-col cols="12" sm="6">
        <v-text-field
          label="quantity "
          required
          readonly
          v-model="card.quantity"
          variant="underlined"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          label="start range "
          required
          readonly
          v-model="card.startRange"
          variant="underlined"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          label="end range "
          required
          readonly
          v-model="card.endRange"
          variant="underlined"
        ></v-text-field> -->
      <!-- </v-col> -->
    </v-row>
    <v-data-table :headers="headers1" :items="stageCurrentWorkers" class="mt-4">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title align="center">Employees</v-toolbar-title>
          <v-toolbar-actions
            ><v-btn color="success" @click="dialog1 = true"
              >+ Add</v-btn
            ></v-toolbar-actions
          >
        </v-toolbar>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon size="small" class="me-2" @click="deleteEmployee(item.raw)">
          mdi-window-close
        </v-icon>
      </template>
    </v-data-table>
  </v-card>
  <v-dialog v-model="dialog1">
    <v-card>
      <v-card-title>Add Employee</v-card-title>
      <v-row>
        <v-col cols="11" class="ml-4">
          <v-autocomplete
            v-model="selectedEmployee"
            :items="employees"
            item-title="name"
            return-object
            :label="$t('employee')"
          ></v-autocomplete> </v-col></v-row
      ><v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="success" @click="add_employee">Add</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-expansion-panels class="mt-4">
    <v-expansion-panel>
      <v-expansion-panel-title>
        <template v-slot:default="{ expanded }">
          <v-row no-gutters>
            <v-col cols="4" class="d-flex justify-start"> History </v-col>
            <v-col cols="8" class="text-grey">
              <v-fade-transition leave-absolute>
                <span v-if="expanded" key="0"> History </span>
                <span v-else key="1"> Workers History </span>
              </v-fade-transition>
            </v-col>
          </v-row>
        </template>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-row>
          <v-col col="6" xs="12" align="center">
            <v-data-table
              v-model:items-per-page="itemsPerPage"
              :headers="headers"
              :items="stageDetails.employees"
              class="elevation-1"
            >
              <template v-slot:item.in="{ item }">
                {{ momento(item.columns.in) }}
              </template>
              <template v-slot:item.out="{ item }">
                {{ item.columns.out ? momento(item.columns.out) : "---" }}
              </template>
            </v-data-table>
            <div align="center" class="ma-2">
              <v-btn class="mx-auto" color="info" @click="printo(1)"
                >print
              </v-btn>
            </div></v-col
          >
        </v-row>
      </v-expansion-panel-text>
    </v-expansion-panel></v-expansion-panels
  >
</template>

<script>
import axios from "axios";
import moment from "moment";
export default {
  data() {
    return {
      dialog1: false,
      stageDetails: {
        order: { name: "" },
        model: { name: "" },
        stage: { name: "" },
      },
      stageCurrentWorkers: [],
      selectedEmployee: "",
      employees: [],
      headers: [
        { title: "code", align: "start", key: "employee[code]" },
        { title: "name", align: "start", key: "employee[name]" },
        { title: "start Date", key: "in", align: "center" },
        { title: "End Date", key: "out", align: "center" },
      ],
      headers1: [
        { title: "code", align: "start", key: "employee[code]" },
        { title: "name", align: "start", key: "employee[name]" },
        { title: "Actions", key: "actions", align: "center", sortable: false },
      ],
    };
  },
  created() {
    this.getStage();
    this.load_employees();
  },
  methods: {
    getStage() {
      const order = this.$route.params.orderId;
      const model = this.$route.params.modelId;
      const stage = this.$route.params.stageId;
      axios
        .get(
          `/api/stageEmployee/details/order/${order}/model/${model}/stage/${stage}`
        )
        .then((res) => {
          console.log(res.data.data);
          this.stageDetails = res.data.data;
          this.stageCurrentWorkers = res.data.data?.employees?.filter(
            (obj) => !obj.hasOwnProperty("out") || obj["out"] === undefined
          );
        });
    },
    load_employees() {
      axios.get(`/api/employee`).then((res) => {
        this.employees = res.data.data;
      });
    },
    add_employee() {
      axios
        .post(`/api/stageEmployee/addEmployee`, {
          order: this.stageDetails.order._id,
          model: this.stageDetails.model._id,
          stage: this.stageDetails.stage._id,
          employee: this.selectedEmployee._id,
        })
        .then((res) => {
          swal({
            title: "Employee Added Successfully",
            icon: "success",
          }).then(() => {
            this.getStage();
            this.selectedEmployee = "";
          });
        });
    },
    deleteEmployee(item) {
      console.log(item);
      swal({
        title: "Are you sure?",
        text: "Are you sure that you want to delete Employee from Stage?",
        icon: "warning",
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          axios
            .patch(`/api/stageEmployee/removeEmployee`, {
              order: this.stageDetails.order._id,
              model: this.stageDetails.model._id,
              stage: this.stageDetails.stage._id,
              employee: item.employee._id,
            })
            .then((res) => {
              swal({
                title: "Employee Added Successfully",
                icon: "success",
              }).then(() => {
                this.getStage();
              });
            });
        }
      });
    },
    momento(date) {
      return moment(date).calendar();
    },
  },
};
</script>
