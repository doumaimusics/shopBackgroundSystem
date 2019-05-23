/**
 * el-pagination分页 公共组件
 *
 * Created by hanxueqiang on 2018/12/14
 */
<template>
  <div class="pagination">
    <el-pagination
      background
      layout="total,prev,pager,next,jumper"
      :current-page.sync="currentPage"
      :page-size="pageSize"
      :total="totalCount"
      @current-change="changePage"
    ></el-pagination>
  </div>
</template>

<script>
  export default {
    props: {
      pageNo: { // 当前页页码
        type: Number,
        default: 1,
        required: true
      },
      totalCount: { // 数据总条数
        type: Number,
        default: 0,
        required: true
      },
      pageSize: { // 每页数据条数
        type: Number,
        default: 20
      },
      handleChange: { // 页面跳转事件(等同于el-pagination的跳转事件)
        type: Function,
        default() { return new Function() }
      }
    },
    computed: {
      currentPage: {
        get() { return this.pageNo },
        set() {}
      }
    },
    methods: {
      changePage(val) {
        this.handleChange(val)
      }
    }
  }
</script>

<style lang="less" scoped>
  .pagination {
    padding-top: 15px;
    text-align: center;
  }
</style>
