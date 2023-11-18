<template>
  <v-container class="fill-height">
    <v-row>
      <v-col cols="12" class="text-center"><h2>Arkan Reports Center</h2></v-col>
      <v-col cols="12">
        <v-expansion-panels variant="popout">
          <v-expansion-panel>
            <v-expansion-panel-title>
              <v-icon class="me-2">mdi-account-group</v-icon>Employees
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <employees />
            </v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel>
            <v-expansion-panel-title>
              <v-icon class="me-2">mdi-badge-account</v-icon>Users
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <users />
            </v-expansion-panel-text> </v-expansion-panel
          ><v-expansion-panel>
            <v-expansion-panel-title>
              <v-icon class="me-2">mdi-cart</v-icon>Orders
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <orders />
            </v-expansion-panel-text> </v-expansion-panel
          ><v-expansion-panel
            ><v-expansion-panel-title>
              <v-icon class="me-2">mdi-hanger</v-icon>Models
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <models />
            </v-expansion-panel-text> </v-expansion-panel
          ><v-expansion-panel
            ><v-expansion-panel-title>
              <v-icon class="me-2">mdi-card-bulleted-settings-outline</v-icon
              >Cards
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <cards />
            </v-expansion-panel-text> </v-expansion-panel
          ><v-expansion-panel
            ><v-expansion-panel-title>
              <v-icon class="me-2">mdi-sitemap</v-icon>Work Flow
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <workflow />
            </v-expansion-panel-text> </v-expansion-panel
          ><v-expansion-panel
            ><v-expansion-panel-title>
              <v-icon class="me-2">mdi-warehouse</v-icon>Storage
            </v-expansion-panel-title>
            <v-expansion-panel-text> <storage /> </v-expansion-panel-text>
          </v-expansion-panel> </v-expansion-panels
      ></v-col>
    </v-row>
  </v-container>
</template>

<script>
import employees from "../../components/reportComponents/employees.vue";
import users from "../../components/reportComponents/users.vue";
import orders from "../../components/reportComponents/orders.vue";
import models from "../../components/reportComponents/models.vue";
import cards from "../../components/reportComponents/cards.vue";
import storage from "../../components/reportComponents/storage.vue";
import workflow from "../../components/reportComponents/workflow.vue";
export default {
  components: {
    employees,
    users,
    orders,
    models,
    cards,
    workflow,
    storage,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
