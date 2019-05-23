<!--
    @author:liurong
    @date:2018-9-10
 -->
<template>
  <div id="newgood">
    <el-form ref="searchForm" :model="searchdata" size="small" label-width="100px" :rules="rules" >
      <el-form-item label="商品类目" prop="oneCategoryId">
        <el-select v-model="searchdata.oneCategoryId" placeholder="选择一级类目" @change="(val) => reSelectItems(val,2)" clearable filterable>
          <el-option v-for="item in levelone" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <el-select v-model="searchdata.twoCategoryId" placeholder="商品二级类目" @change="(val) => reSelectItems(val,3)" clearable filterable :disabled="searchdata.oneCategoryId == ''">
          <el-option v-for="item in leveltwo" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <el-select v-model="searchdata.threeCategoryId" placeholder="商品三级类目" @change="(val) => reSelectItems(val,4)" clearable

        filterable :disabled="searchdata.twoCategoryId == ''">
          <el-option v-for="item in levelthree" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <!--
      <el-form-item
        label="商品品牌"
        class="txtInput"
        v-if="shopType !== 3"
        prop="brandId"
        :rules="{ required: true, message: '请选择商品品牌', trigger: 'blur' }"
      >
        <el-select
          v-model="searchdata.brandId"
          filterable
          clearable
          placeholder="请先选择三级类目"
          :disabled="this.searchdata.threeCategoryId===''"
        >
          <el-option
            v-for="item in brandList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      -->
    </el-form>

  </div>
</template>
<script>
  import { getToken } from '@/utils/auth'
  import { getQueryObject } from '@/utils/tools'
  import { getBrandList, setAddProduct, getGoodsCategory, setGoodSKU } from '@/api/product.js'

  export default {
    props: ['goodItems', 'isEdit', 'reSetItem'],
    data() {
      return {
        searchdata: {
          oneCategoryId: '',
          twoCategoryId: '',
          threeCategoryId: '',

          oneCategoryName: '',
          twoCategoryName: '',
          threeCategoryName: '',
          brandId: '',
          marque: ''
        },
        oneCategoryOldId: '',
        twoCategoryOldId: '',
        threeCategoryOldId: '',

        oneCategoryOldName: '',
        twoCategoryOldName: '',
        threeCategoryOldName: '',
        rules: {
          oneCategoryId: [{ required: true, message: '请选择', trigger: 'change' }]
        },
        priceit: false,
        levelone: [],
        leveltwo: [],
        levelthree: [],
        marquelist: [{
          rid: 'prd1',
          name: ' 宇宙第一瘦'
        }],
        pubBtnLoading: false,

        btnLoading: false, // 控制正在上传时的按钮状态
        headerImport: { 'token': getToken() }, // 批量上传请求header
        shopType: 3, // 店铺类型
        brandList: [], // 品牌名称下拉项数据
        standardList: [],
        selectStatus: true, // 编辑：判断商品类目是否已经改过一次
        addSelectStatus: false
      }
    },

    created() {
      this.getCategory('1', 'levelone', '')
      this.getShopType()
    },

    methods: {
      // 获取店铺类型
      getShopType() {
        this.shopType = this.$store.getters.shopinfo.shopType
      },
      // 获取select的lable值
      getLableName(data, level, val) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].id === val) {
            if (level === 2) {
              this.searchdata.oneCategoryName = data[i].name
            } else if (level === 3) {
              this.searchdata.twoCategoryName = data[i].name
            } else {
              this.searchdata.threeCategoryName = data[i].name
            }
          }
        }
      },
      // 编辑的时候，重新选择类目提醒
      reSelectItems(val, level) {

        const obj = getQueryObject()
        let self = this

        let popFn = () => {
          this.$confirm('更改类目会清空已录入的SKU，是否确认更改', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (level === 2) {
              this.searchdata.oneCategoryId = val
              this.getLableName(this.levelone, 2, val)
            } else if (level === 3) {
              this.searchdata.twoCategoryId = val
              this.getLableName(this.leveltwo, 3, val)
            } else {
              this.searchdata.threeCategoryId = val
              this.getLableName(this.levelthree, 4, val)
            }

            if (level === 4) {
              this.getSKU(val)
            } else {
              this.nextlevel(level)
            }
          }).catch(() => {
            this.$message({ type: 'info', message: '已取消删除' })
            // this.getCategory('1', 'levelone', '')

            if (level === 2) {
              this.searchdata.oneCategoryId = this.oneCategoryOldId
              this.searchdata.oneCategoryName = this.oneCategoryOldName
            } else if (level === 3) {
              this.searchdata.twoCategoryId = this.twoCategoryOldId
              this.searchdata.twoCategoryName = this.twoCategoryOldName
            } else {
              this.searchdata.threeCategoryId = this.threeCategoryOldId
              this.searchdata.threeCategoryName = this.threeCategoryOldName
            }
          })
        }
        if (!obj.id) {
          if (!this.addSelectStatus) { // 第一次加载规格
            if (level === 4) {
              this.getSKU(val)
              this.addSelectStatus = true
            } else {
              this.nextlevel(level)
            }
          } else {
            popFn()
          }
          return false
        }

        // 编辑详情
        if (this.selectStatus) {
          popFn()
          /*
          this.$confirm('更改类目会清空已录入的SKU，是否确认更改', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // this.selectStatus = false
            if (level === 4) {
              this.getSKU(val)
            } else {
              this.nextlevel(level)
            }
          }).catch(() => {
            this.$message({ type: 'info', message: '已取消删除' })
            // this.getCategory('1', 'levelone', '')
          })
          */
        } else {
          if (level === 4) {
            this.getSKU(val)
            this.selectStatus = true
          } else {
            this.nextlevel(level)
          }
        }
      },
      // 获取新的sku
      getSKU(val) {
        this.priceit = true
        const goodsId = getQueryObject().id ? getQueryObject().id : ''
        setGoodSKU({
          categoryId: val,
          goodsId: goodsId
        }).then((res) => {
          this.standardList = res.data.standardList
          this.brandList = []
          this.searchdata.brandId = ''

          if (this.shopType === 3 || this.threeCatId === '') {
            this.$emit('getStandard', {
              standardList: this.standardList,
              itemsId: this.searchdata,
              brandList: this.brandList,
              type: 1
            })
            return false
          }
          this.getBrand(val)
        })
      },
      // 商品类目选择
      nextlevel(level) {
        let params = level === 2 ? this.searchdata.oneCategoryId : this.searchdata.twoCategoryId
        let level_data = level// 用以查询实际应该发送几级类目的参数
        if (level === 2) {
          this.searchdata.twoCategoryId = ''
          this.leveltwo = []
          this.searchdata.threeCategoryId = ''
          this.levelthree = []
          params ? '' : level_data = 1
        } else {
          this.searchdata.threeCategoryId = ''
          this.levelthree = []
          params ? '' : (level_data = 2, params = this.searchdata.oneCategoryId)
        }
        getGoodsCategory({
          level: level_data,
          pid: params
        }).then((resp) => {
          level === 2 ? this.leveltwo = resp.data
            : (this.searchdata.twoCategoryId ? this.levelthree = resp.data : this.leveltwo = resp.data)
        })
      },
      // 发布商品
      pricedialog() {
        this.$refs['searchForm'].validate(valid => {
          if (valid) {
            this.pubBtnLoading = true
            setAddProduct(this.searchdata).then((resp) => {
              if (resp.code === 1000) {
                this.$router.push('/product/edit?id=' + resp.data)
              } else if (resp.code === 1017) {
                this.$alert(resp.msg, {
                  confirmButtonText: '缴纳保证金',
                  callback: action => {
                    action === 'confirm' && this.$router.push({ path: '/settings', query: { type: '5' }})
                  }
                })
              } else if (resp.code === 1158) { // 个人店铺发布商品数超过了50个
                this.$message({ type: 'error', message: resp.msg, duration: 5 * 1000 })
                this.pubBtnLoading = false
                return
              } else if (resp.code === 1112) { // code:1112
                this.$alert(resp.msg, {
                  confirmButtonText: '上传资料',
                  callback: action => {
                    action === 'confirm' && this.$router.push({ path: '/settings', query: { type: '2' }})
                  }
                })
              } else {
                this.$message({ type: 'error', message: resp.msg, duration: 5 * 1000 })
                this.pubBtnLoading = false
                return
              }
            }).catch(() => {
              this.pubBtnLoading = false
            })
          }
        })
      },
      getmarquelist() {
        this.searchdata.marque = ''
      },
      getCategory(type, level, pid) {
        getGoodsCategory({
          level: type,
          pid
        }).then((resp) => {
          this[level] = resp.data
          // if (this.isEdit) {
          setTimeout(() => {
            for (let i = 0; i < this[level].length; i++) {
              // console.log(this.goodItems[level] + '===' + this[level][i]['name'])
              if (this.goodItems[level] === this[level][i]['name']) {
                if (type === '1') {
                  this.searchdata.oneCategoryId = this[level][i].id
                  this.getCategory('2', 'leveltwo', this[level].pid)
                }
                if (type === '2') {
                  this.searchdata.twoCategoryId = this[level][i].id
                  this.getCategory('3', 'levelthree', this[level].pid)
                }
                if (type === '3') {
                  this.searchdata.threeCategoryId = this[level][i].id
                  this.getSKU(this[level][i].id)
                }

                if (this.goodItems) {
                  this.searchdata.oneCategoryName = this.goodItems.levelone
                  this.searchdata.twoCategoryName = this.goodItems.leveltwo
                  this.searchdata.threeCategoryName = this.goodItems.levelthree
                  // this.oneCategoryOldName = this.goodItems.levelone
                  // this.twoCategoryOldName = this.goodItems.leveltwo
                  // this.threeCategoryOldName = this.goodItems.levelthree
                }
                return false
              }
            }
          }, 300)
          // }
        })
      },
      getRemmenber() {
        if (this.searchdata) {
          const twoCategoryId = this.searchdata.twoCategoryId
          const threeCategoryId = this.searchdata.threeCategoryId
          twoCategoryId && this.getCategory('2', 'leveltwo', this.searchdata.oneCategoryId)
          threeCategoryId && this.getCategory('3', 'levelthree', this.searchdata.twoCategoryId)
        }
      },
      // 根据类目获取品牌列表
      getBrand(type) {
        const params = {
          categoryId: type
        }
        getBrandList(params).then(res => {
          if (!res.data) {
            this.$message({ type: 'error', message: res.msg, duration: 5 * 1000 })
          }
          this.brandList = res.data

          this.$emit('getStandard', {
            standardList: this.standardList,
            itemsId: this.searchdata,
            brandList: this.brandList,
            type: 1
          })
        })
      }
    },

    watch: {
      threeCatId() { // 监视三级类目，刷新品牌列表
        console.log(this.shopType)
        // console.log(this.threeCatId)
        if (this.shopType === 3 || this.threeCatId === '') {
          return false
        }
        this.brandList = []
        this.searchdata.brandId = ''
        this.getBrand(this.threeCatId)
      },
      reSetItem(val) {
        if (val) {
          this.addSelectStatus = false
          this.selectStatus = false
          this.searchdata.oneCategoryId = ''
          this.searchdata.twoCategoryId = ''
          this.searchdata.threeCategoryId = ''
        }
      },
      'searchdata.oneCategoryId': {
        handler(curVal, oldVal) {
          this.oneCategoryOldId = oldVal
        }
      },
      'searchdata.twoCategoryId': {
        handler(curVal, oldVal) {
          this.twoCategoryOldId = oldVal
        }
      },
      'searchdata.threeCategoryId': {
        handler(curVal, oldVal) {
          this.threeCategoryOldId = oldVal
        }
      }
    },

    computed: {
      threeCatId() { // 监视三级类目中间层
        return this.searchdata.threeCategoryId
      }
    }
  }
</script>

<style lang="scss" scoped>
  #newgood{
    padding-top: 20px;
    padding-bottom: 10px;
    .el-form-item {
      /*margin-bottom: 50px;*/
    }

    // 批量上传
    .uploadExcel {
      display: inline-block;
      padding-left: 10px;

      /deep/ .el-upload-list--text {
        display: none;
      }
    }

    .txtInput {
      width: 400px;

      .el-select {
        width: 100%;
      }
    }
  }
</style>
