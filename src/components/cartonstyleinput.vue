<template>
  <transition-group name="list" tag="ul">
    <v-row class="border" v-for="(c, index) in counter" :key="c"
      ><v-col cols="12" align="center"
        ><h3>style {{ index + 1 }}</h3></v-col
      >
      <v-col cols="12" sm="4"
        ><v-autocomplete
          label="select color"
          :items="colors"
          v-model="selectcolor[index]"
          return-object
          item-title="name"
        ></v-autocomplete
      ></v-col>
      <v-col cols="12" sm="4"
        ><v-autocomplete
          label="select size"
          :items="sizes"
          v-model="selectsize[index]"
          return-object
          item-title="name"
        ></v-autocomplete
      ></v-col>
      <v-col cols="12" sm="3"
        ><v-text-field label="quantity" v-model="qty[index]"></v-text-field
      ></v-col>

      <v-col cols="12" sm="1"
        ><v-btn icon="mdi-delete-circle" class="bg-red" @click="deletee(index)">
        </v-btn
      ></v-col>
    </v-row>
  </transition-group>
  <v-col class="mx-auto" align="center">
    <v-btn class="mt-2 mr-2" color="warning" @click="addstyle()"
      >Add style</v-btn
    >
    <v-btn class="mt-2" color="success" @click="save()">save</v-btn>
  </v-col>
</template>

<script>
export default {
  data() {
    return {
      counter: [null],
      selectcolor: [null],
      selectsize: [null],
      qty: [null],

      styles: [],
    };
  },

  created() {
    console.log(this.sizes);
  },
  methods: {
    addstyle() {
      this.selectsize.push(null);
      this.selectcolor.push(null);
      this.qty.push(null);
      this.counter.push(null);
    },
    deletee(index) {
      console.log("im alive");
      this.counter.splice(index, 1);
      this.selectcolor.splice(index, 1);
      this.selectsize.splice(index, 1);
      this.qty.splice(index, 1);
    },

    save() {
      console.log("im saving in child");
      let counter = 0;
      this.styles = [];
      this.selectsize.forEach((element) => {
        const x = {};
        x.size = element._id;
        x.quantity = this.qty[counter];
        x.color = this.selectcolor[counter]._id;
        console.log(x);
        this.styles.push(x);
        counter += 1;
      });
      this.$emit("styles_done", this.styles);
    },
  },
  props: {
    sizes: Array,
    colors: Array,
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
