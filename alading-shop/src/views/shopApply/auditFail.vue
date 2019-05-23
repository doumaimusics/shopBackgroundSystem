<template>
  <dl class="auditFail">
    <dt>
      <h3>店铺申请已拒绝，进入店铺后台管理</h3>
    </dt>
    <dd>
      <p>拒绝原因：{{info}}</p>
    </dd>
    <dd>
      <router-link
        tag="button"
        class="el-button applyBtn el-button--default el-button--medium applyBtn personalBtn"
        to="/shopApply/applyIndex?redirect=1"
      >选择店铺类型</router-link>
      <router-link
        tag="button"
        class="el-button applyBtn el-button--primary el-button--medium applyBtn personalBtn"
        :to="{name:'exclusiveShop',query:{type:shopType,redirect:1}}"
      >重新申请</router-link>
    </dd>
  </dl>
</template>

<script>
export default {
  data() {
    return {
      info: '',
      shopType: ''
    }
  },
  created() {
    this.info = this.$store.getters.shopinfo.refuseReason
    this.shopType = this.$store.getters.shopinfo.shopType
  }
}
</script>

<style scoped lang="less">
.auditFail {
  margin-top: 150px;
  text-align: center;
  dd {
    -webkit-margin-start: 0;
    color: #666;
  }
  h3 {
    font-weight: 700;
  }
  p {
    padding: 20px 0;
  }
}
</style>
