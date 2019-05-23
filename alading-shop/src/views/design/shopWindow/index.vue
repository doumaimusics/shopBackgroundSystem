<template>
  <div class="shopWindow">
    <div>
      <el-radio v-model="radio" :label="1">开启</el-radio>
      <el-radio v-model="radio" :label="0">关闭</el-radio>
    </div>

    <el-table :data="formData" stripe>
      <el-table-column prop="id" label="商品ID" width="80"></el-table-column>
      <el-table-column prop="barCode" label="商品条形码"></el-table-column>
      <el-table-column prop="brandName" label="商品品牌"></el-table-column>
      <el-table-column prop="name" label="商品名称" min-width="150"></el-table-column>
      <el-table-column label="商品图片">
        <template slot-scope="scope">
          <div class="imgBox">
            <img :src="scope.row.goodsIcon" alt="img">
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="categorys" label="商品类目" min-width="150"></el-table-column>
      <!-- <el-table-column prop="id" label="供价"></el-table-column> -->
      <el-table-column prop="salePrice" label="售价"></el-table-column>
      <!-- <el-table-column prop="" label="当前售价"></el-table-column> -->
      <el-table-column prop="totalStock" label="剩余库存"></el-table-column>
      <el-table-column prop="saleCount" label="历史销量"></el-table-column>
      <el-table-column label="操作" width="60">
        <template slot-scope="scope">
          <el-button type="text" @click="setDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="count">
      <span>（{{formData.length}} / 6）</span>
    </div>

    <div class="add">
      <el-button type="primary" @click="addBtn">添加橱窗商品</el-button>
    </div>

    <GoodsSelect :isShow.sync="visible" :onSubmit="addWindowGoods"></GoodsSelect>
  </div>
</template>

<script>
  import {
    isOpenShopWindow,
    getShopWindowList,
    setDelShopWindow,
    setMultiWindow
  } from '@/api/design.js'
  import GoodsSelect from '@/components/GoodsSelect/index'

  export default {
    components: { GoodsSelect },
    data() {
      return {
        radio: 2, // 开启 关闭
        formData: [],
        visible: false
      }
    },
    created() {
      this.getWindowList()
    },
    watch: {
      radio(val, oldVal) {
        if (oldVal !== 2) {
          this.isOpenWindow(this.radio)
        }
      }
    },
    methods: {
      // 获取橱窗商品列表
      getWindowList() {
        getShopWindowList().then(res => {
          if (!res.data.windowGoodsList) {
            res.data.windowGoodsList = []
          }
          this.formData = res.data.windowGoodsList
          this.radio = res.data.shopDo.windowStatus
        })
      },
      // 开启 关闭
      isOpenWindow(type) {
        const text = type ? '已开启' : '已关闭'
        const params = {
          windowStatus: type
        }
        isOpenShopWindow(params).then(res => {
          this.$message({ type: 'success', message: text })
        })
      },
      // 删除
      setDelete(id) {
        this.$confirm('确定删除该橱窗商品?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const params = {
            goodsId: id
          }
          setDelShopWindow(params).then(res => {
            this.$message({ type: 'success', message: '删除成功' })
            this.getWindowList()
          })
        }).catch(() => {})
      },
      // 添加
      addBtn() {
        this.visible = true
      },
      addWindowGoods(data) {
        const ids = data.map(v => v.id)
        const params = {
          goodsIds: ids.join()
        }
        setMultiWindow(params).then(res => {
          this.$message({ type: 'success', message: '橱窗商品添加成功' })
          this.getWindowList()
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .shopWindow {
    padding: 20px;
  }

  .el-table {
    padding-top: 20px;
  }

  .count {
    padding: 20px 0 20px;
  }

  .imgBox {
    img {
      max-height: 60px;
      max-width: 80px;
    }
  }
</style>
