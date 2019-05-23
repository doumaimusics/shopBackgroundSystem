<template>
  <div class="couponTable">
    <el-table :data="tableData" stripe>
      <el-table-column prop="id" label="优惠券ID"></el-table-column>
      <el-table-column prop="name" label="优惠券名称"></el-table-column>
      <el-table-column prop="amount" label="优惠金额"></el-table-column>
      <el-table-column prop="limitAmount" label="使用限制"></el-table-column>
      <el-table-column prop="date" label="有效期" min-width="170"></el-table-column>
      <el-table-column prop="startStatus" label="状态"></el-table-column>
      <el-table-column prop="remain" label="剩余／发行数量" min-width="100"></el-table-column>
      <el-table-column prop="usedNumber" label="使用数量"></el-table-column>
      <el-table-column label="操作" min-width="100">
        <template slot-scope="scope">
          <el-button
            type="text"
            v-if="scope.row.startStatus!=='已过期'"
            @click="goPage(scope.row.id, 'editCoupon')"
          >编辑</el-button>
          <el-button
            type="text"
            v-if="scope.row.startStatus!=='已过期'"
            @click="goPage(scope.row.id, 'sendCoupon')"
          >发放</el-button>
          <el-button
            type="text"
            v-if="scope.row.startStatus==='已过期'"
            @click="goPage(scope.row.id, 'detailCoupon')"
          >查看详情</el-button>
          <el-button
            type="text"
            v-if="scope.row.startStatus==='已过期'"
            @click="delCoupon(scope.row.id)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <Pagination
      :pageNo="pagination.currentPage"
      :pageSize="pagination.pageSize"
      :totalCount="pagination.totalCount"
      :handleChange="handleCurrentChange"
    ></Pagination>
  </div>
</template>

<script>
  import { getCouponList, setDelCoupon } from '@/api/marketing'
  import { couponStatusTrans } from '@/filters/transform'
  import Pagination from '@/components/Pagination/index'

  export default {
    props: ['searchData'],
    components: { Pagination },
    data() {
      return {
        tableData: [],

        pagination: { // 分页数据
          currentPage: 1,
          pageSize: 20,
          totalCount: 0
        }
      }
    },

    created() {
      this.getTableData()
    },

    methods: {
      getTableData() {
        const params = { ...(this.searchData || {}) }
        params.pageNo = this.pagination.currentPage
        // ajax
        getCouponList(params).then(res => {
          if (res.data.length <= 0 && params.pageNo > 1) {
            this.handleCurrentChange(1)
            return
          }
          this.pagination.totalCount = res.totalCount
          this.pagination.pageSize = res.pageSize
          // 数据处理
          const data = [...res.data]
          data.forEach((v, i) => {
            if (v.expiryType === 'R') {
              v.date = `${v.gmtStartTime} 至 ${v.gmtEndTime}`
            } else if (v.expiryType === 'D') {
              v.date = `领取后${v.validDays}天`
            }
            v.startStatus = couponStatusTrans(v.startStatus)
            let temp = v.quota - v.quotaAlready
            if (temp < 0) {
              temp = 0
            }
            v.remain = `${temp}/${v.quota}`
          })
          this.tableData = data
        })
      },
      // 处理分页
      handleCurrentChange(val) {
        this.pagination.currentPage = val
        this.getTableData()
      },
      // 跳转
      goPage(id, pathName) {
        this.$router.push({
          name: pathName,
          query: {
            id: id
          }
        })
      },
      // 删除
      delCoupon(id) {
        this.$confirm('确认删除该优惠券?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const params = { id }
          setDelCoupon(params).then(res => {
            this.$message({ type: 'success', message: '删除成功' })
            this.handleCurrentChange(this.pagination.currentPage)
          })
        }).catch(() => {})
      }
    },

    watch: {
      searchData() {
        this.handleCurrentChange(1)
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
