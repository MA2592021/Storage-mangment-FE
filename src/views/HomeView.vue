<template>
  <tabs v-if="routePath !== '/'" />
  <v-card
    class="mx-auto mt-2"
    variant="outlined"
    v-for="(stage, index) in stages"
    :key="stage"
  >
    <v-card-item>
      <div>
        <div class="text-overline mb-1">stage number {{ index + 1 }}</div>
        <v-autocomplete
          v-model="selected"
          :items="data"
          item-title="name"
          label="select stage"
          return-object
          @update:modelValue="dosomthing(selected, stage.id)"
        ></v-autocomplete>
        <div class="text-overline mb-1">{{ stage.name }}</div>
        <div class="text-caption">{{ stage.desc }}</div>
        <div class="text-caption">{{ stage.id }}</div>
      </div>
    </v-card-item>

    <v-card-actions>
      <v-btn variant="outlined" @click="deletee(stage.id)"> Delete </v-btn>
      <v-btn variant="outlined" @click="up(stage.id)"> up </v-btn>
      <v-btn variant="outlined" @click="down(stage.id)"> down </v-btn>
    </v-card-actions>
  </v-card>
  <v-btn class="mt-4" @click="addstage()">Add Stage</v-btn>
</template>

<script>
import tabs from "../components/layout/tabs.vue";
export default {
  components: { tabs },
  setup() {
    return {};
  },
  data() {
    return {
      dialog: false,
      stages: [{ id: "0", name: "stage name", desc: "stage discribtion" }],

      id: 0,
      selected: null,
      data: [
        { name: "2as", id: "1", desc: "bn2os" },
        { name: "geb", id: "2", desc: "bngeb" },
        { name: "manika", id: "3", desc: "bnmanik" },
      ],
    };
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
      this.stages.find((m) => m.id === index).id = selected.id;
      this.selected = null;
    },
  },

  computed: {
    routePath() {
      return this.$route.path;
    },
  },
};
</script>

<style lang="scss" scoped></style>
