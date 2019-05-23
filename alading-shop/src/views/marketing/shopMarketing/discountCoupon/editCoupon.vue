<template>
  <div class="editCoupon">
    <CouponInfo :id="id" :isEdit="true"></CouponInfo>
  </div>
</template>

<script>
  import CouponInfo from './components/CouponInfo'

  export default {
    data() {
      return {
        id: ''
      }
    },

    created() {
      this.getParams()
    },

    methods: {
      getParams() {
        this.id = this.$route.query.id
      }
    },

    components: { CouponInfo }
  }
</script>

<style lang="less" scoped>
  .editCoupon {
    padding: 20px;
    padding-left: 40px;
  }
</style>