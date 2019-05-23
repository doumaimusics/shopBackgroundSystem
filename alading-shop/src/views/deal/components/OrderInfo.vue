<template>
  <div class="orderInfo" v-loading="loading">
    <!-- <h3>订单详情</h3> -->

    <!-- 订单信息 -->
    <el-card class="orderAbout section">
      <h4>订单信息</h4>
      <ul class="sectionMain">
        <li>
          <p>订单号：</p>
          <p>{{orderInfoData.orderNo}}</p>
        </li>
        <li>
          <p>订单状态：</p>
          <p>{{orderInfoData.status | orderStatusTrans}}</p>
        </li>
        <li>
          <p>创建时间：</p>
          <p>{{orderInfoData.gmtCreate}}</p>
        </li>
        <li>
          <p>付款时间：</p>
          <p>{{orderInfoData.gmtPay}}</p>
        </li>
        <li>
          <p>发货时间：</p>
          <p>{{orderInfoData.gmtDeliver}}</p>
        </li>
        <li>
          <p>完成时间：</p>
          <p>{{orderInfoData.gmtFinish}}</p>
        </li>
        <li>
          <p>店铺优惠券：</p>
          <p>{{orderInfoData.shopCouponAmount}}</p>
        </li>
        <li>
          <p>平台优惠券：</p>
          <p>{{orderInfoData.couponAmount}}</p>
        </li>
        <li>
          <p style="width: 205px;">订单实付（含平台优惠券）：</p>
          <p>{{orderInfoData.actualPayAmount ? `￥${orderInfoData.actualPayAmount}` : '￥0'}}</p>
        </li>
        <li v-if="isShowGmtName">
          <p>{{orderInfoData.gmtClosedName}}</p>
          <p>{{orderInfoData.gmtClosed}}</p>
        </li>
      </ul>
    </el-card>

    <!-- 商品信息 -->
    <el-card class="goodsAbout section">
      <h4>商品信息</h4>
      <ul class="sectionMain">
        <el-table :data="[orderInfoData]" max-height="300" border stripe>
          <el-table-column prop="marque" label="货号">
            <template slot-scope="scope">
              {{scope.row.marque}}
            </template>
          </el-table-column>
          <el-table-column prop="goodsIcon" label="商品图片">
            <template slot-scope="scope">
              <img :src="scope.row.goodsIcon" width="85px" alt="">
            </template>
          </el-table-column>
          <el-table-column prop="goodsName" label="商品名称"></el-table-column>
          <!--<el-table-column prop="barCode" label="条形码"></el-table-column>-->
          <el-table-column prop="priceName" label="规格"></el-table-column>
          <el-table-column prop="priceCode" label="规格编码">
            <template slot-scope="scope">
              {{scope.row.priceCode}}
            </template>
          </el-table-column>
          <el-table-column prop="priceAmount" label="单价"></el-table-column>
          <el-table-column prop="count" label="数量"></el-table-column>
          <el-table-column label="优惠">
            <template slot-scope="scope">
              <!--{{scope.row.goodsDiscountAmount ? `￥${scope.row.goodsDiscountAmount}` : ''}}-->
              {{scope.row.goodsDiscountAmount}}
            </template>
          </el-table-column>
          <el-table-column label="实付款">
            <template slot-scope="scope">
              <p>{{scope.row.actualPayAmount ? `￥${scope.row.actualPayAmount}` : ''}}</p>
              <p>{{(scope.row.actualPayAmount && scope.row.freightAmount) ? `(含快递：${scope.row.freightAmount})` : ''}}</p>
            </template>
          </el-table-column>
        </el-table>
      </ul>
    </el-card>

    <template v-if="!isAfterSale">
    <!-- 买家信息 -->
      <el-card class="buyerAbout section" v-if="!isAfterSale">
        <h4>买家信息</h4>
        <ul class="sectionMain">
          <li>
            <p>买家账号：</p>
            <p>{{orderInfoData.account}}</p>
          </li>
          <li>
            <p>本店购买次数：</p>
            <p>{{orderInfoData.buyCount}}</p>
          </li>
          <!--
          <li>
            <p>收货人：</p>
            <p>{{orderInfoData.receiver}}</p>
          </li>
          <li>
            <p>收货手机号码：</p>
            <p>{{orderInfoData.receiveMobile}}</p>
          </li>
          <li class="addressLi">
            <p>收货地址：</p>
            <p>{{orderInfoData.receiveAddress}}</p>
          </li>
          <li>
            <p>身份证号：</p>
            <p>{{orderInfoData.afOrderHaitaoInfoDo.idNumber}}</p>
          </li>
          <li>
            <p>身份证照片：</p>
            <p><ImgPreview :imgList="idImg"></ImgPreview></p>
          </li>
          -->
        </ul>
      </el-card>

      <!-- 物流信息 -->
      <el-card class="deliveryAbout section">
        <h4>收货和物流信息</h4>
        <ul class="sectionMain">
          <li>
            <p>收货人：</p>
            <p>{{orderInfoData.receiver}}</p>
          </li>
          <li>
            <p>收货号码：</p>
            <p>{{orderInfoData.receiveMobile}}</p>
          </li>
          <li>
            <p>收货地址：</p>
            <p>{{orderInfoData.receiveAddress}}</p>
          </li>
          <li>
            <p>身份证号：</p>
            <p>{{orderInfoData.afOrderHaitaoInfoDo.idNumber}}</p>
          </li>
          <li>
            <p>身份证照片：</p>
            <p><ImgPreview :imgList="idImg"></ImgPreview></p>
          </li>
          <li>
            <p>物流公司：</p>
            <p>{{orderInfoData.logisticCompany}}</p>
          </li>
          <li>
            <p>物流单号：</p>
            <p>{{orderInfoData.logisticNo}}</p>
          </li>
          <!--
          <li>
              <p>物流状态：</p>
              <p>{{orderInfoData.logisticsInfo}}</p>
          </li>
          -->
        </ul>
        <div class="editDelivery">
          <EditDialog
            @isSuccessFn="isSuccessFn"
            :deliveryInfo="deliveryInfo"
            :isModify="true"
            type="0"
            v-if="ifModifyDialog"
          ></EditDialog>
          <DeliveryDialog :orderId="orderId" v-if="ifDeliveryDialog"></DeliveryDialog>
        </div>
      </el-card>
      <div class="back">
        <el-button type="default" @click="goBack">返回</el-button>
      </div>
    </template>
  </div>
</template>

<script>
  import { getOrderInfo } from '@/api/deal'
  import EditDialog from '@/views/deal/components/EditDialog'
  import DeliveryDialog from '@/views/deal/components/DeliveryDialog'
  import ImgPreview from '@/components/ImgPreview'
  import { orderStatusTrans } from '@/filters/transform'

  export default {
    props: ['orderNo', 'isAfterSale', 'type'],

    data() {
      return {
        orderInfoData: {
          afOrderHaitaoInfoDo: {}
        },
        deliveryInfo: { // 传递给修改物流模态框 物流公司code、物流公司名、物流单号、订单号
          code: '',
          name: '',
          number: '',
          orderNo: ''
        },

        isShowGmtName: false,
        orderId: '',

        ifDeliveryDialog: false,
        ifModifyDialog: false,

        idImg: [], // 存储身份证照片

        loading: false
      }
    },

    created() {
      this.mountOrderInfo()
    },

    methods: {
      // 加载订单信息
      mountOrderInfo() {
        this.loading = true
        getOrderInfo(this.orderNo).then(res => {
          if (JSON.stringify(res.data) === '{}') {
            this.loading = false
            return
          }

          // 数据处理，订单完成时间和关闭时间的判断
          if (res.data.status === 'FINISHED' || res.data.status === 'REBATED') {
            res.data.gmtClosedName = '完成时间：'
            this.isShowGmtName = true
          } else if (res.data.status === 'CLOSED') {
            res.data.gmtClosedName = '关闭时间：'
            this.isShowGmtName = true
          } else {
            this.isShowGmtName = false
          }

          // 控制是否显示并加载物流模态框DOM
          if (['PAID', 'NEW', 'DEALING', 'PAYFAIL'].indexOf(res.data.status) > -1) {
            this.ifDeliveryDialog = false
            this.ifModifyDialog = false
          } else if (['FINISHED', 'CLOSED', 'REBATED'].indexOf(res.data.status) > -1 || this.isAfterSale) {
            // 订单完成、订单关闭及售后详情里不显示修改物流DOM
            this.ifModifyDialog = false
            this.ifDeliveryDialog = true
          } else {
            this.ifDeliveryDialog = true
            this.ifModifyDialog = true
          }

          // 待付款状态，实付款为空
          if (['NEW', 'DEALING', 'PAYFAIL'].indexOf(res.data.status) > -1) {
            res.data.actualPayAmount = ''
          }

          // 身份证信息
          if (!res.data.afOrderHaitaoInfoDo) {
            res.data.afOrderHaitaoInfoDo = {
              idNumber: '',
              cardBehind: '',
              cardFront: ''
            }
          } else {
            if (res.data.afOrderHaitaoInfoDo.cardBehind) {
              this.idImg.push(res.data.afOrderHaitaoInfoDo.cardBehind)
            }
            if (res.data.afOrderHaitaoInfoDo.cardFront) {
              this.idImg.push(res.data.afOrderHaitaoInfoDo.cardFront)
            }
          }

          this.orderInfoData = res.data
          this.orderId = res.data.id
          this.deliveryInfo = {
            code: res.data.logisticCode,
            name: res.data.logisticCompany,
            number: res.data.logisticNo,
            orderNo: res.data.orderNo
          }
          this.$emit('getorderNo', res.data)
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      },

      // 修改物流模态框 是否修改成功
      isSuccessFn(flag) {
        if (flag) {
          this.mountOrderInfo(true)
        }
      },

      // 返回按钮
      goBack() {
        this.$router.go(-1)
      // this.$router.push('/deal/order');
      }

    },

    watch: {
      orderNo(val) {
        if (val) {
          this.mountOrderInfo()
        }
      }
    },

    components: { EditDialog, DeliveryDialog, ImgPreview },

    filters: { orderStatusTrans }
  }
</script>

<style lang="scss" scoped>
  .orderInfo {
    h3 {
      padding: 20px 0;
      font-weight: 700;
    }
  }

  // 公共区域快样式
  .section {
    // padding: 20px;
    // background-color: #FDFDFD;
    margin-bottom: 40px;

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
          width: 100px;
          color: #666;
        }
      }
      .addressLi {
        width: 66.6%;
        min-width: 66.6%;
        max-width: 66.6%;
      }
    }
  }

  // 物流信息
  .deliveryAbout {
    .editDelivery {
      padding-top: 20px;

      /deep/ .deliveryDialog {
        padding-left: 20px;
      }
    }
  }

  // 返回按钮
  .back {
    text-align: right;
    padding: 0 40px;
  }
</style>
