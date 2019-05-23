<template>
  <div class="login-container">
    <el-form 
      class="login-form" 
      :model="loginForm" 
      :rules="loginRules" 
      ref="loginForm" 
      label-position="left" 
      onsubmit="return false"
    >
      <div class="title-container">
        <h3 class="title">商户登录</h3>
        <!-- <lang-select class="set-language"></lang-select> -->
      </div>

      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input name="username" type="text" v-model="loginForm.username" placeholder="请输入账号"/>
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input 
          name="password" 
          :type="passwordType" 
          @keyup.enter.native="handleLogin" 
          v-model="loginForm.password"
          placeholder="请输入密码"
        />
        <!-- <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye" />
        </span> -->
      </el-form-item>

      <el-button 
        type="primary" 
        style="width:100%;margin-bottom:30px;" 
        :loading="loading" 
        @click.native.prevent="handleLogin"
      >登录</el-button>

      <div class="tips">
        <span></span>
      </div>
      <div class="tips">
        <span></span>
      </div>

      <el-button class="forget-button" @click="showForDialog=true" size="small">找回密码</el-button>
      <el-button class="thirdparty-button" type="primary" @click="showDialog=true" size="small">点击注册</el-button>

      <!-- 配合onsubmit="return false"实现火狐浏览器提示保存密码 -->
      <div style="display: none">
        <input type="submit"/>
      </div>
    </el-form>

    <el-dialog 
      title="找回密码" 
      :visible.sync="showForDialog" 
      v-if="showForDialog" 
      append-to-body 
      :close-on-click-modal="false" 
      width="700px"
    >
      <forget v-on:visible="close"></forget>
    </el-dialog>

    <el-dialog 
      title="注册" 
      :visible.sync="showDialog" 
      v-if="showDialog" 
      append-to-body 
      :close-on-click-modal="false" 
      width="700px"
    >
      <register></register>
    </el-dialog>

  </div>
</template>

<script>
  import * as valid from '@/utils/validate'
  // import LangSelect from '@/components/LangSelect'
  // import SocialSign from './socialsignin'
  import register from './components/register'
  import forget from './components/forget'

  export default {
    components: { register, forget },
    data() {
      return {
        loginForm: {
          username: '',
          password: ''
        },
        loginRules: {
          username: [{ required: true, trigger: 'blur', validator: valid.username }],
          password: [{ required: true, trigger: 'blur', validator: valid.password }]
        },
        passwordType: 'password',
        loading: false,
        showDialog: false,
        showForDialog: false
      }
    },
    methods: {
      /* showPwd() {
        if (this.passwordType === 'password') {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
      }, */
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true
            this.$store.dispatch('LoginByUsername', this.loginForm).then((res) => {
              this.loading = false
              this.$router.push({ path: '/' })
            }).catch(() => {
              this.loading = false
            })
          } else {
            return false
          }
        })
      },
      close() {
        this.showDialog = false
        this.showForDialog = false
      },
      afterQRScan() {
        // const hash = window.location.hash.slice(1)
        // const hashObj = getQueryObject(hash)
        // const originUrl = window.location.origin
        // history.replaceState({}, '', originUrl)
        // const codeMap = {
        //   wechat: 'code',
        //   tencent: 'code'
        // }
        // const codeName = hashObj[codeMap[this.auth_type]]
        // if (!codeName) {
        //   alert('第三方登录失败')
        // } else {
        //   this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
        //     this.$router.push({ path: '/' })
        //   })
        // }
      }
    },
    created() {
      // window.addEventListener('hashchange', this.afterQRScan)
    },
    destroyed() {
      // window.removeEventListener('hashchange', this.afterQRScan)
    }
  }
</script>

<style lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $bg:#283443;
  $light_gray:#eee;
  $cursor: #fff;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input{
      color: $cursor;
      &::first-line {
        color: $light_gray;
      }
    }
  }

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;
       input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;
        &:-webkit-autofill {
          box-shadow: none;
          -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.2);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }
</style>

<style lang="scss" scoped>
  $bg:#2d3a4b;
  $dark_gray:#889aa4;
  $light_gray:#eee;

  .login-container {
    position: fixed;
    height: 100%;
    width: 100%;
    background-color: $bg;
    .login-form {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 520px;
      padding: 35px 35px 15px 35px;
      transform:translate(-50%,-50%)

    }
    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;
      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }
    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
      &_login {
        font-size: 20px;
      }
    }
    .title-container {
      position: relative;
      .title {
        font-size: 26px;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
      .set-language {
        color: #fff;
        position: absolute;
        top: 5px;
        right: 0px;
      }
    }
    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
    .forget-button{
      position: absolute;
      right: 140px;
      bottom: 40px;
    }
    .thirdparty-button {
      position: absolute;
      right: 35px;
      bottom: 40px;
    }
  }

  .el-form-item {
    /deep/ .el-form-item__content {
      line-height: 32px;
    }
  }
</style>
