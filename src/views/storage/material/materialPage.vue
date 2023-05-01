<template>
  <v-card class="mx-auto" elevation="2" style="width: 100%"
    ><v-row
      ><v-col cols="3" sm="2"
        ><v-img
          class="bg-white"
          width="300"
          :aspect-ratio="1"
          :src="material.img"
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
              :items="['Supervisor', 'material']"
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
        @clicked="onClickChild_property"
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
import paneltable from "../../../components/paneltable.vue";
import popuptest from "../../../components/popuptest.vue";
import check from "../../../components/checkpopup.vue";
import history from "../../../components/historypopup.vue";
import axios from "axios";

import sweetalert from "sweetalert";
import { useheaders } from "../../../stores/headers";

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
    openedtitle: "Employees have",
    dis: true,
    isEditing: false,
    material: {
      img: "/arkan_logo-no-text.png",
      role: {
        title: "aaa",
        num: 1,
      },
      _id: "644f5e907b81fa9ea02ba947",
      name: "material 1",
      quantity: 1000,
      available: 1000,
      max: 1000,
      min: 10,
      type: "type 2",
      unit: "a",
      createdAt: "2023-05-01T06:39:12.976Z",
      updatedAt: "2023-05-01T06:39:12.976Z",
    },
    orgmaterial: {},
    employees: [
      { name: "tomy", _id: "12", totalQuantity: "12", lastDate: "2023/4/4" },
    ],
    historytype: "",
    obj: {},
    historyobject: {},
  }),
  created() {
    //GEtet route here
    // axios.get("/api/material/" + this.$route.params.id).then((response) => {
    //   console.log(response);
    //   if (response.data.errors) {
    //     swal("error", response.data.errors[0].msg, "error");
    //   } else {
    //     this.orgmaterial = response.data.data;
    //     axios
    //       .get("/api/materialEmployee/material/" + this.$route.params.id)
    //       .then((response) => {
    //         this.orgmaterial.employees = response.data.data;
    //         console.log(this.orgmaterial);
    //         this.clone();
    //       });
    //   }
    // });
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
          "role.title": this.material.role.title,
          "role.num": 1,
          type: this.material.type,
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
            swal("success", "yayy", "success");
          }
        });
    },
  },
};
</script>
