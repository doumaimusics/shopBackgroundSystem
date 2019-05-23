<template>
  <el-form class="login-form" :model="cardForm" :rules="forgetRules" ref="cardForm">
    <el-form-item prop="name" label="持卡人:">
      <el-input name="name" type="text" v-model="cardForm.name" placeholder="请输入持卡人姓名"/>
    </el-form-item>
    <el-form-item prop="bankNo" label="银行卡号:">
      <el-input name="bankNo" type="text" v-model="cardForm.bankNo" @blur="getBankName" placeholder="请输入银行卡号"/>
    </el-form-item>
    <el-form-item label="银行:" prop="bankName">
      <el-select v-model="cardForm.bankName" placeholder="请选择">
        <el-option
          v-for="item in cardList"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item prop="idNumber" label="身份证号:">
      <el-input name="idNumber" type="text" v-model="cardForm.idNumber" placeholder="请输入身份证号"/>
    </el-form-item>
    <el-form-item prop="mobile" label="银行预留手机号:">
      <el-input name="mobile" type="text" v-model="cardForm.mobile" placeholder="请输入手机号"/>
    </el-form-item>
    <el-form-item prop="smsCode" label="手机验证码:">
      <el-input name="smsCode" type="text" v-model="cardForm.smsCode" placeholder="请输入手机验证码">
        <el-button slot="append" @click="getcode" :disabled="disBtn">{{count}}</el-button>
      </el-input>
    </el-form-item>
    <el-button 
      type="primary" 
      style="width:100%;margin-bottom:30px;" 
      :loading="loading" 
      @click.native.prevent="submit"
      :disabled="!cardForm.name || !cardForm.bankNo || !cardForm.bankName || !cardForm.idNumber || !cardForm.mobile || !cardForm.smsCode"
    >确认提交</el-button>
  </el-form>
</template>

<script>
  import {
    getBankList,
    getBankName,
    submitBankCard,
    applyBindBankcard
  } from '@/api/settings'
  import { code } from '@/utils/validate'

  export default {
    props: ['visible'],
    data() {
      return {
        cardForm: {
          name: '',
          bankNo: '',
          bankName: '',
          idNumber: '',
          mobile: '',
          smsCode: ''
        },
        cardList: [],
        forgetRules: {
          smsCode: [{ required: true, trigger: 'blur', validator: code }],
          name: [{ required: true, trigger: 'blur', message: '请输入持卡人姓名' }],
          bankNo: [{ required: true, trigger: 'blur', message: '请输入银行卡号' }],
          bankName: [{ required: true, trigger: 'blur', message: '请选择银行' }],
          idNumber: [{ required: true, trigger: 'blur', message: '请输入身份证号码' }],
          mobile: [{ required: true, trigger: 'blur', message: '请输入手机号' }]
        },
        loading: false,
        count: '获取验证码',
        disBtn: true,
        timer: null,
        isPwd: false
      }
    },
    created() {
      this.init()
    },
    methods: {
      init() {
        getBankList().then((res) => {
          this.cardList = res.data
        })
      },
      getBankName() {
        const params = {
          bankNo: this.cardForm.bankNo.replace(/\s+/g, '')
        }
        getBankName(params).then((res) => {
          this.cardForm.bankName = res.data
        })
      },
      // 提交修改
      submit() {
        Object.keys(this.cardForm).forEach(v => {
          if (v !== 'bankName' && v !== 'bankCardId') {
            this.cardForm[v] = this.cardForm[v].replace(/\s+/g, '')
          }
        })
        this.$refs.cardForm.validate((valid) => {
          if (valid) {
            submitBankCard(this.cardForm).then(() => {
              this.$emit('visible', false)
            })
          }
        })
      },
      getcode() {
        Object.keys(this.cardForm).forEach(v => {
          if (v !== 'bankName' && v !== 'bankCardId') {
            this.cardForm[v] = this.cardForm[v].replace(/\s+/g, '')
          }
        })
        const data = {
          name: this.cardForm.name,
          bankNo: this.cardForm.bankNo,
          bankName: this.cardForm.bankName,
          idNumber: this.cardForm.idNumber,
          mobile: this.cardForm.mobile
        }
        applyBindBankcard(data).then((res) => {
          this.cardForm.bankCardId = res.data
          // 倒计时
          this.disBtn = true
          const TIME_COUNT = 60
          if (!this.timer) {
            this.count = TIME_COUNT
            this.show = false
            this.timer = setInterval(() => {
              if (this.count > 0 && this.count <= TIME_COUNT) {
                this.count--
              } else {
                this.show = true
                clearInterval(this.timer)
                this.timer = null
                this.count = '再次获取'
                this.disBtn = false
              }
            }, 1000)
          }
        })
        //  }
        //  })
      }
    },

    watch: {
      cardForm: {
        handler(val) {
          let flag = false
          Object.keys(val).forEach(v => {
            // 排除验证码输入框，判断其他输入框是否为空
            if (v !== 'smsCode' && !val[v]) {
              flag = true
            }
          })
          // 验证码倒计时状态下按钮一直禁用，否则再判断非空
          this.disBtn = ['获取验证码', '再次获取'].indexOf(this.count) === -1 ? true : flag
        },
        deep: true
      }
    }
  }
</script>

<style lang="scss" scoped>
  .login-form {
    padding:0 35px;

    .el-select {
      width: 100%;
    }
  }
</style>
