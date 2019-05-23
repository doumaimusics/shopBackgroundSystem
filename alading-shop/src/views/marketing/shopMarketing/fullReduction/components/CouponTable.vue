<template>
  <div class="couponTable">
    <el-table :data="tableData" stripe>
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="name" label="活动名称"></el-table-column>

      <el-table-column prop="discountAmount" label="满减金额">
        <template slot-scope="scope">
          {{scope.row.type | changeStyle(scope.row.threshold,scope.row.discountAmount)}}
        </template>
      </el-table-column>

      <el-table-column prop="goodsCount" label="包含商品数量"></el-table-column>
      <el-table-column prop="date" label="起始结束时间" min-width="170">
        <template slot-scope="scope">
          {{formatTimestamp(scope.row.start)}} - {{formatTimestamp(scope.row.end)}}
        </template>
      </el-table-column>
      <el-table-column prop="startStatus" label="启用状态">
        <template slot-scope="scope">
          {{scope.row.status | changeStatus()}}
        </template>
      </el-table-column>
      <el-table-column prop="remain" label="创建时间" min-width="100">
        <template slot-scope="scope">
          {{formatTimestamp(scope.row.gmtCreate)}}
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="100">
        <template slot-scope="scope">
          <el-button
            type="text"
            v-if="scope.row.status=='C'"
            @click="openCoupon(scope.row.id,scope.row.status)"
          >开启</el-button>
          <el-button
            type="text"
            v-if="scope.row.status=='O'"
            @click="openCoupon(scope.row.id,scope.row.status)"
          >禁用</el-button>
          <el-button
            type="text"
            @click="edit(scope.row.id)"
          >编辑</el-button>
          <el-button
            type="text"
            @click="delCoupon(scope.row.id)"
          >删除</el-button>
          <!--<el-button-->
            <!--type="text"-->
            <!--@click="goPage(scope.row.id, 'detailCoupon')"-->
          <!--&gt;查看详情</el-button>-->

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
  /* eslint-disable no-unused-vars */

  import { getCouponList, getFullActivityList, deleteFullActivity, openFullActivity } from '@/api/marketing'
  import { formatTimestamp } from '@/utils/tools'
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

    filters: {
      changeStatus(val) {
        return val === 'O' ? '开启' : '禁用'
      },
      changeStyle(val, threshold, discountAmount) {
        let txt = ''
        switch (val) {
          case 'AMOUNT':
            txt = `满${threshold}元减${discountAmount}元`
            break
          case 'COUNT':
            txt = `满${threshold}件减${discountAmount}元`
            break
          case 'AMOUNTDISCOUNT':
            txt = `满${threshold}元打${discountAmount}折`
            break
          case 'COUNTDISCOUNT':
            txt = `满${threshold}件打${discountAmount}折`
            break
          case 'AMOUNTCOUNT':
            txt = `满${threshold}元任选${discountAmount}件`
            break
          case 'COUNTAMOUNT':
            txt = `满${threshold}件减${discountAmount}件`
            break
          default:
            txt = ''
        }
        return txt
      }
    },

    methods: {
      formatTimestamp,
      getTableData(flag) {
        // console.log(this.searchData)
        const params = { ...(this.searchData || {}) }
        params.pageNo = flag ? this.pagination.currentPage : 1
        getFullActivityList(params).then(res => {
          this.tableData = res.data
          if (!res.data) {
            this.tableData = res.data
            return
          }
          this.pagination.totalCount = res.totalCount
          this.pagination.pageSize = res.pageSize
        })
      },
      // 处理分页
      handleCurrentChange(val) {
        this.pagination.currentPage = val
        this.getTableData(true)
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
        this.$confirm('确认删除该满减活动?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const params = { id }
          deleteFullActivity(params).then(res => {
            this.$message({ type: 'success', message: '删除成功' })
            this.handleCurrentChange(this.pagination.currentPage)
          })
        }).catch(() => {

        })
      },
      // 编辑
      edit(id) {
        this.$router.push({
          name: 'editFullActivity',
          params: {
            id
          }
        })
      },
      //
      openCoupon(id, status) {
        const tip = status == 'O' ? '禁用' : '开启'
        this.$confirm('确认' + tip + '该满减活动?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const params = { id }
          openFullActivity(params).then(res => {
            if (res.code == 1000) {
              this.$message({ type: 'success', message: '设置成功' })
              this.handleCurrentChange(this.pagination.currentPage)
            }
          })
        }).catch(() => {

        })
      }
    },

    watch: {
      searchData() {
        this.getTableData()
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
