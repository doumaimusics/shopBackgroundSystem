<template>
  <div class="shopCon">
    <h3 class="title" v-if="shopForm.shopType==0">爱上街旗舰店申请</h3>
    <h3 class="title" v-else-if="shopForm.shopType==1">爱上街专卖店申请</h3>
    <h3 class="title" v-else-if="shopForm.shopType==2">爱上街专营店申请</h3>
    <h3 class="title" v-else-if="shopForm.shopType==3">爱上街个人店申请</h3>
    <el-form :model="shopForm" status-icon :rules="shopRule" ref="shopForm" label-width="100px" class="shopForm">
      <!--个人-->
      <div v-if="shopForm.shopType==3">
        <el-form-item label="入驻人姓名：" prop="shopManagerName" class="line">
          <el-input type="text" v-model="shopForm.shopManagerName" auto-complete="off" class="inputBox"></el-input>
        </el-form-item>
        <el-form-item label="入驻人手机号：" prop="shopManagerMobile" class="line">
          <el-input type="text" maxLength="11" v-model="shopForm.shopManagerMobile" auto-complete="off" class="inputBox"></el-input>
        </el-form-item>
        <el-form-item label="入驻人身份证号：" prop="managerIdNumber" class="line">
          <el-input v-model="shopForm.managerIdNumber" type="text" maxLength="18" class="inputBox"></el-input>
        </el-form-item>
      </div>

      <!--企业-->
      <div v-else>
        <el-form-item label="店铺管理人姓名：" prop="shopManagerName" class="line">
          <el-input type="text" v-model="shopForm.shopManagerName" auto-complete="off" class="inputBox"></el-input>
        </el-form-item>
        <el-form-item label="店铺管理人手机号：" prop="shopManagerMobile" class="line">
          <el-input type="text" maxLength="11" v-model="shopForm.shopManagerMobile" auto-complete="off" class="inputBox"></el-input>
        </el-form-item>
        <el-form-item label="企业法人手机号：" prop="corporationMobile" class="line">
          <el-input type="text" v-model="shopForm.corporationMobile" maxLength="11" class="inputBox"></el-input>
        </el-form-item>
        <el-form-item label="企业法人姓名：" prop="corporationName" class="line">
          <el-input v-model="shopForm.corporationName" class="inputBox"></el-input>
        </el-form-item>
        <el-form-item label="企业法人身份证：" prop="managerIdNumber" class="line">
          <el-input v-model="shopForm.managerIdNumber" type="text" maxLength="18" class="inputBox"></el-input>
        </el-form-item>
      </div>

      <!-- 共有 -->
      <el-form-item label="法人身份证人像面：" prop="idFrontUrl" class="line">
        <el-upload
          class="avatar-uploader"
          action="/shop/upload/uploadFile"
          :show-file-list="false"
          :on-success="idFrontSuccess"
          :before-upload="beforeAvatarUpload">
          <i class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <img :src="shopForm.idFrontUrl" @click="checkBigImg($event)" class="avatar">
      </el-form-item>
      <el-form-item label="法人身份证国徽面：" prop="idBehindUrl" class="line">
        <el-upload
          class="avatar-uploader"
          action="/shop/upload/uploadFile"
          :show-file-list="false"
          :on-success="idBehindSuccess"
          :before-upload="beforeAvatarUpload">
          <i class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <img @click="checkBigImg($event)" :src="shopForm.idBehindUrl" class="avatar">
      </el-form-item>

      <!--个人-->
      <el-form-item label="手持身份证半身照：" prop="halfBodyUrl" class="line" v-if="shopForm.shopType==3">
        <el-upload
          class="avatar-uploader"
          action="/shop/upload/uploadFile"
          :show-file-list="false"
          :on-success="halfBodySuccess"
          :before-upload="beforeAvatarUpload">
          <i class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <img @click="checkBigImg($event)" :src="shopForm.halfBodyUrl" class="avatar">
      </el-form-item>

      <!-- 共有 -->
      <el-form-item label="主营类目：" prop="mainCategoryIdObj" class="line">
        <el-checkbox-group v-model="shopForm.mainCategoryIdObj" class="mainCategoryIdBox" :max="2">
          <el-checkbox
            v-for="(item,index) in this.goodItems"
            :key="index"
            :label="item.id"
            :disabled="shopForm.mainCategoryIdObj.indexOf(item.id)<0 && shopForm.mainCategoryIdObj.length>=2"
          >{{item.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <!-- 企业 -->
      <!-- <el-form-item
        :label="item.licenseName+'经营许可证：'"
        v-for="(item, index) in shopForm.licenseList"
        :key="index"
        :prop="'licenseList.' + index + '.licenseUrl'"
        :rules="[ { required: true, message: '请上传图片', trigger: 'change', validator: ''} ]"
        v-if="item.status"
        class="line">
        <el-upload
          class="avatar-uploader"
          action="/shop/upload/uploadFile"
          :show-file-list="false"
          :on-success="licenseSuccess.bind(null, {'index':index,'data':item})"
          :before-upload="beforeAvatarUpload">
          <i class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <img :src="item.licenseUrl" @click="checkBigImg($event)" class="avatar">
      </el-form-item> -->

      <!-- 共有 -->
      <el-form-item label="店铺名称：" prop="shopName" class="line">
        <el-input v-model="shopForm.shopName" class="inputBox"></el-input>
        <span v-if="shopForm.shopType==0">&nbsp;+&nbsp;旗舰店</span>
        <span v-else-if="shopForm.shopType==1">&nbsp;+&nbsp;专卖店</span>
        <span v-else-if="shopForm.shopType==2">&nbsp;+&nbsp;专营店</span>
        <span v-else></span>
      </el-form-item>

      <!--企业-->
      <div v-if="shopForm.shopType != 3">
        <el-form-item label="公司名称：" prop="companyName" class="line">
          <el-input v-model="shopForm.companyName" class="inputBox"></el-input>
        </el-form-item>
        <div class="addressSelect line">
          <el-form-item label="公司经营地址：" prop="provinceVal" class="addrline">
            <el-cascader
              :options="CityInfo"
              v-model="shopForm.addressInfo.selectedOptions"
              placeholder="请选择省/市/区"
              :change-on-select="true"
              :clearable="true"
              :filterable="true"
              @change="selectAddress(1)"
              class="inputBox"
            >
            </el-cascader>
          </el-form-item>
          <el-form-item prop="address">
            <el-input class="inputBox addMargin" v-model="shopForm.address" placeholder="请输入精确到门牌号的具体地址" clearable> ></el-input>
          </el-form-item>
        </div>
        <el-form-item label="统一社会信用代码：" prop="creditCode" class="line">
          <el-input v-model="shopForm.creditCode" class="inputBox"></el-input>
        </el-form-item>
      </div>

      <!-- 共有 -->
      <el-form-item label="售后地址：" prop="afterSaleVal" class="line">
            <el-cascader
              :options="CityInfo"
              v-model="shopForm.afterSaleInfo.selectedOptions"
              placeholder="请选择省/市/区"
              :change-on-select="true"
              :clearable="true"
              :filterable="true"
              @change="selectAddress(2)"
              class="inputBox"
            >
            </el-cascader>
      </el-form-item>
      <el-form-item prop="afterSaleAddress" class="afterSaleAddress">
            <el-input class="inputBox" v-model="shopForm.afterSaleAddress" placeholder="请输入精确到门牌号的具体地址" clearable> ></el-input>
      </el-form-item>

      <!-- 共有 -->
      <el-form-item label="营业执照：" prop="businessLicenseUrl" class="line">
        <el-upload
          class="avatar-uploader"
          action="/shop/upload/uploadFile"
          :show-file-list="false"
          :on-success="businessLicenseSuccess"
          :before-upload="beforeAvatarUpload">
          <i class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <img :src="shopForm.businessLicenseUrl" @click="checkBigImg($event)" class="avatar">
      </el-form-item>
      <el-form-item label="营业执照有效期：" class="line">
        <el-radio-group v-model="shopForm.isLong">
          <el-radio :label="0">一定期限</el-radio>
          <el-radio :label="1">长期</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="有效期至：" prop="expiryDate" class="line" v-show="shopForm.isLong===0">
        <el-date-picker
          v-model="shopForm.expiryDate"
          type="date"
          placeholder="结束日期"
          class="inputBox"
        ></el-date-picker>
      </el-form-item>

      <!-- 企业 -->
      <div v-if="shopForm.shopType!=3">
        <el-form-item label="开户许可证：" prop="openingPermitUtl" class="line">
          <el-upload
            class="avatar-uploader"
            action="/shop/upload/uploadFile"
            :show-file-list="false"
            :on-success="openingPermitSuccess"
            :before-upload="beforeAvatarUpload">
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <img :src="shopForm.openingPermitUtl" @click="checkBigImg($event)" class="avatar">
        </el-form-item>

        <div class="brandList" v-for="(item,index) in shopForm.trademrakList" :key="index">
          <em>商标 {{index+1}}</em>
          <el-form-item label="商标类型：" class="line">
            <el-radio-group v-model="item.trademrakType">
              <el-radio :label="0">授权商标</el-radio>
              <el-radio :label="1">自有商标</el-radio>
            </el-radio-group>
          </el-form-item>


          
          <el-form-item
            label="授权有效期："
            :prop="'trademrakList.' + index + '.authorizationDate'"
            :rules="newShopRule.checkAuthorizationPeriodDate"
            class="line"
            v-show="item.trademrakType===0"
          >
            <el-date-picker v-model="item.authorizationDate" type="date" placeholder="授权有效期" class="inputBox">
            </el-date-picker>
          </el-form-item>







          <el-form-item
            label="商标注册号："
            :prop="'trademrakList.' + index + '.trademrakRegistcode'"
            :rules="{ required: true, message: '商标注册号不能为空', trigger: 'blur' }"
            class="line">
            <el-input v-model="item.trademrakRegistcode" class="inputBox"></el-input>
          </el-form-item>
          <el-form-item
            label="商标名称："
            :prop="'trademrakList.' + index + '.brandId'"
            :rules="{ required: true, message: '商标名称不能为空', trigger: 'blur' }"
            class="line"
          >
            <el-select
              v-model="item.brandId"
              filterable clearable
              placeholder="请先选择主营类目"
              class="inputBox"
            >
              <el-option
                v-for="nameItem in trademrakNameList"
                :key="nameItem.id"
                :label="nameItem.name"
                :value="nameItem.id"
              ></el-option>
            </el-select>
            <p class="trademrakNameTip">如检索不到对应商标，请先联系招商人员提报商标</p>
          </el-form-item>
          <el-form-item
            label="商标注册证明："
            :prop="'trademrakList.' + index + '.trademrakRegistUrlList'"
            :rules="newShopRule.checkTrademrakRegistUrl"
            class="line">
            <el-upload
              ref="trademrakRegistUrlRef"
              class="avatar-uploader"
              action="/shop/upload/uploadFile"
              :limit="5"
              multiple
              :show-file-list="false"
              :on-exceed="handleExceed.bind(null, '商标注册证明', 5)"
              :on-success="trademrakRegistSuccess.bind(null, {'index':index,'data':item})"
              :before-upload="beforeAvatarUpload">
                <i class="el-icon-plus avatar-uploader-icon">
                  <span class="limit">最多5张</span>
                </i>
            </el-upload>
            <div class="avatar-img-box">
              <div
                v-for="(imgItem, imgIndex) in item.trademrakRegistUrlList"
                :key="imgIndex"
                class="avatar-img-wrapper"
              >
                <img :src="imgItem" @click="checkBigImg($event)" class="avatar">
                <div class="imgDelete" @click="delTrademrakRegistImg(index, imgIndex)">
                  <i class="el-icon-delete"></i>
                </div>
              </div>
            </div>
          </el-form-item>

          <el-form-item label="商标有效期：" class="line">
            <el-radio-group v-model="item.isLong">
              <el-radio :label="0">一定期限</el-radio>
              <el-radio :label="1">长期</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="有效期至："
            :prop="'trademrakList.' + index + '.expiryDate'"
            :rules="newShopRule.checkTrademrakRegistDate"
            class="line"
            v-show="item.isLong===0"
          >
            <el-date-picker v-model="item.expiryDate" type="date" placeholder="结束日期" class="inputBox">
            </el-date-picker>
          </el-form-item>

          <el-form-item
            label="质检报告："
            class="line"
            :prop="'trademrakList.' + index + '.qualityReportUrlList'"
            :rules="newShopRule.checkQualityReport"
          >
            <el-upload
              ref="qualityReportListRef"
              class="avatar-uploader"
              action="/shop/upload/uploadFile"
              :limit="9"
              multiple
              :show-file-list="false"
              :on-exceed="handleExceed.bind(null, '质检报告', 9)"
              :on-success="qualityReportSuccess.bind(null, {'index':index,'data':item})"
              :before-upload="beforeAvatarUpload"
            >
              <i class="el-icon-plus avatar-uploader-icon">
                <span class="limit">最多9张</span>
              </i>
            </el-upload>
            <div class="avatar-img-box">
              <div
                v-for="(imgItem, imgIndex) in item.qualityReportUrlList"
                :key="imgIndex"
                class="avatar-img-wrapper"
              >
                <img :src="imgItem" @click="checkBigImg($event)" class="avatar">
                <div class="imgDelete" @click="delQualityReportImg(index, imgIndex)">
                  <i class="el-icon-delete"></i>
                </div>
              </div>
            </div>

          </el-form-item>

          <el-form-item
            label="品牌授权证明："
            class="line"
            :prop="'trademrakList.' + index + '.brandAuthUrlList'"
            :rules="newShopRule.checkBrandAuthUrl"
            v-if="item.trademrakType==0"
          >
            <el-upload
              ref="brandAuthUrlListRef"
              class="avatar-uploader"
              action="/shop/upload/uploadFile"
              :limit="5"
              multiple
              :show-file-list="false"
              :on-exceed="handleExceed.bind(null, '品牌授权证明', 5)"
              :on-success="brandAuthSuccess.bind(null, {'index':index,'data':item})"
              :before-upload="beforeAvatarUpload"
            >
              <i class="el-icon-plus avatar-uploader-icon">
                <span class="limit">最多5张</span>
              </i>
            </el-upload>
            <div class="avatar-img-box">
              <div
                v-for="(imgItem, imgIndex) in item.brandAuthUrlList"
                :key="imgIndex"
                class="avatar-img-wrapper"
              >
                <img :src="imgItem" @click="checkBigImg($event)" class="avatar">
                <div class="imgDelete" @click="delBrandAuthImg(index, imgIndex)">
                  <i class="el-icon-delete"></i>
                </div>
              </div>
            </div>
          </el-form-item>

          <el-form-item class="line addBtn" v-if="shopForm.trademrakList.length!=1">
            <el-button @click.prevent="removeBrand(item)" type="primary" plain>删除</el-button>
          </el-form-item>
        </div>
        <!-- <el-form-item v-if="checkBrandsStatus">
          <div class="el-form-item__error">商标相关信息未填写完整</div>
        </el-form-item> -->
        <el-form-item v-if="shopForm.shopType==2" class="addBtn">
          <el-button @click="addBrand" type="primary" plain>添加更多商标</el-button>
        </el-form-item>
      </div>
      <el-form-item label="招商经理" prop="investManagerId" class="line">
          <el-select v-model="shopForm.investManagerId" class="inputBox" placeholder="请选择">
            <el-option
              v-for="item in investManagerList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

      <!-- 共有 -->
      <div class="mainGoodsList">
        <div class="title">
          <h4>主推商品</h4>
          <p class="tip">主推商品至少填写一项，最多三项；如有填写，需将该项填写完整</p>
        </div>
        <hr/>
        <div v-for="(item,index) in shopForm.mainGoodsList" :key="index" class="mainItem">
          <em>商品 {{index+1}}</em>
          <el-form-item label=""></el-form-item>
          <!-- 商品名称 -->
          <el-form-item
            class="line"
            label="商品名称："
            :prop="'mainGoodsList.' + index + '.mainGoodsName'"
            :rules="{ required: index===0, message: '商品名称不能为空', trigger: 'blur' }"
          >
            <el-input v-model="item.mainGoodsName" class="inputBox"></el-input>
          </el-form-item>
          <!-- 售价 -->
          <el-form-item
            class="line"
            label="售价："
            :prop="'mainGoodsList.' + index + '.mainGoodsSalePrice'"
            :rules="newShopRule.checkMainGoodsPrice"
          >
            <el-input v-model="item.mainGoodsSalePrice" class="inputBox" type="number"></el-input>
          </el-form-item>
          <!-- 商品图片 -->
          <el-form-item
            class="line"
            label="商品图片："
            :prop="'mainGoodsList.' + index + '.mainGoodsPictureUrl'"
            :rules="[{ required: index===0, message: '请上传图片', trigger: 'change', validator: ''}]"
          >
            <el-upload
              ref="mainGoodsUpload"
              class="avatar-uploader"
              action="/shop/upload/uploadFile"
              :show-file-list="false"
              :on-success="mainGoodsSuccess.bind(null, {'index':index,'data':item})"
              :before-upload="beforeAvatarUpload"
            ><i class="el-icon-plus avatar-uploader-icon"></i></el-upload>
            <div class="avatar-img-wrapper" v-show="!!item.mainGoodsPictureUrl">
              <img
                :src="item.mainGoodsPictureUrl"
                @click="checkBigImg($event)"
                class="avatar"
              >
              <div class="imgDelete" @click="delMainGoodsImg(index)"><i class="el-icon-delete"></i></div>
            </div>
          </el-form-item>
          <!-- 不完整提示信息 -->
          <el-form-item v-if="checkMainGoodsStatus.indexOf(index) >= 0" class="line">
            <div class="el-form-item__error">商品{{index+1}}的信息未补充完整</div>
          </el-form-item>
          <!-- 删除按钮 -->
          <el-form-item v-if="shopForm.mainGoodsList.length!=1" class="addBtn">
            <el-button @click.prevent="removeMainGoods(item)" type="primary" plain>删除</el-button>
          </el-form-item>
        </div>
        <!-- 添加更多 -->
        <el-form-item class="addBtn">
          <el-button
            @click.prevent="addMainGoods"
            v-if="shopForm.mainGoodsList.length<3"
            type="primary"
            plain
          >添加更多商品</el-button>
        </el-form-item>
      </div>
      <el-form-item label=" " prop="agreeStatus" class="agreeBox">
        <el-checkbox v-model="shopForm.agreeStatus"></el-checkbox>
        &nbsp;<span @click="openAgree">我已阅读并同意<a>《爱上街平台合作协议》</a></span>
      </el-form-item>
      <el-form-item class="btnBox">
        <el-button @click="backFormPop">返回</el-button>
        <el-button type="primary" @click="submitForm('shopForm')" :loading="oneClick">确认提交</el-button>
      </el-form-item>
      <!--协议-->
      <agreement :public-agree-statua="agreeStatua" @on-close="closeAgree"></agreement>
    </el-form>
    <!--离开提示-->
    <el-dialog
      title="提示"
      :visible.sync="$store.state.tagsView.curSatus"
      width="30%"
      :before-close="cancelBtn"
    >
      <span>是否确认退出？<br>退出后数据将清空不被保存</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelBtn">取 消</el-button>
        <el-button type="primary" @click="handleCloses()">确 定</el-button>
      </span>
    </el-dialog>
    <!--查看大图-->
    <el-dialog title="" :visible.sync="bigImgStatus" width="750px">
      <div class="bigImg"><img class="img" :src="bigImgSrc" alt=""></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="bigImgStatus = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import agreement from './agreement'
  import auditing from './auditing'
  import auditSuccess from './auditSuccess'
  import auditFail from './auditFail'
  import CityInfo from './area.js'
  import {
    initItems,
    applyShop,
    // licenseStatus,
    getShopInfo,
    getTrademarkNameList,
    getInvestManagerList
  } from '@/api/shopApply'

export default {
    components: { agreement, auditing, auditSuccess, auditFail },

    data() {
      var checkShopManagerName = (rule, value, callback) => {
        if (!value) {
          callback(new Error('店铺管理人姓名不能为空'))
        }
        callback()
      }
      var checkShopManagerMobile = (rule, value, callback) => {
        if (value === '') {
          return callback(new Error('店铺管理人手机号不能为空'))
        }
        if (value.length !== 11) {
          return callback(new Error('请输入11位的手机号码'))
        }
        if (!(/^1[3|4|5|6|7|8|9][0-9]{9}$/.test(value))) {
          return callback(new Error('请输入正确格式的手机号码'))
        }
        callback()
      }
      var checkCorporationMobile = (rule, value, callback) => {
        if (value === '') {
          return callback(new Error('企业法人手机号不能为空'))
        }
        if (value.length !== 11) {
          return callback(new Error('请输入11位的手机号码'))
        }
        if (!(/^1[3|4|5|6|7|8|9][0-9]{9}$/.test(value))) {
          return callback(new Error('请输入正确格式的手机号码'))
        }
        callback()
      }
      var checkcorporationName = (rule, value, callback) => {
        if (!value) {
          callback(new Error('企业法人姓名不能为空'))
        }
        callback()
      }
      var checkmanagerIdNumber = (rule, value, callback) => {
        if (!value) {
          callback(new Error('企业法人身份证不能为空'))
        }
        // 1.2版本修改，产品让修改成只要不为空就行
        // if (!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value))) {
        //   return callback(new Error('请输入正确格式的身份证号码'))
        // }
        callback()
      }
      var checkinvestManager = (rule, value, callback) => {
        if (!value) {
          callback(new Error('招商经理不能为空'))
        }
        callback()
      }
      var checkmainCategoryIdObj = (rule, value, callback) => {
        if (value.length === 0) {
          callback(new Error('至少选择一个主营类目'))
        }
        callback()
      }
      var checkShopName = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('店铺名称不能为空'))
        }
        if (!(/^[\<\>\_\[\]A-z0-9\u4e00-\u9fa5]+$/).test(value)) {
          return callback(new Error('店铺名称不能含有特殊符号'))
        }
        callback()
      }
      var checkCompanyName = (rule, value, callback) => {
        if (!value) {
          callback(new Error('公司名称不能为空'))
        }
        callback()
      }
      var checkAddress = (rule, value, callback) => {
        // 1.2版本产品让修改公司经营地址的校验规则，只要选择了省/市就可以提交，区可以不选择、为空；
        if (this.shopForm.addressInfo.selectedOptions.length < 2) {
          return callback(new Error('请选择省/市/区'))
        }
        if (!value) {
          return callback(new Error('请输入精确到门牌号的具体地址'))
        }
        return callback()
      }
      var checkCreditCode = (rule, value, callback) => {
        if (!value) {
          callback(new Error('统一社会信用代码不能为空'))
        }
        callback()
      }
      var checkAgreeStatus = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请选中《爱上街平台合作协议》'))
        }
        callback()
      }
      var checkExpiryDate = (rule, value, callback) => {
        // console.log(value);
        if (this.shopForm.isLong === 0) {
          if (!value) {
            return callback(new Error('请选择日期'))
          } else if (value.getTime() < new Date().getTime()) {
            return callback(new Error('已过期'))
          }
        }
        callback()
      }

      var checkafterSaleAddress = (rule, value, callback) => {
        // 1.2版本产品让修改公司经营地址的校验规则，只要选择了省/市就可以提交，区可以不选择、为空；
        if (this.shopForm.afterSaleInfo.selectedOptions.length < 2) {
          return callback(new Error('请选择省/市/区'))
        }
        if (!value) {
          return callback(new Error('请输入精确到门牌号的具体地址'))
        }
        return callback()
      }

      return {
        shopForm: {
          shopType: this.$route.query.type,
          shopManagerName: '',
          shopManagerMobile: '',
          corporationMobile: '',
          corporationName: '',
          managerIdNumber: '',
          idFrontUrl: 'https://img.51fanbei.com/h5/app/activity/2018/09/idFront.jpg',
          idBehindUrl: 'https://img.51fanbei.com/h5/app/activity/2018/09/idBehind.jpg',
          halfBodyUrl: 'https://img.51fanbei.com/h5/app/activity/2018/09/halfBody.jpg',
          businessLicenseUrl: 'https://img.51fanbei.com/h5/app/activity/2018/09/businessLicense.jpg',
          openingPermitUtl: 'https://img.51fanbei.com/h5/app/activity/2018/09/openingPermit.jpg',
          mainCategoryId: '',
          mainCategoryName: '',
          mainCategoryIdObj: [],
          mainCategoryNameObj: [],
          shopName: '',
          companyName: '',
          addressInfo: {   // 公司经营地址省市区
            city: '',
            erae: '',
            minerae: '',
            selectedOptions: []// 地区筛选数组
          },
          address: '',  // 公司经营地址详细地址
          companyAddress: '', // 公司经营地址拼接
          afterSaleInfo: {    // 售后地址 省市区
            city: '',
            erae: '',
            minerae: '',
            selectedOptions: []// 地区筛选数组
          },
          afterSaleAddress: '',  // 售后详细地址
          afterSaleAddressStr: '',   // 售后地址拼接字段
          creditCode: '',
          isLong: 0, // 营业执照有效期类型
          expiryDate: '', // 营业执照有效期
          brandType: '',
          brandNumber: '',
          trademrakList: [{
            trademrakType: 0,
            trademrakRegistcode: '',
            brandId: '',
            trademrakRegistUrlList: ['https://img.51fanbei.com/h5/app/activity/2018/09/trademrakRegist.jpg'],
            isLong: 0, // 商标注册证有效期类型
            expiryDate: '', // 商标注册证有效期
            brandAuthUrlList: [],
            qualityReportUrlList: [], // 质检报告
            time: new Date().getTime(),
            authorizationDate: '',  // 授权有效期
          }],
          /* licenseList: [
            { licenseName: '图书经营许可证', licenseUrl: '', categoryId: '', status: false },
            { licenseName: '食品经营许可证', licenseUrl: '', categoryId: '', status: false }
          ], */
          mainGoodsList: [{ // 主推商品列表数据
            mainGoodsName: '',
            mainGoodsSalePrice: '',
            mainGoodsPictureUrl: ''
          }],
          agreeStatus: true,
          // 新增招商经理字段
          investManagerId:'',
        },
        investManagerList: [], // 招商经理列表

        licenseNameList: ['食品酒水', '图书音像'], // 后端说写死
        CityInfo: CityInfo, // 省市区数据
        goodItems: [], // 主营类目
        shopRule: { // 验证规则
          shopManagerName: [
            { validator: checkShopManagerName, trigger: 'blur' }
          ],
          shopManagerMobile: [
            { validator: checkShopManagerMobile, trigger: 'blur' }
          ],
          corporationMobile: [
            { validator: checkCorporationMobile, trigger: 'blur' }
          ],
          corporationName: [
            { validator: checkcorporationName, trigger: 'blur' }
          ],
          managerIdNumber: [
            { validator: checkmanagerIdNumber, trigger: 'blur' }
          ],
          // 招商经理
          investManagerId: [
            { validator: checkinvestManager, trigger: 'blur' }
          ],
          mainCategoryIdObj: [
            { validator: checkmainCategoryIdObj, trigger: 'change' }
          ],
          shopName: [
            { validator: checkShopName, trigger: 'blur' }
          ],
          companyName: [
            { validator: checkCompanyName, trigger: 'blur' }
          ],
          address: [
            { validator: checkAddress, trigger: 'blur' }
          ],
          creditCode: [
            { validator: checkCreditCode, trigger: 'blur' }
          ],
          agreeStatus: [
            { validator: checkAgreeStatus, trigger: 'change' }
          ],
          idFrontUrl: [{ required: true, message: '请上传图片', trigger: 'change',
            validator: (rule, value, callback) => {
              if (value === 'https://img.51fanbei.com/h5/app/activity/2018/09/idFront.jpg') {
                callback(new Error('请上传图片'))
              } else {
                callback()
              }
            } }
          ],
          idBehindUrl: [{ required: true, message: '请上传图片', trigger: 'change',
            validator: (rule, value, callback) => {
              if (value === 'https://img.51fanbei.com/h5/app/activity/2018/09/idBehind.jpg') {
                callback(new Error('请上传图片'))
              } else {
                callback()
              }
            } }
          ],
          halfBodyUrl: [{ required: true, message: '请上传图片', trigger: 'change',
            validator: (rule, value, callback) => {
              if (value === 'https://img.51fanbei.com/h5/app/activity/2018/09/halfBody.jpg') {
                callback(new Error('请上传图片'))
              } else {
                callback()
              }
            } }
          ],
          businessLicenseUrl: [{ required: true, message: '请上传图片', trigger: 'change',
            validator: (rule, value, callback) => {
              if (value === 'https://img.51fanbei.com/h5/app/activity/2018/09/businessLicense.jpg') {
                callback(new Error('请上传图片'))
              } else {
                callback()
              }
            } }
          ],
          openingPermitUtl: [{ required: true, message: '请上传图片', trigger: 'change',
            validator: (rule, value, callback) => {
              if (value === 'https://img.51fanbei.com/h5/app/activity/2018/09/openingPermit.jpg') {
                callback(new Error('请上传图片'))
              } else {
                callback()
              }
            } }
          ],
          expiryDate: [{ validator: checkExpiryDate, trigger: 'change' }],
          afterSaleAddress: [
            { validator: checkafterSaleAddress, trigger: 'blur' }
          ],
        },
        newShopRule: {
          checkTrademrakRegistUrl: [{ required: true, message: '请上传图片', trigger: 'change',
            validator: (rule, value, callback) => {
              if (value.length === 0 &&
                value[0] === 'https://img.51fanbei.com/h5/app/activity/2018/09/trademrakRegist.jpg'
              ) {
                callback(new Error('请上传图片'))
              } else {
                callback()
              }
            } }
          ],
          checkBrandAuthUrl: [{
            required: true,
            message: '请上传图片',
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (value.length <= 0) {
                callback(new Error('请上传图片'))
              }
              callback()
            }
          }],
          checkQualityReport: [{
            required: true,
            message: '请上传图片',
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (value.length <= 0) {
                callback(new Error('请上传图片'))
              }
              callback()
            }
          }],
          checkTrademrakRegistDate: [{ trigger: 'change',
            validator: (rule, value, callback) => {
              // console.log(rule);
              const length = 'trademrakList.'.length
              const index = rule.field[length]

              if (this.shopForm.trademrakList[index].trademrakType === 0) {
                if (!value) {
                  return callback(new Error('请选择日期'))
                } else if (value.getTime() < new Date().getTime()) {
                  return callback(new Error('已过期'))
                }
              }
              callback()
            } }
          ],
          checkMainGoodsPrice: [{ trigger: 'blur',
            validator: (rule, value, callback) => {
              const length = 'mainGoodsList.'.length
              const index = rule.field[length]

              if (index === '0' && value === '') {
                return callback(new Error('售价不能为空'))
              } else if (value !== '') {
                if (value >= 1000000) {
                  return callback(new Error('售价须小于1000000'))
                } else if (!/^\d+(\.\d{1,2})?$/.test(value + '')) {
                  return callback(new Error('售价须大于0且最多两位小数'))
                }
              }
              callback()
            }
          }],
          checkAuthorizationPeriodDate: [{ trigger: 'change',
            validator: (rule, value, callback) => {
              // console.log(rule);
              const length = 'trademrakList.'.length
              const index = rule.field[length]

              if (this.shopForm.trademrakList[index].isLong === 0) {
                if (!value) {
                  return callback(new Error('请选择日期'))
                } else if (value.getTime() < new Date().getTime()) {
                  return callback(new Error('已过期'))
                }
              }
              callback()
            } }
          ]
        },
        agreeStatua: false, // 合作协议弹窗状态
        goWebStatus: false, // 是否要跳转页面
        bigImgStatus: false,
        checkBrandsStatus: false,
        bigImgSrc: '',
        toUrl: '',
        oneClick: false,
        checkMainGoodsStatus: [], // 主推商品信息完整性提示
        trademrakNameList: [], // 商标名称列表数据
        comboName: '', // 手机通讯,电脑平板,数码智能 三合一
        comboId: [42, 107, 114] // 三合一分别对应的id 线上
        // comboId: [42, 107, 124] // 三合一分别对应的id 测试
      }
    },

    created() {
      this.getCategoryData()
      this.recoverInfo()
      this.getInvestManagerList()
    },

    methods: {
      // 初始化主营类目
      getCategoryData() {
        const params = {
          shopStatus: parseInt(this.$route.query.type)
        }
        initItems(params).then(res => {
          // 手机通讯、电脑平板、数码智能 三合一
          /* res.data.forEach((v, i) => {
            if (this.comboId.indexOf(v.id) >= 0) {
              this.comboName += v.name + '，'
            }
          })
          this.comboName = this.comboName.slice(0, -1)
          res.data = res.data.filter((v, i) => {
            return this.comboId.indexOf(v.id) === -1
          })
          if (this.comboName !== '') {
            res.data.unshift({ id: this.comboId[0], name: this.comboName })
          } */
          this.goodItems = res.data
        })
      },
      // 获取招商经理信息
      getInvestManagerList() {
        getInvestManagerList().then(res => {
          // 
          this.investManagerList = res.data;
          console.log(this.investManagerList)
        })
      },
      // 提交表单
      submitForm(formName) {
        // console.log(this.shopForm);
        const self = this

        if (self.oneClick) {
          return false
        }

        self.$refs[formName].validate((valid) => {
          if (self.checkMainGoods()) {
            return
          }
          if (valid) {
            self.changeGoodItems()
            self.oneClick = true

            const params = JSON.parse(JSON.stringify(this.shopForm))
            // 公司地址拼接
            params.companyAddress = this.myAddressCity(params.addressInfo.city, this.CityInfo) +
              this.myAddressErae(params.addressInfo.erae, this.CityInfo) +
              this.myAddressMinerae(params.addressInfo.minerae, this.CityInfo) +
              params.address
            params.afterSaleAddressStr = this.myAddressCity(params.afterSaleInfo.city, this.CityInfo) +
              this.myAddressErae(params.afterSaleInfo.erae, this.CityInfo) +
              this.myAddressMinerae(params.afterSaleInfo.minerae, this.CityInfo) +
              params.afterSaleAddress
            // 日期转换时间戳
            params.expiryDate = new Date(params.expiryDate).getTime()
            params.trademrakList.forEach(v => {
              if (v.expiryDate) {
                v.expiryDate = new Date(v.expiryDate).getTime()
              }
              if(v.authorizationDate) {  // 授权有效期   
                 v.authorizationDate = new Date(v.authorizationDate).getTime()   
              }
            })
            // 删除无用字段
            delete params.mainCategoryIdObj
            delete params.mainCategoryNameObj
            delete params.address
            delete params.addressInfo
            if (params.isLong === 1) {
              delete params.expiryDate
            }
            params.trademrakList.forEach((v, i) => {
              if (v.isLong === 1) {
                delete v.expiryDate
              }
              if(v.trademrakType === 1) {  // 删除授权有效期
                 delete v.authorizationDate   
              }
            })
            // 数据转字符串
            params.trademrakList = JSON.stringify(params.trademrakList)
            // params.licenseList = JSON.stringify(params.licenseList)
            params.mainGoodsList = JSON.stringify(params.mainGoodsList)
            // 删除个人店铺无用字段
            if (params.shopType === '3') {
              delete params.corporationMobile
              delete params.corporationName
              delete params.openingPermitUtl
              delete params.companyName
              delete params.companyAddress
              delete params.creditCode
              delete params.brandType
              delete params.brandNumber
              delete params.trademrakList
              // delete params.licenseList
            }
            // ajax
            applyShop(params).then(res => {
              // self.$router.push({ name: 'auditing' })
              window.location.href = '/'
            }).catch(() => {
              self.oneClick = false
            })
          } else {
            return false
          }
        })
      },
      // 选择地址
      selectAddress(n) {    // n == 1 公司经营地址,  n==其他 售后地址
        if(n == 1) {
            this.shopForm.addressInfo.city = this.shopForm.addressInfo.selectedOptions[0]
            this.shopForm.addressInfo.erae = this.shopForm.addressInfo.selectedOptions[1]
            this.shopForm.addressInfo.minerae = this.shopForm.addressInfo.selectedOptions[2]
        }  else {
           this.shopForm.afterSaleInfo.city = this.shopForm.afterSaleInfo.selectedOptions[0]
           this.shopForm.afterSaleInfo.erae = this.shopForm.afterSaleInfo.selectedOptions[1]
           this.shopForm.afterSaleInfo.minerae = this.shopForm.afterSaleInfo.selectedOptions[2]
        }
        
      },
      // 省市区
      myAddressCity(value, addr) {
        let curCity = ''
        addr.forEach((item, y) => {
          if (item.value == value) {
            curCity = item.label
            return false
          }
        })
        return curCity
      },
      myAddressErae(value, addr) {
        let curErae = ''
        addr.forEach((item, y) => {
          item.children.forEach((childItem, z) => {
            if (childItem.value == value && value !== undefined) {
              curErae = childItem.label
              return false
            }
          })
        })
        return curErae
      },
      myAddressMinerae(value, addr) {
        let curMinerae = ''
        addr.forEach((item, y) => {
          item.children.forEach((childItem, z) => {
            childItem.children.forEach((childTwo, x) => {
              if (childTwo.value == value && value !== undefined) {
                curMinerae = childTwo.label
              }
            })
          })
        })
        return curMinerae
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      // 处理主营类目名字
      changeGoodItems() {
        this.shopForm.mainCategoryNameObj = []
        for (let j = 0; j < this.shopForm.mainCategoryIdObj.length; j++) {
          for (let i = 0; i < this.goodItems.length; i++) {
            if (this.goodItems[i].id == this.shopForm.mainCategoryIdObj[j]) {
              this.shopForm.mainCategoryNameObj.push(this.goodItems[i].name)
              let set = new Set(this.shopForm.mainCategoryNameObj)
              set = Array.from(set)
              this.shopForm.mainCategoryNameObj = set
            }
          }
        }
        // 判断是否选中了三合一类目
        /* if (this.shopForm.mainCategoryIdObj.indexOf(this.comboId[0]) > -1) {
          this.shopForm.mainCategoryIdObj.push(this.comboId[1])
          this.shopForm.mainCategoryIdObj.push(this.comboId[2])
          this.shopForm.mainCategoryNameObj.forEach((v, i) => {
            if (v === this.comboName) {
              this.shopForm.mainCategoryNameObj[i] = v.split('，').join()
            }
          })
        } */

        this.shopForm.mainCategoryName = this.shopForm.mainCategoryNameObj.join()
        this.shopForm.mainCategoryId = this.shopForm.mainCategoryIdObj.join()
      },
      // 统一上传图片函数
      beforeAvatarUpload(file) {
        const isJPG = file.type.includes('jpg')
        const isJPEG = file.type.includes('jpeg')
        const isPNG = file.type.includes('png')
        const isLt2M = file.size / 1024 / 1024 < 5
        if (!isJPG && !isJPEG && !isPNG) {
          this.$message.error('请上传jpg,png格式的图片')
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 5MB!')
        }
        // return isJPG && isLt2M ;
        return isLt2M && (isJPEG || isPNG || isJPG)
      },
      // 身份证图片上传
      idFrontSuccess(res, file) {
        this.shopForm.idFrontUrl = res.url
      },
      idBehindSuccess(res, file) {
        this.shopForm.idBehindUrl = res.url
      },
      halfBodySuccess(res, file) {
        this.shopForm.halfBodyUrl = res.url
      },
      // 营业执照
      businessLicenseSuccess(res, file) {
        this.shopForm.businessLicenseUrl = res.url
      },
      // 开户许可证
      openingPermitSuccess(res, file) {
        this.shopForm.openingPermitUtl = res.url
      },
      // 品牌授权证明
      brandAuthSuccess(obj, res, file) {
        var index = this.shopForm.trademrakList.indexOf(obj.data)
        const newArr = [...this.shopForm.trademrakList[index].brandAuthUrlList]
        if (newArr.length >= 5) {
          this.$message({ type: 'error', message: '上传图片不能超过5张' })
          return
        }
        newArr.push(res.url)
        this.$set(this.shopForm.trademrakList[index], 'brandAuthUrlList', newArr)
      },
      // 质检报告
      qualityReportSuccess(obj, res, file) {
        var index = this.shopForm.trademrakList.indexOf(obj.data)
        const newArr = [...this.shopForm.trademrakList[index].qualityReportUrlList]
        if (newArr.length >= 9) {
          this.$message({ type: 'error', message: '上传图片不能超过9张' })
          return
        }
        newArr.push(res.url)
        this.$set(this.shopForm.trademrakList[index], 'qualityReportUrlList', newArr)
      },
      // 商标注册证明
      trademrakRegistSuccess(obj, res, file) {
        var index = this.shopForm.trademrakList.indexOf(obj.data)
        const newArr = [...this.shopForm.trademrakList[index].trademrakRegistUrlList]
        if (newArr.length >= 5) {
          this.$message({ type: 'error', message: '上传图片不能超过5张' })
          return
        }
        newArr.push(res.url)
        newArr.forEach((v, i) => {
          if (v === 'https://img.51fanbei.com/h5/app/activity/2018/09/trademrakRegist.jpg') {
            newArr.splice(i, 1)
          }
        })
        this.$set(this.shopForm.trademrakList[index], 'trademrakRegistUrlList', newArr)
      },
      // 删除/增加商标
      removeBrand(item) {
        var index = this.shopForm.trademrakList.indexOf(item)
        if (index !== -1) {
          this.shopForm.trademrakList.splice(index, 1)
        }
      },
      addBrand() {
        this.shopForm.trademrakList.push({
          trademrakType: 0,
          trademrakRegistcode: '',
          brandId: '',
          trademrakRegistUrlList: ['https://img.51fanbei.com/h5/app/activity/2018/09/trademrakRegist.jpg'],
          isLong: 0,
          expiryDate: '',
          brandAuthUrlList: [],
          qualityReportUrlList: [],
          time: new Date().getTime(),
          authorizationDate: ''
        })
      },
      // 打开-关闭合作协议弹窗
      openAgree() {
        this.agreeStatua = true
      },
      closeAgree() {
        this.agreeStatua = false
      },
      isActive(route) {
        return route.path === this.$route.path
      },
      handleCloses() {
        this.$store.commit('CHANGE_CURVIEW', false)
        const a = this.$route
        this.$store.dispatch('delVisitedViews02', a).then((views) => {
          // const latestView = views.slice(-1)[0]

          // if (latestView) {
          //   if (this.$store.state.tagsView.curSatus) {
          //     return false
          //   }

          //   this.$router.push(latestView)
          // } else {
          //   this.$router.push('/')
          // }
          this.$router.push({
            name: 'applyIndex',
            query: { redirect: 1 }
          })
        })
      },
      cancelBtn() {
        this.$store.commit('CHANGE_CURVIEW', false)
      },
      backFormPop() {
        this.$store.commit('SURE_CURVIEW', true)
      },
      // 查看大图
      checkBigImg(e) {
        this.bigImgSrc = e.target.getAttribute('src')
        this.bigImgStatus = true
      },
      // 主推商品图片上传成功
      mainGoodsSuccess(obj, res, file) {
        var index = this.shopForm.mainGoodsList.indexOf(obj.data)
        this.$set(this.shopForm.mainGoodsList[index], 'mainGoodsPictureUrl', res.url)
      },
      // 删除主推商品项
      removeMainGoods(item) {
        var index = this.shopForm.mainGoodsList.indexOf(item)
        if (index !== -1) {
          this.shopForm.mainGoodsList.splice(index, 1)
        }
      },
      // 添加主推商品项
      addMainGoods() {
        this.shopForm.mainGoodsList.push(
          {
            mainGoodsName: '',
            mainGoodsSalePrice: '',
            mainGoodsPictureUrl: ''
          }
        )
      },
      // 校验主推商品完整性
      checkMainGoods() {
        this.checkMainGoodsStatus = []
        const arr = this.shopForm.mainGoodsList
        if (arr.length > 1) {
          arr.forEach((v, i) => {
            if (i > 0) {
              // console.log(arr[i].mainGoodsSalePrice);
              if (arr[i].mainGoodsName.trim() === '' &&
                String(arr[i].mainGoodsSalePrice).trim() === '' &&
                arr[i].mainGoodsPictureUrl.trim() === ''
              ) {
                return
              } else if (arr[i].mainGoodsName.trim() !== '' &&
                String(arr[i].mainGoodsSalePrice).trim() !== '' &&
                arr[i].mainGoodsPictureUrl.trim() !== ''
              ) {
                return
              } else {
                this.checkMainGoodsStatus.push(i)
              }
            }
          })
        }
        // if (this.checkMainGoodsStatus) {
        //   this.$message({ type: 'error', message: '主推商品项需填写完整' });
        // }
        return this.checkMainGoodsStatus.length > 0
      },
      // 上传图片数量超限
      handleExceed(str, num) {
        this.$message({ type: 'error', message: (str + '最多上传' + num + '张') })
      },
      // 删除品牌授权证明已上传
      delBrandAuthImg(index, imgIndex) {
        this.$refs.brandAuthUrlListRef[index].uploadFiles.splice(imgIndex, 1)
        this.shopForm.trademrakList[index].brandAuthUrlList.splice(imgIndex, 1)
      },
      // 删除质检报告已上传
      delQualityReportImg(index, imgIndex) {
        this.$refs.qualityReportListRef[index].uploadFiles.splice(imgIndex, 1)
        this.shopForm.trademrakList[index].qualityReportUrlList.splice(imgIndex, 1)
      },
      // 删除商标注册证明已上传
      delTrademrakRegistImg(index, imgIndex) {
        this.$refs.trademrakRegistUrlRef[index].uploadFiles.splice(imgIndex, 1)
        this.shopForm.trademrakList[index].trademrakRegistUrlList.splice(imgIndex, 1)
      },
      // 删除主推商品图片已上传
      delMainGoodsImg(index) {
        // this.$refs.mainGoodsUpload[index].uploadFiles.splice(index, 1);
        this.shopForm.mainGoodsList[index].mainGoodsPictureUrl = ''
      },
      // 恢复上次提交的信息
      recoverInfo() {
        getShopInfo().then(res => {
          if (res.data === '' ||
            JSON.stringify(res.data) === '{}' ||
            !res.data.shopInfo ||
            !res.data.otherShopInfo
          ) {
            return
          }
          if (res.data.shopInfo.shopType !== +this.$route.query.type) {
            return
          }
          // 数据直接赋值
          this.shopForm.shopManagerName = res.data.shopInfo.shopManagerName
          this.shopForm.shopManagerMobile = res.data.shopInfo.shopManagerMobile
          this.shopForm.managerIdNumber = res.data.shopInfo.managerIdNumber
          this.shopForm.corporationMobile = res.data.shopInfo.corporationMobile
          this.shopForm.corporationName = res.data.shopInfo.corporationName
          this.shopForm.idFrontUrl = res.data.shopInfo.idFrontUrl
          this.shopForm.idBehindUrl = res.data.shopInfo.idBehindUrl
          this.shopForm.halfBodyUrl = res.data.shopInfo.halfBodyUrl
          this.shopForm.shopName = res.data.shopInfo.shopName
          this.shopForm.companyName = res.data.shopInfo.companyName
          this.shopForm.creditCode = res.data.shopInfo.creditCode
          this.shopForm.businessLicenseUrl = res.data.shopInfo.businessLicenseUrl
          this.shopForm.isLong = res.data.shopInfo.isLong
          this.shopForm.openingPermitUtl = res.data.shopInfo.openingPermitUtl
          // 数据赋值兼处理
          this.shopForm.expiryDate = new Date(res.data.shopInfo.expiryDate)
          // 类目回显 暂时隐藏 (类目三合一待处理)
          // this.shopForm.mainCategoryIdObj = res.data.shopInfo.mainCategoryId.split(',');
          // this.shopForm.mainCategoryIdObj.forEach((v, i) => {
          //   this.shopForm.mainCategoryIdObj[i] = parseInt(v);
          // })
          if (res.data.otherShopInfo.storeMainGoods.length > 0) {
            this.shopForm.mainGoodsList = res.data.otherShopInfo.storeMainGoods
            this.shopForm.mainGoodsList.forEach((v, i) => {
              delete this.shopForm.mainGoodsList[i].id
            })
          }
          // 商标回显 暂时隐藏
          // this.shopForm.trademrakList = res.data.otherShopInfo.trademarkList;
          // this.shopForm.trademrakList.forEach((v, i) => {
          //   delete this.shopForm.trademrakList[i].id;
          //   delete this.shopForm.trademrakList[i].gmtCreate;
          //   delete this.shopForm.trademrakList[i].gmtModified;
          //   delete this.shopForm.trademrakList[i].shopId;
          //   this.shopForm.trademrakList[i].time = new Date().getTime();
          //   this.shopForm.trademrakList[i].brandAuthUrlList = this.shopForm.trademrakList[i].brandAuthUrl.split(',');
          // })
          // console.log(this.shopForm);
        })
      },
      // 获取商标名称列表
      getTrademarkName(arr) {
        const newArr = [...arr]
        // 数据重置
        this.shopForm.trademrakList.forEach((v, i) => {
          v.brandId = ''
        })
        this.trademrakNameList = []
        if (newArr.length <= 0) {
          return
        }
        // 判断是否选中了三合一类目
        /* if (newArr.indexOf(this.comboId[0]) > -1) {
          newArr.push(this.comboId[1])
          newArr.push(this.comboId[2])
        } */
        // 发送请求
        const params = {
          ids: newArr.join()
        }
        getTrademarkNameList(params).then(res => {
          this.trademrakNameList = res.data
        })
      }
      // 食品许可证数据  -- 食品和图书需判断有没有被认证
      /* filterLicense(value){
        this.shopForm.mainCategoryNameObj = []
        // this.shopForm.licenseList = []
        for(let j=0; j<value.length; j++){
          for(let i=0; i<this.goodItems.length; i++){
            if(this.goodItems[i].id==value[j]){
              this.shopForm.mainCategoryNameObj.push(this.goodItems[i].name)
              let set = new Set(this.shopForm.mainCategoryNameObj);
              set = Array.from(set);
              this.shopForm.mainCategoryNameObj = set
            }
          }
        }
        let index01 = this.shopForm.mainCategoryNameObj.indexOf('图书音像')
        let index02 = this.shopForm.mainCategoryNameObj.indexOf('食品酒水')

        if(index01!=-1) {
          let id = value[index01]
          licenseStatus({categoryId: id}).then(res => {
            this.$set(this.shopForm.licenseList[0],'status',!res.data)
            this.$set(this.shopForm.licenseList[0],'categoryId',id)
          })
        }else{
          this.$set(this.shopForm.licenseList[0],'status',false)
        }

        if(index02!=-1) {
          let id = value[index02]
          licenseStatus({categoryId: id}).then(res => {
            this.$set(this.shopForm.licenseList[1],'status',!res.data)
            this.$set(this.shopForm.licenseList[1],'categoryId',id)
          })
        }else{
          this.$set(this.shopForm.licenseList[1],'status',false)
        }
        // console.log(this.shopForm.licenseList)
      }, */
      // 食品经营许可证：
      /* licenseSuccess(obj, res, file) {
        var index = this.shopForm.licenseList.indexOf(obj.data)
        this.$set(this.shopForm.licenseList[index], 'licenseUrl', res.url)
      }, */

    },

    watch: {
      mainCatIdObj() {
        // console.log(this.mainCatIdObj);
        if (this.shopForm.shopType === '3') {
          return
        }
        this.getTrademarkName(this.mainCatIdObj)
      }
    },

    computed: {
      mainCatIdObj() {
        return this.shopForm.mainCategoryIdObj
      }
    },

    // 进入
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        vm.toUrl = to
        vm.$store.commit('ADD_CURVIEW', to)
        // 自动填写手机号
        vm.shopForm.shopManagerMobile = vm.$store.getters.userDo.username
        if (from.query.redirect || to.query.redirect) {
          return false
        }
        const shopStatus = vm.$store.getters.shopinfo.verify
        if (!shopStatus) {
          return
        }
        // 路由重定向
        if (shopStatus === 2) { // 已提交，待审核
          vm.$router.push({ name: 'auditing' })
        } else if (shopStatus === 4) { // 审核成功
          vm.$router.push({ name: 'auditSuccess' })
        } else if (shopStatus === 3) { // 审核失败
          vm.$router.push({ name: 'auditFail' })
        }
      })
    }

  }
</script>

<style lang="less" scoped>
  @import './shop.less';
</style>
