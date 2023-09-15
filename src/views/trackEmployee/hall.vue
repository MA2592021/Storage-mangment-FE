<template>
  <div v-if="view === 1">
    <v-data-table
      v-model:items-per-page="itemsPerPage"
      :headers="header"
      :items="data"
      :page="currentPage"
      :sort-by="sortBy"
      class="elevation-1"
      multi-sort
    >
      <template v-slot:bottom="">
        <div align="center" class="ma-2">Page Number {{ currentPage }}</div>
      </template>
      <template v-slot:item.todayWorkRate="{ item }">
        <v-chip :color="+item.raw.todayWorkRate >= 60 ? 'green' : 'red'">
          {{ item.raw.todayWorkRate }}
        </v-chip>
      </template>
      <template v-slot:item.todayErrorRate="{ item }">
        <v-chip :color="+item.raw.todayErrorRate < 20 ? 'green' : 'red'">
          {{ item.raw.todayErrorRate }}
        </v-chip>
      </template>
      <template v-slot:item.monthWorkRate="{ item }">
        <v-chip :color="+item.raw.monthWorkRate >= 60 ? 'green' : 'red'">
          {{ item.raw.monthWorkRate }}
        </v-chip>
      </template>
    </v-data-table>
  </div>

  <div v-if="view === 0">
    error
    <v-data-table
      v-model:items-per-page="itemsPerPage"
      :headers="headerError"
      :items="errors"
      :page="currentPage"
      class="elevation-1"
      multi-sort
    >
      <template v-slot:bottom="">
        <div align="center" class="ma-2">Page Number {{ currentPage }}</div>
      </template>
      <template v-slot:item.fromnow="{ item }">
        <v-chip :color="timeago(item.raw.date)">
          {{ momentdate(item.raw.date) }}
        </v-chip>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import { socket } from "../../socket";
export default {
  data() {
    return {
      view: 0,
      interval: null,
      maininterval: null,
      errorinterval: null,
      itemsPerPage: 8,
      currentPage: 1,
      currentErrorPage: 1,
      TotalErrorPages: 1,
      totalPages: 1,
      data: [],
      errors:
        JSON.parse(localStorage.getItem("errors")) === null
          ? []
          : JSON.parse(localStorage.getItem("errors")),
      sortBy: [
        {
          order: "desc",
          key: "workRate",
        },
      ],
      header: [
        {
          title: "الاسم",
          align: "start",
          key: "employeeName",
        },
        {
          title: "معدل انتاج اليوم",
          align: "start",
          key: "todayWorkRate",
        },
        {
          title: "معدل اخطاء اليوم",
          align: "start",
          key: "todayErrorRate",
        },
        {
          title: "انتاجية اليوم",
          align: "start",
          key: "todayPieces",
        },
        {
          title: "معدل انتاج الشهر",
          align: "start",
          key: "monthWorkRate",
        },
      ],
      headerError: [
        {
          title: "كود الكارتة",
          align: "start",
          key: "cardCode",
        },
        {
          title: "عدد الاخطاء",
          align: "start",
          key: "currentErrorsLength",
        },
        {
          title: "الوقت",
          align: "start",
          key: "fromnow",
        },
      ],
    };
  },
  methods: {
    loadsalaries() {
      axios.get("/api/Salary/summary").then((res) => {
        console.log(res.data);
        this.data = res.data.data;
        this.totalPages = Math.ceil(res.data.data.length / 10);
      });
    },
    errorview() {
      this.view = 0;
      if (this.interval !== null) {
        clearInterval(this.interval);
        this.interval = null;
      }
      if (this.errorinterval === null) {
        this.errorinterval = setInterval(() => {
          if (this.errors.length === 0) {
          } else if (+this.currentErrorPage >= +this.TotalErrorPages) {
            this.currentErrorPage = 1;
          } else {
            this.currentErrorPage++;
          }
          console.log(this.currentErrorPage, this.TotalErrorPages);
        }, 5000);
      }
    },
    workview() {
      this.view = 1;
      if (this.errorinterval !== null) {
        clearInterval(this.errorinterval);
        this.errorinterval = null;
      }
      if (this.interval === null) {
        this.interval = setInterval(() => {
          if (this.data.length === 0) {
          } else if (+this.currentPage >= +this.totalPages) {
            this.currentPage = 1;
          } else {
            this.currentPage++;
          }
          console.log(this.currentPage, this.totalPages);
        }, 5000);
      }
    },
    timeago(time) {
      const currentTime = moment();
      const inputTime = moment(time);
      const duration = moment.duration(currentTime.diff(inputTime));
      const minutesDifference = duration.asMinutes();

      if (minutesDifference < 30) {
        return "green";
      }
      return "red";
    },
    momentdate(value) {
      if (value === null) {
        return "not started yet";
      } else {
        return moment(value).calendar();
      }
    },
  },
  created() {
    this.loadsalaries();
    socket.on(
      "errors",
      (message) => {
        this.errors.push(message);
        this.TotalErrorPages = Math.ceil(this.errors.length / 10);
      },
      1500
    );
    socket.on(
      "errorConfirm",
      (message) => {
        this.errors = this.errors.filter(
          (obj) => obj.cardID !== message.cardID
        );
        this.TotalErrorPages = Math.ceil(this.errors.length / 10);
      },
      1500
    );
  },
  mounted() {
    if (this.maininterval === null) {
      this.maininterval = setInterval(() => {
        const minute = new Date().getMinutes();
        if (minute === 1) {
          console.log("yeaa");
          this.workview();
        } else {
          console.log("nooo");
          this.errorview();
        }
      }, 5000);
    }
  },
  beforeUnmount() {
    clearInterval(this.maininterval);
    clearInterval(this.interval);
    clearInterval(this.errorinterval);
  },
  watch: {
    errors: {
      handler(newValue, oldValue) {
        console.log("sheaaa working");
        localStorage.setItem("errors", JSON.stringify(this.errors));
      },
      deep: true,
    },
  },
};
</script>
