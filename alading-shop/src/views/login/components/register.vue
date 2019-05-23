<template>
    <el-form class="login-form" :model="registerForm" :rules="registerRules" ref="registerForm" label-position="left">
      <!-- 去除火狐的自动填充 -->
      <input type="password" style="display: none;"/>

      <el-form-item prop="username">
        <el-input prefix-icon="el-icon-mobile-phone" name="username" type="text" v-model="registerForm.username" placeholder="请输入手机号"/>
      </el-form-item>

      <el-form-item prop="password">
        <el-input 
          prefix-icon="el-icon-tickets" 
          :type="passwordType" 
          v-model="registerForm.password" 
          placeholder="请输入密码"
        >
          <el-button slot="append" @click="showPwd" icon="el-icon-view"></el-button>
        </el-input>
      </el-form-item>

      <el-form-item prop="code">
        <el-input prefix-icon="el-icon-message" name="code" type="text" v-model="registerForm.code" placeholder="请输入验证码">
          <el-button slot="append" @click="getcode" :disabled="disBtn">{{count}}</el-button>
        </el-input>
      </el-form-item>
      <el-button type="primary" style="width:100%;margin-bottom:30px;" :loading="loading" @click.native.prevent="registerLogin" :disabled="!(registerForm.username && registerForm.password && registerForm.code)">点击注册</el-button>
    </el-form>
</template>

<script>
import * as valid from '@/utils/validate'
import { getCode } from '@/api/login'

export default {
  data() {
    return {
      registerForm: {
        username: '',
        password: '',
        code: '',
        type: 'R'
      },
      registerRules: {
        username: [{ required: true, trigger: 'blur', validator: valid.username }],
        password: [{ required: true, trigger: 'blur', validator: valid.password }],
        code: [{ required: true, trigger: 'blur', validator: valid.code }]
      },
      passwordType: 'password',
      loading: false,
      count: '获取验证码',
      disBtn: false,
      timer: null,
      isPwd: false
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    getcode() {
      this.$refs.registerForm.validateField('username', (vaild) => {
        if (vaild) {
          // console.log(vaild)  //error string
          return false
        } else {
          getCode(this.registerForm.username, 'R').then(() => {
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
        }
      })
    },
    registerLogin() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('Register', this.registerForm).then(() => {
            this.loading = false
            this.$router.push({ path: '/' })
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .login-form {
    padding: 0 35px;
  }

</style>
