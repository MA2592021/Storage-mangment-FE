// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import { createVuetify } from "vuetify";
import { VDataTable } from "vuetify/labs/VDataTable";
// import { VSkeletonLoader } from "vuetify/labs/VSkeletonLoader";
import { VDatePicker } from "vuetify/labs/VDatePicker";
export default createVuetify({
  components: {
    VDataTable,
    VDatePicker,
    // VSkeletonLoader,
  },
});

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
