<template>
  <div class="AreaDialog">
    <div v-for="(item, i) in data" :key="item.value" class="area">
      <div>
        <el-checkbox 
          :indeterminate="isIndeterminate['isIndeterminate'+i]" 
          v-model="checkAll['checkAll'+i]"
          @change="handleCheckAllChange(i)"
        >{{item.label}}</el-checkbox>
      </div>
      <div class="city">
        <el-checkbox-group v-model="checkedCities['checkedCities'+i]" @change="handleCheckedCitiesChange(i)">
          <el-checkbox v-for="city in item.children" :label="city.label" :key="city.value">{{city.label}}</el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <div class="btn">
      <el-button type="default" @click="cancel">取消</el-button>
      <el-button type="primary" @click="confirm">确定</el-button>
    </div>
  </div>
</template>

<script>
  import wuliuInfo from '@/views/settings/wuliuData.js'

  // 初始化数据
  function initData() {
    const data = JSON.parse(JSON.stringify(wuliuInfo))
    const isIndeterminate = {}
    const checkAll = {}
    const checkedCities = {}
    data.forEach((v, i) => {
      if (i < data.length - 1) {
        v.children.splice(0, 1)
      }
      isIndeterminate[`isIndeterminate${i}`] = false
      checkAll[`checkAll${i}`] = false
      checkedCities[`checkedCities${i}`] = []
    })
    return {
      data,
      isIndeterminate,
      checkAll,
      checkedCities
    }
  }

  export default {
    props: [],

    data() {
      return {
        data: initData().data,
        isIndeterminate: initData().isIndeterminate, // 半选状态
        checkAll: initData().checkAll, // 全选状态
        checkedCities: initData().checkedCities // 已选城市
      }
    },

    created() {

    },

    methods: {
      // 重置数据
      reset() {
        this.isIndeterminate = initData().isIndeterminate
        this.checkAll = initData().checkAll
        this.checkedCities = initData().checkedCities
      },
      // 全选反选
      handleCheckAllChange(i) {
        this.checkedCities['checkedCities' + i] = this.checkAll['checkAll' + i] ? this.data[i].children.map(v => v.value) : []
        this.isIndeterminate[`isIndeterminate${i}`] = false
      },
      // 单个选择
      handleCheckedCitiesChange(i) {
        const checkedCount = this.checkedCities['checkedCities' + i].length
        this.checkAll['checkAll' + i] = checkedCount === this.data[i].children.length
        this.isIndeterminate['isIndeterminate' + i] = checkedCount > 0 && checkedCount < this.data[i].children.length
      },
      // 取消
      cancel() {
        this.$emit('addArea', { type: 0 })
      },
      // 确定
      confirm() {
        let arr = []
        Object.keys(this.checkedCities).forEach((v, i) => {
          arr = arr.concat(this.checkedCities[v])
        })
        if (arr.length === 0) {
          this.$message({ type: 'warning', message: '请选择城市' })
          return
        }
        this.$emit('addArea', { type: 0, data: arr })
      }
    }
  }
</script>

<style lang="less" scoped>
  .area {
    padding-bottom: 10px;

    > div:first-child {
      padding-bottom: 5px;
    }
  }
  .city {
    padding-left: 50px;

    .el-checkbox {
      width: 110px;
      margin-left: 0;
      margin-right: 30px;
      margin-bottom: 5px;
    }
  }
  .btn {
    text-align: right;
    padding-right: 50px;
  }
</style>