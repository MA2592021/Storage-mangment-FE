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
        v-bind:data="properties.data"
        v-bind:header="headers.employee_hand_header"
        v-bind:panelname="'properties'"
        v-bind:openedtitle="openedtitle"
        v-bind:closedtitle="this.employee.name"
        v-bind:link="link"
        @clicked="onClickChild_property"
      />
      <paneltable
        v-bind:data="materials.data"
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
    v-bing:title="title"
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
import { usematemp } from "../../stores/matemp";
import { usepropemp } from "../../stores/propemployee";
import { useemployee } from "../../stores/employees";
import { useheaders } from "../../stores/headers";
import { storeToRefs } from "pinia";

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
    historytype: "",
    obj: {},
    historyobject: {},
  }),
  created() {
    this.boot();
    this.clone();
  },
  setup() {
    const employees = useemployee();
    const properties = usepropemp();
    const materials = usematemp();
    const headers = useheaders();
    const { empfind } = storeToRefs(employees);
    const { matfind } = storeToRefs(materials);
    const { propfind } = storeToRefs(properties);
    return {
      propfind,
      matfind,
      employees,
      empfind,
      properties,
      materials,
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
      if (this.data.data2.property) {
        this.propfind(this.data.data2.custody_id).note = this.data.data2.note;
      } else {
        this.matfind(this.data.data2.material_id).note = this.data.data2.note;
      }
    },
    savenote(value) {
      console.log(value);
      if (this.historytype === "property") {
        this.propfind(value.id).note = value.note;
        console.log(this.propfind(value.id).note);
      } else {
        this.matfind(value.id).note = value.note;
      }
    },
    check() {
      this.dialog = false;
      this.dialog1 = true;
    },
    historyview(id) {
      // console.log(this.propfind(id));
      console.log(this.propfind(id));
      this.historyobject.title = this.historytype + " history";
      if (this.historytype === "property") {
        this.obj = this.propfind(id);
      } else {
        this.obj = this.matfind(id);
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
      this.employee.name = this.employees.employee.name;
      this.employee.code = this.employees.employee.code;
      this.employee.img = this.employees.employee.img;
      this.employee.nid = this.employees.employee.nid;
      this.employee.role = this.employees.employee.role;
      this.employee.note = this.employees.employee.note;
      this.employee.phone = this.employees.employee.phone;
    },
    cancel() {
      this.dialog = false;
      this.dialog1 = false;
      this.dis = !this.dis;
      this.isEditing = false;

      this.employee.name = this.employees.employee.name;
      this.employee.code = this.employees.employee.code;
      this.employee.img = this.employees.employee.img;
      this.employee.nid = this.employees.employee.nid;
      this.employee.role = this.employees.employee.role;
      this.employee.note = this.employees.employee.note;
      this.employee.phone = this.employees.employee.phone;
      this.content =
        "Incorrect changes can lead to system problems in the future. Are you sure about the changes you made?";
    },
    save() {
      this.dis = !this.dis;
      this.dialog = false;
      this.isEditing = false;
      this.dialog1 = false;
      this.employees.employee.name = this.employee.name;
      this.employees.employee.code = this.employee.code;
      this.employees.employee.img = this.employee.img;
      this.employees.employee.nid = this.employee.nid;
      this.employees.employee.role = this.employee.role;
      this.employees.employee.note = this.employee.note;
      this.employees.employee.phone = this.employee.phone;
    },
    boot() {
      this.employees.employee = this.empfind(this.$route.params.id);
    },
  },
};
</script>
