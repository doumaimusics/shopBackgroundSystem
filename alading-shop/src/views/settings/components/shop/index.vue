<template>
  <el-form ref="form" :model="form" :rules="rules" label-width="80px">
    <el-form-item prop="shopName" label="店铺名称" style="width:500px">
        <el-input maxlength="16" v-model="form.shopName"></el-input>
    </el-form-item>

    <el-form-item label="店铺logo">
      <el-upload  
        class="avatar-uploader"
        action="/shop/upload/uploadFile"
        :on-success="handleAvatarSuccess"
        :before-upload ="beforeAvatarUpload"
        :show-file-list="false"
        >
        <img v-if="form.icon" :src="form.icon" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-form-item>

    <el-form-item label="客服电话" style="width:500px">
        <el-input v-model="form.tele"></el-input>
    </el-form-item>

     <el-form-item label="退货地址" v-for="data of form.backAddress" :key="data.id">
        <el-input v-model="data.address" disabled class="backAddress">
          <el-button icon="el-icon-delete" slot="append" @click="rmAddress(data.id)"></el-button>
        </el-input>
        <el-switch
          v-model="data.isDefaultAddress"
          active-value="1"
          inactive-value="0"
          active-text="默认地址"
          active-color="#13ce66"
          inactive-color="#ff4949"
          @change="changeaddr(data.id)">
        </el-switch>
    </el-form-item>
    <el-button type="primary" v-if="!form.backAddress||form.backAddress.length<8" @click="showDialog=true">新增退货地址</el-button>
    <el-button type="primary" @click="showForDialog=true">修改登录密码</el-button>
    <el-button type="success" @click="onSubmit" :disabled="form.shopName ? (!form.shopName.length>0) : true">保存</el-button>

    <el-dialog title="找回密码" :visible.sync="showForDialog" v-if="showForDialog" append-to-body :close-on-click-modal="false" width="700px">
      <forget v-on:visible="close"></forget>
    </el-dialog>

     <el-dialog title="新增退货地址" :visible.sync="showDialog" append-to-body :close-on-click-modal="false" width="700px">
      <el-form :model="addAddr">
        <el-form-item label="收件人">
          <el-input v-model="addAddr.name"></el-input>
        </el-form-item>
        <el-form-item label="收件号码">
          <el-input v-model="addAddr.mobile"></el-input>
        </el-form-item>
        <el-form-item label="收件地址">
          <el-input v-model="addAddr.address"></el-input>
        </el-form-item>
        <el-button type="primary" @click="addAddrFn" :disabled="!addAddr.name || !addAddr.mobile || !addAddr.address">确定</el-button>
        <el-button @click="addAddr={};showDialog=false">取消</el-button>
      </el-form>
    </el-dialog>
    </el-form>
</template>

<script>
import { initData, updateData, addAddress, rmAddress, updateDefaltAddress } from '@/api/settings'
import forget from './forget'
// import { shopName } from '@/utils/validate'
import { Message } from 'element-ui'

export default {
  components: { forget },
  data() {
    var checkShopName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('店铺名称不能为空'))
      }
      if (!(/^[\<\>\_\[\]A-z0-9\u4e00-\u9fa5]+$/).test(value)) {
        return callback(new Error('店铺名称不能含有特殊符号'))
      }
      callback()
    }

    return {
      showDialog: false,
      form: {},
      addAddr: {},
      showForDialog: false,
      rules: {
        shopName: [{ required: true, trigger: 'blur', validator: checkShopName }]
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
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
    async init() {
      const self = this
      await initData().then(response => {
        // console.log(response.data)
        self.form = response.data
      })
    },
    async changeaddr(id) {
      await updateDefaltAddress({ addressId: id }).then(() => {
        this.init()
      })
    },
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const data = {
            shopName: this.form.shopName,
            icon: this.form.icon,
            customerTele: this.form.tele
          }
          updateData(data).then(() => {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
          })
        }
      })
    },
    handleAvatarSuccess(res) {
      if (res.code !== 1000) {
        this.$message({ type: 'error', message: res.msg })
        return
      }
      this.form.icon = res.url
    },
    async addAddrFn() {
      await addAddress(this.addAddr).then(() => {
        this.addAddr = {}
        this.showDialog = false
        this.init()
        this.$message({
          message: '创建成功',
          type: 'success'
        })
      })
    },
    async rmAddress(id) {
      this.$confirm('确定删除改地址?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        rmAddress({ id: id }).then(() => {
          this.init()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      }).catch(() => {})
    },
    close() {
      this.showForDialog = false
      this.init()
    }
  }
}
</script>

<style lang="scss" scoped>
  .avatar-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    height: 200px;
    width: 200px;
    background-color: #fff;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 200px;
    height: 200px;
    display: block;
  }
  .backAddress {
    width: 800px;

    /deep/ input[disabled="disabled"] {
      background-color: #fff;
    }
  }
</style>
