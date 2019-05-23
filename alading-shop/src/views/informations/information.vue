<template>
    <div id="information">
        <div class="title">店铺信息</div>
        <information-content v-if="isShow == 0"></information-content>
        <information-faiure v-else-if="isShow == 1" @childFailure="childFailure"></information-faiure>
        <information-right v-else></information-right>

    </div>
</template>

<script>
import InformationContent from './components/informationContent'
import InformationFaiure from './components/informationFailure'
import InformationRight from './components/informationRight'
export default {
    data(){
        return {
           isShow:1
        }
    },
    methods: {
        // 查看大图
      checkBigImg(e) {
        this.bigImgSrc = e.target.getAttribute('src')
        this.bigImgStatus = true
      },
      childFailure(childValue) {
          this.isShow = childValue
      }
    },
    components:{
        InformationContent,
        InformationFaiure,
        InformationRight
    }
}
</script>

<style lang="scss" scoped>
    #information{
        padding: 24px;
        background: #F0F2F5;
        min-height: calc(100vh - 50px);
        .title{
            background: #fff;
            height: 55px;
            border-bottom:1px solid #E9E9E9; 
            padding-left: 32px;
            font-size:16px;
            font-family:PingFangSC-Medium;
            font-weight:500;
            color:rgba(0,0,0,0.85);
            line-height:55px;
        }
        
    }
</style>