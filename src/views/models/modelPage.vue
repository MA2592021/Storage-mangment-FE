<template>
  <v-card class="mx-auto" elevation="2" style="width: 100%"
    ><v-row
      ><v-col cols="3" sm="2"
        ><v-img
          class="bg-white"
          width="300"
          :aspect-ratio="1"
          :src="model.img"
          cover
        ></v-img></v-col
      ><v-col cols="9" sm="10">
        <v-row>
          <v-col cols="12">
            <v-text-field
              label="Name "
              required
              :readonly="dis === true"
              v-model="model.name"
              variant="underlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-autocomplete
              v-model="model.sizes"
              :items="sizes"
              chips
              multiple
              label="sizes"
              item-title="name"
              :readonly="dis"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-autocomplete
              v-model="model.colors"
              :items="colors"
              chips
              multiple
              label="colors"
              item-title="name"
              :readonly="dis"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              required
              v-model="model.nid"
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
              v-model="model.role"
              variant="underlined"
              :readonly="dis === true"
              :items="['Supervisor', 'model']"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" sm="6"
            ><v-textarea
              :clearable="dis === false"
              label="Note"
              v-model="model.note"
              :readonly="dis"
              prepend-inner-icon="mdi-note-text-outline"
            ></v-textarea>
          </v-col>
          <v-col cols="12" sm="6"
            ><v-textarea
              :clearable="dis === false"
              label="details"
              v-model="model.details"
              :readonly="dis"
              prepend-inner-icon="mdi-note-text-outline"
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
        v-bind:header="headers.model_hand_header"
        v-bind:panelname="'properties'"
        v-bind:openedtitle="openedtitle"
        v-bind:closedtitle="this.model.name"
        v-bind:link="link"
        @clicked="onClickChild_property"
      />
      <paneltable
        v-bind:data="materials"
        v-bind:header="headers.model_hand_header"
        v-bind:panelname="'materials'"
        v-bind:openedtitle="openedtitle1"
        v-bind:closedtitle="this.model.name"
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
    model: {},
    orgmodel: {
      name: "amir",
      sizes: [
        { name: "XL", code: 65 },
        { name: "S", code: 44 },
        { name: "L", code: 55 },
      ],
      colors: [
        { name: "red", code: 65 },
        { name: "white", code: 44 },
        { name: "black", code: 55 },
      ],
      role: "suprervisor",
      note: "lailo lailo",

      details: "any details heree",
      img: "https://cdn.vuetifyjs.com/images/parallax/material.jpg",
      nid: "12312312313",
    },

    sizes: [
      { name: "XL", code: 65 },
      { name: "S", code: 44 },
      { name: "L", code: 55 },
      { name: "M", code: 55 },
      { name: "XS", code: 55 },
    ],
    colors: [
      { name: "red", code: 65 },
      { name: "white", code: 44 },
      { name: "black", code: 55 },
      { name: "off white", code: 55 },
      { name: "on white lolllll", code: 55 },
    ],
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
    this.clone();
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
          "this change is critical and must double check it :  model National id is : ( " +
          this.model.nid +
          " )";
        this.dialog = !this.dialog;
      }
    },
    clone() {
      this.model.name = this.orgmodel.name;
      this.model.sizes = this.orgmodel.sizes;
      this.model.img = this.orgmodel.img;
      this.model.colors = this.orgmodel.colors;
      this.model.role = this.orgmodel.role;
      this.model.note = this.orgmodel.note;
      this.model.details = this.orgmodel.details;
    },
    cancel() {
      this.dialog = false;
      this.dialog1 = false;
      this.dis = !this.dis;
      this.isEditing = false;

      this.model.name = this.orgmodel.name;
      this.model.sizes = this.orgmodel.sizes;
      this.model.img = this.orgmodel.img;
      this.model.colors = this.orgmodel.colors;
      this.model.role = this.orgmodel.role;
      this.model.note = this.orgmodel.note;
      this.model.details = this.orgmodel.details;
      this.content =
        "Incorrect changes can lead to system problems in the future. Are you sure about the changes you made?";
    },
    save() {
      this.dis = !this.dis;
      this.dialog = false;
      this.isEditing = false;
      this.dialog1 = false;
      // this.models.model.name = this.model.name;
      // this.models.model.code = this.model.code;
      // this.models.model.img = this.model.img;
      // this.models.model.nid = this.model.nid;
      // this.models.model.role = this.model.role;
      // this.models.model.note = this.model.note;
      // this.models.model.phone = this.model.phone;

      //save route here
    },
  },
};
</script>
