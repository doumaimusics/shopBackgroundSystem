<template>
  <div class="editDialog">
    <!--<div>
       <a href="javascript:;" @click="showDialog">
        {{isModify || (!isAfterSale && isAfterSale!= undefined) ? '修改物流信息1' : '发货'}}
      </a> 
    </div>  -->

    <div v-if="isModify || (!isAfterSale && isAfterSale!= undefined)">
        <a href="javascript:;" @click="showDialog" v-if="isShow">修改物流信息1</a>
    </div>
    <div v-else>  <a href="javascript:;"   @click="showDialog">发货1</a></div>

    <!-- Form -->
    <el-dialog
      :title="isModify?'修改物流':'选择物流'"
      :visible.sync="dialogVisible"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form>
        <el-form-item label="物流公司：">
          <el-select v-model="deliveryComValue" placeholder="请选择物流公司">
            <el-option
              v-for="item in deliveryComList"
              :key="item.code"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="手动输入：" v-show="showInputDelivery" class="input">
          <el-input placeholder="请手动输入物流公司" v-model="pDeliveryComName"></el-input>
        </el-form-item>

        <el-form-item label="物流单号：" class="input">
          <el-input placeholder="请输入物流单号" v-model="pDeliveryNum"></el-input>
        </el-form-item>
      </el-form>

      <div class="btnOper">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="confirm" :disabled="!deliveryComValue || !pDeliveryNum">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getDeliveryComList,
    setDeliverySend,
    setModifyDelivery,
    getRedeliver,
    updateSallerLogistics
  } from '@/api/deal.js'

  export default {
    props: ['orderId', 'isSuccessFn', 'isModify', 'deliveryInfo', 'isAfterSale', 'type'], // type: 0 发货 1 售后
    data() {
      return {
        dialogVisible: this.value, // 控制模态框的显示隐藏

        deliveryComList: [], // 物流公司列表
        deliveryComValue: '', // 列表选择的物流公司
        pDeliveryComName: '', // 手动输入的物流公司
        pDeliveryNum: '', // 输入的物流单号

        showInputDelivery: false,
        isShow: true    // 修改物流信息显示状态
      }
    },
    watch: {
      deliveryComValue(val) {
        // 显示或隐藏手动输入物流框
        if (val === 'OTHER') {
          this.showInputDelivery = true
        } else {
          this.showInputDelivery = false
          this.pDeliveryComName = ''
        }
      },
      deliveryInfo(val) {
        this.deliveryInfo = val
      }

    },
    methods: {
      // 显示发货模态框
      showDialog() {
        this.deliveryComValue = ''
        this.pDeliveryComName = ''
        this.pDeliveryNum = ''
        this.mountDeliveryComList()
        if (this.isModify) {    // 订单管理已发货修改物流信息
              this.setOldDelivery()
        }
        if (!this.isAfterSale && this.isAfterSale != undefined && this.type == 1) {    // 售后管理待买家收货修改地址
          this.setAfterDelivery()
        }

        this.dialogVisible = true
      },
      // 取消按钮   
      cancel() {
        this.dialogVisible = false
      },
      // 确定按钮
      confirm() {
        if (this.showInputDelivery && !this.pDeliveryComName) {
          this.$message({ type: 'warning', message: '请输入要手动填写的物流公司' })
          return
        }
        const query = {
          logisticsCompanyCode: this.deliveryComValue,
          logisticsCompany: this.pDeliveryComName,
          logisticsNo: this.pDeliveryNum
        }
        if (!query.logisticsCompany) {
          for (let i = 0; i < this.deliveryComList.length; i++) {
            if (this.deliveryComList[i].code === query.logisticsCompanyCode) {
              query.logisticsCompany = this.deliveryComList[i].name
              break
            }
          }
        }

        // 售后订单(换货类型)发货  true:添加，false：修改
        let param = {
          sellerLogisticsCode: this.deliveryComValue,
          sellerLogisticsCompany: this.pDeliveryComName,
          sellerLogisticsNo: this.pDeliveryNum
        }
        if (!param.sellerLogisticsCompany) {
          for (let i = 0; i < this.deliveryComList.length; i++) {
            if (this.deliveryComList[i].code === param.sellerLogisticsCode) {
              param.sellerLogisticsCompany = this.deliveryComList[i].name
              break
            }
          }
        }
        if (this.type == 0) {
          if (this.isModify) {
            query.orderNo = this.deliveryInfo.orderNo
            // ajax
            setModifyDelivery(query).then(res => {     // 修改物流信息
              this.$emit('isSuccessFn', true)
              this.$message({ message: '修改成功1', type: 'success' })
              this.isShow = false;
            })
          } else {
            query.orderId = this.orderId
            // ajax
            setDeliverySend(query).then(res => {     // 单个发货
              this.$emit('isSuccessFn', true)
              this.$message({ message: '发货成功', type: 'success' })
            })
          }
          this.dialogVisible = false
        }

        if (this.type == 1) {
          if (this.isAfterSale) {
            param.id = this.orderId
            getRedeliver(param).then(res => {     // 换货类型售后-添加发货信息
              this.$message({ message: '发货成功', type: 'success' })
            })
            this.dialogVisible = false
            this.$emit('isSuccessFn', true)
            return false
          } else {
            // param.id = this.deliveryInfo.id
            param.applyId = this.deliveryInfo.applyId
            updateSallerLogistics(param).then(res => {
              this.$message({ message: '修改成功2', type: 'success' })
              this.isShow = false;
            })
            this.$emit('isSuccessFn', true)
            this.dialogVisible = false
            return false
          }
        }
      },
      // 加载物流公司列表
      mountDeliveryComList() {
        getDeliveryComList().then(res => {
          if (JSON.stringify(res.data) === '{}') {
            return
          }
          // 物流公司列表数组处理
          const newArray = Object.keys(res.data).sort().map(v => ({ code: v, name: res.data[v] }))
          const otherIndex = newArray.findIndex(v => v.code === 'OTHER')
          const otherItem = newArray.splice(otherIndex, 1)[0]
          newArray.push(otherItem)

          this.deliveryComList = newArray
        })
      },
      // 匹配已有物流数据
      setOldDelivery() {
        if (this.deliveryInfo.number) {
          this.deliveryComValue = this.deliveryInfo.code
          this.pDeliveryNum = this.deliveryInfo.number

          if (this.deliveryComValue === 'OTHER') {
            this.pDeliveryComName = this.deliveryInfo.name
            this.showInputDelivery = true
          }
        }
      },
      // 换货物流修改
      setAfterDelivery() {
        this.deliveryComValue = this.deliveryInfo.sellerLogisticsCode
        this.pDeliveryNum = this.deliveryInfo.sellerLogisticsNo
        if (this.deliveryComValue === 'OTHER') {
          this.pDeliveryComName = this.deliveryInfo.sellerLogisticsCompany
          this.showInputDelivery = true
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .editDialog {
    display: inline-block;

    .el-select {
      width: 80%;
      .el-input--medium {
        width: 100%;
      }
    }
    .input {
      .el-input {
        width: 80%;
      }
    }
    .btnOper {
      padding: 5px 40px;
      text-align: right;
    }
  }
</style>
