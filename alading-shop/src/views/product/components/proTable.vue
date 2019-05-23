<template>
  <div>
    <el-table
      :data="tableData" stripe style="width: 100%"
      v-loading="loading"
      @selection-change="handleSelectionChange"
      ref="table"
    >
      <el-table-column prop="" label="选择" type="selection" width="30"></el-table-column>
      <el-table-column prop="id" label="商品ID" min-width="70"></el-table-column>
      <el-table-column prop="barCode" label="商品条形码" min-width="90"></el-table-column>
      <el-table-column prop="brandName" label="商品品牌" v-if="shopType!==3"></el-table-column>
      <el-table-column prop="name" label="商品名称" :formatter="compatible" min-width="100"></el-table-column>
      <el-table-column label="商品图片">
        <template slot-scope="scope">
          <img :src="scope.row.goodsIcon || 'http://e.hiphotos.baidu.com/image/pic/item/b151f8198618367a2e8a46ee23738bd4b31ce586.jpg'" class="tableimg"/>
        </template>
      </el-table-column>
      <el-table-column prop="categorys" label="商品类目" min-width="100"></el-table-column>
      <el-table-column prop="salePrice" label="售价"></el-table-column>
      <el-table-column prop="totalStock" label="剩余库存" :formatter="compatible"></el-table-column>
      <el-table-column prop="saleCount" label="历史销量"></el-table-column>
      <!-- <el-table-column prop="verifyStatus" label="商品状态"></el-table-column> -->
      <el-table-column label="商品状态" min-width="90" v-if="!isSelect">
        <template slot-scope="scope">
          <el-popover
            v-if="scope.row.verifyStatus===3"
            placement="top-start"
            title="失败原因"
            width="200"
            trigger="hover"
            :content="scope.row.verifyReason"
          ><a slot="reference">{{scope.row.verifyStatus | verifyStatusTrans}}</a></el-popover>
          <a v-else>{{scope.row.verifyStatus | verifyStatusTrans}}</a>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="210" fixed="right" v-if="!isSelect">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="preview(scope.row)"
          >预览</el-button>
          <el-button
            type="text"
            @click="handleEdit(scope.$index, scope.row)"
          >编辑</el-button>
          <el-button
            type="text"
            :disabled="scope.row.verifyStatus === undefined"
            @click="shelve([scope.row.id])"
          >{{issale ? '下架' : '上架'}}</el-button>
          <el-button
            v-if="!issale"
            type="text"
            @click="handleDelete([scope.row.id])"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination
      :pageNo="currentPage"
      :pageSize="pageSize"
      :totalCount="totalCount"
      :handleChange="changePage"
    ></Pagination>

    <div class="selectTip">
      已选中<span> {{multipleSelectionAll.length}} </span>款
    </div>

    <div class="btmOperate" v-if="!isSelect">
      <el-button @click="multiOperate(1)" v-if="!issale">批量上架</el-button>
      <el-button @click="multiOperate(2)" v-if="!issale">批量删除</el-button>
      <el-button @click="multiOperate(1)" v-if="issale">批量下架</el-button>
    </div>
  </div>
</template>

<script>
  import { verifyStatusTrans } from '@/filters/transform'
  import {
    getSearchList,
    setShelve,
    setUnShelve,
    deleteGoods
  } from '@/api/product'
  import Pagination from '@/components/Pagination/index'

  export default {
    props: ['searchdata', 'issale', 'isSelect', 'selectedData', 'replace'],
    components: { Pagination },
    data() {
      return {
        tableData: [],
        loading: true,
        pageSize: 20,
        totalCount: 0,
        // totalPage:0,
        currentPage: 1,
        shopType: 3,

        multipleSelection: [],		// 单页多选
        multipleSelectionAll: this.selectedData || [],		// 所有多选
        idKey: 'id'		// 每一行的唯一键字段名
      }
    },

    created() {
      this.getShopType()
      this.changePage(1)
    },

    methods: {
      // 预览
      preview(row) {
        this.$router.push('/product/view?id=' + row.id)
      },
      // 查询表单数据
      searchTable() {
        let searchdata = Object.assign({}, {
          pageSize: this.pageSize,
          currentPage: this.currentPage,
          status: this.issale ? 1 : 0
        }, this.searchdata)
        // set api
        let theApi = null
        if (this.replace && this.replace.api) {
          theApi = this.replace.api
          searchdata = { ...searchdata, ...this.replace.params }
        } else {
          theApi = getSearchList
        }
        // ajax
        theApi(searchdata).then((resp) => {
          if (resp.data.length <= 0 && searchdata.currentPage > 1) {
            this.changePage(1)
            return
          }
          this.loading = false
          this.tableData = resp.data
          this.totalCount = resp.totalCount
          // this.totalPage = resp.totalPage;
          this.$nextTick(() => {
            this.setSelectRow()
          })
        })
      },
      // 分页
      changePage(val) {
        this.currentPage = val
        this.changePageCoreRecordData()
        this.searchTable()
      },
      // 批量操作
      multiOperate(type) {
        if (this.multipleSelectionAll.length === 0) {
          this.$message({
            type: 'warning',
            message: type === 2 ? '请先选择要删除的商品' : this.issale ? '请选择要批量下架的商品' : '请选择要批量上架的商品'
          })
        } else {
          const ids = this.multipleSelectionAll.map((v, i) => {
            return v.id
          })
          type === 2 ? this.handleDelete(ids) : this.shelve(ids)
        }
      },
      // 上架或下架
      shelve(ids) {
        const funApi = this.issale ? setUnShelve : setShelve
        funApi({ ids: JSON.stringify(ids) }).then((resp) => {
          this.changePage(this.currentPage)
          this.$message({
            type: 'success',
            message: this.issale ? '下架成功!' : '上架提交成功，等待审核!'
          })
          this.updateMulti(ids)
        })
      },
      // 删除
      handleDelete(ids) {
        this.$confirm('是否确认删除该商品', '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteGoods({ ids: JSON.stringify(ids) }).then((resp) => {
            this.changePage(this.currentPage)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.updateMulti(ids)
          })
        }).catch(() => {})
      },
      // 批量操作后更新已选项
      updateMulti(ids) {
        if (this.multipleSelectionAll.length === 0) {
          return
        }
        ids.forEach((value, index) => {
          this.multipleSelectionAll.forEach((v, i) => {
            if (v.id === value) {
              this.multipleSelectionAll.splice(i, 1)
            }
          })
          this.multipleSelection.forEach((v, i) => {
            if (v.id === value) {
              this.multipleSelection.splice(i, 1)
            }
          })
        })
      },
      // 对部分脏数据进行容错处理
      compatible(row, column, cellValue, index) {
        return cellValue || '0'
      },
      // 跳转编辑页
      handleEdit(idx, row) {
        this.$router.push('/product/edit?id=' + row.id)
      },
      // 获取店铺类型
      getShopType() {
        this.shopType = this.$store.getters.shopinfo.shopType
      },
      // 多选
      handleSelectionChange(val) {
        this.multipleSelection = val
        // 实时记录选中的数据
        setTimeout(() => {
          this.changePageCoreRecordData()
        // console.log(this.multipleSelectionAll);
        }, 50)
      },
      // 设置当前页的已选中状态
      setSelectRow() {
        if (!this.multipleSelectionAll) {
          return
        }
        // 标识当前行的唯一键的字段名
        const idKey = this.idKey

        // 所有已选中的id集合
        const selectAllIds = []
        this.multipleSelectionAll.forEach(row => {
          selectAllIds.push(row[idKey])
        })

        // 遍历该页tableData, 设置已选中状态
        this.$refs.table.clearSelection()
        this.tableData.forEach(row => {
          if (selectAllIds.indexOf(row[idKey]) >= 0) {
            this.$refs.table.toggleRowSelection(row, true)
          }
        })
      },
      // 记录更新全部多选项
      changePageCoreRecordData() {
      // 标识当前行的唯一键的字段名
        const idKey = this.idKey
        if (this.multipleSelectionAll.length <= 0) {
          this.multipleSelectionAll = this.multipleSelection
          return
        }
        // 全部多选里的id集合
        const selectAllIds = []
        this.multipleSelectionAll.forEach(row => {
          selectAllIds.push(row[idKey])
        })
        // 当前页多选里的id集合
        const selectIds = []
        this.multipleSelection.forEach(row => {
          selectIds.push(row[idKey])
          // 如果全部多选里不包含当前页选中的数据，那么就加入到全部多选集合里
          if (selectAllIds.indexOf(row[idKey]) < 0) {
            this.multipleSelectionAll.push(row)
          }
        })
        // 当前页多选里 未选择项的id集合
        const noSelectIds = []
        this.tableData.forEach(row => {
          if (selectIds.indexOf(row[idKey]) < 0) {
            noSelectIds.push(row[idKey])
          }
        })
        // 更新全部多选项集合
        this.multipleSelectionAll = this.multipleSelectionAll.filter(row => {
          return noSelectIds.indexOf(row[idKey]) < 0
        })
      }
    },

    watch: {
      searchdata: {
        immediate: false,
        handler: function() {
          this.changePage(1)
          this.multipleSelection = []
          this.multipleSelectionAll = []
        }
      }
    },

    filters: {
      verifyStatusTrans
    }
  }
</script>

<style lang="scss" scoped>
  .btmOperate{
    margin-top:20px;
  }
  /deep/ a, a:hover {
    color: #66b1ff;
  }
  .selectTip {
    margin-top: 10px;
    color: #606266;

    span {
      color: #409EFF;
    }
  }
</style>

