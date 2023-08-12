<template>
  <v-card class="mx-auto" elevation="2" style="width: 100%">
    <v-row class="ma-3">
      <v-col cols="12" sm="6">
        <v-text-field
          label="code "
          required
          readonly
          v-model="card.code"
          variant="underlined"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          label="order "
          required
          readonly
          v-model="ordername"
          variant="underlined"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          label="model "
          required
          readonly
          v-model="modelname"
          variant="underlined"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          label="quantity "
          required
          readonly
          v-model="card.quantity"
          variant="underlined"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          label="start range "
          required
          readonly
          v-model="card.startRange"
          variant="underlined"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          label="end range "
          required
          readonly
          v-model="card.endRange"
          variant="underlined"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          label="Last Stage "
          required
          readonly
          v-model="lastStage"
          variant="underlined"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          required
          v-model="card.cutNumber"
          readonly
          label="Cut Number*"
          hint="Required"
          variant="underlined"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          required
          v-model="color"
          readonly
          label=" color"
          hint="Required"
          variant="underlined"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          required
          v-model="size"
          readonly
          label="size"
          hint="Required"
          variant="underlined"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          required
          v-model="card.boxNumber"
          readonly
          label="box Number"
          hint="Required"
          variant="underlined"
        ></v-text-field>
      </v-col>
      <v-col cols="12"
        ><v-timeline side="start" align="start">
          <v-timeline-item
            :dot-color="getdotcolor(h)"
            size="small"
            v-for="h in card.history"
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
      <v-btn @click="deletee()" color="red" prepend-icon=" mdi-delete-forever">
        Delete
      </v-btn>
    </v-card-actions>
  </v-card>
  <cardPanel v-bind:code="card.code" />
</template>

<script>
import moment from "moment";
import axios from "axios";
import swal from "sweetalert";
import cardPanel from "../../../components/cardPanel.vue";
export default {
  components: { cardPanel },
  data() {
    return {
      card: {},
    };
  },

  created() {
    //Get route
    axios.get("/api/card/" + this.$route.params.id).then((response) => {
      console.log(response);
      this.card = response.data.data;
      console.log(this.card);
    });
  },
  methods: {
    moment(date) {
      return moment(date).calendar();
    },

    timeago(index) {
      if (index === this.card.tracking.length) {
        return "not finished yet";
      } else {
        const currentTime = moment(this.card.tracking[index + 1].stage.dateOut);
        const inputTime = moment(this.card.tracking[index + 1].stage.dateOut);
        const duration = moment.duration(currentTime.diff(inputTime));
        const minutesDifference = duration.asMinutes();
        console.log(minutesDifference);
        console.log(time);
        return minutesDifference;
      }
    },
    deletee() {
      swal({
        title: "Are you sure?",
        text: "Are you sure that you want to delete this card?",
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
                    .delete("/api/card/" + this.$route.params.id)
                    .then((response) => {
                      if (response.data.errors) {
                        swal("error", response.data.errors[0].msg, "error");
                      } else {
                        swal(
                          "success",
                          "card deleted suuccessfully",
                          "success"
                        ).then(() => {
                          this.$router.push({ path: "/utils/cards/all" });
                        });
                      }
                    });
                }
              });
          });
        }
      });
    },
    getdotcolor(item) {
      if (item.type === "create") {
        return "blue";
      } else if (item.type === "track") {
        return "yellow";
      } else if (item.type === "addGlobalError" || item.type === "addError") {
        return "red";
      } else if (
        item.type === "update" ||
        item.type === "verify" ||
        item.type === "confirmGlobalError"
      ) {
        return "green";
      } else if (item.type === "replace") {
        return "purple";
      } else if (item.type === "repair") {
        return "cyan";
      }
    },
  },
  computed: {
    lastStage() {
      if (this.card.tracking) {
        if (this.card.tracking.length > 0) {
          return this.card.tracking[this.card.tracking.length - 1].stage.name;
        } else {
          return "not Started yet";
        }
      }
    },
    ordername() {
      return this.card.order ? this.card.order.name : null;
    },
    modelname() {
      return this.card.model ? this.card.model.name : null;
    },
    color() {
      return this.card.color
        ? `${this.card.color.name} ( ${this.card.color.code})`
        : null;
    },
    size() {
      return this.card.size
        ? `${this.card.size.name} ( ${this.card.size.code})`
        : null;
    },
  },
};
</script>
