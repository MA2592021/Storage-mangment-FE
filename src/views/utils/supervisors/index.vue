<template>
  <v-row>
    <v-col cols="12" class="text-center mt-4"
      ><span
        ><v-icon
          icon=" mdi-sitemap"
          style="size: #fbc02d"
          class="mb-2 mr-2"
        ></v-icon>
        <span class="text-h5" style="size: #fbc02d"> Super Visor</span></span
      ></v-col
    >
    <!-- <v-row>
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
    ></v-row> -->

    <v-col cols="12">
      <v-data-table
        :search="search"
        :headers="headers"
        :items="groups"
        class="mt-1"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title align="center">Groups</v-toolbar-title>
            <v-toolbar-actions
              ><v-btn color="success" @click="dialog1 = true"
                >+ Add</v-btn
              ></v-toolbar-actions
            >
          </v-toolbar>
          <v-text-field
            v-model="search"
            label="Search"
            single-line
            hide-details
            class="mt-5"
          ></v-text-field>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-icon size="small" class="me-2" @click="load_group(item)">
            mdi mdi-eye-circle
          </v-icon>
          <v-icon size="small" class="me-2" @click="clicked(item)">
            mdi-pen
          </v-icon>
          <v-icon size="small" class="me-2" @click="deleteGroup(item)">
            mdi-window-close
          </v-icon>
        </template>
      </v-data-table></v-col
    >
  </v-row>
  <v-dialog v-model="dialog">
    <v-card>
      <v-card-title align="start" class="mt-2 mb-2">
        <p>order : {{ selectedOrder.name }}</p>
        <p>model : {{ selectedModel.name }}</p>
        <p>start stage : {{ selectedFrom.name }}</p>
        <p>end stage : {{ selectedTo.name }}</p>
      </v-card-title>

      <v-row>
        <v-col cols="11" class="ml-4">
          <v-autocomplete
            v-model="selectedEmployee"
            :items="employees"
            item-title="name"
            return-object
            :label="$t('employee')"
          ></v-autocomplete>
        </v-col>
      </v-row>
      <v-card-actions
        ><v-btn color="blue-darken-1" variant="text" @click="dialog = false">
          Close
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="success" variant="text" @click="updateGroup()">
          Update
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="dialog1">
    <v-card>
      <v-card-title align="center" class="mb-2 mt-2">Add Group</v-card-title>
      <v-row>
        <v-col cols="11" class="ml-4">
          <v-autocomplete
            v-model="selectedEmployee"
            :items="employees"
            item-title="name"
            return-object
            :label="$t('employee')"
          ></v-autocomplete>
        </v-col> </v-row
      ><v-row>
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
      <v-row>
        <v-col cols="6" class="ml-4">
          <v-autocomplete
            v-model="selectedFrom"
            :items="Stages"
            item-title="id[name]"
            return-object
            label="From"
          ></v-autocomplete>
        </v-col>
        <v-col cols="5" class="ml-4">
          <v-autocomplete
            v-model="selectedTo"
            :items="Stages"
            item-title="id[name]"
            return-object
            label="To"
          ></v-autocomplete> </v-col
      ></v-row>
      <v-card-actions>
        <v-btn color="info" @click="closeAddDialog()">Close</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="success" @click="add_group">Add</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="dialog2">
    <v-card>
      <v-card-title align="start" class="mt-2 mb-2">
        <p>employee : {{ viewGroup.employee.name }}</p>
        <p>order : {{ viewGroup.order.name }}</p>
        <p>model : {{ viewGroup.model.name }}</p>
        <p>start stage : {{ viewGroup.startStage.name }}</p>
        <p>end stage : {{ viewGroup.endStage.name }}</p>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <tables
              :title="` order ${viewGroup.order.name} model ${viewGroup.model.name} 
             supervisor ${viewGroup.employee.name}  Group  Stages`"
              :data="viewGroup.stages"
              :header="headers1"
            />
          </v-col>
        </v-row>
      </v-card-text> </v-card
  ></v-dialog>
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
      viewHistory: false,
      orders: [],
      search: "",
      selectedOrder: "",
      selectedModel: "",
      selectedGroup: "",
      selectedEmployee: "",
      selectedFrom: "",
      selectedTo: "",
      viewGroup: "",
      Stages: [],
      employees: [],
      stage: [],
      groups: [],
      headers: [
        { title: "super visor", align: "start", key: "employee[name]" },
        { title: "order", align: "start", key: "order[name]" },
        { title: "model", align: "start", key: "model[name]" },
        { title: "start stage", align: "start", key: "startStage[name]" },
        { title: "end stage", align: "start", key: "endStage[name]" },
        { title: "Actions", key: "actions", align: "center", sortable: false },
      ],
      headers1: [
        { title: "code", align: "start", key: "code" },
        { title: "name", align: "start", key: "name" },
        { title: "rate", align: "start", key: "rate" },
        { title: "Actions", key: "actions", align: "center", sortable: false },
      ],
      dialog: false,
      dialog1: false,
      dialog2: false,
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
      });
    },
    load_stages() {
      axios.get(`/api/model/${this.selectedModel.id}`).then((res) => {
        this.Stages = res.data.data.stages;
      });
    },

    load_employees() {
      axios.get(`/api/employee`).then((res) => {
        this.employees = res.data.data;
      });
    },
    load_groups() {
      axios.get("/api/group/").then((res) => {
        this.groups = res.data.data;
      });
    },
    load_group(item) {
      axios.get(`/api/group/${item.raw._id}`).then((res) => {
        console.log(res);
        this.viewGroup = res.data.data;
        this.dialog2 = true;
      });
    },
    add_group() {
      //console.log(this.selectedFrom);
      axios
        .post(`/api/group/`, {
          order: this.selectedOrder.id,
          model: this.selectedModel.id,
          startStage: this.selectedFrom.id._id,
          endStage: this.selectedTo.id._id,
          employee: this.selectedEmployee._id,
        })
        .then((res) => {
          swal({
            title: "Group Added Successfully",
            icon: "success",
          });
          this.load_groups();
          this.selectedEmployee = "";
        });
    },
    updateGroup() {
      axios
        .patch(`/api/group/${this.selectedGroup}`, {
          employee: this.selectedEmployee._id,
        })
        .then((res) => {
          swal({
            title: "Employee Added Successfully",
            icon: "success",
          });
          this.load_groups();
        });
    },
    deleteGroup(item) {
      //console.log(item);
      swal({
        title: "Are you sure?",
        text: "Are you sure that you want to delete this Group?",
        icon: "warning",
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          axios.delete(`/api/group/${item.raw._id}`).then((res) => {
            swal({
              title: "Group Deleted Successfully",
              icon: "success",
            });
            this.load_groups();
          });
        }
      });
    },
    clicked(item) {
      //console.log(item.raw);
      this.selectedGroup = item.raw._id;
      this.selectedEmployee = item.raw.employee;
      this.selectedOrder = item.raw.order;
      this.selectedModel = item.raw.model;
      this.selectedFrom = item.raw.startStage;
      this.selectedTo = item.raw.endStage;
      this.dialog = true;
      // this.$router.push({
      //   path: `/utils/stage_workers/${this.selectedOrder.id}/${this.selectedModel.id}/${item.id._id}`,
      // });
    },
    closeAddDialog() {
      this.selectedEmployee = "";
      this.selectedFrom = "";
      this.selectedTo = "";
      this.selectedOrder = "";
      this.selectedModel = "";
      this.dialog1 = false;
    },
  },
  created() {
    //this.loadtrack();
    this.load_order();
    this.load_employees();
    this.load_groups();
  },
};
</script>
