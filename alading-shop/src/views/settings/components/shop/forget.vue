<template>
    <el-form class="login-form" :model="forgetForm" :rules="forgetRules" ref="forgetForm">
        <el-form-item prop="password" label="原密码:">
          <el-input name="password" type="text" v-model="forgetForm.password" placeholder="请输入原密码"/>
        </el-form-item>
        <el-form-item prop="newPasswordOne" label="新密码:">
          <el-input name="newPasswordOne" type="password" v-model="forgetForm.newPasswordOne" placeholder="请输入新密码"/>
        </el-form-item>
        <el-form-item prop="newPasswordTwo" label="再次确认:">
          <el-input name="newPasswordTwo" type="password" v-model="forgetForm.newPasswordTwo" placeholder="请再次输入新密码"/>
        </el-form-item>
      <el-button type="primary" style="width:100%;margin-bottom:30px;" :loading="loading" 
      @click.native.prevent="changePwd" :disabled="!forgetForm.password || !forgetForm.newPasswordOne || !forgetForm.newPasswordTwo">确认修改</el-button>
    </el-form>
</template>

<script>
// import { isvalidUsername } from '@/utils/validate'
import { forgetPwd } from '@/api/settings'

export default {
  props: ['visible'],
  data() {
    // const validatePassword = (rule, value, callback) => {
    //   if (value.length < 6) {
    //     callback(new Error('密码长度不能小于6位'))
    //   } else {
    //     callback()
    //   }
    // }
    const validatePasswordTwo = (rule, value, callback) => {
      if (value != this.forgetForm.newPasswordOne) {
        callback(new Error('2次密码输入不相同'))
      } else {
        callback()
      }
    }
    return {
      forgetForm: {
        password: '',
        newPasswordOne: '',
        newPasswordTwo: ''
      },
      forgetRules: {
        password: [{ required: true, trigger: 'blur', message: '请输入密码' },
          { min: 6, message: '密码长度不能小于6位' }
        ],
        newPasswordOne: [{ required: true, trigger: 'blur', message: '请输入密码' }, { min: 6, message: '密码长度不能小于6位' }],
        newPasswordTwo: [{ required: true, trigger: 'blur', validator: validatePasswordTwo }]
      },
      loading: false
    }
  },
  methods: {
    changePwd() {
    // 提交修改
      this.$refs.forgetForm.validate((vaild) => {
        // console.log('3333',this.forgetForm)
        if (vaild) {
          forgetPwd(this.forgetForm).then(() => {
            this.$emit('visible', false)
          })
        } else {
          console.log('error code!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
