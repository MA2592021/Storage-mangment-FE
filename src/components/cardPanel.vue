<template>
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-title>
        <template v-slot:default="{ expanded }">
          <v-row no-gutters>
            <v-col cols="4" class="d-flex justify-start"> stages </v-col>
            <v-col cols="8" class="text-grey">
              <v-fade-transition leave-absolute>
                <span v-if="expanded" key="0">
                  {{ name }}
                </span>
                <span v-else key="1"> stages History {{ name }} </span>
              </v-fade-transition>
            </v-col>
          </v-row>
        </template>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-row>
          <v-col col="6" xs="12" align="center">
            <v-data-table
              v-model:items-per-page="itemsPerPage"
              :headers="headers1"
              :items="stages"
              class="elevation-1"
            >
              <template v-slot:item.duration="{ item }">
                <v-chip>
                  {{ item.raw.duration }}
                </v-chip>
              </template>
            </v-data-table>
            <div align="center" class="ma-2">
              <v-btn class="mx-auto" color="info" @click="printo(1)"
                >print
              </v-btn>
            </div></v-col
          >
        </v-row>
      </v-expansion-panel-text> </v-expansion-panel
    ><v-expansion-panel>
      <v-expansion-panel-title>
        <template v-slot:default="{ expanded }">
          <v-row no-gutters>
            <v-col cols="4" class="d-flex justify-start"> Errors </v-col>
            <v-col cols="8" class="text-grey">
              <v-fade-transition leave-absolute>
                <span v-if="expanded" key="0">
                  {{ code }}
                </span>
                <span v-else key="1"> Errors in {{ code }} </span>
              </v-fade-transition>
            </v-col>
          </v-row>
        </template>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-row>
          <v-col col="6" xs="12" align="center">
            <v-data-table
              :group-by="groupBy"
              v-model:items-per-page="itemsPerPage"
              :headers="headers"
              :items="errors"
              hover
              item-value="name"
              class="elevation-1"
            >
              <template v-slot:item.dateout="{ item }">
                <v-chip
                  :color="item.columns.dateout === null ? 'red' : 'green'"
                >
                  {{
                    item.columns.dateout === null
                      ? "not Fixed yet"
                      : item.columns.dateout
                  }}
                </v-chip>
              </template>
              <template v-slot:item.verifiedBy="{ item }">
                <v-chip
                  :color="item.columns.verifiedBy === null ? 'red' : 'green'"
                >
                  {{
                    item.columns.verifiedBy === null
                      ? "not Fixed yet"
                      : item.columns.verifiedBy
                  }}
                </v-chip>
              </template>
              <template v-slot:item.doneBy="{ item }">
                <v-chip :color="item.columns.doneBy === null ? 'red' : 'green'">
                  {{
                    item.columns.doneBy === null
                      ? "not Fixed yet"
                      : item.columns.doneBy
                  }}
                </v-chip>
              </template>
            </v-data-table>
            <div align="center" class="ma-2">
              <v-btn class="mx-auto" color="info" @click="printo(2)"
                >print
              </v-btn>
            </div></v-col
          >
        </v-row>
      </v-expansion-panel-text>
    </v-expansion-panel>
    <v-expansion-panel>
      <v-expansion-panel-title>
        <template v-slot:default="{ expanded }">
          <v-row no-gutters>
            <v-col cols="4" class="d-flex justify-start"> Global Errors </v-col>
            <v-col cols="8" class="text-grey">
              <v-fade-transition leave-absolute>
                <span v-if="expanded" key="0">
                  {{ code }}
                </span>
                <span v-else key="1"> Errors in {{ code }} </span>
              </v-fade-transition>
            </v-col>
          </v-row>
        </template>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-row>
          <v-col col="6" xs="12" align="center">
            <v-data-table
              v-model:items-per-page="itemsPerPage"
              :headers="headers2"
              :items="globalErrors"
              hover
              item-value="name"
              class="elevation-1"
            >
              <template v-slot:item.dateout="{ item }">
                <v-chip
                  :color="item.columns.dateout === null ? 'red' : 'green'"
                >
                  {{
                    item.columns.dateout === null
                      ? "not Fixed yet"
                      : item.columns.dateout
                  }}
                </v-chip>
              </template>
              <template v-slot:item.verifiedBy="{ item }">
                <v-chip
                  :color="item.columns.verifiedBy === null ? 'red' : 'green'"
                >
                  {{
                    item.columns.verifiedBy === null
                      ? "not Fixed yet"
                      : item.columns.verifiedBy
                  }}
                </v-chip>
              </template>
              <template v-slot:item.doneBy="{ item }">
                <v-chip :color="item.columns.doneBy === null ? 'red' : 'green'">
                  {{
                    item.columns.doneBy === null
                      ? "not Fixed yet"
                      : item.columns.doneBy
                  }}
                </v-chip>
              </template>
            </v-data-table>
            <div align="center" class="ma-2">
              <v-btn class="mx-auto" color="info" @click="printo(2)"
                >print
              </v-btn>
            </div></v-col
          >
        </v-row>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import moment from "moment";
import { usedata } from "../stores/print_data";
import axios from "axios";
export default {
  data() {
    return {
      itemsPerPage: 5,
      dis: true,
      headers: [
        {
          title: "stage",
          align: "start",
          sortable: false,
          key: "stage",
        },

        { title: "description", key: "description" },
        { title: "Added by", key: "addedBy" },
        { title: "employee", key: "doneBy" },
        { title: "assistant", key: "assist" },
        { title: "verifed by", key: "verifiedBy" },
        { title: "Date in", key: "datein" },
        { title: "Date out", key: "dateout" },
      ],
      headers2: [
        { key: "number", title: "piece number" },
        { title: "description", key: "description" },
        { title: "Added by", key: "addedBy" },
        { title: "verifed by", key: "verifiedBy" },
        { title: "Date in", key: "datein" },
        { title: "Date out", key: "dateout" },
      ],
      groupBy: [{ key: "number", order: "asc" }],
      headers1: [
        {
          title: "name",
          align: "start",
          sortable: false,
          key: "stage[name]",
        },

        {
          title: "employee",
          align: "start",
          key: "employee",
        },
        {
          title: "assistant name",
          align: "start",
          key: "assist",
        },
        {
          title: "time finished",
          align: "start",
          key: "date",
        },
        {
          title: "duration",
          align: "start",
          key: "duration",
        },
      ],

      card: "",
      stages: "",
      errors: [],
      globalErrors: [],
      id: 1,
    };
  },

  created() {
    this.loadcard();
  },
  setup() {
    const print_data = usedata();
    return { print_data };
  },
  methods: {
    loadcard() {
      axios.get("/api/card/" + this.$route.params.id).then((res) => {
        this.card = res.data.data;
        this.makethings();
        this.makeerror();
        this.makeglobalerror();
      });
    },

    timeago(index) {
      console.log(index);
      if (index + 1 === this.card.tracking.length) {
        return "not finished yet";
      } else {
        const currentTime = moment(this.card.tracking[index + 1].dateOut);
        const inputTime = moment(this.card.tracking[index].dateOut);
        const duration = moment.duration(currentTime.diff(inputTime));
        const minutesDifference = Math.floor(duration.asMinutes());

        return minutesDifference + " minutes";
      }
    },
    makethings() {
      console.log(this.card);
      let y = [];

      this.card.tracking.forEach((element, index) => {
        let x = {};
        x.date = moment(element.dateOut).calendar();

        element.employee
          ? (x.employee = element.employee.name + ` (${element.employee.code})`)
          : "";
        element.enteredBy
          ? (x.assist = element.enteredBy.name + ` (${element.enteredBy.code})`)
          : "";
        x.stage = element.stage;
        x.duration = this.timeago(index);

        y.push(x);
      });
      this.stages = y;
      console.log(this.stages);
    },
    makeerror() {
      let y = [];
      this.card.cardErrors.forEach((element) => {
        element.pieceErrors.forEach((el) => {
          let x = {};
          x.number = element.pieceNo;
          x.id = this.id;
          x.datein = moment(el.dateIn).calendar();
          x.dateout = el.dateOut ? moment(el.dateOut).calendar() : null;
          x.description = el.description;
          x.verifiedBy = el.verifiedBy
            ? el.verifiedBy.name + ` (${el.verifiedBy.code})`
            : null;
          el.addedBy
            ? (x.addedBy = el.addedBy.name + ` (${el.addedBy.code})`)
            : "";
          x.assist = el.enteredBy
            ? el.enteredBy.name + ` (${el.enteredBy.code})`
            : null;
          x.doneBy = el.doneBy ? el.doneBy.name + ` (${el.doneBy.code})` : null;
          x.stage = el.stage.name;
          y.push(x);
        });
        this.id++;
      });
      this.errors = y;
      console.log(y);
    },
    makeglobalerror() {
      let y = [];
      this.card.globalErrors.forEach((element) => {
        let x = {};
        x.number = element.pieceNo ? element.pieceNo : "no piece number";
        x.addedBy = element.addedBy.name + ` (${element.addedBy.code})`;
        x.id = this.id;
        x.datein = moment(element.dateIn).calendar();
        x.dateout = element.dateOut ? moment(element.dateOut).calendar() : null;
        x.description = element.description;
        x.verifiedBy = element.verifiedBy
          ? element.verifiedBy.name + ` (${element.verifiedBy.code})`
          : null;
        x.doneBy = element.doneBy
          ? element.doneBy.name + ` (${element.doneBy.code})`
          : null;
        y.push(x);
        this.id++;
      });
      this.globalErrors = y;
      console.log("y", y);
    },
    printo(x) {
      if (x === 1) {
        this.print_data.title = "stages done in card  " + this.code;
        this.print_data.data = this.stages;
        this.print_data.header = this.headers1;
        this.$router.push({ path: "/print" });
      } else if (x === 2) {
        this.print_data.title = "Errors in card " + this.code;
        this.print_data.data = this.errors;
        this.print_data.header = this.headers;
        console.log(this.print_data);
        this.$router.push({ path: "/print" });
      }
    },
  },
  props: {
    code: String,
  },
};
</script>
