<template>
  <div class="aftersServiceDetail">
    <!-- 售后相关 -->
    <AfterServiceInfo
      :afterServiceId="afterServiceId"
      :orderNo="orderNo"
      :orderData="orderData"
      @getAfterServiceData="getAfterServiceData"
      @getAfterServiceTpye="getAfterServiceTpye"
      v-if="orderData"
    >
    </AfterServiceInfo>

    <!-- 审批 -->
    <!--
    <div class="approve" v-if="ifApprove">
      <el-row class="yesOrNo">
        <el-button @click="agreeButton" :type="agreeBtnType">同意</el-button>
        <el-button @click="refuseButton" :type="refuseBtnType">拒绝</el-button>
      </el-row>

      <el-row class="agreeInfo" v-if="showAgree">
        <p v-if="ifAddressRadio">
          <el-radio v-model="isBackRadio" label="0">将商品回寄至</el-radio>
          <el-select placeholder="请选择" v-model="addressValue" v-if="ifHasAddress">
            <el-option
              v-for="item in addressList"
              :key="item.id"
              :value="item.id"
              :label="`${item.name}，${item.mobile}，${item.address}`"
            >
            </el-option>
          </el-select>
          <span v-if="!ifHasAddress">请先在店铺设置里添加回寄地址</span>
        </p>
        <p>
          <el-radio v-model="isBackRadio" label="1">不需要回寄(确定同意即退款)</el-radio>
        </p>
      </el-row>

      <el-row :class="{'refuseInfo': true, 'redWarning': isRefuseWarn}" v-if="showRefuse">
        <span>*</span>
        <el-input
          type="textarea"
          :autosize="{minRows: 2}"
          maxlength="50"
          v-model="reasonTextarea"
          placeholder="请输入拒绝原因"
        ></el-input>
        <span v-show="isRefuseWarn">请输入拒绝原因</span>
        <p>剩余字数：{{textLength}}/50</p>
      </el-row>

      <el-row class="confirm" v-if="showConfirm">
        <el-button
          type="primary"
          @click.native="confirmButton"
          :disabled="!ifHasAddress && !showRefuse && isBackRadio === '0'"
          :loading="confirmBtnLoading"
        >确定</el-button>
      </el-row>
    </div>
    -->

    <!-- 签收按钮 -->
    <div class="agree" v-if="ifAgree">
      <el-button type="primary" @click="confirmSignBack" :loading="agreeBtnLoading" :disabled="isUserSend">确认签收</el-button>
      <el-button type="" @click="closedVisible=true">关闭售后单</el-button>
      <!--<span style="color:red">（回寄后10天内未点击签收并退款则自动确认）</span>-->
    </div>

    <!-- 订单相关 -->
    <OrderInfo :orderNo="orderNo" :type="type" :isAfterSale="true" @getorderNo="getorderNo"></OrderInfo>

    <!--新版本审批-->
    <div>
      <el-button @click="goBack">返回</el-button>
      <el-button type="primary" v-if="afterStatus=='NEW'" @click="checkedVisible=true">审核</el-button>
    </div>
    <el-dialog title="审核选项" :visible.sync="checkedVisible" width="500px">
      <div class="approve" v-if="ifApprove">
        <el-row>
          <span>审核结果：</span>
          <p class="yesOrNo">
            <el-button @click="agreeButton" :type="agreeBtnType">同意</el-button>
            <el-button @click="refuseButton" :type="refuseBtnType">拒绝</el-button>
          </p>
        </el-row>
        <el-row class="agreeInfo" v-if="showAgree">
          <p v-if="ifAddressRadio">
            <el-radio v-model="isBackRadio" label="0">将商品回寄至</el-radio>
            <el-select placeholder="请选择" v-model="addressValue" v-if="ifHasAddress">
              <el-option
                v-for="item in addressList"
                :key="item.id"
                :value="item.id"
                :label="`${item.name}，${item.mobile}，${item.address}`"
              >
              </el-option>
            </el-select>
            <span v-if="!ifHasAddress">请先在店铺设置里添加回寄地址</span>
          </p>
          <p v-if="noNeedBack">
            <el-radio v-model="isBackRadio" label="1">不需要回寄(确定同意即退款)</el-radio>
          </p>
        </el-row>

        <el-row :class="{'refuseInfo': true, 'redWarning': isRefuseWarn}" v-if="showRefuse">
          <span>备注原因：</span>
          <el-input
            type="textarea"
            :autosize="{minRows: 2}"
            maxlength="50"
            v-model="reasonTextarea"
            placeholder="请输入拒绝原因"
          ></el-input>
          <span v-show="isRefuseWarn" style="padding-left: 80px; color: red;padding-bottom: 0px;">请输入拒绝原因</span>
          <p>剩余字数：{{textLength}}/50</p>
        </el-row>

        <div slot="footer" class="dialog-footer">
          <el-button @click="checkedVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click.native="confirmButton"
            :disabled="!ifHasAddress && !showRefuse && isBackRadio === '0'"
            :loading="confirmBtnLoading"
          >确定</el-button>
        </div>
      </div>
    </el-dialog>

    <!--关闭售后单-->
    <el-dialog title="关闭售后单" :visible.sync="closedVisible" width="500px">
      <el-form :model="closeForm" class="closeForm" :rules="closeRules" ref="closeForm">
        <el-form-item label="关闭原因：" prop="cause">
          <el-select v-model="closeForm.cause" placeholder="请选择原因" @change="causeSelect">
            <!--
            <el-option
              v-for="item in causeOption"
              :key="item.id"
              :label="item.cause"
              :value="item.cause">
            </el-option>
            -->
            <template v-if="type == 1">
              <el-option label="查询不到有效物流信息" value="查询不到有效物流信息"></el-option>
              <el-option label="商品不符合换货要求" value="商品不符合退货要求"></el-option>
              <el-option label="与买家协商一致关闭" value="与买家协商一致关闭"></el-option>
            </template>

            <template v-if="type == 3">
              <el-option label="查询不到有效物流信息" value="查询不到有效物流信息"></el-option>
              <el-option label="商品不符合换货要求" value="商品不符合换货要求"></el-option>
            </template>

            <el-option label="其他原因" value="other"></el-option>

          </el-select>
        </el-form-item>
        <el-form-item label="其他原因：" v-if="otherCauseVisible" prop="other">
          <el-input
            style="width: 368px;"
            type="textarea"
            :autosize="{minRows: 2}"
            maxlength="50"
            v-model="closeForm.other"
          ></el-input>
          <p class="num">剩余字数：{{textLength02}}/50</p>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closedVisible = false">取 消</el-button>
        <el-button type="primary" @click="closeFormSubmit('closeForm')">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import OrderInfo from '@/views/deal/components/OrderInfo.vue'
  import AfterServiceInfo from '@/views/deal/components/AfterServiceInfo.vue'
  import { setAfterServiceApprove, setSignBack, getAfterSaleCause, closeApply } from '@/api/deal'
  // import "@/views/deal/reset.scss";

  export default {
    data() {
      return {
        orderNo: '',
        afterServiceId: '',

        ifAgree: false,
        ifApprove: false,
        showAgree: false,
        showRefuse: false,
        showConfirm: false,

        addressList: [], // 回寄地址列表
        addressValue: '', // 地址选中项
        ifAddressRadio: false, // 是否显示回寄地址下拉选项
        noNeedBack: false, // 是否显示[不需要回寄]

        submitType: '', // 同意还是拒绝  0:通过 1:拒绝
        isBackRadio: '0', // 是否需要回寄 0:要回寄 1:不需要回寄
        ifHasAddress: false, // 无回寄地址时显示提示信息
        reasonTextarea: '',
        isRefuseWarn: false, // 拒绝原因非空提示信息
        confirmBtnLoading: false,

        isUserSend: true,
        agreeBtnLoading: false,
        agreeBtnType: '',
        refuseBtnType: '',

        type: null, // 售后订单类型
        afterStatus: null, // 售后状态
        orderData: null, // 订单信息

        checkedVisible: false,
        closedVisible: false, // 关闭售后单显示状态
        otherCauseVisible: false, //
        closeForm: {
          cause: '',
          other: ''
        },
        closeRules: {
          cause: [
            { required: true, message: '请选择原因', trigger: 'change' }
          ],
          other: [
            { required: true, message: '请输入原因', trigger: 'blur' }
          ]
        },
        causeOption: []
      }
    },

    created() {
      this.getId()
    },

    methods: {
      // 返回按钮
      goBack() {
        this.$router.go(-1)
      },
      // 获取路由参数
      getId() {
        this.orderNo = this.$route.query.orderNo
        this.afterServiceId = this.$route.query.afterServiceId
        // 默认同意
        this.agreeButton()
        // 获取售后原因
        this.getAfterCause()
      },
      // 获取售后订单类型
      getAfterServiceTpye(data) {
        console.log(data)
        this.type = data.type
        this.afterStatus = data.status
      },
      // 获取订单信息
      getorderNo(data) {
        this.orderData = data
      },
      // 获取售后原因
      getAfterCause() {
        getAfterSaleCause({}).then(res => {
          if (res.code === 1000) {
            this.causeOption = res.data
          } else {
            this.causeOption = []
          }
        })
      },
      // 获取售后信息组件传递的数据
      getAfterServiceData(obj) {
        this.addressList = obj.addressList
        if (this.addressList.length === 0) {
          this.ifHasAddress = false
        } else {
          this.ifHasAddress = true
          const addressDefault = this.addressList.find(v => v.isDefault === 1)
          if (addressDefault) {
            this.addressValue = addressDefault.id
          }
        }

        this.isBackRadio = '0'
        this.ifAddressRadio = true
        this.noNeedBack = true
        this.ifApprove = false
        this.ifAgree = false
        this.isUserSend = true

        switch (obj.afterSaleStatus) {
          case 'NEW':
            if (!obj.orderLogisticsNo) {
              this.ifAddressRadio = false // 未发货，隐藏回寄地址radio
              this.isBackRadio = '1'
            }
            this.ifApprove = true // 退款待处理，显示审批功能
            break
          case 'WAIT_GOODS_BACK':
            this.ifAgree = false // 待买家发货，显示签收按钮
            break
          case 'GOODS_BACKIING':
            this.ifAgree = true // 待卖家收货，显示签收按钮
            this.isUserSend = false // 待卖家收货，签收按钮可用
        }

        // 仅退款
        if (this.type === 2) {
          this.isBackRadio = '1'
          this.addressValue = ''
          this.ifAddressRadio = false
        }
        // 换货
        if (this.type === 3) {
          this.isBackRadio = '0'
          this.noNeedBack = false
        }
      },

      // 同意按钮
      agreeButton() {
        this.showAgree = true
        this.showRefuse = false
        this.showConfirm = true
        this.submitType = '0'
        this.isRefuseWarn = false
        this.agreeBtnType = 'primary'
        this.refuseBtnType = ''
        this.confirmBtnLoading = false
      },
      // 拒绝按钮
      refuseButton() {
        this.showAgree = false
        this.showRefuse = true
        this.showConfirm = true
        this.submitType = '1'
        this.agreeBtnType = ''
        this.refuseBtnType = 'primary'
        this.confirmBtnLoading = false
      },

      // 确定按钮
      confirmButton() {
        this.confirmBtnLoading = true
        // 拒绝原因非空提示
        if (this.submitType === '1' && !this.reasonTextarea) {
          this.isRefuseWarn = true
          return
        }
        // 参数设置
        const params = {
          id: this.afterServiceId,
          submitType: this.submitType
        }
        if (this.submitType === '1') {
          params.refuseReason = this.reasonTextarea
        } else {
          params.backGoodsType = this.isBackRadio
          if (this.isBackRadio === '0') {
            if (this.addressValue) {
              const addrItem = this.addressList.find(v => v.id === this.addressValue)
              params.backAddress = `${addrItem.name},${addrItem.mobile},${addrItem.address}`
            } else {
              return
            }
          }
        }
        // 提交请求
        setAfterServiceApprove(params).then(res => {
          this.confirmBtnLoading = false
          this.$message({ message: '已提交后台处理', type: 'success' })
          // this.$router.push('/deal/afterService')
          this.$router.go(-1)
        }).catch(() => {
          this.confirmBtnLoading = false
        })
      },
      // 签收按钮
      confirmSignBack() {
        let title = (this.type === 3) ? '确认签收' : '确认签收退款'
        let info = (this.type === 3) ? '是否确认签收？签收后请及时给买家换货回寄' : '确认签收并退款？'
        this.$confirm(info, title, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.agreeBtnLoading = true
          const params = { id: this.afterServiceId }
          setSignBack(params).then(res => {
            this.$message({ type: 'info', message: '已提交后台处理' })
            this.agreeBtnLoading = false
            // this.$router.push('/deal/afterService');
            this.$router.go(-1)
          }).catch(() => {
            this.agreeBtnLoading = false
          })
        }).catch(() => {})
      },
      // 点击选择售后原因
      causeSelect(val) {
        if (val === 'other') {
          this.otherCauseVisible = true
        } else {
          this.otherCauseVisible = false
        }
      },
      // 关闭售后订单
      closeFormSubmit(formName) {

        this.$refs[formName].validate((valid) => {
          if (valid) {
            closeApply({
              'id': this.afterServiceId,
              'closeCause': this.closeForm.cause === 'other' ? this.closeForm.other : this.closeForm.cause
            }).then(res => {
              this.$message({ message: '已提交后台处理', type: 'success' })
              this.$router.go(-1)
            }).catch(() => {

            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    },

    components: { AfterServiceInfo, OrderInfo },

    computed: {
      // 拒绝原因剩余字数
      textLength() {
        const length = 50 - this.reasonTextarea.length
        return length > 0 ? length : 0
      },
      textLength02() {
        const length = 50 - this.closeForm.other.length
        return length > 0 ? length : 0
      }
    },

    watch: {
      // 监视拒绝原因 有值时隐藏非空提示
      reasonTextarea(val) {
        if (val) {
          this.isRefuseWarn = false
        }
      }
    }

  }
</script>

<style lang="scss" scoped>
  // 总容器
  .aftersServiceDetail {
    padding: 20px;
    font-size: 14px;
  }
  .closeForm {
    /deep/ .el-form-item__error {
      left: 91px;
    }
    .num{
      margin-left:92px;
    }
  }
  // 审批
  .approve {
    /*padding-bottom: 40px;*/

    .yesOrNo {
      display: inline-block;
      .el-button {
        border-color: #b3d8ff;
      }
    }
    // 同意相关
    .agreeInfo {
      padding: 20px 0;

      .el-radio {
        padding: 15px 0;
      }
      .el-select {
        padding-left: 10px;
        width: 300px;
      }
      span {
        color: red;
        padding-left: 5px;
        font-size: 16px;
      }
    }
    // 拒绝相关
    .refuseInfo {
      padding: 20px 0;

      span {
        display: inline-block;
        padding-bottom: 20px;
        /*color: red;*/
      }
      .el-textarea {
        width: 380px;
      }
      p {
        color: #999;
        font-size: 12px;
        padding-top: 10px;
        padding-left: 74px;
      }
      &.redWarning {
        /deep/ textarea {
          border-color: red;
        }
      }
    }

    // 确定按钮
    .confirm {
      padding: 20px 0;

      .el-button {
        padding-right: 40px;
        padding-left: 40px;
      }
    }
  }

  // 签收按钮
  .agree {
    padding-top: 10px;
    padding-bottom: 60px;

    .el-button {
      padding-right: 40px;
      padding-left: 40px;
    }
  }

</style>
