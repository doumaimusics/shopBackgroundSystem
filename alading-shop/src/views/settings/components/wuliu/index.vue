<template>
  <div>
    <el-button type="primary" @click="addWuliu">新增物流模板</el-button>

    <template v-for="(item,index) of tableData">
      <el-table
        :data="item.freight"
        border
        style="width: 601px;margin-top:20px" 
        :key="'t'+index"
      >
        <el-table-column :label="item.template_name+' （最后编辑时间：'+item.date+'）'">
          <el-table-column
            prop="name"
            label="运送到"
            width="400" >
          </el-table-column>
          <el-table-column
            prop="count"
            label="运费"
            width="200">
          </el-table-column>
        </el-table-column>
      </el-table>
      <el-button :key="'e'+index" @click="editFn(item.id)">编辑</el-button>
      <el-button type="danger" :key="'d'+index" @click="delFn(item.id)">删除</el-button>
    </template>

    <!-- 空标签 解决没有物流模板时添加第一个物流模板后DOM不自动更新的问题 -->
    <div></div>
    
    <el-dialog title="新增物流模板" :visible.sync="addShow" v-if="addShow" append-to-body :close-on-click-modal="false" width="650px">
      <editWuliu 
        @visible='close' 
        :templateNameList="templateNameList"
        :isAdd="true"
      ></editWuliu>
    </el-dialog>

    <el-dialog title="编辑物流模板" :visible.sync="editShow" v-if="editShow" append-to-body :close-on-click-modal="false" width="650px">
      <editWuliu 
        @visible='close' 
        :id="id"
        :isEdit="true"
      ></editWuliu>
    </el-dialog>
  </div>
</template>

<script>
  import editWuliu from './editWuliu'
  import {
    goTemplatePage,
    deleteLogistics
  } from '@/api/settings'

  export default {
    components: { editWuliu },
    data() {
      return {
        addShow: false,
        editShow: false,
        id: '',
        form: {
          name: '',
          phone: '1231231',
          desc: ''
        },
        tableData: [],

        templateNameList: {} // 存储所有物流模板名
      }
    },
    created() {
      this.init()
    },
    methods: {
      async init() {
        await goTemplatePage().then((res) => {
          for (let i = 0; i < res.data.length; i++) {
            try {
              res.data[i].freight = eval('(' + res.data[i].freight + ')')
              this.templateNameList[res.data[i].template_name] = true
            } catch (e) {
              res.data[i].freight = []
            }
          }
          this.tableData = res.data
        })
      },
      onSubmit() {
        console.log('submit!')
      },
      addWuliu() {
        this.addShow = true
      },
      editFn(id) {
        this.id = id
        this.editShow = true
      },
      async delFn(id) {
        this.$confirm('此操作将删除物流模板, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteLogistics({ id: id }).then(() => {
            this.init()
            this.$message({ type: 'success', message: '删除成功!' })
          })
        }).catch(() => {})
      },
      close() {
        this.addShow = false
        this.editShow = false
        this.init()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .el-table {
    margin-bottom: 5px;

    /deep/ thead {
      tr:first-child {
        th {
          background-color: #ECF5FF;
          border-top: 1px solid #E4E7ED;
        }
      }
      tr:nth-child(2) {
        th {
          background-color: #fff;
        }
      }
    }
  }
  /deep/ .el-dialog__body {
    padding-top: 10px;
  }
</style>
