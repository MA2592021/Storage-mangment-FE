<template>
  <v-card class="mx-auto" elevation="2" style="width: 100%"
    ><v-row class="ma-2"
      ><v-col cols="3" sm="2"
        ><v-img
          class="bg-white"
          width="300"
          :aspect-ratio="1"
          :src="assist.image ? assist.image.data : '/arkan_logo-no-text.png'"
          cover
        ></v-img></v-col
      ><v-col cols="9" sm="10">
        <v-row>
          <v-col cols="12" sm="8" md="8">
            <v-text-field
              label="Name "
              required
              readonly
              v-model="assist.name"
              variant="underlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4" md="4">
            <v-text-field
              required
              label="Code "
              readonly
              v-model="assist.code"
              variant="underlined"
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="6">
            <v-autocomplete
              label="order"
              v-model="assist.order"
              variant="underlined"
              :readonly="dis === true"
              :items="types"
              item-title="name"
              item-value="name"
            ></v-autocomplete>
          </v-col>

          <v-col cols="12" sm="6">
            <v-autocomplete
              label="model"
              v-model="assist.model"
              variant="underlined"
              :readonly="dis === true"
              :items="['prepairs', 'production', 'finishing']"
              item-title="type"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12"
            ><v-textarea
              :clearable="dis === false"
              label="Note"
              v-model="assist.note"
              :readonly="dis === true"
              prepend-icon="mdi-note-text-outline"
            ></v-textarea> </v-col></v-row
      ></v-col>
    </v-row>
    <v-card-actions class="mx-auto">
      <v-btn
        @click="cancel()"
        :prepend-icon="dis ? 'mdi-circle-edit-outline' : 'mdi-cancel'"
      >
        {{ dis ? "edit" : "cancel" }}
      </v-btn>
      <v-btn
        @click="deletee()"
        class="mx-auto"
        :disabled="dis === true"
        prepend-icon=" mdi-delete-forever"
        color="red"
      >
        Delete
      </v-btn>
      <v-btn
        :disabled="dis === true"
        prepend-icon="mdi-check-outline"
        color="green"
        @click="save()"
      >
        Save
      </v-btn>
    </v-card-actions> </v-card
  ><v-expansion-panels variant="popout" class="my-4">
    <paneltable
      v-bind:data="assist.cards"
      v-bind:header="headers"
      v-bind:panelname="$t(`properties`)"
      v-bind:openedtitle="$t(`assists.p1`)"
      v-bind:closedtitle="this.assist.name"
      v-bind:link="link_property"
      v-bind:title="'properties with assist ' + assist.name"
      v-bind:assist="true"
      @clicked="onClickChild_property"
      @appended="property_append"
  /></v-expansion-panels>
</template>

<script>
import paneltable from "../../../components/paneltable.vue";
import axios from "axios";
import swal from "sweetalert";
export default {
  components: { paneltable },
  data() {
    return {
      assist: {
        name: "el gamal",
        code: "255",
        order: "dafa1",
        model: "dafa",
        cards: [
          {
            code: "244",
            stage: "ta2te3",
            date: "1 minute ago",
            order: "dafa1",
            model: "dafa",
            qty: "12",
          },
          {
            code: "244",
            stage: "ta2te3",
            date: "1 minute ago",
            order: "dafa1",
            model: "dafa",
            qty: "12",
          },
          {
            code: "244",
            stage: "ta2te3",
            date: "1 minute ago",
            order: "dafa1",
            model: "dafa",
            qty: "12",
          },
          {
            code: "244",
            stage: "ta2te3",
            date: "1 minute ago",
            order: "dafa1",
            model: "dafa",
            qty: "12",
          },
        ],
      },
      headers: [
        { title: "code", key: "code" },
        { title: "order", key: "order" },
        { title: "model", key: "model" },
        { title: "stage", key: "stage" },
        { title: "qty", key: "qty" },
        { title: "date", key: "date" },
      ],
      orgassist: {},
      dis: true,
    };
  },
  created() {
    //Get route
    this.assistload();
  },
  methods: {
    assistload() {
      axios.get("/api/assist/" + this.$route.params.id).then((response) => {
        console.log(response);
        this.orgassist = response.data.data;
        this.clone();
      });
    },

    save() {
      this.dis = !this.dis;
      swal({
        title: "Are you sure?",
        text: "Are you sure that you want to edit this assist?",
        icon: "warning",
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          axios
            .patch("/api/assist/" + this.$route.params.id, {
              name: this.assist.name,
              code: this.assist.code,
              price: this.assist.price,
              rate: this.assist.rate,
              type: this.assist.type,
              note: this.assist.note,
              machineType: this.assist.machineType,
            })
            .then((response) => {
              if (response.data.errors) {
                swal("error", response.data.errors[0].msg, "error");
              } else {
                swal("success", "assist updated successfully", "success");
                this.assistload();
              }
            });
        }
      });
    },
    clone() {
      this.assist.id = this.orgassist._id;
      this.assist.name = this.orgassist.name;
      this.assist.code = this.orgassist.code;
      this.assist.price = this.orgassist.price;
      this.assist.rate = this.orgassist.rate;
      this.assist.type = this.orgassist.type;
      this.assist.note = this.orgassist.note;
      this.assist.machineType = this.orgassist.machineType.name;
    },
    cancel() {
      this.dis = !this.dis;

      this.clone();
    },
    deletee() {
      swal({
        title: "Are you sure?",
        text: "Are you sure that you want to delete this assist?",
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
                    .delete("/api/assist/" + this.$route.params.id)
                    .then((response) => {
                      if (response.data.errors) {
                        swal("error", response.data.errors[0].msg, "error");
                      } else {
                        swal(
                          "success",
                          "assist deleted suuccessfully",
                          "success"
                        ).then(() => {
                          this.$router.push({ path: "/utils/assist/all" });
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
