<template>
  <v-card class="mx-auto" elevation="2" style="width: 100%"
    ><v-row>
      <v-col cols="12" align="center" class="text-h4"> materials </v-col
      ><v-col cols="3" sm="2"
        ><v-img
          class="bg-white"
          width="300"
          :aspect-ratio="1"
          :src="material.img ? material.img : '/arkan_logo-no-text.png'"
          cover
        ></v-img></v-col
      ><v-col cols="9" sm="10">
        <v-row>
          <v-col cols="12">
            <v-text-field
              label="Name "
              required
              :readonly="dis === true"
              v-model="material.name"
              variant="underlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6" lg="3">
            <v-text-field
              required
              label="available "
              :readonly="dis === true"
              v-model="material.available"
              variant="underlined"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6" lg="3">
            <v-text-field
              required
              v-model="material.quantity"
              label="quantity "
              :readonly="!isEditing"
              variant="underlined"
              ><template v-slot:append>
                <v-slide-x-reverse-transition mode="out-in">
                  <v-btn
                    size="x-small"
                    :key="`icon-${isEditing}`"
                    :color="isEditing ? 'success' : 'error'"
                    :icon="
                      isEditing
                        ? 'mdi-check-outline'
                        : 'mdi-circle-edit-outline'
                    "
                    :disabled="dis === true"
                    @click="criticalchange()"
                  ></v-btn>
                </v-slide-x-reverse-transition> </template
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6" lg="3">
            <v-text-field
              required
              label="max "
              :readonly="dis === true"
              v-model="material.max"
              variant="underlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6" lg="3">
            <v-text-field
              required
              label="min "
              :readonly="dis === true"
              v-model="material.min"
              variant="underlined"
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="6">
            <v-autocomplete
              label="Role "
              v-model="material.role"
              variant="underlined"
              :readonly="dis === true"
              :items="roles"
              return-object
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              required
              label="Unit "
              :readonly="dis === true"
              v-model="material.unit"
              variant="underlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-autocomplete
              label="type "
              v-model="material.type"
              variant="underlined"
              :readonly="dis === true"
              :items="types"
              item-title="type"
              return-object
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" sm="6"
            ><v-textarea
              :clearable="dis === false"
              label="Note"
              v-model="material.note"
              :readonly="dis === true"
              prepend-icon="mdi-note-text-outline"
            ></v-textarea>
          </v-col>
          <v-col cols="12" sm="6"
            ><v-textarea
              :clearable="dis === false"
              label="details"
              v-model="material.details"
              :readonly="dis === true"
              prepend-icon="mdi-note-text-outline"
            ></v-textarea>
          </v-col>
        </v-row> </v-col></v-row
    ><v-card-actions class="mx-auto">
      <v-btn
        @click="cancel()"
        :prepend-icon="dis ? 'mdi-circle-edit-outline' : 'mdi-cancel'"
      >
        {{ dis ? "edit" : "cancel" }}
      </v-btn>
      <v-btn
        class="ml-auto text-red"
        @click="deletee()"
        :disabled="dis === true"
        prepend-icon="mdi-delete-forever"
      >
        Delete
      </v-btn>
      <v-btn
        class="ml-auto"
        :disabled="dis === true || isEditing === true"
        prepend-icon="mdi-check-outline"
        color="green"
        @click="dialog = !dialog"
      >
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
  <v-card class="mt-3" style="width: 100%">
    <v-expansion-panels variant="popout" class="my-4">
      <paneltable
        v-bind:data="employees"
        v-bind:header="headers.employee_hand_header"
        v-bind:panelname="'Employees'"
        v-bind:openedtitle="openedtitle"
        v-bind:closedtitle="this.material.name"
        v-bind:link="link"
        @clicked="onClickChild_employee"
        @appended="employee_append"
      />
    </v-expansion-panels>
  </v-card>
  <popuptest
    v-model="dialog"
    v-if="dialog"
    v-bind:title="title"
    v-bind:content="content"
    @save="check()"
    @close="cancel()"
  />
  <check
    v-model="dialog1"
    v-if="dialog1"
    @checked="save()"
    @closed="cancel()"
  />
  <history
    v-model="dialog2"
    v-if="dialog2"
    v-bind:viewobject="historyobject"
    @close="dialog2 = !dialog2"
    @saveclicked="savenote"
    @submit="submit"
  />
</template>

<script>
import paneltable from "../../../components/paneltable.vue";
import popuptest from "../../../components/popuptest.vue";
import check from "../../../components/checkpopup.vue";
import history from "../../../components/historypopup.vue";
import axios from "axios";
import moment from "moment";
import swal from "sweetalert";
import { useheaders } from "../../../stores/headers";

export default {
  components: { paneltable, popuptest, check, history },

  data: () => ({
    content:
      "Incorrect changes can lead to system problems in the future. Are you sure about the changes you made?",
    title: "are you sure ? ",
    link: { get: "/api/employee/" },
    isdisabled: true,
    dialog: false,
    dialog1: false,
    dialog2: false,
    openedtitle: "Employees have",
    dis: true,
    isEditing: false,
    material: {
      img: "/arkan_logo-no-text.png",
    },
    orgmaterial: {},
    employees: [],
    historytype: "",
    obj: {},
    historyobject: {},
    roles: [],
    types: [],
  }),
  created() {
    //GEtet route here
    axios.get("/api/role").then((response) => {
      this.roles = response.data.data;
      console.log(response);
    });
    axios.get("/api/materialType").then((response) => {
      this.types = response.data.data;
      console.log(response);
    });
    this.material_load();
    this.employees_material_load();
  },
  setup() {
    const headers = useheaders();

    return {
      headers,
    };
  },
  methods: {
    material_load() {
      axios.get("/api/material/" + this.$route.params.id).then((response) => {
        //console.log(response);
        this.orgmaterial = [];
        if (response.data.errors) {
          swal("error", response.data.errors[0].msg, "error");
        } else {
          this.orgmaterial = response.data.data;
          console.log(response);
          this.clone();
        }
      });
    },
    employees_material_load() {
      axios
        .get("/api/materialEmployee/material/" + this.$route.params.id)
        .then((response) => {
          this.employees = [];
          response.data.data.forEach((element) => {
            const x = {};
            x.id = element._id;
            x.totalQuantity = element.totalQuantity;
            x.lastDate = moment(element.lastDate).calendar();
            x.history = element.history;
            x.name = element.employee.name;
            x.employee_id = element.employee._id;
            x.note = element.note;
            this.employees.push(x);
          });
          // console.log(this.employees);
        });
    },
    onClickChild_employee(value) {
      console.log("onclcick child", value);
      this.historytype = "employee";
      this.historyview(value);
    },
    employee_append(value) {
      axios
        .post("/api/materialEmployee/assign", {
          material: this.orgmaterial._id,
          employee: value._id,
          quantity: value.qty,
          operation: "assign",
        })
        .then((response) => {
          if (response.data.errors) {
            swal("error", response.data.errors[0].msg, "error");
          } else {
            swal("success", "employee appended succesfully", "success");
            this.employees_material_load();
          }
        });
    },
    submit(value) {
      //Post route here
      console.log(value);
      const x = {};
      x.material = this.$route.params.id;
      x.quantity = value.qty;
      x.operation = value.operation;
      if (this.historytype === "employee") {
        x.employee = value._id;
        this.employee_operations(x);
      }
    },
    employee_operations(obj) {
      if (obj.operation === "assign") {
        axios
          .post("/api/materialEmployee/assign", {
            material: obj.material,
            employee: obj.employee,
            quantity: obj.quantity,
            operation: obj.operation,
          })
          .then((response) => {
            if (response.data.errors) {
              swal("error", response.data.errors[0].msg, "errors");
            } else {
              swal(
                "success",
                "employee history updated successfully",
                "success"
              );
              this.employees_material_load();
              this.dialog2 = false;
            }
          });
      } else {
        axios
          .patch("/api/materialEmployee/back", {
            material: obj.material,
            employee: obj.employee,
            quantity: obj.quantity,
            operation: obj.operation,
          })
          .then((response) => {
            if (response.data.errors) {
              swal("error", response.data.errors[0].msg, "errors");
            } else {
              swal(
                "success",
                "employee history updated successfully",
                "success"
              );
              this.employees_material_load();
              this.dialog2 = false;
            }
          });
      }
    },
    savenote(value) {
      axios
        .patch("/api/materialEmployee/note/" + value.id, {
          note: value.note,
        })
        .then(
          swal("success", "employee history updated successfully", "success")
        )
        .then(() => {
          this.dialog2 = false;
          this.employees_material_load();
        });
    },
    check() {
      this.dialog = false;
      this.dialog1 = true;
    },
    historyview(value) {
      // console.log(this.propfind(id));
      this.historyobject.title = this.historytype + " history";
      if (this.historytype === "employee") {
        this.obj = this.employees.find(
          (m) => m.employee_id === value.employee_id
        );
        this.historyobject._id = this.obj.employee_id;
      } else {
        this.obj = this.materials.find((m) => m._id === id);
      }
      this.historyobject.id = this.obj.id;
      this.historyobject.name = this.obj.name;
      this.historyobject.data = this.obj.history;
      this.historyobject.qty = this.obj.totalQuantity;
      this.historyobject.date = this.obj.lastDate;
      this.historyobject.note = this.obj.note;
      this.historyobject.header = this.headers.historyheader;
      this.dialog2 = true;
    },
    criticalchange() {
      if (this.isEditing === false) {
        this.isEditing = !this.isEditing;
      } else {
        this.content =
          "this change is critical and must double check it :  material quantity is : ( " +
          this.material.quantity +
          " )";
        this.dialog = !this.dialog;
      }
    },
    clone() {
      this.material.id = this.orgmaterial._id;
      this.material.name = this.orgmaterial.name;
      this.material.quantity = this.orgmaterial.quantity;
      //   this.material.img = this.orgmaterial.img;
      this.material.available = this.orgmaterial.available;
      this.material.role = this.orgmaterial.role;
      this.material.note = this.orgmaterial.note;
      this.material.type = this.orgmaterial.type;
      this.material.unit = this.orgmaterial.unit;
      this.material.details = this.orgmaterial.details;
      this.material.employees = this.orgmaterial.employees;
      this.material.max = this.orgmaterial.max;
      this.material.min = this.orgmaterial.min;
    },
    cancel() {
      this.dialog = false;
      this.dialog1 = false;
      this.dis = !this.dis;
      this.isEditing = false;

      this.material.id = this.orgmaterial._id;
      this.material.name = this.orgmaterial.name;
      this.material.quantity = this.orgmaterial.quantity;
      //   this.material.img = this.orgmaterial.img;
      this.material.available = this.orgmaterial.available;
      this.material.role = this.orgmaterial.role;
      this.material.note = this.orgmaterial.note;
      this.material.unit = this.orgmaterial.unit;
      this.material.details = this.orgmaterial.details;
      this.material.employees = this.orgmaterial.employees;
      this.material.max = this.orgmaterial.max;
      this.material.min = this.orgmaterial.min;
      this.content =
        "Incorrect changes can lead to system problems in the future. Are you sure about the changes you made?";
    },
    save() {
      this.dis = !this.dis;
      this.dialog = false;
      this.isEditing = false;
      this.dialog1 = false;
      // this.materials.material.name = this.material.name;
      // this.materials.material.code = this.material.code;
      // this.materials.material.img = this.material.img;
      // this.materials.material.nid = this.material.nid;
      // this.materials.material.role = this.material.role;
      // this.materials.material.note = this.material.note;
      // this.materials.material.phone = this.material.phone;

      //save route here
      axios
        .patch("/api/material/" + this.$route.params.id, {
          name: this.material.name,
          unit: this.material.unit,
          role: this.material.role._id,
          type: this.material.type._id,
          max: this.material.max,
          min: this.material.min,
          note: this.material.note,
          details: this.material.details,
          available: this.material.available,
          quantity: this.material.quantity,
        })
        .then((response) => {
          if (response.data.errors) {
            swal("error", response.data.errors[0].msg, "error");
          } else {
            swal("success", "material updated successfully", "success");
            this.material_load();
          }
        });
    },
    deletee() {
      swal({
        title: "Are you sure?",
        text: "Are you sure that you want to delete this material?",
        icon: "warning",
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          axios
            .delete("/api/material/" + this.$route.params.id)
            .then((response) => {
              if (response.data.errors) {
                swal("error", response.data.errors[0].msg, "error");
              } else {
                swal(
                  "success",
                  "material deleted suuccessfully",
                  "success"
                ).then(() => {
                  this.$router.push({ path: "/storage/material/all" });
                });
              }
            });
        }
      });
    },
  },
};
</script>
