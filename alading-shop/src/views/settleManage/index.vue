<template>
  <div class="settleBox">
    <!-- <b>结算订单</b> -->
    <el-form :inline="true" :model="settleFormData" status-icon  ref="settleForm" label-width="100px" class="settleForm">
      <el-form-item label="订单号：">
        <el-input v-model="settleFormData.orderNo"  placeholder="请输入订单号"></el-input>
      </el-form-item>
      <el-form-item  label="结算时间：">
        <el-date-picker
          v-model="time"
          type="datetimerange"
          range-separator="至"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <br />
      <el-form-item>
        <el-button type="primary" @click="submitForm('settleForm')">搜索</el-button>
        <el-button @click="resetForm('settleForm')">重置</el-button>
        <el-button @click="exportSettleCsv()">导出订单</el-button>
      </el-form-item>
    </el-form>
    <div class="listMian">
      <!-- <span class="tips" @click="cashVisible = true">类目佣金比例</span> -->
      <el-tabs type="card" @tab-click="handleClick">
        <el-tab-pane label="待结算"></el-tab-pane>
        <el-tab-pane label="已结算"></el-tab-pane>
        <el-table class="listTable"
          :data="tableData"
          stripe
          style="width: 100%" 
          v-loading="loading"
        >
          <el-table-column
            prop="orderNo"
            label="订单号"
            width="180">
          </el-table-column>
          <el-table-column
            prop="actualAmount"
            label="实付金额"
            width="180">
          </el-table-column>
          <el-table-column
            prop="commissionRate"
            label="佣金比例">
          </el-table-column>
          <el-table-column
            prop="balanceAmount"
            label="结算金额">
          </el-table-column>
          <el-table-column
            prop="balanceStatus"
            :formatter="changeTxt"
            label="结算状态">
          </el-table-column>
          <el-table-column
            prop="balanceTime"
            :formatter="changeTxt"
            label="结算时间"
            width="180">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button @click="goSettleInfo(scope.row)" type="text" size="small">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <Pagination
          :pageNo="pageNo"
          :pageSize="pageSize"
          :totalCount="totalCount"
          :handleChange="pageChange"
        ></Pagination>
      </el-tabs>
    </div>
    <!--类目佣金比例弹窗-->
    <el-dialog title="类目佣金比例" :visible.sync="cashVisible" width="350px" :lock-scroll="true">
      <el-table :data="cashTable" width="100%" class="cashTable">
        <el-table-column property="name" label="类目" width="170px"></el-table-column>
        <el-table-column property="rate" label="佣金比例" :formatter="changeNum" width="130px"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
  import { balanceList, cateRateList, setSettleExport } from '@/api/settleManage'
  import { formatTimestamp } from '@/utils/tools'
  import Pagination from '@/components/Pagination/index'
  import { downloadFile } from '@/utils/tools'
  export default {
    components: { Pagination },
    data() {
      return {
        settleFormData: {
          pageNo: 1,
          pageSize: 20,
          status: 0
        },
        time: [],
        tableData: [],    // 列表
        pageSize: 0,
        totalCount: 0,
        pageNo: 1,
        cashVisible: false,
        cashTable: [
          { name: '手机通讯', number: '3%' },
          { name: '电脑平板', number: '3%' },
          { name: '数码智能', number: '3%' },
          { name: '美妆个护', number: '3%' },
          { name: '服饰箱包', number: '3%' },
          { name: '珠宝配饰', number: '3%' },
          { name: '大牌名表', number: '3%' },
          { name: '食品酒水', number: '3%' },
          { name: '图书音像', number: '3%' }
        ],
        loading: false,

        firstCategoryValue: '', // 类目选中项
        secondCategoryValue: '',
        thirdCategoryValue: '',

        dateRange: '',  // 日期范围
        goodsName: '',
        goodsId: '',
        barCode: '',
        userNum: '', // 买家账号
        orderNum: '', // 订单账号

        params: {}, // 订单列表请求参数
      }
    },
    created() {
      this.init()
      this.rateInit()
    },
    methods: {
      init() {
        this.loading = true
        balanceList(this.settleFormData).then((res) => {
          console.log(res)
          this.tableData = res.data
          this.pageSize = res.pageSize
          this.totalCount = res.totalCount
          this.pageNo = res.pageNo
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      },
      rateInit() { // 佣金比例
        cateRateList().then((res) => {
          this.cashTable = res.data
        })
      },
      changeTxt(row, column, cellValue, index) { // 数据文案修改
        if (+cellValue === 0) {
          return '未结算'
        } else if (+cellValue === 1) {
          return '已结算'
        } else if (cellValue) {
          return formatTimestamp(cellValue)
        }
      },
      changeNum(row, column, cellValue, index) {
        // console.log(cellValue)
        if (cellValue > 0) {
          return cellValue * 100 + '%'
        } else {
          return 0
        }
      },
      goSettleInfo(data) {   // 跳转查看详情
        this.$router.push({ path: '/settleManage/settleInfo/' + data.rid })
      },
      handleClick(tab, event) { // 切换tabs
        this.settleFormData.status = tab.index
        this.settleFormData.pageNo = 1
        this.init()
      },
      pageChange(val) { // 页数
        this.settleFormData.pageNo = val
        this.init()
      },
      submitForm() { // 搜索
         if(!this.time){
            this.settleFormData.balanceTimeStart = '';
            this.settleFormData.balanceTimeEnd = '';
            this.init()
         } else {
            this.settleFormData.balanceTimeStart = this.time[0]
            this.settleFormData.balanceTimeEnd = this.time[1]
            this.init()
         }
         this.params = {
          orderNo: this.settleFormData.orderNo,    // 订单号
          gmtStart: this.settleFormData.balanceTimeStart,    // 开始时间
          gmtEnd: this.settleFormData.balanceTimeEnd,     // 结束时间          
        }
      },
      resetForm() { // 重置搜索
        this.time = []
        this.settleFormData.orderNo = ''
        this.submitForm('settleForm')
      },
      exportSettleCsv() {   // 导出订单
         console.log(1);
         const query = { ...this.params };
         let optionType = ''
         switch (this.settleFormData.status) {
           case '0':
             optionType = "0"
             break;
           case '1':
             optionType = "1"
           default:
             break;
         }
         query.optionType = optionType
         downloadFile(setSettleExport(query))
      }
    }
  }
</script>
<style lang="less" scoped>
  .settleBox {
    padding: 20px;

    .settleForm{
      margin-bottom: 0;
    }
    b{
      display: block;
      padding-bottom: 15px;
    }
    /deep/ .el-form-item__label{
      width: auto !important;
    }
    .listTable td{
      text-align: center;
    }
    .listTable th{
      border-top: 1px solid #ebeef5;
      text-align: center;
    }
    .listMian{
      position: relative;
      .tips{
        position: absolute;
        top: 11px;
        right: 19px;
        z-index: 1;
        color: #409EFF;
        cursor: pointer;
        font-size: 14px;
      }
    }
    .cashTable{
      height: 398px;
      overflow-y: auto;
    }
    /deep/ .el-dialog__body{
      padding: 5px 20px 20px 20px;
    }
  }
</style>
