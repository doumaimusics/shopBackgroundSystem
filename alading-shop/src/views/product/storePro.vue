<template>
  <div style="padding:20px">
    <search :getsearch="getsearch"></search>
    <pro-table :searchdata="searchdata"></pro-table>
  </div>
</template>
<script>
  import search from '@/views/product/components/search'
  import proTable from '@/views/product/components/proTable'

  export default {
    components: {
      search,
      proTable
    },
    data() {
      return {
        searchdata: {}
        // rid:'',
        // visible: false,
        // loading: false,
        // btnloading:  false,
        // currentPage: 1,
        // pageSize: 10,
        // headers:{
        //   'token': localStorage.getItem('token')
        // }
      }
    },
    methods: {
      getsearch(param) {
        this.searchdata = JSON.parse(JSON.stringify(Object.assign({}, param)))
      }
    }
  }
</script>

<style lang="scss" scoped>
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
</style>


