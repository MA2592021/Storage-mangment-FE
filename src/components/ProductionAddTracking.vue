<template>
  <v-row>
    <!-- <v-col cols="12">
      <v-checkbox
        v-model="verify"
        @update:modelValue="error = false"
        :label="$t('verifing')"
        color="green"
        value="true"
        hide-details
      ></v-checkbox>
    </v-col> -->
    <v-col cols="12">
      <v-autocomplete
        v-model="selected_order"
        :items="orders"
        item-title="name"
        return-object
        :label="$t('order')"
        v-if="!assist"
        @update:modelValue="blurs"
      ></v-autocomplete>
    </v-col>
    <v-col cols="12">
      <v-autocomplete
        v-model="selected_model"
        :items="selected_order.models"
        item-title="name"
        return-object
        :label="$t('model')"
        v-if="!assist"
        @update:modelValue="loadModelStages()"
      ></v-autocomplete>
    </v-col>
    <v-col cols="12">
      <v-autocomplete
        v-model="selected_employee"
        :items="employees"
        item-title="name"
        inputmode="numeric"
        return-object
        :label="$t('employee code')"
        @update:modelValue="blurs"
      ></v-autocomplete>
    </v-col>

    <v-col cols="12">
      <v-autocomplete
        v-model="selected_stage"
        :items="model_stages"
        return-object
        :item-title="`name`"
        :label="$t('stage ')"
        @update:modelValue="blurs"
      ></v-autocomplete></v-col
    ><v-col cols="8">
      <v-text-field
        v-model="card_code"
        clearable
        label="card code"
        inputmode="numeric"
        variant="outlined"
        @update:modelValue="found = false"
      >
        <template v-slot:append-inner>
          <v-fade-transition leave-absolute>
            <v-progress-circular
              v-if="loading"
              color="info"
              indeterminate
              size="24"
            ></v-progress-circular>

            <v-icon v-if="found" color="green" icon="mdi-check-bold"></v-icon>
          </v-fade-transition>
        </template>
      </v-text-field>
    </v-col>
    <v-col cols="2">
      <v-btn class="mt-2" color="success" block @click="loadCard()"
        >Check</v-btn
      >
    </v-col>
    <v-col cols="2">
      <v-btn class="mt-2" color="info" block @click="viewCard"
        >view</v-btn
      > </v-col
    ><v-col cols="12" align="center"
      ><v-btn
        outlined
        color="green"
        @click="submitproduction"
        :loading="loading"
        >{{ $t("submit") }}</v-btn
      ><v-btn
        outlined
        color="red"
        class="ml-4"
        v-if="+rolenum < 3"
        @click="replacetrack"
        :loading="loading"
        >{{ $t("replace") }}</v-btn
      >
    </v-col></v-row
  >
</template>

<script>
import axios from "axios";
import swal from "sweetalert";
export default {
  data() {
    return {
      //logic
      assist: false,
      loading: false,
      found: false,
      rolenum: localStorage.getItem("rolenum"),
      // arrays and selects
      employees: [],
      orders: [],
      selected_order: localStorage.getItem("savedOrder")
        ? JSON.parse(localStorage.getItem("savedOrder"))
        : "",
      selected_model: localStorage.getItem("savedModel")
        ? JSON.parse(localStorage.getItem("savedModel"))
        : "",
      selected_stage: "",
      selected_employee: "",
      card_code: "",
      card: "",
      model_stages: "",
    };
  },
  methods: {
    blurs() {
      document.activeElement.blur();
    },
    //loaders
    loadModelStages() {
      axios.get("/api/model/" + this.selected_model._id).then((res) => {
        this.model_stages = res.data.data.stages
          .filter((element) => element.id.type !== "quality")
          .map((el) => ({
            name: `${el.id.name} (${el.id.code})`,
            id: el.id._id,
          }));
      });
      this.blurs();
    },
    loadCard() {
      this.loading = true;
      console.log(this.selected_model._id);
      axios
        .post(`/api/card/code/${this.card_code}`, {
          model: this.selected_model._id,
          order: this.selected_order._id,
        })
        .then((res) => {
          this.card = res.data.data._id;
          this.loading = false;
          this.found = true;
        })
        .catch((err) => {
          this.loading = false;
          console.log(this.selected_model._id);
        });
    },
    //submits
    submitproduction() {
      if (this.card === "") {
        swal("error", "please enter card code", "error");
      } else {
        this.loading = true;

        axios
          .patch(`/api/card/${this.card}/tracking/add`, {
            stage: this.selected_stage.id,
            employee: this.selected_employee._id,
            enteredBy: localStorage.getItem("employee"),
          })
          .then((res) => {
            //console.log(res);
            swal("success", "تم رصد المرحلة بنجاح", "success").then(() => {
              localStorage.setItem(
                "savedOrder",
                JSON.stringify(this.selected_order)
              );
              localStorage.setItem(
                "savedModel",
                JSON.stringify(this.selected_model)
              );
              this.start();
              this.loading = false;
            });
          })
          .catch(() => (this.loading = false));
      }
    },
    replacetrack() {
      console.log(this.selected_employee._id);
      if (this.card === "") {
        swal("error", "please enter card code", "error");
      } else {
        this.loading = true;
        axios
          .patch(`/api/card/${this.card}/tracking/replace`, {
            stage: this.selected_stage.id,
            employee: this.selected_employee._id,
            enteredBy: localStorage.getItem("employee"),
          })
          .then((res) => {
            swal(
              "success",
              "replace employee done successfully",
              "success"
            ).then(() => {
              this.start();
              this.loading = false;
              this.$router.go(0);
            });
          })
          .catch(() => {
            this.loading = false;
          });
      }
    },
    //logic
    start() {
      this.selected_employee = "";
      this.selected_stage = "";
      this.card_code = "";
      this.card = "";
      this.found = false;
    },
    viewCard() {
      if (this.card !== "") {
        this.$router.push({
          path: `/card/public/${this.card}`,
        });
      } else {
        swal("error", "please enter card code", "error");
      }
    },
  },
  created() {
    if (localStorage.getItem("order") !== null) {
      this.assist = true;
      this.selected_order = { _id: localStorage.getItem("order") };
      this.selected_model = { _id: localStorage.getItem("model") };
    }
    if (this.selected_model !== "") {
      this.loadModelStages();
    }
  },
  props: {
    orders: Array,
    employees: Array,
  },
};
</script>
