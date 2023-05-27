<template>
  <v-card class="mx-auto" elevation="2" style="width: 100%"
    ><v-row class="ma-3"
      ><v-col cols="12" align="center" class="text-h4"> shipments </v-col>
      <v-col cols="3" sm="2"
        ><v-img
          class="bg-white"
          width="300"
          :aspect-ratio="1"
          :src="shipment.img ? shipment.img : '/arkan_logo-no-text.png'"
          cover
        ></v-img></v-col
      ><v-col cols="9" sm="10">
        <v-row>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              label="Name "
              required
              :readonly="dis === true"
              v-model="shipment.name"
              variant="underlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="3" md="3">
            <v-text-field
              label="status "
              required
              readonly
              v-model="shipment.status"
              variant="underlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="3" md="3">
            <v-text-field
              label="created at "
              required
              readonly
              v-model="shipment.time"
              variant="underlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6"
            ><v-textarea
              :clearable="dis === false"
              label="details"
              v-model="shipment.details"
              :readonly="dis === true"
              prepend-icon="mdi-note-text-outline"
            ></v-textarea>
          </v-col>
          <v-col cols="12" sm="6"
            ><v-textarea
              :clearable="dis === false"
              label="Note"
              v-model="shipment.note"
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
                    : h.state === 'Shipped'
                    ? 'green'
                    : 'pink'
                "
                size="small"
                v-for="h in shipment.history"
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
      <v-btn
        @click="cancel()"
        :disabled="shipment.status === 'Shipped'"
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
        :disabled="dis === true"
        prepend-icon="mdi-check-decagram"
        color="teal-lighten-3"
        @click="approve()"
      >
        Approve
      </v-btn>
      <v-btn
        class="ml-auto"
        :disabled="dis === true || shipment.status !== 'Approved'"
        prepend-icon="mdi-truck"
        color="green"
      >
        Ship
        <v-dialog v-model="dialog5" activator="parent" width="auto">
          <v-card>
            <v-card-text>
              <imageuploader @image="deliver"></imageuploader>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-btn>
      <v-btn
        class="ml-auto"
        :disabled="dis === true"
        prepend-icon="mdi-package-check"
        color="green"
        @click="dialog = !dialog"
      >
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
  <v-card class="mt-3" style="width: 100%">
    <shipmentpanel
      v-bind:reqcarton="shipment.cartons"
      v-bind:status="shipment.status"
      v-bind:closedtitle="closedtitle"
      v-bind:panelname="'inclusions'"
      v-bind:name="shipment.name"
      @cartons="appendcarton"
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
import popuptest from "../../components/popuptest.vue";
import check from "../../components/checkpopup.vue";
import shipmentpanel from "../../components/shipmentpanel.vue";
import axios from "axios";
import moment from "moment";
import imageuploader from "../../components/imageuploader.vue";
import { useheaders } from "../../stores/headers";
import swal from "sweetalert";

export default {
  components: { imageuploader, popuptest, check, shipmentpanel },
  //test
  data: () => ({
    content:
      "Incorrect changes can lead to system problems in the future. Are you sure about the changes you made?",
    title: "are you sure ? ",
    dialog5: false,
    dialog: false,
    dialog1: false,
    closedtitle: "cartons in",
    dis: true,
    shipment: {},
    orgshipment: {},
  }),
  created() {
    //GEtet route here
    this.shipmentload();
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
    shipmentload() {
      axios.get("/api/shipment/" + this.$route.params.id).then((response) => {
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
          x.cartons = response.data.data.cartons;
          x.client = response.data.data.client;
          x.note = response.data.data.note;
          x.details = response.data.data.details;
          console.log(x);
          this.orgshipment = x;

          this.clone();
        }
      });
    },

    appendcarton(value) {
      // axios.patch('/api/buyshipment/custodies/add/'+this.$route.params.id,{
      //   custodies:[
      // value
      //   ]
      // })
      console.log(value);
      axios
        .patch("/api/shipment/addCartons/" + this.$route.params.id, {
          cartons: value,
        })
        .then((response) => {
          if (response.data.errors) {
            swal("error", response.data.errors[0].msg, "error");
          } else {
            swal("success", "cartons updated successfully", "success");
            this.shipmentload();
          }
        });
    },
    approve() {
      swal({
        title: "Are you sure?",
        text: "Are you sure that you want to Approve this shipment?",
        icon: "warning",
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          swal("enter your password", {
            content: "input",
          })
            .then((value) => {
              swal(`we should check password here : ${value}`);
            })
            .then(() => {
              axios
                .patch("/api/shipment/approved/" + this.$route.params.id)
                .then((response) => {
                  if (response.data.errors) {
                    swal("error", response.data.errors[0].msg, "error");
                  } else {
                    swal(
                      "success",
                      "shipment Approved successfully",
                      "success"
                    );
                    this.shipmentload();
                  }
                });
            });
        }
      });
    },
    deliver(image) {
      this.shipment.image = iamge;
      swal({
        title: "Are you sure?",
        text: "Are you sure that you want to ship this shipment?",
        icon: "warning",
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          swal("enter your password", {
            content: "input",
          })
            .then((value) => {
              swal(`we should check password here : ${value}`);
            })
            .then(() => {
              axios
                .patch("/api/shipment" + this.$route.params.id, {
                  exitPermission: this.shipment.image,
                })
                .then(() => {
                  axios
                    .patch("/api/shipment/shipped/" + this.$route.params.id)
                    .then((response) => {
                      if (response.data.errors) {
                        swal("error", response.data.errors[0].msg, "error");
                      } else {
                        swal(
                          "success",
                          "shipment shipped successfully",
                          "success"
                        );
                        this.dis = true;
                        this.shipmentload();
                      }
                    });
                });
            });
        }
      });
    },

    check() {
      this.dialog = false;
      this.dialog1 = true;
    },

    clone() {
      this.shipment.id = this.orgshipment._id;
      this.shipment.name = this.orgshipment.name;
      this.shipment.status = this.orgshipment.status;
      this.shipment.details = this.orgshipment.details;
      this.shipment.history = this.orgshipment.history;
      this.shipment.cartons = this.orgshipment.cartons;
      this.shipment.note = this.orgshipment.note;
      this.shipment.client = this.orgshipment.client;
      this.shipment.time = this.orgshipment.time;
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
        .patch("/api/buyshishipmentpment/" + this.$route.params.id, {
          name: this.shipment.name,
          details: this.shipment.details,

          note: this.shipment.note,
        })
        .then((response) => {
          if (response.data.errors) {
            swal("error", response.data.errors[0].msg, "error");
          } else {
            this.shipmentload();
            this.content =
              "Incorrect changes can lead to system problems in the future. Are you sure about the changes you made?";
          }
        });
    },
    deletee() {
      swal({
        title: "Are you sure?",
        text: "Are you sure that you want to delete this shipment?",
        icon: "warning",
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          swal("enter your password", {
            content: "input",
          })
            .then((value) => {
              swal(`we should check password here : ${value}`);
            })
            .then(() => {
              axios
                .delete("/api/shipment/" + this.$route.params.id)
                .then((response) => {
                  if (response.data.errors) {
                    swal("error", response.data.errors[0].msg, "error");
                  } else {
                    swal(
                      "success",
                      "shipment deleted suuccessfully",
                      "success"
                    ).then(() => {
                      this.$router.push({ path: "/shipment/all" });
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
