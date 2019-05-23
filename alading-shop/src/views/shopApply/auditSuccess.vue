<template>
  <dl class="auditSuccess">
    <dt>
      <h3>店铺申请已通过，进入店铺后台管理</h3>
    </dt>
    <dd>
      <button
        tag="button"
        class="el-button applyBtn el-button--primary el-button--medium applyBtn personalBtn"
        @click="refresh"
      >进入店铺</button>
    </dd>
  </dl>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    refresh() {
      window.location.href = '/'
    }
  }
}
</script>

<style scoped lang="less">
.auditSuccess {
  margin-top: 150px;
  text-align: center;
  dd {
    -webkit-margin-start: 0;
    color: #666;
  }
  h3 {
    font-weight: 700;
    padding: 20px 0;
  }
}
</style>
