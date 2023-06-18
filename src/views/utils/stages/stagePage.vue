<template>
  <v-card class="mx-auto" elevation="2" style="width: 100%"
    ><v-row class="ma-2">
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          label="Name "
          required
          :readonly="dis === true"
          v-model="stage.name"
          variant="underlined"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          required
          label="Code "
          :readonly="dis === true"
          v-model="stage.code"
          variant="underlined"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          label="price/p"
          variant="underlined"
          :readonly="dis === true"
          v-model="stage.price"
          required
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          label="rate/h"
          variant="underlined"
          :readonly="dis === true"
          v-model="stage.rate"
          required
        ></v-text-field>
      </v-col>

      <v-col cols="12" sm="6">
        <v-autocomplete
          label="machine type "
          v-model="stage.machineType"
          variant="underlined"
          :readonly="dis === true"
          :items="types"
          item-title="name"
          item-value="name"
        ></v-autocomplete>
      </v-col>

      <v-col cols="12" sm="6">
        <v-autocomplete
          label="type "
          v-model="stage.type"
          variant="underlined"
          :readonly="dis === true"
          :items="['preparations', 'production', 'finishing', 'quality']"
          item-title="type"
        ></v-autocomplete>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-row
          ><v-text-field
            v-model="textInput"
            label="Enter a error"
            @keydown.enter="addString"
            :readonly="dis === true"
            hint="press enter to add "
          ></v-text-field></v-row
        ><v-row>
          <v-chip
            v-for="(item, index) in stage.errors"
            :key="index"
            color="red"
            class="ma-1"
            variant="outlined"
            label
          >
            {{ item }}
          </v-chip></v-row
        >
      </v-col>
      <v-col cols="12" sm="6"
        ><v-textarea
          :clearable="dis === false"
          label="Note"
          v-model="stage.note"
          :readonly="dis === true"
          prepend-icon="mdi-note-text-outline"
        ></v-textarea>
      </v-col>
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
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from "axios";
import swal from "sweetalert";
export default {
  data() {
    return {
      stage: {},
      types: [],
      orgstage: {},
      dis: true,
      textInput: "",
    };
  },
  created() {
    //Get route
    this.stageload();
    this.typesload();
  },
  methods: {
    stageload() {
      axios.get("/api/stage/" + this.$route.params.id).then((response) => {
        console.log(response);
        this.orgstage = response.data.data;
        this.clone();
      });
    },
    typesload() {
      axios.get("/api/machineType").then((response) => {
        this.types = response.data.data;
      });
    },
    save() {
      this.dis = !this.dis;
      swal({
        title: "Are you sure?",
        text: "Are you sure that you want to edit this stage?",
        icon: "warning",
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          axios
            .patch("/api/stage/" + this.$route.params.id, {
              name: this.stage.name,
              code: this.stage.code,
              price: this.stage.price,
              rate: this.stage.rate,
              type: this.stage.type,
              note: this.stage.note,
              machineType: this.stage.machineType,
              stageErrors: this.stage.errors,
            })
            .then((response) => {
              if (response.data.errors) {
                swal("error", response.data.errors[0].msg, "error");
              } else {
                swal("success", "stage updated successfully", "success");
                this.stageload();
              }
            });
        }
      });
    },
    clone() {
      this.stage.id = this.orgstage._id;
      this.stage.name = this.orgstage.name;
      this.stage.code = this.orgstage.code;
      this.stage.price = this.orgstage.price;
      this.stage.rate = this.orgstage.rate;
      this.stage.type = this.orgstage.type;
      this.stage.note = this.orgstage.note;
      this.stage.machineType = this.orgstage.machineType.name;
      this.stage.errors = this.orgstage.stageErrors;
    },
    cancel() {
      this.dis = !this.dis;

      this.clone();
    },
    deletee() {
      swal({
        title: "Are you sure?",
        text: "Are you sure that you want to delete this stage?",
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
                    .delete("/api/stage/" + this.$route.params.id)
                    .then((response) => {
                      if (response.data.errors) {
                        swal("error", response.data.errors[0].msg, "error");
                      } else {
                        swal(
                          "success",
                          "stage deleted suuccessfully",
                          "success"
                        ).then(() => {
                          this.$router.push({ path: "/utils/stage/all" });
                        });
                      }
                    });
                }
              });
          });
        }
      });
    },

    addString() {
      if (this.textInput) {
        this.stage.errors.push(this.textInput);
        this.textInput = ""; // Clear the text field
      }
    },
  },
};
</script>
