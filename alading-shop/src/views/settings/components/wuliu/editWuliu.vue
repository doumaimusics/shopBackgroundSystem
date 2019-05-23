<template>
  <div>
    <el-form class="form" :model="addForm" :rules="addRules" ref="addForm">
      <el-form-item prop="templateName" label="模板名称">
        <el-input 
          name="templateName" 
          v-model="addForm.templateName" 
          placeholder="请输入模板名称" 
          style="width:300px"
          :disabled="isEdit"
        />
      </el-form-item>

      <el-form-item prop="shippingAddress" label="发货地址" v-if="isEdit">
        <el-input name="shippingAddress" disabled type="text" v-model="addForm.shippingAddress" placeholder="请输入发货地址" style="width:300px"/>
      </el-form-item>

      <el-form-item prop="sendProvinceVal" label="发货地址" v-if="isAdd">
        <el-cascader
          placeholder="请选择"
          :options="CityInfo"
          v-model="addForm.sendProvinceVal"
          ref="cascader1"
          :change-on-select="true"
          :clearable="true"
          :filterable="true">
        </el-cascader>
      </el-form-item>

      <el-form-item prop="" label="是否包邮">
        <el-radio-group v-model="addForm.isFree">
          <el-radio label="0">自定义运费</el-radio>
          <el-radio label="1">卖家承担运费</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item v-for="(data,index) of addForm.freight" :key="index" :label="data.name" v-if="addForm.isFree==0">
        <el-input name="count" style="width:200px" type="number" min="0.00" v-model="data.count" placeholder="请输入运费"/> 元
        <el-button type="primary" plain @click="addArea({ type: 1 })" v-if="index===0" class="choose">添加指定区域</el-button>
        <el-button type="danger" size="small" v-if="index>0" @click.native.prevent="delPlace(index)">删除</el-button>
      </el-form-item>

      <!-- <el-form-item prop="specProvinceVal" label="选择区域" v-if="addForm.isFree==0">
          <el-cascader
            placeholder="请选择"
            :options="wuliuInfo"
            v-model="addForm.specProvinceVal"
            :clearable="true"
            ref="cascader2"
            :filterable="true"
            @change="addFreight">
          </el-cascader>
        <el-button @click.native.prevent="addPlace" :disabled="!addForm.specProvinceVal.length">添加指定地区</el-button>
      </el-form-item> -->

      <div v-if="isAdd" class="btnBox">
        <el-button :loading="loading" @click.native.prevent="resetForm" >重置</el-button>
        <el-button 
          type="primary" 
          :loading="loading" 
          @click.native.prevent="addSubmit" 
          :disabled="!addForm.templateName || addForm.sendProvinceVal.length===0" 
          class="save"
        >保存</el-button>
      </div>
      
      <div v-if="isEdit" class="btnBox">
        <el-button :loading="loading" @click.native.prevent="delAll">取消</el-button>
        <el-button 
          type="primary" 
          :loading="loading" 
          @click.native.prevent="editSubmit" 
          class="save"
        >保存</el-button>
      </div>
    </el-form>

    <el-dialog 
      title="为指定地区城市设置运费" 
      :visible.sync="innerVisible" 
      append-to-body 
      width="700px"
      :close-on-click-modal="false"
    >
      <AreaDialog @addArea="addArea" ref="areaRef"></AreaDialog>
    </el-dialog>
  </div>
</template>

<script>
  import CityInfo from '@/views/shopApply/area.js'
  import wuliuInfo from '@/views/settings/wuliuData.js'
  import {
    addLogistics,
    getLogTemplate,
    updateLogistics
  } from '@/api/settings'
  import AreaDialog from '@/views/settings/components/wuliu/AreaDialog'

  export default {
    props: ['visible', 'id', 'templateNameList', 'isAdd', 'isEdit'],
    components: { AreaDialog },
    data() {
      const validateUsername = (rule, value, callback) => {
        if (value.length <= 0) {
          callback(new Error('模板名称不能为空'))
        } else if (this.templateNameList[value]) {
          callback(new Error('模板名称不能重复'))
        } else {
          callback()
        }
      }
      return {
        addForm: {
          templateName: '',
          isFree: '1',
          shippingAddress: '',
          freight: [
            { name: '默认运费', count: 0 }
          ],
          sendProvinceVal: [] // 发货地址选中项
          // specProvinceVal: []   // 指定地区选中项
        },
        addRules: {
          templateName: [{ required: true, trigger: 'blur', validator: validateUsername }],
          sendProvinceVal: [{ required: true, trigger: 'change', message: '发货地址不能为空' }]
        },
        disabledBtn: true,
        loading: false,
        CityInfo: CityInfo,
        wuliuInfo: wuliuInfo,
        // selectOption:[],
        // wuliuSec:'',
        innerVisible: false
      }
    },
    created() {
      if (this.isEdit) {
        this.init()
      }
    },
    methods: {
      async init() {
        await getLogTemplate({ id: this.id }).then((res) => {
          try {
            res.data.freight = eval('(' + res.data.freight + ')')
          } catch (e) {
            res.data.freight = []
          }
          res.data.isFree = (res.data.isFree).toString()
          // res.data.specProvinceVal = [];
          this.addForm = res.data
        })
      },
      delPlace(index) { // 删除地区
        this.addForm.freight.splice(index, 1)
        // this.judgeButton();
      },
      // 取消按钮
      delAll() {
        this.$emit('visible', false)
      },
      editSubmit() {
        if (this.judgeValue()) {
          return
        }

        this.loading = false
        const data = {
          templateName: this.addForm.templateName,
          isFree: this.addForm.isFree,
          shippingAddress: this.addForm.shippingAddress,
          id: this.id
        }
        // let selPlace=JSON.stringify(this.transformWuLiu(this.addForm.freight));
        const selPlace = JSON.stringify(this.addForm.freight)
        data.freight = selPlace
        // ajax
        updateLogistics(data).then(() => {
          this.$message({ message: '物流模板修改成功', type: 'success' })
          this.$emit('visible', false)
        }).catch(() => {
          this.loading = false
        })
      },
      addSubmit() {
        if (this.judgeValue()) {
          return
        }

        let con = ''
        function matc(items, val, i = 0) { // 递归循环子对象
          if (val[i]) {
            for (let j = 0; j < items.length; j++) {
              if (items[j].value == val[i]) {
                con += items[j].label
                // console.log(con,i)
                i += 1
                return matc(items[j].children, val, i)
              }
            }
          }
        }
        this.$refs.addForm.validate(valid => {
          if (valid) {
            this.loading = false
            matc(CityInfo, this.addForm.sendProvinceVal)
            this.addForm.shippingAddress = con
            const data = {
              templateName: this.addForm.templateName,
              isFree: this.addForm.isFree,
              shippingAddress: this.addForm.shippingAddress
            }
            // let selPlace=JSON.stringify(this.transformWuLiu(this.addForm.freight));
            const selPlace = JSON.stringify(this.addForm.freight)
            data.freight = selPlace
            // ajax
            addLogistics(data).then(() => {
              this.$message({ message: '物流模板添加成功', type: 'success' })
              this.$emit('visible', false)
            }).catch(() => {
              this.loading = false
            })
          } else {
            return false
          }
        })
      },
      judgeValue() {
        // 判断运费是否是大于或等于0的整数字符串
        if (this.addForm.isFree == '0') {
          const pfLength = this.addForm.freight.length
          if (pfLength > 0) {
            for (let i = 0; i < pfLength; i++) {
              const testCount = this.addForm.freight[i].count
              if (parseInt(testCount) < 0 || parseInt(testCount) != testCount) {
                this.$message({ type: 'warning', message: '运费请输入大于或等于0的整数' })
                return true
              }
            }
          }
        }
      },
      // 添加区域按钮
      addArea(payload) {
        if (payload.type === 1) {
          if (this.$refs.areaRef) {
            this.$refs.areaRef.reset()
          }
          this.innerVisible = true
        } else if (payload.type === 0) {
          this.innerVisible = false
          // 去重后加入
          if (payload.data) {
            const repeat = []
            this.addForm.freight.forEach((v, i) => {
              const index = payload.data.indexOf(v.name)
              if (index !== -1) {
                repeat.push(payload.data[index])
                payload.data.splice(index, 1)
              }
            })
            payload.data.forEach((v, i) => {
              this.addForm.freight.push({ name: v, count: 0 })
            })
            if (repeat.length > 0) {
              this.$message({ type: 'warning', message: `${repeat.join('、')} 已存在` })
            }
          }
        }
      },
      resetForm() {
        this.addForm.templateName = ''
        this.addForm.shippingAddress = ''
        this.addForm.freight = [{ name: '默认运费', count: 0 }]
        this.addForm.sendProvinceVal = []
        this.$nextTick(() => {
          this.$refs.addForm.clearValidate()
        })
      }
      /* addPlace(){
        if(this.addForm.specProvinceVal.length === 0) {
          return;
        }
        this.addForm.freight.push({name:this.wuliuSec,count:0})
        this.addForm.specProvinceVal = [];
      }, */
      /* addFreight(val){ //选择运费地区
        this.wuliuSec=val[val.length-1]
      }, */
      // 自定义物流 全部区域转换为具体区域
      /* transformWuLiu(arr) {
        // 区域原始数据
        let cityData = JSON.parse(JSON.stringify(wuliuInfo));
        // 用于替换'全部'字段的所有具体区域
        let addArr = [];
        // arr中所有'全部'字段所在下标集合
        let indexArr = [];
        // 转换后的数组
        let newArr = [];

        // console.log(arr);
        // 先做数组去重
        arr.forEach((v, i) => {
          let flag = true;
          newArr.forEach((value, index) => {
            if (v.name === value.name) {
              flag = false;
            }
          })
          if (flag) {
            newArr.push(v);
          }
        })

        newArr.forEach((v, i) => {
          cityData.forEach((city, index) => {
            // 找到对应匹配项
            if (v.name === city.children[0].value) {
              // 删除arr的'全部'字段
              indexArr.push(i);
              // 删除children数组下的'全部'字段（排除国外地区项）
              if (city.children.length !== 1) {
                cityData[index].children.splice(0, 1);
              }
              // 替换为具体区域
              let temp = city.children.map((value, num) => {
                return { name: value.value, count: v.count };
              });
              // 拼接所有替换后的具体区域
              addArr = addArr.concat(temp);
            }
          })
        })

        if (addArr.length !== 0) {
          // 去除arr中'全部'字段数据项, 和addArr拼接
          newArr = newArr.filter((v, i) => indexArr.indexOf(i) < 0).concat(addArr);
        }

        // console.log(newArr);
        return newArr;
      } */
    }
  }
</script>

<style lang="scss" scoped>
  .form {
    padding: 20px;
  }
  .el-form-item {
    /deep/ .el-form-item__label {
      width: 130px;
    }
    .el-button--danger {
      margin-left: 20px;
    }
  }
  /deep/ .el-dialog__body {
    padding-top: 10px;
  }
  .el-form {
    padding-top: 0;
    padding-bottom: 0;
  }
  /deep/ .el-form-item__error {
    padding-left: 130px;
  }
  .el-cascader {
    width: 300px;
  }
  .btnBox {
    padding-top: 20px;
    padding-right: 20px;
    text-align: right;
  }
  .choose {
    margin-left: 20px;
    padding: 12px;
  }
</style>
