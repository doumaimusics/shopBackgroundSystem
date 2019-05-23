<template>
  <div class="goodsList">
    <!-- 表头 -->
    <Sticky>
      <div class="tableTitle">
        <ul>
          <li>商品</li>
          <li>商品条形码</li>
          <li>单价</li>
          <li>数量</li>
          <li>买家</li>
          <li>订单状态</li>
          <li>实付款</li>
          <li>操作</li>
        </ul>
      </div>
    </Sticky>

    <!-- 订单列表容器 -->
    <div class="orderListWrap" v-loading="loading">
      <!-- 订单列表 -->
      <el-card class="orderList" v-for="item in orderList" :key="item.id">
        <!-- 订单头部 -->
        <div slot="header" class="listTitle">
          <div class="listTitleL">
            <span class="orderNum">订单号：{{item.orderNo}}</span>
          </div>
          <div class="listTitleR">
            <span>创建时间：{{item.gmtCreate}}</span>
          </div>
        </div>

        <!-- 订单内容 -->
        <div class="listContent">
          <ul>
            <li>
              <div class="goodsHead">
                <div class="goodsImage">
                  <div class="imgWrap">
                    <img :src="item.goodsIcon" alt="photo">
                  </div>
                </div>
                <div class="goodsTitle">
                  <p>{{item.goodsName}}</p>
                  <p>{{item.priceName}}</p>
                </div>
              </div>
            </li>
            <li>{{item.barCode}}</li>
            <li>￥{{item.priceAmount}}</li>
            <li>{{item.count}}</li>
            <li>{{item.account}}</li>
            <li>{{item.status | orderStatusTrans}}</li>
            <li>
              <p class="realPay">￥{{item.actualPayAmount}}</p>
              <p>{{item.freightAmount ? `（含快递：${item.freightAmount}）` : ''}}</p>
            </li>
            <li class="operation">
              <p class="detail">
                <router-link :to="'/deal/orderDetail/' + item.orderNo">查看详情</router-link>
              </p>
              <p v-if="tabsValue==='0'">
                <!-- 发货模态框 -->
                <EditDialog :isModify="false" @isSuccessFn="isSuccessFn" :orderId="item.id" type="0"></EditDialog>
              </p>
            </li>
          </ul>
        </div>
      </el-card>
    </div>

    <!-- 分页 -->
    <Pagination
      :pageNo="pagination.currentPage"
      :pageSize="pagination.pageSize"
      :totalCount="pagination.totalCount"
      :handleChange="handleCurrentChange"
    ></Pagination>

    <!-- 发货操作 -->
    <div class="sendOrder" v-if="tabsValue==='0'">
      <div class="sendButton">
        <el-upload
          class="uploadExcel"
          :action="importApi.url"
          :disable="btnLoading"
          :headers="importApi.headers"
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          :on-success="uploadSuccess"
          :before-upload="beforeUpload"
        >
          <el-button type="primary">导入发货</el-button>
        </el-upload>
        <el-button class="downloadExcel" @click="downloadModel">下载发货模板</el-button>
      </div>
    </div>

  </div>
</template>

<script>
  import { getOrderAndGoods, getDeliveryModel, setImportApi } from '@/api/deal'
  import EditDialog from '@/views/deal/components/EditDialog'
  import Pagination from '@/components/Pagination/index'
  import { orderStatusTrans } from '@/filters/transform'
  import Sticky from '@/components/Sticky'

  export default {
    props: ['searchData', 'tabsValue'],

    data() {
      return {
        orderList: [],

        pagination: {
          currentPage: 1,
          pageSize: 20,
          totalCount: 0
        },

        btnLoading: false, // 控制正在上传时的按钮状态
        importApi: {
          url: '',
          headers: {}
        }, // 导入发货接口数据

        loading: false
      }
    },

    created() {
      if (this.tabsValue === '0') {
        this.getImportApi()
      }
      this.handleCurrentChange(1)
    },

    methods: {
      // 加载订单和商品列表
      mountOrderAndGoods() {
        this.loading = true
        let status = ''
        switch (this.tabsValue) {
          case '0':
            status = 'PAID'
            break
          case '1':
            status = 'DELIVERED'
            break
          case '2':
            status = 'FINISHED'
            break
          case '3':
            status = 'CLOSED'
            break
          default:
            status = 'ALL'
        }
        const params = JSON.parse(JSON.stringify(this.searchData))
        params.status = status
        params.currentPage = this.pagination.currentPage
        // ajax
        getOrderAndGoods(params).then(res => {
          console.log(res)
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
          this.orderList = res.data
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      },
      // 处理分页
      handleCurrentChange(val) {
        this.pagination.currentPage = val
        this.mountOrderAndGoods()
      },
      // 子组件通讯 发货成功就刷新列表
      isSuccessFn(flag) {
        if (flag) {
          this.handleCurrentChange(this.pagination.currentPage)
        }
      },
      // 上传开始前
      beforeUpload() {
        this.btnLoading = true
        this.$message({ message: '上传处理中，请耐心等待...' })
      },
      // 上传成功后
      uploadSuccess(res) {
        this.btnLoading = false
        if (res.code === 1000) {
          this.$alert(res.data, '处理完成', {
            confirmButtonText: '确定',
            callback: action => {}
          })
          this.handleCurrentChange(1)
        } else {
          this.$message({ message: '上传处理错误，请重新尝试' })
        }
      },
      // 下载发货模板
      downloadModel() {
        // location.href = getDeliveryModel();
        window.open(getDeliveryModel())
      },
      // 获取导入发货接口
      getImportApi() {
        this.importApi = {
          url: setImportApi().url,
          headers: setImportApi().headers
        }
      }
    },

    watch: {
      // 监视搜索筛选参数的变化
      searchData(val) {
        this.handleCurrentChange(1)
      }
    },

    components: { EditDialog, Pagination, Sticky },

    filters: { orderStatusTrans }
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
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 0 20px;
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
      // padding: 0 20px;
      // background-color: #F5F7FA;
      text-align: center;

      & > ul {
        display: flex;

        li {
          display: flex;
          flex-direction: column;
          justify-content: center;
          // word-break: break-all;
          flex: 1;

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

  // 发货操作
  .sendOrder {
    padding-top: 20px;

    .sendButton {
      padding-bottom: 20px;

      .uploadExcel {
        display: inline-block;
        margin-right: 10px;

        /deep/ .el-upload-list--text {
          display: none;
        }
      }
      .downloadExcel {
        vertical-align: top;
      }
    }
  }
</style>
