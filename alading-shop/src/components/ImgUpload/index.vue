/**
 * Created by hanxueqiang on 2018/01/03
 *
 * 图片上传 公共组件
 * 默认盒子宽高为100px，可通过覆盖style样式调整大小
 */
<template>
  <div class="uploadWrapper">
    <el-upload
      ref="uploadRef"
      action="/shop/upload/uploadFile"
      :headers="headers"
      class="uploadBox"
      :class="{ single: isSingle }"
      :show-if-list="false"
      list-type="picture-card"
      :limit="limit"
      :multiple="!isSingle"
      :before-upload="beforeAvatarUpload"
      :on-success="successUpload"
      :on-remove="removeFile"
      :on-exceed="handleExceed"
    >
      <i class="el-icon-plus uploadIcon">
        <span class="limitTxt" v-if="limit && limit!==999 && !isSingle">最多{{limit}}张</span>
      </i>
    </el-upload>
  </div>
</template>

<script>
  import { getToken } from '@/utils/auth'
  import { validImgUpload } from '@/utils/validate'
  import { createUniqueString } from '@/utils/tools'

  export default {
    name: 'ImgUpload',

    props: {
      onSetData: { // 数据赋值函数（传参为图片链接数组）
        type: Function
      },
      backImages: { // 回显数据(图片url组成的数组)
        type: Array,
        default() { return [] }
      },
      limit: { // 限制上传的数量
        type: Number,
        default: 999
      },
      size: { // 限制上传图片的文件大小(kb)
        type: Number,
        default: 500
      },
      isSingle: { // 是否是 单图上传(已传图片和上传按钮重叠)
        type: Boolean,
        default: false
      },
      onSuccess: { // 上传成功后的回调
        type: Function,
        default() { return new Function() }
      },
      onRemove: { // 移除图片后的回调
        type: Function,
        default() { return new Function() }
      }
    },

    data() {
      return {
        headers: { token: getToken() },
        isFirstMount: true // 控制防止重复回显
      }
    },

    mounted() {
      if (this.backImages.length > 0) {
        this.setBackData()
      }
    },

    watch: {
      backImages(val, oldVal) {
        if (this.isFirstMount && val.length > 0) {
          this.setBackData()
        }
      }
    },

    methods: {
      // 上传开始前，校验文件格式尺寸
      beforeAvatarUpload(file) {
        this.isFirstMount = false
        return validImgUpload(file, this.size)
      },
      // 上传完
      successUpload(res, file, fileList) {
        if (res.code !== 1000) {
          this.$message({ type: 'error', message: res.msg })
          this.$refs.uploadRef.uploadFiles.pop()
          return
        }
        this.onSuccess(res)
        this.onSetData(this.getUploadedList())
      },
      // 移除
      removeFile(file, fileList) {
        this.onRemove(file)
        this.onSetData(this.getUploadedList())
      },
      // 超限
      handleExceed() {
        this.$message({ type: 'warning', message: `最多可上传${this.limit}个文件` })
      },
      // 获取已上传的数据（图片url组成的数组）
      getUploadedList() {
        return this.$refs.uploadRef.uploadFiles.map(v => {
          if (v.response) {
            return v.response.url
          } else {
            return v.url
          }
        })
      },
      // 回显数据
      setBackData() {
        this.backImages.forEach((v, i) => {
          this.$refs.uploadRef.uploadFiles.push({
            name: 'pic' + i,
            url: v,
            status: 'success',
            uid: createUniqueString()
          })
        })
        this.isFirstMount = false
      }
    }
  }
</script>

<style lang="scss" scoped>
  /deep/ .el-upload-list{
    /*min-height: 500px;*/
  }
  /deep/ .el-upload-list__item,
  /deep/ .el-upload--picture-card,
  /deep/ .single {
    width: 100px;
    height: 100px;
  }

  .single {
    overflow: hidden;
    position: relative;

    /deep/ .el-upload--picture-card {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 0;
    }
  }

  .uploadIcon {
    width: 100%;
    height: 100%;
    display: block;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    .limitTxt {
      position: absolute;
      bottom: 10%;
      left: 0;
      width: 100%;
      font-size: 14px;
      text-align: center;
    }
  }

  /deep/ .el-icon-close-tip {
    visibility: hidden;
  }

  /deep/ .el-upload-list--picture-card {
    position: relative;
    z-index: 1;
  }
</style>
