<template>
  <v-row>
    <v-col cols="12">
      <v-checkbox
        v-model="verify"
        @update:modelValue="error = false"
        :label="$t('verifing')"
        color="green"
        value="true"
        hide-details
      ></v-checkbox>
    </v-col>
    <v-col cols="12">
      <v-autocomplete
        v-model="selected_order"
        :items="orders"
        item-title="name"
        :label="$t('order')"
        return-object
      ></v-autocomplete>
    </v-col>
    <v-col cols="12">
      <v-autocomplete
        v-model="selected_model"
        :items="selected_order.models"
        item-title="id.name"
        :label="$t('model')"
        return-object
        @update:modelValue="loadmodel()"
      ></v-autocomplete>
    </v-col>

    <v-col cols="12">
      <v-autocomplete
        v-model="selected_card"
        :items="cardsfilter"
        item-title="code"
        return-object
        inputmode="numeric"
        :label="$t('card code')"
      ></v-autocomplete>
    </v-col>
    <v-col cols="12">
      <v-autocomplete
        v-model="selected_quality"
        :items="quality"
        item-title="id.name"
        return-object
        inputmode="numeric"
        :label="$t('quality phase code')"
      ></v-autocomplete>
    </v-col>
    <v-col cols="12">
      <v-autocomplete
        v-model="selected_stage"
        :items="selected_card.currentErrors"
        inputmode="numeric"
        item-title="name"
        return-object
        :label="$t('stage code')"
        v-if="verify"
      >
      </v-autocomplete>
    </v-col>

    <v-col cols="12">
      <v-checkbox
        v-model="error"
        :label="$t('have errors')"
        color="red"
        value="red"
        hide-details
        v-if="!verify"
      ></v-checkbox>
    </v-col>
    <v-col cols="12" v-if="error">
      <v-row>
        <v-col cols="4"
          ><v-btn block color="red" @click="decrement"> - </v-btn></v-col
        >
        <v-col class="mt-2" cols="4" align="center">
          <span
            >{{ $t("number of pices") }}
            <strong>{{ errors.length }}</strong></span
          >
        </v-col>
        <v-col cols="4"
          ><v-btn block color="green" @click="increment"> + </v-btn></v-col
        >
      </v-row>
      <v-row v-for="(error, index) in errors" :key="error">
        <v-divider :thickness="8"></v-divider>
        <v-col cols="12" align="center"
          ><span> {{ $t("piece") }} {{ index + 1 }} </span></v-col
        >
        <v-col cols="12"
          ><v-text-field
            :label="$t('piece number')"
            v-model="error.number"
          ></v-text-field
        ></v-col>
        <v-col cols="4"
          ><v-btn color="pink" @click="decrement1(index)"> - </v-btn></v-col
        >
        <v-col class="mt-2" cols="4" align="center">
          <span>
            {{ $t("number of errors") }}
            <strong>{{ error.errors.length }}</strong> {{ $t("in") }}
            {{ $t("piece number") }} <strong>{{ error.number }}</strong></span
          >
        </v-col>
        <v-col cols="4" align="end"
          ><v-btn color="info" @click="increment1(index)"> + </v-btn></v-col
        >
        <v-col cols="12">
          <v-row v-for="(er, index) in error.errors" :key="er">
            <v-col cols="12" align="center">
              <span>{{ $t("error number") }} {{ index + 1 }}</span></v-col
            >

            <v-col cols="12" md="6"
              ><v-autocomplete
                v-model="er.stage"
                :items="stageerror"
                item-title="id.name"
                :label="$t('stage error')"
                return-object
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="6"
              ><v-autocomplete
                v-model="er.description"
                :items="test(er)"
                :label="$t('error desc')"
              ></v-autocomplete></v-col
            ><v-divider :thickness="1"></v-divider> </v-row
        ></v-col>
        <v-divider :thickness="1"></v-divider>
      </v-row>
    </v-col>
    <v-col cols="12" align="center"
      ><v-btn outlined color="green" @click="submitquality">{{
        $t("submit")
      }}</v-btn></v-col
    >
  </v-row>
</template>

<script>
import axios from "axios";
import swal from "sweetalert";
export default {
  data: () => ({
    error: false,
    verify: false,
    errors: [],
    orders: [],
    quality: [],
    cards: [],
    employees: [],
    selected_order: localStorage.getItem("quality_order")
      ? JSON.parse(localStorage.getItem("quality_order"))
      : "",
    selected_model: localStorage.getItem("quality_model")
      ? JSON.parse(localStorage.getItem("quality_model"))
      : "",
    selected_card: "",
    selected_stage: "",

    selected_quality: null,
  }),
  methods: {
    increment() {
      if (this.selected_model === "") {
        swal("error", "please select model first", "error");
      } else {
        let x = {};
        x.number = "";
        x.errors = [
          {
            stage: "",
            enteredBy: localStorage.getItem("id"),
            description: null,
          },
        ];
        this.errors.push(x);
      }
    },
    decrement() {
      if (this.errors.length < 2) {
        swal(
          "danger",
          "are you sure you want to delete last element",
          "warning"
        ).then((val) => {
          if (val) {
            this.errors.pop();
          }
        });
      }
      this.errors.pop();
    },
    increment1(index) {
      this.errors[index].errors.push({
        stage: "",
        enteredBy: localStorage.getItem("id"),
        description: null,
      });
    },
    decrement1(index) {
      console.log(this.errors[index].errors);
      if (
        this.errors[index].errors[this.errors[index].errors.length - 1]
          .stage === ""
      ) {
        this.errors[index].errors.pop();
      } else {
        swal(
          "danger",
          "are you sure you want to delete last element",
          "warning"
        ).then((val) => {
          if (val) {
            this.errors[index].errors.pop();
          }
        });
      }
    },
    loadorders() {
      axios.get("/api/order").then((res) => {
        console.log(res.data.data);
        res.data.data.forEach((element) => {
          let x = {};
          let uniqueArray = [];

          // Filter out repeated objects from the array
          element.models.forEach((obj) => {
            const foundObject = uniqueArray.find(
              (item) => item.id._id === obj.id._id
            );
            if (!foundObject) {
              uniqueArray.push(obj);
            }
          });
          x.name = element.name;
          x._id = element._id;
          x.models = uniqueArray;
          this.orders.push(x);
        });
        console.log(this.orders);
      });
    },

    loadmodel() {
      axios
        .get("/api/model/" + this.selected_model.id._id)
        .then((res) => {
          this.selected_model.id = res.data.data;
        })
        .then(() => {
          this.loadcards();
          this.loadquality();
        });
    },
    loadquality() {
      this.selected_model.id.stages.forEach((element) => {
        if (element.id.type === "quality") {
          this.quality.push(element);
        }

        console.log(element.id.type);
      });
      console.log(this.quality);
    },
    loadcards() {
      axios
        .get(
          "/api/card/order/" +
            this.selected_order._id +
            "/model/" +
            this.selected_model.id._id
        )
        .then((res) => {
          console.log("card", res);
          this.cards = res.data.data;
        });
    },
    check(cardErrors) {
      return new Promise((resolve) => {
        console.log("yarab er7mna");
        let x = 0;
        let y = 0;
        cardErrors.forEach(async (element) => {
          await axios
            .patch(
              "/api/card/" + this.selected_card._id + "/errors/add/check",
              {
                pieceNo: parseInt(element.pieceNo),
                pieceErrors: element.pieceErrors,
              }
            )
            .then(() => {
              y += 1;
            })
            .catch((err) => {
              y += 1;
              x += 1;
              swal("error", err.response.data.errors[0].msg, "error");
            })
            .then(() => {
              if (cardErrors.length === y) {
                resolve(x);
              }
            });
        });
      });
    },
    async submitquality() {
      localStorage.setItem(
        "quality_order",
        JSON.stringify(this.selected_order)
      );
      localStorage.setItem(
        "quality_model",
        JSON.stringify(this.selected_model)
      );
      let cardErrors = [];
      this.errors.forEach((element) => {
        let number = element.number;
        let y = [];
        element.errors.forEach((el) => {
          let x = {};
          x.enteredBy = el.enteredBy;
          x.stage = el.stage.id._id;
          x.description = el.description;
          y.push(x);
        });
        let final = { pieceNo: number, pieceErrors: y };
        cardErrors.push(final);
      });
      console.log(cardErrors);
      if (this.error) {
        console.log("im here in error");
        const checko = await this.check(cardErrors);
        console.log(checko);
        if (checko === 0) {
          let z = 0;
          cardErrors.forEach(async (element) => {
            console.log("number 1");

            await axios
              .patch("/api/card/" + this.selected_card._id + "/errors/add", {
                pieceNo: parseInt(element.pieceNo),
                pieceErrors: element.pieceErrors,
              })
              .then((res) => {
                z += 1;
                if (cardErrors.length === z) {
                  axios
                    .patch(`/api/card/${this.selected_card._id}/tracking/add`, {
                      stage: this.selected_quality.id._id,
                      employee: localStorage.getItem("employee"),
                      enteredBy: localStorage.getItem("id"),
                    })
                    .then(() => {
                      swal("success", "quality check done", "success").then(
                        () => {
                          this.$router.go(0);
                        }
                      );
                    });
                }
              });
          });
        }
      } else if (this.verify) {
        axios
          .patch(`/api/card/${this.selected_card._id}/errors/confirm`, {
            stage: this.selected_stage._id,
            verifiedBy: localStorage.getItem("id"),
          })
          .then(() => {
            axios
              .patch(`/api/card/${this.selected_card._id}/tracking/add`, {
                stage: this.selected_quality.id._id,
                employee: localStorage.getItem("employee"),
                enteredBy: localStorage.getItem("id"),
              })
              .then(() => {
                swal("success", "quality check done", "success");
                this.$router.go(0);
              });
          })
          .then(() => {
            swal("success", "verify done", "success");
          });
      } else {
        axios
          .patch(`/api/card/${this.selected_card._id}/tracking/add`, {
            stage: this.selected_quality.id._id,
            employee: localStorage.getItem("employee"),
            enteredBy: localStorage.getItem("id"),
          })
          .then(() => {
            swal("success", "quality check done", "success");
          })
          .then(() => {
            swal("success", "check done", "success");
          });
      }
    },
    loademployee() {
      axios.get("/api/employee").then((res) => {
        this.employees = res.data.data;
      });
    },
    test(t) {
      if (t.stage) {
        if (t.stage.id) {
          return t.stage.id.stageErrors;
        }
      } else {
        return [];
      }
    },
  },
  computed: {
    displayText() {
      return this.employees.map((employee) => ({
        name: `${employee.name} (${employee.code})`,
        id: employee._id,
      }));
    },
    cardsfilter() {
      return this.cards.filter(
        (element) =>
          element.history[element.history.length - 1].state !== "Finished"
      );
    },
    stageerror() {
      return this.selected_model.id.stages.filter(
        (element) => element.id.type !== "quality"
      );
    },
  },
  created() {
    this.loadorders();
    this.loademployee();
    if (localStorage.getItem("quality_model")) {
      this.loadcards();
      this.loadquality();
    }
  },
};
</script>
