<template>
    <div id="editPage">
       <div class="title">店铺信息</div>

       <!-- 表单 -->  
       <div class="form_box">
            <el-form :model="shopForm" label-position="right" status-icon class="shopForm" :rules="shopRule" ref="shopForm" label-width="150px">

                <el-form-item label="店铺类型：" prop="shopType">
                    <el-input class="input_box" :disabled="true" v-model="shopForm.shopType"></el-input>
                </el-form-item>

                <el-form-item label="店铺管理人姓名：" prop="shopManagerName">
                    <el-input class="input_box" type="text" auto-complete="off" v-model="shopForm.shopManagerName"></el-input>
                </el-form-item>

                <el-form-item label="店铺管理人手机号：" prop="shopManagerMobile">
                    <el-input class="input_box" type="text" auto-complete="off" v-model="shopForm.shopManagerMobile" ></el-input>
                </el-form-item>

                <el-form-item label="企业法人姓名：" prop="corporateName">
                    <el-input class="input_box" type="text" auto-complete="off" v-model="shopForm.corporateName"></el-input>
                </el-form-item>

                <el-form-item label="企业法人手机号：" prop="corporateMobile">
                    <el-input class="input_box" type="text" auto-complete="off" v-model="shopForm.corporateMobile"></el-input>
                </el-form-item>

                <el-form-item label="企业法人身份证：" prop="managerIdNumber">
                    <el-input class="input_box" type="text" auto-complete="off" v-model="shopForm.managerIdNumber"></el-input>
                </el-form-item>

                <el-form-item label="法人身份证人像面：" class="uploader_box" prop="idFrontUrl">
                    <el-upload
                    class="avatar-uploader"
                    action="/shop/upload/uploadFile"
                    :show-file-list="false"
                    :on-success="idFrontSuccess"
                    :before-upload="beforeAvatarUpload"
                    v-if="isShowUpload == 1">
                    <i class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <div class="img_box" v-else>
                        <img :src="shopForm.idFrontUrl" alt="">
                        <div class="del_btn" @click="closeImg(1)"></div>
                    </div>
                </el-form-item>

                <el-form-item label="法人身份证国徽面：" class="uploader_box" prop="idBehindUrl">
                    <el-upload 
                    class="avatar-uploader"
                    action="/shop/upload/uploadFile"
                    :show-file-list="false"
                    :on-success="idBehindSuccess"
                    :before-upload="beforeAvatarUpload"
                    v-if="isShowUpload == 2">
                    <i class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <div class="img_box" v-else>
                        <img :src="shopForm.idBehindUrl" alt="">
                        <div class="del_btn" @click="closeImg(2)"></div>
                    </div>
                </el-form-item>

                <el-form-item label="主营类目：">
                    <el-select placeholder="请选择" v-model="shopForm.CategoryObj.category">
                        <el-option v-for="item in shopForm.CategoryObj.categoryData"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id"
                        >
                             <span>{{item.name}}</span>
                         </el-option>
                    </el-select>
                    <el-button type="primary" @click.native="addCategItem"  class="add_btn">添加</el-button>

                    <div class="tag_item">
                        <el-tag type="info"
                         closable :disable-transitions="false"
                         v-for="tag in shopForm.CategoryObj.dynamicTags" :key="tag.categId"
                         @close="handleClose(tag.categName)" class="tag_box">
                             {{tag.categName}}
                         </el-tag>
                    </div>
                </el-form-item>
                
                <el-form-item label="店铺名称：" prop="shopName">
                    <el-input class="input_box" type="text" auto-complete="off" v-model="shopForm.shopName"></el-input>
                </el-form-item>

                <el-form-item label="公司名称：" prop="companyName">
                    <el-input class="input_box" type="text" auto-complete="off" v-model="shopForm.companyName"></el-input>
                </el-form-item>
                
                <el-form-item label="公司经营地址：">
                    <el-select placeholder="请选择省"  v-model="shopForm.Select.province">
                        <el-option v-for="item in CityInfo"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"
                         @click.native="selectAddress(1,item)"
                         >
                            <span>{{item.label}}</span>
                        </el-option>
                    </el-select>
                    <el-select placeholder="请选择市" v-model="shopForm.Select.city">
                        <el-option v-for="item in shopForm.Select.cityData" 
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"
                         @click.native="selectAddress(2,item)">
                          <span>{{item.label}}</span>
                        </el-option>
                    </el-select>
                    <el-select placeholder="请选择区" v-model="shopForm.Select.area">
                        <el-option v-for="item in shopForm.Select.areaData"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
                            <span>{{item.label}}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="address">
                    <el-input class="input_box" type="text" auto-complete="off" v-model="shopForm.address" placeholder="请输入精确到门牌号的具体地址"></el-input>
                </el-form-item>

                <el-form-item label="统一社会信用代码：" prop="creditCode">
                    <el-input class="input_box" type="text" auto-complete="off" v-model="shopForm.creditCode"></el-input>
                </el-form-item>

                <el-form-item label="营业执照：" class="uploader_box" prop="businessLicenseUrl">
                    <el-upload
                    class="avatar-uploader"
                    action="/shop/upload/uploadFile"
                    :show-file-list="false"
                    :on-success="businessLicenseSuccess"
                    :before-upload="beforeAvatarUpload"
                    v-if="isShowUpload == 3">
                        <i class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <div class="img_box" v-else>
                        <img :src="shopForm.businessLicenseUrl" alt="">
                        <div class="del_btn" @click="closeImg(3)"></div>
                    </div>
                </el-form-item>

                <el-form-item label="开户许可证：" class="uploader_box" prop="openingPermit">
                    <el-upload
                    class="avatar-uploader"
                    action="/shop/upload/uploadFile"
                    :show-file-list="false"
                    :on-success="openingPermitSuccess"
                    :before-upload="beforeAvatarUpload"
                    v-if="isShowUpload == 4">
                        <i class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <div class="img_box" v-else>
                        <img :src="shopForm.openingPermitUrl" alt="">
                        <div class="del_btn" @click="closeImg(4)"></div>
                    </div>
                </el-form-item>

                <el-form-item label="招商经理：" prop="investManagerId">
                    <el-input class="input_box" type="text" :disabled="true" auto-complete="off" v-model="shopForm.inverstMangerId"></el-input>
                </el-form-item>
            </el-form>
       </div>
       

      <div class="btn_box">
        <el-button type="default"  class="btn" @click="goBack">取消</el-button>
        <el-button type="primary"  class="btn" @click="submission">提交</el-button>
      </div>
    </div>
</template>

<script>
import { Tag } from 'element-ui'
import { initItems, applyShop, getShopInfo, getTrademarkNameList, getInvestManagerList } from '@/api/shopApply'  // 
import CityInfo from '@/views/shopApply/area.js'   // 省市区数据

export default {
    data(){
        var checkShopManagerName = (rule, value, callback) => {  // 店铺管理人姓名验证规则
            if (!value) {
               callback(new Error('店铺管理人姓名不能为空'))
            }
            callback()
        }

        var checkShopMangerMobile = (rule, value, callback) => {  // 店铺管理人手机号验证规则
            if(value === '') {
                return callback(new Error('店铺管理人手机号不能为空'))
            }
            if(value.length !== 11) {
                return callback(new Error('请输入11位手机号码'))
            }
            if(!(/^1[3|4|5|6|7|8|9][0-9]{9}$/.test(value))) {
                return callback(new Error('请输入正确格式的手机号码'))
            }
            callback()
        }

        var checkCorporateName = (rule, value, callback) => {   // 企业法人姓名验证规则
            if(!value) {
                callback(new Error('企业法人姓名不能为空'))
            }
            callback()
        }

        var checkCorporateMobile = (rule, value, callback) => {  // 企业法人手机号验证规则
            if(value === '') {
               return callback(new Error('企业法人手机号不能为空'))
            }
            if(value.length !== 11){
              return callback(new Error('请输入11位的手机号码'))
            }
            if(!(/^1[3|4|5|6|7|8|9][0-9]{9}$/.test(value))) {
              return callback(new Error('请输入正确格式的手机号码'))
            }
            callback()
        }

        var checkmanagerIdNumber = (rule, value, callback) => {  // 企业法人身份证验证规则
            if(!value) {
                callback(new Error('企业法人身份证不能为空'))
            }
            // 1.2版本修改，产品需求成只要不为空就行
            // if(!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value))) {
            //     return callback(new Error('请输入正确格式的身份证号码'))
            // }
            callback()
        }

        var checkSopName = (rule, value, callback) => {  // 店铺名称验证规则
            if(!value) {
                return callback(new Error('店铺名称不能为空'))
            }
            if(!(/^[\<\>\_\[\]A-z0-9\u4e00-\u9fa5]+$/).test(value)) {
                return callback(new Error('店铺名称不能含有特殊符号'))
            }
            callback()
        }

        var checkCompanyName = (rule, value, callback) => {  // 公司名称验证规则
            if(!value) {
                callback(new Error('公司名称不能为空'))
            }
            callback()
        }

        var checkAddress = (rule, value, callback) => {    // 公司详细地址验证规则
            if(this.shopForm.Select.province == '') {
                 return callback(new Error('请选择省'))
            } 
            if( this.shopForm.Select.city == '' ) {
                 return callback(new Error('请选择市'))
            } 
            // 1.2版本产品需求公司经营地址的校验规则，只要选择了省/市就可以提交，区可以不选择、为空；
            // if(this.shopForm.Select.area == '') {
            //      return callback(new Error('请选择区'))
            // } 
            if (!value) {
               return callback(new Error('请输入精确到门牌号的具体地址'))
            }
            return callback()
        }

        var checkCreditCode = (rule, value, callback) => {  // 统一社会信用代码验证规则
            if(!value) {
                callback(new Error('统一社会信用代码不能为空'))
            }
            callback()
        }

        // var checkInvestManagerId = (rule, value, callback) => {  // 招商经理验证规则
        //     if(!value) {
        //         callback(new Error('招商经理不能为空'))
        //     }
        //     callback()
        // }



        return{
           shopForm:{    // 表单数据
                shopType: '',   // 店铺类型
                shopManagerName: '',   // 店铺管理人姓名
                shopManagerMobile: '',  // 店铺管理人手机号
                corporateName: '',   // 企业法人姓名
                corporateMobile: '',  // 企业法人手机号
                managerIdNumber: '',  // 企业法人身份证号码
                idFrontUrl: 'https://aliyunsso.edspay.com/web/about/new_certificate9.jpg',  // 企业法人省份证正面图片                 
                idBehindUrl: 'https://aliyunsso.edspay.com/web/about/new_certificate9.jpg',  // 企业法人省份证背面图片
                shopName: '',  // 店铺名称
                companyName: '', // 公司名称 
                creditCode: '',  // 统一社会信用代码
                businessLicenseUrl: 'https://aliyunsso.edspay.com/web/about/new_certificate9.jpg', // 营业执照图片 
                openingPermitUrl: 'https://aliyunsso.edspay.com/web/about/new_certificate9.jpg',  // 开户许可证图片
                investManagerId: '',  // 招商经理
                CategoryObj: {    // 类主营类目 参数
                    category:'',
                    categoryText:'',
                    categoryData:[],   // 主营类目数据
                    dynamicTags:[],   // 主营类名添加标签数据
                },
                Select: {   // 公司经营地址：参数
                    province:'',  // 省
                    city:'', // 市
                    area:'',  // 区/县
                    cityData: [], // 市数据
                    areaData: [],    // 区/县数据
                },
                address:'',   // 详细地址
           },

           CityInfo: CityInfo, // 省市区数据

           addressStr: '',  // 经营地址拼接结果

           isShowUpload: 0,  // 1：省份证正面，2：省份证反面，3：营业执照，4开户可证

           shopRule: {
               shopManagerName: [ { validator: checkShopManagerName, trigger: 'blur' } ],
               shopManagerMobile: [ {validator: checkShopMangerMobile, trigger: 'blur'} ],
               corporateName: [ {validator: checkCorporateName, trigger: 'blur'} ],
               corporateMobile: [ {validator: checkCorporateMobile, trigger: 'blur'} ],
               managerIdNumber: [ {validator: checkmanagerIdNumber, trigger: 'blur'} ],
               shopName: [ {validator: checkSopName, trigger: 'blur'} ],
               companyName: [ {validator: checkCompanyName, trigger: 'blur'} ],
               address: [ {validator: checkAddress, trigger: 'blur'} ],
               creditCode: [ {validator: checkCreditCode, trigger: 'blur'} ],
            //    investManagerId: [ {validator: checkInvestManagerId, trigger: 'blur'} ]
           },
           
        }
    },
    methods: {

        addressProvince(value,addr) {   // 选择省：参数value：省的值； addr：地址数据
             let curProvince = '';
             addr.forEach((item,index) => {
                if(item.value == value){
                    curProvince = item.label
                }
             })
             return curProvince;
        },

        addressCity(value,addr) { // 选择市：参数value：市的值； addr：地址数据
            let curCity = '';
            addr.forEach((item,index) => {
                item.children.forEach((childItem,index) => {
                    if(childItem.value == value && value !== undefined){
                         curCity = childItem.label;
                    }
                })
            })
            return curCity;
        },
        
        addressAreas(value,addr) {  // 选择区 || 县：参数value：区 || 县的值； addr：地址数据
            let curArea = '';
            addr.forEach((item,index) => {
                item.children.forEach((childItem,index) => {
                    childItem.children.forEach((grandsonItem,index) => {
                          if(grandsonItem.value == value && value !== undefined){
                               curArea = grandsonItem.label;
                          }
                    })
                })
            })
            return curArea;
        },

        addCateg(id,addr) {   // 主营类名筛选
           let categName = '', categId = null;
           addr.forEach((item, index) => {
               if(item.id == id) {
                   categName = item.name;
                   categId = item.id
               }
           })
           return {categName,categId};
        },

        isInarr(id,arr){   // 判断相同的类目名
            let idss = '';
            arr.forEach((item,index) => {
                if(item.categId == id) {
                    idss = item.id
                }
            }) 
            return idss
        },

        beforeAvatarUpload(file) {    // 上传图片方法
            const isJPG = file.type.includes('jpg');
            const isJPEG= file.type.includes('jpeg');
            const isPNG = file.type.includes('png');
            const isLt5M = file.size / 1024 / 1024 < 5;
            if(!isJPG && !isJPEG && !isPNG) {
               this.$message.error('请上传jpg,png格式图片')
            }
            if(!isLt5M) {
                this.$message.error('上传图片大小不能超过 5MB')
            }
            return isLt5M && (isJPG || isPNG || isJPEG)
        },
        
        idFrontSuccess(res, file) { // 身份证正面图片上传
            this.shopForm.idFrontUrl = res.url;
            this.isShowUpload = 0;
        },

        idBehindSuccess(res, file) { // 身份证背面图片上传
            this.shopForm.idBehindUrl = res.url;
            this.isShowUpload = 0;
        },

        businessLicenseSuccess(res, file) {   // 营业执照图片上传
            console.log(res,file)
            this.shopForm.businessLicenseUrl = res.url;
            this.isShowUpload = 0;
        },

        openingPermitSuccess(res, file) {   // 开户许可证图片上传
            this.shopForm.openingPermitUrl = res.url;
            this.isShowUpload = 0;  
        },

        closeImg(n){
            this.isShowUpload = n;
        },

        submission(){  // 提交
             this.addressStr = this.addressProvince(this.shopForm.Select.province, this.CityInfo) + 
             this.addressCity(this.shopForm.Select.city, this.CityInfo) + 
             this.addressAreas(this.shopForm.Select.area, this.CityInfo) + 
             this.shopForm.Select.address;
        },

        getCategoryData(){   // 获取主营类目数据
            initItems().then( res => {
                console.log(res)
                this.shopForm.CategoryObj.categoryData = res.data;
            })
        },

        addCategItem(){    // 添加自营类名
                let items = this.addCateg(this.shopForm.CategoryObj.category,this.shopForm.CategoryObj.categoryData);
                let isInArr = this.isInarr(this.shopForm.CategoryObj.category,this.shopForm.CategoryObj.dynamicTags)
                let lent = this.shopForm.CategoryObj.dynamicTags.length;
                if(this.shopForm.CategoryObj.category == '') {
                     this.$message({ message: '请选择自营类名', center: true, duration:1500 });
                } else if( lent >= 2 ) {
                     this.$message({ message: '最多选择两个主营类名', center: true, duration:1500 });
                     this.shopForm.CategoryObj.category = ''
                } else {
                    if(this.shopForm.CategoryObj.dynamicTags.length == 0){
                        this.shopForm.CategoryObj.dynamicTags.push(items);
                        this.shopForm.CategoryObj.category = ''   
                    } else {
                        if( isInArr === undefined) {
                            this.$message({ message: '不能选择相同类目', center: true, duration:1500 });
                            this.shopForm.CategoryObj.category = '' 
                        } else {
                            this.shopForm.CategoryObj.dynamicTags.push(items);
                            this.shopForm.CategoryObj.category = ''   
                        }
                    }
                    
                                   
                }
            
        },

        handleClose(tag){     // 删除主营类名标签
           this.shopForm.CategoryObj.dynamicTags.splice(this.shopForm.CategoryObj.dynamicTags.indexOf(tag),1)
        },

        selectAddress(i,item){   // 公司经营地址数据：参数i: 1点击省，2点击市；  item: 每个市和每个区的数据
            if(i == 1){          // i==1 点击了省
               this.shopForm.Select.city = '';  // 清空市
               this.shopForm.Select.area = '';  // 清空区和县
               this.shopForm.Select.cityData = item.children;  // 赋值市的数据
               console.log(this.shopForm.Select.cityData)
            } else if(i == 2){   // i==2 点击了市
               this.shopForm.Select.area = '';  // 清空区和县
               this.shopForm.Select.areaData = item.children;   // 赋值区和县的数据   
            }
            
        },

        goBack(){    // 返回上一页
            this.$router.go(-1)
        }
    },
    created() {
        this.getCategoryData();    // 获取主营类目
       
    },
}
</script>

<style lang="less" scoped>
    #editPage{
        background: #F0F2F5;
        padding: 24px;
        box-sizing: border-box;
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
        
        .form_box{
            background:#fff;
            margin-bottom: 24px;
            padding:20px  56px;
            .shopForm{
                // width: 900px;
                .input_box{
                   width:468px; 
                }
                .uploader_box{
                    position: relative;
                     .avatar-uploader{
                        width: 104px;
                        height: 104px;
                        border: 1px dashed #d9d9d9;
                        border-radius: 6px;
                        /deep/ .el-upload{
                            width: 100%;
                            height: 100%;
                        }
                        .avatar-uploader-icon {
                            font-size: 28px;
                            color: #8c939d;
                            width: 104px;
                            height: 104px;
                            line-height: 104px;
                            text-align: center;
                            position: relative;}
                    }
                    .img_box{
                        width: 104px;
                        height: 104px;
                        border:1px solid rgba(0,0,0,0.15);
                        border-radius: 4px;
                        padding: 8px;
                        position: relative;
                        z-index: 11;
                        img{
                            width: 100%;
                            height: 100%;
                        }
                        .del_btn{
                            width: 18px;
                            height: 18px;
                            background:#999999;
                            border-radius: 50%;
                            position: absolute;
                            top: -10px;
                            right: -10px;
                            cursor: pointer;
                        }
                    }
                }
                
                
            }
        }
        

        .btn_box{
            width: 100%;
            height: 56px;
            background: #fff;
            text-align: right;
            padding-top: 12px;
            .btn{
                width: 65px;
                height: 32px;
                line-height: 32px;
                padding: 0;

            }
        }
        .add_btn{
            margin-left: 8px;
        }
        .tag_item{
            margin-top: 12px;
            .tag_box{
                margin-right: 10px;
            }
        }
        
    }
</style>