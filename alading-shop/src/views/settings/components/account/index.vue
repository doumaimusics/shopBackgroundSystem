<template>
<div>
   <div class="section remainAmount">
     <div class="left">
       <p class="amount">账户余额: ¥ {{data.rebateAmount}}</p>
     </div>
     <div class="right">
      <el-button @click="detailFn">余额明细</el-button>
      <el-button-group>
        <el-button type="primary" @click="openAmount('RECHARGE')">充值</el-button>
        <el-button type="primary" @click="openAmount('CASH')">提现</el-button>
        <!-- <span class="cashTip">保证金不足10000，无法提现</span> -->
      </el-button-group>
     </div>
   </div>
   <el-dialog title="余额明细" :visible.sync="detailShow" append-to-body width="700px">
     <div style="max-height:400px;overflow:auto">
       <div v-for="(item,index) of detailData" :key="index">
       <span style="width:200px;display:inline-block">{{changeTxt(item.type)}} </span>
       <span style="width:150px;display:inline-block"> {{item.amount}}元 </span>
       <span> {{item.date}} </span>
     </div>
     </div>

   </el-dialog>

   <el-dialog 
    :title="(accountForm.type=='RECHARGE')?'余额充值':'余额提现'" 
    @close="accountForm={}" 
    :visible.sync="accountShow" 
    v-if="accountShow" 
    append-to-body 
    class="cashInOut" 
    :close-on-click-modal="false"
    width="700px"
  >
      <el-form class="login-form" :model="accountForm" ref="accountForm" :rules="moneyRule">
        <el-form-item prop="amount">
          <el-input name="amount" min="0.00"  v-model="accountForm.amount" step="0.01" placeholder="请输入金额"/>
        </el-form-item>
        <el-form-item>
         <el-select v-model="accountForm.cardId" placeholder="请选择银行卡">
          <el-option
            v-for="item in cardList"
            :key="item.id"
            :label="item.bankName"
            :value="item.id">
          </el-option>
        </el-select>
        </el-form-item>
        <el-form-item prop="payPwd">
          <el-input type="password" v-model="accountForm.payPwd" placeholder="请输入支付密码" autocomplete="new-password"/>
        </el-form-item>
      <el-button type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="accountFn" :loading="disBtn" :disabled="!accountForm.amount || !accountForm.cardId || !accountForm.payPwd">确认</el-button>
    </el-form>
  </el-dialog>

  <!-- 冻结金额 -->
  <div class="section frozenAmount">
    <div class="left">
      <p class="amount">冻结金额：¥ {{data.freezedAmount}}</p>
      <p>待结算金额，订单结算后将转至可提现余额</p>
    </div>
  </div>

   <div class="section">
     <div class="left">
       <p class="amount">保证金: ¥ {{data.bondAmount}}</p>
       <p>你需要缴纳最低保证金：¥ {{data.bond}}</p>
     </div>
     <div class="right">
      <el-button-group>
        <el-button type="primary" @click="bondForm.type='BOND_IN';bondShow=true">缴纳</el-button>
        <!-- <el-button type="primary" @click="bondForm.type='BOND_OUT';bondShow=true">取出</el-button> -->
      </el-button-group>
     </div>
   </div>

   <el-dialog :title="(bondForm.type=='BOND_OUT')?'保证金取出(取出保证金可能导致部分商品下架)':'保证金缴纳'"  @close="bondForm={}" :visible.sync="bondShow" v-if="bondShow" append-to-body :close-on-click-modal="false" width="700px">
      <el-form class="login-form" :model="bondForm" ref="bondForm" :rules="moneyRule">
        <!-- 去除火狐的自动填充 -->
        <input type="password" style="display: none;"/>
        <el-form-item prop="amount">
          <el-input name="amount" v-model="bondForm.amount" min="0.00"  step="0.01" placeholder="请输入金额"/>
        </el-form-item>
        <el-form-item prop="payPwd">
          <el-input type="password" v-model="bondForm.payPwd" placeholder="请输入支付密码"/>
        </el-form-item>
      <el-button type="primary" style="width:100%;margin-bottom:30px;" :loading="disBtn" @click.native.prevent="bondFn" :disabled="!bondForm.amount || !bondForm.payPwd || bondForm.amount<=0">确认</el-button>
    </el-form>
  </el-dialog>
</div>
</template>

<style lang="scss" scoped>
.section{
  width:700px;
  padding:20px 0;
  height: 170px;
  .left{
    float: left;
  }
  .right{
    float: right;
  }
  &.remainAmount {
    height: 130px;
  }
}
.amount{
  font-size: 26px;
  font-weight: 700;
  padding-bottom: 20px;
}
.cashInOut {
  .el-select {
    width: 100%;
  }
}
</style>

<script>
  import {
    accountPage,
    cashOutValid,
    listBankCards,
    accountDetail,
    bondOperation,
    accountOperation
  } from '@/api/settings'
  import { account } from '@/utils/validate'

  export default {
    data() {
      return {
        bondForm: {},
        data: {},
        bondShow: false,
        accountForm: {},
        accountShow: false,
        diaTitle: '新建子账号',
        editForm: {},
        cardList: [],
        detailData: [],
        detailShow: false,
        disBtn: false,
        moneyRule: {
          amount: [{ required: true, trigger: 'blur', validator: account }]
        }
      }
    },
    created() {
      this.init()
    },
    methods: {
      changeTxt(val) {
        switch (val) {
          case 'RECHARGE':
            return '充值'
          case 'CASH':
            return '提现'
          case 'BOND_IN':
            return '保证金缴纳'
          case 'BOND_OUT':
            return '保证金提现'
          case 'SETTLEMENTADD':
            return '结算'
          case 'SETTLEMENTSUBTRACT':
            return '结算扣除'
          default:
            return '无'
        }
      },
      async init() {
        await accountPage().then((res) => {
          this.data = res.data
        })
      },
      async openAmount(val) {
        // const shopType = this.$store.getters.shopinfo.shopType;
        // if (shopType < 3 && this.data.bondAmount < 10000) {
        //   this.$message({ type: 'error', message: '未达到提现要求，请联系业务经理！' });
        //   return;
        // }

        // 判断是否达到提现要求
        if (val === 'CASH') {
          const flag = await cashOutValid().then(res => {
            if (res.code === 1157) {
              // 提示联系业务经理
              this.$message({ type: 'error', message: res.msg, duration: 5 * 1000 })
              return false
            }
            if (res.code === 1159) {
              // 账户余额8000，划至保证金
              this.init()
              this.$message({ type: 'error', message: res.msg, duration: 5 * 1000 })
              return false
            }
            if (res.code === 1000) {
              return true
            }
          })

          if (!flag) {
            return
          }
        }

        this.accountForm.type = val
        listBankCards().then((res) => {
          if (JSON.stringify(res.data) === '{}') {
            this.$message({ type: 'error', message: '用户暂未绑定银行卡' })
            return
          }
          this.accountShow = true
          this.cardList = res.data.bankCardList
        })
      },
      async detailFn() {
        await accountDetail().then((res) => {
          this.detailData = res.data
          this.detailShow = true
        })
      },
      async bondFn() {
        this.$refs.bondForm.validate((valid) => {
          if (valid) {
            this.disBtn = true
            bondOperation(this.bondForm).then((res) => {
              this.disBtn = false
              this.bondShow = false
              this.bondForm = {}
              this.init()
            }).catch(() => {
              this.disBtn = false
            })
          }
        })
      },
      async accountFn() {
        this.$refs.accountForm.validate((valid) => {
          if (valid) {
            this.disBtn = true
            accountOperation(this.accountForm).then((res) => {
              this.disBtn = false
              this.accountShow = false
              this.accountForm = {}
              setTimeout(() => { // 后台有延迟,让前端做sleep
                this.init()
              }, 3000)
            }).catch(() => {
              this.disBtn = false
            })
          }
        })
      },
      changeFn() {
        this.showDialog = false
        this.init()
      }
    }
  }
</script>
