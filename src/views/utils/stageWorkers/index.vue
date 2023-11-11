<template>
  <v-row>
    <v-col cols="12" class="text-center mt-4"
      ><span
        ><v-icon
          icon=" mdi-sitemap"
          style="size: #fbc02d"
          class="mb-2 mr-2"
        ></v-icon>
        <span class="text-h5" style="size: #fbc02d"> Stage Workers</span></span
      ></v-col
    >
    <v-row>
      <v-col cols="6" class="ml-4">
        <v-autocomplete
          v-model="selectedOrder"
          :items="orders"
          item-title="name"
          return-object
          :label="$t('order')"
        ></v-autocomplete>
      </v-col>
      <v-col cols="5" class="ml-4">
        <v-autocomplete
          v-model="selectedModel"
          :items="selectedOrder.models"
          item-title="name"
          return-object
          :label="$t('model')"
          @update:modelValue="load_stages()"
        ></v-autocomplete> </v-col
    ></v-row>

    <v-col cols="12"
      ><tables :data="Stages" :header="headers" @table-clicked="clicked"
    /></v-col>
  </v-row>
  <v-dialog v-model="dialog" width="auto">
    <v-card>
      <v-card-title>
        <v-row> order : {{ selectedOrder.name }}</v-row>
        <v-row>model : {{ selectedModel.name }}</v-row>
        <v-row> stage : {{ selectedStage.id.name }}</v-row>
      </v-card-title>

      <v-data-table :headers="headers1" :items="stage" class="mt-1">
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
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="dialog = false">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
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
</template>

<script>
import axios from "axios";
import tables from "../../../components/table.vue";
import swal from "sweetalert";
export default {
  components: {
    tables,
  },
  data() {
    return {
      orders: [],
      selectedOrder: "",
      selectedModel: "",
      selectedStage: "",
      selectedEmployee: "",
      Stages: [],
      employees: [],
      stage: [],
      headers: [
        { title: "code", align: "start", key: "id[code]" },
        { title: "stage", align: "start", key: "id[name]" },
        { title: "type", align: "start", key: "id[type]" },
      ],
      headers1: [
        { title: "code", align: "start", key: "employee[code]" },
        { title: "name", align: "start", key: "employee[name]" },
        { title: "Actions", key: "actions", align: "center", sortable: false },
      ],
      dialog: false,
      dialog1: false,
    };
  },
  methods: {
    load_order() {
      axios.get("/api/order").then((res) => {
        this.orders = res.data.data.map((order) => ({
          name: order.name,
          id: order._id,
          models: order.models
            .filter(
              (person, index, self) =>
                index === self.findIndex((p) => p.id._id === person.id._id)
            )
            .map((model) => ({
              name: model.id.name,
              id: model.id._id,
            })),
        }));
        //console.log(res.data.data);
      });
    },
    load_stages() {
      axios.get(`/api/model/${this.selectedModel.id}`).then((res) => {
        console.log(res.data.data);
        this.Stages = res.data.data.stages;
      });
    },
    load_stage_details(stage) {
      axios
        .get(
          `/api/stageEmployee/details/order/${this.selectedOrder.id}/model/${this.selectedModel.id}/stage/${stage}`
        )
        .then((res) => {
          console.log("res", res);
          this.stage = res.data.data?.employees?.filter(
            (obj) => !obj.hasOwnProperty("out") || obj["out"] === undefined
          );

          console.log(this.stage);
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
          order: this.selectedOrder.id,
          model: this.selectedModel.id,
          stage: this.selectedStage.id._id,
          employee: this.selectedEmployee._id,
        })
        .then((res) => {
          swal({
            title: "Employee Added Successfully",
            icon: "success",
          });
          this.load_stage_details(this.selectedStage.id._id);
          this.selectedEmployee = "";
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
              order: this.selectedOrder.id,
              model: this.selectedModel.id,
              stage: this.selectedStage.id._id,
              employee: item.employee._id,
            })
            .then((res) => {
              swal({
                title: "Employee Added Successfully",
                icon: "success",
              });
              this.load_stage_details(this.selectedStage.id._id);
            });
        }
      });
    },
    clicked(item) {
      // this.selectedStage = item;
      // this.load_stage_details(item.id._id);
      // this.dialog = true;
      this.$router.push({
        path: `/utils/stage_workers/${this.selectedOrder.id}/${this.selectedModel.id}/${item.id._id}`,
      });
    },
  },
  created() {
    //this.loadtrack();
    this.load_order();
    this.load_employees();
  },
};
</script>
