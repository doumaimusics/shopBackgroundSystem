<template>
  <div class="aGoodsList">
    <!-- 表头 -->
    <Sticky>
      <div class="tableTitle">
        <ul>
          <li>商品</li>
          <!--<li>商品条形码</li>-->
          <!--<li>退款金额</li>-->
          <li>买家</li>
          <li v-if="['8','9'].indexOf(tabsValue)>-1">{{tabsValue==='8'?'退款时间':'关闭时间'}}</li>
          <li v-if="tabsValue==='5'">退货物流公司</li>
          <li v-if="tabsValue==='5'">退货物流单号</li>
          <li v-if="tabsValue==='0'">发货状态</li>
          <li>售后类型</li>
          <li v-if="['0','1','2'].indexOf(tabsValue)>-1">售后原因</li>
          <li>售后状态</li>
          <li>操作</li>
        </ul>
      </div>
    </Sticky>

    <!-- 订单列表容器 -->
    <div class="orderListWrap" v-loading="loading">
      <el-checkbox-group v-model="checkedList" @change="handleCheckedChange">
        <!-- 订单列表 -->
        <el-card class="orderList" v-for="item in orderList" :key="item.afterSaleId">
          <!-- 订单头部 -->
          <div slot="header" class="listTitle">
            <div class="listTitleL">
              <el-checkbox :label="item.afterSaleId" v-if="tabsValue==='1'">
                <span>订单号：{{item.orderNo}}</span>
              </el-checkbox>
              <span class="orderNum" v-else>订单号：{{item.orderNo}}</span>
              <span class="afterServiceNum">售后单号: {{item.applyNo}}</span>
            </div>
            <div class="listTitleR">
              申请时间：<span>{{item.afterTime}}</span>
            </div>
          </div>

          <!-- 订单内容 -->
          <div class="listContent">
            <ul>
              <li>
                <div class="goodsHead">
                  <div class="goodsImage">
                    <div class="imgWrap">
                      <img :src="item.pictureUrl" alt="photo">
                    </div>
                  </div>
                  <div class="goodsTitle">
                    <p>{{item.goodTitle}}</p>
                    <p>{{item.goodSpecification}}</p>
                  </div>
                </div>
              </li>
              <!--<li>{{item.barCode}}</li>-->
              <!--<li>¥{{item.price}}</li>-->
              <li>{{item.mobile}}</li>
              <li v-if="['8','9'].indexOf(tabsValue)>-1">{{item.operationTime}}</li>
              <li v-if="tabsValue==='5'">{{item.logisticsCompany}}</li>
              <li v-if="tabsValue==='5'">{{item.logisticsNo}}</li>
              <li v-if="tabsValue==='0'">{{item.orderLogisticsNo ? '已发货' : '未发货'}}</li>
              <li>{{item.type | changeType}} </li>
              <li v-if="['0','1','2'].indexOf(tabsValue)>-1">
                <span class="reason">{{item.afterSaleReason}}</span>
              </li>
              <li>{{item.afterSaleStatus | afterStatusTrans(item.type)}}</li>
              <li class="operation">
                <p class="detail"><router-link :to="{ path:'afterServiceDetail', query: {orderNo:item.orderNo, afterServiceId:item.afterSaleId} }">查看详情</router-link></p>
                <p v-if="tabsValue==='1'">
                  <el-button
                    @click="backMoney([item.afterSaleId])"
                    size="mini"
                    type="primary"
                    plain
                    :loading="backBtnLoading"
                  >退款</el-button>
                </p>
              </li>
            </ul>
          </div>

        </el-card>
      </el-checkbox-group>
    </div>

    <!-- 分页 -->
    <Pagination
      :pageNo="pagination.currentPage"
      :pageSize="pagination.pageSize"
      :totalCount="pagination.totalCount"
      :handleChange="handleCurrentChange"
    ></Pagination>

    <!-- 底部操作 -->
    <div class="multiOper" v-if="tabsValue==='1'">
      <el-button @click="backMoney(checkedList)" type="primary" :loading="backBtnLoading">批量退款</el-button>
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
    </div>
  </div>
</template>

<script>
  import { getAfterServiceGoods, setBackMoney } from '@/api/deal'
  import { afterStatusTrans } from '@/filters/transform'
  import Pagination from '@/components/Pagination/index'
  import Sticky from '@/components/Sticky'

  export default {
    props: ['searchData', 'tabsValue'],
    components: { Pagination, Sticky },
    data() {
      return {
        orderList: [],

        pagination: {
          currentPage: 1,
          pageSize: 20,
          totalCount: 0
        },

        allCheckList: [], // 所有多选项(售后id)
        checkedList: [], // 选中项数组
        isIndeterminate: false, // 半全选状态
        checkAll: false, // 全选状态

        backBtnLoading: false,

        loading: false,

        stepActive: 0
      }
    },

    created() {
      this.handleCurrentChange(1)
    },

    methods: {
      // 加载订单和商品列表
      mountAfterServiceGoods() {
        this.loading = true
        // 重置多选功能
        this.allCheckList = []
        this.checkedList = []
        this.isIndeterminate = false
        this.checkAll = false
        // 设置参数
        let status = ''
        let type = ''
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
        const params = JSON.parse(JSON.stringify(this.searchData))
        params.status = status
        // params.type = !status  ? params.type : type
        params.type = params.type ? params.type : type
        params.currentPage = this.pagination.currentPage
        /*
        if (this.tabsValue === '1') {
          params.orderStatus = 'false'
        } else if (this.tabsValue === '2') {
          params.orderStatus = 'true'
        }*/
        // ajax
        getAfterServiceGoods(params).then(res => {
          if (res.data.length <= 0 && params.currentPage > 1) {
            this.handleCurrentChange(1)
            return
          }
          this.pagination.totalCount = res.totalCount
          this.pagination.pageSize = res.pageSize
          if (res.data.length === 0) {
            this.orderList = []
            this.loading = false
            return
          }
          // if (this.tabsValue === '0') {
          //   // 筛选五种售后状态
          //   this.orderList = res.data.filter(v => {
          //     return ['NEW', 'WAIT_GOODS_BACK', 'GOODS_BACKIING', 'FINISH', 'CLOSE']
          //       .indexOf(v.afterSaleStatus) > -1
          //   })
          // } else {
          //   this.orderList = res.data
          // }
          this.orderList = res.data
          this.allCheckList = this.orderList.map(item => {
            return item.afterSaleId
          })
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      },
      // 处理分页
      handleCurrentChange(val) {
        this.pagination.currentPage = val
        this.mountAfterServiceGoods()
      },
      // 全选反选
      handleCheckAllChange(val) {
        this.checkedList = val ? this.allCheckList : []
        this.isIndeterminate = false
      },
      // 只选择一部分
      handleCheckedChange(val) {
        const valLength = val.length
        this.checkAll = valLength === this.allCheckList.length
        this.isIndeterminate = valLength > 0 && valLength < this.allCheckList.length
      },
      // 退款功能
      backMoney(arr) {
        if (arr.length === 0) {
          this.$message({ message: '请选择至少一项', type: 'warning' })
          return
        }
        this.$confirm('确定同意退款且不需要回寄？', '确定退款', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.backBtnLoading = true
          const params = { ids: arr.join(',') }
          setBackMoney(params).then(res => {
            this.backBtnLoading = false
            this.$message({ type: 'info', message: '已提交后台处理' })
            this.handleCurrentChange(this.pagination.currentPage)
          }).catch(() => {
            this.backBtnLoading = false
          })
        }).catch(() => {})
      }
    },

    watch: {
      // 监视搜索筛选参数的变化
      searchData(val) {
        this.handleCurrentChange(1)
      }
    },

    filters: {
      afterStatusTrans,
      changeType(val) {
        let res = ''
        switch (val) {
          case 1 :
            res = '退货退款'
            break
          case 2 :
            res = '仅退款'
            break
          case 3 :
            res = '换货'
            break
          default:
            res = ''
        }
        return res
      }
    }
  }
</script>

<style lang="scss" scoped>
  // tab表头
  .tableTitle {
    padding-bottom: 15px;
    padding-top: 10px;
    color: #666;
    text-align: center;
    background-color: #fff;

    ul {
      display: flex;
      padding: 0 20px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    li {
      border-right: 1px solid #ccc;
      padding: 5px 0;
      flex: 1;

      &:first-child {
        flex: 2;
      }
      &:last-child {
        border-right: none;
      }
    }
  }

  // 订单列表
  .orderList {
    margin-bottom: 15px;

    /deep/ .el-card__header {
      padding: 0 20px;
    }
    /deep/ .el-card__body {
      padding: 0 20px;
    }

    // 表头
    .listTitle {
      display: flex;
      // padding: 0 20px;
      height: 40px;
      line-height: 40px;
      // background-color: #efefef;

      .listTitleL {
        text-align: left;
        flex: 1;

        .orderNum {
          color: #606266;
        }
        .afterServiceNum {
          margin-left: 20px;
          font-size: 14px;
          color: #606266;
        }
      }
      .listTitleR {
        flex: 1;
        text-align: right;
        color: #606266;
        font-size: 14px;
      }
    }
    // 主体
    .listContent {
      text-align: center;

      & > ul {
        display: flex;

        li {
          display: flex;
          flex-direction: column;
          justify-content: center;
          // word-break: break-all;
          flex: 1;

          .reason {
            display: inline-block;
            width: fit-content;
            text-align: left;
            margin: 0 auto;
          }
          &:first-child {
            flex: 2;
            align-items: flex-start;
          }
        }
      }

      // 商品图片和标题
      .goodsHead {
        display: flex;
        padding: 10px 0;
        padding-right: 10px;

        // 图片控制
        .goodsImage {
          position: relative;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          min-width: 70px;

          .imgWrap {
            width: 60px;
            height: 60px;

            img {
              width: 100%;
              height: 100%;
              display: block;
            }
          }
        }
        .goodsTitle {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          word-break: break-all;

          p {
            padding: 5px 0;
            text-align: left;
          }
        }
      }

      // 订单操作
      .operation {
        padding-bottom: 0;
        border-bottom: none;

        .detail {
          padding: 10px 0;
        }
        a {
          color: #409EFF;
        }
      }

      // 实付款
      .realPay {
        padding: 10px 0;
      }
    }
  }

  // 底部操作
  .multiOper {
    padding-top: 20px;

    .el-checkbox {
      padding-left: 20px;
      color: #409EFF;
    }
  }

  // 多选项父盒子
  .el-checkbox-group {
    font-size: 14px;
  }
</style>
