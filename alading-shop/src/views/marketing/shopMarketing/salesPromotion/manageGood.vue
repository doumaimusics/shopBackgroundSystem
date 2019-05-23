<template>
  <div class="setPriceBox">
    <GoodTable :isManageActivity='true' :id="id"></GoodTable>
  </div>
</template>

<script>
  import GoodTable from './components/GoodTable'

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
      getParams() {
        this.id = this.$route.query.id
      }
    }
  }
</script>

<style lang="less" scoped>
  .setPriceBox{
    padding: 20px;
  }
</style>
