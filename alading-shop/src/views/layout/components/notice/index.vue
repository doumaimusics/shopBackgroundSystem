<template>
  <div class="notice">
    <img class="tipicon" src="https://img.51fanbei.com/h5/common/icon/tongzhi_new.png"/>
    <div class="box">
      <ul :class="{run:animate==true}">
        <li v-for='item in tipsMsg' @click="showFn(item.fn)">{{item.name}}</li>
      </ul>
    </div>
    <el-dialog title="廉政通道上线了" :visible.sync="lianShow" append-to-body width='800px'>
      <div class="lianBox">
        <h3 style="color:#F56C6C;">爱上街CEO邮箱已成为廉政以及业务的官方投诉渠道，为了维护公平透明的商业环境，请仔细阅读以下举报须知，CEO反馈通道将积极配合您完成投诉</h3>
        <p style="font-family:'PingFangSC-Medium', 'PingFang SC Medium', 'PingFang SC';font-weight:500;">廉正举报须知</p>
        <p class="txt1">爱上街致力于打造公开、透明、开放的商业生态，我们对于任何腐败的行为将予以坚决打击。</p>
        <p class="txt1">爱上街廉正合规部受理以下涉及员工违纪的举报：</p>
        <p class="txt1">（1）索取、收受贿赂；违规收受礼品或款待；</p>
        <p class="txt1">（2）违规投资、就职于爱上街供应商、商家、合作伙伴等；</p>
        <p class="txt1">（3）泄露公司保密信息等；</p>
        <p class="txt1">（4）利用职权谋取私利；</p>
        <p class="txt1">（5）其他违反法律法规、公司制度的行为。</p>
        <p class="txt1">我们希望您采取实名举报或提供可以联系到您的联系方式，以便专人保持联络，我们承诺会按照专业的做法，严格保护举报人，并对举报内容严格保密。举报内容必须客观真实。对于立案调查并有结论的举报，我们会根据您留下的联系方式进行反馈</p>
        <h4 style="color:#F56C6C;">CEO邮箱地址：ceo@ishangjie.com</h4>
        <p class="txt2">廉政举报邮件格式：</p>
        <p class="txt3">邮件主题：违纪举报</p>
        <p class="txt3">举报对象：</p>
        <p class="txt3">举报内容：</p>
        <p class="txt3">如有相关举报凭证，请上传。</p>
        <p class="txt3">举报人信息</p>
        <p class="txt3">姓名：</p>
        <p class="txt3">邮箱：</p>
        <p class="txt3">手机号码：</p>
        <p class="txt3">其他联系方式（QQ,钉钉等）：</p>

        <p class="txt2">业务投诉邮件格式：</p>
        <p class="txt3">邮件主题：业务投诉</p>
        <p class="txt3">投诉对象：</p>
        <p class="txt3">投诉内容：</p>
        <p class="txt3">如有相关举报凭证，请上传。</p>
        <p class="txt3">投诉人信息</p>
        <p class="txt3">姓名：</p>
        <p class="txt3">邮箱：</p>
        <p class="txt3">手机号码：</p>
        <p class="txt3">其他联系方式（QQ,钉钉等）：</p>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button @click="sendMail('违纪举报')">员工违纪举报</el-button>
          <el-button @click="sendMail('业务投诉')">其他业务投诉</el-button>
        </span>
    </el-dialog>

    <el-dialog title="超卖规则" :visible.sync="chaoShow" append-to-body width='840px'>
      <img style="width:800px" src="https://img.51fanbei.com/h5/pc/chaomai.gif"/>
      <span slot="footer" class="dialog-footer">
          <el-button @click="chaoShow=false">我知道了</el-button>
        </span>
    </el-dialog>

    <el-dialog title="爱上街平台合作协议 (V3.0 版本公示时间 2019 年 4 月) 签约须知" :visible.sync="qianShow" append-to-body width='840px'>
      <qian></qian>
      <span slot="footer" class="dialog-footer">
          <el-button @click="qianShow=false">我知道了</el-button>
        </span>
    </el-dialog>

    <el-dialog title="爱上街管理费及保证金规则" :visible.sync="baoShow" append-to-body width='840px'>
      <bao></bao>
      <span slot="footer" class="dialog-footer">
          <el-button @click="baoShow=false">我知道了</el-button>
        </span>
    </el-dialog>

    <el-dialog title="爱上街个人店铺保证金说明" :visible.sync="personalShow" append-to-body width='840px'>
      <personal></personal>
      <span slot="footer" class="dialog-footer">
          <el-button @click="personalShow=false">我知道了</el-button>
        </span>
    </el-dialog>

  </div>
</template>

<style lang="less" scoped>
  .notice {
    width: 340px;
    height: 50px;
    display: inline-block;
    // line-height: normal;
    vertical-align: top;
  }
  .tipicon{
    width: 25px;
    margin-right: 5px;
    display: inline-block;
    vertical-align: middle;
  }
  .box{
    height:20px;
    width:280px;
    // margin:10px 8px;
    display: inline-block;
    overflow: hidden;
    vertical-align: middle;
  }
  .run{
    transition: all 1s;
    margin-top: -20px;
  }
  .box li{
    list-style: none;
    line-height: 20px;
    height: 20px;
    &:hover{
      color:#F56C6C;
      cursor:pointer;
    }
  }
  .lianBox{
    .txt1{
      font-family:'PingFangSC-Regular', 'PingFang SC';
      font-weight:400;
      font-size:16px;
      line-height:24px;
      margin:0
    }
    .txt2{
      color:#FF0000;
    }
    .txt3{
      color:#666666;
      font-size:14px;
      line-height:20px;
      margin:0
    }
  }
</style>

<script>
  import qian from './components/qian'
  import bao from './components/bao'
  import personal from './components/personal'
  export default {
    components: { qian, bao, personal },
    data() {
      return {
        animate: false,
        lianShow: false,
        chaoShow: false,
        qianShow: false,
        baoShow: false,
        personalShow: false,
        tipsMsg: [
          { name: '廉政通道上线了', fn: 'lianShow' },
          { name: '超卖规则已上线，请仔细阅读哦', fn: 'chaoShow' },
          { name: '前台协议更新，详情请点击', fn: 'qianShow' },
          { name: '保证金以及管理费规则更新，详情请点击', fn: 'baoShow' },
          { name: '爱上街个人店铺保证金说明', fn: 'personalShow' },
          { name: '廉政通道上线了', fn: 'lianShow' },
          { name: '超卖规则已上线，请仔细阅读哦', fn: 'chaoShow' },
          { name: '前台协议更新，详情请点击', fn: 'qianShow' },
          { name: '保证金以及管理费规则更新，详情请点击', fn: 'baoShow' },
          { name: '爱上街个人店铺保证金说明', fn: 'personalShow' }
        ]
      }
    },
    created() {
      setInterval(this.scroll, 4000)
    },
    methods: {
      showFn(val) {
        this[val] = true
      },
      sendMail(sb) {
        location.href = 'mailto:ceo@ishangjie.com?subject=' + sb
      // location="mailto:821855466@qq.com?subject="+sb;
      },
      scroll() {
        this.animate = true // 因为在消息向上滚动的时候需要添加css3过渡动画，所以这里需要设置true
        setTimeout(() => {
          this.tipsMsg.push(this.tipsMsg[0]) // 将数组的第一个元素添加到数组的
          this.tipsMsg.shift() // 删除数组的第一个元素
          this.animate = false // margin-top 为0 的时候取消过渡动画，实现无缝滚动
        }, 1000)
      }
    }
  }

</script>
