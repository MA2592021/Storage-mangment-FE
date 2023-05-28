<template>
  <v-card class="mx-auto" elevation="2" style="width: 100%"
    ><v-row
      ><v-col cols="3" sm="2"
        ><v-img
          class="bg-white"
          width="300"
          :aspect-ratio="1"
          :src="
            property.image ? property.image.data : '/arkan_logo-no-text.png'
          "
          cover
        ></v-img></v-col
      ><v-col cols="9" sm="10">
        <v-row>
          <v-col cols="12">
            <v-text-field
              label="Name "
              required
              :readonly="dis === true"
              v-model="property.name"
              variant="underlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6" lg="3">
            <v-text-field
              required
              label="available "
              :readonly="dis === true"
              v-model="property.available"
              :suffix="property.unit"
              variant="underlined"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6" lg="3">
            <v-text-field
              required
              v-model="property.quantity"
              label="quantity "
              :readonly="!isEditing"
              :suffix="property.unit"
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
              v-model="property.max"
              :suffix="property.unit"
              variant="underlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6" lg="3">
            <v-text-field
              required
              label="min "
              :readonly="dis === true"
              v-model="property.min"
              :suffix="property.unit"
              variant="underlined"
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="6">
            <v-autocomplete
              label="Role "
              v-model="property.role"
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
              v-model="property.unit"
              variant="underlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6"
            ><v-textarea
              :clearable="dis === false"
              label="Note"
              v-model="property.note"
              :readonly="dis === true"
              prepend-icon="mdi-note-text-outline"
            ></v-textarea>
          </v-col>
          <v-col cols="12" sm="6"
            ><v-textarea
              :clearable="dis === false"
              label="details"
              v-model="property.details"
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
        v-bind:closedtitle="this.property.name"
        v-bind:link="link"
        @clicked="onClickChild_employee"
        @appended="employee_appended"
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
import swal from "sweetalert";
import { useheaders } from "../../../stores/headers";
import moment from "moment";
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
    property: {
      img: "/arkan_logo-no-text.png",
    },
    orgproperty: {},
    employees: [],
    historytype: "",
    obj: {},
    historyobject: {},
    roles: [],
  }),
  created() {
    //GEtet route here
    axios.get("/api/role").then((response) => {
      this.roles = response.data.data;
    });
    this.propertyload();
    this.property_employee_load();
  },
  setup() {
    const headers = useheaders();

    return {
      headers,
    };
  },
  methods: {
    onClickChild_employee(value) {
      // console.log(value);
      this.historytype = "employee";
      this.historyview(value._id);
    },
    employee_appended(value) {
      axios
        .post("/api/custodyEmployee/assign", {
          custody: this.orgproperty._id,
          employee: value._id,
          quantity: value.qty,
          operation: "assign",
        })
        .then((response) => {
          if (response.data.errors) {
            swal("error", response.data.errors[0].msg, "error");
          } else {
            swal("success", "employee appended successfully", "success");
            this.property_employee_load();
          }
        });
    },
    propertyload() {
      axios.get("/api/custody/" + this.$route.params.id).then((response) => {
        console.log(response);
        this.orgproperty = [];
        if (response.data.errors) {
          swal("error", response.data.errors[0].msg, "error");
        } else {
          this.orgproperty = response.data.data;
          this.clone();
        }
      });
    },
    property_employee_load() {
      axios
        .get("/api/custodyEmployee/custody/" + this.$route.params.id)
        .then((response) => {
          this.employees = [];
          console.log(response);
          response.data.data.forEach((element) => {
            const x = {};
            x._id = element._id;
            x.history = element.history;
            x.lastDate = moment(element.lastDate).calendar();
            x.totalQuantity = element.totalQuantity;
            x.name = element.employee.name;
            x.employee_id = element.employee._id;
            console.log(x);
            this.employees.push(x);
          });
        });
    },
    submit(value) {
      //Post route here
      console.log(value);
      const x = {};
      x.custody = this.$route.params.id;
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
          .post("/api/custodyEmployee/assign", {
            custody: obj.custody,
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
              this.property_employee_load();
              this.dialog2 = false;
            }
          });
      } else {
        axios
          .patch("/api/custodyEmployee/back", {
            custody: obj.custody,
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
              this.property_employee_load();
              this.dialog2 = false;
            }
          });
      }
    },
    savenote(value) {
      console.log(value);
      if (this.historytype === "property") {
        this.properties.find((m) => m._id === value.id).note = value.note;
        console.log(this.properties.find((m) => m._id === value.id).note);
      } else {
        this.propertys.find((m) => m._id === value.id).note = value.note;
      }
    },
    check() {
      this.dialog = false;
      this.dialog1 = true;
    },
    historyview(id) {
      // console.log(this.propfind(id));

      this.historyobject.title = this.historytype + " history";
      if (this.historytype === "employee") {
        this.obj = this.employees.find((m) => m._id === id);
        this.historyobject._id = this.obj.employee_id;
      } else {
        this.obj = this.propertys.find((m) => m._id === id);
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
          "this change is critical and must double check it :  property quantity is : ( " +
          this.property.quantity +
          " )";
        this.dialog = !this.dialog;
      }
    },
    clone() {
      this.property.id = this.orgproperty._id;
      this.property.name = this.orgproperty.name;
      this.property.quantity = this.orgproperty.quantity;
      //   this.property.img = this.orgproperty.img;
      this.property.available = this.orgproperty.available;
      this.property.role = this.orgproperty.role;
      this.property.note = this.orgproperty.note;
      this.property.unit = this.orgproperty.unit;
      this.property.details = this.orgproperty.details;
      this.property.employees = this.orgproperty.employees;
      this.property.image = this.orgproperty.image;
      this.property.max = this.orgproperty.max;
      this.property.min = this.orgproperty.min;
    },
    cancel() {
      this.dialog = false;
      this.dialog1 = false;
      this.dis = !this.dis;
      this.isEditing = false;

      this.clone();
      this.content =
        "Incorrect changes can lead to system problems in the future. Are you sure about the changes you made?";
    },
    save() {
      this.dis = !this.dis;
      this.dialog = false;
      this.isEditing = false;
      this.dialog1 = false;

      //save route here
      axios
        .patch("/api/custody/" + this.$route.params.id, {
          name: this.property.name,
          unit: this.property.unit,
          role: this.property.role._id,
          type: this.property.type,
          max: this.property.max,
          min: this.property.min,
          note: this.property.note,
          details: this.property.details,
          available: this.property.available,
          quantity: this.property.quantity,
        })
        .then((response) => {
          if (response.data.errors) {
            swal("error", response.data.errors[0].msg, "error");
          } else {
            swal("success", "property updated successfully", "success");
            this.propertyload();
          }
        });
    },
    deletee() {
      swal({
        title: "Are you sure?",
        text: "Are you sure that you want to delete this property?",
        icon: "warning",
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          axios
            .delete("/api/custody/" + this.$route.params.id)
            .then((response) => {
              if (response.data.errors) {
                swal("error", response.data.errors[0].msg, "error");
              } else {
                swal(
                  "success",
                  "property deleted suuccessfully",
                  "success"
                ).then(() => {
                  this.$router.push({ path: "/storage/property/all" });
                });
              }
            });
        }
      });
    },
  },
};
</script>
