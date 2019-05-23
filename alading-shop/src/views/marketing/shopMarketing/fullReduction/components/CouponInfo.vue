<template>
  <div class="couponInfo">
    <el-form :model="form" :rules="rules" ref="formRef">
      <el-form-item prop="name" label="优惠券名称：">{{form.name}}</el-form-item>
      <el-form-item prop="type" label="优惠券类型：">{{form.type==='FULLVOUCHER'?'满减券':''}}</el-form-item>
      <el-form-item prop="amount" label="优惠金额：">￥{{form.amount}}</el-form-item>
      <el-form-item prop="limitAmount" label="使用限制：">满￥{{form.limitAmount}}元可用</el-form-item>

      <el-form-item prop="quota" label="发行量：">
        <el-input-number
          controls-position="right"
          :min="1"
          :precision="0"
          v-model="form.quota" 
          v-if="isEdit"
        ></el-input-number>
        <span v-if="!isEdit">{{form.quota}}</span>
      </el-form-item>

      <el-form-item prop="limitCount" label="单人领取上限：">{{form.limitCount}}</el-form-item>
      <el-form-item prop="date" label="有效时间：">
        <span v-if="form.expiryType==='R'">{{form.gmtStartTime}} 至 {{form.gmtEndTime}}</span>
        <span v-if="form.expiryType==='D'">领取后{{form.validDays}}天</span>
        <!-- <span>领取截止时间：{{form.dateTo}}</span> -->
      </el-form-item>
      <el-form-item prop="isGlobal" label="使用范围：">全店</el-form-item>
      <el-form-item prop="isShow" label="详情页领券：">
        <el-radio v-model="form.isShow" :label="1" v-if="isEdit">是</el-radio>
        <el-radio v-model="form.isShow" :label="0" v-if="isEdit">否</el-radio>
        <span v-if="!isEdit">{{form.isShow ? '是' : '否'}}</span>
      </el-form-item>
    </el-form>

    <div class="btn" v-if="isEdit">
      <el-button type="primary" @click="onSubmit">保存修改</el-button>
    </div>

    <div class="useCount">
      <el-card>
        <h4>使用统计</h4>
        <el-table :data="tableData" border stripe>
          <el-table-column prop="quota" label="发行数量"></el-table-column>
          <el-table-column prop="receiveNum" label="领取数量"></el-table-column>
          <el-table-column prop="receiveUserNum" label="领取人数"></el-table-column>
          <el-table-column prop="receiveScale" label="领取比例"></el-table-column>
          <el-table-column prop="usedNum" label="使用数量"></el-table-column>
          <el-table-column prop="useScale" label="使用率"></el-table-column>
        </el-table>
      </el-card>
    </div>

    <div class="back">
      <el-button type="default" @click="goBack">返回</el-button>
    </div>
  </div>
</template>

<script>
  import { setCouponUpdate, getCouponInfo } from '@/api/marketing'

  export default {
    props: ['isEdit', 'id'],

    data() {
      return {
        form: {
          quota: undefined,
          isShow: '1'
        },
        rules: {
          quota: [{ required: true, message: '不能为空', trigger: 'blur' }]
        },
        tableData: []
      }
    },

    created() {
      this.getFormData()
    },

    methods: {
      // 修改提交
      onSubmit() {
        this.$refs.formRef.validate(valid => {
          if (valid) {
            const params = {
              id: this.id,
              quota: this.form.quota,
              isShow: this.form.isShow
            }
            setCouponUpdate(params).then(res => {
              this.$message({ type: 'success', message: '优惠券修改成功' })
              this.$router.push({ name: 'discountCoupon' })
            })
          }
        })
      },
      // 获取信息
      getFormData() {
        const params = { id: this.id }
        getCouponInfo(params).then(res => {
          this.form = res.data.afCouponDo
          if (!res.data.couponUseCountVo) {
            this.tableData = []
          } else {
            this.tableData = [res.data.couponUseCountVo]
          }
        })
      },
      goBack() {
        this.$router.history.go(-1)
      }
    }
  }
</script>

<style lang="less" scoped>
  /deep/ label {
    width: 120px;
  }
  /deep/ .el-form-item__content {
    padding-left: 121px;
  }
  /deep/ .el-form-item__error {
    padding-left: 121px;
  }
  .el-input {
    width: 300px;
  }
  .el-form-item {
    margin-bottom: 15px;
  }
  .useCount {
    padding-top: 40px;

    h4 {
      font-weight: 700;
      padding-bottom: 20px;
    }
    .el-card {
      width: 80%;
    }
  }
  .back {
    padding-top: 40px;
    padding-left: 75%;
  }
</style>