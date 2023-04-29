<template>
  <v-dialog scrollable @input="$emit('input', $event)" persistent>
    <v-card>
      <v-card-title class="text-h5"> {{ title }} </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" md="6">
            <p>
              name :
              {{
                data.data2.property ? data.data2.property : data.data2.material
              }}
            </p>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <p>total quantity with employee : {{ data.data2.totalQuantity }}</p>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <p>last operation Date : {{ data.data2.lastDate }}</p>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-textarea
              required
              v-model="data.data2.note"
              label="Note "
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
            ></v-textarea> </v-col
        ></v-row>

        {{ prop.data }}
        <v-text-field
          v-model="search"
          label="Search"
          single-line
          hide-details
          class="mt-5"
        ></v-text-field>
        <v-data-table
          v-model:page="page"
          :headers="data.headers2"
          :items="data.data2.history"
          :search="search"
          :items-per-page="itemsPerPage"
          v-model:sort-by="sortBy"
          hover
          hide-default-footer
          @update:options="options = $event"
        >
          <template v-slot:item="{ item }">
            <tr @click="onClick(item.columns)">
              <td v-ripple v-for="h in data.headers2" :key="h.key">
                {{ item.columns[`${h.key}`] }}
              </td>
            </tr>
          </template>
          <template v-slot:bottom>
            <div class="text-center pt-2">
              <v-pagination
                v-model="page"
                class="my-4"
                :length="pages.toFixed()"
              ></v-pagination>
              <v-text-field
                :model-value="itemsPerPage"
                class="pa-2"
                label="Items per page"
                type="number"
                min="-1"
                max="15"
                hide-details
                @update:model-value="itemsPerPage = parseInt($event, 10)"
              ></v-text-field>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="green-darken-1"
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
import { usetable } from "../stores/tabledata";
import { usepropemp } from "../stores/propemployee";
export default {
  props: {
    title: String,
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
    };
  },
  computed: {
    pages: function () {
      return this.data.total2 / this.itemsPerPage + 0.4;
    },
  },
  props: {
    type: String,
  },
  setup() {
    const data = usetable();
    const prop = usepropemp();
    return { data, prop };
  },
  emits: ["tableClicked"],

  methods: {
    onClick(row) {
      this.$emit("tableClicked", row);
    },
    edit() {
      if (this.isEditing === false) {
        this.isEditing = true;
      } else {
        this.data.data2.note = this.note;
        this.isEditing = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
