<template>
  <div class="couponIndex">
    <Search @getSearchData="getSearchData"></Search>

    <div class="btn">
      <el-button type="primary" @click="addCoupon">新增</el-button>
    </div>

    <CouponTable :searchData="searchData"></CouponTable>
  </div>
</template>

<script>
  import Search from './components/Search'
  import CouponTable from './components/CouponTable'

  export default {
    data() {
      return {
        searchData: {}
      }
    },

    created() {

    },

    methods: {
      getSearchData(obj) {
        this.searchData = { ...obj }
      },
      addCoupon() {
        this.$router.push({ name: 'addCoupon' })
      }
    },

    components: { Search, CouponTable }
  }
</script>

<style lang="less" scoped>
  .couponIndex {
    padding: 20px;
  }
  .btn {
    padding-bottom: 10px;
  }
</style>