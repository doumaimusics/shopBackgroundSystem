<template>
  <div class="joinableIndex">
    <el-table :data="tableData" stripe>
      <el-table-column label="活动类型" width="80">
        <template slot-scope="scope">
          {{scope.row.type | activityTypeTrans}}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="活动名称" min-width="100"></el-table-column>
      <el-table-column label="活动时间" width="310">
        <template slot-scope="scope">
          {{scope.row.gmtStartTime + ' 至 ' + scope.row.gmtEndTime}}
        </template>
      </el-table-column>
      <el-table-column prop="enterGmtEndTime" label="报名结束时间" width="150"></el-table-column>
      <el-table-column label="可报名商品数量" align="center" min-width="100">
        <template slot-scope="scope">
          {{scope.row.enterGoodsCount ? scope.row.enterGoodsCount : '不限'}}
        </template>
      </el-table-column>
      <el-table-column prop="auditingGoodsCount" label="审核中商品数量" align="center" min-width="100"></el-table-column>
      <el-table-column prop="finishVerifyGoodsCount" label="已通过商品数量" align="center" min-width="100"></el-table-column>
      <el-table-column label="操作" min-width="100">
        <template slot-scope="scope">
          <el-button type="text" @click="goPage(scope.row.activityEnterId,scope.row.type)">查看报名详情</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import { getJoinableActivityList } from '@/api/marketing'
  import { activityTypeTrans } from '@/filters/transform'

  export default {
    filters: { activityTypeTrans },
    data() {
      return {
        tableData: []
      }
    },
    created() {
      this.getData()
    },
    methods: {
      getData() {
        getJoinableActivityList().then(res => {
          this.tableData = res.data
        })
      },
      goPage(id, type) {
        this.$router.push({
          name: 'joinableActivityDetail',
          query: {
            id: id,
            type: type
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .joinableIndex {
    padding: 20px;
  }
</style>
