<template>
  <v-card class="mx-auto" elevation="2" style="width: 100%"
    ><v-row
      ><v-col cols="3" sm="2"
        ><v-img
          class="bg-white"
          width="300"
          :aspect-ratio="1"
          :src="model.image ? model.image.data : '/arkan_logo-no-text.png'"
          cover
        ></v-img></v-col
      ><v-col cols="9" sm="10">
        <v-row>
          <v-col cols="8">
            <v-text-field
              :label="$t(`name`) + '*'"
              required
              :readonly="dis === true"
              v-model="model.name"
              variant="underlined"
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              :label="$t(`code`) + '*'"
              required
              :readonly="dis === true"
              v-model="model.code"
              variant="underlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-autocomplete
              v-model="model.sizes"
              :items="sizes"
              chips
              multiple
              :clearable="dis === false"
              :label="$t(`sizes`) + '*'"
              item-title="name"
              :readonly="dis === true"
              return-object
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-autocomplete
              v-model="model.colors"
              :items="colors"
              chips
              :clearable="dis === false"
              multiple
              return-object
              :label="$t(`colors`) + '*'"
              item-title="name"
              :readonly="dis === true"
            ></v-autocomplete>
          </v-col>

          <v-col cols="12" sm="6"
            ><v-textarea
              :clearable="dis === false"
              :label="$t(`note`) + '*'"
              v-model="model.note"
              :readonly="dis"
              prepend-inner-icon="mdi-note-text-outline"
            ></v-textarea>
          </v-col>
          <v-col cols="12" sm="6"
            ><v-textarea
              :clearable="dis === false"
              :label="$t(`details`) + '*'"
              v-model="model.details"
              :readonly="dis"
              prepend-inner-icon="mdi-note-text-outline"
            ></v-textarea>
          </v-col>
        </v-row> </v-col></v-row
    ><v-card-actions class="mx-auto">
      <v-btn
        @click="cancel()"
        :prepend-icon="dis ? 'mdi-circle-edit-outline' : 'mdi-cancel'"
      >
        {{ dis ? $t("edit") : $t("cancel") }}
      </v-btn>
      <v-btn
        class="ml-auto"
        :disabled="dis === true || isEditing === true"
        prepend-icon="mdi-delete-circle"
        color="red"
        @click="deletee()"
      >
        {{ $t("delete") }}
      </v-btn>
      <v-btn
        class="ml-auto"
        :disabled="dis === true || isEditing === true"
        prepend-icon="mdi-check-outline"
        color="green"
        @click="save()"
      >
        {{ $t("save") }}
      </v-btn>
    </v-card-actions>
  </v-card>
  <v-card class="mt-3" style="width: 100%">
    <modelpanel
      v-bind:stages="model.stages"
      v-bind:consumption="model.consumption"
      v-bind:name="model.name"
      v-bind:colors="model.colors"
      v-bind:sizes="model.sizes"
      v-bind:id="this.$route.params.id"
    />
  </v-card>
</template>

<script>
import modelpanel from "../../components/modelpanel.vue";
import axios from "axios";
import { useheaders } from "../../stores/headers";

export default {
  components: { modelpanel },

  data: () => ({
    isdisabled: true,
    dis: true,
    model: {},
    orgmodel: {},
    sizes: [],
    colors: [],
    obj: {},
    temp: [],
  }),
  created() {
    //GEtet route here
    this.colorsload();
    this.sizesload();
    this.modelload();
  },

  setup() {
    const headers = useheaders();

    return {
      headers,
    };
  },
  methods: {
    testoo() {
      this.temp.push();
      this.temp.push(this.colors);
      console.log(this.temp);
    },
    modelload() {
      axios.get("/api/model/" + this.$route.params.id).then((response) => {
        this.orgmodel = response.data.data;
        console.log(response);
        this.clone();
      });
    },
    colorsload() {
      axios.get("/api/color/").then((response) => {
        this.colors = response.data.data;
      });
    },
    sizesload() {
      axios.get("/api/size/").then((response) => {
        this.sizes = response.data.data;
      });
    },
    clone() {
      console.log("im cloning");
      this.model.name = this.orgmodel.name;
      this.model.sizes = this.orgmodel.sizes;
      this.model.image = this.orgmodel.image;
      this.model.colors = this.orgmodel.colors;
      this.model.stages = this.orgmodel.stages;
      this.model.orders = this.orgmodel.orders;
      this.model.consumption = this.orgmodel.consumptions;
      this.model.code = this.orgmodel.code;
      this.model.note = this.orgmodel.note;
      this.model.details = this.orgmodel.details;
    },
    cancel() {
      this.dialog = false;
      this.dialog1 = false;
      this.dis = !this.dis;
      this.isEditing = false;

      this.clone();
    },
    save() {
      let colors = [];
      this.model.colors.forEach((el) => {
        colors.push(el._id);
      });
      let sizes = [];
      this.model.sizes.forEach((el) => {
        console.log(el);
        sizes.push(el._id);
      });
      console.log(sizes);
      axios
        .patch("/api/model/" + this.$route.params.id, {
          note: this.model.note,
          details: this.model.details,
          name: this.model.name,
          code: this.model.code,
          sizes: sizes,
          colors: colors,
        })
        .then((response) => {
          if (response.data.errors) {
            swal("error", response.data.errors[0].msg, "error");
          } else {
            swal("success", "model updated successfully", "success");
            this.modelload();
            this.dis = true;
          }
        });

      //save route here
    },
    deletee() {
      swal({
        title: "Are you sure?",
        text: "Are you sure that you want to delete this model?",
        icon: "warning",
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          swal("enter your password", {
            content: "input",
          }).then((value) => {
            axios
              .post("/api/auth/testCredentials", {
                code: localStorage.getItem("code"),
                password: value,
              })
              .then((response) => {
                if (response.data.errors) {
                  swal("error", response.data.errors[0].msg, "error");
                } else {
                  axios
                    .delete("/api/model/" + this.$route.params.id)
                    .then((response) => {
                      swal("success", "model deleted successfully", "success");
                      this.$router.push({ path: "/model/all" });
                    });
                }
              });
          });
        }
      });
    },
  },
};
</script>
