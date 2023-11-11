<template>
  <div>
    <v-radio-group v-model="type" :disabled="loading">
      <v-radio label="بدأ وقت عطلة " value="start"></v-radio>
      <v-radio label="انهاء وقت عطلة " value="end"></v-radio>
    </v-radio-group>
    <v-row>
      <v-col cols="12">
        <v-autocomplete
          :loading="loading"
          v-model="selectedEmployee"
          :items="employees"
          item-title="name"
          return-object
          :label="$t('employees.employees')"
          @update:modelValue="detectEmployee"
        >
          <template v-slot:append-inner>
            <v-fade-transition leave-absolute>
              <v-progress-circular
                v-if="loading1"
                color="info"
                indeterminate
                size="24"
              ></v-progress-circular>

              <v-icon
                v-if="selectedEmployeeDetails.idle"
                color="green"
                icon="mdi-check-bold"
              ></v-icon>
              <v-icon
                v-if="!selectedEmployeeDetails.idle"
                color="red"
                icon="mdi-close-thick"
              ></v-icon>
            </v-fade-transition>
          </template>
        </v-autocomplete>
      </v-col>
      <v-col cols="12" v-if="type === 'start'">
        <v-select
          :loading="loading"
          chips
          label="اختر سبب العطلة"
          :items="['سوء تغذية', 'عطل ماكينة', 'تصليحات', 'اخري']"
          v-model="selectedReason"
        ></v-select>
      </v-col>
      <v-col cols="12" v-if="selectedReason === 'اخري' && type === 'start'">
        <v-text-field
          :loading="loading"
          placeholder="اكتب السبب"
          v-model="typedReason"
        ></v-text-field>
      </v-col>
      <v-col cols="12" v-if="type === 'end'">
        <v-text-field
          :loading="loading"
          v-model="selectedDate"
          type="datetime-local"
        ></v-text-field>
      </v-col>
      <v-col cols="12" align="center"
        ><v-btn @click="submit" :loading="loading" color="success">{{
          $t("submit")
        }}</v-btn></v-col
      >
    </v-row>
  </div>
</template>

<script>
import axios from "axios";
import swal from "sweetalert";
import moment from "moment";
export default {
  data() {
    return {
      loading: false,
      loading1: false,
      type: null,
      selectedEmployee: "",
      selectedReason: "",
      typedReason: "",
      employees: [],
      selectedDate: "",
      selectedEmployeeDetails: "",
    };
  },
  methods: {
    load_employees() {
      axios.get("/api/employee").then((res) => {
        this.employees = res.data.data;
      });
    },
    submit() {
      if (this.selectedEmployee !== "" && this.type !== null) {
        if (this.type === "start") {
          if (this.selectedReason !== "")
            if (this.selectedReason === "اخري") {
              if (this.typedReason !== "") {
                console.log("submit");
              } else {
                this.errormsg();
              }
            } else {
              this.submitStart();
            }
          else {
            this.errormsg();
          }
        } else if (this.type === "end") {
          if (this.selectedDate !== "") {
            if (
              moment(this.selectedDate).isBefore(
                this.selectedEmployeeDetails.start
              )
            ) {
              swal(
                "error",
                `end Date cant be before Start Date ${moment(
                  this.selectedEmployeeDetails.start
                ).calendar()}`,
                "error"
              );
            } else {
              this.submitEnd();
            }
          } else {
            this.errormsg();
          }
        } else {
          this.errormsg();
        }
      } else {
        this.errormsg();
      }
    },
    errormsg() {
      swal("error", "برجاء اكمال كل المدخلات", "error");
    },
    successmsg() {
      swal("success", "تمت العملية بنجاح", "success");
    },
    submitStart() {
      console.log(this.selectedEmployee._id);
      this.loading = true;
      axios
        .patch("/api/salary/idle/add", {
          reason:
            this.selectedReason === "اخري"
              ? this.typedReason
              : this.selectedReason,
          employee: this.selectedEmployee._id,
          addedBy: localStorage.getItem("employee"),
        })
        .then(() => {
          this.successmsg();
          this.loading = false;
        });
    },
    submitEnd() {
      const selectedMoment = moment(this.selectedDate);

      // Get the current date-time
      const currentMoment = moment();

      // Calculate the difference in minutes
      const differenceInMinutes = selectedMoment.diff(currentMoment, "minutes");
      console.log(differenceInMinutes);
      this.loading = true;

      if (differenceInMinutes >= 0) {
        // console.log(this.selectedEmployee, localStorage.getItem("employee"));
        axios
          .patch("/api/salary/idle/remove", {
            employee: this.selectedEmployee._id,
            doneBy: localStorage.getItem("employee"),
          })
          .then(() => {
            this.successmsg();
            this.loading = false;
            console.log("test");
          });
      } else {
        axios
          .patch("/api/salary/idle/remove", {
            employee: this.selectedEmployee._id,
            doneBy: localStorage.getItem("employee"),
            minus: +differenceInMinutes * -1,
          })
          .then(() => {
            this.successmsg();
            this.loading = false;
          });
      }
    },
    detectEmployee() {
      this.loading1 = true;
      axios
        .get(`/api/salary/idle/check/${this.selectedEmployee._id}`)
        .then((res) => {
          this.selectedEmployeeDetails = res.data;
          console.log(res);
          this.loading1 = false;
        });
    },
  },

  created() {
    this.load_employees();
  },
};
</script>
