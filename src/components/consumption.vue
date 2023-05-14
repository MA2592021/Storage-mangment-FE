<template>
  <transition-group name="list" tag="ul"> <h1>testo</h1></transition-group>
  <v-col class="mx-auto" align="center">
    <v-btn class="mt-2 mr-2" color="warning" @click="addmaterial()"
      >Add Material</v-btn
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
    addmaterial() {
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
    },
    deletee(id) {
      console.log("im alive");
      this.material.splice(
        this.material.findIndex((m) => m.id === id),
        1
      );
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
