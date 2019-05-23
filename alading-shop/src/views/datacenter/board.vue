<template>
    <div class="databoard">
        <el-container>
            <el-main>
                <el-row class="imedata">
                    <el-col :span="12">实时数据</el-col>
                    <el-col :span="12" class="rightpos">截止今日当前</el-col>
                </el-row>
                <el-row type="flex">
                    <el-col>访客数</el-col>
                    <el-col>商品浏览量</el-col>
                    <el-col>下单数</el-col>
                    <el-col>支付订单数</el-col>
                    <el-col>支付金额</el-col>
                </el-row>
                <el-row type="flex">
                    <el-col>{{data.visitorCount}}</el-col>
                    <el-col>{{data.goodsViewCount}}</el-col>
                    <el-col>{{data.orderCount}}</el-col>
                    <el-col>{{data.orderPayCount}}</el-col>
                    <el-col>￥{{data.orderPayAmount}}</el-col>
                </el-row>
                <el-row type="flex" class="yestoday">
                    <el-col>{{data.preVisitorCount}}</el-col>
                    <el-col>{{data.preGoodsViewCount}}</el-col>
                    <el-col>{{data.preOrderCount}}</el-col>
                    <el-col>{{data.preOrderPayCount}}</el-col>
                    <el-col>￥{{data.preOrderPayAmount}}</el-col>
                </el-row>
                
            </el-main>
        </el-container>
        <traffic/>
        <transfer/>
    </div>
</template>
<script>
import traffic from './components/traffic.vue';
import transfer from './components/transfer.vue';
import { recentLiveData } from '@/api/dataCenter'
export default {
    components:{
        traffic,
        transfer
    },
    data(){
        return {
            data:''
        }
    },
    create(){

    },
    methods:{
        async initData(){
            await recentLiveData().then((res)=>{
                this.data=res.data
            })
        }
    }
}
</script>
<style lang="scss">
    .databoard{
        padding: 15px;
        .el-container{
            background: #ededed;
            margin-bottom: 20px;
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
            }
            .imedata{
                margin-bottom:30px;
            }
            .el-header{
                line-height: 60px;
            }
            .el-main{
                padding-top: 10px;
            }
        }
    }
</style>

