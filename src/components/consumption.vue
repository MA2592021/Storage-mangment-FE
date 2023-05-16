<template>
  <transition-group name="list" tag="ul">
    <v-row class="border" v-for="(c, index) in counter" :key="c"
      ><v-col cols="12" align="center"
        ><h3>material {{ index + 1 }}</h3></v-col
      >
      <v-col cols="12" sm="4"
        ><v-autocomplete
          label="select material"
          :items="materials"
          v-model="materialselect[index]"
          return-object
          item-title="name"
        ></v-autocomplete
      ></v-col>
      <v-col cols="12" sm="3"
        ><v-text-field
          label="quantity"
          :suffix="materialselect[index] ? materialselect[index].unit : ''"
          v-model="qty[index]"
        ></v-text-field
      ></v-col>
      <v-col cols="12" sm="2"
        ><v-autocomplete
          label="select colors"
          :items="colors"
          item-title="name"
          v-model="colorselect[index]"
          chips
          multiple
          item-value="_id"
        ></v-autocomplete
      ></v-col>
      <v-col cols="12" sm="2"
        ><v-autocomplete
          label="select sizes"
          item-title="name"
          :items="sizes"
          v-model="sizeselect[index]"
          chips
          multiple
          item-value="_id"
        ></v-autocomplete
      ></v-col>
      <v-col cols="12" sm="1"
        ><v-btn icon="mdi-delete-circle" class="bg-red" @click="deletee(index)">
        </v-btn
      ></v-col>
    </v-row>
  </transition-group>
  <v-col class="mx-auto" align="center">
    <v-btn class="mt-2 mr-2" color="warning" @click="addmaterial()"
      >Add Material</v-btn
    >
    <v-btn class="mt-2" color="success" @click="save()">save</v-btn>
  </v-col>
  {{ colorselect[0] }}
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      counter: [null],
      materialselect: [],
      qty: [],
      colorselect: [],
      sizeselect: [],
      materials: [],
      consumption: [],
    };
  },
  props: {
    colors: Array,
    sizes: Array,
  },
  created() {
    axios.get("/api/material/").then((response) => {
      this.materials = response.data.data;
    });
  },
  methods: {
    addmaterial() {
      this.materialselect.push(null);
      this.colorselect.push(null);
      this.sizeselect.push(null);
      this.qty.push(null);
      this.counter.push(null);
    },
    deletee(index) {
      console.log("im alive");
      this.counter.splice(index, 1);
      this.materialselect.splice(index, 1);
      this.colorselect.splice(index, 1);
      this.sizeselect.splice(index, 1);
      this.qty.splice(index, 1);
    },

    dosomthing(selected, index) {
      console.log("im alive");
      console.log(selected);
      console.log(this.material.find((m) => m.id === index));
      this.material.find((m) => m.id === index).name = selected.name;
      this.material.find((m) => m.id === index).desc = selected.desc;
      this.material.find((m) => m.id === index).material_id =
        selected.material_id;
      this.selected = null;
    },
    save() {
      let counter = 0;
      this.consumption = [];
      this.materialselect.forEach((element) => {
        const x = {};
        x.material = element._id;
        x.quantity = this.qty[counter];
        x.sizes = this.sizeselect[counter];
        x.colors = this.colorselect[counter];
        this.consumption.push(x);
        counter += 1;
      });
      this.$emit("material_done", this.consumption);
    },
  },
};
</script>

<style>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
