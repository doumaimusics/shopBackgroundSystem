<!--
    @author:liurong
    @date:2018-9-10
 -->
<template>
  <div id="newgood">
    <el-form ref="searchForm" :model="searchdata" size="small" label-width="100px">
      <el-form-item label="商品类目">
        <el-select v-model="searchdata.oneCategoryId" placeholder="选择一级类目" @change="nextlevel(2)" clearable filterable>
          <el-option v-for="item in levelone" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <el-select v-model="searchdata.twoCategoryId" placeholder="商品二级类目" @change="nextlevel(3)" clearable filterable :disabled="searchdata.oneCategoryId == ''">
          <el-option v-for="item in leveltwo" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <el-select v-model="searchdata.threeCategoryId" placeholder="商品三级类目" clearable
        @change="priceit= true"
        filterable :disabled="searchdata.twoCategoryId == ''">
          <el-option v-for="item in levelthree" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
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
      <el-form-item
        label="商品货号"
        class="txtInput"
        prop="marque"
        :rules="{ required: true, message: '请输入商品货号', trigger: 'blur' }"
      >
        <el-input v-model="searchdata.marque"/>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          size="medium"
          @click="pricedialog"
          :disabled="searchdata.threeCategoryId ==''"
          :loading="pubBtnLoading"
        >发布商品</el-button>

        <!-- <el-upload
          class="uploadExcel"
          action="/shop/goods/import"
          :disable="btnLoading"
          :headers="headerImport"
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          :on-success="uploadSuccess"
          :before-upload="beforeUpload"
          :on-error="uploadError"
        >
          <el-button type="primary" v-if="searchdata.threeCategoryId!==''">批量上传数据包</el-button>
        </el-upload> -->
      </el-form-item>
    </el-form>

  </div>
</template>
<script>
  import { getToken } from '@/utils/auth'
  import { getBrandList, setAddProduct, getGoodsCategory } from '@/api/product.js'

  export default {
    data() {
      return {
        searchdata: {
          oneCategoryId: '',
          twoCategoryId: '',
          threeCategoryId: '',
          brandId: '',
          marque: ''
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
        brandList: [] // 品牌名称下拉项数据
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
        })
      }
      /* // 批量上传开始前
      beforeUpload() {
        this.btnLoading = true;
        this.$message({ message: '上传处理中，请耐心等待...' });
      },
      // 批量上传成功后
      uploadSuccess(res) {
        this.btnLoading = false;
        if (res.code === 1000) {
          this.$message({ message: '上传处理成功', type: 'success' });
        } else {
          this.$message({ message: '上传处理错误' });
        }
      },
      // 批量上传失败后
      uploadError() {
        this.btnLoading = false;
        this.$message({ message: '请求失败，请稍后重试' });
      } */
    },

    watch: {
      threeCatId() { // 监视三级类目，刷新品牌列表
        // console.log(this.threeCatId);
        if (this.shopType === 3 || this.threeCatId === '') {
          return
        }
        this.brandList = []
        this.searchdata.brandId = ''
        this.getBrand(this.threeCatId)
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
