<template>
  <v-date-picker
    v-model:model-value="dates"
    multiple
    @update:model-value="dateformatter"
  ></v-date-picker>
  <div v-for="item in filteredItems">
    {{ item.code }} - {{ item.createdAt }}
  </div>
</template>
<script>
import { filterItemsByDateRange } from "@/services/dateFilter.js";
import * as card from "@/services/cards.js";
export default {
  data() {
    return {
      startDate: "",
      endDate: "",
      items: [],
      dates: [],
    };
  },
  computed: {
    filteredItems() {
      return filterItemsByDateRange(this.items, this.startDate, this.endDate);
    },
  },
  methods: {
    dateformatter() {
      const orgstartdate = new Date(this.dates[0]);
      orgstartdate.setDate(orgstartdate.getDate() + 1);
      //console.log(orgstartdate);
      this.startDate = orgstartdate.toISOString();
      if (this.dates.length === 2) {
        const orgenddate = new Date(this.dates[1]);
        orgenddate.setDate(orgenddate.getDate() + 1);
        //console.log(orgenddate);
        this.endDate = orgenddate.toISOString();
      } else {
        this.endDate = "";
      }
    },
  },
  created() {
    console.log("start");
    card.GetAll().then((data) => {
      this.items = data;
      console.log(data);
    });
  },
};
</script>
