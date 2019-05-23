<template>
  <div class="afterServiceInfo" v-loading="loading">
    <!--步骤条-->
    <!--退货退款-->
    <el-card class="box-card">
      <!--退货退款-->
      <!--
      <div v-if="type==1" slot="header" class="clearfix">
        <div v-if="basicAbout.afterSaleStatus=='NOTPASS' || basicAbout.afterSaleStatus=='CLOSE' || basicAbout.afterSaleStatus=='CLOSING'">
          <el-steps :active="stepActive" simple>
            <el-step title="待审核"></el-step>
            <el-step title="售后关闭"></el-step>
          </el-steps>
        </div>
        <div v-else>
          <el-steps :active="stepActive" simple>
            <el-step title="待审核"></el-step>
            <el-step title="待买家发货"></el-step>
            <el-step title="待商家收货"></el-step>
            <el-step v-if="basicAbout.afterSaleStatus=='CLOSING'" title="售后关闭"></el-step>
            <el-step v-else title="售后完成"></el-step>
          </el-steps>
        </div>
      </div>
        -->

      <div v-if="type==1" slot="header" class="clearfix">
        <el-steps :active="stepActive" simple>
          <el-step title="待审核"></el-step>
          <el-step title="待买家发货"></el-step>
          <el-step title="待商家收货"></el-step>
          <el-step v-if="basicAbout.afterSaleStatus=='CLOSING' || basicAbout.afterSaleStatus=='NOTPASS' || basicAbout.afterSaleStatus=='CLOSE'" title="售后关闭"></el-step>
          <el-step v-else title="售后完成"></el-step>
        </el-steps>
      </div>

      <!--仅退款-->
      <div v-if="type==2" slot="header" class="clearfix">
        <div v-if="basicAbout.afterSaleStatus=='CLOSING' || basicAbout.afterSaleStatus=='NOTPASS' || basicAbout.afterSaleStatus=='CLOSE'">
          <el-steps :active="stepActive" simple>
            <el-step title="待审核"></el-step>
            <el-step title="售后关闭"></el-step>
          </el-steps>
        </div>
        <div v-else>
          <el-steps :active="stepActive" simple>
            <el-step title="待审核"></el-step>
            <el-step title="售后完成"></el-step>
          </el-steps>
        </div>
      </div>

      <div v-if="type==3">
        <!--换货-收货时候关闭-->
        <div v-if="basicAbout.afterSaleStatus=='CLOSING' || basicAbout.afterSaleStatus=='CLOSE' || basicAbout.afterSaleStatus=='NOTPASS'">
          <el-steps :active="stepActive" simple>
            <el-step title="待审核"></el-step>
            <el-step title="待买家发货"></el-step>
            <el-step title="待商家收货"></el-step>
            <el-step title="售后关闭"></el-step>
          </el-steps>
        </div>
        <!--换货-->
        <div v-else>
          <el-steps :active="stepActive" simple>
            <el-step title="待审核"></el-step>
            <el-step title="待买家发货"></el-step>
            <el-step title="待商家收货"></el-step>
            <el-step title="待商家发货"></el-step>
            <el-step title="待买家收货"></el-step>
            <el-step title="售后完成"></el-step>
          </el-steps>
        </div>
      </div>

      <dl class="text item curStatus">
        <dt>当前售后状态：{{ basicAbout.afterSaleStatus | afterStatusTrans(type) }}</dt>
        <dd v-if="basicAbout.afterSaleStatus=='NEW'">买家提交售后申请，请于72小时内完成审核，逾期未审核将自动审核通过</dd>
        <dd v-if="basicAbout.afterSaleStatus=='WAIT_GOODS_BACK'">买家将在7天内回寄，逾期未回寄将自动关闭售后单</dd>

        <dd v-if="basicAbout.type==1">
          <p v-if="basicAbout.afterSaleStatus=='GOODS_BACKIING'">买家已回寄，10天未确认收货将自动确认并退款</p>
          <p v-if="basicAbout.afterSaleStatus=='FINISH'">已退货退款</p>
          <p v-if="basicAbout.afterSaleStatus=='CLOSING' || basicAbout.afterSaleStatus=='NOTPASS' || basicAbout.afterSaleStatus=='CLOSE'">{{basicAbout.closeCause}}</p>
        </dd>

        <dd v-if="basicAbout.type==2">
          <p v-if="basicAbout.afterSaleStatus=='REFUNDING'">退款正在处理中，请稍后</p>
          <p v-if="basicAbout.afterSaleStatus=='FINISH'">已退款</p>
          <p v-if="basicAbout.afterSaleStatus=='CLOSING' || basicAbout.afterSaleStatus=='NOTPASS' || basicAbout.afterSaleStatus=='CLOSE'" >{{basicAbout.closeCause}}</p>
        </dd>

        <dd v-if="basicAbout.type==3">
          <p v-if="basicAbout.afterSaleStatus=='GOODS_BACKIING'">买家已回寄，收到后请确认收货再换货</p>

          <p v-if="basicAbout.afterSaleStatus=='SELLER_SIGNED'">
            已确认收货，请尽快换货回寄
            <span class="sendGood">
              <Deliver :isAfterSale="true" :orderId="afterServiceId" type="1" @isSuccessFn="isSuccessFn"></Deliver>
            </span>
          </p>

          <p v-if="basicAbout.afterSaleStatus=='SELLER_DELIVER'">已换货发出，请等待买家签收</p>
          <p v-if="basicAbout.afterSaleStatus=='FINISH'">买家已签收，售后完成</p>
          <p v-if="basicAbout.afterSaleStatus=='CLOSING' || basicAbout.afterSaleStatus=='NOTPASS' || basicAbout.afterSaleStatus=='CLOSE'" >{{basicAbout.closeCause}}</p>
        </dd>

        <!-- 发货模板 -->
        <!--
        <dd class="sendGood" v-if="basicAbout.type==3&&basicAbout.afterSaleStatus=='SELLER_SIGNED'">
          <Deliver :isAfterSale="true" :orderId="afterServiceId" type="1" @isSuccessFn="isSuccessFn"></Deliver>
        </dd>
        -->
      </dl>
    </el-card>


    <!-- 售后信息 -->
    <el-card class="afterServiceAbout section">
      <h4>售后信息</h4>
      <!-- 基本信息 -->
      <ul class="basicAbout sectionMain">
        <li>
          <p>订单编号：</p>
          <p>{{orderNo}}</p>
        </li>
        <li>
          <p>售后单号：</p>
          <p>{{basicAbout.applyNo}}</p>
        </li>
        <li>
          <p>售后类型：</p>
          <p>{{ basicAbout.type | afterType }}</p>
        </li>
        <li>
          <p>售后原因：</p>
          <p>{{basicAbout.refundCause}}</p>
        </li>
        <li>
          <p>申请时间：</p>
          <p>{{basicAbout.afterTime}}</p>
        </li>

        <li v-if="basicAbout.type!=3">
          <p>退款金额：</p>
          <p>{{basicAbout.actualAmount ? `￥${basicAbout.actualAmount}` : '￥0'}}</p>
        </li>
        <template v-else>
          <li>
            <p>换货商品：</p>
            <p>{{logisticsData.goodsName}}</p>
          </li>
          <li>
            <p>换货商品规格：</p>
            <p>{{logisticsData.goodsPriceName}}</p>
          </li>
          <li>
            <p>换货商品数量：</p>
            <p>{{logisticsData.goodsCount}}</p>
          </li>
          <li>
            <p>换货收货信息：</p>
            <p>{{logisticsData.buyerName}}-{{logisticsData.buyerMobile}}-{{logisticsData.buyerAddress}}</p>
          </li>
        </template>
        <li>
          <p>售后说明：</p>
          <p>{{basicAbout.userReason}}</p>
        </li>
        <!--<li>-->
          <!--<p>售后状态：</p>-->
          <!--<p>{{basicAbout.afterSaleStatus | afterStatusTrans}}</p>-->
        <!--</li>-->
        <!--<li>-->
          <!--<p>订单发货状态：</p>-->
          <!--<p>{{basicAbout.orderLogisticsNo ? '已发货' : '未发货'}}</p>-->
        <!--</li>-->
      </ul>
      <!-- 图片预览组件 -->
      <div class="applyReason">
        <div>
          <span>图片凭证: </span>
          <div class="imgBox">
            <ImgPreview :imgList="applyReasonImg"></ImgPreview>
          </div>
        </div>
      </div>

      <!-- 商品表格 -->
      <!--
      <ul class="goodsAbout sectionTable">
        <el-table :data="[basicAbout]" max-height="300" border stripe>
          <el-table-column prop="goodTitle" label="退货商品"></el-table-column>
          <el-table-column prop="barCode" label="条形码"></el-table-column>
          <el-table-column prop="goodSpecification" label="规格"></el-table-column>
          <el-table-column prop="priceAmount" label="单价"></el-table-column>
          <el-table-column prop="count" label="数量"></el-table-column>
          <el-table-column label="店铺优惠">
            <template slot-scope="scope">
              {{scope.row.shopCouponAmount ? `￥${scope.row.shopCouponAmount}` : ''}}
            </template>
          </el-table-column>
          <el-table-column label="退款金额">
            <template slot-scope="scope">
              {{scope.row.actualAmount ? `￥${scope.row.actualAmount}` : '￥0'}}
            </template>
          </el-table-column>
        </el-table>
      </ul>
      -->

    </el-card>

    <!--换货物流-->
    <el-card class="backInfo section" v-if="basicAbout.type==3&&basicAbout.afterSaleStatus=='SELLER_DELIVER'" >
      <h4>换货物流</h4>
      <ul class="sectionMain">
        <li>
          <p>物流状态：</p>
          <p></p>
        </li>
        <li>
          <p>物流公司：</p>
          <p>{{logisticsData.sellerLogisticsCompany}}</p>
        </li>
        <li>
          <p>物流单号：</p>
          <p>{{logisticsData.sellerLogisticsNo}}</p>

        </li>
      </ul>
      <p style="text-align: right;">
        <Deliver :isAfterSale="false" :orderId="afterServiceId" type="1" @isSuccessFn="isSuccessFn" :deliveryInfo="logisticsData"></Deliver>
      </p>
    </el-card>

    <!-- 回寄信息 -->
    <el-card class="backInfo section" v-if="ifBackInfo">
      <h4>回寄信息</h4>
      <ul class="sectionMain">
        <li v-if="!!basicAbout.returnTime ||
          basicAbout.afterSaleStatus === 'WAIT_GOODS_BACK' ||
          basicAbout.afterSaleStatus === 'GOODS_BACKIING'"
        >
          <p>回寄时间：</p>
          <p>{{basicAbout.returnTime}}</p>
        </li>
        <li>
          <p>回寄信息：</p>
          <p>{{orderData.receiver}}-{{orderData.receiveMobile}}-{{orderData.receiveAddress}}</p>
        </li>
        <li>
          <p>物流公司：</p>
          <p>{{basicAbout.logisticsCompany}}</p>
        </li>
        <li>
          <p>物流单号：</p>
          <p>{{basicAbout.logisticsNo}}</p>
        </li>
      </ul>
    </el-card>


  </div>
</template>

<script>
  import { getAfterServiceInfo } from '@/api/deal'
  import { afterStatusTrans, afterType } from '@/filters/transform'
  import ImgPreview from '@/components/ImgPreview'
  import Deliver from './EditDialog'
  export default {
    props: ['afterServiceId', 'orderNo', 'orderData'],

    data() {
      return {
        basicAbout: {}, // 基础信息
        // changeGoodData: {}, // 换货商品信息
        logisticsData: {}, // 换货物流信息
        applyReasonImg: [], // 申请原因图片数组
        type: null,  // 1:退款退货 2:仅退款 3:换货
        curSaleStatus: '',

        ifImg: false,

        ifBackInfo: false,

        loading: false,

        stepActive: 0
      }
    },

    created() {
      this.mountAfterServiceInfo()
    },
    methods: {
      isSuccessFn(val) {
        if (val) {
          this.mountAfterServiceInfo()
        }
      },
      // 加载售后信息
      mountAfterServiceInfo() {
        // this.logisticsData = {}
        this.loading = true
        const params = {
          id: this.afterServiceId,
          timr: new Date().getTime()
        }
        getAfterServiceInfo(params).then(res => {
          const adDo = res.data.afterSaleDo
          // const adLogistics = res.data.afAftersaleExtDo
          if (res.data.length === 0 || !adDo) {
            this.loading = false
            return
          }

          this.basicAbout = adDo
          if ( res.data.afAftersaleExtDo ) {
            this.logisticsData = res.data.afAftersaleExtDo
          }
          this.type = this.basicAbout.type

          let stepStatus = this.basicAbout.afterSaleStatus
          this.$emit('getAfterServiceTpye', {type: this.type, status: stepStatus})
          // 步骤条状态
          if (stepStatus === 'NEW') {
            this.stepActive = 0
          }

          // 退款退货
          if (this.type === 1) {

            if (stepStatus === 'WAIT_GOODS_BACK') {
              this.stepActive = 1
            }
            if (stepStatus === 'GOODS_BACKIING') {
              this.stepActive = 2
            }
            if (stepStatus === 'FINISH' || stepStatus === 'CLOSING' || stepStatus === 'NOTPASS' || stepStatus === 'CLOSE' || stepStatus === 'REFUNDING') {
              this.stepActive = 4
            }
          }

          // 仅退款
          if (this.type === 2) {
            if (stepStatus === 'REFUNDING') {
              this.stepActive = 1
            }
            if (stepStatus === 'CLOSE' || stepStatus === 'FINISH' || stepStatus === 'NOTPASS') {
              this.stepActive = 2
            }
          }

          // 换货
          if (this.type === 3) {
            if (stepStatus === 'WAIT_GOODS_BACK') {
              this.stepActive = 1
            }
            if (stepStatus === 'GOODS_BACKIING') {
              this.stepActive = 2
            }
            if (stepStatus === 'SELLER_SIGNED') {
              this.stepActive = 3
            }
            if (stepStatus === 'CLOSING' || stepStatus === 'NOTPASS') {
              this.stepActive = 6
            }
            if (stepStatus === 'SELLER_DELIVER') {
              this.stepActive = 4
            }
            if (stepStatus === 'CLOSE' || stepStatus === 'FINISH') {
              this.stepActive = 6
            }
            // this.getRedeliverFn()
          }

          // 售后原因图片数组
          if (adDo.picVouchers) {
            this.applyReasonImg = adDo.picVouchers.split(',')
            this.ifImg = true
          } else {
            this.ifImg = false
          }

          // 传递数据给父组件
          const message = {
            orderLogisticsNo: adDo.orderLogisticsNo, // 发货状态
            addressList: res.data.addressList, // 回寄地址列表
            afterSaleStatus: adDo.afterSaleStatus // 售后状态
          }
          this.$emit('getAfterServiceData', message)

          this.setIfBackInfo(adDo.afterSaleStatus, adDo.logisticsNo)

          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      },
      // 修改物流信息
      updateLogistics() {

      },
      // 根据售后状态控制回寄信息是否展示
      setIfBackInfo(status, logisticsNo) {
        console.log(status)
        if (status === 'GOODS_BACKIING' || status === 'CLOSE') {
          this.ifBackInfo = true // 待退货和待收货，展示
        } else if (logisticsNo) {
          this.ifBackInfo = true // 有回寄信息，展示
        } else {
          this.ifBackInfo = false
        }
      }
    },

    watch: {
      afterServiceId(val) {
        if (val) {
          this.mountAfterServiceInfo()
        }
      }
    },

    filters: { afterStatusTrans, afterType },

    components: { ImgPreview, Deliver }
  }
</script>

<style lang="scss" scoped>
  // 总容器
  .afterServiceInfo {
    h3 {
      padding: 20px 0;
      font-weight: 700;
    }
    padding-bottom: 20px;
    .curStatus{
      position: relative;
      dt{
        font-size: 16px;
        line-height: 60px;
        font-weight: 600;
      }
      .sendGood{
        display: inline-block;
        width: 80px;
        height: 35px;
        text-align: center;
        line-height: 35px;
        margin-left: 10px;
        border: 1px solid #409EFF;
        border-radius: 10px;
        /deep/ a{
          color: #fff;
        }
        background: #409EFF;
      }
    }
  }

  // 公共区域快样式
  .section {
    // padding: 20px;
    // background-color: #F5F7FA;
    margin-bottom: 20px;
    margin-top: 20px;

    h4 {
      margin-bottom: 20px;
      font-weight: 700
    }
    // 主体ul
    .sectionMain {
      display: flex;
      flex-wrap: wrap;

      li {
        flex: 1;
        width: 33.3%;
        min-width: 33.3%;
        max-width: 33.3%;
        padding-bottom: 20px;
        display: flex;
        word-break: break-all;
        padding-right: 20px;

        p:first-child {
          flex: 4;
          color: #666;
        }
        p:last-child {
          flex: 9;
        }
      }
      .addressLi {
        width: 66.6%;
        min-width: 66.6%;
        max-width: 66.6%;

        p:first-child {
          flex: 2;
        }
        p:last-child {
          flex: 11;
        }
      }
    }
  }

  // 申请原因
  .applyReason {
    padding-top: 20px;

    p {
      padding: 20px 0;

      span {
        padding-right: 10px;
        color: #666;
      }
    }

  }
</style>
