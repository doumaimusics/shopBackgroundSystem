<template>
  <div class="detailCoupon">
    <CouponInfo :id="id"></CouponInfo>
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
      },
      goBack() {
        this.$router.history.go(-1)
      }
    },

    components: { CouponInfo }
  }
</script>

<style lang="less" scoped>
  .detailCoupon {
    padding: 20px;
    padding-left: 40px;
  }
</style>