<template>
  <div>
    <div class="section">
      <div class="left">
        <p class="amount">银行卡管理</p>
      </div>
      <div class="right">
        <el-button type="primary" @click="cardShow=true">添加银行卡</el-button>
        <el-button type="primary" :disabled="data.length<=0" @click="pwdShow=true">设置支付密码</el-button>
      </div>
    </div>
    <div class="section">
      <div class="card" v-for="item of data" :key="item.id">
        <div>{{item.bankName}}</div>
        <div>{{item.cardNumber}}</div>
        <el-button
          type="danger"
          icon="el-icon-delete"
          circle
          style="margin-left:230px"
          @click="delShow=true;delForm.cardId=item.id"
        ></el-button>
      </div>
    </div>

    <el-dialog
      title="设置支付密码"
      :visible.sync="pwdShow"
      v-if="pwdShow"
      @close="pwdForm={}"
      append-to-body
      class="setPayPwd"
      :close-on-click-modal="false"
      width="700px"
    >
      <input type="password" style="display: none;"/>
      <el-input
        type="password"
        v-if="hasPwd"
        v-model="pwdForm.oldPwd"
        placeholder="请输入原支付密码"
      />
      <br>
      <el-input type="password" v-model="pwdForm.firstPwd" placeholder="请输入8位支付密码"/>
      <br>
      <el-input type="password" v-model="pwdForm.secPwd" placeholder="请确认支付密码"/>
      <br>
      <el-button
        type="primary"
        style="width:100%;margin:30px 0;"
        @click.native.prevent="pwdFn"
        :disabled="!pwdForm.firstPwd || !pwdForm.secPwd || hasPwd && !pwdForm.oldPwd"
      >确认</el-button>
    </el-dialog>

    <el-dialog title="解除绑定" :visible.sync="delShow" v-if="delShow" append-to-body width="700px">
      <el-input type="password" v-model="delForm.payPwd" placeholder="请输入支付密码"/>
      <br>
      <el-button
        type="primary"
        style="width:100%;margin:30px 0;"
        @click.native.prevent="delCardFn"
      >确认解绑</el-button>
    </el-dialog>

    <el-dialog
      title="添加银行卡"
      :visible.sync="cardShow"
      v-if="cardShow"
      append-to-body
      :close-on-click-modal="false"
      width="700px"
    >
      <bankcard v-on:visible="changeFn"></bankcard>
    </el-dialog>
  </div>
</template>
<style lang="scss" scoped>
  .section {
    width: 700px;
    padding: 20px 0;
    min-height: 100px;
    .left {
      float: left;
    }
    .right {
      float: right;
    }
  }
  .amount {
    font-size: 20px;
    font-weight: 600;
  }
  .card {
    width: 300px;
    display: inline-block;
    height: 150px;
    line-height: 30px;
    background: #fff;
    margin: 20px;
    padding: 20px;
    border-radius: 10px;
  }
  .setPayPwd {
    .el-input:not(:last-of-type) {
      margin-bottom: 20px;
    }
  }
</style>

<script>
  import bankcard from './bankcard'
  import {
    listBankCards,
    deleteBankCard,
    changePayPwd,
    setPayPwd
  } from '@/api/settings'

  export default {
    components: { bankcard },
    data() {
      return {
        data: [],
        cardShow: false,
        delShow: false,
        pwdShow: false,
        pwdForm: {},
        delForm: {},
        hasPwd: false
      }
    },
    created() {
      this.init()
    },
    methods: {
      async init() {
        await listBankCards().then((res) => {
          if (JSON.stringify(res.data) === '{}') {
            this.data = []
            // this.$message({ type: 'error', message: '用户暂未绑定银行卡' });
            return
          }
          this.data = res.data.bankCardList
          this.hasPwd = res.data.hasPatPwd
        }).catch(() => {
          this.data = []
          this.hasPwd = false
        })
      },
      delCardFn() {
        deleteBankCard(this.delForm).then((res) => {
          this.delForm = {}
          this.delShow = false
          this.init()
        })
      },
      pwdFn() {
        if (this.hasPwd) {
          changePayPwd(this.pwdForm).then(() => {
            this.pwdShow = false
            this.pwdForm = {}
            this.init()
          })
        } else {
          setPayPwd(this.pwdForm).then(() => {
            this.pwdShow = false
            this.pwdForm = {}
            this.init()
          })
        }
      },
      changeFn() {
        this.cardShow = false
        this.init()
      }
    }
  }
</script>