<template>
  <v-card elevation="0" style="width: 100%">
    <v-card-title class="text-center">
      <v-icon icon="mdi-plus" style="color: #fbc02d" class="mb-2"></v-icon>
      <span class="text-h5" style="color: #fbc02d">Add Supplier</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              :label="$t('name') + `*`"
              v-model="supplier.name"
              required
              hint="Required"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="3" md="3">
            <v-text-field
              required
              v-model="supplier.phoneNo"
              :label="$t('phone') + `*`"
              hint="Required"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="3" md="3">
            <v-text-field
              :label="$t('state') + `*`"
              v-model="supplier.state"
              hint="Required"
              required
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="6">
            <v-textarea
              clearable
              :label="$t('address') + `*`"
              v-model="supplier.address"
              prepend-inner-icon="mdi-note-text-outline"
            ></v-textarea>
          </v-col>

          <v-col cols="12" sm="6"
            ><v-textarea
              clearable
              :label="$t('note')"
              v-model="supplier.note"
              prepend-inner-icon="mdi-note-text-outline"
            ></v-textarea>
          </v-col>

          <v-col cols="12" sm="12">
            <imageuploader @image="imageup" />
          </v-col>
        </v-row>
      </v-container>
      <small>*indicates required field</small>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="green-darken-1" variant="text" @click="add">
        {{ $t("save") }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import imageuploader from "../../components/imageuploader.vue";
import axios from "axios";
import swal from "sweetalert";
export default {
  components: { imageuploader },
  data: () => ({
    rules: [
      (value) => {
        return (
          !value ||
          !value.length ||
          value[0].size < 2000000 ||
          "Avatar size should be less than 2 MB!"
        );
      },
    ],
    url: null,
    image: null,
    supplier: {
      name: "",
      phoneNo: "",
      state: "",
      address: "",
      img: "",
      note: "    ",
    },
    roles: [],
  }),
  created() {
    axios.get("/api/role").then((response) => {
      this.roles = response.data.data;
    });
  },
  methods: {
    add() {
      console.log("im alive");
      axios
        .post("/api/supplier", {
          name: this.supplier.name,
          phoneNo: this.supplier.phoneNo,
          state: this.supplier.state,
          address: this.supplier.address,
          note: this.supplier.note,
          image: this.supplier.img,
        })
        .then((response) => {
          if (response.data.errors) {
            console.log(response);
            swal("error", response.data.errors[0].msg, "error");
          } else {
            swal("success", "supplier created successfully", "success").then(
              () => this.$router.push({ path: "/supplier/all" })
            );
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    imageup(image) {
      this.supplier.img = image;
    },
  },
};
</script>
