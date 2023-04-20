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

        <v-form @submit.prevent>
          <v-text-field
            variant="underlined"
            v-model="code"
            label="Code"
            :rules="codeRules"
          ></v-text-field>

          <v-text-field
            variant="underlined"
            v-model="password"
            label="Password"
            type="password"
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
};
</script>

<style>
.backo {
  background: linear-gradient(#770f30, #fed579);
}
</style>
