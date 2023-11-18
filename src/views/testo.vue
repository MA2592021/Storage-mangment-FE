<template>
  <v-container class="fill-height">
    <v-row
      ><v-col>
        <v-card flat rounded="0">
          <v-card-title class="text-center mb-5"
            >Arkan Reports Center</v-card-title
          >
          <v-window v-model="onboarding">
            <v-window-item :value="1">
              <DynamicCardButtons
                v-bind:col="4"
                v-bind:data="MainButtons"
                @clicked="magic"
              />
            </v-window-item>
            <v-window-item :value="2"
              ><DynamicCardButtons
                v-bind:col="6"
                v-bind:data="Selected2ndData"
                @clicked="magic"
            /></v-window-item>
            <v-window-item :value="3"
              ><DynamicCardButtons
                v-bind:col="6"
                v-bind:data="Selected3rdData"
                @clicked="magic"
            /></v-window-item>
            <v-window-item :value="4"
              ><v-card-text>
                <v-row
                  ><v-col cols="4"></v-col
                  ><v-col cols="2"
                    ><v-progress-circular
                      color="green"
                      indeterminate
                      :size="71"
                      :width="5" /></v-col
                  ><v-divider vertical></v-divider
                  ><v-col cols="4" class="mt-4"
                    ><h3 class="gradient-text">let the magic happen</h3></v-col
                  >
                </v-row>
              </v-card-text></v-window-item
            >
          </v-window>

          <v-card-actions class="justify-space-between" v-if="onboarding !== 4">
            <v-btn
              variant="plain"
              icon="mdi-chevron-left"
              @click="prev"
            ></v-btn>

            <v-item-group v-model="onboarding" mandatory>
              <v-item
                v-for="n in length"
                :key="`btn-${n}`"
                v-slot="{ isSelected }"
                :value="n"
              >
                <v-btn
                  :variant="isSelected ? 'outlined' : 'text'"
                  :color="isSelected ? 'green' : ''"
                  icon="mdi-record"
                ></v-btn>
              </v-item>
            </v-item-group>
            <v-btn @click="next()" icon="mdi-chevron-right"></v-btn>
          </v-card-actions> </v-card></v-col></v-row
  ></v-container>
</template>

<script>
import DynamicCardButtons from "@/components/DynamicCardButtons.vue";
import { GetAll } from "@/services/Employees.js";
import * as Buttons from "@/services/ReportButtons.js";
import { usedata } from "@/stores/print_data";
import { useheaders } from "@/stores/headers";
export default {
  setup() {
    const print_data = usedata();
    const headers = useheaders();

    return { print_data, headers };
  },
  components: { DynamicCardButtons },
  data: () => ({
    length: 3,
    MainButtons: Buttons.MainButtons,
    onboarding: 1,
    Selected2ndData: "",
    Selected3rdData: "",
  }),

  methods: {
    magic(data) {
      if (data.end) {
        console.log("end point");
        this.onboarding = 4;
        const methodToCall = this[data.data];
        methodToCall();
      } else {
        if (this.onboarding === 1) {
          this.Selected2ndData = Buttons[data.data];
          console.log(this.Selected2ndData);
        } else if (this.onboarding === 2) {
          this.Selected3rdData = Buttons[data.data];
        }

        this.next();
      }
    },
    next() {
      this.onboarding =
        this.onboarding + 1 > this.length ? 1 : this.onboarding + 1;
    },
    prev() {
      this.onboarding =
        this.onboarding - 1 <= 0 ? this.length : this.onboarding - 1;
    },
    allEmployees() {
      const data = [];
      const header = this.headers.employee_header;
      const title = this.$t(`employees.all`);
      GetAll().then((response) => {
        console.log(response);
        response.forEach((element) => {
          const x = {};
          x._id = element._id;
          x.code = element.code;
          x.name = element.name;
          x.role = element.role.title;
          data.push(x);
        });
      });
      this.printo(data, header, title);
    },
    printo(data, header, title) {
      this.print_data.title = title;
      this.print_data.data = data;
      this.print_data.header = header;
      setTimeout(() => {
        this.$router.push({ path: "/print" });
      }, 500);
    },
  },
};
</script>
<style>
.gradient-text {
  background: linear-gradient(45deg, red, blue);
  -webkit-background-clip: text; /* Clip text to the gradient */
  color: transparent; /* Hide the original text color */
  display: inline-block; /* Ensure the gradient spans the text */
}
</style>
