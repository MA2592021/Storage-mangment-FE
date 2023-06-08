<template>
  <v-row class="mt-5">
    <v-col cols="12">
      <v-data-table
        :headers="headers"
        :items="desserts"
        :sort-by="[{ key: 'calories', order: 'asc' }]"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title align="center">Assistants</v-toolbar-title>
            <v-dialog v-model="dialog" max-width="500px">
              <v-card>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <v-autocomplete
                          v-model="editedItem.order"
                          label="select order"
                          :items="['dafa1', 'dafa2', 'mnask1', 'mnask2']"
                        ></v-autocomplete>
                      </v-col>
                      <v-col cols="12">
                        <v-autocomplete
                          v-model="editedItem.model"
                          label="select model"
                          :items="['dafa', 'mnask', 'abo elfeda']"
                        ></v-autocomplete>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue-darken-1" variant="text" @click="close">
                    Cancel
                  </v-btn>
                  <v-btn color="blue-darken-1" variant="text" @click="save">
                    Save
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon size="small" class="me-2" @click="editItem(item.raw)">
            mdi-pencil
          </v-icon>
        </template>
      </v-data-table>
    </v-col></v-row
  >
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      { title: "code", key: "code" },
      {
        title: "name",
        align: "start",
        sortable: false,
        key: "name",
      },
      { title: "order", key: "order" },
      { title: "model", key: "model" },

      { title: "Actions", key: "actions", align: "center", sortable: false },
    ],
    desserts: [
      {
        code: "231",
        name: "el gamal",
        order: "dafa1",
        model: "abo el feda",
      },
      {
        code: "106",
        name: "sherif",
        order: "dafa2",
        model: "mnask",
      },
      {
        code: "58",
        name: "Amir",
        order: "dafa1",
        model: "mnask",
      },
    ],
    editedIndex: -1,
    editedItem: {
      name: "",
      order: "0",
      model: "0",
    },
    defaultItem: {
      name: "",
      order: "",
      model: "",
    },
  }),

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  methods: {
    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem);
      } else {
        this.desserts.push(this.editedItem);
      }
      this.close();
    },
  },
};
</script>

<style lang="scss" scoped></style>
