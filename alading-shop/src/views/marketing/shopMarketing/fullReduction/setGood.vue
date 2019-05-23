<template>
	<div class="setPriceBox">
		<GoodTable :id="id"></GoodTable>
	</div>
</template>

<script>

  import GoodTable from './components/CouponTable02'

  export default {
    components: { GoodTable },

    data() {
      return {
        id: ''
      }
    },

    created() {
      this.getParams()
    },

    methods: {
      // 获取路由参数 活动id
      getParams() {
        this.id = this.$route.query.id
      }
    }
  }
</script>

<style lang="less" scoped>
	.setPriceBox {
		padding: 20px;
	}
</style>
