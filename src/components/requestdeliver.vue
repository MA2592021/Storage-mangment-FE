<template>
  <v-dialog :value="value" persistent>
    <v-card>
      <v-card-title class="text-h5"> {{ title }} </v-card-title>
      <v-card-text>
        <h3>materials</h3>
        <v-container v-for="(material, index) in materials" :key="material">
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="name"
                variant="solo"
                v-model="material.id.name"
                readonly
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="quantity"
                variant="solo"
                v-model="material.quantity"
                readonly
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-autocomplete
                label="select supplier"
                v-model="materialselected[index]"
                :items="suppliers"
                item-title="name"
                return-object
              ></v-autocomplete>
            </v-col>

            <v-col cols="12">
              <v-text-field
                label="Price*"
                v-model="materialprice[index]"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <hr />
        </v-container>
        <h3>properties</h3>
        <v-container v-for="(material, index) in properties" :key="material">
          <v-row>
            <v-col cols="12"
              ><h1>{{ index }}</h1>
              <v-text-field
                label="name"
                variant="solo"
                v-model="material.id.name"
                readonly
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="quantity"
                variant="solo"
                v-model="material.quantity"
                readonly
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-autocomplete
                label="select supplier"
                v-model="propertyselected[index]"
                :items="suppliers"
                item-title="name"
                return-object
              ></v-autocomplete>
            </v-col>

            <v-col cols="12">
              <v-text-field
                label="Price*"
                v-model="propertyprice[index]"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <hr />
        </v-container>
        <small>*indicates required field</small></v-card-text
      >
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="green-darken-1"
          variant="text"
          @click.native="$emit('close')"
        >
          Disagree
        </v-btn>
        <v-btn color="green-darken-1" variant="text" @click.native="append()">
          Agree
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";
import swal from "sweetalert";
export default {
  props: {
    value: "value",
    title: String,
    materials: Array,
    properties: Array,
  },
  data() {
    return {
      suppliers: [],
      materialselected: [],
      materialprice: [],
      propertyselected: [],
      propertyprice: [],
      tosendmaterial: [],
      tosendproperty: [],
    };
  },
  created() {
    axios.get("/api/supplier/").then((response) => {
      this.suppliers = response.data.data;
    });
    this.materials.forEach((element) => {
      this.materialselected.push(null);
      this.materialprice.push(null);
    });
    this.properties.forEach((element) => {
      this.propertyselected.push(null);
      this.propertyprice.push(null);
    });
  },
  methods: {
    append() {
      let x = 0;
      this.materialselected.forEach((element, index) => {
        console.log(x);
        if (element === null) {
          swal("error please fill all information");
          x = 1;
        } else {
          if (this.materialprice[index] === null) {
            swal("error please fill all information");
            x = 1;
          }
        }
      });

      this.propertyselected.forEach((element, index) => {
        if (element === null) {
          swal("error please fill all information");
          x = 2;
        } else {
          if (this.propertyprice[index] === null) {
            swal("error please fill all information");
            x = 2;
          }
        }
      });
      if (x === 0) {
        this.materials.forEach((element, index) => {
          const x = {};
          x.price = this.materialprice[index];
          x.supplier = this.materialselected[index]._id;
          x.material = element.id._id;
          x.quantity = element.quantity;
          this.tosendmaterial.push(x);
        });
        this.properties.forEach((element, index) => {
          const x = {};
          x.price = this.propertyprice[index];
          x.supplier = this.propertyselected[index]._id;
          x.custody = element.id._id;
          x.quantity = element.quantity;
          this.tosendproperty.push(x);
        });
        this.$emit("append", this.tosendmaterial, this.tosendproperty);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
