<template>
  <div class="afterService-container">

    <!-- 售后统计 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <h3>售后统计</h3>
      </div>
      <div class="text item">
        <ul class="sectionMain">
          <li>
            <p>未完结</p>
            <p><h3>{{afterCount.totalCount}}</h3></p>
          </li>
          <li>
            <p>退货待处理：<span>{{afterCount.refundGoodsCount}}</span></p>
            <p>待买家发货：<span>{{afterCount.buyerDeliverCount}}</span></p>
          </li>
          <li>
            <p>退款待处理：<span>{{afterCount.refundAmountCount}}</span></p>
            <p>待商家收货：<span>{{afterCount.sellerReceivingCount}}</span></p>
          </li>
          <li>
            <p>换货待处理：<span>{{afterCount.exchangeGoodsCount}}</span></p>
            <p>待买家收货：<span>{{afterCount.buyerReceivingCount}}</span></p>
          </li>
          <li>
            <p>待商家发货：<span>{{afterCount.sellerDeliverCount}}</span></p>
            <p>待完结：<span>{{afterCount.refundingCount}}</span></p>
          </li>
        </ul>
      </div>
    </el-card>

    <!-- 搜索筛选 -->
    <div class="formSearch searchFilter">
      <!-- <h4>售后管理</h4> -->
      <el-form ref="form" label-width="80px">
        <ul>
          <li>
            <el-form-item label="买家账号">
              <el-input placeholder="请输入内容" v-model="buyerNo"></el-input>
            </el-form-item>
          </li>
          <li>
            <el-form-item label="订单号">
              <el-input placeholder="请输入内容" v-model="orderNo"></el-input>
            </el-form-item>
          </li>
          <li class="afterSaleNo">
            <el-form-item label="物流状态">
              <el-select v-model="orderStatus" placeholder="请选择">
                <el-option label="全部" value=""></el-option>
                <el-option label="已发货" :value="true"></el-option>
                <el-option label="未发货" :value="false"></el-option>
              </el-select>
            </el-form-item>
          </li>
          <li class="afterSaleNo">
            <el-form-item label="售后单号">
              <el-input placeholder="请输入内容" v-model="afterServiceNo"></el-input>
            </el-form-item>
          </li>
          <li class="afterSaleNo">
            <el-form-item label="售后类型">
              <el-select v-model="type" @change="getSaleType" placeholder="请选择" :disabled="saleTypeStatus">
                <el-option label="全部" value=""></el-option>
                <el-option label="退货退款" value="1"></el-option>
                <el-option label="仅退款" value="2"></el-option>
                <el-option label="换货" value="3"></el-option>
              </el-select>
            </el-form-item>
          </li>
          <li class="afterSaleNo">
            <el-form-item label="售后原因">
              <el-select v-model="userReason" placeholder="请选择">
                <el-option label="全部" value=""></el-option>
                <el-option
                  v-for="item in fliterCauseOption"
                  :key="item.id"
                  :label="item.cause"
                  :value="item.cause">
                </el-option>
              </el-select>
            </el-form-item>
          </li>
          <li class="activityTime">
            <el-form-item label="申请时间">
              <el-date-picker
                v-model="dateRange"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </li>
        </ul>
      </el-form>

      <!-- 按钮 -->
      <div class="btn">
        <el-button type="primary" @click="onSubmit">搜索</el-button>
        <el-button @click="resetFrom">重置</el-button>
        <el-button @click="exportAfterServiceCsv">导出订单</el-button>
      </div>
    </div>

    <!-- tab栏切换 -->
    <div class="tab StatusTab">
      <el-tabs type="card" v-model="tabsValue" @tab-click="tabsClick">
        <el-tab-pane label="全部" name="0">
          <GoodsList :searchData="params" :tabsValue="tabsValue" v-if="tabsValue === '0'"></GoodsList>
        </el-tab-pane>
        <!--
        <el-tab-pane label="未发货" name="1">
          <GoodsList :searchData="params" :tabsValue="tabsValue" v-if="tabsValue === '1'"></GoodsList>
        </el-tab-pane>
        <el-tab-pane label="已发货" name="2">
          <GoodsList :searchData="params" :tabsValue="tabsValue" v-if="tabsValue === '2'"></GoodsList>
        </el-tab-pane>
        <el-tab-pane label="待退货" name="3">
          <GoodsList :searchData="params" :tabsValue="tabsValue" v-if="tabsValue === '3'"></GoodsList>
        </el-tab-pane>
        <el-tab-pane label="待收货" name="4">
          <GoodsList :searchData="params" :tabsValue="tabsValue" v-if="tabsValue === '4'"></GoodsList>
        </el-tab-pane>
        <el-tab-pane label="退款成功" name="5">
          <GoodsList :searchData="params" :tabsValue="tabsValue" v-if="tabsValue === '5'"></GoodsList>
        </el-tab-pane>
        <el-tab-pane label="退款关闭" name="6">
          <GoodsList :searchData="params" :tabsValue="tabsValue" v-if="tabsValue === '6'"></GoodsList>
        </el-tab-pane>
        -->
        <!---->
        <el-tab-pane label="退货待处理" name="1">
          <GoodsList :searchData="params" :tabsValue="tabsValue" v-if="tabsValue === '1'"></GoodsList>
        </el-tab-pane>
        <el-tab-pane label="退款待处理" name="2">
          <GoodsList :searchData="params" :tabsValue="tabsValue" v-if="tabsValue === '2'"></GoodsList>
        </el-tab-pane>
        <el-tab-pane label="换货待处理" name="3">
          <GoodsList :searchData="params" :tabsValue="tabsValue" v-if="tabsValue === '3'"></GoodsList>
        </el-tab-pane>
        <el-tab-pane label="待买家发货" name="4">
          <GoodsList :searchData="params" :tabsValue="tabsValue" v-if="tabsValue === '4'"></GoodsList>
        </el-tab-pane>
        <el-tab-pane label="待商家收货" name="5">
          <GoodsList :searchData="params" :tabsValue="tabsValue" v-if="tabsValue === '5'"></GoodsList>
        </el-tab-pane>
        <el-tab-pane label="待商家发货" name="6">
          <GoodsList :searchData="params" :tabsValue="tabsValue" v-if="tabsValue === '6'"></GoodsList>
        </el-tab-pane>
        <el-tab-pane label="待买家收货" name="7">
          <GoodsList :searchData="params" :tabsValue="tabsValue" v-if="tabsValue === '7'"></GoodsList>
        </el-tab-pane>
        <el-tab-pane label="售后完成" name="8">
          <GoodsList :searchData="params" :tabsValue="tabsValue" v-if="tabsValue === '8'"></GoodsList>
        </el-tab-pane>
        <el-tab-pane label="售后关闭" name="9">
          <GoodsList :searchData="params" :tabsValue="tabsValue" v-if="tabsValue === '9'"></GoodsList>
        </el-tab-pane>
      </el-tabs>
      <!--
      <div class="tip">
        <p>用户申请售后72小时内未操作即默认通过</p>
      </div>
      -->
    </div>

  </div>
</template>

<script>
  import { setAfterSaleExport, getAfterSaleCount, getAfterSaleCause } from '@/api/deal'
  import GoodsList from './components/GoodsList'
  import { getQueryObject, downloadFile } from '@/utils/tools'

  export default {
    data() {
      return {
        dateRange: '',
        afterServiceNo: '', // 售后单号
        buyerNo: '', // 买家账号
        orderNo: '', // 订单号
        orderStatus: '', // 物流状态
        type: '', // 售后类型
        userReason: '', // 售后原因
        params: {}, // 售后列表请求参数

        tabsValue: '0', // tabs选中时的value
        value: '',
        saleTypeStatus: false, // 可选

        causeOption: [], // 售后原因
        fliterCauseOption: [],

        afterCount: {
          buyerDeliverCount: 0,
          buyerReceivingCount: 0,
          exchangeGoodsCount: 0,
          refundAmountCount: 0,
          refundGoodsCount: 0,
          sellerReceivingCount: 0,
          totalCount: 0,
          refundingCount: 0,
          sellerDeliverCount: 0
        }
      }
    },

    created() {
      this.getType()
    },

    methods: {
      // 获取售后类型
      getSaleType(val) {
        this.fliterCauseOption = []
        for (let i = 0; i < this.causeOption.length; i++) {
          if (this.causeOption[i].type == val) {
            this.fliterCauseOption.push(this.causeOption[i])
          }
        }
      },
      // 获取路由参数的tab栏type
      getType() {
        this.tabsValue = this.$route.query.type || this.tabsValue
        this.getAfterCount()
        this.getAfterCause()
      },
      // 获取售后统计
      getAfterCount() {
        getAfterSaleCount({}).then(res => {
          if (res.code === 1000) {
            this.afterCount.buyerDeliverCount = res.data.buyerDeliverCount
            this.afterCount.buyerReceivingCount = res.data.buyerReceivingCount
            this.afterCount.exchangeGoodsCount = res.data.exchangeGoodsCount
            this.afterCount.refundAmountCount = res.data.refundAmountCount
            this.afterCount.refundGoodsCount = res.data.refundGoodsCount
            this.afterCount.sellerReceivingCount = res.data.sellerReceivingCount
            this.afterCount.totalCount = res.data.totalCount
            this.afterCount.refundingCount = res.data.refundingCount
            this.afterCount.sellerDeliverCount = res.data.sellerDeliverCount
          }
        })
      },
      // 获取售后原因
      getAfterCause() {
        getAfterSaleCause({}).then(res => {
          if (res.code === 1000) {
            this.causeOption = res.data
            this.tabsClick()
          } else {
            this.causeOption = []
          }
        })
      },
      // 切换tab栏改变地址
      tabsClick() {
        if (window.history.replaceState) {
          window.history.replaceState(null, null, `#${this.$route.path}?type=${this.tabsValue}`)
        }
        const name = getQueryObject().type
        console.log(name)
        if (name === '1' || name === '2' || name === '3') {
          this.saleTypeStatus = true
          this.type = name
          this.getSaleType(name)
        } else {
          this.saleTypeStatus = false
          this.type = ''
          this.getSaleType('')
        }
      },
      // 重置按钮
      resetFrom() {
        this.dateRange = ''
        this.afterServiceNo = ''
        this.buyerNo = ''
        this.orderNo = ''
        this.type = ''
        this.userReason = ''
        this.onSubmit()
      },
      // 提交搜索
      onSubmit() {
        if (!this.dateRange) {
          var timeStart = ''
          var timeEnd = ''
        } else {
          timeStart = this.dateRange[0].getTime()
          timeEnd = this.dateRange[1].getTime()
        }
        this.params = {
          applyBeginDate: timeStart,
          applyEndDate: timeEnd,
          applyNo: this.afterServiceNo,
          saleAccount: this.buyerNo,
          orderNo: this.orderNo,
          orderStatus: this.orderStatus,
          userReason: this.userReason,
          type: this.type
        }
      },
      // 导出售后单
      exportAfterServiceCsv() {
        let query = { ...this.params }
        let status = ''
        let type = ''
        /*
        switch (this.tabsValue) {
          case '0':
            status = ''
            break
          case '1':
            status = 'NEW'
            break
          case '2':
            status = 'NEW'
            break
          case '3':
            status = 'WAIT_GOODS_BACK'
            break
          case '4':
            status = 'GOODS_BACKIING'
            break
          case '5':
            status = 'FINISH'
            break
          case '6':
            status = 'CLOSE'
            break
          default:
            status = 'ALL'
        }
        */
        switch (this.tabsValue) {
          case '0':
            status = ''
            break
          case '1':
            type = 1
            status = 'NEW' // 退货待处理
            break
          case '2':
            type = 2
            status = 'NEW' // 退款待处理
            break
          case '3':
            type = 3
            status = 'new' // 换货待处理
            break
          case '4':
            status = 'WAIT_GOODS_BACK' // 待买家发货
            break
          case '5':
            status = 'GOODS_BACKIING ' // 待商家收货
            break
          case '6':
            // type = 3
            status = 'SELLER_SIGNED' // 待商家发货
            break
          case '7':
            status = 'SELLER_DELIVER' // 待买家收货
            break
          case '8':
            status = 'FINISH' // 售后完成
            break
          case '9':
            status = 'CLOSE' // 售后关闭
            break
          default:
            status = 'ALL'
        }
        query.status = status
        query.type = query.type ? query.type : type
        // if (this.tabsValue === '1') {
        //  query.orderStatus = 'false'
        // } else if (this.tabsValue === '2') {
        //  query.orderStatus = 'true'
        // }
        downloadFile(setAfterSaleExport(query))
      }
    },

    components: { GoodsList }
  }
</script>

<style lang="scss" scoped>
  .afterService-container {
    padding: 20px;
    font-size: 14px;
    .box-card{
      margin-bottom: 30px;
    }
    .sectionMain {
      display: flex;
      flex-wrap: wrap;
      h3{
        font-weight: bold;
      }
      li {
        flex: 1;
        width: 20%;
        min-width: 20%;
        max-width: 20%;
        word-break: break-all;
        padding-right: 20px;
        p{
          color: #666;
          line-height: 40px;
        }
      }
    }
    // 搜索筛选
    .searchFilter {
      h4 {
        padding-left: 10px;
        margin-bottom: 20px;
        font-weight: 700;
      }
      ul {
        display: flex;
        flex-wrap: wrap;
      }
      .el-date-editor {
        width: 360px;

        /deep/ .el-range-separator {
          width: 24px;
          color: #999;
        }
        /deep/ .el-range-input {
          width: 140px;
        }
      }
    }

    // 订单状态切换栏tab
    .StatusTab {
      margin-top: 20px;
      position: relative;

      .tip {
        position: absolute;
        top: 10px;
        right: 10px;
        color: #999;
      }
    }
  }
</style>
