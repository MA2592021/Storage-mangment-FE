<template>
  <v-card class="mx-auto" elevation="2" style="width: 100%"
    ><v-row
      ><v-col cols="12" align="center" class="text-h4"> Employees </v-col
      ><v-col cols="3" sm="2"
        ><v-img
          class="bg-white"
          width="300"
          :aspect-ratio="1"
          :src="employee.img"
          cover
        ></v-img></v-col
      ><v-col cols="9" sm="10">
        <v-row>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              label="Name "
              required
              :readonly="dis === true"
              v-model="employee.name"
              variant="underlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              required
              label="Code "
              :readonly="dis === true"
              v-model="employee.code"
              variant="underlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              label="Phone number "
              variant="underlined"
              :readonly="dis === true"
              v-model="employee.phone"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              required
              v-model="employee.nid"
              label="National ID "
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

          <v-col cols="12" sm="6">
            <v-autocomplete
              label="Role "
              v-model="employee.role"
              variant="underlined"
              :readonly="dis === true"
              :items="roles"
              item-title="title"
              return-object
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" sm="6"
            ><v-textarea
              :clearable="dis === false"
              label="Note"
              v-model="employee.note"
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
        v-bind:data="properties"
        v-bind:header="headers.employee_hand_header"
        v-bind:panelname="'properties'"
        v-bind:openedtitle="openedtitle"
        v-bind:closedtitle="this.employee.name"
        v-bind:link="link_property"
        @clicked="onClickChild_property"
        @appended="property_append"
      />
      <paneltable
        v-bind:data="materials"
        v-bind:header="headers.employee_hand_header"
        v-bind:panelname="'materials'"
        v-bind:openedtitle="openedtitle1"
        v-bind:closedtitle="this.employee.name"
        v-bind:link="link_material"
        @clicked="onClickChild_material"
        @appended="material_append"
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
    @saveclicked="save"
    @submit="submit"
  />
</template>

<script>
import paneltable from "../../components/paneltable.vue";
import popuptest from "../../components/popuptest.vue";
import check from "../../components/checkpopup.vue";
import history from "../../components/historypopup.vue";
import axios from "axios";

import sweetalert from "sweetalert";
import { useheaders } from "../../stores/headers";
import swal from "sweetalert";

export default {
  components: { paneltable, popuptest, check, history },
  //test
  data: () => ({
    content:
      "Incorrect changes can lead to system problems in the future. Are you sure about the changes you made?",
    title: "are you sure ? ",
    link_material: {
      get: "/api/material/",
    },
    link_property: { get: "/api/custody/" },
    isdisabled: true,
    dialog: false,
    dialog1: false,
    dialog2: false,
    openedtitle: "properties with",
    openedtitle1: "materials with",
    dis: true,
    isEditing: false,
    employee: {
      img: "https://cdn.vuetifyjs.com/images/parallax/material.jpg",
    },
    orgemployee: {},
    roles: [],
    materials: [],
    properties: [],
    historytype: "",
    obj: {},
    historyobject: {},
  }),
  created() {
    //GEtet route here
    this.employeeload();
    this.materialsload();
    this.propertiesload();
    axios.get("/api/role/").then((response) => {
      this.roles = response.data.data;
    });
  },
  setup() {
    const headers = useheaders();

    return {
      headers,
    };
  },
  methods: {
    employeeload() {
      axios.get("/api/employee/" + this.$route.params.id).then((response) => {
        // console.log(response);
        if (response.data.errors) {
          swal("error", response.data.errors[0].msg, "error");
        } else {
          this.orgemployee = response.data.data;
          this.clone();
        }
      });
    },
    materialsload() {
      axios
        .get("/api/materialEmployee/employee/" + this.$route.params.id)
        .then((response) => {
          console.log(response.data.data);
          this.materials = [];
          response.data.data.forEach((element) => {
            const x = {};
            x._id = element._id;
            x.history = element.history;
            x.lastDate = element.lastDate;
            x.totalQuantity = element.totalQuantity;
            x.name = element.material.name;
            x.material_id = element.material._id;
            // console.log(x);
            this.materials.push(x);
          });
        });
    },
    propertiesload() {
      axios
        .get("/api/custodyEmployee/employee/" + this.$route.params.id)
        .then((response) => {
          this.properties = [];
          response.data.data.forEach((element) => {
            const x = {};
            x._id = element._id;
            x.history = element.history;
            x.lastDate = element.lastDate;
            x.totalQuantity = element.totalQuantity;
            x.name = element.custody.name;
            x.property_id = element.custody._id;

            // console.log(x);
            this.properties.push(x);
          });
        });
    },
    material_append(value) {
      axios
        .post("/api/materialEmployee/assign", {
          material: value._id,
          employee: this.orgemployee._id,
          quantity: value.qty,
          operation: "assign",
        })
        .then((response) => {
          if (response.data.errors) {
            swal("error", response.data.errors[0].msg, "error");
          } else {
            swal("success", "yayyy", "success");
            this.materialsload();
          }
        });
    },
    property_append(value) {
      axios
        .post("/api/custodyEmployee/assign", {
          custody: value._id,
          employee: this.orgemployee._id,
          quantity: value.qty,
          operation: "assign",
        })
        .then((response) => {
          if (response.data.errors) {
            swal("error", response.data.errors[0].msg, "error");
          } else {
            swal("success", "yayyy", "success");
            this.propertiesload();
          }
        });
    },
    onClickChild_property(value) {
      // console.log(value);
      this.historytype = "property";
      this.historyview(value._id);
    },
    onClickChild_material(value) {
      this.historytype = "material";

      this.historyview(value._id);
    },
    submit(value) {
      //Post route here
      console.log(value);
      const x = {};
      x.employee = this.$route.params.id;
      x.quantity = value.qty;
      x.operation = value.operation;
      if (this.historytype === "property") {
        x.custody = value._id;
        axios
          .post("/api/custodyEmployee/assign", {
            custody: x.custody,
            employee: x.employee,
            quantity: x.quantity,
            operation: x.operation,
          })
          .then((response) => {
            if (response.data.errors) {
              swal("error", response.data.errors[0].msg, "errors");
            } else {
              swal("success", "yayyy", "success");
              this.propertiesload();
              this.dialog2 = false;
            }
          });
      } else {
        x.material = value._id;
        axios
          .post("/api/materialEmployee/assign", {
            material: x.material,
            employee: x.employee,
            quantity: x.quantity,
            operation: x.operation,
          })
          .then((response) => {
            if (response.data.errors) {
              swal("error", response.data.errors[0].msg, "errors");
            } else {
              swal("success", "yayyy", "success");
              this.materialsload();
              this.dialog2 = false;
            }
          });
      }
      console.log(x);
    },

    check() {
      this.dialog = false;
      this.dialog1 = true;
    },
    historyview(id) {
      console.log(id);
      console.log(this.historytype);
      this.historyobject.title = this.historytype + " history";
      if (this.historytype === "property") {
        this.obj = this.properties.find((m) => m._id === id);
        this.historyobject._id = this.obj.property_id;
      } else {
        this.obj = this.materials.find((m) => m._id === id);
        this.historyobject._id = this.obj.material_id;
      }
      this.historyobject.id = this.obj._id;
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
          "this change is critical and must double check it :  employee National id is : ( " +
          this.employee.nid +
          " )";
        this.dialog = !this.dialog;
      }
    },
    clone() {
      this.employee.id = this.orgemployee._id;
      this.employee.name = this.orgemployee.name;
      this.employee.code = this.orgemployee.code;
      this.employee.img = this.orgemployee.img;
      this.employee.nid = this.orgemployee.NID;
      this.employee.role = this.orgemployee.role;
      this.employee.note = this.orgemployee.note;
      this.employee.phone = this.orgemployee.phoneNo;
      this.employee.properties = this.orgemployee.currentCustodies;
      this.employee.materials = this.orgemployee.materials;
    },
    cancel() {
      this.dialog = false;
      this.dialog1 = false;
      this.dis = !this.dis;
      this.isEditing = false;

      this.employee.name = this.orgemployee.name;
      this.employee.code = this.orgemployee.code;
      this.employee.img = this.orgemployee.img;
      this.employee.nid = this.orgemployee.NID;
      this.employee.role = this.orgemployee.role;
      this.employee.note = this.orgemployee.note;
      this.employee.phone = this.orgemployee.phoneNo;
      this.employee.properties = this.orgemployee.currentCustodies;
      this.content =
        "Incorrect changes can lead to system problems in the future. Are you sure about the changes you made?";
    },
    save() {
      this.dis = !this.dis;
      this.dialog = false;
      this.isEditing = false;
      this.dialog1 = false;
      axios
        .patch("/api/employee/" + this.$route.params.id, {
          name: this.employee.name,
          code: this.employee.code,
          "role.title": this.employee.role.title,
          "role.num": this.employee.role.number,
          phoneNo: this.employee.phone,
          NID: this.employee.nid,
          note: this.employee.note,
        })
        .then((response) => {
          if (response.data.errors) {
            swal("error", response.data.errors[0].msg, "error");
          } else {
            this.employeeload();
            this.content =
              "Incorrect changes can lead to system problems in the future. Are you sure about the changes you made?";
          }
        });
    },
  },
};
</script>
