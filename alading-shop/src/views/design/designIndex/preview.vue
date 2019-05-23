<template>
  <div class="preview">
    <div class="back">
      <el-button type="primary" plain @click="goBack">返回</el-button>
    </div>
    <div class="template">
      <div class="header">
        <div class="header-top clearfix">
          <img class="goBack" src="https://f.51fanbei.com/h5/app/activity/2018/09/invite_left_a.png">
          <img class="img" src="https://img.51fanbei.com/h5/app/activity/2018/09/shop.png">
          <div class="shopTitle">
            <p class="name">我的店铺名称</p>
            <p class="msg">总商品0件</p>
          </div>
          <div class="btn">
            <img class="icon" src="https://f.51fanbei.com/h5/app/activity/2018/09/icon@2x.png">收藏
          </div>
        </div>
        <div class="togglePage">
          <div class="index active">店铺首页</div>
          <div class="goods">全部商品</div>
        </div>
      </div>
      <!-- 店铺模板 -->
      <div class="shopTemplate">
        <ul></ul>
      </div>
    </div>
  </div>
</template>

<script>
  import { getTemplDetail } from '@/api/design'

  export default {
    data() {
      return {
        id: '',
        data: []
      }
    },
    created() {
      this.getParams()
      this.getTemplInfo()
    },
    methods: {
      getParams() {
        this.id = this.$route.query.id
      },
      getTemplInfo() {
        const params = {
          id: this.id
        }
        getTemplDetail(params).then(res => {
          this.data = res.data
        })
      },
      goBack() {
        this.$router.history.go(-1)
      }
    }
  }
</script>

<style lang="less" scoped>
  @rem: 50;

  .preview {
    padding: 20px;
    position: relative;
  }


  .template {
    margin: 0 auto;
    width: 375px;
    border: 1px solid #ccc;
    height: 812px - 20;
    position: relative;
    padding-top: 10px;

    .header {
      height: 2.74px*@rem - 30;
      background: white;
      margin-bottom: 5px;
      
      .header-top {
        padding: .1px*@rem .4px*@rem .1px*@rem .7px*@rem;
      }
      .goBack {
        width: .14px*@rem;
        height: .29px*@rem;
        padding: 0.15px*@rem 0.2px*@rem;
        position: absolute;
        left: 0.15px*@rem;
        top: 0.1px*@rem + 10;
        box-sizing: content-box;
      }
      .img {
        width: 1.1px*@rem;
        height: 1.1px*@rem;
        border-radius: .08px*@rem;
        background: #f8f8f8;
        float: left;
        margin: 0 .21px*@rem;
        border: 1px solid #eeeeee;
      }
      .shopTitle {
        float: left;
        margin-top: .11px*@rem;
        .name {
          font-size: .3px*@rem;
          line-height: .45px*@rem;
          width: 3px*@rem;
          height: .45px*@rem;
          overflow: hidden;
          color: #2E2E2E;
        }
        .msg {
          font-size: .26px*@rem;
          color: #999;
        }
      }
      .btn {
        float: right;
        display: flex;
        width: 1.44px*@rem;
        height: .5px*@rem;
        line-height: .5px*@rem;
        margin-top: .28px*@rem;
        border: 1px solid #979797;
        border-radius: 1px*@rem;
        font-size: .24px*@rem;
        color: #2E2E2E;
        text-align: center;
        justify-content: center;
        align-items: center;
        .icon {
          width: .18px*@rem;
          height: .18px*@rem;
          margin-right: .1px*@rem;
        }
      }
      .togglePage {
        display: flex;
        &>div {
          flex: 1;
          height: .88px*@rem;
          line-height: .88px*@rem;
          color: #404040;
          text-align: center;
          font-size: .3px*@rem;
          &.active {
            color: #FF5252;
          }
        }
      }
    }

    .shopTemplate {
      height: 670px;
      overflow: auto;
      background-color: #f6f6f6;

      ul {
        padding-bottom: 10px;
        min-height: 100%;
        position: relative;
      }
      /deep/ li {
        height: 100px;
        line-height: 100px;
        text-align: center;
        padding: 10px 10px 0;
        display: flex;
        position: relative;

        > div {
          height: 100%;
          flex: 1;
          border: 1px solid #000;

          &:not(:first-child) {
            border-left: 1px solid #000;
          }
        }
        &.goodsSingle {
          height: 100px;
        }
        &.goodsDouble {
          height: 110px;
        }
        &.goodsThree {
          height: 120px;
        }
      }
    }
  }

  .saveBtn {
    position: absolute;
    right: 0;
    top: 20px;
    width: 180px;
  }
</style>
