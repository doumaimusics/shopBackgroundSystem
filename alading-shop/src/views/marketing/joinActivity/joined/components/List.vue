<template>
  <div class="joinedList">
    <el-table :data="tableData" stripe>
      <!-- <el-table-column prop="type" label="活动类型" width="80"></el-table-column> -->
      <el-table-column prop="name" label="活动名称" min-width="120"></el-table-column>
      <el-table-column label="活动时间" width="320">
        <template slot-scope="scope">
          {{scope.row.gmtStartTime + ' 至 ' + scope.row.gmtEndTime}}
        </template>
      </el-table-column>
      <el-table-column label="活动状态">
        <template slot-scope="scope">
          {{scope.row.startStatus | joinedActivityStatusTrans}}
        </template>
      </el-table-column>
      <el-table-column prop="doEnterGoodsCount" label="我的商品数量"></el-table-column>
      <el-table-column prop="salesCount" label="销量"></el-table-column>
      <el-table-column prop="totalPayAmount" label="总支付金额"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="onDetail(scope.row.activityEnterId)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination
      :pageNo="pagination.pageNo"
      :totalCount="pagination.totalCount"
      :pageSize="pagination.pageSize"
      :handleChange="handleCurrentChange"
    ></Pagination>
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination/index'
  import { getJoinedActivityList } from '@/api/marketing'
  import { joinedActivityStatusTrans } from '@/filters/transform'

  export default {
    props: ['type', 'status'],
    components: { Pagination },
    filters: { joinedActivityStatusTrans },
    data() {
      return {
        tableData: [],
        pagination: {
          pageNo: 1,
          totalCount: 0,
          pageSize: 20
        }
      }
    },
    created() {
      this.getData()
    },
    watch: {
      status() {
        this.handleCurrentChange(1)
      }
    },
    methods: {
      getData() {
        const params = {
          pageNo: this.pagination.pageNo,
          startStatus: this.status,
          activityType: this.type
        }
        // ajax
        getJoinedActivityList(params).then(res => {
          this.tableData = res.data
          this.pagination.totalCount = res.totalCount
          this.pagination.pageSize = res.pageSize
        })
      },
      onDetail(id) {
        this.$router.push({
          name: 'joinedActivityDetail',
          query: {
            id: id
          }
        })
      },
      handleCurrentChange(val) {
        this.pagination.pageNo = val
        this.getData()
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
