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
      <v-row
        ><v-col cols="12"
          ><v-autocomplete
            v-model="selected"
            :items="data"
            item-title="name"
            label="select stage"
            return-object
            @update:modelValue="dosomthing(selected, stage.id)"
          ></v-autocomplete></v-col
      ></v-row>

      <h2 class="text-h5 mb-6">{{ stage.name }}</h2>

      <p class="mb-4 text-medium-emphasis text-body-2">
        stage machien type :
        {{ stage.machineType ? stage.machineType.name : "" }}
      </p>
      <p class="mb-4 text-medium-emphasis text-body-2">
        stage note : {{ stage.note }}
        {{ stage.machineType ? stage.machineType.name : "" }}
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
            {{ $t("delete") }}
          </v-btn>
        </v-col>
        <v-col cols="6">
          <v-btn
            class="text-none ma-1"
            color="warning"
            rounded
            variant="flat"
            width="110"
            @click="up(stage.id)"
          >
            &uarr; {{ $t("models.up") }}
          </v-btn>
          <v-btn
            class="text-none ma-1"
            color="warning"
            rounded
            variant="flat"
            width="110"
            @click="down(stage.id)"
          >
            &darr; {{ $t("models.down") }}
          </v-btn>
        </v-col></v-row
      >
    </v-sheet></transition-group
  >
  <v-col class="mx-auto" align="center">
    <v-btn class="mt-2 mr-2" color="warning" @click="addstage()">{{
      $t("models.addStage")
    }}</v-btn>
    <v-btn class="mt-2" color="success" @click="save()">{{
      $t("save")
    }}</v-btn></v-col
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
      selectedmt: { name: "" },
      data: [],
      machinetypes: [],
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
      //console.log(selected);

      this.stages.find((m) => m.id === index).name = selected.name;
      this.stages.find((m) => m.id === index).machineType =
        selected.machineType;
      this.stages.find((m) => m.id === index)._id = selected._id;
      this.stages.find((m) => m.id === index).note = selected.note;
      this.selected = null;
      console.log(this.stages.find((m) => m.id === index));
    },

    save() {
      let counter = 1;

      this.realstages = [];
      this.stages.forEach((element) => {
        const x = {};
        x.machineType = element.machine._id;
        x.id = element._id;
        x.priority = counter;
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
