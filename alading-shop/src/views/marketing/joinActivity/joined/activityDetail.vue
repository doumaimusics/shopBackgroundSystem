<template>
  <div class="activityDetail">
    <el-card class="table">
      <h4>报名的商品</h4>
      <el-table :data="tableData" stripe>
        <el-table-column prop="goodsId" label="商品ID"></el-table-column>
        <el-table-column label="商品图片">
          <template slot-scope="scope">
            <div class="imgBox"><img :src="scope.row.goodsIcon" alt=""></div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商品名称" min-width="150"></el-table-column>
        <el-table-column label="活动价">
          <template slot-scope="scope">
            <span>{{scope.row.minSpecialPrice}}</span>
            <span v-if="scope.row.minSpecialPrice!==scope.row.maxSpecialPrice">-</span>
            <span v-if="scope.row.minSpecialPrice!==scope.row.maxSpecialPrice">{{scope.row.maxSpecialPrice}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="payOrderCount" label="总支付订单"></el-table-column>
        <el-table-column prop="totalPayAmount" label="总支付金额"></el-table-column>
        <el-table-column prop="refundOrderCount" label="退款订单"></el-table-column>
        <el-table-column prop="totalRefundAmount" label="退款金额"></el-table-column>
        <el-table-column label="操作" v-if="infoData.baseInfo.activityType!==2">
          <template slot-scope="scope">
            <el-button type="text" @click="addAmount(scope.row.goodsId)">增加库存</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <Pagination
        :pageNo="pagination.pageNo"
        :pageSize="pagination.pageSize"
        :totalCount="pagination.totalCount"
        :handleChange="handleCurrentChange"
      ></Pagination>
    </el-card>

    <ActivityInfo :data="infoData" :isJoined="true"></ActivityInfo>

    <el-dialog
      title="增加库存"
      class="dialog"
      width="500px"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
    >
      <div class="field">
        <div class="left">规格</div>
        <div class="right">库存</div>
      </div>
      <ul class="sku">
        <li v-for="item in formData" :key="item.id">
          <p>{{item.specNames}}</p>
          <div>
            <el-input-number
              controls-position="right"
              v-model="item.amount"
              :min="1"
            ></el-input-number>
          </div>
        </li>
      </ul>
      <div class="btn">
        <el-button type="default" @click="onCancel">取消</el-button>
        <el-button type="primary" @click="onSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination/index'
  import ActivityInfo from '../components/ActivityInfo'
  import {
    getJoinActivityDetail,
    getJoinActivityGoods,
    getEditTypeGoods,
    setAddSkuAmount
  } from '@/api/marketing'
  import { joinActivityLevelTrans } from '@/filters/transform'

  export default {
    components: { Pagination, ActivityInfo },
    data() {
      return {
        tableData: [],
        pagination: {
          pageNo: 1, // 分页数据
          pageSize: 20,
          totalCount: 0
        },
        infoData: {
          baseInfo: {}
        },
        id: '',

        dialogVisible: false, // 模态框
        formData: [],
        goodsId: ''
      }
    },
    created() {
      this.getParams()
      this.getDetail()
      // 防止接口返回结果混淆
      setTimeout(() => {
        this.getTableData()
      }, 1)
    },
    methods: {
      getParams() {
        this.id = this.$route.query.id
      },
      // 获取活动详情
      getDetail() {
        const params = {
          id: this.id,
          activityType: 2
        }
        getJoinActivityDetail(params).then(res => {
          this.infoData = {
            baseInfo: {
              activityType: res.data.afActivityEnterDo.activityType,
              name: res.data.name,
              showAddress: res.data.afActivityEnterDo.showAddress,
              time: res.data.gmtStartTime + ' 至 ' + res.data.gmtEndTime,
              status: res.data.startStatus,
              level: joinActivityLevelTrans(
                res.data.type,
                res.data.threshold,
                res.data.discountAmount,
                res.data.discountType
              )
            }
          }
        })
      },
      // 获取活动报名商品
      getTableData() {
        const params = {
          activityEnterId: this.id,
          activityType: 2,
          pageNo: this.pagination.pageNo
        }
        getJoinActivityGoods(params).then(res => {
          // if (res.data.length === 0 && params.pageNo > 1) {
          //   this.handleCurrentChange(1)
          // }
          this.tableData = res.data || []
          this.pagination.totalCount = res.totalCount
          this.pagination.pageSize = res.pageSize
        })
      },
      // 处理分页
      handleCurrentChange(val) {
        this.pagination.pageNo = val
        this.getTableData()
      },
      // 增加库存按钮
      addAmount(id) {
        this.dialogVisible = true
        if (this.goodsId === id) {
          this.formData.forEach(v => {
            v.amount = undefined
          })
        } else {
          this.formData = []
          this.goodsId = id
          // 设置参数
          const params = {
            activityEnterId: this.id,
            goodsId: id
          }
          // ajax
          getEditTypeGoods(params).then(res => {
            this.formData = res.data
          })
        }
      },
      onCancel() {
        this.dialogVisible = false
      },
      // 提交库存的增加
      onSubmit() {
        let isEmpty = true
        this.formData.forEach(v => {
          if (v.amount) {
            isEmpty = false
          }
        })
        if (isEmpty) {
          this.$message({ type: 'warning', message: '请输入增加的库存量' })
          return
        }
        const params = {
          activityEnterId: this.id
        }
        params.activityEnterGoodsVos = this.formData.filter(v => !!v.amount).map(v => {
          return {
            id: v.id,
            goodsId: v.goodsId,
            priceId: v.priceId,
            limitCount: v.amount
          }
        })
        // ajax
        setAddSkuAmount(params).then(res => {
          this.$message({ type: 'success', message: '库存增加成功' })
          this.dialogVisible = false
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .activityDetail {
    padding: 20px;
  }
  .table {
    margin-bottom: 30px;
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
  }
  .dialog {
    .field {
      display: flex;
      padding-bottom: 20px;
      font-weight: 700;

      div {
        flex: 1;
      }
    }
    .sku {
      li {
        display: flex;

        p {
          margin-bottom: 22px;
          height: 36px;
          line-height: 36px;
          width: 50%;
        }
      }
    }
    .btn {
      text-align: right;
      padding-top: 20px;
      padding-right: 30px;
    }
  }
</style>
