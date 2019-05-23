<template>
  <div class="couponSearch">
    <el-form :model="searchData" :rules="rules">
      <el-form-item label="活动名称：">
        <el-input v-model="searchData.name" placeholder="请输入优惠券名称"></el-input>
      </el-form-item>

      <el-form-item label="活动类型：">
        <el-select v-model="searchData.type">
          <el-option
            v-for="item in typeData"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="生效状态：">
        <el-select v-model="searchData.enable">
          <el-option
            v-for="item in enableData"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="btn">
      <el-button type="primary" @click="onSearch">查询</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        searchData: {
          name: '',
          type: '',
          enable: ''
        },
        rules: {},
        typeData: [
          { label: '全部', value: '' },
          { label: '满N元减M元', value: 'AMOUNT' },
          { label: '满N件减M元', value: 'COUNT' },
          { label: '满N元打M折', value: 'AMOUNTDISCOUNT' },
          { label: '满N件打M折', value: 'COUNTDISCOUNT' },
          { label: '满N元任选M件', value: 'AMOUNTCOUNT' },
          { label: '满N件减M件', value: 'COUNTAMOUNT' }
        ],
        enableData: [
          { label: '全部', value: '' },
          { label: '生效', value: true },
          { label: '不生效', value: false }
        ]
      }
    },

    created() {

    },

    methods: {
      onSearch() {
        this.$emit('getSearchData', this.searchData)
      }
    }
  }
</script>

<style lang="less" scoped>
  .couponSearch {
    display: flex;

    .el-form {
      // flex: 3;
      display: flex;
      flex-wrap: wrap;

      /deep/ label {
        width: 90px;
      }
      /deep/ .el-form-item {
        width: 260px;
        padding-right: 10px;
      }
      /deep/ .el-form-item__content {
        padding-left: 91px;
      }
    }
    .btn {
      // flex: 1;
      padding-left: 40px;
    }
  }
</style>
