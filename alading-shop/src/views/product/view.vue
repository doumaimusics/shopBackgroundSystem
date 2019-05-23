<!--
    @author:liurong
    @date:2018-9-10
 -->
<template>
  <div class="previewscroll">
    <el-button @click="back" style="margin:30px;width:100px;">返回</el-button>
    <div class="kuang">
      <div class="previewPrd">
        <div class="">
          <el-row>
            <el-col class="goodsIcon" v-if="data.goodsPics">
              <el-carousel trigger="click" height="340px">
                <el-carousel-item v-for="item in data.goodsPics" :key="item">
                    <img :src="item"/>
                </el-carousel-item>
              </el-carousel>
              <!-- <img :src="data.goodsPics && data.goodsPics[0]"/> -->
            </el-col>
          </el-row>
          <el-row class="textContent">
            <span class="price">￥{{data.saleAmount}}</span>
            <span class="amount">已售:{{data.saleCount||0}}件</span>
            <el-row class="title">
              <el-col class="mainTitle">{{data.goodsName}}</el-col>
              <el-col>{{data.remark}}</el-col>
              <el-col>快递：{{data.freightPrice}}</el-col>
            </el-row>
          </el-row>
          <el-row class="sizebar">
            <el-col><div>规格数量选择</div></el-col>
          </el-row>
          <el-row>
            <el-col v-for="(item,index) in data.goodsDetail" :key="index">
              <img :src="item"/>
            </el-col>
          </el-row>
        </div>
      </div>
      <el-row>
        <el-col class="fixItem">
          <div>立即购买</div>
          <div>加购物车</div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  // import decimal from 'decimal.js'
  import { getQueryObject } from '@/utils/tools'
  import { getProductView } from '@/api/product'

  export default {
    data() {
      return {
        data: {}
      }
    },
    mounted() {
      const obj = getQueryObject()
      getProductView(obj.id).then((resp) => {
        this.data = resp.data
      })
    },
    methods: {
      back() {
        this.$router.go(-1)
      }
    }
  }
</script>

<style lang="scss">
.previewscroll{
    height:600px;
    .goodsIcon{
        height:340px;
    }
    .price{
        color:#f70b0b;
    }
    .sizebar{
        border: 10px solid #f3f0f0;
        border-left: 0;
        border-right: 0;
        line-height: 40px;
        text-indent: 10px;
        font-size: 14px;
    }
    .kuang{
        height:100%;
        border:5px solid #efefef;
        width:360px;
        margin:32px;
        box-sizing: border-box;
    }
    .previewPrd{
        width:100%;
        height:550px;
        overflow-y: scroll;
        img{
            height:100%;
            width: 100%;
        }
    }
    .fixItem{
        bottom:0;
        right:0;
        width:100%;
        height:40px;
        background: #fff;
        border-top:1px solid #ddd;
        div{
            float: right;
            line-height: 40px;
            background: #f5ebbf;
            padding: 0 10px;
            font-size: 14px;
            &:first-child{
                background: #f5ca0e;
            }
        }
    }
    .title{
        margin-top:10px;
        font-size: 14px;
        div{
            line-height: 24px;
            color:#999;
        }
        .mainTitle{
            font-weight: bold;
            color:#444;
        }
    }
    .textContent{
        padding: 14px 20px;
        border-top: 1px solid #ededed;
        .amount{
            float: right;
            color:#999;
            font-size: 14px;
        }
    }
    ::-webkit-scrollbar{
        width:1px;
        height:4px;
        background-color: #f5f5f5;
    }
    ::-webkit-scrollbar-track {
        background: #fff ;
    }
    ::-webkit-scrollbar-thumb {
        // border-radius: 3px;
        background-color:f5f5f5;
    }
    ::-webkit-scrollbar-thumb:hover {
        // border-radius: 3px;
        background-color:#e5e5e5;
    }
}
</style>
