<template>
  <div class="brand">
    <div class="newBtn" v-if="shopType!==0 && shopType!==1">
      <el-button type="primary" @click="addBrand">新增品牌</el-button>
    </div>

    <el-table :data="tableData" stripe>
      <el-table-column prop="trademrakRegistcode" label="商标注册号"></el-table-column>
      <el-table-column prop="name" label="商标名称"></el-table-column>
      <el-table-column prop="expiryDate" label="商标有效期"></el-table-column>
      <el-table-column prop="trademrakType" label="商标类型"></el-table-column>
      <el-table-column prop="authorizationDate" label="授权有效期"></el-table-column>
      <el-table-column prop="verifyStaus" label="审核状态"></el-table-column>
      <el-table-column prop="refuseReason" label="备注"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button 
            type="text" 
            @click="editBrand(scope.row.id)" 
            v-if="scope.row.isEdit"
          >编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog 
      :title="dialogTitle" 
      :visible.sync="dialogFormVisible" 
      :close-on-click-modal="false"
      class="brandDialog"
      width="750px"
    >
      <el-form :model="shopForm" ref="shopFormRef" class="shopForm">
          <el-form-item label="商标类型：" class="line">
            <el-radio-group v-model="shopForm.trademrakType">
              <el-radio :label="0">授权商标</el-radio>
              <el-radio :label="1">自有商标</el-radio>
            </el-radio-group>
          </el-form-item>

<!--         -->
          <el-form-item
            label="授权有效期："
            :prop="authorizationDate"
            :rules="newShopRule.checkAuthorizationPeriodDate" 
            class="line"
            v-show="shopForm.trademrakType===0"
          >
            <el-date-picker v-model="shopForm.authorizationDate" type="date" placeholder="授权有效期" class="inputBox">
            </el-date-picker>
          </el-form-item>


          <el-form-item
            label="商标注册号："
            prop="trademrakRegistcode"
            :rules="{ required: true, message: '商标注册号不能为空', trigger: 'blur' }"
            class="line"
           >
            <el-input v-model="shopForm.trademrakRegistcode" class="inputBox"></el-input>
          </el-form-item>

          <el-form-item
            label="商标名称："
            prop="brandId"
            :rules="{ required: true, message: '商标名称不能为空', trigger: 'blur' }"
            class="line"
          >
            <el-select v-model="shopForm.brandId" filterable>
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
            prop="trademrakRegistUrlList"
            :rules="newShopRule.checkTrademrakRegistUrl"
            class="line"
           >
            <el-upload
              ref="trademrakRegistUrlRef"
              class="avatar-uploader"
              action="/shop/upload/uploadFile"
              :limit="5"
              multiple
              :show-file-list="false"
              :on-exceed="handleExceed.bind(null, '商标注册证明', 5)"
              :on-success="trademrakRegistSuccess.bind(null, {'data':shopForm})"
              :before-upload="beforeAvatarUpload">
                <i class="el-icon-plus avatar-uploader-icon">
                  <span class="limit">最多5张</span>
                </i>
            </el-upload>
            <div class="avatar-img-box">
              <div
                v-for="(imgItem, imgIndex) in shopForm.trademrakRegistUrlList"
                :key="imgIndex"
                class="avatar-img-wrapper"
              >
                <img :src="imgItem" @click="checkBigImg($event)" class="avatar">
                <div class="imgDelete" @click="delTrademrakRegistImg(imgIndex)">
                  <i class="el-icon-delete"></i>
                </div>
              </div>
            </div>
          </el-form-item>

          <el-form-item label="商标有效期：" class="line">
            <el-radio-group v-model="shopForm.isLong">
              <el-radio :label="0">一定期限</el-radio>
              <el-radio :label="1">长期</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item 
            label="有效期至：" 
            prop="expiryDate"
            :rules="newShopRule.checkTrademrakRegistDate"
            class="line"
            v-show="shopForm.isLong===0"
          >
            <el-date-picker v-model="shopForm.expiryDate" type="date" placeholder="结束日期">
            </el-date-picker>
          </el-form-item>

          <el-form-item
            label="质检报告："
            class="line"
            prop="qualityReportUrlList"
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
              :on-success="qualityReportSuccess.bind(null, {'data':shopForm})"
              :before-upload="beforeAvatarUpload"
            >
              <i class="el-icon-plus avatar-uploader-icon">
                <span class="limit">最多9张</span>
              </i>
            </el-upload>
            <div class="avatar-img-box">
              <div
                v-for="(imgItem, imgIndex) in shopForm.qualityReportUrlList"
                :key="imgIndex"
                class="avatar-img-wrapper"
              >
                <img :src="imgItem" @click="checkBigImg($event)" class="avatar">
                <div class="imgDelete" @click="delQualityReportImg(imgIndex)">
                  <i class="el-icon-delete"></i>
                </div>
              </div>
            </div>
          </el-form-item>

          <el-form-item
            label="品牌授权证明："
            class="line"
            prop="brandAuthUrlList"
            :rules="newShopRule.checkBrandAuthUrl"
            v-if="shopForm.trademrakType==0"
          >
            <el-upload
              ref="brandAuthUrlListRef"
              class="avatar-uploader"
              action="/shop/upload/uploadFile"
              :limit="5"
              multiple
              :show-file-list="false"
              :on-exceed="handleExceed.bind(null, '品牌授权证明', 5)"
              :on-success="brandAuthSuccess.bind(null, {'data':shopForm})"
              :before-upload="beforeAvatarUpload"
            >
              <i class="el-icon-plus avatar-uploader-icon">
                <span class="limit">最多5张</span>
              </i>
            </el-upload>
            <div class="avatar-img-box">
              <div
                v-for="(imgItem, imgIndex) in shopForm.brandAuthUrlList"
                :key="imgIndex"
                class="avatar-img-wrapper"
              >
                <img :src="imgItem" @click="checkBigImg($event)" class="avatar">
                <div class="imgDelete" @click="delBrandAuthImg(imgIndex)">
                  <i class="el-icon-delete"></i>
                </div>
              </div>
            </div>
          </el-form-item>

          <el-form-item class="submit">
            <el-button type="primary" @click="submitForm">提交审核</el-button>
            <el-button type="default" @click="cancelForm">取消</el-button>
          </el-form-item>
      </el-form>

      <!--查看大图-->
      <el-dialog title="" :visible.sync="bigImgStatus" width="750px" append-to-body>
        <div class="bigImg"><img class="img" :src="bigImgSrc" alt=""></div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="bigImgStatus = false">关 闭</el-button>
        </span>
      </el-dialog>
    </el-dialog>
    
  </div>
</template>

<script>
  import { getShopTrademarkNameList, getShopBrandList, setShopBrandSubmit } from '@/api/settings.js'
  import { brandVerifyStatusTrans } from '@/filters/transform'

  export default {
    data() {
      return {
        tableData: [],
        originalData: [], // 未经处理的原始数据，用于编辑回显

        dialogFormVisible: false,
        dialogTitle: '新增品牌',
        bigImgStatus: false,
        bigImgSrc: '',
        id: '', // 编辑按钮获取的id

        trademrakNameList: [],

        shopForm: {
          trademrakType: 0,
          trademrakRegistcode: '',
          brandId: '',
          trademrakRegistUrlList: ['https://img.51fanbei.com/h5/app/activity/2018/09/trademrakRegist.jpg'],
          isLong: 0,
          expiryDate: '',
          qualityReportUrlList: [],
          brandAuthUrlList: [],
          authorizationDate: '',   // 授权有效期
        },
        newShopRule: {
          checkTrademrakRegistUrl: [{
            required: true,
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (value.length <= 0 || (value.length === 1 &&
                value[0] === 'https://img.51fanbei.com/h5/app/activity/2018/09/trademrakRegist.jpg')
              ) {
                callback(new Error('请上传图片'))
              } else {
                callback()
              }
            } }
          ],
          checkBrandAuthUrl: [{
            required: true,
            trigger: 'change',
            validator: (rule, value, callback) => {
              value = this.shopForm.brandAuthUrlList
              if (value.length <= 0) {
                callback(new Error('请上传图片'))
              }
              callback()
            }
          }],
          checkQualityReport: [{
            required: true,
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (value.length <= 0) {
                callback(new Error('请上传图片'))
              }
              callback()
            }
          }],
          checkTrademrakRegistDate: [{
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (this.shopForm.isLong === 0) {
                if (!value) {
                  return callback(new Error('请选择日期'))
                } else if (value.getTime() < new Date().getTime()) {
                  return callback(new Error('已过期'))
                }
              }
              callback()
            } }
          ],
          
          checkAuthorizationPeriodDate: [{
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (this.shopForm.trademrakType === 0) {
                if (!value) {
                  return callback(new Error('请选择日期'))
                } else if (value.getTime() < new Date().getTime()) {
                  return callback(new Error('已过期'))
                }
              }
              callback()
            } }
          ],
        },

        shopType: 0
      }
    },

    created() {
      this.getShopType()
      this.getBrandList()
      this.getTrademarkName()
    },

    methods: {
      // 获取店铺类型
      getShopType() {
        this.shopType = this.$store.getters.shopinfo.shopType
      },
      // 获取品牌列表
      getBrandList() {
        getShopBrandList().then(res => {
          console.log(res)
          const data = [...res.data]
          data.forEach(v => {
            if (v.verifyStaus !== 3) {
              v.refuseReason = ''
            } else {
              v.isEdit = true // 可编辑
            }
            v.verifyStaus = brandVerifyStatusTrans(v.verifyStaus)
            v.expiryDate = v.isLong ? '长期' : v.expiryDate.slice(0, 10)
            v.trademrakType = v.trademrakType ? '自有' : '授权'
            v.authorizationDate = "等接口返回"
          })
          this.tableData = data
          this.originalData = res.data
        })
      },
      // 获取商标名称列表
      getTrademarkName(arr) {
        getShopTrademarkNameList().then(res => {
          this.trademrakNameList = res.data
        })
      },
      // 提交表单
      submitForm() {
        this.$refs.shopFormRef.validate(valid => {
          if (valid) {
            const data = JSON.parse(JSON.stringify(this.shopForm))
            if (this.dialogTitle === '编辑品牌') {
              data.id = this.id
            }
            // 日期转换时间戳
            data.expiryDate = new Date(data.expiryDate).getTime()
            if (data.expiryDate) {
              data.expiryDate = new Date(data.expiryDate).getTime()
            }
            
            // 授权有效期日期转换时间戳
            data.authorizationDate = new Date(data.authorizationDate).getTime()
            if (data.authorizationDate) {
              data.authorizationDate = new Date(data.authorizationDate).getTime()
            }


            if (data.isLong === 1) {
              delete data.expiryDate
            }
            if(data.trademrakType === 1) {    // 删除授权有效期
              delete data.authorizationDate
            }
            const params = {
              trademrakList: JSON.stringify([data])
            }
            // ajax
            setShopBrandSubmit(params).then(res => {
              this.dialogFormVisible = false
              this.getBrandList()
              this.$message({ type: 'success', message: '提交成功' })
            })
          }
        })
      },
      // 取消表单
      cancelForm() {
        this.dialogFormVisible = false
      },
      resetForm() {
        this.shopForm = {
          trademrakType: 0,
          trademrakRegistcode: '',
          brandId: '',
          trademrakRegistUrlList: ['https://img.51fanbei.com/h5/app/activity/2018/09/trademrakRegist.jpg'],
          isLong: 0,
          qualityReportUrlList: [],
          brandAuthUrlList: []
        }
      },
      addBrand() {
        this.dialogTitle = '新增品牌'
        this.dialogFormVisible = true
        this.resetForm()
        this.$nextTick(() => {
          this.$refs.shopFormRef.clearValidate()
        })
      },
      editBrand(id) {
        this.dialogTitle = '编辑品牌'
        this.dialogFormVisible = true
        this.id = id
        this.resetForm()
        // 数据回显
        this.originalData.forEach((v, i) => {
          if (v.id === id) {
            v.brandId = v.brandId || ''
            this.shopForm = {
              trademrakType: v.trademrakType === '授权' ? 0 : 1,
              trademrakRegistcode: v.trademrakRegistcode,
              brandId: v.brandId,
              trademrakRegistUrlList: v.trademrakRegistUrl.split(','),
              isLong: v.isLong,
              expiryDate: v.isLong ? '' : new Date(v.expiryDate),
              qualityReportUrlList: v.qualityReportUrl.split(','),
              authorizationDate: v.trademrakType ? '' : new Date(v.authorizationDate)   // 授权有效期
            }
            if (v.brandAuthUrl) {
              this.shopForm.brandAuthUrlList = v.brandAuthUrl.split(',')
            } else {
              this.shopForm.brandAuthUrlList = []
            }
          }
        })
      },
      // 删除品牌授权证明已上传
      delBrandAuthImg(imgIndex) {
        this.$refs.brandAuthUrlListRef.uploadFiles.splice(imgIndex, 1)
        this.shopForm.brandAuthUrlList.splice(imgIndex, 1)
        this.bigImgSrc = new Date().getTime()
      },
      // 删除质检报告已上传
      delQualityReportImg(imgIndex) {
        this.$refs.qualityReportListRef.uploadFiles.splice(imgIndex, 1)
        this.shopForm.qualityReportUrlList.splice(imgIndex, 1)
      },
      // 删除商标注册证明已上传
      delTrademrakRegistImg(imgIndex) {
        this.$refs.trademrakRegistUrlRef.uploadFiles.splice(imgIndex, 1)
        this.shopForm.trademrakRegistUrlList.splice(imgIndex, 1)
      },
      // 品牌授权证明上传
      brandAuthSuccess(obj, res, file) {
        const newArr = [...this.shopForm.brandAuthUrlList]
        if (newArr.length >= 5) {
          this.$message({ type: 'error', message: '上传图片不能超过5张' })
          return
        }
        newArr.push(res.url)
        this.$set(this.shopForm, 'brandAuthUrlList', newArr)
        // 曲线方式解决编辑自有品牌时 切换到授权品牌后 上传品牌授权证明图片不显示的问题
        this.bigImgSrc = new Date().getTime()
      },
      // 质检报告上传
      qualityReportSuccess(obj, res, file) {
        const newArr = [...this.shopForm.qualityReportUrlList]
        if (newArr.length >= 9) {
          this.$message({ type: 'error', message: '上传图片不能超过9张' })
          return
        }
        newArr.push(res.url)
        this.$set(this.shopForm, 'qualityReportUrlList', newArr)
      },
      // 商标注册证明上传
      trademrakRegistSuccess(obj, res, file) {
        const newArr = [...this.shopForm.trademrakRegistUrlList]
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
        this.$set(this.shopForm, 'trademrakRegistUrlList', newArr)
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
      // 上传图片数量超限
      handleExceed(str, num) {
        this.$message({ type: 'error', message: (str + '最多上传' + num + '张') })
      },
      // 查看大图
      checkBigImg(e) {
        if (e.target.currentSrc) {
          this.bigImgStatus = true
          this.bigImgSrc = e.target.currentSrc
        } else {
          this.bigImgStatus = false
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .newBtn {
    padding-bottom: 20px;
  }

  .brandDialog {
    /deep/ .el-dialog {
      min-width: 700px;
      width: 55%;
    }
    /deep/ .el-dialog__body {
      padding-top: 0;
      padding-bottom: 1px;
    }
  }

  .shopForm {
    .line {
      /deep/ .el-form-item__error {
        left: 155px;
      }
      /deep/ .el-form-item__label {
        display: inline-block;
        width: 155px !important;
      }
    }
    .inputBox{
      display: inline-block;
      width: 40%;
    }
    .trademrakNameTip {
      color: #999;
      padding-left: 55px;
      font-size: 12px;
    }
    .avatar-uploader{
      display: inline-block;
      width: 80px;
      height: 80px;
      border: 1px dashed #d9d9d9;
      border-radius: 6px;

      /deep/ .el-upload {
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;

        &:hover {
          border-color: #409EFF;
        }
      }
      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 80px;
        height: 80px;
        line-height: 80px;
        text-align: center;
        position: relative;

        .limit {
          position: absolute;
          bottom: 5px;
          left: 0;
          display: inline-block;
          width: 100%;
          font-size: 12px;
          line-height: 14px;
        }
      }
    }
    .trademrakNameTip {
      color: #999;
      padding-left: 150px;
      font-size: 12px;
    }
    .submit {
      padding-left: 100px;
    }
    // 已上传图片列表容器
    .avatar-img-wrapper {
      display: inline-block;
      position: relative;
      width: 80px;
      height: 80px;

      .imgDelete {
        display: none;
      }
      &:hover {
        .imgDelete {
          display: block;
          position: absolute;
          right: 0;
          top: 0;
          background-color: rgba(0, 0, 0, .5);
          width: 20px;
          height: 20px;
          line-height: 20px;
          text-align: center;
          cursor: pointer;
      
          i {
            color: #fff;
            font-size: 16px;
          }
        }
      }
    }
    .avatar {
      width: 80px;
      height: 80px;
      display: inline-block;
    }
    // 多图上传照片墙样式
    .avatar-uploader {
      /deep/ .el-upload-list--picture {
        display: flex;
      }
    }
    .avatar-img-wrapper {
      margin-left: 3px;
    }

    .choose {
      margin-right: 50px;
    }
  }

  // 查看大图
  .bigImg{
    width:650px;
    margin: auto;
    text-align: center;
    &:before{
      content: "";
      display: inline-block;
      height: 100%;
      vertical-align: middle;
      width: 0;
    }
    .img {
      display: inline-block; 
      max-width: 650px; 
      height: 600px;
      vertical-align: middle;
    }
  }
  // 已上传的图片容器
  .avatar-img-box {
    display: inline-block;
    width: 450px;
    vertical-align: top;
  }
</style>