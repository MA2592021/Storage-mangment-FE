<template>
  <v-card class="mx-auto" elevation="2" style="width: 100%"
    ><v-row class="ma-3"
      ><v-col cols="12" align="center" class="text-h4"> requests </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          label="Name "
          required
          :readonly="dis === true"
          v-model="request.name"
          variant="underlined"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="3" md="3">
        <v-text-field
          label="status "
          required
          readonly
          v-model="request.status"
          variant="underlined"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="3" md="3">
        <v-text-field
          label="created at "
          required
          readonly
          v-model="request.time"
          variant="underlined"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6"
        ><v-textarea
          :clearable="dis === false"
          label="details"
          v-model="request.details"
          :readonly="dis === true"
          prepend-icon="mdi-note-text-outline"
        ></v-textarea>
      </v-col>
      <v-col cols="12" sm="6"
        ><v-textarea
          :clearable="dis === false"
          label="Note"
          v-model="request.note"
          :readonly="dis === true"
          prepend-icon="mdi-note-text-outline"
        ></v-textarea>
      </v-col>
      <v-col cols="12"
        ><v-timeline side="end" align="start">
          <v-timeline-item
            :dot-color="
              h.state === 'Approved'
                ? 'teal-lighten-3'
                : h.state === 'Delivered'
                ? 'green'
                : 'pink'
            "
            size="small"
            v-for="h in request.history"
            :key="h"
          >
            <div class="d-flex">
              <strong class="me-4">{{ moment(h.date) }}</strong>
              <div>
                <strong>{{ h.state }}</strong>
              </div>
            </div>
          </v-timeline-item>
        </v-timeline></v-col
      >
    </v-row>
    <v-card-actions class="mx-auto">
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
        prepend-icon="mdi-check-decagram"
        color="teal-lighten-3"
        @click="dialog = !dialog"
      >
        Approve
      </v-btn>
      <v-btn
        class="ml-auto"
        :disabled="dis === true || isEditing === true"
        prepend-icon="mdi-cash-marker"
        color="green"
        @click="dialog = !dialog"
      >
        deliverd
      </v-btn>
      <v-btn
        class="ml-auto"
        :disabled="dis === true || isEditing === true"
        prepend-icon="mdi-package-check"
        color="green"
        @click="dialog = !dialog"
      >
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
  <v-card class="mt-3" style="width: 100%">
    <requestpanel
      v-bind:reqmaterial="request.materials"
      v-bind:reqproperty="request.properties"
      v-bind:closedtitle="closedtitle"
      v-bind:panelname="'inclusions'"
      v-bind:name="request.name"
      @material="appendmaterial"
      @property="appendproperty"
    />
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
</template>

<script>
import paneltable from "../../components/paneltable.vue";
import popuptest from "../../components/popuptest.vue";
import check from "../../components/checkpopup.vue";
import requestpanel from "../../components/requestpanel.vue";
import axios from "axios";
import moment from "moment";
import { useheaders } from "../../stores/headers";
import swal from "sweetalert";

export default {
  components: { paneltable, popuptest, check, requestpanel },
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
    closedtitle: "properties and material in",
    dis: true,
    isEditing: false,
    request: {},
    orgrequest: {},
    roles: [],
    materials: [],
    properties: [],
    historytype: "",
    obj: {},
    historyobject: {},
  }),
  created() {
    //GEtet route here
    this.requestload();
  },
  setup() {
    const headers = useheaders();

    return {
      headers,
    };
  },
  methods: {
    moment(date) {
      return moment(date).calendar();
    },
    requestload() {
      axios.get("/api/buyrequest/" + this.$route.params.id).then((response) => {
        // console.log(response);
        if (response.data.errors) {
          swal("error", response.data.errors[0].msg, "error");
        } else {
          const x = {};
          x._id = response.data.data._id;
          x.status =
            response.data.data.history[
              response.data.data.history.length - 1
            ].state;
          x.name = response.data.data.name;
          x.time = moment(response.data.data.createdAt).calendar();
          x.history = response.data.data.history;
          x.materials = response.data.data.materials;
          x.properties = response.data.data.custodies;
          this.orgrequest = x;

          this.clone();
        }
      });
    },
    appendproperty(value) {
      // axios.patch('/api/buyRequest/materials/add/'+this.$route.params.id,{
      //   materials:[

      //   ]
      // })
      console.log("material", value);
    },
    appendmaterial(value) {
      // axios.patch('/api/buyRequest/materials/add/'+this.$route.params.id,{
      //   materials:[

      //   ]
      // })
      console.log("property", value);
    },
    material_append(value) {
      const x = {};
      x.material = value._id;
      x.request = this.orgrequest._id;
      x.quantity = value.qty;
      x.operation = "assign";
      this.material_operations(x);
    },
    property_append(value) {
      const x = {};
      x.custody = value._id;
      x.request = this.orgrequest._id;
      x.quantity = value.qty;
      x.operation = "assign";
      this.property_operations(x);
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
      x.request = this.$route.params.id;
      x.quantity = value.qty;
      x.operation = value.operation;
      if (this.historytype === "property") {
        x.custody = value._id;
        this.property_operations(x);
      } else {
        x.material = value._id;
        this.material_operations(x);
      }
      // console.log(x);
    },
    property_operations(obj) {
      if (obj.operation === "assign") {
        axios
          .post("/api/custodyrequest/assign", {
            custody: obj.custody,
            request: obj.request,
            quantity: obj.quantity,
            operation: obj.operation,
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
        axios
          .patch("/api/custodyrequest/back", {
            custody: obj.custody,
            request: obj.request,
            quantity: obj.quantity,
            operation: obj.operation,
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
      }
    },
    material_operations(obj) {
      if (obj.operation === "assign") {
        axios
          .post("/api/materialrequest/assign", {
            material: obj.material,
            request: obj.request,
            quantity: obj.quantity,
            operation: obj.operation,
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
      } else {
        axios
          .patch("/api/materialrequest/back", {
            material: obj.material,
            request: obj.request,
            quantity: obj.quantity,
            operation: obj.operation,
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
    savenote(value) {
      if (this.historytype === "material") {
        axios
          .patch("/api/materialrequest/note/" + value.id, {
            note: value.note,
          })
          .then(swal("success", "yayyy", "success"))
          .then(() => {
            this.dialog2 = false;
            this.materialsload();
          });
      } else {
        axios
          .patch("/api/custodyrequest/note/" + value.id, {
            note: value.note,
          })
          .then(swal("success", "yayyy", "success"))
          .then(() => {
            this.dialog2 = false;
            this.propertiesload();
          });
      }
    },
    criticalchange() {
      if (this.isEditing === false) {
        this.isEditing = !this.isEditing;
      } else {
        this.content =
          "this change is critical and must double check it :  request National id is : ( " +
          this.request.nid +
          " )";
        this.dialog = !this.dialog;
      }
    },
    clone() {
      this.request.id = this.orgrequest._id;
      this.request.name = this.orgrequest.name;
      this.request.details = this.orgrequest.code;
      this.request.history = this.orgrequest.history;
      this.request.materials = this.orgrequest.materials;
      this.request.properties = this.orgrequest.properties;
      this.request.note = this.orgrequest.note;
      this.request.status = this.orgrequest.status;
      this.request.time = this.orgrequest.time;
    },
    cancel() {
      this.dialog = false;
      this.dialog1 = false;
      this.dis = !this.dis;
      this.isEditing = false;

      this.request.name = this.orgrequest.name;
      this.request.code = this.orgrequest.code;
      this.request.img = this.orgrequest.img;
      this.request.nid = this.orgrequest.NID;
      this.request.role = this.orgrequest.role;
      this.request.note = this.orgrequest.note;
      this.request.phone = this.orgrequest.phoneNo;
      this.request.properties = this.orgrequest.currentCustodies;
      this.content =
        "Incorrect changes can lead to system problems in the future. Are you sure about the changes you made?";
    },
    save() {
      this.dis = !this.dis;
      this.dialog = false;
      this.isEditing = false;
      this.dialog1 = false;
      axios
        .patch("/api/request/" + this.$route.params.id, {
          name: this.request.name,
          code: this.request.code,
          "role.title": this.request.role.title,
          "role.num": this.request.role.number,
          phoneNo: this.request.phone,
          NID: this.request.nid,
          note: this.request.note,
        })
        .then((response) => {
          if (response.data.errors) {
            swal("error", response.data.errors[0].msg, "error");
          } else {
            this.requestload();
            this.content =
              "Incorrect changes can lead to system problems in the future. Are you sure about the changes you made?";
          }
        });
    },
    deletee() {
      swal({
        title: "Are you sure?",
        text: "Are you sure that you want to delete this request?",
        icon: "warning",
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          axios
            .delete("/api/request/" + this.$route.params.id)
            .then((response) => {
              if (response.data.errors) {
                swal("error", response.data.errors[0].msg, "error");
              } else {
                swal(
                  "success",
                  "request deleted suuccessfully",
                  "success"
                ).then(() => {
                  this.$router.push({ path: "/request/all" });
                });
              }
            });
        }
      });
    },
  },
};
</script>
