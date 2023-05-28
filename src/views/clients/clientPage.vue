<template>
  <v-card class="mx-auto" elevation="2" style="width: 100%"
    ><v-row>
      <v-col cols="12" align="center" class="text-h4"> clients </v-col
      ><v-col cols="3" sm="2"
        ><v-img
          class="bg-white"
          width="300"
          :aspect-ratio="1"
          :src="client.image ? client.image.data : '/arkan_logo-no-text.png'"
          cover
        ></v-img></v-col
      ><v-col cols="9" sm="10">
        <v-row>
          <v-col cols="12">
            <v-text-field
              label="Name "
              required
              :readonly="dis === true"
              v-model="client.name"
              variant="underlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6" lg="3">
            <v-text-field
              required
              label="state "
              :readonly="dis === true"
              v-model="client.state"
              variant="underlined"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6" lg="3">
            <v-text-field
              required
              v-model="client.phoneNo"
              label="phoneNo "
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

          <v-col cols="12" sm="6"
            ><v-textarea
              :clearable="dis === false"
              label="Note"
              v-model="client.note"
              :readonly="dis === true"
              prepend-icon="mdi-note-text-outline"
            ></v-textarea>
          </v-col>
          <v-col cols="12" sm="6"
            ><v-textarea
              :clearable="dis === false"
              label="address"
              v-model="client.address"
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
        v-bind:data="materials"
        v-bind:header="headers.material_hand_header"
        v-bind:panelname="'materials'"
        v-bind:openedtitle="openedtitle"
        v-bind:closedtitle="this.client.name"
        v-bind:link="link"
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
    @saveclicked="savenote"
    @submit="submit"
  />
</template>

<script>
import paneltable from "../../components/paneltable.vue";
import popuptest from "../../components/popuptest.vue";
import check from "../../components/checkpopup.vue";
import history from "../../components/historypopup.vue";
import axios from "axios";

import swal from "sweetalert";
import { useheaders } from "../../stores/headers";

export default {
  components: { paneltable, popuptest, check, history },

  data: () => ({
    content:
      "Incorrect changes can lead to system problems in the future. Are you sure about the changes you made?",
    title: "are you sure ? ",
    link: { get: "/api/material/" },
    isdisabled: true,
    dialog: false,
    dialog1: false,
    dialog2: false,
    openedtitle: "materials supplied by ",
    dis: true,
    isEditing: false,
    client: {
      img: "/arkan_logo-no-text.png",
    },
    orgclient: {},
    materials: [],
    historytype: "",
    obj: {},
    historyobject: {},
  }),
  created() {
    //GEtet route here
    this.client_load();
    // this.materials_client_load();
  },
  setup() {
    const headers = useheaders();

    return {
      headers,
    };
  },
  methods: {
    client_load() {
      axios.get("/api/client/" + this.$route.params.id).then((response) => {
        console.log(response);
        this.orgclient = [];
        if (response.data.errors) {
          swal("error", response.data.errors[0].msg, "error");
        } else {
          this.orgclient = response.data.data;
          this.clone();
        }
      });
    },
    materials_client_load() {
      axios
        .get("/api/clientmaterial/client/" + this.$route.params.id)
        .then((response) => {
          this.materials = [];
          response.data.data.forEach((element) => {
            const x = {};
            x.id = element._id;
            x.totalphoneNo = element.totalphoneNo;
            x.lastDate = element.lastDate;
            x.history = element.history;
            x.name = element.material.name;
            x.material_id = element.material._id;
            this.materials.push(x);
          });
          // console.log(this.materials);
        });
    },
    onClickChild_material(value) {
      // console.log(value);
      this.historytype = "material";
      this.historyview(value._id);
    },
    material_append(value) {
      axios
        .post("/api/clientmaterial/assign", {
          client: this.orgclient._id,
          material: value._id,
          phoneNo: value.qty,
          operation: "assign",
        })
        .then((response) => {
          if (response.data.errors) {
            swal("error", response.data.errors[0].msg, "error");
          } else {
            swal("success", "yayyy", "success");
            this.materials_client_load();
          }
        });
    },
    submit(value) {
      //Post route here
      console.log(value);
      const x = {};
      x.client = this.$route.params.id;
      x.phoneNo = value.qty;
      x.operation = value.operation;
      if (this.historytype === "material") {
        x.material = value._id;
        axios
          .post("/api/clientmaterial/assign", {
            client: x.client,
            material: x.material,
            phoneNo: x.phoneNo,
            operation: x.operation,
          })
          .then((response) => {
            if (response.data.errors) {
              swal("error", response.data.errors[0].msg, "errors");
            } else {
              swal("success", "yayyy", "success");
              this.materials_client_load();
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
        this.clients.find((m) => m._id === value.id).note = value.note;
      }
    },
    check() {
      this.dialog = false;
      this.dialog1 = true;
    },
    historyview(id) {
      // console.log(this.propfind(id));

      this.historyobject.title = this.historytype + " history";
      if (this.historytype === "material") {
        this.obj = this.materials.find((m) => m._id === id);
        this.historyobject._id = this.obj.material_id;
      } else {
        this.obj = this.clients.find((m) => m._id === id);
      }
      this.historyobject.id = this.obj.id;
      this.historyobject.name = this.obj.name;
      this.historyobject.data = this.obj.history;
      this.historyobject.qty = this.obj.totalphoneNo;
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
          "this change is critical and must double check it :  client phoneNo is : ( " +
          this.client.phoneNo +
          " )";
        this.dialog = !this.dialog;
      }
    },
    clone() {
      this.client.id = this.orgclient._id;
      this.client.name = this.orgclient.name;
      this.client.state = this.orgclient.state;
      this.client.image = this.orgclient.image;
      this.client.phoneNo = this.orgclient.phoneNo;
      this.client.note = this.orgclient.note;
      this.client.address = this.orgclient.address;
    },
    cancel() {
      this.dialog = false;
      this.dialog1 = false;
      this.dis = !this.dis;
      this.isEditing = false;

      this.clone();
    },
    save() {
      this.dis = !this.dis;
      this.dialog = false;
      this.isEditing = false;
      this.dialog1 = false;
      // this.clients.client.name = this.client.name;
      // this.clients.client.code = this.client.code;
      // this.clients.client.img = this.client.img;
      // this.clients.client.nid = this.client.nid;
      // this.clients.client.role = this.client.role;
      // this.clients.client.note = this.client.note;
      // this.clients.client.phone = this.client.phone;

      //save route here
      axios
        .patch("/api/client/" + this.$route.params.id, {
          name: this.client.name,
          note: this.client.note,
          address: this.client.address,
          phoneNo: this.client.phoneNo,
          state: this.client.state,
        })
        .then((response) => {
          if (response.data.errors) {
            swal("error", response.data.errors[0].msg, "error");
          } else {
            swal("success", "yayy", "success");
            this.client_load();
          }
        });
    },
    deletee() {
      swal({
        title: "Are you sure?",
        text: "Are you sure that you want to delete this client?",
        icon: "warning",
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          axios
            .delete("/api/client/" + this.$route.params.id)
            .then((response) => {
              if (response.data.errors) {
                swal("error", response.data.errors[0].msg, "error");
              } else {
                swal("success", "client deleted suuccessfully", "success").then(
                  () => {
                    this.$router.push({ path: "/client/all" });
                  }
                );
              }
            });
        }
      });
    },
  },
};
</script>
