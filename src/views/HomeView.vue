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
        <div class="text-overline mb-1">{{ stage.name }}</div>
        <div class="text-caption">{{ stage.desc }}</div>
        <div class="text-caption">{{ stage.id }}</div>
      </div>
    </v-card-item>

    <v-card-actions>
      <v-btn variant="outlined" @click="deletee(stage.id)"> Delete </v-btn>
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
  },

  computed: {
    routePath() {
      return this.$route.path;
    },
  },
};
</script>

<style lang="scss" scoped></style>
