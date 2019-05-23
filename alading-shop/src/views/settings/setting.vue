<template>
  <div class="dashboard-editor-container">
    <el-tabs style='margin-top:15px;' v-model="type" @tab-click="tabsClick">
      <el-tab-pane label="店铺基本设置" name="1">
        <keep-alive>
          <shop v-if="type==='1'"></shop>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="经营许可证" name="2">
        <keep-alive>
          <licence v-if="type==='2'"></licence>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="品牌管理" name="7" v-if="shopType !== 3">
        <keep-alive>
          <brand v-if="type==='7'"></brand>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="物流模板管理" name="3">
        <keep-alive>
          <wuliu v-if="type==='3'"></wuliu>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="子账号管理" name="4">
        <keep-alive>
          <son v-if="type==='4'"></son>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="账户管理" name="5">
        <keep-alive>
          <account v-if="type==='5'"></account>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="银行卡管理" name="6">
        <keep-alive>
          <bank v-if="type==='6'"></bank>
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import shop from './components/shop/index'
import wuliu from './components/wuliu/index'
import son from './components/son/index'
import licence from './components/licence/index'
import account from './components/account/index'
import bank from './components/bank/index'
import brand from './components/brand/index'

export default {
  components: {
    shop,
    wuliu,
    son,
    licence,
    account,
    bank,
    brand
  },
  data() {
    return {
      type: this.$route.query.type || '1',
      shopType: 3
    }
  },

  created() {
    this.getShopType()
  },

  methods: {
    // 切换tab栏改变地址
    tabsClick() {
      if (window.history.replaceState) {
        window.history.replaceState(null, null, `#${this.$route.path}?type=${this.type}`)
      }
    },
    getShopType() {
      this.shopType = this.$store.getters.shopinfo.shopType
    }
  }
}
</script>

<style lang="scss" scoped>
  .dashboard-editor-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
  }
</style>
