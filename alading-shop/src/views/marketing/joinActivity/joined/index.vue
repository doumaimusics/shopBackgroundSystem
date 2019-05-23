<template>
  <div class="joinedIndex">
    <div class="filter">
      <span>活动状态：</span>
      <el-select v-model="status" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>

    <el-tabs type="card" v-model="type" @tab-click="tabsClick">
      <el-tab-pane label="促销" name="1">
        <keep-alive>
          <List v-if="type==='1'" :type="1" :status="status"></List>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="满减" name="2">
        <keep-alive>
          <List v-if="type==='2'" :type="2" :status="status"></List>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="秒杀" name="3">
        <keep-alive>
          <List v-if="type==='3'" :type="3" :status="status"></List>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="拼团" name="4">
        <keep-alive>
          <List v-if="type==='4'" :type="4" :status="status"></List>
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import List from './components/List'
  import { joinedActivityStatusTrans } from '@/filters/transform'

  export default {
    components: { List },
    data() {
      return {
        tableData: [],
        options: [
          { value: 0, label: '全部' },
          { value: 1, label: joinedActivityStatusTrans(1) },
          { value: 2, label: joinedActivityStatusTrans(2) },
          { value: 3, label: joinedActivityStatusTrans(3) }
        ],
        status: 0,
        type: '1'
      }
    },
    created() {
      this.getType()
    },
    methods: {
      getType() {
        this.type = this.$route.query.type || this.type
      },
      tabsClick() {
        if (window.history.replaceState) {
          window.history.replaceState(null, null, `#${this.$route.path}?type=${this.type}`)
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .joinedIndex {
    padding: 20px;
  }
  .filter {
    padding-bottom: 20px;
  }
</style>
