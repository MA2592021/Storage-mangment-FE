<template>
  <v-card class="mx-auto" elevation="2" style="width: 100%"
    ><v-row
      ><v-col cols="9" sm="10">
        <v-row>
          <v-col cols="12" class="ma-4">
            <v-text-field
              label="Name "
              required
              readonly
              v-model="employee.name"
              variant="underlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" class="ma-4">
            <v-text-field
              label="code "
              required
              readonly
              v-model="employee.code"
              variant="underlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" class="ma-4">
            <v-text-field
              label="salary state "
              required
              readonly
              variant="underlined"
            ></v-text-field>
          </v-col>
        </v-row> </v-col></v-row
    ><v-card-actions>
      <v-btn
        class="ml-auto"
        @click="deletee()"
        prepend-icon=" mdi-cash-multiple"
        color="green"
      >
        Salary Paid
      </v-btn>
    </v-card-actions>
  </v-card>
  <salaryPanel class="mt-3" />
</template>

<script>
import salaryPanel from "../../components/salaryPanel.vue";
import axios from "axios";
import swal from "sweetalert";
export default {
  components: {
    salaryPanel,
  },
  data() {
    return {
      employee: {},
    };
  },
  created() {
    //Get route
    axios.get("/api/employee/" + this.$route.params.id).then((response) => {
      console.log(response);
      this.employee = response.data.data;
    });
  },
  methods: {
    deletee() {
      swal({
        title: "Are you sure?",
        text: "Are you sure that you want to delete this type?",
        icon: "warning",
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          swal("enter your password", {
            content: "input",
          }).then((value) => {
            axios
              .post("/api/auth/testCredentials", {
                code: localStorage.getItem("code"),
                password: value,
              })
              .then((response) => {
                if (response.data.errors) {
                  swal("error", response.data.errors[0].msg, "error");
                } else {
                  axios
                    .delete("/api/machineType/" + this.$route.params.id)
                    .then((response) => {
                      if (response.data.errors) {
                        swal("error", response.data.errors[0].msg, "error");
                      } else {
                        swal(
                          "success",
                          "machine Type deleted suuccessfully",
                          "success"
                        ).then(() => {
                          this.$router.push({ path: "/utils/type/all" });
                        });
                      }
                    });
                }
              });
          });
        }
      });
    },
  },
};
</script>
