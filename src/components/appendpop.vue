<template>
  <v-dialog :value="value" persistent width="1024">
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
                :items="realdata"
                :label="name"
                item-title="name"
                return-object
              ></v-autocomplete>
            </v-col>
            <v-col cols="3" sm="2" md="2">
              <v-text-field
                label="avilable"
                variant="solo"
                v-model="selected.available"
                readonly
                required
              ></v-text-field>
            </v-col>
            <v-col cols="3" sm="4" md="4">
              <v-text-field
                label="quantity*"
                v-model="selected.qty"
                required
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
        <small>*indicates required field</small>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="$emit('close')">
          Close
        </v-btn>
        <v-btn
          color="blue-darken-1"
          variant="text"
          @click="$emit('submit', selected)"
          class="text-green"
        >
          submit
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";
import swal from "sweetalert";
export default {
  data: () => ({
    selected: "",
    data: [
      { name: "ma2s", _id: "12", avl: "12" },
      { name: "2omash", _id: "2", avl: "12" },
      { name: "5ara", _id: "3", avl: "12" },
      { name: "el gamal", _id: "44", avl: "12" },
    ],
    realdata: "",
  }),
  props: {
    value: "value",
    link: String,
  },
  created() {
    axios.get(this.link.get).then((response) => {
      console.log(response);
      if (response.data.errors) {
        swal("error", response.data.errors[0].msg, "error");
      } else {
        this.realdata = response.data.data;
      }
    });
  },
  methods: {},
};
</script>
