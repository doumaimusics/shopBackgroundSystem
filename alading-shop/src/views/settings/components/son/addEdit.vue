<template>
    <el-form class="login-form" :model="ziForm" :rules="(title=='新建子账号')?registerRules:editRule" ref="registerForm">
      <input type="password" style="display: none;"/>

      <el-form-item prop="username" label="用户名:">
        <el-input name="sonusername" type="text" :disabled="title!='新建子账号'" v-model="ziForm.username" placeholder="请输入手机号"/>
      </el-form-item>
      <el-form-item prop="password" label="密码:">
        <el-input type="password" v-model="ziForm.password" placeholder="请输入密码"/>
      </el-form-item>
      <el-form-item prop="realname" label="使用者:">
        <el-input name="sonrealname" type="text" v-model="ziForm.realname" placeholder="请输入使用者"/>
      </el-form-item>
      <el-form-item prop="roots" label="权限:">
        <div class="roots">
          <el-checkbox-group v-model="ziForm.roots" :min="1" @change='changRoot'>
            <el-checkbox v-for="data in checks" :label="data.id" :key="data.id">{{data.name}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </el-form-item>
      <el-button type="primary" style="width:100%;margin-bottom:30px;" :loading="loading" @click.native.prevent="registerLogin" :disabled="!ziForm.username||(!ziForm.password&&title==='新建子账号')">确定</el-button>
    </el-form>
</template>

<script>
import * as valid from '@/utils/validate'
import { addAdmin, updateAdmin } from '@/api/settings'

export default {
  props: ['editdata', 'title'],
  data() {
    return {
      ziForm: this.editdata,
      registerRules: {
        username: [{ required: true, trigger: 'blur', validator: valid.username }],
        password: [{ required: true, trigger: 'blur', validator: valid.password }]
      },
      editRule: {
        password: [{ required: true, trigger: 'blur', validator: valid.password }]
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
      loading: false
    }
  },
  created() {
    // console.log(this.ziForm)
  },
  methods: {
    changRoot(val) {
      // console.log(33333,val)

    },
    registerLogin() {
      const self = this
      const data = {
        username: self.ziForm.username,
        password: self.ziForm.password,
        realname: self.ziForm.realname,
        id: self.ziForm.id,
        root: self.ziForm.roots.join()
      }
      if (!data.realname) {
        delete data.realname
      }
      if (!data.id) {
        delete data.id
      }
      // ajax
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          if (self.title === '新建子账号') {
            addAdmin(data).then((res) => {
              self.$emit('visible', false)
            })
          } else {
            updateAdmin(data).then((res) => {
              self.$emit('visible', false)
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .login-form {
    padding: 0 20px;
  }
  .roots {
    display: inline-block;

    .el-checkbox+.el-checkbox {
      margin-left: 0;
    }
    .el-checkbox {
      margin-right: 43px;
    }
  }
</style>
