<template>
  <div class="addCoupon">
    <el-form :model="form" :rules="rules" ref="formRef">
      <el-form-item prop="name" label="规则名称：">
        <el-input v-model="form.name"></el-input>
      </el-form-item>

      <el-form-item prop="type" label="规则类型：">
        <el-select v-model="form.type" placeholder="请选择" @change="changeWord">
          <el-option
            v-for="item in typeData"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <div class="setFull">
        <el-form-item prop="threshold" class="full" label="">
          满 <el-input v-model="form.threshold"></el-input>
        </el-form-item>
        <el-form-item prop="discountAmount" class="reduce" label="">
          {{typeTxt.name}} <el-input v-model="form.discountAmount"></el-input> {{typeTxt.label}}
        </el-form-item>
      </div>

      <el-form-item prop="" label="活动状态：">
        <el-radio-group v-model="form.status">
          <el-radio label="O">开启</el-radio>
          <el-radio label="C">禁用</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 1.2产品让把活动icon隐藏，说有bug -->
      <!-- <el-form-item prop="icon" label="活动icon：">
        <el-upload  style="width:200px;background-color: #fff;"
          class="avatar-uploader"
          action="/shop/upload/uploadFile"
          :on-success="handleAvatarSuccess"
          :before-upload ="beforeAvatarUpload"
          :show-file-list="false"
        >
          <img v-if="form.icon" :src="form.icon" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <p>可自定义上传图片，图片尺寸为140*60，支持jpg/png格式</p>
      </el-form-item> -->

      <el-form-item prop="remark" label="规则说明：">
        <el-input placeholder="该规则展示于商品详情页" v-model="form.remark"></el-input>
      </el-form-item>

      <el-form-item prop="dateRange" label="生效时间：">
        <el-date-picker
          v-model="form.dateRange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>


      <el-form-item label="" class="btnBox">
        <el-button type="default" v-if="isAdd" @click="goBack">返回</el-button>
        <el-button type="primary" @click="addBtn">
          <span v-if="isAdd">新增商品</span>
          <span v-if="isEdit">管理商品</span>
        </el-button>
        <a class="fileBox" href="javascript:;">
          导入商品<input id="fileBtn" ref="fileBtn" name="file" type="file" @change="addExcel"/>
        </a>

        <a target="_blank" class="muban" href="http://f.51fanbei.com/test/6c0e6c7c8d72313f.xlsx">excel模板下载</a>
      </el-form-item>

      <!--选中的商品-->
      <GoodTable02 :id="id" :num="num"></GoodTable02>

      <el-form-item label="" v-if="isEdit" class="btnBox">
        <el-button type="default" @click="goBack()">返回</el-button>
        <el-button type="primary" @click="update">保存</el-button>
      </el-form-item>

    </el-form>

    <!--商品弹窗-->
    <GoodsSelect :isShow.sync="visible" :onSubmit="onAdd"></GoodsSelect>
  </div>
</template>

<script>
  import {
    addFullActivity,
    addFullGoods,
    editFullActivity,
    updateFullGoods
  } from '@/api/marketing'

  import { getToken } from '@/utils/auth'

  import axios from 'axios'

  import GoodsSelect from '@/components/GoodsSelect/index'
  import GoodTable02 from './CouponTable02'
  import { formatTimestamp } from '@/utils/tools'

  export default {
    components: { GoodsSelect, GoodTable02 },
    props: ['isAdd', 'isEdit'],
    data() {
      const that = this
      const validators = {
        validateAmount(rule, value, callback) {
          const reg = /^\d+(\.\d+)?$/
          if (value === '0' || !reg.test(value)) {
            return callback(new Error('请输入大于0的数字'))
          }
          callback()
        },
        validateLimitAmount(rule, value, callback) {
          const reg = /^\d+(\.\d+)?$/
          if (!reg.test(value)) {
            return callback(new Error('请输入大于或等于0的数字'))
          }
          callback()
        },
        validateDateRange(rule, value, callback) {
          if (that.form.expiryType === 'R') {
            if ((!value || value.length <= 0)) {
              return callback(new Error('请选择日期范围'))
            }
          }
          callback()
        },
        validateValidTime(rule, value, callback) {
          if (!value || value.length <= 0) {
            return callback(new Error('请选择日期范围'))
          }
          callback()
        },
        validateNum(rule, value, callback) {
          console.log(value + '--' + that.form.type)

          if (Number(value) === 0) {
            return callback(new Error('值不能为0'))
          }

          // 满？元 !(/^[1-9]{1,5}([.]{1}[0-9]{1,2})?$/.test(value))
          if (that.form.type === 'AMOUNT' || that.form.type === 'AMOUNTDISCOUNT' || that.form.type === 'AMOUNTCOUNT') {
            if (value < 0 || value >= 99999.99) {
              return callback(new Error('值不能大于99999.99且小于0'))
            }

            if (!/(^[0-9]+$)|(^[0-9]+[\.]{1}[0-9]{1,2}$)/.test(value)) {
              return callback(new Error('值可保留两位小数'))
            }
          }

          // 满?件
          if ((that.form.type === 'COUNT' || that.form.type === 'COUNTDISCOUNT' || that.form.type === 'COUNTAMOUNT') && !/^[1-9][0-9]{0,1}$/.test(value)) {
            return callback(new Error('值为不超过100的正整数'))
          }

          callback()
        },

        validateNum2(rule, value, callback) {
          console.log(that.form.type)

          if (Number(value) === 0) {
            return callback(new Error('值不能为0'))
          }

          // 减？元
          if (that.form.type === 'AMOUNT' || that.form.type === 'COUNT') {
            if (value < 0 || value >= 99999.99) {
              return callback(new Error('值不能大于99999.99且小于0'))
            }

            if (!/(^[0-9]+$)|(^[0-9]+[\.]{1}[0-9]{1,2}$)/.test(value)) {
              return callback(new Error('值可保留两位小数'))
            }
          }

          // 减?件
          if ((that.form.type === 'AMOUNTCOUNT' || that.form.type === 'COUNTAMOUNT') && !/^[1-9][0-9]{0,1}$/.test(value)) {
            return callback(new Error('值为不超过100的正整数'))
          }

          // 打?折 !/^((1\.[0-9]{1})|(([1-9]{1})(\.\d{1})?))$/.test(value)
          if ((that.form.type === 'AMOUNTDISCOUNT' || that.form.type === 'COUNTDISCOUNT') && (value <= 1 || value >= 10)) {
            return callback(new Error('值必须大于1小于10，可保留1位小数'))
          }

          //
          if ((that.form.type === 'AMOUNT' || that.form.type === 'COUNTAMOUNT') && Number(that.form.threshold) < Number(that.form.discountAmount)) {
            console.log(that.form.threshold + '-' + that.form.discountAmount + '--' + that.form.type)
            console.log(that.form.threshold < that.form.discountAmount)
            return callback(new Error('值需要小于满足的条件'))
          }

          callback()
        }
      }
      return {
        form: {
          id: '',
          name: '',
          type: 'AMOUNT',
          dateRange: [],
          start: '',
          end: '',
          remark: '',
          // icon: 'https://img.51fanbei.com/h5/app/activity/full.png',
          threshold: '', // 优惠条件，满一定金额或一定数量
          discountAmount: '', // 优惠金额,折扣，件数
          status: 'C', // 活动状态 O开启 C关闭
          discountType: 0 // 满减类型【0：普通满减；1：跨店铺满减】注：店铺只能创建普通满减 传0就可以    --- 写死0
        },
        useCaseSelect: [{ value: 1, label: '全场通用' }, { value: 2, label: '指定商品' }],
        visible: false,
        curGoodData: [],
        typeData: [
          { label: '满N元减M元', value: 'AMOUNT' },
          { label: '满N件减M元', value: 'COUNT' },
          { label: '满N元打M折', value: 'AMOUNTDISCOUNT' },
          { label: '满N件打M折', value: 'COUNTDISCOUNT' },
          { label: '满N元任选M件', value: 'AMOUNTCOUNT' },
          { label: '满N件减M件', value: 'COUNTAMOUNT' }
        ],
        rules: {
          name: [
            { required: true, message: '不能为空', trigger: 'blur' },
            { pattern: /^[\s\S]{1,30}$/, message: '名称不能超过30位', trigger: 'blur' }
          ],
          threshold: [
            { required: true, message: '不能为空', trigger: 'blur' },
            { validator: validators.validateNum, trigger: 'blur' }
          ],
          discountAmount: [
            { required: true, message: '不能为空', trigger: 'blur' },
            { validator: validators.validateNum2, trigger: 'blur' }
          ],
          useCase: [{ required: true, trigger: 'change' }],
          type: [{ required: true, message: '请选择', trigger: 'change' }],
          dateRange: [{ required: true, validator: validators.validateValidTime, trigger: 'change' }],
          remark: [
            { required: true, message: '规则说明不能空' },
            { pattern: /^[\s\S]{1,30}$/, message: '规则说明不能超过30位', trigger: 'blur' }
          ]
        },
        id: this.$route.params.id, // 活动id
        goodData: [],
        num: 0,
        btnLoading: false, // 控制正在上传时的按钮状态
        typeTxt: { name: '元减', label: '元' },
        GoodsSubmitStatus: true // 防止多次保存
      }
    },
    created() {
      if (this.isEdit) {
        this.getFullActivity()
      }
    },
    methods: {
      formatTimestamp,
      // 校验满减数值
      checkNum(obj, type) {
        if (isNaN(obj.target.value) || /^-$/.test(obj.target.value)) {
          if (type === 0) {
            this.form.threshold = ''
          } else {
            this.form.discountAmount = ''
          }
        }
        if (!/^[+-]?\d*\.{0,1}\d{0,1}$/.test(obj.target.value)) {
          if (type === 0) {
            this.form.threshold = obj.target.value.toString().match(/^\d+(?:\.\d{0,2})?/)
          } else {
            this.form.discountAmount = obj.target.value.toString().match(/^\d+(?:\.\d{0,2})?/)
          }
        }
      },
      // 导入excel请求的函数
      addExcelFn(param, config, resFull) {
        axios.post('/shop/discount/uploadGoodsIdList', param, config).then((res) => {
          if (res.data.code === 1000) {
            const result = res.data.data
            const errorNum = result.failGoodsList.join('，')
            this.$alert(`共 ${result.failCount + result.successCount} 条数据, 成功 ${result.successCount} 条, 失败 ${result.failCount} 条，其中失败的商品ID为：${errorNum}。`, '处理结果', {
              confirmButtonText: '确定',
              callback: action => {
                if (!this.isEdit) {
                  this.$router.push({ name: 'editFullActivity', params: { id: this.id || resFull.data.discountId }})
                } else {
                  this.num = new Date().getTime()
                }
              }
            })
            return false
          }
          this.$message.error(res.data.msg)
        })
        this.$refs.fileBtn.value = ''
      },
      addExcel(e) {
        this.form.start = formatTimestamp(this.form.dateRange[0])
        this.form.end = formatTimestamp(this.form.dateRange[1])

        const file = e.target.files[0]
        const param = new FormData() // 创建form对象

        param.append('fileGoodsId', file)// 通过append向form对象添加数据
        param.append('token', getToken())

        const config = {
          headers: {
            'Content-Type': 'multipart/form-data',
            'token': getToken()
          }
        }

        this.$refs.formRef.validate(valid => {
          if (!valid) { return false }
          if (this.isEdit) {
            param.append('discountId', this.id)
            this.addExcelFn(param, config)
          } else {
            addFullActivity(this.form).then((resFull) => {
              param.append('discountId', resFull.data.discountId)
              this.addExcelFn(param, config, resFull)
            })
          }
        })
      },
      goBack() {
        if (this.isEdit) {
          this.$router.push({ name: 'fullIndex' })
        } else {
          this.$router.history.go(-1)
        }
      },
      //
      addBtn() {
        this.$refs.formRef.validate(valid => {
          if (valid) {
            this.visible = true
          }
        })
      },
      // 新增活动
      onAdd(data) {
        if (!this.GoodsSubmitStatus) {
          this.GoodsSubmitStatus = true
        } else {
          this.GoodsSubmitStatus = false
        }
        this.form.start = formatTimestamp(this.form.dateRange[0])
        this.form.end = formatTimestamp(this.form.dateRange[1])
        if (!this.isEdit) {
          addFullActivity(this.form).then((res) => {
            this.addActivityGoods(data, res.data.discountId)
          })
          return false
        }

        // 编辑状态，只保存选中的商品
        this.addActivityGoods(data, this.id)
      },

      // 添加活动商品
      addActivityGoods(data, id) {
        console.log(id)

        const goodsIds = data.map(v => v.id)
        console.log(goodsIds.join())
        const params = {
          discountId: id,
          checkGoodsIds: goodsIds.join()
        }

        addFullGoods(params).then(res => {
          this.$message({ type: 'success', message: '活动商品添加成功' })
          if (!this.isEdit) {
            this.$router.push({ name: 'editFullActivity', params: { id }})
          } else {
            this.num = new Date().getTime()
          }
        }).catch(() => {
          this.loading = false
        })
      },

      // handleAvatarSuccess(val) {
      //   this.form.icon = val.url
      // },
      beforeAvatarUpload(file) {
        const isJPG = file.type.includes('jpg')
        const isJPEG = file.type.includes('jpeg')
        const isPNG = file.type.includes('png')
        // const isLt2M = file.size / 1024  < 300;
        const isLt2M = file.size / 1024 < 5120
        if (!isJPG && !isJPEG && !isPNG) {
          this.$message.error('请上传jpg,png格式的图片')
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过5Mb!')
        }
        return isLt2M && (isJPEG || isPNG || isJPG)
      },

      // 上传开始前
      beforeUpload() {
        this.btnLoading = true
        this.$message({ message: '上传处理中，请耐心等待...' })
      },
      // 上传成功后
      uploadSuccess(res) {
        this.btnLoading = false
        if (res.code === 1000) {
          this.$alert(res.data, '处理完成', {
            confirmButtonText: '确定',
            callback: action => {}
          })
          this.handleCurrentChange(1)
        } else {
          this.$message({ message: '上传处理错误，请重新尝试' })
        }
      },
      // 分页操作
      getCurGoodData(val) {
        const start = this.pageSize * (val - 1)
        const end = (start + this.pageSize - 1) > (this.goodData.length - 1) ? (this.goodData.length - 1) : (start + this.pageSize - 1)

        this.curGoodData = []

        for (let i = start; i <= end; i++) {
          this.curGoodData.push(this.goodData[i])
        }
      },

      // 编辑时：获取活动数据
      getFullActivity() {
        editFullActivity({ id: this.id }).then(res => {
          if (res.code === 1000) {
            this.form.id = res.data.id
            this.form.name = res.data.name
            this.form.type = res.data.type
            this.form.dateRange = [new Date(res.data.start), new Date(res.data.end)]
            this.form.remark = res.data.remark
            // this.form.icon = res.data.icon == null ? 'https://img.51fanbei.com/h5/app/activity/full.png' : res.data.icon
            this.form.threshold = res.data.threshold
            this.form.discountAmount = res.data.discountAmount
            this.form.status = res.data.status
            this.form.discountType = res.data.discountType
            this.form.end = formatTimestamp(res.data.end)
            this.form.start = formatTimestamp(res.data.start)

            this.changeWord(this.form.type)
          } else {
            this.$message.error(res.msg)
          }
        })
      },

      // 更新数据
      update() {
        this.$refs.formRef.validate(valid => {
          if (!valid) { return false }

          this.form.start = formatTimestamp(this.form.dateRange[0])
          this.form.end = formatTimestamp(this.form.dateRange[1])
          updateFullGoods(this.form).then((res) => {
            this.$message({ type: 'success', message: '保存成功' })
            this.$router.push({ name: 'fullIndex' })
          })
        })
      },

      //
      changeWord(val) {
        switch (val) {
          case 'AMOUNT':
            this.typeTxt.name = '元减'
            this.typeTxt.label = '元'
            break
          case 'COUNT':
            this.typeTxt.name = '件减'
            this.typeTxt.label = '元'
            break
          case 'AMOUNTDISCOUNT':
            this.typeTxt.name = '元打'
            this.typeTxt.label = '折'
            break
          case 'COUNTDISCOUNT':
            this.typeTxt.name = '件打'
            this.typeTxt.label = '折'
            break
          case 'AMOUNTCOUNT':
            this.typeTxt.name = '元任选'
            this.typeTxt.label = '件'
            break
          case 'COUNTAMOUNT':
            this.typeTxt.name = '件减'
            this.typeTxt.label = '件'
            break
          default:
            this.typeTxt.name = '减'
            this.typeTxt.label = '元'
        }
        return this.typeTxt
      }
    }
  }
</script>

<style lang="less" scoped>
  /deep/ label {
    width: 120px;
  }
  /deep/ .el-form-item__content {
    padding-left: 121px;
  }
  /deep/ .el-form-item__error {
    padding-left: 121px;
  }
  .el-input {
    width: 400px;
  }
  .el-select {
    width: 400px;
  }
  .el-form-item.is-success /deep/ .el-input__inner {
    border-color: #dcdfe6;
  }
  .btn {
    padding-top: 20px;
  }
  .el-form {
    padding-left: 20px;
  }
  .dateTo {
    padding: 10px 25px 0;
  }
  /deep/ .el-range-separator {
    width: 7%;
  }
  .imgBox {
    img {
      max-height: 60px;
      max-width: 80px;
    }
  }
  .avatar-uploader {
    display: inline-block;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  /deep/ .avatar-uploader .el-upload{
    display: block;
    padding-top: 12px;
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
    width: 140px;
    height: 60px;
  }
  .setFull{
    .reduce {
      padding-left: 0px;
      /deep/ .el-form-item__content{
        padding-left: 0px;
      }
      /deep/ .el-form-item__error{
        padding-left: 17px;
      }
    }
    .el-form-item{
      display: inline-block;
      .el-input{
        width: 100px;
      }
    }
  }
  .btnBox{
    margin-top: 35px;
  }
  .fileBox{
    position: relative;
    top: 13px;
    left: 10px;
    /*cursor: pointer;*/
    display: inline-block;
    background: #D0EEFF;
    border: 1px solid #99D3F5;
    border-radius: 4px;
    padding: 7px 20px;
    overflow: hidden;
    color: #1E88C7;
    text-decoration: none;
    text-indent: 0;
    line-height: 20px;
    input {
      position: absolute;
      font-size: 100px;
      right: 0;
      top: 0;
      opacity: 0;
    }
  }
  .muban{
    padding-left: 20px;
  }
</style>
