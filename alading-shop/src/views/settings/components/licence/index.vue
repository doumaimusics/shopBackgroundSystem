<template>
  <div>
    <div class="section">
      <p class="title">食品经营许可证</p>

      <el-upload v-if="!data.foodtips||data.foodtips==='审核失败'||data.foodtips==='已上传,待提交审核'"              
        class="avatar-uploader-licence"
        action="/shop/upload/uploadFile"
        :on-success="handleAvatarSuccess.bind(null,'food')"
        :before-upload ="beforeAvatarUpload"
      >
        <img v-if="foodurl" :src="foodurl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-licence-icon"></i>
      </el-upload>
      
      <p class="tip" v-if="!!data.foodtips">{{data.foodtips}}</p>
      <p class="reason" v-if="data.foodtips==='审核失败'">未通过原因：{{data.foodRefuseReason}}</p>

      <el-button v-if="data.foodtips==='已上传,待提交审核'" type="primary" @click="submit('food')">提交审核</el-button>
    </div>

    <!-- <div class="section">
      <p class="title">图书经营许可证</p>
      <p>{{data.booktips}}</p>
      <p class="reason" v-if="data.booktips=='审核失败'">未通过原因:{{data.bookRefuseReason}}</p>
      <el-upload v-if="!data.booktips||data.booktips=='审核失败'||data.booktips=='已上传,待提交审核'"  style="width:360px"
          class="avatar-uploader-licence"
          action="/shop/upload/uploadFile"
          :on-success="handleAvatarSuccess.bind(null,'book')"
          :before-upload ="beforeAvatarUpload"

          >
          <img v-if="bookurl" :src="bookurl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-licence-icon"></i>
        </el-upload>
        <el-button v-if="data.booktips=='已上传,待提交审核'" @click="submit('book')">提交审核</el-button>
    </div> -->
  </div>
</template>

<script>
  import { saveLicense, goLicensePage, submitLicense } from '@/api/settings'
  import { Message } from 'element-ui'

  export default {
    data() {
      return {
        foodurl: '',
        bookurl: '',
        data: {},
        showForDialog: false
      }
    },
    created() {
      this.init()
    },
    methods: {
      async handleAvatarSuccess(type, val) {
        const data = {}
        if (type === 'book') {
          data.licenseName = '图书经营许可证'
          data.categoryId = this.data.bookCategoryId
        } else {
          data.licenseName = '食品经营许可证'
          data.categoryId = this.data.foodCategoryId
        }
        data.licenseUrl = val.url

        await saveLicense(data).then((res) => {
          this.$message({
            message: '上传成功',
            type: 'success'
          })
          this.init()
        })
      },
      init() {
        goLicensePage().then((res) => {
          this.data = res.data
        // console.log(res);
        })
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type.includes('jpg')
        const isJPEG = file.type.includes('jpeg')
        const isPNG = file.type.includes('png')
        // const isLt2M = file.size / 1024  < 300;
        const isLt2M = file.size / 1024 < 5120
        if (!isJPG && !isJPEG && !isPNG) {
          Message.error('请上传jpg,png格式的图片')
        }
        if (!isLt2M) {
          // Message.error('上传图片大小不能超过 300kb!');
          Message.error('上传图片大小不能超过5Mb!')
        }
        return isLt2M && (isJPEG || isPNG || isJPG)
      },
      async submit(type) {
        const data = {}
        if (type === 'book') {
          data.categoryId = this.data.bookCategoryId
        } else {
          data.categoryId = this.data.foodCategoryId
        }
        await submitLicense(data).then((res) => {
          this.$message({
            message: '提交审核成功',
            type: 'success'
          })
          this.init()
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .section{
    width:400px;
    padding:20px;
    // border-radius: 10px;
    background: white;
    float:left;
    margin-right:30px;
    text-align: center;
    min-height: 300px;
  }
  .title{
    font-size: 20px;
    padding: 20px 0;
  }
  .avatar-uploader-licence {
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 180px;
    margin: 0 auto;

    .el-upload:hover {
      border-color: #409EFF;
    }
  }
  .avatar-uploader-licence-icon {
    border: 1px dashed #d9d9d9;
    font-size: 28px;
    color: #8c939d;
    width: 180px;
    height: 180px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 360px;
    height: 200px;
    display: block;
  }
  .reason{
    font-size: 16px;
    color: #666;
  }
  .tip {
    padding: 30px 0;
    color: #666;
    font-size: 16px;
  }
</style>
