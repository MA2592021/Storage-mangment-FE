<template>
  <transition-group name="list" tag="ul">
    <v-sheet
      elevation="12"
      rounded="lg"
      width="100%"
      class="pa-1 ma-2 text-center mx-auto"
      v-for="(stage, index) in stages"
      :key="stage"
    >
      <div class="text-overline mb-1">stage number {{ index + 1 }}</div>
      <v-autocomplete
        v-model="selected"
        :items="data"
        item-title="name"
        label="select stage"
        return-object
        @update:modelValue="dosomthing(selected, stage.id)"
      ></v-autocomplete>

      <h2 class="text-h5 mb-6">{{ stage.name }}</h2>

      <p class="mb-4 text-medium-emphasis text-body-2">
        {{ stage.desc }}

        <br />

        Stage ID is : {{ stage._id }}
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
import tabs from "../components/layout/tabs.vue";
import axios from "axios";
export default {
  components: { tabs },

  data() {
    return {
      stages: [{ id: "0", name: "stage name", desc: "stage discribtion" }],
      realstages: [],
      id: 0,
      selected: null,
      data: [],
    };
  },

  created() {
    axios.get("/api/stage/").then((response) => {
      this.data = response.data.data;
    });
  },
  methods: {
    addstage() {
      this.id += 1;
      this.stages.push({
        id: this.id,
        name: "stage name",
        desc: "stage describtion",
      });
    },
    deletee(id) {
      console.log("im alive");
      this.stages.splice(
        this.stages.findIndex((m) => m.id === id),
        1
      );
    },
    up(id) {
      console.log("im alive");

      const index = this.stages.findIndex((m) => m.id === id);
      if (index - 1 === -1) {
      } else {
        const element = this.stages.find((m) => m.id === id);
        this.deletee(id);
        this.stages.splice(index - 1, 0, element);
        console.log(element, index);
      }
    },
    down(id) {
      console.log("im alive");

      const index = this.stages.findIndex((m) => m.id === id);
      if (index + 1 === this.stages.length) {
      } else {
        console.log(index, this.stages.length);
        const element = this.stages.find((m) => m.id === id);
        this.deletee(id);
        this.stages.splice(index + 1, 0, element);
        // console.log(element, index);
      }
    },
    dosomthing(selected, index) {
      console.log("im alive");
      console.log(selected);
      console.log(this.stages.find((m) => m.id === index));
      this.stages.find((m) => m.id === index).name = selected.name;
      this.stages.find((m) => m.id === index).desc = selected.desc;
      this.stages.find((m) => m.id === index)._id = selected._id;
      this.selected = null;
    },
    save() {
      let counter = 0;

      this.realstages = [];
      this.stages.forEach((element) => {
        const x = {};

        x.id = element._id;
        x.piriority = counter;
        this.realstages.push(x);
        counter += 1;
      });
      this.$emit("stages_done", this.realstages);
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
