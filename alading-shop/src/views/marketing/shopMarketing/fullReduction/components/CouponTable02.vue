<template>
  <div class="couponTable">
    <el-table :data="tableData" stripe>
      <el-table-column prop="goodsId" label="商品ID" width="80"></el-table-column>

      <el-table-column prop="brandName" label="商品品牌"></el-table-column>

      <el-table-column prop="goodsName" label="商品名称" min-width="150"></el-table-column>

      <el-table-column label="商品图片">
        <template slot-scope="scope">
          <div class="imgBox">
            <img :src="scope.row.goodsIcon" alt="img">
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="fullCategoryName" label="商品类目" min-width="150"></el-table-column>

      <el-table-column prop="saleAmount" label="售价">
        <template slot-scope="scope">
          {{ scope.row.maxSaleAmount == scope.row.minSaleAmount ? scope.row.minSaleAmount : scope.row.minSaleAmount+'-'+scope.row.maxSaleAmount  }}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="60">
        <template slot-scope="scope">
          <el-button type="text" @click="setDelete(scope.row.id,scope.row.discountId)">删除</el-button>
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
  import { editFullGoods, deleteFullGoods } from '@/api/marketing'
  import Pagination from '@/components/Pagination/index'

  export default {
    props: ['id', 'num', 'searchData'],
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
      if (this.id) {
        this.getTableData()
      } else {

      }
    },
    watch: {
      num(val, oldVal) {
        if (this.num) {
          console.log(val + '===' + oldVal)
          this.getTableData()
        }
      }
    },
    methods: {
      getTableData(flag) {
        const params = { discountId: this.id }
        if (flag) {
          params.pageNo = this.pagination.currentPage
        } else {
          params.pageNo = 1
        }
        editFullGoods(params).then(res => {
          if (res.code === 1000) {
            this.pagination.totalCount = res.totalCount
            this.pagination.pageSize = res.pageSize
            this.tableData = res.data
          } else {
            this.$message.error(res.msg)
          }
        })
      },

      // 处理分页
      handleCurrentChange(val) {
        this.pagination.currentPage = val
        this.getTableData(true)
      },
      // 删除
      setDelete(id, discountId) {
        this.$confirm('确认删除该商品?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const params = { 'id': id, 'discountId': discountId }
          deleteFullGoods(params).then(res => {
            this.$message({ type: 'success', message: '删除成功' })
            this.handleCurrentChange(this.pagination.currentPage)
          })
        }).catch(() => {})
      }
    }
  }
</script>

<style lang="less" scoped>
  .imgBox {
    img {
      max-height: 60px;
      max-width: 80px;
    }
  }
</style>
