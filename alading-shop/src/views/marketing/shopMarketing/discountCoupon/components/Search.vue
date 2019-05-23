<template>
  <div class="couponSearch">
    <el-form :model="searchData" :rules="rules">
      <el-form-item label="优惠券名称：">
        <el-input v-model="searchData.name" placeholder="请输入优惠券名称"></el-input>
      </el-form-item>

      <el-form-item label="状态：">
        <el-select v-model="searchData.startStatus">
          <el-option
            v-for="item in startStatusList"
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
  import { couponStatusTrans } from '@/filters/transform'

  export default {
    data() {
      return {
        searchData: {
          name: '',
          startStatus: '0'
        },
        rules: {},
        startStatusList: [
          { label: 0, value: '0' },
          { label: 1, value: '1' },
          { label: 2, value: '2' },
          { label: 3, value: '3' }
        ]
      }
    },

    created() {
      this.startStatusList.forEach(v => {
        v.label = couponStatusTrans(v.label)
      })
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

      /deep/ label {
        width: 100px;
      }
      /deep/ .el-form-item__content {
        padding-left: 101px;
      }
      .el-input {
        width: 200px;
      }
    }
    .btn {
      // flex: 1;
      padding-left: 40px;
    }
  }
</style>