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
              :readonly="!isEditing"
              variant="underlined"
              ><template v-slot:append>
                <v-slide-x-reverse-transition mode="out-in">
                  <v-btn
                    size="x-small"
                    :key="`icon-${isEditing}`"
                    :color="isEditing ? 'success' : 'error'"
                    :icon="
                      isEditing
                        ? 'mdi-check-outline'
                        : 'mdi-circle-edit-outline'
                    "
                    :disabled="dis === true"
                    @click="isEditing = !isEditing"
                  ></v-btn>
                </v-slide-x-reverse-transition> </template
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
      <v-btn
        @click="dis = !dis"
        :prepend-icon="dis ? 'mdi-circle-edit-outline' : 'mdi-cancel'"
      >
        {{ dis ? "edit" : "cancel" }}
      </v-btn>
      <v-btn
        class="ml-auto"
        :disabled="dis === true"
        prepend-icon="mdi-check-outline"
        color="green"
      >
        Save
      </v-btn>
    </v-card-actions></v-card
  >
  <v-card class="mt-3" style="width: 100%">
    <v-expansion-panels variant="popout" class="my-4">
      <paneltable
        v-bind:data="data"
        v-bind:header="headers"
        v-bind:panelname="panelname"
        v-bind:openedtitle="openedtitle"
        v-bind:closedtitle="closedtitle"
        v-bind:name="panelname"
        v-bind:link="link"
        @clicked="onClickChild"
      />
      <paneltable
        v-bind:data="data1"
        v-bind:header="headers1"
        v-bind:panelname="panelname1"
        v-bind:openedtitle="openedtitle1"
        v-bind:closedtitle="closedtitle"
        v-bind:link="link"
        v-bind:name="panelname1"
        @clicked="onClickChild"
      /> </v-expansion-panels
  ></v-card>
  <popuptest v-model="dialog" @close="dialog = !dialog" />
</template>

<script>
import tt from "../../components/table.vue";
import paneltable from "../../components/paneltable.vue";
import popuptest from "../../components/popuptest.vue";

export default {
  components: { tt, paneltable, popuptest },

  data: () => ({
    name: "el gamal",
    link: "",
    test: { name: "amir", age: "12", testo: "besto", lesto: "festo" },
    isdisabled: true,
    dialog: false,
    panelname: "properties",
    panelname1: "materials",
    closedtitle: "El gamal",
    openedtitle: "properties with El gamal",
    openedtitle1: "materials with El gamal",
    code: "2232",
    role: "supervisor",
    nid: "12141243523123",
    phone: "01110133639",
    img: "",
    dis: true,
    isEditing: false,
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
  methods: {
    onClickChild(value) {
      console.log(value); // someValue
    },
  },
};
</script>
