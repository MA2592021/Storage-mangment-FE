<template>
  <v-container class="fill-height">
    <v-row align="center" class="elevation-24 rounded-lg mt-10 bg-white">
      <v-col cols="12" md="6">
        <v-img
          width="70%"
          src="/arkan_logo-withtext.png"
          class="ml-12"
          cover
        ></v-img>
      </v-col>
      <v-col cols="12" md="6">
        <h1 class="text-center text-h5">log in</h1>

        <v-form @submit.prevent="validate()" ref="form">
          <v-text-field
            variant="underlined"
            v-model="code"
            label="Code"
            required
            :rules="codeRules"
          ></v-text-field>

          <v-text-field
            variant="underlined"
            v-model="password"
            label="Password"
            type="password"
            required
            :rules="passwordRules"
          ></v-text-field>

          <v-btn type="submit" block class="mt-2 bg-grey-lighten-4"
            >log in</v-btn
          >
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import swal from "sweetalert";
export default {
  data: () => ({
    code: "",
    codeRules: [
      (value) => {
        if (value?.length != "") return true;

        return "code cant be empty";
      },
    ],
    password: "",
    passwordRules: [
      (value) => {
        if (value?.length != "") return true;

        return "password cant be empty";
      },
    ],
  }),
  methods: {
    login: function () {
      axios
        .post("/api/auth/login", {
          code: this.code,
          password: this.password,
        })
        .then((res) => {
          if (res.data.errors) {
            swal("error", res.data.errors[0].msg, "error");
          } else {
            localStorage.setItem("accessToken", res.data.accessToken);
            localStorage.setItem("refreshToken", res.data.refreshToken);
            localStorage.setItem("username", res.data.user.name);
            localStorage.setItem("privileges", res.data.user.role.privileges);
            localStorage.setItem("rolename", res.data.user.role.title);
            localStorage.setItem("code", res.data.user.code);
            localStorage.setItem("id", res.data.user._id);
            swal("success", "Welcome Back", "success");
            this.$router.push({ path: "/" });
          }
        });
    },
    async validate() {
      const { valid } = await this.$refs.form.validate();

      if (valid) {
        this.login();
      }
    },
  },
};
</script>

<style>
.backo {
  background: linear-gradient(#770f30, #fed579);
}
</style>
