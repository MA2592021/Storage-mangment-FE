<template>
  <v-card class="mx-auto" elevation="2" style="width: 100%"
    ><v-row
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
              :items="['Supervisor', 'Employee']"
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
        v-bind:data="employee.properties"
        v-bind:header="headers.employee_hand_header"
        v-bind:panelname="'properties'"
        v-bind:openedtitle="openedtitle"
        v-bind:closedtitle="this.employee.name"
        v-bind:link="link"
        @clicked="onClickChild_property"
      />
      <paneltable
        v-bind:data="employee.materials"
        v-bind:header="headers.employee_hand_header"
        v-bind:panelname="'materials'"
        v-bind:openedtitle="openedtitle1"
        v-bind:closedtitle="this.employee.name"
        v-bind:link="link"
        @clicked="onClickChild_material"
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
    @submit="submit()"
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

export default {
  components: { paneltable, popuptest, check, history },

  data: () => ({
    content:
      "Incorrect changes can lead to system problems in the future. Are you sure about the changes you made?",
    title: "are you sure ? ",
    link: "",
    isdisabled: true,
    dialog: false,
    dialog1: false,
    dialog2: false,
    openedtitle: "properties with",
    openedtitle1: "materials with",
    dis: true,
    isEditing: false,
    employee: {},
    orgemployee: {},
    properties: [
      {
        _id: "1",
        name: "ma2s",
        totalQuantity: "14",
        note: "test 1",
        lastDate: "2023/4/22",
        history: [
          { quantity: 12, date: "2023/4/23", op: "add" },
          { quantity: 2, date: "2023/4/25", op: "sub" },
          { quantity: 4, date: "2023/4/27", op: "add" },
        ],
      },
      {
        _id: "2",
        name: "ma2sat",
        totalQuantity: "4",
        note: "test 2",
        lastDate: "2023/4/22",
        history: [
          { quantity: 12, date: "2023/4/23", op: "add" },
          { quantity: 2, date: "2023/4/25", op: "sub" },
          { quantity: 4, date: "2023/4/27", op: "add" },
        ],
      },
      {
        _id: "12",
        name: "mastra",
        totalQuantity: "2",
        note: "test 3 ",
        lastDate: "2023/4/22",
        history: [
          { quantity: 12, date: "2023/4/23", op: "add" },
          { quantity: 2, date: "2023/4/25", op: "sub" },
          { quantity: 4, date: "2023/4/27", op: "add" },
        ],
      },
    ],
    materials: [
      {
        _id: "1",
        name: "white 2omash",
        totalQuantity: "14",
        note: "teso tesotes testo tesot e",
        lastDate: "2023/4/22",
        history: [
          { quantity: 12, date: "2023/4/23", op: "add" },
          { quantity: 2, date: "2023/4/25", op: "sub" },
          { quantity: 4, date: "2023/4/27", op: "add" },
        ],
      },
      {
        _id: "2",
        name: "black 2omash",
        totalQuantity: "4",
        note: "teso tesotes testo tesot e",
        lastDate: "2023/4/22",
        history: [
          { quantity: 12, date: "2023/4/23", op: "add" },
          { quantity: 2, date: "2023/4/25", op: "sub" },
          { quantity: 4, date: "2023/4/27", op: "add" },
        ],
      },
      {
        _id: "12",
        name: "zorar",
        totalQuantity: "2",
        note: "teso tesotes testo tesot e",
        lastDate: "2023/4/22",
        history: [
          { quantity: 12, date: "2023/4/23", op: "add" },
          { quantity: 2, date: "2023/4/25", op: "sub" },
          { quantity: 4, date: "2023/4/27", op: "add" },
        ],
      },
    ],
    historytype: "",
    obj: {},
    historyobject: {},
  }),
  created() {
    //GEtet route here
    axios.get("/api/employee/" + this.$route.params.id).then((response) => {
      console.log(response);
      if (response.data.errors) {
        swal("error", response.data.errors[0].msg, "error");
      } else {
        this.orgemployee = response.data.data;
        console.log(this.orgemployee.name);
        axios
          .get("/api/materialEmployee/employee/" + this.$route.params.id)
          .then((response) => {
            this.orgemployee.materials = response.data.date;
            this.clone();
          });
      }
    });
  },
  setup() {
    const headers = useheaders();

    return {
      headers,
    };
  },
  methods: {
    onClickChild_property(value) {
      // console.log(value);
      this.historytype = "property";
      this.historyview(value._id);
    },
    onClickChild_material(value) {
      this.historytype = "material";

      this.historyview(value._id);
    },
    submit() {
      //Post route here
    },
    savenote(value) {
      console.log(value);
      if (this.historytype === "property") {
        this.properties.find((m) => m._id === value.id).note = value.note;
        console.log(this.properties.find((m) => m._id === value.id).note);
      } else {
        this.materials.find((m) => m._id === value.id).note = value.note;
      }
    },
    check() {
      this.dialog = false;
      this.dialog1 = true;
    },
    historyview(id) {
      // console.log(this.propfind(id));

      this.historyobject.title = this.historytype + " history";
      if (this.historytype === "property") {
        this.obj = this.properties.find((m) => m._id === id);
      } else {
        this.obj = this.materials.find((m) => m._id === id);
      }

      this.historyobject.id = this.obj._id;
      this.historyobject.name = this.obj.name;
      this.historyobject.data = this.obj.history;
      this.historyobject.qty = this.obj.totalQuantity;
      this.historyobject.date = this.obj.lastDate;
      this.historyobject.note = this.obj.note;
      this.historyobject.header = this.headers.historyheader;
      this.historyobject.data = this.obj.history;
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
      // this.employees.employee.name = this.employee.name;
      // this.employees.employee.code = this.employee.code;
      // this.employees.employee.img = this.employee.img;
      // this.employees.employee.nid = this.employee.nid;
      // this.employees.employee.role = this.employee.role;
      // this.employees.employee.note = this.employee.note;
      // this.employees.employee.phone = this.employee.phone;

      //save route here
    },
  },
};
</script>
