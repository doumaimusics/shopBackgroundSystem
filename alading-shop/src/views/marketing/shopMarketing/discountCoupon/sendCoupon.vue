<template>
  <div class="sendCoupon">
    <el-card>
      <h4>优惠券说明</h4>
      <ul>
        <li>
          <p>优惠券名称：</p>
          <p>{{form.name}}</p>
        </li>
        <li>
          <p>优惠券类型：</p>
          <p>{{form.type==='FULLVOUCHER'?'满减券':''}}</p>
        </li>
        <li>
          <p>优惠券金额：</p>
          <p>￥{{form.amount}}</p>
        </li>
        <li>
          <p>使用限制：</p>
          <p>满￥{{form.limitAmount}}可使用</p>
        </li>
        <li>
          <p>有效时间：</p>
          <p v-if="form.expiryType==='R'">{{form.gmtStartTime}} 至 {{form.gmtEndTime}}</p>
          <p v-if="form.expiryType==='D'">领取后{{form.validDays}}天</p>
          <!-- <p v-if="form.dateType==='D'">领取后{{form.validDays}}天（领取截止时间{{form.dateTo}}）</p> -->
        </li>
        <li>
          <p>使用范围：</p>
          <p>{{form.isGlobal===9?'全店':''}}</p>
        </li>
      </ul>
    </el-card>

    <el-table :data="tableData" stripe @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="userName" label="用户账号"></el-table-column>
      <el-table-column prop="orderNumber" label="本店下单次数"></el-table-column>
      <el-table-column prop="buyNumber" label="本店购买次数"></el-table-column>
      <el-table-column prop="latelyTime" label="最近下单时间"></el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" @click="setSend([scope.row.userId])">发放</el-button>
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

    <div class="multiSend">
      <el-button type="primary" @click="setSend(false)">批量发放</el-button>
    </div>

    <div class="back">
      <el-button type="default" @click="goBack">返回</el-button>
    </div>
  </div>
</template>

<script>
  import { setSendCoupon, getUserBuyInfo } from '@/api/marketing'
  import Pagination from '@/components/Pagination/index'

  export default {
    components: { Pagination },
    data() {
      return {
        form: {},
        tableData: [],

        multipleSelection: [],
        id: '',

        pagination: { // 分页数据
          currentPage: 1,
          pageSize: 20,
          totalCount: 0
        }
      }
    },

    created() {
      this.getParams()
      this.getTableData()
    },

    methods: {
      getParams() {
        this.id = this.$route.query.id
      },
      // 获取用户购买信息
      getTableData(flag) {
        const params = { id: this.id }
        params.pageNo = flag ? this.pagination.currentPage : 1
        // ajax
        getUserBuyInfo(params).then(res => {
          this.form = res.data.afCouponDo
          this.tableData = res.data.userList
          this.pagination.totalCount = res.totalCount
          this.pagination.pageSize = res.pageSize
        })
      },
      goBack() {
        this.$router.history.go(-1)
      },
      // 发放
      setSend(ids) {
        const params = {}
        if (ids) {
          params.userIds = ids.join()
        } else {
          if (this.multipleSelection.length <= 0) {
            this.$message({ type: 'warning', message: '请先勾选' })
            return
          }
          params.userIds = this.multipleSelection.map(v => v.userId).join()
        }
        params.couponId = this.id
        this.$confirm('确认发放优惠券?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          setSendCoupon(params).then(res => {
            this.$message({ type: 'success', message: '发放成功' })
            this.getTableData()
          })
        }).catch(() => {})
      },
      // 多选
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      // 处理分页
      handleCurrentChange(val) {
        this.pagination.currentPage = val
        this.getTableData(true)
      }
    }
  }
</script>

<style lang="less" scoped>
  .sendCoupon {
    padding: 20px;
  }
  .el-card {
    margin-bottom: 30px;

    h4 {
      padding-bottom: 20px;
      font-weight: 700;
    }
    ul {
      display: flex;
      flex-wrap: wrap;

      li {
        width: 33%;
        display: flex;
        line-height: 2.5;

        p:first-child {
          width: 90px;
          color: #666;
        }
      }
    }
  }
  .multiSend {
    padding: 20px 0;
  }
  .back {
    text-align: right;
    padding-right: 40px;
  }
</style>
