<template>
  <div class="designIndex">
    <div class="newTempl">
      <el-button type="primary" @click="showTemplDialog('dialogForm')">新建模板</el-button>
    </div>

    <el-table :data="tableData" stripe>
      <el-table-column prop="name" label="首页模板名称"></el-table-column>
      <el-table-column prop="date" label="更新时间"></el-table-column>
      <el-table-column prop="status" label="状态"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="goPage('1', scope.row.id)">预览</el-button> 
          <el-button type="text" @click="onPublic(scope.row)" :disabled="scope.status==='未发布'">发布</el-button>
          <el-button type="text" @click="goPage('3', scope.row.id)">装修</el-button>
          <el-button type="text" @click="onDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 对话框 -->
    <el-dialog 
      title="新建模板" 
      :visible.sync="dialogVisible" 
      class="templDialog"
      :close-on-click-modal="false"
    >
      <el-form :model="dialogForm" ref="dialogForm">
        <el-form-item 
          label="模板名称：" 
          prop="title"
          class="templTitle"
          :rules="{ required: true, message: '请填写模板名称', trigger: 'blur' }"
        >
          <el-input type="text" v-model="dialogForm.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item class="btn">
          <el-button type="default" @click="dialogVisible=false">取消</el-button>
          <el-button type="primary" @click="newTemplate('dialogForm')">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getShopTempl,
    setNewTempl,
    setPublicTempl,
    setDeleteTempl
  } from '@/api/design'

  export default {
    data() {
      return {
        tableData: [
          { id: 1, name: '默认', date: '2012-11-12 00:00:00', status: 1 },
          { id: 2, name: '默认', date: '2012-11-12 00:00:00', status: 0 },
          { id: 3, name: '默认', date: '2012-11-12 00:00:00', status: 0 }
        ],

        dialogVisible: false,
        dialogForm: { title: '' }
      }
    },
    created() {
      this.getTempl()
    },
    methods: {
      // 获取店铺模板数据
      getTempl() {
        getShopTempl().then(res => {
          this.tableData = res.data
          this.tableData.forEach(v => {
            if (v.status === 1) {
              v.status = '已发布'
            } else if (v.status === 0) {
              v.status = '未发布'
            }
          })
        })
      },
      // 弹出新建模板对话框
      showTemplDialog(formName) {
        this.dialogVisible = true
        this.$nextTick(() => {
          this.$refs[formName].resetFields()
        })
      },
      // 保存新建模板
      newTemplate(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.dialogVisible = false
            const params = {}
            setNewTempl(params).then(res => {
              this.$message({ type: 'success', message: '新建模板成功' })
            })
          }
        })
      },
      // 路由跳转
      goPage(type, id) {
        console.log(id)
        if (type === '1') {
          this.$router.push({
            name: 'previewTemplate',
            query: { id }
          })
        } else if (type === '3') {
          this.$router.push({
            name: 'designTemplate',
            query: { id }
          })
        }
      },
      // 发布
      onPublic(scope) {
        const params = {
          id: scope.id
        }
        setPublicTempl(params).then(res => {
          this.$message({ type: 'success', message: '发布成功' })
          this.getTempl()
        })
      },
      // 删除
      onDelete(id) {
        const params = { id }
        setDeleteTempl(params).then(res => {
          this.$message({ type: 'success', message: '删除成功' })
          this.getTempl()
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .designIndex {
    padding: 20px;
  }

  .newTempl {
    padding-bottom: 10px;
  }

  .templDialog {
    /deep/ .el-dialog {
      width: 500px;
    }
    /deep/ .el-form-item__content {
      margin-left: 100px;
      width: 300px;
    }
    .btn {
      text-align: right;
    }
  }
</style>