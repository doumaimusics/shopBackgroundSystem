<template>
    <div class="content_box">
        <div class="content">
            <ul>
                <li><span>店铺类型：</span>{{shopInformData.shopType}}</li>
                <li><span>店铺管理人手机号：</span>{{shopInformData.shopManagerMobile}}</li>
                <li><span>企业法人手机号：</span>{{shopInformData.corporateMobile}}</li>
                <li>
                    <span>法人身份证人像面：</span>
                    <div class="img_box" >
                        <img @click="checkBigImg($event)" :src="shopInformData.idFrontUrl" alt="">
                    </div>
                </li>
                <li>
                    <span>主营类目：</span>
                    <ul class="category_box">
                         <li class="item_text" v-for="item in shopInformData.categoryData" :key="item.id">{{item.name}}</li>   
                    </ul>
                </li>
                <li><span>公司名称：</span>{{shopInformData.companyName}}</li>
                <li><span>售后地址：</span>{{shopInformData.afterAaleAddress}}</li>
                <li>
                    <span>营业执照：</span>
                    <div class="img_box">
                        <img @click="checkBigImg($event)" :src="shopInformData.businessLicenseUrl" alt="">
                    </div>
                </li>
                <li><span>商标类型：</span>{{shopInformData.trademarkType}}</li>
                <li>
                    <span>商标注册证明：</span>
                    <div class="img_box">
                        <img @click="checkBigImg($event)" :src="shopInformData.trademarkUrl" alt="">
                    </div>
                </li>
                <li>
                    <span>品牌授权证明：</span>
                    <div class="img_box">
                        <img @click="checkBigImg($event)" :src="shopInformData.brandUrl" alt="">
                    </div>
                </li>
                <li><span>招商经理：</span>{{shopInformData.investManagerId}}</li>
            </ul>
            
        </div>
        <div class="content">
            <ul>
                <li><span>店铺管理人姓名：</span>{{shopInformData.shopManagerName}}</li>
                <li><span>企业法人姓名：</span>{{shopInformData.corporateName}}</li>
                <li><span>企业法人身份证：</span></li>
                <li>
                    <span>法人身份证国徽面：</span>
                    <div class="img_box">
                        <img @click="checkBigImg($event)" :src="shopInformData.idBehindUrl" alt="">
                    </div>
                </li>
                <li><span>店铺名称：</span>{{shopInformData.shopName}}</li>
                <li><span>公司经营地址：</span>{{shopInformData.companyAddress}}</li>
                <li><span>统一社会信用代码：</span>{{shopInformData.creditCode}}</li>
                <li>
                    <span>开户许可证：</span>
                    <div class="img_box">
                        <img @click="checkBigImg($event)" :src="shopInformData.openingPermitUrl" alt="">
                    </div>
                </li>
                <li><span>商标注册号：</span>{{shopInformData.trademarkNumber}}</li>
                <li class="mb"><span>品牌有效期：</span>{{shopInformData.brandTime}}</li>
                <li class="mb"><span>授权有效期：</span>{{shopInformData.authorizationTime}}</li>
            </ul>
            
            <el-button type="primary" class="btn" @click="goEdit">编辑</el-button>
        </div>

        <!--查看大图-->
        <el-dialog title="" :visible.sync="bigImgStatus" width="750px">
            <div class="bigImg"><img class="img" :src="bigImgSrc" alt=""></div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="bigImgStatus = false">关闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return {
            shopInformData:{
               shopType: '',   // 店铺类型
               shopManagerName: '',  // 店铺管理人姓名
               shopManagerMobile: '',  // 店铺管理人手机号码
               corporateName: '',  // 企业法人姓名
               corporateMobile: '',  // 企业法人电话
               managerIdNumber: '',  // 企业法人省份证号码
               idFrontUrl: 'https://aliyunsso.edspay.com/web/about/new_certificate9.jpg',  // 企业法人身份证正面照片
               idBehindUrl: 'https://aliyunsso.edspay.com/web/about/new_certificate9.jpg',  // 企业法人省份证背面照片
               categoryData: [
                   { id:1, name:'手机' },
                   { id:2, name:'食品' },
               ],  // 主营类目
               shopName: '',  // 店铺名字
               companyName: '',  // 公司名称
               companyAddress: '',  // 公司经营地址
               afterAaleAddress: '',  // 售后地址
               creditCode: '',  // 统一信息代码
               businessLicenseUrl: 'https://aliyunsso.edspay.com/web/about/new_certificate9.jpg',  // 营业执照图片
               openingPermitUrl: 'https://aliyunsso.edspay.com/web/about/new_certificate9.jpg',  // 开户许可证
               trademarkType: '',  // 商标类型
               trademarkNumber: '',  // 商标注册号
               trademarkUrl: 'https://aliyunsso.edspay.com/web/about/new_certificate9.jpg',   // 商标注册证明图片
               brandTime: '',  // 品牌有效期
               brandUrl: 'https://aliyunsso.edspay.com/web/about/new_certificate9.jpg',  // 品牌授权证明图片
               authorizationTime: '',  // 授权有效期
               investManagerId: '',  // 招商经理
            },

            bigImgSrc: '',  // 点击查看的图片链接

            bigImgStatus:false  // 查看图片控制
        }
    },
    
    methods: {
        // 查看大图
        checkBigImg(e) {
            this.bigImgSrc = e.target.getAttribute('src')
            this.bigImgStatus = true
        },
        goEdit(){    // 跳转编辑页面
            this.$router.push({
                path: '/informationEdit'
            })
        },
    },
}
</script>

<style lang="scss" scoped>
    .content_box{
        width: 100%;
        min-height: calc(100vh - 50px);
        background: #fff;
        padding-top: 24px;
        display: flex;
        // justify-content: space-around;
        .content{
            width: 50%;
            li{
                color: #000000;
                font-size:16px;
                font-family:PingFangSC-Regular;
                font-weight:400;
                color:rgba(0,0,0,0.85);
                line-height:22px;
                margin-bottom: 32px;
                display: flex;

                span{
                    width: 200px;
                    text-align: right;
                }
                .category_box{
                    display: flex;
                    .item_text{
                        // width: 72px;
                        padding: 0  8px;
                        height: 24px;
                        border: 1px solid #D9D9D9;
                        border-radius: 4px;
                        background: #eee;
                        font-size: 14px;
                        text-align: center;
                        line-height: 24px;
                        color:rgba(0,0,0,0.65);
                        margin-right: 8px;
                    }
                }
                
                .img_box{
                    width: 104px;
                    height: 104px;
                    border-radius: 4px;
                    padding: 8px;
                    box-sizing: border-box;
                    border: 1px solid rgba(0,0,0,0.15);
                    img{
                        width: 100%;
                        height: 100%;
                    }
                }
            }
            li.mb{
                margin-bottom: 64px;
            }
            .btn{
                margin-left: 100px;
            }
        }
        .bigImg{
            width:650px;
            height: 600px;
            margin: auto;
            text-align: center;
            &:before{
            content: "";display: inline-block;height: 100%;vertical-align: middle;width: 0;
            }
            .img{
            display: inline-block; max-width: 650px; height: 600px;vertical-align: middle;
            }
        }
    }
</style>