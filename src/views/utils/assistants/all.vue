<template>
  <v-row class="mt-5">
    <v-col cols="12">
      <v-data-table :headers="headers" :items="assists" class="elevation-1">
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
                          v-model="selectedorder"
                          label="select order"
                          :items="order"
                          item-title="name"
                          return-object
                        ></v-autocomplete>
                      </v-col>
                      <v-col cols="12">
                        <v-autocomplete
                          v-model="selectedmodel"
                          label="select model"
                          :items="selectedorder.models"
                          item-title="id.name"
                          return-object
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
import axios from "axios";
import swal from "sweetalert";

export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    assists: [],
    headers: [
      { title: "code", key: "code" },
      {
        title: "name",
        align: "start",
        sortable: false,
        key: "name",
      },
      { title: "order", key: "work.order.name" },
      { title: "model", key: "work.model.name" },

      { title: "Actions", key: "actions", align: "center", sortable: false },
    ],
    order: [],
    selectedorder: "",
    selectedmodel: "",
    editedIndex: -1,
    editedItem: {
      name: "",
      order: { models: [] },
      model: "0",
    },
    defaultItem: {
      name: "",
      order: "",
      model: "",
    },
  }),
  created() {
    this.loadassist();
    this.loadorder();
  },
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
      this.editedIndex = this.assists.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    close() {
      this.dialog = false;
    },
    loadassist() {
      this.assists = [];
      axios.get("/api/userEmployee/").then((res) => {
        res.data.data.forEach((element) => {
          let x = {};
          x._id = element._id;
          x.name = element.employee.name;
          x.code = element.employee.code;
          x.work = element.work[element.work.length - 1];
          this.assists.push(x);
        });
      });
    },
    loadorder() {
      axios.get("/api/order").then((res) => {
        this.order = res.data.data;
      });
    },
    save() {
      axios
        .patch("/api/userEmployee/work/" + this.editedItem._id, {
          order: this.selectedorder._id,
          model: this.selectedmodel.id._id,
        })
        .then((res) => {
          swal("success", "assistant work updated successfully", "success");
          this.dialog = false;
          this.loadassist();
        });
      this.close();
    },
  },
};
</script>

<style lang="scss" scoped></style>
