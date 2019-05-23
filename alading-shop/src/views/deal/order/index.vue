<template>
  <div class="order-container">
    <!-- 搜索筛选 -->
    <div class="formSearch searchFilter">
      <!-- <h4>订单管理</h4> -->
      <el-form ref="form" label-width="80px">
        <ul class="lineFir">
          <li class="goodsCategory">
            <el-form-item label="商品类目">
              <el-select placeholder="一级类目" v-model="firstCategoryValue">
                <el-option 
                  v-for="item in firstCategoryList" 
                  :key="item.id" 
                  :label="item.name" 
                  :value="item.id">
                </el-option>
              </el-select>
              <el-select placeholder="二级类目" v-model="secondCategoryValue" :disabled="secondDis">
                <el-option 
                  v-for="item in secondCategoryList" 
                  :key="item.id" 
                  :label="item.name" 
                  :value="item.id">
                </el-option>
              </el-select>
              <el-select placeholder="三级类目" v-model="thirdCategoryValue" :disabled="thirdDis">
                <el-option 
                  v-for="item in thirdCategoryList" 
                  :key="item.id" 
                  :label="item.name" 
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </li>
          <li class="activityTime">
            <el-form-item label="下单时间">
              <el-date-picker
                v-model="dateRange"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </li>
          <li>
            <el-form-item label="订单号">
              <el-input placeholder="请输入内容" v-model="orderNum"></el-input>
            </el-form-item>
          </li>
          <li>
            <el-form-item label="买家账号">
              <el-input placeholder="请输入内容" v-model="userNum"></el-input>
            </el-form-item>
          </li>
          <li>
            <el-form-item label="商品名称">
              <el-input placeholder="请输入内容" v-model="goodsName"></el-input>
            </el-form-item>
          </li>
          <li>
            <el-form-item label="商品ID">
              <el-input placeholder="请输入内容" v-model="goodsId"></el-input>
            </el-form-item>
          </li>
          <li>
            <el-form-item label="条形码">
              <el-input placeholder="请输入内容" v-model="barCode"></el-input>
            </el-form-item>
          </li>
        </ul>
      </el-form>
      <!-- 按钮 -->
      <div class="btn">
        <el-button type="primary" @click.native="onSubmit">搜索</el-button>
        <el-button @click.native="resetFrom">重置</el-button>
        <el-button @click.native="exportOrderCsv">导出订单</el-button>
      </div>
    </div>

    <!-- tab栏切换 -->
    <div class="tab StatusTab">
      <el-tabs type="card"  v-model="tabsValue" @tab-click="tabsClick">
        <el-tab-pane label= "待发货" name="0">
          <GoodsList :searchData="params" :tabsValue="tabsValue" v-if="tabsValue==='0'"></GoodsList>
        </el-tab-pane>
        <el-tab-pane label="已发货" name="1">
          <GoodsList :searchData="params" :tabsValue="tabsValue" v-if="tabsValue==='1'"></GoodsList>
        </el-tab-pane>
        <el-tab-pane label="订单完成" name="2">
          <GoodsList :searchData="params" :tabsValue="tabsValue" v-if="tabsValue==='2'"></GoodsList>
        </el-tab-pane>
        <el-tab-pane label="订单关闭" name="3">
          <GoodsList :searchData="params" :tabsValue="tabsValue" v-if="tabsValue==='3'"></GoodsList>
        </el-tab-pane>
      </el-tabs>
    </div>
    
  </div>
</template>

<script>
  import { getCategory, setOrderExport } from '@/api/deal'
  import GoodsList from './components/GoodsList'
  import { downloadFile } from '@/utils/tools'

  export default {
    data() {
      return {
        firstCategoryList: [], // 分类列表
        secondCategoryList: [],
        thirdCategoryList: [],

        secondDis: true, // 分类列表禁用状态
        thirdDis: true,

        firstCategoryValue: '', // 类目选中项
        secondCategoryValue: '',
        thirdCategoryValue: '',

        dateRange: '',
        goodsName: '',
        goodsId: '',
        barCode: '',
        userNum: '', // 买家账号
        orderNum: '', // 订单账号

        params: {}, // 订单列表请求参数

        tabsValue: '0' // tabs选中项的value(string)
      }
    },

    created() {
      this.getType()
      this.mountCategory(1)
    },

    methods: {
      // 获取路由参数的tab栏type
      getType() {
        this.tabsValue = this.$route.query.type || this.tabsValue
      },

      // 切换tab栏改变地址
      tabsClick() {
        if (window.history.replaceState) {
          window.history.replaceState(null, null, `#${this.$route.path}?type=${this.tabsValue}`)
        }
      },

      // 加载类目
      mountCategory(level, pid) {
        const params = { level }
        if (pid) {
          params.pid = pid
        }
        getCategory(params).then(res => {
          if (level === 1) {
            this.firstCategoryList = res.data
          } else if (level === 2) {
            this.secondCategoryList = res.data
          } else if (level === 3) {
            this.thirdCategoryList = res.data
          }
        })
      },

      // 重置按钮
      resetFrom() {
        this.firstCategoryValue = ''
        this.secondCategoryValue = ''
        this.thirdCategoryValue = ''
        this.dateRange = ''
        this.goodsName = ''
        this.goodsId = ''
        this.barCode = ''
        this.userNum = ''
        this.orderNum = ''
        this.onSubmit()
      },

      // 提交搜索
      onSubmit() {
        if (this.dateRange.length < 2) {
          var timeStart = ''
          var timeEnd = ''
        } else {
          timeStart = this.dateRange[0].getTime()
          timeEnd = this.dateRange[1].getTime()
        }
        this.params = {
          oneCategoryId: this.firstCategoryValue,
          twoCategoryId: this.secondCategoryValue,
          threeCategoryId: this.thirdCategoryValue,
          gmtStart: timeStart,
          gmtEnd: timeEnd,
          goodsName: this.goodsName,
          goodsId: this.goodsId,
          barCode: this.barCode,
          account: this.userNum,
          orderNo: this.orderNum
        }
      // console.log(this.params.gmtStart)
      // console.log(this.params.gmtEnd)
      },

      // 导出订单
      exportOrderCsv() {
        const query = { ...this.params }
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
        query.status = status
        console.log(query.status)
        downloadFile(setOrderExport(query))
      }
    },

    watch: {
      firstCategoryValue(val) {
        this.mountCategory(2, val)
        this.secondCategoryValue = ''
        this.thirdCategoryValue = ''
        this.thirdCategoryList = []
        this.secondDis = !val
      },
      secondCategoryValue(val) {
        this.mountCategory(3, val)
        this.thirdCategoryValue = ''
        this.thirdDis = !val
      }
    },

    components: { GoodsList }
  }
</script>

<style lang="scss" scoped>
  .order-container {
    padding: 20px;
    font-size: 14px;

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
      .el-select {
        width: 110px;
      }
      .el-input {
        width: 160px;
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
        color: #303133;
      }
    }
  }
</style>
