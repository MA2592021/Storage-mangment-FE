<template>
  <v-card class="mx-auto" elevation="2" style="width: 100%"
    ><v-row class="ma-3"
      ><v-col cols="12" align="center" class="text-h4"> requests </v-col>
      <v-col cols="3" sm="2"
        ><v-img
          class="bg-white"
          width="300"
          :aspect-ratio="1"
          :src="request.image ? request.image.data : '/arkan_logo-no-text.png'"
          cover
        ></v-img></v-col
      ><v-col cols="9" sm="10">
        <v-row>
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
            ><v-timeline side="start" align="start">
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
        </v-row></v-col
      ></v-row
    >
    <v-card-actions class="mx-auto">
      <v-row>
        <v-btn
          @click="cancel()"
          :disabled="request.status === 'Delivered'"
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
          :disabled="dis === true || request.status === 'Approved'"
          prepend-icon="mdi-check-decagram"
          color="teal-lighten-3"
          @click="approve()"
        >
          Approve
        </v-btn>
        <v-btn
          class="ml-auto"
          :disabled="dis === true || request.status !== 'Approved'"
          prepend-icon="mdi-cash-marker"
          color="green"
          @click="deliver()"
        >
          deliverd
        </v-btn>
        <v-btn
          class="ml-auto"
          :disabled="dis === true"
          prepend-icon="mdi-package-check"
          color="green"
          @click="dialog1 = !dialog1"
        >
          Save
        </v-btn></v-row
      >
    </v-card-actions>
  </v-card>
  <v-card class="mt-3" style="width: 100%">
    <requestpanel
      v-bind:reqmaterial="request.materials"
      v-bind:reqproperty="request.properties"
      v-bind:status="request.status"
      v-bind:closedtitle="closedtitle"
      v-bind:panelname="'inclusions'"
      v-bind:name="request.name"
      v-if="done"
      @material="appendmaterial"
      @property="appendproperty"
    />
  </v-card>
  <!-- <popuptest
    v-model="dialog"
    v-if="dialog"
    v-bind:title="title"
    v-bind:content="content"
    @save="check()"
    @close="cancel()"
  /> -->
  <requestdeliver
    v-model="dialog"
    v-if="dialog"
    v-bind:title="title"
    v-bind:materials="request.materials"
    v-bind:properties="request.properties"
    @append="deliverd"
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
import popuptest from "../../components/popuptest.vue";
import requestdeliver from "../../components/requestdeliver.vue";
import check from "../../components/checkpopup.vue";
import requestpanel from "../../components/requestpanel.vue";
import axios from "axios";
import moment from "moment";
import { useheaders } from "../../stores/headers";
import swal from "sweetalert";

export default {
  components: { requestdeliver, popuptest, check, requestpanel },
  //test
  data: () => ({
    content: "Incorrect changes can lead to system problems in the future.",
    title: "Incorrect info can lead to system problems in the future.",

    link_property: { get: "/api/custody/" },
    dialog: false,
    dialog1: false,
    closedtitle: "properties and material in",
    dis: true,
    request: {},
    orgrequest: {},
    materials: [],
    properties: [],
    done: false,
    reqobj: null,
    deliverdmaterials: [],
    deliveredproperties: [],
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
          console.log(response.data);
          x._id = response.data.data._id;
          x.status =
            response.data.data.history[
              response.data.data.history.length - 1
            ].state;
          x.name = response.data.data.name;
          x.details = response.data.data.details;
          x.note = response.data.data.note;
          x.time = moment(response.data.data.createdAt).calendar();
          x.history = response.data.data.history;
          x.materials = response.data.data.materials;
          x.image = response.data.data.image;
          x.properties = response.data.data.custodies;
          this.orgrequest = x;
          console.log(x);

          this.clone();
          this.done = true;
        }
      });
    },
    appendproperty(value, ind) {
      // axios.patch('/api/buyRequest/materials/add/'+this.$route.params.id,{
      // materials: [value];
      // })
      axios
        .patch("/api/buyRequest/custodies/update/" + this.$route.params.id, {
          custodies: value,
        })
        .then((response) => {
          console.log(response);

          if (response.data.errors) {
            swal("error", response.data.errors[0].msg, "error");
          } else {
            swal("success", "request updated successfully");
            if (ind) {
              this.deliverbbe();
            }

            this.requestload();
          }
        });
      console.log("property", value);
    },
    appendmaterial(value, property, ind) {
      console.log(value);
      // axios.patch('/api/buyRequest/custodies/add/'+this.$route.params.id,{
      //   custodies:[
      // value
      //   ]
      // })
      axios
        .patch("/api/buyRequest/materials/update/" + this.$route.params.id, {
          materials: value,
        })
        .then((response) => {
          if (response.data.errors) {
            swal("error", response.data.errors[0].msg, "error");
          } else {
            swal("success", "request updated successfully");
            console.log(response);
            if (property) {
              this.appendproperty(property, ind);
            } else {
              console.log("testo successo");
            }

            this.requestload();
          }
        });
      console.log("material", value);
    },
    approve() {
      swal({
        title: "Are you sure?",
        text: "Are you sure that you want to Approve this request?",
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
                    .patch("/api/buyRequest/approve/" + this.$route.params.id)
                    .then((response) => {
                      if (response.data.errors) {
                        swal("error", response.data.errors[0].msg, "error");
                      } else {
                        swal(
                          "success",
                          "request Approved successfully",
                          "success"
                        );
                        this.requestload();
                      }
                    });
                }
              });
          });
        }
      });
    },
    deliver() {
      swal({
        title: "Are you sure?",
        text: "Are you sure that you want to deliver this request?",
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
                  this.dialog = true;
                }
              });
          });
        }
      });
    },
    async deliverd(material, property) {
      this.dialog = false;
      console.log("material", material);
      console.log("property", property);

      await this.appendmaterial(material, property, true);
    },
    deliverbbe() {
      axios
        .patch("/api/buyRequest/delivered/" + this.$route.params.id)
        .then((response) => {
          if (response.data.errors) {
            swal("error", response.data.errors[0].msg, "error");
          } else {
            swal("success", "request delivered successfully", "success");
            this.dis = true;
            this.requestload();
          }
        });
    },
    check() {
      this.dialog = false;
      this.dialog1 = true;
    },

    clone() {
      this.request.id = this.orgrequest._id;
      this.request.name = this.orgrequest.name;
      this.request.details = this.orgrequest.code;
      this.request.history = this.orgrequest.history;
      this.request.materials = this.orgrequest.materials;
      this.request.properties = this.orgrequest.properties;
      this.request.note = this.orgrequest.note;
      this.request.image = this.orgrequest.image;
      this.request.details = this.orgrequest.details;
      this.request.status = this.orgrequest.status;
      this.request.time = this.orgrequest.time;
    },
    cancel() {
      this.dialog = false;
      this.dialog1 = false;
      this.dis = !this.dis;
      this.clone();
      this.content =
        "Incorrect changes can lead to system problems in the future. Are you sure about the changes you made?";
    },
    save() {
      this.dis = !this.dis;
      this.dialog = false;
      this.dialog1 = false;
      axios
        .patch("/api/buyRequest/" + this.$route.params.id, {
          name: this.request.name,
          details: this.request.details,

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
                    .delete("/api/buyRequest/" + this.$route.params.id)
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
          });
        }
      });
    },
  },
};
</script>
