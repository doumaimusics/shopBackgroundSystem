<template>
	<div class="editActivityGoods">
    <EditGoods :id="id" :limit="limit"></EditGoods>
	</div>
</template>

<script>
  import EditGoods from './components/EditGoods'

  export default {
    components: { EditGoods },
    data() {
      return {
        id: '',
        limit: {}
      }
    },
    created() {
      this.getParams()
    },
    beforeRouteEnter(to, from, next) {
      let obj = localStorage.getItem('joinableActivityGoods')
      if (obj) {
        obj = JSON.parse(obj)
        if (+obj.activityId === +to.query.id) {
          next()
          return
        }
      }
      next(vm => {
        vm.$router.push({
          name: 'joinableActivityDetail',
          query: { id: vm.id }
        })
      })
    },
    methods: {
      getParams() {
        this.id = this.$route.query.id
        this.limit = {
          minAmount: this.$route.query.minAmount,
          maxAmount: this.$route.query.maxAmount,
          priceDemand: this.$route.query.priceDemand,
          priceDisDemand: this.$route.query.priceDisDemand
        }
      }
    }
  }
</script>

<style lang="less" scoped>
	.editActivityGoods {
    padding: 20px;
  }
</style>
