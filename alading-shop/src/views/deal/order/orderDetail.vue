<template>
  <div class="orderDetail">
    <OrderInfo :orderNo="orderNo"></OrderInfo>
  </div>
</template>

<script>
  import OrderInfo from '@/views/deal/components/OrderInfo.vue'
  // import "@/views/deal/reset.scss";

  export default {
    data() {
      return {
        orderNo: '' // 订单号
      }
    },

    created() {
      this.orderNo = this.getOrderNo()
    },

    methods: {
      getOrderNo() {
        return this.$route.params.id
      }
    },

    components: { OrderInfo }
  }
</script>

<style lang="scss" scoped>
  .orderDetail {
    padding: 20px;
    font-size: 14px;
  }
</style>
