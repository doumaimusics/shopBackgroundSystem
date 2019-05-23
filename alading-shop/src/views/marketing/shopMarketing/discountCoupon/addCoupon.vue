<template>
  <div class="addCoupon">
    <el-form :model="form" :rules="rules" ref="formRef">
      <el-form-item prop="name" label="优惠券名称：">
        <el-input v-model="form.name"></el-input>
      </el-form-item>

      <el-form-item prop="type" label="优惠券类型：">
        <el-radio v-model="form.type" label="FULLVOUCHER">满减券</el-radio>
      </el-form-item>

      <el-form-item prop="amount" label="优惠金额：">
        <el-input v-model="form.amount" type="number"></el-input>
      </el-form-item>

      <el-form-item prop="limitAmount" label="使用限制：">
        满 <el-input v-model="form.limitAmount" type="number"></el-input> 元可用
      </el-form-item>

      <el-form-item prop="quota" label="发行量：">
        <el-input-number
          controls-position="right"
          :min="1"
          :precision="0"
          v-model="form.quota"
        ></el-input-number>
      </el-form-item>

      <el-form-item prop="limitCount" label="单人领取上限：">
        <el-input-number
          controls-position="right"
          :min="1"
          :precision="0"
          v-model="form.limitCount"
        ></el-input-number>
      </el-form-item>

      <el-form-item prop="dateRange" label="有效时间：">
        <el-radio v-model="form.expiryType" label="R">
          <el-date-picker
            v-model="form.dateRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-radio>
      </el-form-item>
      <el-form-item prop="validDays" label="">
        <el-radio v-model="form.expiryType" label="D">
          <span>
            领取后 <el-input-number
            controls-position="right"
            :min="1"
            :precision="0"
            v-model="form.validDays"
          ></el-input-number> 天
          </span>
          <!-- <p class="dateTo">
            领取截止时间：
            <el-date-picker
              v-model="form.dateTo"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </p> -->
        </el-radio>
      </el-form-item>

      <el-form-item prop="isGlobal" label="使用范围：">
        <el-radio v-model="form.isGlobal" :label="9">全店</el-radio>
      </el-form-item>

      <el-form-item prop="isShow" label="详情页领券：">
        <el-radio v-model="form.isShow" label="1">是</el-radio>
        <el-radio v-model="form.isShow" label="0">否</el-radio>
      </el-form-item>

      <el-form-item class="btn">
        <el-button type="default" @click="goBack">返回</el-button>
        <el-button type="primary" @click="onSubmit">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { setAddCoupon } from '@/api/marketing'

  export default {
    data() {
      const that = this
      const validators = {
        validateAmount(rule, value, callback) {
          const reg = /^\d+(\.\d+)?$/
          if (value === '0' || !reg.test(value)) {
            return callback(new Error('请输入大于0的数字'))
          }
          callback()
        },
        validateLimitAmount(rule, value, callback) {
          const reg = /^\d+(\.\d+)?$/
          if (!reg.test(value)) {
            return callback(new Error('请输入大于或等于0的数字'))
          }
          callback()
        },
        validateDateRange(rule, value, callback) {
          if (that.form.expiryType === 'R') {
            if ((!value || value.length <= 0)) {
              return callback(new Error('请选择日期范围'))
            }
            // else if (value[0].getTime() < new Date().getTime()) {
            //   return callback(new Error('开始时间不能小于当前时间'))
            // }
          }
          callback()
        },
        validateValidDays(rule, value, callback) {
          if (that.form.expiryType === 'D') {
            if (value === undefined) {
              return callback(new Error('不能为空'))
            }
          }
          callback()
        }
      }
      return {
        form: {
          name: '',
          type: 'FULLVOUCHER',
          amount: '',
          limitAmount: '',
          quota: undefined,
          limitCount: undefined,
          expiryType: 'R', // 'D' days 'R' range
          dateRange: [],
          validDays: undefined,
          // dateTo: '',
          isGlobal: 9,
          isShow: '1'
        },
        rules: {
          name: [{ required: true, message: '不能为空', trigger: 'blur' }],
          amount: [{ validator: validators.validateAmount, trigger: 'blur' }],
          limitAmount: [{ validator: validators.validateLimitAmount, trigger: 'blur' }],
          quota: [{ required: true, message: '不能为空', trigger: 'blur' }],
          limitCount: [{ required: true, message: '不能为空', trigger: 'blur' }],
          dateRange: [{ validator: validators.validateDateRange, trigger: 'blur' }],
          validDays: [{ validator: validators.validateValidDays, trigger: 'blur' }]
        }
      }
    },

    methods: {
      onSubmit() {
        this.$refs.formRef.validate(valid => {
          if (valid) {
            const params = { ...this.form }
            if (params.expiryType === 'R') {
              params.gmtStartTime = params.dateRange[0].getTime()
              params.gmtEndTime = params.dateRange[1].getTime()
              delete params.validDays
            }
            delete params.dateRange
            // ajax
            setAddCoupon(params).then(res => {
              this.$message({ type: 'success', message: '优惠券添加成功' })
              this.$router.push({ name: 'discountCoupon' })
            })
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
  .addCoupon {
    padding: 20px;
  }
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
  .btn {
    padding-top: 20px;
  }
  .el-form {
    padding-left: 20px;
  }
  .dateTo {
    padding: 10px 25px 0;
  }
  /deep/ .el-range-separator {
    width: 7%;
  }
</style>
