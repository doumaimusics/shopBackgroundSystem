<template>
  <dl class="auditing">
    <dt><h3>已申请店铺，请耐心等待审核</h3></dt>
    <dd>店铺审核将在3个工作日内完成</dd>
  </dl>
</template>

<script>
  import { getUserInfo } from '@/api/login'

  export default {
    created() {
      getUserInfo().then(res => {
        if (!res.data.shopDo) {
          this.$router.push({ name: 'applyIndex' })
          return
        }
        const shopStatus = res.data.shopDo.verify
        if (shopStatus === 3) { // 审核失败
          this.$router.push({ name: 'auditFail' })
        } else if (shopStatus === 4) { // 审核成功
          this.$router.push({ name: 'auditSuccess' })
        }
      })
    }
  }
</script>

<style scoped lang="less">
  .auditing{
    margin-top: 150px;
    text-align: center;

    dd{
        -webkit-margin-start: 0;
        color: #666;
    }
    h3 {
        font-weight: 700;
    }
    dd {
        padding: 20px 0;
    }
  }
</style>
