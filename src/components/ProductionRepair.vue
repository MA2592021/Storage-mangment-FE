<template>
  <v-row>
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
        @update:modelValue="blurs()"
      ></v-autocomplete>
    </v-col>
    <v-col cols="8">
      <v-text-field
        v-model="card_code"
        clearable
        label="card code"
        inputmode="numeric"
        variant="outlined"
        @update:modelValue="(found = false), (repiarstages = [])"
        :disabled="selectedStages.length !== 0"
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
      <v-btn
        class="mt-2"
        color="success"
        :disabled="selectedStages.length !== 0"
        block
        @click="loadCard()"
        >Check</v-btn
      >
    </v-col>
    <v-col cols="2">
      <v-btn class="mt-2" color="info" block @click="viewCard">view</v-btn>
    </v-col>
  </v-row>
  <v-text-field
    v-model="search"
    append-icon="mdi-magnify"
    label="Search"
    single-line
    hide-details
  ></v-text-field>
  <v-data-table
    :headers="headers"
    :items="repiarstages"
    :search="search"
    :loading="loading"
    show-select
    class="elevation-1"
    v-model="selectedStages"
    return-object
  >
    <template v-slot:item.check="{ item, index }">
      <v-checkbox class="ml-4" v-model="item.raw.check"></v-checkbox>
    </template>
    <template v-slot:item.employee[name]="props">
      <v-autocomplete
        label="employee"
        :items="employees"
        item-title="name"
        return-object
        v-model="props.item.raw.employee"
        :readonly="props.item.raw.check === false"
        @update:modelValue="blurs"
      ></v-autocomplete>
    </template>
  </v-data-table>
  <v-row
    ><v-col align="center" class="mt-4"
      ><v-btn color="success" :loading="loading" @click="repiar()">{{
        $t("submit")
      }}</v-btn></v-col
    ></v-row
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
      search: "",
      rolenum: localStorage.getItem("rolenum"),
      headers: [
        { title: "المرحلة", key: "stage[name]" },
        {
          title: "العامل",
          key: "employee[name]",
        },
        { title: "عامل اخر", key: "check" },
      ],
      // arrays and selects
      employees: [],
      orders: [],
      repiarstages: [],
      selectedStages: [],
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
          this.loadRepairCards();
          this.loading = false;
          this.found = true;
        })
        .catch((err) => {
          this.loading = false;
          console.log(this.selected_model._id);
        });
    },
    loadRepairCards() {
      axios.get(`/api/card/${this.card}/errors/repair`).then((res) => {
        console.log(res.data.data);
        this.repiarstages = [];
        res.data.data.forEach((element) => {
          const x = {};
          element.employee
            ? (x.employee = {
                name:
                  `${element.employee.name} ` + ` ( ${element.employee.code} )`,
                _id: element.employee._id,
              })
            : "";
          x.stage = {
            name: `${element.stage.name} ` + ` ( ${element.stage.code} )`,
            _id: element.stage._id,
          };
          x.check = false;
          this.repiarstages.push(x);
        });
        console.log(this.repiarstages);
      });
    },
    //submits
    repiar() {
      if (this.selectedStages.length === 0) {
        swal("error", "برجاء اختيار مراحل للاصلاح", "error");
      } else {
        this.loading = true;
        const data = [];
        this.selectedStages.forEach((element) => {
          const x = {};
          x.stage = element.stage._id;
          if (element.employee) {
            x.employee = element.employee._id;
          } else {
            return;
          }
          data.push(x);
        });
        console.log(data);
        axios
          .patch(`/api/card/${this.card}/errors/repair/all`, {
            enteredBy: localStorage.getItem("employee"),
            repairs: data,
          })
          .then((res) => {
            console.log(res);
            this.loading = false;
            swal("success", "تم رصد الاصلاحات بنجاح", "success").then(() => {
              this.start();
            });
          })
          .catch((err) => {
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
      this.repiarstages = [];
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
  },
  props: {
    orders: Array,
    employees: Array,
  },
};
</script>
