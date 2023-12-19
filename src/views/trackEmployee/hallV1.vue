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
</template>

<script>
import axios from "axios";

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
  },
  created() {
    this.loadsalaries();
    this.workview();
  },
  mounted() {
    if (this.maininterval === null) {
      this.maininterval = setInterval(() => {
        this.loadsalaries();
      }, 60000);
    }
  },
  beforeUnmount() {
    clearInterval(this.maininterval);
    clearInterval(this.interval);
  },
};
</script>
