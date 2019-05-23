<!--
    @author:liurong
    @date:2018-9-10
 -->
<template>
  <div class="editProduct">
    <el-button v-if="goodId" @click="backTo">返回</el-button>

    <el-card class="box-card" style="width: 980px;margin-top: 30px;">
      <div class="text item">
        <!-- 商品类目 -->
        <item-index :goodItems="goodItems" @getStandard="getStandard" :reSetItem="reSetItem" :isEdit="isEditStatus"></item-index>
      </div>
    </el-card>

    <el-form :model="form" label-width="100px" :rules="rules" ref="form">

      <!--基础信息-->

      <el-card class="box-card productCard">
        <div slot="header" class="clearfix">
          <span>基础信息</span>
        </div>
        <div class="text item">
          <el-form-item label="商品名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入1-30个字符" class="tipsInp"/>
            <span class="tips" @click="bigImgDo('https://img.51fanbei.com/h5/pc/shop02.jpg')">?</span>
          </el-form-item>
          <el-form-item label="备注(副标题)" prop="remark">
            <el-input v-model="form.remark" placeholder="请输入0-50个字符"/>
          </el-form-item>
          <el-form-item label="商品条形码" prop="barCode">
            <el-input v-model="form.barCode"></el-input>
          </el-form-item>
          <el-form-item label="商品标签" prop="labelIds" class="tag">
            <el-select v-model="form.labelIds" multiple class="tipsInp">
              <el-option
                v-for="item in tagList"
                :key="item.id"
                :label="item.labelName"
                :value="item.id"
              ></el-option>
            </el-select>
            <span class="tips" @click="bigImgDo('https://img.51fanbei.com/h5/pc/shop01.jpg')">?</span>
          </el-form-item>
          <el-form-item label="商品品牌" class="tag" v-if="shopType !== 3" prop="brandId">
            <el-select v-model="form.brandId" filterable clearable>
              <el-option v-for="item in brandList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品货号" prop="marque">
            <el-input v-model="form.marque"/>
          </el-form-item>
        </div>
      </el-card>

      <!--销售信息-->

      <el-card class="box-card productCard">
        <div slot="header" class="clearfix">
          <span>销售信息</span>
        </div>
        <div class="text item">
          <el-form-item label="SKU表" prop="colorArr">
            <table cellspacing="0" cellpadding="0">
              <thead>
              <tr>
                <th>规格</th>
                <th>规格属性</th>
              </tr>
              </thead>
              <tbody :key="getSkusTimes">
              <tr v-for="(item, idx) in form.standardList" :key="idx" v-if="form.standardList.length>0">
                <td>{{item.name}}</td>
                <td>
                  <div class="skuLine"
                   v-for="(items, index) in item.valueList"
                   :key="index"
                   @mouseenter="hoverHandle($event,1)"
                   @mouseleave="hoverHandle($event,0)"
                  >

                    <el-checkbox-group
                      v-model="colorArr[idx]"
                      @change="selectcolor"
                    >
                      <el-checkbox :label="item.name+':'+items.split(':')[1]">{{items.split(":")[1]}}</el-checkbox>
                    </el-checkbox-group>

                    <p class="btnBox" v-if="item&&item.valueList[index].split(':')[0] != items.split(':')[0]" >
                      <span class="btn" @click="deleteStandardList(item.name,items.split(':')[1])">删除</span>
                      <span class="btn" @click="editStandard(item.name,items.split(':')[1])">编辑</span>
                    </p>

                  </div>
                  <el-button type="text" class="addBtn" @click="addStandard(item.name)">新增</el-button>
                </td>
              </tr>
              </tbody>
            </table>
            <el-button type="primary" class="makesku" @click="makeSku">生成SKU</el-button>
          </el-form-item>

          <el-form-item label prop="skus">
            <!--
            <el-form :inline="true" :model="setParam" ref="setParam" class="tableHeader" v-if="batchSelect.length>0">
              <el-form-item label="" style="width: 200px">
                <el-select v-model="setParam.color" :placeholder="batchSelect[0].name" style="width: 98px;">
                  <el-option :label="batchSelect[0].name" value=""></el-option>
                  <el-option
                    v-for="(item,i) in batchSelect[0].valueList"
                    :key="i"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
                <el-select v-model="setParam.size" :placeholder="batchSelect[1].name" style="width: 98px;" v-if="batchSelect[1]" >
                  <el-option :label="batchSelect[1].name" value=""></el-option>
                  <el-option
                    v-for="(item,i) in batchSelect[1].valueList"
                    :key="i"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="" style="width: 112px;">
                <el-input v-model="setParam.actualAmount" placeholder="价格" type="number"></el-input>
              </el-form-item>
              <el-form-item label="" style="width: 100px;">
                <el-input v-model="setParam.stock" placeholder="库存" type="number"></el-input>
              </el-form-item>
              <el-form-item label="" style="width: 152px;">
                <el-input v-model="setParam.priceCode" placeholder="编码" ></el-input>
              </el-form-item>
              <el-form-item label="" :key="keyVal">
                <div class="upload-wrapper singlesku">
                  <ImgUpload
                    :backImages="setParam.picUrl ? [setParam.picUrl] : []"
                    :isSingle="true"
                    @onSuccess="successUpload"
                    @onSetData="setSkuData($event, 0)"
                  ></ImgUpload>
                </div>
              </el-form-item>
              <el-form-item label="">
                <el-button type="primary" size="small" @click="batchSet('setParam')">批量填充</el-button>
                <span class="tips" @click="bigImgDo('https://img.51fanbei.com/h5/pc/shop06.jpg')">?</span>
              </el-form-item>
            </el-form>
            -->
            <div v-if="form.skus.length >0">
              <!--
              <el-table
                :key="keyVal"
                :data="form.skus"
                border
                style="width: 100%">

                <el-table-column
                  label="规格"
                  width="">
                  <template slot-scope="scope">
                    <span v-for="(names,i) in scope.row.newStandardNameList">{{names}}</span>
                  </template>
                </el-table-column>

                <el-table-column
                  prop="date"
                  label="价格"
                  width="120">
                  <template slot-scope="scope">
                    <el-input v-model="form.skus[scope.$index].actualAmount" type="number" @input="inputNum('1',scope.$index,form.skus[scope.$index].actualAmount)"></el-input>
                  </template>
                </el-table-column>

                <el-table-column
                  prop="name"
                  label="库存"
                  width="100">
                  <template  slot-scope="scope">
                    <el-input v-model="form.skus[scope.$index].stock" type="number" @input="inputNum('2',scope.$index,form.skus[scope.$index].stock)"></el-input>
                  </template>
                </el-table-column>

                <el-table-column
                  prop="address"
                  width="160"
                  label="编码">
                  <template slot-scope="scope">
                    <el-input v-model="form.skus[scope.$index].priceCode"></el-input>
                  </template>
                </el-table-column>

                <el-table-column
                  prop="address"
                  width="120px"
                  label="规格主图">
                  <template slot-scope="scope">
                    <div class="upload-wrapper singlesku">
                      <ImgUpload
                        :backImages="form.skus[scope.$index].picUrl ? [form.skus[scope.$index].picUrl] : []"
                        :isSingle="true"
                        @onSetData="setSkuData($event, scope.$index)"
                      ></ImgUpload>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  label="操作"
                  width="">
                  <template  slot-scope="scope">
                    <div class="delete">
                      <el-button size="small" @click="deleteSize(scope.row.standardNames)">删除规格</el-button>
                      <el-checkbox @change="changeDefault(scope.$index+1)" v-model="form.skus[scope.$index].isDefault">设为默认</el-checkbox>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              -->
              <div>
                <table :key="keyVal" class="skuTable" >
                  <tr>
                    <th v-for="(item,i) in batchSelect" v-if="item.valueList.length>0">{{item.name}}</th>
                    <th>价格</th>
                    <th>库存</th>
                    <th>编码</th>
                    <th>规格主图</th>
                    <th>操作 <span class="tips" @click="bigImgDo('https://img.51fanbei.com/h5/pc/shop06.jpg')">?</span></th>
                  </tr>
                  <tr v-for="(items,i) in form.skus" :key="items.id || items.idd">

                    <td v-for="(item,j) in items.newStandardNameList">{{item}}</td>

                    <td>
                      <el-input v-model="form.skus[i].actualAmount" type="number" @input="inputNum('1',i,form.skus[i].actualAmount)"></el-input>
                    </td>
                    <td>
                      <el-input v-model="form.skus[i].stock" type="number" @input="inputNum('2',i,form.skus[i].stock)"></el-input>
                    </td>
                    <td>
                      <el-input v-model="form.skus[i].priceCode"></el-input>
                    </td>
                    <td>
                      <div class="upload-wrapper singlesku">
                        <ImgUpload
                          :backImages="form.skus[i].picUrl ? [form.skus[i].picUrl] : []"
                          :isSingle="true"
                          :onSetData="setSkuData.bind(null, i)"
                        ></ImgUpload>
                      </div>
                    </td>
                    <td>
                      <div class="delete">
                        <el-button size="small" @click="deleteSize(items.standardNames)">删除规格</el-button>
                        <el-checkbox @change="changeDefault(i+1)" v-model="form.skus[i].isDefault">设为默认</el-checkbox>
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </el-form-item>

          <el-form-item label="市场价格" prop="priceAmount">
            <el-input v-model="form.priceAmount" type="number"/>
          </el-form-item>
          <el-form-item label="总库存" >
            <el-input :disabled="true" v-model="form.totalStock"/>
          </el-form-item>
        </div>
      </el-card>

      <!--描述信息-->
      <el-card class="box-card productCard">
        <div slot="header" class="clearfix">
          <span>描述信息</span>
        </div>
        <div class="text item">
          <el-form-item label="商品首图" prop="goodsIcon">
            <el-row>
              <span>图片尺寸800*800，图片清晰，不添加水印；单张图片小于500kb，支持jpg、png图片格式</span>
              <span class="tips" @click="bigImgDo('https://img.51fanbei.com/h5/pc/shop04.jpg')">?</span>
            </el-row>
            <el-row>
              <ImgUpload
                :key="reUpload"
                :limit="1"
                :backImages="picList('goodsIcon')"
                :onSetData="setData.bind(null, 'goodsIcon')"
              ></ImgUpload>
            </el-row>
          </el-form-item>
          <el-form-item label="商品主图" prop="pics">
            <el-row>
              <span>可与商品主图一致。图片尺寸800*800，图片清晰，不添加水印；单张图片小于500kb，支持jpg、png图片格式</span>
              <span class="tips" @click="bigImgDo('https://img.51fanbei.com/h5/pc/shop04.jpg')">?</span>
            </el-row>
            <el-row>
              <ImgUpload
                :key="reUpload"
                :limit="4"
                :backImages="picList('pics')"
                :onSetData="setData.bind(null, 'pics')"
              ></ImgUpload>
            </el-row>
          </el-form-item>
          <el-form-item label="详情图" prop="details">
              <el-row>
                <span>宽为750-800px，单张图片小于500kb，图片清晰，支持jpg、png图片格式</span>
                <span class="tips" @click="bigImgDo('https://img.51fanbei.com/h5/pc/shop05.jpg')">?</span>
              </el-row>
              <div class="detailsBox">
                <div class="detailsMain">
                  <el-row class="detailsImg">
                    <ImgUpload
                      :key="reUpload"
                      :limit="16"
                      :backImages="picList('details')"
                      :onSetData="setData.bind(null, 'details')"
                      class="detailImgList"
                    ></ImgUpload>
                  </el-row>
                </div>
              </div>
          </el-form-item>
        </div>
      </el-card>

      <el-card class="box-card productCard">
        <div slot="header" class="clearfix">
          <span>物流信息</span>
        </div>
        <div class="text item">
          <el-form-item label="商品来源">
            <el-radio v-model="form.isCrossBorder" :label="0">国内</el-radio>
            <el-radio v-model="form.isCrossBorder" :label="1">海淘</el-radio>
          </el-form-item>
          <el-form-item label="物流配送" prop="logisticsTempId">
            <el-select v-model="form.logisticsTempId" placeholder="请选择物流模板">
              <el-option
                v-for="item in trafficlist"
                :key="item.id"
                :label="item.template_name"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-button type="text" class="newWuliu" @click="newWuliu">新增物流模板</el-button>
          </el-form-item>
        </div>
      </el-card>

      <el-card class="box-card productCard">
        <div class="text item">
          <el-form-item label="上架状态">
            <el-radio-group v-model="form.status">
              <el-radio :label="1">立刻上架</el-radio>
              <el-radio :label="0">放入仓库</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
      </el-card>
      <el-form-item>
        <el-button @click="resetForm('form')">清空重新编辑</el-button>
        <el-button type="primary" @click="submitForm('form')">确认发布</el-button>
      </el-form-item>
    </el-form>

    <el-dialog title="新增物流模板" :visible.sync="addShow" v-if="addShow" append-to-body width="700px">
      <editWuliu @visible="close" :templateNameList="templateNameList" :isAdd="true"></editWuliu>
    </el-dialog>
    <div class="bigImgPop">
      <p class="imgMask"></p>
      <ImgPreview ref="bigImgPop" :imgList="[imgUrl]"></ImgPreview>
    </div>
  </div>
</template>

<script>
  import ImgPreview from '@/components/ImgPreview'
  import ImgUpload from '@/components/ImgUpload/index'
  import editWuliu from '@/views/settings/components/wuliu/editWuliu'
  import ItemIndex from './index'
  import { getQueryObject, createUniqueString } from '@/utils/tools'
  import {
    getTagList,
    getBrandList,
    getProductDetail,
    getTemplatePage,
    setSubmitProduct,
    setNewAddProduct
  } from '@/api/product'

  export default {
    name: 'edit',
    components: {
      ImgUpload,
      editWuliu,
      ItemIndex,
      ImgPreview
    },
    data() {
      const validata = (rule, value, callback) => {
        // console.log(rule);
        const regEn = /[`~!@#$%^&*()+?:"{},\/;']/im
        const regCn = /[·！#￥（）：；“”‘、，|《。》？、【】]/im
        if (rule.field === 'name' && value === '') {
          callback(new Error('请输入商品名称'))
        } else if (regEn.test(value) || regCn.test(value)) {
          callback(new Error('不能包含特殊字符'))
        } else {
          callback()
        }
      }

      return {
        form: {
          name: '',
          remark: '',
          barCode: '',
          labelIds: [],
          isCrossBorder: 0,
          brandId: '',
          marque: '',
          priceAmount: '',
          totalStock: 0,
          goodsIcon: '',
          pics: [],
          details: [],
          primaryCategoryName: '',
          secondCategoryName: '',
          categoryName: '',
          oneCategoryId: '',
          twoCategoryId: '',
          threeCategoryId: '',
          status: 0,
          logisticsTempId: '',
          skus: [],
          standardList: []
        },
        rules: {
          // 表单校验
          name: [
            { validator: validata, trigger: 'blur' },
            { required: true, min: 1, max: 30, message: '长度在1-30个字符', trigger: 'blur' }
          ],
          remark: [
            { validator: validata, trigger: 'blur' },
            { min: 0, max: 50, message: '长度在0-50个字符', trigger: 'blur' }
          ],
          labelIds: [{ required: true, message: '请选择商品标签', trigger: 'change' }],
          barCode: [{ max: 64, message: '长度不得超过64个字符', trigger: 'blur' }],
          brandId: [{ required: true, message: '请输入商品品牌', trigger: 'blur' }],
          priceAmount: [{ required: true, message: '请输入原价格', trigger: 'blur' }],
          marque: [{ required: true, message: '请输入商品货号', trigger: 'blur' }],
          skus: [{ required: true, message: '请选择SKU', trigger: 'blur' }],
          actualAmount: [{ required: true, message: '请输入售价', trigger: 'blur' }],
          logisticsTempId: [{ required: true, message: '请选择物流模板', trigger: 'blur' }],
          goodsIcon: [{ required: true, message: '请上传商品首图', trigger: 'blur' }],
          pics: [{ required: true, message: '请上传商品主图', trigger: 'blur' }],
          details: [{ required: true, message: '请上传商品详情图', trigger: 'blur' }]
        },
        defaultsku: '',
        colorArr: [],
        skuArr: [],
        index: {},
        trafficlist: [],

        shopType: 3,
        addShow: false, // 控制新增物流模态框的显示隐藏
        templateNameList: {}, // 存储所有物流模板名
        tagList: [], // 标签库列表
        brandList: [], // 品牌列表

        newAttr: null, // sku 添加新属性
        batchSelect: [],
        setParam: {
          color: '',
          size: '',
          actualAmount: '',
          stock: '',
          priceCode: '',
          picUrl: ''
        },

        isEditStatus: true, // true 编辑 false 添加
        goodItems: {}, // 商品类目
        goodItemsId: {}, // 商品类目id

        reUpload: 0, // 重置图片
        reSetItem: false, // 重置三个下拉栏目
        goodId: false,
        keyVal: 0,
        getSkusTimes: 0,
        imgUrl: ''
      }
    },
    created() {
      this.getShopType()
      this.getDetail()
      this.getTag()
      this.getTemplateWuliu()
    },
    methods: {
      // tips放大
      bigImgDo(url) {
        this.imgUrl = url
        const obj = this.$refs.bigImgPop.$el.querySelector('.img')
        setTimeout(() => { obj.click() }, 100)
      },
      // 清空重置
      resetForm(formName) {
        this.reUpload++
        this.form.standardList = []
        this.reSetItem = this.reUpload++
        this.colorArr = []
        this.resetbatchParam()
        this.getTotalStock()
        this.$refs[formName].resetFields()
      },
      // 根据商品栏目得到新的sku
      getStandard(data) {
        this.goodItemsId = data.itemsId
        // this.form.standardList = data.standardList
        // this.brandList = data.brandList
        if (!this.goodId) {
          this.getSkusTimes = 2
        }
        if (this.getSkusTimes > 1) {
          this.form.standardList = data.standardList
          this.brandList = data.brandList
          this.form.skus = []
        }
        this.getSkusTimes++
        this.colorArr = []

        for (let i = 0; i < this.form.standardList.length; i++) {
          this.colorArr.push([])
        }
        console.log(this.colorArr)
        this.batchSelectData()
      },
      // 计算总的库存
      getTotalStock() {
        this.form.totalStock = 0
        if (this.form.skus.length > 0) {
          for (let i = 0; i < this.form.skus.length; i++) {
            if (this.form.skus[i].stock) {
              this.form.totalStock += Number(this.form.skus[i].stock)
            }
          }
        }
      },
      // 批量填充
      batchSet(formName) {
        const color = this.setParam.color || ''
        const size = this.setParam.size || ''
        const obj = this.form.skus

        if (obj.length === 0) { return false }

        if (color === '' && size === '') {
          for (let i = 0; i < obj.length; i++) {
            // this.$set(obj, i, Object.assign({}, obj[i], this.setParam))
            this.batchParameter(obj[i])
          }
          // 计算总的库存
          this.getTotalStock()
          this.resetbatchParam()
          return false
        }

        if (this.batchSelect.length > 1) {
          if (color !== '' && size !== '') {
            for (let i = 0; i < obj.length; i++) {
              if (color === obj[i].standard0 && size === obj[i].standard1) {
                this.batchParameter(obj[i])
              }
            }
          }

          if (color === '' && size !== '') {
            for (let i = 0; i < obj.length; i++) {
              if (size === obj[i].standard1) {
                this.batchParameter(obj[i])
              }
            }
          }

          if (color !== '' && size === '') {
            for (let i = 0; i < obj.length; i++) {
              if (color === obj[i].standard0) {
                this.batchParameter(obj[i])
              }
            }
          }

          this.resetbatchParam()
          // 计算总的库存
          this.getTotalStock()
          return false
        }
      },
      // 批量处理-重置批量数据
      resetbatchParam() {
        this.keyVal++
        this.setParam.color = ''
        this.setParam.size = ''
        this.setParam.actualAmount = ''
        this.setParam.stock = ''
        this.setParam.priceCode = ''
        this.setParam.picUrl = ''
      },
      // successUpload
      successUpload(res) {
        this.setParam.picUrl = res.url
      },
      // 批量处理-数据处理
      batchParameter(data) {
        this.$set(data, 'actualAmount', this.setParam.actualAmount !== '' ? this.setParam.actualAmount : data.actualAmount)
        this.$set(data, 'stock', this.setParam.stock !== '' ? this.setParam.stock : data.stock)
        this.$set(data, 'priceCode', this.setParam.priceCode !== '' ? this.setParam.priceCode : data.priceCode)
        this.$set(data, 'picUrl', this.setParam.picUrl !== '' ? this.setParam.picUrl : data.picUrl)
      },
      // 批量处理-规格下拉数据处理
      batchSelectData() {
        const standardList = this.form.standardList
        const skus = this.form.skus
        const newList = []
        const newSkus = []

        for (let i = 0; i < skus.length; i++) {
          const obj = skus[i].standardNames.split(';')
          for (let j = 0; j < obj.length; j++) {
            newSkus.push(obj[j])
          }
        }

        for (let i = 0; i < standardList.length; i++) {
          const valueList = standardList[i].valueList
          const name = standardList[i].name
          newList[i] = {}
          this.$set(newList[i], 'name', standardList[i].name)
          this.$set(newList[i], 'valueList', [])
          for (let k = 0; k < newSkus.length; k++) {
            if (name === newSkus[k].split(':')[0]) {
              newList[i]['valueList'].push(newSkus[k].split(':')[1])
              newList[i]['valueList'] = this.arrNoRepeat(newList[i]['valueList'])
            }
          }
        }

        this.batchSelect = newList
        // console.log(this.batchSelect)
      },
      // 数组去重
      arrNoRepeat(array) {
        var temp = []
        for (var i = 0; i < array.length; i++) {
          if (temp.indexOf(array[i]) === -1) {
            temp.push(array[i])
          }
        }
        return temp
      },
      // standardNames 数据处理
      changestandardNames(obj) {
        for (let i = 0; i < obj.length; i++) {
          this.$set(obj[i], 'newStandardNameList', [])
          const param01 = obj[i].standardNames.split(';')
          for (let j = 0; j < param01.length; j++) {
            const param02 = param01[j].split(':')
            this.$set(obj[i], 'standard' + j, param02[1])
            obj[i]['newStandardNameList'].push(param02[1])
          }
        }
        console.log(this.form.skus)
      },
      // 获取详情
      getDetail() {
        const obj = getQueryObject()
        if (!obj.id) {
          return false
        }
        getProductDetail(obj.id).then(resp => {
          resp.data.logisticsTempId === 0 && (resp.data.logisticsTempId = '')
          // let obj = Object.assign({},this.form,resp.data);
          // this.$set(this.form,obj);
          this.form = Object.assign({}, this.form, resp.data)
          this.$set(this.form, 'status', resp.data.status)
          this.form.skus = resp.data.skuList
          this.form.pics = resp.data.picList
          this.form.details = resp.data.detailList
          delete this.form.picList
          delete this.form.skuList
          delete this.form.detailList
          // 计算总库存
          this.getTotalStock()
          // 商品类目
          this.goodItems.levelone = this.form.primaryCategoryName
          this.goodItems.leveltwo = this.form.secondCategoryName
          this.goodItems.levelthree = this.form.categoryName

          for (let i = 0; i < this.form.standardList.length; i++) {
            this.colorArr.push([])
          }

          // standardNames 数据处理
          this.changestandardNames(this.form.skus)

          // 数据容错处理
          if (this.form.barCode === null) {
            this.form.barCode = ''
          }
          if (this.form.labelIds === null) {
            this.form.labelIds = []
          }
          if (resp.data.labelIds.length > 0) {
            this.form.labelIds = resp.data.labelIds.split(',').map(v => +v)
          } else {
            this.form.labelIds = []
          }
          if (this.form.brandId === 0) {
            this.form.brandId = ''
          }
          if (this.shopType !== 3) {
            this.getBrand(resp.data.categoryId)
          }

          this.batchSelectData()
          // sku图片回显
          // this.$nextTick(() => {
          //   this.form.skus.forEach((v, i) => {
          //     if (v.picUrl) {
          //       this.skuImages.push(v.picUrl)
          //     }
          //   })
          // })
        })
      },
      // 获取标签库
      getTag() {
        const params = {
          goodsId: this.$route.query.id
        }
        getTagList(params).then(res => {
          this.tagList = res.data
        })
      },
      // 获取物流模板
      getTemplateWuliu() {
        getTemplatePage().then(res => {
          this.trafficlist = res.data

          for (let i = 0; i < res.data.length; i++) {
            try {
              res.data[i].freight = eval('(' + res.data[i].freight + ')')
              this.templateNameList[res.data[i].template_name] = true
            } catch (e) {
              res.data[i].freight = []
            }
          }
        })
      },
      // 获取店铺类型
      getShopType() {
        this.shopType = this.$store.getters.shopinfo.shopType
        this.goodId = !!getQueryObject().id
      },
      // 图片列表数据格式处理
      picList(picName) {
        const arr = this.form[picName]
        if (!arr) {
          return []
        }
        if (typeof arr === 'string') {
          return [arr]
        } else {
          const pics = []
          for (let i = 0; i < arr.length; i++) {
            pics.push(arr[i].split(';')[0])
          }
          return pics
        }
      },
      // 输入框数字处理
      inputNum(type, idx, num) {
        if (type === '1' && num <= 0) {
          this.form.skus[idx].actualAmount = -num
        } else if (type === '2') {
          this.form.skus[idx].stock = Math.ceil(Math.abs(num))
        }
        // 计算总库存
        this.getTotalStock()
      },
      // 新增SKU属性
      addStandard(name) {
        let validarr = []
        for (let i = 0; i < this.form.standardList.length; i++) {
          if (this.form.standardList[i].name == name) {
            validarr = this.form.standardList[i].valueList
            break
          }
        }
        const validstr = validarr.join(',') + ','
        this.$prompt('请输入属性值', '添加属性11', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /.+/,
          inputValidator: val => {
            console.log(val)
            if (validstr.includes(':' + val + ',')) {
              return '该属性值已存在'
            } else {
              return true
            }
          },
          inputErrorMessage: '请输入属性值'
        })
          .then(data => {
            this.newAttr = data.value
            this.pushStandardList(name, data.value)
          })
          .catch(() => {})
      },
      // 编辑sku属性
      editStandard(name, value) {
        let ind = null
        let validarr = []
        for (let i = 0; i < this.form.standardList.length; i++) {
          if (this.form.standardList[i].name == name) {
            validarr = this.form.standardList[i].valueList
            break
          }
        }

        ind = validarr.indexOf('1111:' + this.newAttr)

        // console.log( ind )

        if (ind <= -1) { return false }

        const validstr = validarr.join(',') + ','
        this.$prompt('请修改属性值', '编辑属性', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /.+/,
          inputValue: this.newAttr,
          inputValidator: val => {
            if (validstr.includes(':' + val + ',')) {
              return '该属性值已存在'
            } else {
              return true
            }
          },
          inputErrorMessage: '请输入属性值'
        })
          .then(data => {
            this.$set(validarr, ind, '1111:' + data.value)
            console.log(validarr)
            this.newAttr = data.value
          })
          .catch(() => {})
      },
      // 将新增的属性值添加到表单数据中
      pushStandardList(name, value) {
        const arr = this.form.standardList
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].name == name) {
            arr[i].valueList.push('1111:' + value)
          }
        }
      },
      // 删除新增的属性
      deleteStandardList(name, value) {
        console.log(name + ':' + value)
        const arr = this.form.standardList
        let index = null
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].name == name) {
            index = arr[i].valueList.indexOf('1111:' + value)
            if (index > -1) {
              arr[i].valueList.splice(index, 1)
            }
          }
        }
      },
      // hover 效果
      hoverHandle(e, i) {
        const obj = e.target
        const child = obj.children[1]
        if (!child) { return false }
        if (i == 0) { // 移出
          obj.children[1].style = 'display:none;'
        } else {
          obj.children[1].style = 'display:inline-block;'
        }
      },
      // 将所有规格设置未非默认
      getAllUnselect(index) {
        const arr = this.form.skus
        for (let i = 0; i < arr.length; i++) {
          arr[i].isDefault = false
        }
        this.form.skus = JSON.parse(JSON.stringify(arr))
      },
      // SKU列表规格默认设置
      changeDefault(index) {
        if (this.defaultsku == index) {
          this.getAllUnselect()
          this.defaultsku = ''
        } else {
          this.getAllUnselect()
          this.form.skus[index - 1].isDefault = true
          this.defaultsku = index
        }
      },
      // 已上传图片数据赋值
      setData(name, data) {
        if (name === 'goodsIcon') {
          this.form[name] = data[0] || ''
        } else {
          this.form[name] = data
        }
      },
      // sku规格主图数据赋值
      setSkuData(index, data) {
        this.form.skus[index].picUrl = data[0] || ''
      },
      // 生成SKU
      makeSku() {
        this.form.skus = []
        // const colorArr = this.colorArr
        // const index = 1
        this.specialSort(-1)
        this.batchSelectData()
        console.log(this.form.skus)
      },
      // 删除规格
      deleteSize(item) {
        for (let i = 0; i < this.form.skus.length; i++) {
          if (this.form.skus[i].standardNames == item) {
            this.form.skus.splice(i, 1)
          }
        }
        this.getTotalStock()
      },
      // 去掉数组种空的数组选项，不然下面那个方法会出错啦eg:  [[1,2],[]]====>[[1,2]]
      getCleanArray(arr) {
        const copy = []
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].length > 0) {
            copy.push(arr[i])
          }
        }
        return copy
      },
      // 将SKU表种选择的积累属性数组组合起来生成SKU
      specialSort(start) {
        const array = this.getCleanArray(Object.assign([], this.colorArr))
        const len = array.length
        const indexs = this.index
        start++
        if (start > len - 1) {
          return
        }
        if (!indexs[start]) {
          indexs[start] = 0
        }
        if (!(array[start] instanceof Array)) {
          array[start] = [array[start]]
        }
        for (
          indexs[start] = 0;
          indexs[start] < array[start].length;
          indexs[start]++
        ) {
          this.specialSort(start)
          if (start == len - 1) {
            const temp = []
            for (let i = len - 1; i >= 0; i--) {
              if (!(array[start - i] instanceof Array)) {
                array[start - i] = [array[start - i]]
              }
              temp.push(array[start - i][indexs[start - i]])
            }
            this.form.skus.push({
              standardNames: temp.join(';'),
              isDefault: false,
              idd: createUniqueString()
            })
          }
        }

        // standardNames 数据处理
        this.changestandardNames(this.form.skus)
        // console.log(array)
      },
      // 返回之前的页面
      backTo() {
        this.$router.go(-1)
      },
      selectcolor(type) {
        // console.log(type)
        // console.log(this.colorArr)
      },
      // 字符串化表单数组数据
      numberVal() {
        if (this.form.remark == 'null' || this.form.remark == null) {
          this.form.remark = ''
        }
        const newForm = JSON.parse(JSON.stringify(this.form))
        const skus = newForm.skus
        for (let i = 0; i < skus.length; i++) {
          skus[i].actualAmount *= 1
          skus[i].stock *= 1
        }
        newForm.oneCategoryId = this.goodItemsId.oneCategoryId
        newForm.twoCategoryId = this.goodItemsId.twoCategoryId
        newForm.threeCategoryId = this.goodItemsId.threeCategoryId

        newForm.primaryCategoryName = this.goodItemsId.oneCategoryName
        newForm.secondCategoryName = this.goodItemsId.twoCategoryName
        newForm.categoryName = this.goodItemsId.threeCategoryName

        newForm.skus = JSON.stringify(newForm.skus)
        newForm.pics = JSON.stringify(newForm.pics)
        newForm.details = JSON.stringify(newForm.details)
        newForm.standardList = JSON.stringify(newForm.standardList)
        newForm.labelIds = newForm.labelIds.join()

        console.log(newForm)

        return newForm
      },
      // 字符串化
      /* parseParam(param, key) {
        var paramStr = ''
        for (const i in param) {
          var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i)
          const str = typeof (param[i]) === 'string' ? param[i] : JSON.stringify(param[i])
          paramStr += '&' + k + '=' + str
        }
        return paramStr.substr(1)
      }, */
      validSkuSubItem() {
        const skus = this.form.skus
        let flag = true
        let msg = ''
        for (let i = 0; i < skus.length; i++) {
          if (
            skus[i].actualAmount === undefined ||
            skus[i].stock === undefined ||
            skus[i].actualAmount.length === 0 ||
            skus[i].stock.length === 0
          ) {
            flag = false
            msg = '请完整填写SKU信息'
            break
          } else if (!/^[0-9]+$/.test(skus[i].stock)) {
            flag = false
            msg = '库存量只能为0或正整数'
          } else if (
            !/^[0-9]+.?[0-9]{0,2}$/.test(skus[i].actualAmount) ||
            skus[i].actualAmount == '0'
          ) {
            flag = false
            msg = '售价请输入大于0的数字或包含两位小数的数值'
          } else if (skus[i].name) {
            const regEn = /[`~!@#$%^&*()+?:"{},\/;']/im
            const regCn = /[·！#￥（）：；“”‘、，|《。》？、【】]/im
            if (regEn.test(skus[i].name) || regCn.test(skus[i].name)) {
              flag = false
              msg = '规格标题不能包含特殊字符'
            }
          }
        }
        return {
          flag,
          msg
        }
      },
      // 提交表单
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            const item = this.validSkuSubItem()
            if (item.flag) {
              this.form.standardList = []
              const newForm = this.numberVal()
              // ajax
              const obj = getQueryObject()
              if (!obj.id) {
                setNewAddProduct(newForm).then(resp => {
                  if (resp.code === 1017) {
                    this.$message.warning(resp.msg)
                    return false
                  }

                  if (resp.code === 1158) {
                    this.$message.warning(resp.msg)
                    return false
                  }

                  if (resp.code === 1112) {
                    this.$message.warning(resp.msg)
                    return false
                  }

                  this.form.status === 0
                    ? this.$router.push('/product/storePro')
                    : this.$router.push('/product/salePro')
                  this.$message({ type: 'success', message: '提交成功' })
                })
              } else {
                setSubmitProduct(newForm).then(resp => {
                  this.form.status === 0
                    ? this.$router.push('/product/storePro')
                    : this.$router.push('/product/salePro')
                  this.$message({ type: 'success', message: '提交成功' })
                })
              }
            } else {
              this.$message.warning(item.msg)
            }
          } else {
            this.$message.warning('信息填写有误，请检查后重新发布！')
            return false
          }
        })
      },
      // 打开新增物流模态框
      newWuliu() {
        this.addShow = true
      },
      // 关闭新增物流模态框
      close() {
        // this.form.logisticsTempId = '';
        this.getTemplateWuliu()
        this.addShow = false
      },
      // 根据类目获取品牌列表
      getBrand(type) {
        const params = {
          categoryId: type
        }
        getBrandList(params).then(res => {
          if (!res.data) {
            this.$message({
              type: 'error',
              message: res.msg,
              duration: 5 * 1000
            })
          }
          this.brandList = res.data
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .productCard{
    margin-bottom: 20px;
  }
  .tableHeader{
    width: 100%;
    padding-bottom: 15px;
    border-bottom: 1px solid #d8d3d3;
    margin-bottom: 20px;
    margin-top: 0;
    .el-form-item{
      margin-right: 0;
    }
    .el-input,/deep/ .el-input--suffix{
      margin-top: 60px;
    }
    button{
      margin-top: 65px;
    }
  }

  .editProduct {
    padding: 20px;
  }

  table {
    width: 100%;
    td,
    th {
      border: 1px solid #999;
      border-left: 0;
      border-top: 0;
      &:first-child {
        border-left: 1px solid #999;
      }
      text-align: center;
    }
    th {
      border-top: 1px solid #999;
    }
  }
  .skuTable{
    th{
      padding: 0 5px;
      width: 80px;
    }
    td{
      padding: 0 5px;
    }
  }
    form {
      margin-top: 20px;
      width: 980px;
    }
    .el-row--flex {
      .el-col {
        margin-right: 20px;
        &:last-child {
          margin-right: 0;
        }
      }
    }
    td {
      .el-checkbox-group {
        text-align: left;
        padding-left: 20px;
        padding-right: 4px;
        float: left;
        .el-checkbox {
          display: inline-block;
          min-width: 60px;
        }
      }
      .skuLine{
        float: left;
        .btnBox{
          font-size: 12px;
          cursor: pointer;
          display: none;
          &.show{
            display: inline-block;
          }
        }
      }
    }
    .tag {
      .el-select {
        width: 100%;
      }
    }
    .makesku {
      margin-top: 20px;
    }

    .skuItem {
      background: #ededed;
      margin-bottom: 20px;
      padding: 10px;
      display: flex;
      justify-content: space-between;

      .firstCa {
        // padding-bottom: 36px;
        flex: 1;

        .delete {
          padding-top: 20px;
        }
      }
      .inputWrapper {
        flex: 1;

        /deep/ .el-input-group__prepend {
          width: 70px;
        }
      }
      .mainPic {
        flex: 1;
        display: flex;
        justify-content: flex-end;

        .singlesku {
          /deep/ .el-upload-list__item,
          /deep/ .el-upload--picture-card,
          /deep/ .single {
            width: 148px;
            height: 148px;
          }
        }
      }
      form {
        width: auto;
      }
      .el-input-group--prepend {
        margin-bottom: 10px;
      }
    }
    /deep/ .el-input-group__prepend {
      border: 0;
      background: none;
      padding: 0;
      width: 50px;
    }

    .addBtn {
      float: left;
      margin-left: 5px;
    }

    .newWuliu {
      padding-left: 20px;
    }
    .tips{
      width: 20px;
      height: 20px;
      text-align: center;
      line-height: 20px;
      border-radius: 50%;
      padding: 0;
      font-size: 12px;
      display: inline-block;
      border: 1px solid #6c6e75;
      color: #6c6e75;
      cursor: pointer;
    }
   /deep/ .tipsInp{
     width: 97% !important;
   }
  /deep/ .detailImgList li{
    margin: 0;
    display: block;
  }
  .bigImgPop{
    position: relative;
    .imgMask{
      width: 70px;
      height: 70px;
      background: #fff;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
  .detailsBox{
    position: relative;
    padding-bottom: 100px;
    .detailsMain{
      max-height: 500px;
      overflow: auto;
    }
    /deep/ .el-row{
      position: static;
    }
    /deep/ .el-upload.el-upload--picture-card{
      position: absolute;
      bottom: 0;
      left: 0;
    }
  }
</style>
