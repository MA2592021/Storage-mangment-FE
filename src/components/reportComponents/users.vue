<template>
  <v-row v-if="!loading">
    <v-col cols="12" class="text-center">All users</v-col>

    <v-col cols="12">
      <DynamicCardButtons :data="allModelButtons" @clicked="allForUsers"
    /></v-col>
  </v-row>
  <v-row v-if="loading"
    ><v-col cols="4"></v-col
    ><v-col cols="2"
      ><v-progress-circular
        color="green"
        indeterminate
        :size="71"
        :width="5" /></v-col
    ><v-col cols="4" class="mt-4"
      ><h3 class="gradient-text">let the magic happen</h3></v-col
    >
  </v-row>
</template>

<script>
import DynamicCardButtons from "../DynamicCardButtons.vue";
import * as Button from "../../services/ReportButtons";
import { usedata } from "@/stores/print_data";
import { useheaders } from "@/stores/headers";
import axios from "axios";
import swal from "sweetalert";

export default {
  setup() {
    const print_data = usedata();
    const headers = useheaders();

    return { print_data, headers };
  },
  components: {
    DynamicCardButtons,
  },
  data() {
    return {
      loading: false,
      allModelButtons: Button.orderButtons,
      users: [],
      modelDetails: "",
      usersHeader: [
        // { key: "order[name]", title: "order" },
        { title: "Code", align: "start", key: "code" },
        { title: "Name", align: "start", key: "name" },
        { title: "Role", key: "role.title" },
      ],
    };
  },
  created() {
    this.load_users();
  },
  methods: {
    allForUsers(data) {
      this.loading = true;
      if (data.value === 0) {
        this.printo(`Arkan System Users`, this.users, this.usersHeader);
        this.loading = false;
      }
    },
    load_users() {
      axios.get("/api/user").then((res) => {
        console.log(res);
        this.users = res.data.data;
      });
    },

    printo(title, data, header) {
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
