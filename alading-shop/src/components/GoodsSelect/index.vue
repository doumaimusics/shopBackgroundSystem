/**
 * Created by hanxueqiang on 2018/12/11
 *
 * 商品选择 公共组件
 * 取上架中且通过审核的商品
 */
<template>
  <div class="goodsSelect">
    <el-dialog
      title="选择商品"
      :visible.sync="visible"
      append-to-body
      width="90%"
      @close="onCancel"
      top="5vh"
      :close-on-click-modal="false"
    >
      <shop-search :getsearch="getsearch" :isSelect="true"></shop-search>

      <shop-proTable
        ref="proTable"
        v-if="visible"
        :searchdata="searchData"
        :isSelect="true"
        :selectedData="selectedData"
        :replace="replace"
      ></shop-proTable>

      <div class="btn">
        <el-button type="default" @click="onCancel">取消</el-button>
        <el-button type="primary" @click="submit">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ShopSearch from '@/views/product/components/search'
import ShopProTable from '@/views/product/components/proTable'

export default {
  name: 'GoodsSelect',

  components: { ShopSearch, ShopProTable },

  props: {
    isShow: {
      // 控制模态框的开启关闭(需添加.sync修饰符)
      type: Boolean,
      required: true
    },
    onSubmit: {
      // 保存按钮回调函数(提交已选数据给父组件)
      type: Function,
      default() { return new Function() }
    },
    limitCount: {
      // 限制选择的数量(不传或传0表示无限制)
      type: Number
    },
    selectedData: {
      // 已选中项数据(包含商品id属性的对象组成的数组)
      type: Array,
      default() {
        return []
      }
    },
    replace: {
      // 接口替换
      type: Object,
      default() {
        return {
          api: null, // 替换后的接口函数
          params: {} // 额外的接口参数
        }
      }
    }
  },

  data() {
    return {
      searchParams: {
        verifyStatus: 4, // 审核通过
        status: 1 // 出售中列表
      }
    }
  },

  computed: {
    searchData() {
      return { ...this.searchParams }
    },
    visible: {
      get() {
        return this.isShow
      },
      set() {}
    }
  },

  methods: {
    // 搜索筛选
    getsearch(param) {
      param.status = 1
      param.verifyStatus = 4
      this.searchParams = JSON.parse(JSON.stringify(param))
    },
    // 取消
    onCancel() {
      this.$emit('update:isShow', false)
    },
    // 确定
    submit() {
      const data = this.$refs.proTable.multipleSelectionAll
      if (data.length <= 0) {
        this.$message({ type: 'warning', message: '请选择商品' })
        return
      }
      if (this.limitCount && data.length > this.limitCount) {
        this.$message({
          type: 'warning',
          message: `最多选择${this.limitCount}项`
        })
        return
      }
      this.onSubmit(data)
      this.onCancel()
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .el-upload-list--text {
  display: none;
}
.ald-pagination {
  margin-top: 20px;
  float: right;
}
/deep/ .tableimg {
  width: auto;
  max-height: 60px;
}
.operation {
  padding-bottom: 10px;
  border-bottom: 1px solid #b6c0d4;
}
.btn {
  text-align: right;
  padding: 10px 70px 10px 0;
}
/deep/ .el-dialog__body {
  padding: 10px 20px;
}
</style>
