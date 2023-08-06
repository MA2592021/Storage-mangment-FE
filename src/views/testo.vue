<template>
  <v-autocomplete
    v-model="selectedFruits"
    :items="fruits"
    multiple
    item-title="title"
    :menu-props="{ closeOnClick: true, closeOnContentClick: true }"
  >
    <template v-slot:prepend-item>
      <v-list-item ripple @click="toggle">
        <v-list-item-content>
          <v-list-item-title v-if="selectedFruits.length !== fruits.length"
            >Select All</v-list-item-title
          >
          <v-list-item-title v-else>UnSelect All</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider class="mt-2"></v-divider>
    </template>
  </v-autocomplete>
  {{ selectedFruits }} -- {{ fruits }}
</template>

<script>
export default {
  data: () => ({
    fruits: [
      "Apples",
      "Apricots",
      "Avocado",
      "Bananas",
      "Blueberries",
      "Blackberries",
      "Boysenberries",
      "Bread fruit",
      "Cantaloupes (cantalope)",
      "Cherries",
      "Cranberries",
      "Cucumbers",
      "Currants",
      "Dates",
      "Eggplant",
      "Figs",
      "Grapes",
      "Grapefruit",
      "Guava",
      "Honeydew melons",
      "Huckleberries",
      "Kiwis",
      "Kumquat",
      "Lemons",
      "Limes",
      "Mangos",
      "Mulberries",
      "Muskmelon",
      "Nectarines",
      "Olives",
      "Oranges",
      "Papaya",
      "Peaches",
      "Pears",
      "Persimmon",
      "Pineapple",
      "Plums",
      "Pomegranate",
      "Raspberries",
      "Rose Apple",
      "Starfruit",
      "Strawberries",
      "Tangerines",
      "Tomatoes",
      "Watermelons",
      "Zucchini",
    ],
    selectedFruits: [],
  }),

  methods: {
    toggle() {
      if (this.fruits.length === this.selectedFruits.length) {
        this.selectedFruits = [];
      } else {
        this.selectedFruits = this.fruits.slice();
      }
    },
  },
};
</script>
