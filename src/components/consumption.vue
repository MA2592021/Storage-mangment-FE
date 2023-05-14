<template>
  <transition-group name="list" tag="ul">
    <v-sheet
      elevation="12"
      rounded="lg"
      width="100%"
      class="pa-1 ma-2 text-center mx-auto"
      v-for="(material, index) in material"
      :key="material"
    >
      <div class="text-overline mb-1">material {{ index + 1 }}</div>
      <v-autocomplete
        v-model="selected1[index]"
        :items="data"
        item-title="name"
        label="select material"
        return-object
        @update:modelValue="dosomthing(selected, material.id)"
      ></v-autocomplete>
      <v-row
        ><v-col cols="6" sm="12">
          <v-autocomplete
            v-model="selected2[index]"
            :items="colors"
            item-title="name"
            label="select colors"
            multiple
            chips
            return-object
            @update:modelValue="dosomthing(selected, material.id)"
          ></v-autocomplete> </v-col
        ><v-col cols="6" sm="12">
          <v-autocomplete
            v-model="selected3[index]"
            :items="sizes"
            item-title="name"
            label="select sizes"
            multiple
            chips
            return-object
            @update:modelValue="dosomthing(selected, material.id)"
          ></v-autocomplete> </v-col
      ></v-row>

      <h2 class="text-h5 mb-6">{{ material.name }}</h2>

      <p
        class="mb-4 text-medium-emphasis text-body-2"
        v-for="color in material.colors"
      >
        {{ color.name }}

        <br />

        Stage ID is : {{ stage.stage_id }}
        <br />
        id {{ stage.id }}
      </p>

      <v-divider class="mb-4"></v-divider>
      <v-row
        ><v-col cols="6">
          <v-btn
            class="text-none ma-1"
            color="red"
            rounded
            variant="flat"
            width="90"
            @click="deletee(stage.id)"
          >
            Delete
          </v-btn>
        </v-col>
        <v-col cols="6">
          <v-btn
            class="text-none ma-1"
            color="warning"
            rounded
            variant="flat"
            width="90"
            @click="up(stage.id)"
          >
            &uarr; up
          </v-btn>
          <v-btn
            class="text-none ma-1"
            color="warning"
            rounded
            variant="flat"
            width="90"
            @click="down(stage.id)"
          >
            &darr; down
          </v-btn>
        </v-col></v-row
      >
    </v-sheet></transition-group
  >
  <v-col class="mx-auto" align="center">
    <v-btn class="mt-2 mr-2" color="warning" @click="addstage()"
      >Add Stage</v-btn
    >
    <v-btn class="mt-2" color="success" @click="save()">save</v-btn></v-col
  >
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      material: [
        {
          id: "0",
          material: { name: "material name", _id: "23423" },
          sizes: [
            { name: "xl", _id: "232" },
            { name: "xl", _id: "232" },
            { name: "xl", _id: "232" },
          ],
          colors: [
            { name: "red", _id: "#333" },
            { name: "red", _id: "#333" },
            { name: "red", _id: "#333" },
          ],
        },
      ],
      realmaterial: [],
      id: 0,
      selected1: [],
      selected2: [],
      selected3: [],
      materials: [],
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
    addstage() {
      this.id += 1;
      this.material.push({
        id: this.id,
        name: "material name",
        sizes: [
          { name: "xl", _id: "232" },
          { name: "xl", _id: "232" },
          { name: "xl", _id: "232" },
        ],
        colors: [
          { name: red, _id: "#333" },
          { name: red, _id: "#333" },
          { name: red, _id: "#333" },
        ],
      });
      this.selected1.push(null);
      this.selected2.push(null);
      this.selected3.push(null);
    },
    deletee(id) {
      console.log("im alive");
      this.material.splice(
        this.material.findIndex((m) => m.id === id),
        1
      );
    },
    up(id) {
      console.log("im alive");

      const index = this.material.findIndex((m) => m.id === id);
      if (index - 1 === -1) {
      } else {
        const element = this.material.find((m) => m.id === id);
        this.deletee(id);
        this.material.splice(index - 1, 0, element);
        console.log(element, index);
      }
    },
    down(id) {
      console.log("im alive");

      const index = this.material.findIndex((m) => m.id === id);
      if (index + 1 === this.material.length) {
      } else {
        console.log(index, this.material.length);
        const element = this.material.find((m) => m.id === id);
        this.deletee(id);
        this.material.splice(index + 1, 0, element);
        // console.log(element, index);
      }
    },
    dosomthing(selected, index) {
      console.log("im alive");
      console.log(selected);
      console.log(this.material.find((m) => m.id === index));
      this.material.find((m) => m.id === index).name = selected.name;
      this.material.find((m) => m.id === index).desc = selected.desc;
      this.material.find((m) => m.id === index).stage_id = selected.stage_id;
      this.selected = null;
    },
    save() {
      let counter = 0;

      this.realmaterial = [];
      this.material.forEach((element) => {
        const x = {};

        x.id = element.id;
        x.piriority = counter;
        this.realmaterial.push(x);
        counter += 1;
      });
      this.$emit("material_done", this.realmaterial);
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
