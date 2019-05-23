<template>
  <div class="checkGoods">
    <el-card>
      <h4>报名的商品</h4>
      <el-table :data="tableData" stripe>
        <el-table-column prop="goodsId" label="商品ID"></el-table-column>
        <el-table-column label="商品图片">
          <template slot-scope="scope">
            <div class="imgBox"><img :src="scope.row.goodsIcon" alt=""></div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商品名称" min-width="150"></el-table-column>
        <el-table-column label="售价" v-if="type!==2">
          <template slot-scope="scope">
            <span>{{scope.row.minSaleAmount}}</span>
            <span v-if="scope.row.minSaleAmount!==scope.row.maxSaleAmount">-</span>
            <span v-if="scope.row.minSaleAmount!==scope.row.maxSaleAmount">{{scope.row.maxSaleAmount}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="specialPrice" label="活动价" v-if="type!==2">
          <template slot-scope="scope">
            <span>{{scope.row.minSpecialPrice}}</span>
            <span v-if="scope.row.minSpecialPrice!==scope.row.maxSpecialPrice">-</span>
            <span v-if="scope.row.minSpecialPrice!==scope.row.maxSpecialPrice">{{scope.row.maxSpecialPrice}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="limitCount" label="活动库存" v-if="type!==2"></el-table-column>
        <el-table-column label="审核状态">
          <template slot-scope="scope">
            <span>{{scope.row.verify | joinableGoodsStatusTrans}}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注">
          <template slot-scope="scope">
            <span v-if="[4,5].indexOf(scope.row.verify)>-1">{{scope.row.remark}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" :min-width="type!==2 ? 120 : 40">
          <template slot-scope="scope">
            <el-button type="text"
              @click="onCancel(scope.row)"
              v-if="scope.row.verify===2"
            >取消</el-button>
            <el-button type="text"
              @click="onEdit(scope.row.goodsId,scope.row.times)"
              v-if="[1,5].indexOf(scope.row.verify)>-1 && type!==2"
            >编辑</el-button>
            <el-button type="text"
              @click="onSubmit(scope.row)"
              v-if="[1,5].indexOf(scope.row.verify)>-1"
            >提交</el-button>
            <!-- <el-button type="text"
              @click="onDelete(scope.row)"
              v-if="scope.row.verify===4 || ([1,5].indexOf(scope.row.verify)>-1&&type!==2)"
            >删除</el-button> -->
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
    </el-card>

    <el-dialog
      title="编辑"
      :visible.sync="dialogVisible"
      width="90%"
      :close-on-click-modal="false"
    >
      <EditGoods v-if="dialogVisible" :id="id" :goodsId="goodsId" @callback="onDialog" :limit="limit" ></EditGoods>
    </el-dialog>
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination/index'
  import EditGoods from './EditGoods'
  import { getJoinActivityGoods } from '@/api/marketing'
  import { joinableGoodsStatusTrans } from '@/filters/transform'
  import {
    setCancelJoinableGoods,
    setSubmitJoinableGoods,
    setDelJoinableGoods
  } from '@/api/marketing'

  export default {
    props: ['id', 'type', 'onChange', 'limit'],
    components: { Pagination, EditGoods },
    filters: { joinableGoodsStatusTrans },
    data() {
      return {
        tableData: [],
        pagination: {
          currentPage: 1, // 分页数据
          pageSize: 20,
          totalCount: 0
        },
        dialogVisible: false,
        goodsId: ''
      }
    },
    created() {
      // 防止接口返回结果混淆
      setTimeout(() => {
        this.getTableData()
      }, 1)
    },
    methods: {
      getTableData() {
        const params = {
          pageNo: this.pagination.currentPage,
          activityEnterId: this.id,
          activityType: 1
        }
        // ajax
        getJoinActivityGoods(params).then(res => {
          if (res.data.length <= 0 && params.pageNo > 1) {
            this.handleCurrentChange(1)
            return
          }
          this.tableData = res.data
          this.pagination.totalCount = res.totalCount
          this.pagination.pageSize = res.pageSize
          // 数据处理
          let submitLen = 0
          this.tableData.forEach(v => {
            // 转换前：1待提交 2已提交待审 3初审成功 4审核成功 5初审审核失败  6复审审核失败  7初审打回 8复审打回
            // 转换后：1待提交 2审核中 3审核成功 4审核未通过 5已打回
            switch (v.verify) {
              case 1:
                v.verify = 1
                break
              case 2:
                v.verify = 2
                break
              case 3:
                v.verify = 2
                break
              case 4:
                v.verify = 3
                break
              case 5:
                v.verify = 4
                break
              case 6:
                v.verify = 4
                break
              case 7:
                v.verify = 5
                break
              case 8:
                v.verify = 5
                break
              default:
                v.verify = 0
            }
            if ([2, 3].indexOf(v.verify) > -1) {
              submitLen++
            }
          })
          this.$emit('onChange', {
            totalLen: res.totalCount,
            submitLen: submitLen
          })
        })
      },
      // 处理分页
      handleCurrentChange(val) {
        this.pagination.currentPage = val
        this.getTableData()
      },
      // 取消
      onCancel(obj) {
        this.$confirm('确定取消审核?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '再想想',
          type: 'warning'
        }).then(() => {
          const params = {
            goodsId: obj.goodsId,
            activityEnterId: this.id,
            activityEnterGoodsId: obj.id
          }
          setCancelJoinableGoods(params).then(res => {
            this.$message({ type: 'success', message: '取消成功' })
            this.getTableData()
          })
        }).catch(() => {})
      },
      // 提交
      onSubmit(obj) {
        const params = {
          goodsId: obj.goodsId,
          activityEnterId: this.id,
          activityEnterGoodsId: obj.id
        }
        setSubmitJoinableGoods(params).then(res => {
          this.$message({ type: 'success', message: '提交成功' })
          this.getTableData()
        })
      },
      // 编辑
      onEdit(id, times) {
        this.goodsId = id
        this.limit.editTimes = times
        this.dialogVisible = true
      },
      // 编辑提交 / 关闭模态框
      onDialog(payload) {
        this.dialogVisible = false
        if (payload.isSubmit) {
          this.getTableData()
        }
      }
      // 删除
      /* onDelete(obj) {
        this.$confirm('确定删除该项?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const params = {
            goodsId: obj.goodsId,
            activityEnterId: this.id,
            activityEnterGoodsId: obj.id
          }
          setDelJoinableGoods(params).then(res => {
            this.$message({ type: 'success', message: '删除成功' })
            this.getTableData()
          })
        }).catch(() => {})
      }, */
    }
  }
</script>

<style lang="less" scoped>
  .checkGoods {
    padding-bottom: 20px;
  }
  h4 {
    font-weight: 700;
    font-size: 16px;
    padding-bottom: 10px;
  }
  .imgBox {
    width: 60px;
    height: 60px;
    img {
      width: auto;
      max-height: 100%;
    }
  }
</style>
