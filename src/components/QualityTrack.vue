<template>
  <v-row>
    <v-col cols="12">
      <v-autocomplete
        :label="$t(`order`)"
        :items="orders"
        item-title="name"
        return-object
        inputmode="numeric"
        v-model="selectedOrder"
      ></v-autocomplete>
    </v-col>
    <v-col cols="12">
      <v-autocomplete
        :label="$t(`model`)"
        :items="selectedOrder !== null ? selectedOrder.models : ''"
        item-title="name"
        item-value="id"
        inputmode="numeric"
        v-model="selectedModel"
        @update:modelValue="load_cards"
      ></v-autocomplete>
    </v-col>
    <v-col cols="12">
      <v-autocomplete
        :label="$t(`card code`)"
        :items="cards"
        inputmode="numeric"
        item-title="code"
        v-model="selectedCard"
        return-object
      ></v-autocomplete>
    </v-col>
    <v-col cols="12">
      <v-autocomplete
        :label="$t(`quality phase code`)"
        :items="qulaityStages"
        item-title="name"
        item-value="id"
        v-model="selectQuality"
      ></v-autocomplete>
    </v-col>

    <v-col cols="12">
      <v-checkbox
        @update:modelValue="have_error_check"
        :label="$t(`have errors`)"
        v-model="haveError"
      ></v-checkbox>
    </v-col>
  </v-row>
  <!-- error section -->

  <v-row class="mt-3">
    <v-col cols="12">
      <v-data-table
        v-if="haveError"
        :headers="headers"
        :items="errors"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title align="center"
              >{{ errors.length }} {{ $t(`errors`) }}</v-toolbar-title
            ><v-btn color="info" variant="tonal" @click="add_error">
              + {{ $t(`add stage`) }}
            </v-btn></v-toolbar
          ></template
        >
        <template v-slot:item.description="props">
          <v-autocomplete
            label="description"
            :items="
              props.item.raw.stage !== null
                ? props.item.raw.stage.stageErrors
                : ''
            "
            inputmode="numeric"
            v-model="props.item.raw.description"
          ></v-autocomplete
        ></template>
        <template v-slot:item.pieces="props">
          <v-autocomplete
            label="pieces"
            :items="selectedCard.range"
            clearable
            multiple
            chips
            inputmode="numeric"
            v-model="props.item.raw.pieces"
            return-object
          ></v-autocomplete>
        </template>
        <template v-slot:item.stage="props">
          <v-autocomplete
            :error="props.item.raw.error"
            :error-messages="
              props.item.raw.error === true ? 'please check this stage' : ''
            "
            label="stage"
            :items="availableStages"
            item-title="name"
            return-object
            inputmode="numeric"
            v-model="props.item.raw.stage"
          ></v-autocomplete>
        </template>
        <template v-slot:item.actions="index">
          <v-btn
            color="red"
            @click="delete_error(index)"
            icon="mdi-delete-circle"
            class="ml-2"
          ></v-btn>
        </template> </v-data-table
    ></v-col>
    <v-col align="center"
      ><v-btn color="success" :loading="loading" @click="submit()">{{
        $t(`submit`)
      }}</v-btn></v-col
    >
  </v-row>
</template>

<script>
import axios from "axios";
import swal from "sweetalert";
export default {
  data() {
    return {
      nav: "track",
      errorBadge: 0,
      haveError: false,
      loading: false,
      ///
      selectedOrder: localStorage.getItem("quality_order")
        ? JSON.parse(localStorage.getItem("quality_order"))
        : "",
      selectedModel: localStorage.getItem("quality_model")
        ? localStorage.getItem("quality_model")
        : "",

      selectQuality: localStorage.getItem("quality_stage")
        ? localStorage.getItem("quality_stage")
        : "",
      selectedCard: "",
      ///
      headers: [
        {
          title: "stage",
          align: "start",
          sortable: false,
          key: "stage",
          width: "30%",
        },
        {
          title: "description",
          align: "center",
          sortable: false,
          key: "description",
          width: "20%",
        },
        {
          title: "pieces",
          align: "center",
          sortable: false,
          key: "pieces",
          width: "30%",
        },
        {
          title: "Actions",
          align: "center",
          sortable: false,
          key: "actions",
        },
      ],
      cards: [],
      modelStages: [],
      errors: [],
    };
  },
  methods: {
    //// page logic
    id() {
      // Create a random ID using Math.random() and Date.now()
      const id = Math.random().toString(36).substr(2) + Date.now().toString(36);
      return id;
    },
    add_error() {
      this.errors.push({
        id: this.id(),
        stage: "",
        description: "",
        pieces: [],
        error: false,
      });
    },
    sub_error() {
      if (this.errors[this.errors.length - 1].stage === "") {
        this.errors.pop();
      } else {
        swal("info", "are you sure want to delete last element", "info").then(
          (val) => {
            if (val) {
              this.errors.pop();
            }
          }
        );
      }
    },
    delete_error(index) {
      console.log(index);
      swal("info", "are you sure want to delete last element", "info").then(
        (val) => {
          if (val) {
            this.errors.splice(index.index, 1);
          }
        }
      );
    },
    have_error_check() {
      if (this.haveError === true) {
        this.haveError = false;
      } else {
        if (this.selectedCard === "") {
          swal("error", "please select card first", "error").then(() => {
            this.haveError = false;
          });
        } else {
          this.haveError = true;
        }
      }
    },
    card_piece_range(start, end) {
      //console.log(start, "start", "end", end);
      const pieces = [];
      for (let i = parseInt(start); i <= parseInt(end); i++) {
        pieces.push(i);
      }
      return pieces;
    },
    async dublicate_check() {
      const lookup = await this.errors.reduce((a, e) => {
        const key = `${e.stage.id}_${e.description}`; // Combine _id and name as a key
        a[key] = ++a[key] || 0;
        return a;
      }, {});

      return this.errors.filter((e) => {
        const key = `${e.stage.id}_${e.description}`; // Combine _id and name as a key
        return lookup[key] > 0;
      });
    },
    async check() {
      let emptyError = 0;
      this.errors.forEach((element) => {
        if (element.stage === "" || element.pieces.length === 0) {
          element.error = true;
          emptyError++;
        } else {
          element.error = false;
        }
      });
      if (emptyError === 0) {
        const dubs = await this.dublicate_check();
        if (dubs.length === 0) {
          return true;
        } else {
          this.errors.forEach((el) => (el.error = false));
          dubs.forEach((element) => {
            const index = this.errors.findIndex(
              (error) => error.id === element.id
            );
            this.errors[index].error = true;
          });
          return false;
        }
      } else {
        return false;
      }
    },
    restart() {
      this.selectedCard = "";
      this.errors = [];
      this.haveError = false;
    },
    //// Loaders

    load_cards() {
      if (this.selectedModel !== "") {
        axios
          .get(
            `/api/card/order/${this.selectedOrder.id}/model/${this.selectedModel}`
          )
          .then((res) => {
            this.cards = res.data.data
              .filter((card) => !card.done)
              .map((card) => ({
                code: card.code + ` (box '${card.boxNumber}' )`,
                tracking: card.tracking,
                start: card.startRange,
                end: card.endRange,
                range: this.card_piece_range(card.startRange, card.endRange),
                id: card._id,
              }));
            this.load_model_stages();
            //console.log("cards", this.cards);
          });
      }
    },
    load_model_stages() {
      if (this.selectedModel !== null) {
        axios.get("/api/model/" + this.selectedModel).then((res) => {
          this.modelStages = res.data.data.stages;

          //console.log(this.modelStages);
        });
      }
    },
    ////// submits
    async submit() {
      this.loading = true;
      const check = await this.check();
      console.log("check result", check ? "success" : "failed");
      if (check === true) {
        localStorage.setItem("quality_model", this.selectedModel);
        localStorage.setItem(
          "quality_order",
          JSON.stringify(this.selectedOrder)
        );
        localStorage.setItem("quality_stage", this.selectQuality);
        axios
          .get(
            `/api/card/${this.selectedCard.id}/stage/${this.selectQuality}/isTracked`
          )
          .then((res) => {
            console.log(res);
            if (res.data.tracked !== true) {
              axios
                .patch(`/api/card/${this.selectedCard.id}/tracking/add`, {
                  stage: this.selectQuality,
                  employee: localStorage.getItem("employee"),
                  enteredBy: localStorage.getItem("employee"),
                })
                .then(() => {
                  if (this.haveError) {
                    this.submit_errors();
                  }
                })
                .catch(() => {
                  if (this.haveError) {
                    this.submit_errors();
                  }
                });
            } else {
              this.submit_errors();
            }
          });
      } else {
        this.loading = false;
      }
    },
    submit_errors() {
      if (this.haveError === true) {
        const errors = this.errors.map((error) => ({
          stage: error.stage.id,
          description: error.description,
          pieces: error.pieces,
        }));
        //console.log("errors", errors);
        axios
          .patch(`/api/card/${this.selectedCard.id}/errors/add`, {
            employee: localStorage.getItem("employee"),
            cardErrors: errors,
          })
          .then((res) => {
            //console.log("add error", res);
            swal("success", "errors added successfully", "success").then(() => {
              this.restart();
              this.loading = false;
            });
          })
          .catch(() => {
            this.loading = false;
          });
      }
    },
  },
  props: {
    orders: Array,
  },
  created() {
    if (this.selectedModel !== "") {
      console.log(this.selectedModel);
      this.load_model_stages();
      this.load_cards();
    }
  },
  computed: {
    qulaityStages() {
      return this.modelStages
        .filter((stage) => stage.id.type === "quality")
        .map((stage) => ({
          name: stage.id.name + ` ( ${stage.id.code} )`,
          id: stage.id._id,
        }));
    },
    availableStages() {
      if (this.selectedCard !== "") {
        return this.modelStages
          .filter(
            (stage) =>
              stage.id.type !== "quality" &&
              this.selectedCard.tracking.some(
                (track) => track.stage === stage.id._id
              )
          )
          .map((stage) => ({
            name: stage.id.name + ` ( ${stage.id.code} )`,
            id: stage.id._id,
            stageErrors: stage.id.stageErrors,
          }));
      } else {
        return "";
      }
    },
  },
};
</script>
