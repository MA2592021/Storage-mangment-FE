<template>
  <v-row justify="center" class="mt-4">
    <v-dialog v-model="dialog" persistent width="1024">
      <template v-slot:activator="{ props }">
        <v-btn color="primary" v-bind="props"> Append {{ name }} </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">Append {{ name }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row
              ><v-col cols="12" sm="6">
                <v-autocomplete
                  v-model="selected"
                  :items="data"
                  :label="name"
                  item-title="name"
                  return-object
                ></v-autocomplete> </v-col
              ><v-col cols="12" sm="2" md="2">
                <v-text-field
                  label="available"
                  readonly
                  v-model="selected.avl"
                  variant="solo"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-text-field label="quantity*" required></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="dialog = false">
            Close
          </v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="dialog = false">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    selected: "",
    data: [
      { name: "ma2s", id: "12", avl: "12" },
      { name: "2omash", id: "2", avl: "12" },
      { name: "5ara", id: "3", avl: "12" },
      { name: "el gamal", id: "44", avl: "12" },
    ],
  }),
  props: {
    name: String,
    link: String,
  },
  methods: {},
};
</script>
