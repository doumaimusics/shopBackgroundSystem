<template>

    <el-form class="login-form" :model="forgetForm" :rules="forgetRules" ref="forgetForm">
      <template v-if="!isPwd">
        <el-form-item prop="username" label="用户名:">
          <el-input name="username" type="text" v-model="forgetForm.username" placeholder="请输入手机号"/>
        </el-form-item>
        <el-form-item prop="code" label="验证码:">
          <el-input name="code" type="text" v-model="forgetForm.code" placeholder="请输入验证码">
            <el-button slot="append" @click="getcode" :disabled="disBtn || !forgetForm.username">{{count}}</el-button>
          </el-input>
        </el-form-item>
      </template>
      <template v-if="isPwd">
        <el-form-item prop="newPasswordOne" label="新密码:">
          <el-input name="newPasswordOne" type="password" v-model="forgetForm.newPasswordOne" placeholder="请输入新密码"/>
        </el-form-item>
        <el-form-item prop="newPasswordTwo" label="再次确认:">
          <el-input name="newPasswordTwo" type="password" v-model="forgetForm.newPasswordTwo" placeholder="请再次输入新密码"/>
        </el-form-item>
      </template>
      <el-button style="width:100%;margin-bottom:30px;" :loading="loading" v-show="isPwd" @click.native.prevent="isPwd=false">上一步</el-button>
      <el-button type="primary" style="width:100%;margin-bottom:30px;margin-left:0" :loading="loading" @click.native.prevent="changePwd">{{(!isPwd)?'下一步':'确认修改'}}</el-button>
    </el-form>
</template>

<script>
import * as valid from '@/utils/validate'
import { getCode, forget } from '@/api/login'

export default {
  props: ['visible'],
  data() {
    const validatePasswordTwo = (rule, value, callback) => {
      if (value != this.forgetForm.newPasswordOne) {
        callback(new Error('2次密码输入不相同'))
      } else {
        callback()
      }
    }
    const validaterealname = (rule, value, callback) => {
      if (value.length < 2) {
        callback(new Error('请输入使用者'))
      } else {
        callback()
      }
    }
    return {
      forgetForm: {
        username: '',
        newPasswordOne: '',
        newPasswordTwo: '',
        code: '',
        type: 'F'
      },
      forgetRules: {
        username: [{ required: true, trigger: 'blur', validator: valid.username }],
        code: [{ required: true, trigger: 'blur', validator: valid.code }],
        newPasswordOne: [{ required: true, trigger: 'blur', validator: valid.password }],
        newPasswordTwo: [{ required: true, trigger: 'blur', validator: validatePasswordTwo }],
        realname: [{ required: true, trigger: 'blur', validator: validaterealname }]
      },
      checks: [
        { name: '店铺管理', id: '1' },
        { name: '店铺装修', id: '2' },
        { name: '商品管理', id: '3' },
        { name: '交易管理', id: '4' },
        { name: '结算管理', id: '5' },
        { name: '营销中心', id: '6' },
        { name: '数据中心', id: '7' }
      ],
      loading: false,
      count: '获取验证码',
      timer: null,
      isPwd: false,
      disBtn: false
    }
  },
  methods: {
    changePwd() {
      if (!this.isPwd) { // 判断验证码
        this.$refs.forgetForm.validate((vaild) => {
          if (vaild) {
            this.isPwd = true
          } else {
            console.log('error code!!')
            return false
          }
        })
      } else { // 提交修改
        this.$refs.forgetForm.validate((vaild) => {
          // console.log('3333',this.forgetForm)
          if (vaild) {
            forget(this.forgetForm).then(() => {
              this.$message({
                message: '密码修改成功',
                type: 'success'
              })
              this.$emit('visible', false)
            })
          } else {
            console.log('error code!!')
            return false
          }
        })
      }
    },
    getcode() {
      this.$refs.forgetForm.validateField('username', (vaild) => {
        if (vaild) {
          // console.log(vaild)  //error string
          return false
        } else {
          getCode(this.forgetForm.username, 'F').then(() => {
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
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .login-form {
    padding: 0 35px;
  }

</style>
