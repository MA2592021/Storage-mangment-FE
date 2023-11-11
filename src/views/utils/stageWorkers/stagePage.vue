<template>sss</template>

<script>
import axios from "axios";

export default {
  created() {
    const orderId = this.$route.params.orderId;
    const modelId = this.$route.params.modelId;
    const stageId = this.$route.params.stageId;
    this.getStage(orderId, modelId, stageId);
  },
  methods: {
    getStage(order, model, stage) {
      axios
        .get(
          `/api/stageEmployee/details/order/${order}/model/${model}/stage/${stage}`
        )
        .then((res) => {
          console.log(res.data.data);
        });
    },
  },
};
</script>
