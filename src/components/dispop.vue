<template>
  <v-row justify="center" class="mt-4">
    <v-dialog v-model="dialog" persistent width="1024">
      <template v-slot:activator="{ props }">
        <v-btn color="primary" v-bind="props"> Append {{ name }} </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5"
            >disappend
            {{
              data.data2.property ? data.data2.property : data.data2.material
            }}</span
          >
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row
              ><v-col cols="12" sm="6">
                <v-autocomplete
                  v-model="selected"
                  :items="operation"
                  label="operations"
                  item-title="name"
                  return-object
                ></v-autocomplete> </v-col
              ><v-col cols="12" sm="2" md="2">
                <v-text-field
                  label="total quantity"
                  readonly
                  v-model="data.data2.totalQuantity"
                  variant="solo"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-text-field
                  label="quantity*"
                  v-model="qty"
                  required
                ></v-text-field>
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
import { usetable } from "../stores/tabledata";

export default {
  data: () => ({
    dialog: false,
    selected: "",
    qty: "",
    operation: [{ name: "add" }, { name: "sub" }],
  }),
  setup() {
    const data = usetable();

    return { data };
  },
  props: {
    name: String,
    link: String,
  },
  methods: {},
};
</script>
