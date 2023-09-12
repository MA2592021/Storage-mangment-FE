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
      <template v-slot:item.totalCost="{ item }">
        {{ +item.raw.totalCost.toFixed(2) }}
      </template>
      <template v-slot:item.todayCost="{ item }">
        {{ +item.raw.todayCost.toFixed(2) }}
      </template>
      <template v-slot:item.workRate="{ item }">
        <v-chip :color="+item.raw.workRate > 50 ? 'green' : 'red'">
          {{ item.raw.workRate.toFixed(1) }}%
        </v-chip>
      </template>
      <template v-slot:item.errorRate="{ item }">
        <v-chip :color="+item.raw.errorRate < 20 ? 'green' : 'red'">
          {{ item.raw.errorRate.toFixed(1) }}%
        </v-chip>
      </template>
      <template v-slot:item.index="{ item }">
        <v-chip :color="+item.raw.index + 1 <= 10 ? 'green' : 'red'">
          {{ item.raw.index + 1 }}
        </v-chip>
      </template>
    </v-data-table>
  </div>

  <div v-if="view === 0">error view</div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      view: 0,
      interval: null,
      maininterval: null,
      itemsPerPage: 8,
      currentPage: 1,
      totalPages: 0,
      data: [],
      sortBy: [
        {
          order: "desc",
          key: "workRate",
        },
      ],
      header: [
        // {
        //   title: "Rank",
        //   align: "start",
        //   key: "index",
        // },
        // {
        //   title: "code",
        //   align: "start",
        //   key: "employee[code]",
        // },

        {
          title: "name",
          align: "start",
          key: "employee[name]",
        },
        {
          title: "Work Rate",
          align: "start",
          key: "workRate",
        },
        {
          title: "Error Rate",
          align: "start",
          key: "errorRate",
        },
        {
          title: "today pieces",
          align: "start",
          key: "todayPieces",
        },
        {
          title: "Month Pieces ",
          align: "start",
          key: "totalPieces",
        },

        // {
        //   title: "today cost ",
        //   align: "start",
        //   key: "todayCost",
        // },
        // {
        //   title: "Month cost ",
        //   align: "start",
        //   key: "totalCost",
        // },
      ],
    };
  },
  methods: {
    loadsalaries() {
      axios.get("/api/Salary/all").then((res) => {
        console.log(res.data);
        let temp = [];

        res.data.data.forEach((element, index) => {
          const x = {};
          //x.index = index;
          x.workRate = 0;
          x.errorRate = 0;
          let noError = 0;
          let qty = 0;
          x.totalCost = element.totalCost;
          x.todayCost = element.todayCost;
          x.totalPieces = element.totalPieces;
          x.todayPieces = element.todayPieces;
          x.employee = element.employee;
          element.totalWorkPerMonth.forEach((el) => {
            x.workRate += +(+el.quantity / (+el.stage.rate * 8 * 26));
            noError += +el.noOfErrors;
            qty += +el.quantity;
          });
          x.workRate = +x.workRate * 100;
          x.errorRate = (+noError / qty) * 100;
          temp.push(x);
        });
        temp.sort((a, b) => {
          return +b.workRate - +a.workRate;
        });
        temp.forEach((element, index) => {
          const x = {};
          x.totalCost = element.totalCost;
          x.todayCost = element.todayCost;
          x.totalPieces = element.totalPieces;
          x.todayPieces = element.todayPieces;
          x.employee = element.employee;
          x.workRate = element.workRate;
          x.errorRate = element.errorRate;
          x.index = index;
          this.data.push(x);
        });
        //this.data = temp;
        this.totalPages = Math.ceil(res.data.data.length / 10);
        console.log(res);
      });
    },
    errorview() {
      this.view = 0;
      if (this.interval !== null) {
        clearInterval(this.interval);
        this.interval = null;
      }
    },
    workview() {
      this.view = 1;
      if (this.interval === null) {
        this.interval = setInterval(() => {
          if (this.data.length === 0) {
          } else if (+this.currentPage === +this.totalPages) {
            this.currentPage = 1;
          } else {
            this.currentPage++;
          }
          console.log(this.currentPage, this.totalPages);
        }, 5000);
      }
    },
  },
  created() {},
  mounted() {
    if (this.maininterval === null) {
      this.maininterval = setInterval(() => {
        const minute = new Date().getMinutes();
        if (minute > 30) {
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
  },
};
</script>
