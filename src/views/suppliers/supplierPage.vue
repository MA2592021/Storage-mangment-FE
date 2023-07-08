<template>
  <v-card class="mx-auto" elevation="2" style="width: 100%"
    ><v-row>
      <v-col cols="12" align="center" class="text-h4"> Suppliers </v-col
      ><v-col cols="3" sm="2"
        ><v-img
          class="bg-white"
          width="300"
          :aspect-ratio="1"
          :src="
            supplier.image ? supplier.image.data : '/arkan_logo-no-text.png'
          "
          cover
        ></v-img></v-col
      ><v-col cols="9" sm="10">
        <v-row>
          <v-col cols="12">
            <v-text-field
              :label="$t('name')"
              required
              :readonly="dis === true"
              v-model="supplier.name"
              variant="underlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6" lg="3">
            <v-text-field
              required
              :label="$t('state')"
              :readonly="dis === true"
              v-model="supplier.state"
              variant="underlined"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6" lg="3">
            <v-text-field
              required
              v-model="supplier.phoneNo"
              :label="$t('phone')"
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
              :label="$t('note')"
              v-model="supplier.note"
              :readonly="dis === true"
              prepend-icon="mdi-note-text-outline"
            ></v-textarea>
          </v-col>
          <v-col cols="12" sm="6"
            ><v-textarea
              :clearable="dis === false"
              :label="$t('address')"
              v-model="supplier.address"
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
        {{ dis ? $t("edit") : $t("cancel") }}
      </v-btn>
      <v-btn
        class="ml-auto text-red"
        @click="deletee()"
        :disabled="dis === true"
        prepend-icon="mdi-delete-forever"
      >
        {{ $t("delete") }}
      </v-btn>
      <v-btn
        class="ml-auto"
        :disabled="dis === true || isEditing === true"
        prepend-icon="mdi-check-outline"
        color="green"
        @click="dialog = !dialog"
      >
        {{ $t("save") }}
      </v-btn>
    </v-card-actions>
  </v-card>
  <v-card class="mt-3" style="width: 100%">
    <v-expansion-panels variant="popout" class="my-4">
      <paneltable
        v-bind:data="materials"
        v-bind:header="headers.supplier_supply"
        v-bind:panelname="'materials'"
        v-bind:openedtitle="openedtitle"
        v-bind:closedtitle="this.supplier.name"
        v-bind:link="link"
        v-bind:title="'materials from supplier ' + supplier.name"
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
import moment from "moment";
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
    supplier: {
      img: "/arkan_logo-no-text.png",
    },
    orgsupplier: {},
    materials: [],
    historytype: "",
    obj: {},
    historyobject: {},
  }),
  created() {
    //GEtet route here
    this.supplier_load();
    this.materials_supplier_load();
  },
  setup() {
    const headers = useheaders();

    return {
      headers,
    };
  },
  methods: {
    supplier_load() {
      axios.get("/api/supplier/" + this.$route.params.id).then((response) => {
        console.log(response);
        this.orgsupplier = [];
        if (response.data.errors) {
          swal("error", response.data.errors[0].msg, "error");
        } else {
          this.orgsupplier = response.data.data;
          this.clone();
        }
      });
    },
    materials_supplier_load() {
      axios
        .get("/api/material/supplier/brief/" + this.$route.params.id)
        .then((response) => {
          this.materials = [];
          response.data.data.forEach((element) => {
            console.log("tet", response.data);
            const x = {};
            x.id = element._id;
            x.lastPrice = element.lastPrice;
            x.lastDate = moment(element.updatedAt).calendar();
            x.lastQuantity = element.lastQuantity;
            x.name = element.material.name;
            x.material_id = element.material._id;
            x.totalCost = element.totalCost;
            x.totalQuantity = element.totalQuantity;
            this.materials.push(x);
          });
          // console.log(this.materials);
        });
    },
    onClickChild_material(value) {
      console.log(value);
      this.historytype = "material";
      this.historyview(value.id);
    },
    material_append(value) {
      axios
        .post("/api/suppliermaterial/assign", {
          supplier: this.orgsupplier._id,
          material: value._id,
          phoneNo: value.qty,
          operation: "assign",
        })
        .then((response) => {
          if (response.data.errors) {
            swal("error", response.data.errors[0].msg, "error");
          } else {
            swal("success", "yayyy", "success");
            this.materials_supplier_load();
          }
        });
    },
    submit(value) {
      //Post route here
      console.log(value);
      const x = {};
      x.supplier = this.$route.params.id;
      x.phoneNo = value.qty;
      x.operation = value.operation;
      if (this.historytype === "material") {
        x.material = value._id;
        axios
          .post("/api/suppliermaterial/assign", {
            supplier: x.supplier,
            material: x.material,
            phoneNo: x.phoneNo,
            operation: x.operation,
          })
          .then((response) => {
            if (response.data.errors) {
              swal("error", response.data.errors[0].msg, "errors");
            } else {
              swal("success", "yayyy", "success");
              this.materials_supplier_load();
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
        this.suppliers.find((m) => m._id === value.id).note = value.note;
      }
    },
    check() {
      this.dialog = false;
      this.dialog1 = true;
    },
    historyview(id) {
      // console.log(this.propfind(id));
      // const x = [];
      // axios
      //   .get("/api/material/supplier/" + this.$route.params.id)
      //   .then((response) => {
      //     console.log(response.data);
      //     x = response.data.data;
      //   });
      // console.log(id);
      // this.historyobject.title = this.historytype + " history";
      // if (this.historytype === "material") {
      //   this.obj = this.x.filters((m) => m.materials.id === id);
      //   console.log("obj", this.obj);
      //   this.historyobject._id = this.obj.material_id;
      // } else {
      //   this.obj = this.suppliers.find((m) => m._id === id);
      // }
      // this.historyobject.id = this.obj.id;
      // this.historyobject.name = this.obj.name;
      // this.historyobject.data = this.obj.history;
      // this.historyobject.qty = this.obj.totalphoneNo;
      // this.historyobject.date = this.obj.lastDate;
      // this.historyobject.note = this.obj.note;
      // this.historyobject.header = this.headers.historyheader;
      // this.dialog2 = true;
    },
    criticalchange() {
      if (this.isEditing === false) {
        this.isEditing = !this.isEditing;
      } else {
        this.content =
          "this change is critical and must double check it :  supplier phoneNo is : ( " +
          this.supplier.phoneNo +
          " )";
        this.dialog = !this.dialog;
      }
    },
    clone() {
      this.supplier.id = this.orgsupplier._id;
      this.supplier.name = this.orgsupplier.name;
      this.supplier.state = this.orgsupplier.state;
      this.supplier.image = this.orgsupplier.image;
      this.supplier.phoneNo = this.orgsupplier.phoneNo;
      this.supplier.note = this.orgsupplier.note;
      this.supplier.address = this.orgsupplier.address;
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
      // this.suppliers.supplier.name = this.supplier.name;
      // this.suppliers.supplier.code = this.supplier.code;
      // this.suppliers.supplier.img = this.supplier.img;
      // this.suppliers.supplier.nid = this.supplier.nid;
      // this.suppliers.supplier.role = this.supplier.role;
      // this.suppliers.supplier.note = this.supplier.note;
      // this.suppliers.supplier.phone = this.supplier.phone;

      //save route here
      axios
        .patch("/api/supplier/" + this.$route.params.id, {
          name: this.supplier.name,
          note: this.supplier.note,
          address: this.supplier.address,
          phoneNo: this.supplier.phoneNo,
          state: this.supplier.state,
        })
        .then((response) => {
          if (response.data.errors) {
            swal("error", response.data.errors[0].msg, "error");
          } else {
            swal("success", "yayy", "success");
            this.supplier_load();
          }
        });
    },
    deletee() {
      swal({
        title: "Are you sure?",
        text: "Are you sure that you want to delete this supplier?",
        icon: "warning",
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          swal("enter your password", {
            content: "input",
          }).then((value) => {
            axios
              .post("/api/auth/testCredentials", {
                code: localStorage.getItem("code"),
                password: value,
              })
              .then((response) => {
                if (response.data.errors) {
                  swal("error", response.data.errors[0].msg, "error");
                } else {
                  axios
                    .delete("/api/supplier/" + this.$route.params.id)
                    .then((response) => {
                      if (response.data.errors) {
                        swal("error", response.data.errors[0].msg, "error");
                      } else {
                        swal(
                          "success",
                          "supplier deleted suuccessfully",
                          "success"
                        ).then(() => {
                          this.$router.push({ path: "/supplier/all" });
                        });
                      }
                    });
                }
              });
          });
        }
      });
    },
  },
};
</script>
