<template>
  <div class="dashboard-container">
    <component :is="currentRole"></component>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import admin from './admin'
// import apply from './apply'

export default {
  components: { admin },
  data() {
    return {
      currentRole: 'admin'
    }
  },
  computed: {
    ...mapGetters([
      'roles',
      'shopinfo',
      'setting'
    ])
  },
  created() {
    if (this.roles.includes('0')) { // 如果商铺信息不存在则跳到申请店铺页面
      if (!this.shopinfo.verify) {
        this.$router.push({ path: '/shopApply/applyIndex' })
      } else {
        switch (this.shopinfo.verify) {
          case 1:
            this.$router.push({ path: '/shopApply/applyIndex' })
            break
          case 2:
            this.$router.push({ path: '/shopApply/auditing' })
            break
          case 3:
            this.$router.push({ path: '/shopApply/auditFail' })
            break
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .dashboard-container {
    min-height: calc(100vh - 84px);
  }
</style>

