<template>
  <div class="dashboard-editor-container">
    <div v-if="!initData.isPayBondEnough" class="section">
      <p class="shopName">{{changeTxt(initData)}}：</p>
      <p class="tips">恭喜您通过店铺审核，店铺已成功开通，需缴纳足额保证金后上传商品</p>
      <span>您店铺的主营类目：{{initData.category}}</span>
      <span>需缴纳保证金：￥{{initData.bond}}</span>
      <el-button type="warning" @click="goSetting">前往缴纳</el-button>
    </div>
    <div class="section aThings">
      <h4>待办事项</h4>
      <div class="kuaiBox">
        <div class="kuai">
          <h5>商品管理</h5>
          <span><router-link to="/product/salePro">出售中的商品：{{initData.backLog&& initData.backLog.salingCount}}</router-link></span>
          <span><router-link to="/product/storePro">等待上架的商品：{{initData.backLog && initData.backLog.unsalingCount}}</router-link></span>
        </div>
        <div class="kuai" v-if="initData.backLog">
          <h5>订单提醒</h5>
          <!-- 隐藏待付款项 -->
          <!-- <span><router-link to="/deal/order">待付款订单：{{initData.backLog.watingPayingCount}}</router-link></span> -->
          <span @click="goOrder"><a>待发货订单：{{initData.backLog.waitingDeliverCount}}</a></span>
          <span><router-link to="deal/afterService">退款中订单：{{initData.backLog.refundingCount}}</router-link></span>
        </div>
      </div>
    </div>

    <!-- 产品说，隐藏。。 -->
    <!-- <el-container v-if="initData.dataLog">
      <el-main>
          <el-row class="imedata">
              <el-col :span="12"><h4>实时数据</h4></el-col>
              <el-col :span="12" class="rightpos">截止今日当前</el-col>
          </el-row>
          <el-row type="flex">
              <el-col :span="4">访客数</el-col>
              <el-col :span="4" :offset="1">商品浏览量</el-col>
              <el-col :span="4" :offset="1">下单数</el-col>
              <el-col :span="4" :offset="1">支付订单数</el-col>
              <el-col :span="4" :offset="1">支付金额</el-col>
          </el-row>
          <el-row type="flex">
              <el-col :span="4">{{initData.dataLog.tvisitor}}</el-col>
              <el-col :span="4" :offset="1">{{initData.dataLog.tgoodBrowseCount}}</el-col>
              <el-col :span="4" :offset="1">{{initData.dataLog.ttotalCount}}</el-col>
              <el-col :span="4" :offset="1">{{initData.dataLog.tpayCount}}</el-col>
              <el-col :span="4" :offset="1">￥{{initData.dataLog.tpayAmount}}</el-col>
          </el-row>
          <el-row type="flex" class="yestoday">
              <el-col :span="4">昨日全天 {{initData.dataLog.yvisitor}}</el-col>
              <el-col :span="4" :offset="1">昨日全天 {{initData.dataLog.ygoodBrowseCount}}</el-col>
              <el-col :span="4" :offset="1">昨日全天 {{initData.dataLog.ytotalCount}}</el-col>
              <el-col :span="4" :offset="1">昨日全天 {{initData.dataLog.ypayCount}}</el-col>
              <el-col :span="4" :offset="1">昨日全天 ￥{{initData.dataLog.ypayAmount}}</el-col>
          </el-row>
      </el-main>
    </el-container> -->

    <div class="section msg">
      <h4>系统消息</h4>
      <div class="systemMessage">
        <div class="kuai1" v-for="item of initData.msgList" :key="item.id">
          <p class="message">{{item.msg}}</p>
          <p class="time">{{item.gmtCreate | formatTimestamp}}</p>
        </div>
        <p v-if="initData.msgList.length<=0" class="noMsg">暂无消息</p>
      </div>
    </div>


    <!-- v-for="item in tipsMsg" :key="item.id" -->
      <el-dialog 
        :title="tipsMsg[numbers].name"
        :visible.sync="centerDialogVisible"
        center
        :show-close="false"
        :close-on-click-modal="false"
        custom-class="dialog_box"
        >
        
          <h4 class="time">{{tipsMsg[numbers].tiem}}</h4>
          <div class="text">
            {{tipsMsg[numbers].name}}
          </div>
          <div class="bottom">
                <span class="item" v-if="lent != 0">还剩{{lent}}条未读</span>
                <el-button type="primary" disabled v-if="conunt != 0">我知道了（{{conunt}}s）</el-button>
                <el-button type="primary" @click="delArr" v-else>我知道了（{{conunt}}s）</el-button>
          </div>
      </el-dialog>
  </div>
</template>

<script>
  import { goShopMainPage } from '@/api/index'
  import { formatTimestamp } from '@/utils/tools.js'

  export default {
    filters: { formatTimestamp },
    data() {
      return {
        initData: {
          isPayBondEnough: true,
          msgList: []
        },
        centerDialogVisible:true,
        numbers:0,   // 规则index
        tipsMsg: [   // 规则数据
          { name: '廉政通道上线了', tiem: '2019-05-10',id:"1" },
          { name: '超卖规则已上线，请仔细阅读哦', tiem: '2019-05-11',id:"2" },
          { name: '前台协议更新，详情请点击', tiem: '2019-05-12',id:"3" }
        ],
        lent: null,  // 规则剩余数
        conunt: 5,
        timer: null
      }
    },
    created() {
      this.init();
      this.lent = this.tipsMsg.length - 1;
      this.countDown()
    },
    methods: {
      async init() {
        await goShopMainPage().then((res) => {
          this.initData = res.data
        })
      },
      changeTxt(val) {
        let txt = ''
        switch (val.shopType) {
          case 0:
            txt = '旗舰店'
            break
          case 1:
            txt = '专卖店'
            break
          case 2:
            txt = '专营店'
            break
          case 3:
            txt = '个人店'
            break
        }
        return val.shopName + txt
      },
      goSetting() {
        this.$router.push({ path: '/settings', query: { type: '5' }})
      },
      goOrder() {
        this.$router.push({ path: '/deal/order', query: { type: '0' }})
      },
      countDown() {    // 倒计时
        this.timer = setInterval(() => {
        if(this.conunt > 0) {
            this.conunt --
            if(this.conunt == 0) {
                clearInterval(this.timer);
            }
          }
        },1000)
      },
      delArr() {   // 点击我知道了
          if(this.numbers == this.tipsMsg.length - 1) {
             return this.centerDialogVisible = false;
          } else {
            this.numbers ++;
            this.lent --;
            this.conunt = 5;
            this.countDown()
          }
      }
    }

  }
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  min-height: calc(100vh - 50px);

  .shopName {
    // padding-top: 10px;
    padding-bottom: 10px;
  }
  .tips {
    padding-left: 20px;
    color: #999;
    padding-top: 10px;
    padding-bottom: 5px;
  }
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
  // 大框
  .section{
    width:100%;
    background: white;
    padding:20px;
    margin-bottom: 32px;
    border-radius: 10px;

    .systemMessage {
      max-height: 480px;
      overflow: auto;
      padding-right: 5px;
    }
    &:last-child {
      margin-bottom: 0;
    }
    &.msg {
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
        background-color: #fff;
      }
      ::-webkit-scrollbar-thumb {
        border-radius: 4px;
        background-color: hsla(220,4%,58%,.5);
      }
      h4 {
        padding-bottom: 20px;
      }
    }
  }
  .kuaiBox {
    display: flex;
    justify-content: space-around;
  }
  .kuai{
    // display: inline-block;
    margin: 10px;
    // margin-left: 0;
    padding: 20px;
    background: rgba(240, 242, 245, .3);
    border-radius: 10px;
    width: 30%;
    min-width: 400px;
    height: 140px;
    border: 1px solid #eee;
    // text-align: center;

    h5 {
      padding-bottom: 45px;
      font-size: 14px;
    }
    &:first-of-type {
      margin-right: 20%;
    }
    a{
      color:black;
      text-decoration: none
    }
    &:hover {
      a {
        text-decoration: underline;
      }
    }
  }
  .kuai1{
    margin-bottom: 15px;
    padding: 10px 10px;
    // width:800px;
    background: rgba(240, 242, 245, .3);
    border-radius: 10px;
    border: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .message {
      line-height: 1.8;
    }
    .time {
      text-align: right;
      font-size: 12px;
      color: #999;
      padding-top: 3px;
      min-width: 130px;
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
  h5{
    padding: 0 0 30px;
    margin: 0;
    font-weight: 700;
  }
  h4 {
    padding: 0 0 10px;
    margin: 0;
    font-weight: 700;
  }
  span{
    padding:5px 20px
  }
  .aThings {
    a:hover {
      color: #409EFF;
    }
  }
}
.el-container{
    background: white;
    margin-bottom: 32px;
    border-radius: 10px;

    .el-row--flex{
        margin-top:10px;
        font-size: 14px;
    }
    .yestoday{
        color:#999;
    }
    .rightpos{
      text-align: right;
      color:#999;
      // -webkit-margin-before: 1.33em;
      // -webkit-margin-after: 1.33em;
      padding: 10px 0;
      font-size: 14px;
    }
    // .imedata{
    //   margin-bottom: 20px;
    // }
    .el-header{
        line-height: 60px;
    }
    .el-main{
        padding-top: 20px;
    }
}
.noMsg {
  color: #999;
  font-size: 12px;
  text-indent: 2em;
}

.dialog_box{
  .time{
    text-align: center;
    margin-bottom: 32px;
  }
  .text{
    margin-bottom: 60px;
    
  }

  .bottom {
    text-align: right;
    .item {
      margin-right: 18px;
    }
  }
}


</style>
