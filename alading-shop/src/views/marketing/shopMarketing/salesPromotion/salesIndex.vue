<template>
	<div class="salesIndex">
		<el-form :inline="true" :model="salesFormData" class="salesForm">
			<el-form-item label="活动名称：">
				<el-input v-model="salesFormData.name" placeholder="请输入活动名称"></el-input>
			</el-form-item>
			<el-form-item label="状态：">
				<el-select v-model="salesFormData.seckillStatus" placeholder="全部">
					<el-option
						v-for="item in seckillStatusList"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="onSearch" class="searchBtn">查询</el-button>
			</el-form-item>
		</el-form>

		<div class="btn">
			<el-button type="primary" @click="onAdd">新增</el-button>
		</div>

		<!-- 表格 -->
		<el-table class="listTable" :data="tableData" stripe style="width: 100%">
			<el-table-column prop="id" label="活动ID" min-width="125"></el-table-column>
			<el-table-column prop="name" label="活动名称" min-width="125"></el-table-column>
			<el-table-column prop="goodsCount" label="活动商品" min-width="125"></el-table-column>
			<el-table-column prop="date" label="有效期" min-width="220"></el-table-column>
			<el-table-column prop="seckillStatus" label="状态" min-width="100"></el-table-column>
			<el-table-column prop="isDisable" label="启用状态" min-width="100"></el-table-column>
			<el-table-column label="操作" min-width="200">
				<template slot-scope="scope">
					<el-button @click="edit(scope.row)" type="text">编辑</el-button>
					<el-button @click="openOrClose(scope.row)" type="text">
						{{scope.row.isDisable==='已启用'?'禁用':'启用'}}
					</el-button>
					<el-button
						@click="restart(scope.row)"
						type="text"
						v-if="scope.row.seckillStatus==='已过期'"
					>一键重启</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!-- 分页 -->
    <Pagination
      :pageNo="pagination.currentPage"
      :pageSize="pagination.pageSize"
      :totalCount="pagination.totalCount"
      :handleChange="handleCurrentChange"
    ></Pagination>

		<!--一键重启弹窗弹窗-->
		<el-dialog title="一键重启" :visible.sync="restartVisible" width="580px" class="restart">
			<el-form :model="restartFormData" :rules="restartRule" ref="restartForm">
				<el-form-item label="活动时间:" prop="timeRange">
					<el-date-picker
						type="datetimerange"
						v-model="restartFormData.timeRange"
						range-separator="至"
						start-placeholder="开始日期"
						end-placeholder="结束日期">
					></el-date-picker>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="restartVisible = false">取 消</el-button>
				<el-button type="primary" @click="submitTime('restartForm')">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
  import {
    getSalesFormData,
    setActivityUpdate
  } from '@/api/marketing'
  import { salesStatusTrans } from '@/filters/transform'
  import Pagination from '@/components/Pagination/index'

  export default {
    components: { Pagination },
    data() {
      const checkTime = (rule, value, callback) => {
        if (!value || value.length <= 0) {
          return callback(new Error('请选择时间'))
        }
        // else if (value[0].getTime() < new Date().getTime()) {
        // }
        callback()
      }

      return {
        salesFormData: {
          // 搜索筛选数据
          name: '',
          seckillStatus: '0' // 1 2 3
        },
        tableData: [], // 列表数据

        restartVisible: false, // 一键重启
        restartFormData: {
          timeRange: []
        },
        restartRule: {
          timeRange: [{ validator: checkTime, trigger: 'change' }]
        },

        pagination: {
          currentPage: 1, // 分页数据
          pageSize: 20,
          totalCount: 0
        },

        loading: false,

        id: '',	// 一键重启记录id
        seckillStatusList: [
          { label: 0, value: '0' },
          { label: 1, value: '1' },
          { label: 2, value: '2' },
          { label: 3, value: '3' }
        ]
      }
    },

    created() {
      this.initTableList(false)
      this.seckillStatusList.forEach(v => {
        v.label = salesStatusTrans(v.label)
      })
    },

    methods: {
      // 初始化
      initTableList(flag) {
        this.loading = true
        const params = {
          name: this.salesFormData.name,
          //   return callback(new Error('开始时间不能小于当前时间'))
          seckillStatus: this.salesFormData.seckillStatus
        }
        // flag区分搜索筛选和分页跳转及页面刷新操作
        if (flag) {
          params.pageNo = this.pagination.currentPage
        } else {
          params.pageNo = 1
        }

        getSalesFormData(params).then(res => {
          const data = [...res.data]
          data.forEach((v, i) => {
            v.isDisable = v.isDisable ? '已禁用' : '已启用' // 0 已启用， 1 已禁用
            v.date = `${v.gmtStartTime} 至 ${v.gmtEndTime}`
            v.seckillStatus = salesStatusTrans(v.seckillStatus)
          })

          this.tableData = data
          this.pagination.totalCount = res.totalCount
          this.pagination.pageSize = res.pageSize
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      },
      // 搜索筛选
      onSearch() {
        this.handleCurrentChange(1)
      },
      onAdd() {
        this.$router.push({ name: 'addActivity' })
      },
      // 编辑
      edit(data) {
        this.$router.push({
          name: 'editActivity',
          params: {
            id: data.id
          }
        })
      },
      // 启用或禁用
      openOrClose(data) {
        const params = {
          id: data.id
        }
        let mess = ''
        if (data.isDisable === '已启用') {
          params.isDisable = 1
          mess = '禁用成功'
        } else {
          params.isDisable = 0
          mess = '启用成功'
        }
        setActivityUpdate(params)
          .then(res => {
            this.$message({ message: mess, type: 'success' })
            this.handleCurrentChange(this.pagination.currentPage)
          })
      },
      // 一键重启
      restart(data) {
        this.restartVisible = true
        this.restartFormData.timeRange = []
        this.id = data.id
      },
      // 一键重启提交
      submitTime(refName) {
        this.$refs[refName].validate(valid => {
          if (valid) {
            const params = {
              id: this.id,
              gmtStartTime: this.restartFormData.timeRange[0].getTime(),
              gmtEndTime: this.restartFormData.timeRange[1].getTime(),
              isDisable: 0
            }
            setActivityUpdate(params).then(res => {
              this.$message({ message: '一键重启成功', type: 'success' })
              this.handleCurrentChange(this.pagination.currentPage)
            })
            this.restartVisible = false
          }
        })
      },
      // 处理分页
      handleCurrentChange(val) {
        this.pagination.currentPage = val
        this.initTableList(true)
      }
      /* clearLocalStorage() {
        localStorage.removeItem('setActivity')
        localStorage.removeItem('selectedGoodsList')
      } */
    }

  }
</script>

<style lang="less" scoped>
	.salesIndex {
		padding: 20px;

		b {
			display: block;
			padding-bottom: 15px;
		}
		.listTable .el-table th .cell {
			text-align: center !important;
		}
		.el-form-item {
			display: inline-block;
    }
    .searchBtn {
      margin-left: 30px;
    }
	}
	.restart {
		/deep/ .el-form-item__content {
			padding-left: 80px;
		}
	}
	.btn {
		padding-bottom: 10px;
	}
</style>
