<template>
  <v-data-table
    v-model:items-per-page="itemsPerPage"
    :headers="headers"
    :items="consumptions"
    :sort-by="sortBy"
    item-value="name"
    class="elevation-1 mt-4"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title align="center"
          >Update `{{ model.name }}` Consumptions
        </v-toolbar-title>
        <v-btn @click="add" variant="tonal" color="info"
          >+ Add Consumption</v-btn
        >
      </v-toolbar></template
    >
    <template v-slot:item.quantity="props">
      <v-text-field
        v-model="props.item.raw.quantity"
        label="quantity"
      ></v-text-field>
    </template>
    <template v-slot:item.colors="props">
      <v-autocomplete
        label="colors"
        :items="colors"
        item-title="name"
        item-value="_id"
        chips
        multiple
        v-model="props.item.raw.colors"
      >
        <template v-slot:prepend-item>
          <v-list-item
            ripple
            @click="
              props.item.raw.colors = toggle(props.item.raw.colors, colors)
            "
          >
            <v-list-item-content>
              <v-list-item-title
                v-if="props.item.raw.colors.length !== colors.length"
                >Select All</v-list-item-title
              >
              <v-list-item-title v-else>UnSelect All</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider class="mt-2"></v-divider> </template
      ></v-autocomplete>
    </template>
    <template v-slot:item.sizes="props">
      <v-autocomplete
        label="sizes"
        :items="sizes"
        item-title="name"
        item-value="_id"
        chips
        multiple
        v-model="props.item.raw.sizes"
      >
        <template v-slot:prepend-item>
          <v-list-item
            ripple
            @click="props.item.raw.sizes = toggle(props.item.raw.sizes, sizes)"
          >
            <v-list-item-content>
              <v-list-item-title
                v-if="props.item.raw.sizes.length !== sizes.length"
                >Select All</v-list-item-title
              >
              <v-list-item-title v-else>UnSelect All</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider class="mt-2"></v-divider> </template
      ></v-autocomplete>
    </template>
    <template v-slot:item.material="props">
      <v-autocomplete
        :error="props.item.raw.error"
        :error-messages="
          props.item.raw.error === true ? 'please check this consumption' : ''
        "
        label="consumptions"
        :items="data"
        item-title="name"
        item-value="_id"
        v-model="props.item.raw.material"
      ></v-autocomplete>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-btn
        color="red"
        @click="deletee(item.raw.id)"
        icon="mdi-delete-circle"
      ></v-btn>
    </template>
  </v-data-table>
  <v-row>
    <v-col align="center" class="ma-4"
      ><v-btn variant="tonal" color="red" @click="cancel" class="mr-4"
        >Cancel</v-btn
      >

      <v-btn variant="tonal" color="success" @click="save">Update</v-btn></v-col
    >
  </v-row>
</template>

<script>
import axios from "axios";
import swal from "sweetalert";
export default {
  data() {
    return {
      data: [],
      consumptions: [],
      orgconsumptions: [],
      itemsPerPage: 5,
      colors: [],
      sizes: [],
      headers: [
        {
          title: "Choose material",
          align: "center",
          sortable: false,
          key: "material",
          width: "30%",
        },

        { title: "quantity", align: "center", key: "quantity" },

        { title: "colors", width: "20%", align: "center", key: "colors" },
        { title: "sizes", width: "20%", align: "center", key: "sizes" },
        { title: "Actions", align: "center", key: "actions" },
      ],
      sortBy: [{ key: "priority", order: "asc" }],
      model: { name: "" },
    };
  },
  created() {
    axios
      .get("/api/model/" + this.$route.params.id)
      .then((res) => {
        console.log(res.data.data);
        res.data.data.consumptions.forEach((el) => {
          const x = {};
          x.id = this.id();
          x.material = el.material._id;
          x.colors = el.colors.map(({ id, ...rest }) => rest);
          x.sizes = el.sizes;
          x.quantity = el.quantity;
          this.consumptions.push(x);
        });
        this.orgconsumptions = this.deepCloneArray(this.consumptions);
        this.colors = res.data.data.colors;
        this.sizes = res.data.data.sizes;
        console.log(this.orgconsumptions);
        this.model.name = res.data.data.name;
        //console.log(this.colors);
        //console.log(this.model);
      })
      .then(() => {
        axios.get("/api/material").then((res) => {
          this.data = res.data.data;
          //console.log(this.data);
        });
      });
  },
  methods: {
    toggle(selectedArray, dataArray) {
      if (dataArray.length === selectedArray.length) {
        selectedArray = [];
      } else {
        selectedArray = dataArray.slice();
      }
      return selectedArray;
    },
    deepCloneArray(arr) {
      return arr.map((item) =>
        Array.isArray(item) ? deepCloneArray(item) : { ...item }
      );
    },
    getArrayDifference(arr1, arr2) {
      return arr1.filter(
        (item1) => !arr2.some((item2) => item1["id"] === item2["id"])
      );
    },
    add() {
      this.consumptions.push({
        id: this.id(),
        //name: "",
        error: false,
      });
    },
    cancel() {
      swal("", "are you sure you want to Cancel?", "info").then((val) => {
        if (val) {
          this.$router.go(-1);
        }
      });
    },
    async save() {
      const diff = this.getArrayDifference(
        this.consumptions,
        this.orgconsumptions
      );
      console.log(diff);
      let er = 0;
      diff.forEach((element) => {
        if (
          !element.material ||
          !element.quantity ||
          !element.colors ||
          !element.sizes
        ) {
          element.error = true;
          er++;
        } else {
          element.error = false;
        }
      });
      if (er === 0) {
        console.log("imhere");
        console.log("diff", diff);
        axios
          .patch(`/api/model/consumptions/add/${this.$route.params.id}`, {
            consumptions: diff.map((diff) => ({
              colors: diff.colors,
              sizes: diff.sizes,
              material: diff.material,
              quantity: diff.quantity,
            })),
          })
          .then((res) => {
            swal(
              "success",
              "consumptions updated successfully",
              "success"
            ).then((val) => {
              if (val) {
                this.$router.push({ path: "/model/" + this.$route.params.id });
              }
            });
          });
      } else {
        swal("error", "there is empty consumptions", "error");
      }
    },

    deletee(id) {
      swal("Are you sure want to delete this stage").then((val) => {
        if (val) {
          const diff = this.getArrayDifference(
            this.consumptions,
            this.orgconsumptions
          );
          const found = diff.findIndex((el) => el.id === id);
          const index = this.consumptions.findIndex((el) => el.id === id);
          if (found === -1) {
            console.log(this.consumptions[index]);
            axios
              .patch(
                `/api/model/consumptions/remove/${this.$route.params.id}`,
                {
                  consumptions: [this.consumptions[index].material],
                }
              )
              .then(() => {
                this.consumptions.splice(index, 1);
                this.orgconsumptions.splice(index, 1);
                swal("success", "stage deleted successfully", "success");
              });
          } else {
            this.consumptions.splice(index, 1);
            swal("success", "stage deleted successfully", "success");
          }
        }
      });
    },

    id() {
      // Create a random ID using Math.random() and Date.now()
      const id = Math.random().toString(36).substr(2) + Date.now().toString(36);
      return id;
    },
  },
};
</script>
