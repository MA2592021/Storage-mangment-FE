<template>
  <v-dialog scrollable @input="$emit('input', $event)" persistent>
    <v-card>
      <v-card-title class="text-h5"> {{ viewobject.title }} </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" md="6">
            <p>
              name :
              {{ viewobject.name }}
            </p>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <p>total quantity with employee : {{ viewobject.qty }}</p>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <p>last operation Date : {{ viewobject.date }}</p>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-textarea
              v-model="viewobject.note"
              label="Note "
              :readonly="!isEditing"
              rows="1"
              auto-grow
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
                    @click="save()"
                  ></v-btn>
                </v-slide-x-reverse-transition> </template
            ></v-textarea> </v-col
          ><v-col cols="6" sm="6">
            <v-autocomplete
              v-model="selected"
              :items="operation"
              :label="name"
              item-title="name"
            ></v-autocomplete>
          </v-col>
          <v-col cols="3" sm="4" md="4">
            <v-text-field
              label="quantity*"
              v-model="qty"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="3" sm="2" md="2">
            <v-btn block class="mt-2">submit</v-btn>
          </v-col></v-row
        >

        <!-- {{ pages }} // {{ data.total2 }} // {{ data.data2 }} -->
        <tt v-bind:data="viewobject.data" v-bind:header="viewobject.header" />
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="red-darken-1"
          variant="text"
          @click.native="$emit('close')"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import tt from "./table.vue";
export default {
  components: {
    tt,
  },
  data() {
    return {
      sortBy: [{ key: "", order: "asc" }],
      options: {
        pageCount: 5,
      },
      search: "",
      isEditing: false,
      table: "properties",
      page: 1,
      itemsPerPage: 5,
      selected: "",
      qty: "",
      operation: [{ name: "add" }, { name: "sub" }],
      history: { note: "" },
      elementtype: {},
    };
  },
  computed: {
    pages: function () {
      return this.data.total2 / this.itemsPerPage + 0.4;
    },
  },
  props: {
    viewobject: Object,
  },

  created() {
    this.history.note = this.viewobject.note;
  },

  emits: ["tableClicked", "saveclicked"],

  methods: {
    onClick(row) {
      this.$emit("tableClicked", row);
    },

    save() {
      if (this.isEditing === false) {
        this.isEditing = true;
      } else {
        this.isEditing = false;
        // this.data.data2.note = this.history.note;
        let obj = {};
        obj.note = this.history.note;
        obj.id = this.viewobject.id;
        console.log(obj);
        console.log(this.viewobject);
        this.$emit("saveclicked", obj);
      }
    },
    submit() {
      this.elementtype.operation = this.selected;
      this.elementtype.qty = this.qty;
      this.$emit("submit", elementtype);
    },
  },
};
</script>

<style lang="scss" scoped></style>
