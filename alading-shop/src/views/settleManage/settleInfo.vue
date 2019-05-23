<template>
  <div class="components-container settleInfoBox">
    <!-- <b>结算详情</b> -->
    <div class="orderInfo sameOrder">
      <table>
        <tr>
          <th colpan="3" align="left">订单信息</th>
        </tr>
        <tr>
          <td width="300">订单号：{{data.orderNo}}</td>
          <!--<td width="300">订单状态：{{data.status}}</td>-->
          <td width="300">订单状态：{{ data.status | orderStatus() }}</td>
          <td width="300">创建时间：{{formatDateFn(data.gmtCreate)}}</td>
        </tr>
        <tr>
          <td width="300">付款时间：{{formatDateFn(data.gmtPay)}}</td>
          <td width="300">发货时间：{{formatDateFn(data.gmtDeliver)}}</td>
          <!--<td width="300">完成（关闭）时间：{{formatDateFn(data.gmtClosed)}}</td>-->
          <td width="300">完成（关闭）时间：{{ data.gmtClosed | changeTime(data.gmtFinished,data.gmtRebated,data.status) }}</td>
        </tr>
      </table>
    </div>
    <div class="goodInfo sameOrder sameTable">
      <b>商品信息</b>
      <table>
        <thead>
        <tr>
          <th width="20.5%">商品</th>
          <th width="16%">条形码</th>
          <th width="14.5%">规格</th>
          <th width="14.5%">单价</th>
          <th width="14.5%">数量</th>
          <!-- <th width="16.5%">优惠</th> -->
          <th>实付款</th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="data.balanceGoodsList">
          <td>{{data.balanceGoodsList[0].goodsName}}</td>
          <td>{{data.balanceGoodsList[0].barCode}}</td>
          <td>{{data.balanceGoodsList[0].goodsPriceName}}</td>
          <td>¥{{data.balanceGoodsList[0].saleAmount}}</td>
          <td>{{data.balanceGoodsList[0].count}}</td>
          <!-- <td>促销：减{{data.balanceGoodsList[0].}}元</td> -->
          <td>¥{{data.allAcuFee}} <br>（含快递: {{data.addExpressFee}}）</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="settleInfo sameOrder sameTable">
      <b>结算信息</b>
      <span>结算状态：{{changeTxt(data.balanceStatus)}} </span><span style="margin-left:40px">结算时间：{{formatDateFn(data.balanceTime)}}</span>

      <el-table :data="data.balanceDos" border stripe style="margin-top:20px">
        <el-table-column prop="result" label="结算对象"></el-table-column>
        <el-table-column prop="categoryName" label="类目"></el-table-column>
        <el-table-column prop="actualAmountl" label="实付款"></el-table-column>
        <el-table-column prop="commissionRate" label="佣金比例"></el-table-column>
        <el-table-column prop="balacneAmount" label="结算金额"></el-table-column>
      </el-table>
    </div>
    <router-link tag="button" class="btn el-button el-button--default el-button--medium" :to="{name:'settleOrder'}">返回</router-link>
  </div>
</template>
<script>
  import { balanceDetail } from '@/api/settleManage'
  import { formatTimestamp } from '@/utils/tools'

  export default {
    data() {
      return {
        data: {}
      }
    },
    created() {
      this.init()
    },
    filters: {
      orderStatus(val) {
        let newStatus
        switch (val) {
          case 'NEW' :
            newStatus = '新建/待付款'
            break
          case 'DEALING' :
            newStatus = '支付中'
            break
          case 'PAYFAIL' :
            newStatus = '支付失败'
            break
          case 'PAID' :
            newStatus = '已支付/待收货'
            break
          case 'REVIEW' :
            newStatus = '代买审核中'
            break
          case 'AGENCYCOMPLETED' :
            newStatus = '等待完成／等待收货'
            break
          case 'DELIVERED' :
            newStatus = '待收货'
            break
          case 'FINISHED' :
            newStatus = '订单完成'
            break
          case 'REBATED' :
            newStatus = '订单完成'
            break
          case 'CLOSED' :
            newStatus = '订单关闭(未付款或退款成功)'
            break
          case 'WAIT_REFUND' :
            newStatus = '等待退款'
            break
          case 'DEAL_REFUNDING' :
            newStatus = '退款中'
            break
          case 'PROCESSING' :
            newStatus = '订单处理中'
            break
        }
        return newStatus
      },
      changeTime(gmtClosed, gmtFinished, gmtRebated, status) {
        if (status === 'CLOSED') {
          return formatTimestamp(gmtClosed)
        }
        if (status === 'FINISHED') {
          return formatTimestamp(gmtFinished)
        }
        if (status === 'REBATED') {
          return formatTimestamp(gmtRebated)
        }
        return ''
      }
    },
    methods: {
      init() {
        balanceDetail({ orderId: this.$route.params.id }).then((res) => {
          console.log(res)
          this.data = res.data
        })
      },
      formatDateFn(val) {
        if (val) {
          return formatTimestamp(val)
        }
      },
      changeTxt(val) { // 数据文案修改
        if (val === 0) {
          return '未结算'
        } else if (val === 1) {
          return '已结算'
        }
      }
    }
  }
</script>
<style scoped lang="less">
  .settleInfoBox{
    font-size: 14px;

    .sameOrder{
      padding: 20px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
      margin-bottom: 25px;
      th{
        padding-bottom: 20px;
      }
    }
    .orderInfo{
      margin-top: 30px;
      td{
        padding: 10px 0;
      }
    }
    .sameTable{
      table{
        width: 100%;
        border-bottom: 1px solid #ebeef5;
        border-left: 1px solid #ebeef5;
        font-size: 14px;
        color: #606266;
        text-align: center;
      }
      th{
        padding: 10px 0;
        color: #909399;
        border-top: 1px solid #ebeef5;
        border-right: 1px solid #ebeef5;
      }
      td{
        padding: 10px;
        border-top: 1px solid #ebeef5;
        border-right: 1px solid #ebeef5;
      }
      b{
        display: block;
        padding-bottom: 20px;
      }
    }
    .btn{
      float: right;
      margin-bottom: 30px;
    }
  }
</style>
