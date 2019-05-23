<template>
  <el-row :gutter="20">
      <el-col :span="22">
        <el-form ref="searchForm" :model="searchdata" inline size="small">
          <el-form-item label="商品类目">
            <el-select v-model="searchdata.oneCategoryId" placeholder="商品一级类目" @change="nextlevel(2)" clearable filterable>
              <el-option v-for="item in levelone" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <el-select v-model="searchdata.twoCategoryId" placeholder="商品二级类目" @change="nextlevel(3)" clearable filterable :disabled="this.searchdata.oneCategoryId === ''">
              <el-option v-for="item in leveltwo" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <el-select v-model="searchdata.threeCategoryId" placeholder="商品三级类目"  clearable filterable :disabled="this.searchdata.twoCategoryId === ''">
              <el-option v-for="item in levelthree" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品名称" prop="name">
            <el-input v-model="searchdata.name" placeholder="请输入商品名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="商品ID" prop="goodId">
            <el-input v-model="searchdata.goodId" placeholder="请输入商品id" clearable></el-input>
          </el-form-item>
          <!-- 审核状态 -->
          <el-form-item label="商品状态" v-if="!isSelect">
            <el-select v-model="searchdata.verifyStatus" placeholder="商品审核状态" clearable>
              <el-option label="全部" value="0"></el-option>
              <el-option label="待提交审核" value="1" v-if="!issale"></el-option>
              <el-option label="待审核" value="2"></el-option>
              <el-option label="未通过" value="3" v-if="!issale"></el-option>
              <el-option label="审核通过" value="4" v-if="!!issale"></el-option>
            </el-select>
          </el-form-item>
          <!-- 商品品牌 -->
          <el-form-item label="商品品牌" v-if="shopType!==3">
            <el-select 
              v-model="searchdata.brandId" 
              placeholder="请先选择三级类目" 
              clearable
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
          <!-- 商品条形码 -->
          <el-form-item label="条形码">
            <el-input v-model="searchdata.barCode" placeholder="请输入条形码" clearable></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="2">
        <div class="btn">
          <el-button @click="searchit" type="primary">搜索</el-button>
        </div>
        <div class="btn">
          <el-button @click="resetit">重置</el-button>
        </div>
      </el-col>
    </el-row>
</template>

<script>
  import { getBrandList, getGoodsCategory } from '@/api/product.js'

  export default {
    props: ['getsearch', 'issale', 'isSelect'],
    data() {
      return {
        searchdata: {
          oneCategoryId: '',
          twoCategoryId: '',
          threeCategoryId: '',
          goodId: '',
          name: '',
          verifyStatus: '0', // 商品审核状态
          brandId: '',
          barCode: ''
        },
        levelone: [],
        leveltwo: [],
        levelthree: [],

        brandList: [],
        shopType: 3
      }
    },
    created() {
      this.getFirstCate()
      this.getShopType()
    },
    methods: {
      getFirstCate() {
        const params = { level: '1' }
        getGoodsCategory(params).then((resp) => {
          resp.code === 1000 && (this.levelone = resp.data)
        })
      },
      // 商品类目选择
      nextlevel(level) {
        let params = level === 2 ? this.searchdata.oneCategoryId : this.searchdata.twoCategoryId
        const level_data = level// 用以查询实际应该发送几级类目的参数
        if (level == 2) {
          this.searchdata.twoCategoryId = '', this.searchdata.threeCategoryId = ''
          params ? '' : this.level_data = 1
        } else {
          this.searchdata.threeCategoryId = ''
          params ? '' : (this.level_data = 2, params = this.searchdata.oneCategoryId)
        }
        getGoodsCategory({ level: level_data, pid: params }).then((resp) => {
          resp.code === 1000 && (
            level == 2 ? this.leveltwo = resp.data
              : (this.searchdata.twoCategoryId ? this.levelthree = resp.data : this.leveltwo = resp.data))
        })
      },
      searchit() {
        this.getsearch(this.searchdata)
      },
      resetit() {
        this.searchdata.oneCategoryId = ''
        this.searchdata.twoCategoryId = ''
        this.searchdata.threeCategoryId = ''
        this.searchdata.goodId = ''
        this.searchdata.name = ''
        this.searchdata.verifyStatus = '0'
        this.searchdata.brandId = ''
        this.searchdata.barCode = ''
        this.searchit()
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
      },
      // 获取店铺类型
      getShopType() {
        this.shopType = this.$store.getters.shopinfo.shopType
      }
    },
    watch: {
      threeCatId() { // 监视三级类目，刷新品牌列表
        if (this.shopType === 3 || this.threeCatId === '') {
          return
        }
        this.brandList = []
        this.searchdata.brand = ''
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
  /deep/ .el-form-item {
    margin-bottom: 15px;
  }

  .el-select {
    width: 150px;
  }

  .el-input {
    width: 170px;
  }

  .btn {
    text-align: center;

    &:first-of-type {
      padding-bottom: 15px;
    }
  }
</style>
