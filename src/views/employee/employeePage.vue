<template>
  <v-card class="mx-auto" elevation="2" style="width: 100%"
    ><v-row
      ><v-col cols="3" sm="2"
        ><v-img
          class="bg-white"
          width="300"
          :aspect-ratio="1"
          src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
          cover
        ></v-img></v-col
      ><v-col cols="9" sm="10">
        <v-row>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              label="Name "
              required
              :readonly="dis === true"
              v-model="name"
              variant="underlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              required
              label="Code "
              :readonly="dis === true"
              v-model="code"
              variant="underlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              label="Phone number "
              variant="underlined"
              :readonly="dis === true"
              v-model="phone"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              required
              v-model="nid"
              label="National ID "
              :readonly="dis === true"
              variant="underlined"
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="6">
            <v-autocomplete
              label="Role "
              v-model="role"
              variant="underlined"
              :readonly="dis === true"
              :items="['Supervisor', 'Employee']"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" sm="6"
            ><v-textarea
              clearable
              label="Note"
              v-model="note"
              :readonly="dis === true"
              prepend-icon="mdi-note-text-outline"
            ></v-textarea>
          </v-col>
        </v-row> </v-col></v-row
    ><v-card-actions class="mx-auto">
      <v-btn @click="dis = !dis"> Edit </v-btn>
      <v-btn class="ml-auto" :disabled="dis === true"> Save </v-btn>
    </v-card-actions></v-card
  >
  <v-card class="mt-3" style="width: 100%">
    <v-expansion-panels variant="popout" class="my-4">
      <v-expansion-panel>
        <v-expansion-panel-title>
          <template v-slot:default="{ expanded }">
            <v-row no-gutters>
              <v-col cols="4" class="d-flex justify-start"> properties </v-col>
              <v-col cols="8" class="text-grey">
                <v-fade-transition leave-absolute>
                  <span v-if="expanded" key="0">
                    properties with {{ name }}
                  </span>
                  <span v-else key="1">
                    {{ name }}
                  </span>
                </v-fade-transition>
              </v-col>
            </v-row>
          </template>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <tt v-bind:data="data" v-bind:header="headers" />
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-title>
          <template v-slot:default="{ expanded }">
            <v-row no-gutters>
              <v-col cols="4" class="d-flex justify-start"> materials </v-col>
              <v-col cols="8" class="text-grey">
                <v-fade-transition leave-absolute>
                  <span v-if="expanded" key="0">
                    materials with {{ name }}
                  </span>
                  <span v-else key="1">
                    {{ name }}
                  </span>
                </v-fade-transition>
              </v-col>
            </v-row>
          </template>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <tt v-bind:data="data1" v-bind:header="headers1" />
        </v-expansion-panel-text>
      </v-expansion-panel> </v-expansion-panels
  ></v-card>
</template>

<script>
import tt from "../../components/table.vue";
export default {
  components: { tt },
  data: () => ({
    name: "el gamal",
    code: "2232",
    role: "supervisor",
    nid: "12141243523123",
    phone: "01110133639",
    img: "",
    dis: true,
    note: "lailo lailo lailo la la la ",
    headers: [
      {
        align: "start",
        key: "ID",
        sortable: false,
        title: "ID",
      },
      { title: "property", key: "property" },
      { title: "quantity", key: "quantity" },
    ],
    data: [
      {
        ID: "1",
        property: "ma2s",
        quantity: "14",
      },
      {
        ID: "2",
        property: "ma2sat",
        quantity: "4",
      },
      {
        ID: "12",
        property: "mastra",
        quantity: "2",
      },
    ],
    headers1: [
      {
        align: "start",
        key: "ID",
        sortable: false,
        title: "ID",
      },
      { title: "material", key: "material" },
      { title: "quantity", key: "quantity" },
    ],
    data1: [
      {
        ID: "1",
        material: "2omash white",
        quantity: "14",
      },
      {
        ID: "2",
        material: "habwww",
        quantity: "4",
      },
      {
        ID: "12",
        material: "2omash ezwd",
        quantity: "2",
      },
    ],
  }),
};
</script>
