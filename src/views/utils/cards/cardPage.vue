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
          v-model="card.order.name"
          variant="underlined"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          label="model "
          required
          readonly
          v-model="card.model.name"
          variant="underlined"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          label="current Stage "
          required
          readonly
          v-model="card.tracking[card.tracking.length - 1].stage.name"
          variant="underlined"
        ></v-text-field>
      </v-col>
      <v-col cols="12"
        ><v-timeline side="start" align="start">
          <v-timeline-item
            :dot-color="
              h.state === 'Approved'
                ? 'teal-lighten-3'
                : h.state === 'Shipped'
                ? 'green'
                : 'pink'
            "
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
      card: {
        order: { name: "" },
        model: { name: "" },
        tracking: [{ stage: { name: "" } }],
      },
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
  },
};
</script>
