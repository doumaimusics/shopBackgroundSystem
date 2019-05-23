<template>
<div>
  <el-button type="primary" v-if="tableData.length<10" @click="addAdmin">新建子账号</el-button><span style="margin-left:30px">子账号数量：{{tableData.length}}/10</span>
  <el-table
    :data="tableData"
  >
    <el-table-column
      prop="username"
      label="账号名"
      width="150">
    </el-table-column>
    <el-table-column
      prop="realname"
      label="使用者"
      width="100">
    </el-table-column>
    <el-table-column
      prop="roots"
      :formatter="changeTxt"
      label="权限">
    </el-table-column>
    <el-table-column
      prop="status"
      label="状态"
      :formatter="changeTxt"
      width="100">
    </el-table-column> 
    <el-table-column
      prop="date"
      label="操作"
      width="400">
      <template slot-scope="scope">
        <el-button
          size="mini"
          type="primary"
          @click="updateStatus(scope.row)">{{(scope.row.status=='Y')?'关闭':'开启'}}</el-button>
        <el-button
          size="mini"
          @click="handleEdit(scope.row)">编辑</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog :title="diaTitle" @close="init" v-if="showDialog" :visible.sync="showDialog" append-to-body :close-on-click-modal="false" width="700px">
    <addEdit :title="diaTitle" :editdata="editForm" v-on:visible='changeFn'></addEdit>
  </el-dialog>

</div>
</template>
<style lang="scss" scoped>
  .el-table {
    margin-top: 20px;
  }
</style>

<script>
  import addEdit from './addEdit'
  import { adminList, updateStatus, deleteAdmin } from '@/api/settings'
  export default {
    components: { addEdit },
    data() {
      return {
        form: {
          name: '',
          phone: '1231231',
          desc: ''
        },
        tableData: [],
        showDialog: false,
        diaTitle: '新建子账号',
        editForm: {}
      }
    },
    created() {
      this.init()
    },
    methods: {
      changeTxt(row, column, cellValue, index) {
        const checks = [
          { name: '店铺管理', id: '1' },
          { name: '店铺装修', id: '2' },
          { name: '商品管理', id: '3' },
          { name: '交易管理', id: '4' },
          { name: '结算管理', id: '5' },
          { name: '店铺促销', id: '6' },
          { name: '数据中心', id: '7' }
        ]
        if (cellValue === 'Y') {
          return '已开启'
        } else if (cellValue === 'N') {
          return '已关闭'
        } else {
          const arrTxt = []
          checks.filter((val) => {
            cellValue.find((data) => {
              if (data == val.id) {
                arrTxt.push(val.name + ' ')
              }
            })
          })
          return arrTxt
        }
      },
      async init() {
        const self = this
        await adminList().then((res) => {
          self.tableData = res.data.userDoList
        })
      },
      async updateStatus(row) {
        const self = this
        const data = {
          id: row.id,
          status: (row.status === 'Y') ? 'N' : 'Y'
        }
        await updateStatus(data).then((res) => {
          self.init()
        })
      },
      async handleDelete(row) {
        await this.$confirm('确认删除该账号?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const self = this
          const data = {
            id: row.id
          }
          deleteAdmin(data).then((res) => {
            self.init()
          })
        }).catch(() => {})
      },
      addAdmin() {
        this.editForm = {
          roots: ['1', '2', '3', '4', '5', '6', '7']
        }
        this.diaTitle = '新建子账号'
        this.showDialog = true
      },
      handleEdit(row) {
        this.editForm = row
        this.editForm.password = null
        this.diaTitle = '编辑子账号'
        this.showDialog = true
      },
      onSubmit() {
        console.log('submit!')
      },
      changeFn() {
        this.showDialog = false
        this.init()
      }
    }
  }
</script>