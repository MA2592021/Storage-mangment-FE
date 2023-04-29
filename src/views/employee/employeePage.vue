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
        v-bind:type="'1'"
        v-bind:panelname="'properties'"
        v-bind:openedtitle="openedtitle"
        v-bind:closedtitle="this.employee.name"
        v-bind:link="link"
        @clicked="onClickChild"
      />
      <paneltable
        v-bind:type="'2'"
        v-bind:panelname="'materials'"
        v-bind:openedtitle="openedtitle1"
        v-bind:closedtitle="this.employee.name"
        v-bind:link="link"
        @clicked="onClickChild"
      />
    </v-expansion-panels>
  </v-card>
  <popuptest
    v-model="dialog"
    v-bing:title="title"
    v-bind:content="content"
    @save="check()"
    @close="cancel()"
  />
  <check v-model="dialog1" @checked="save()" @closed="cancel()" />
  <history
    v-model="dialog2"
    v-bind:title="historytype"
    @close="dialog2 = !dialog2"
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
import { usetable } from "../../stores/tabledata";
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
  }),
  created() {
    this.boot();
    this.clone();
    // console.log(this.employee);
    this.table.data = this.properties.data;
    this.table.headers = this.properties.headers;
    this.table.data1 = this.materials.data;
    this.table.headers1 = this.materials.headers;
    // console.log(this.table.data);
    // console.log(this.table.data1);
  },
  setup() {
    const employees = useemployee();
    const properties = usepropemp();
    const materials = usematemp();
    const table = usetable();
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
      table,
    };
  },
  methods: {
    onClickChild(value) {
      value.property
        ? (this.historytype = "property")
        : (this.historytype = "material");
      this.historyview(value.custody_id);
    },
    check() {
      this.dialog = false;
      this.dialog1 = true;
    },
    historyview(id) {
      if (this.historytype === "property") {
        this.table.data2 = this.propfind(id);
        this.table.headers2 = this.properties.historyheaders;
        // console.log(this.table.data2);
      } else {
        this.table.data2 = this.matfind(id);
        this.table.headers2 = this.materials.historyheaders;
      }
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
      this.content =
        "Incorrect changes can lead to system problems in the future. Are you sure about the changes you made?";
    },
    boot() {
      this.employees.employee = this.empfind(this.$route.params.id);
    },
  },
};
</script>
