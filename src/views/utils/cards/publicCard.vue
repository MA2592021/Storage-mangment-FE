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
    </v-row>
  </v-card>
  <cardPanel v-bind:code="card.code" />
</template>

<script>
import moment from "moment";
import axios from "axios";
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
