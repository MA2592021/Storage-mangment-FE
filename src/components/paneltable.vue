<template>
  <v-expansion-panel>
    <v-expansion-panel-title>
      <template v-slot:default="{ expanded }">
        <v-row no-gutters>
          <v-col cols="4" class="d-flex justify-start"> {{ panelname }} </v-col>
          <v-col cols="8" class="text-grey">
            <v-fade-transition leave-absolute>
              <span v-if="expanded" key="0">
                {{ closedtitle }}
              </span>
              <span v-else key="1"> {{ openedtitle }} {{ closedtitle }} </span>
            </v-fade-transition>
          </v-col>
        </v-row>
      </template>
    </v-expansion-panel-title>
    <v-expansion-panel-text>
      <tablepinia v-bind:type="this.type" />
      <appendpop v-bind:link="link" v-bind:name="panelname" />
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script>
import appendpop from "./appendpop.vue";
import tablepinia from "./tablepinia.vue";
export default {
  components: {
    appendpop,
    tablepinia,
  },
  props: {
    type: String,
    panelname: String,
    closedtitle: String,
    openedtitle: String,
    link: String,
  },
  methods: {
    onClickButton(value) {
      console.log(value);
      this.$emit("clicked", value);
    },
  },
  emits: ["clicked"],
};
</script>

<style lang="scss" scoped></style>
