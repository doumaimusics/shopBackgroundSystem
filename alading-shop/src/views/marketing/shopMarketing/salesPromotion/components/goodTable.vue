<template>
	<div class="goodSelectBox">
		<el-button class="setBtn" type="primary" @click="showDialog">批量设置活动价格</el-button>
		<el-button
			class="setBtn"
			v-if="isManageActivity"
			type="primary"
			@click="addBtn"
		>新增活动商品</el-button>

		<!-- 表格 -->
		<el-form :model="model" :rules="model.rules" ref="checkForm">
			<el-table :data="model.tableData" stripe>
				<el-table-column prop="goodsId" label="商品ID"></el-table-column>
				<el-table-column prop="name" label="商品" min-width="150"></el-table-column>
				<el-table-column prop="specNames" label="规格" min-width="100"></el-table-column>
				<el-table-column prop="actualAmount" label="售价"></el-table-column>
				<el-table-column prop="stock" label="剩余库存"></el-table-column>
				<el-table-column label="活动价格">
					<template slot-scope="scope">
							<el-form-item :prop="'tableData.'+scope.$index+'.specialPrice'" :rules="model.rules.specialPrice">
								<el-input type="number" size="small" v-model="scope.row.specialPrice"></el-input>
							</el-form-item>
					</template>
				</el-table-column>
				<!-- <el-table-column label="活动库存">
					<template slot-scope="scope">
							<el-form-item :prop="'tableData.'+scope.$index+'.limitCount'" :rules="model.rules.limitCount">
								<el-input type="number" size="small" v-model="scope.row.limitCount"></el-input>
							</el-form-item>
					</template>
				</el-table-column> -->
				<el-table-column label="操作">
					<template slot-scope="scope">
						<a @click.prevent="delGoods(scope.row.id)">删除</a>
					</template>
				</el-table-column>
			</el-table>
		</el-form>

		<!-- <table cellspacing="0" cellpadding="0" class="table">
			<tr>
				<th>商品ID</th>
				<th max-width=50>商品</th>
				<th class="goodsType">规格</th>
				<th>售价</th>
				<th>剩余库存</th>
				<th>活动价格</th>
				<th>活动库存</th>
				<th>操作</th>
			</tr>
			<tr v-if="tableData.length <= 0">
				<td :colspan="8" class="noData">暂无数据</td>
			</tr>

			<template v-for="(item, index) in tableData">
				<tr :key="item.id">
					<td :rowspan="item.specification.length+1">{{item.goodsId}}</td>
					<td :rowspan="item.specification.length+1">{{item.name}}</td>
				</tr>
				<tr v-for="(child, childIndex) in item.specification" :key="child.id">
					<td>{{child.specNames}}</td>
					<td>{{child.actualAmount}}</td>
					<td>{{child.limitCount}}</td>
					<td>
						<el-input type="number" size="small" v-model="child.activityPrice" @blur="checkNum(child.activityPrice, '活动价格')"></el-input>
					</td>
					<td>
						<el-input type="number" size="small" v-model="child.activityAmount" @blur="checkNum(child.activityAmount, '活动库存')"></el-input>
					</td>
					<td><el-button type="text" @click="delItem(index, childIndex)">删除</el-button></td>
				</tr>
			</template>
		</table> -->

    <!-- 分页 -->
    <Pagination
      :pageNo="pagination.currentPage"
      :pageSize="pagination.pageSize"
      :totalCount="pagination.totalCount"
      :handleChange="handleCurrentChange"
    ></Pagination>

		<!-- 保存 -->
		<div class="btnBox">
			<el-button type="default" @click="goBack">返回</el-button>
			<el-button type="primary" @click="submitList()">保存</el-button>
		</div>

		<!--批量设置价格弹窗-->
		<el-dialog
			:visible.sync="priceVisible"
			width="300px"
			class="priceDialog"
			title="只针对当前页"
		>
			<el-form :model="priceFormData" ref="restartForm" :rules="priceRules">
				<el-form-item label="优惠方式：">
					<el-radio-group v-model="priceFormData.type">
						<el-radio :label="0">折扣</el-radio>
						<el-radio :label="1">直降</el-radio>
					</el-radio-group>
				</el-form-item>

				<el-form-item label="优惠力度：" prop="priceMinus">
					<el-input
						style="width: 138px;"
						v-model="priceFormData.price"
						type="number"
						:placeholder="priceFormData.type==0?'输入折扣':'输入直降金额'"
					></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="priceVisible = false">取消</el-button>
				<el-button type="primary" @click="submitPrice">确定</el-button>
			</div>
		</el-dialog>

    <GoodsSelect :isShow.sync="visible" :onSubmit="addGoods"></GoodsSelect>
	</div>
</template>

<script>
  import {
    setActivitySave,
    getActivityGoodsList,
    setDelActivityGoods,
    setSelectActivityGoods
  } from '@/api/marketing'
  import GoodsSelect from '@/components/GoodsSelect/index'
  import Pagination from '@/components/Pagination/index'

  export default {
    props: ['id', 'isManageActivity'],
    components: { GoodsSelect, Pagination },
    data() {
      const that = this
      const validators = {
        checkActivityPrice(rule, value, callback) {
          if (!value && value !== 0) {
            if (!that.isJump) {
              that.$message({ type: 'warning', message: '活动价格不能为空' })
            }
            return callback(new Error(''))
          } else if (value <= 0) {
            if (!that.isJump) {
              that.$message({ type: 'warning', message: '活动价格需大于0' })
            }
            return callback(new Error(''))
          } else {
            const index = rule.field.slice(rule.field.indexOf('.') + 1, rule.field.lastIndexOf('.'))
            if (value > that.model.tableData[index].actualAmount) {
              if (!that.isJump) {
                that.$message({ type: 'warning', message: '活动价格不能大于售价' })
              }
              return callback(new Error(''))
            }
          }

          callback()
        },
        checkActivityAmount(rule, value, callback) {
          // if (value || value === 0) {
          if (value) {
            const reg = /^[1-9][0-9]*$/
            if (!reg.test(value)) {
              if (!that.isJump) {
                that.$message({ type: 'warning', message: '活动库存需为大于0的整数数字' })
              }
              return callback(new Error(''))
            } else {
              const index = rule.field.slice(rule.field.indexOf('.') + 1, rule.field.lastIndexOf('.'))
              if (value > that.model.tableData[index].stock) {
                if (!that.isJump) {
                  that.$message({ type: 'warning', message: '活动库存不能大于剩余库存' })
                }
                return callback(new Error(''))
              }
            }
          }
          callback()
        },
        checkPriceMinus(rule, val, callback) {
          const value = that.priceFormData.price
          if (!value) {
            return callback(new Error('请输入数字'))
          } else {
            if (that.priceFormData.type === 0) {
              if (value <= 0 || value > 1) {
                return callback(new Error('折扣需大于0且不大于1'))
              }
            } else if (that.priceFormData.type === 1) {
              if (value < 0) {
                return callback(new Error('直降需大于等于0'))
              }
            }
          }
          callback()
        }
      }
      return {
        model: {
          rules: {
            specialPrice: [{ validator: validators.checkActivityPrice, trigger: 'blur' }],
            limitCount: [{ validator: validators.checkActivityAmount, trigger: 'blur' }]
          },
          tableData: []
        },

        /* tableData: [
          {
            id: "12987122",
            name: "王小虎dsfffffffffff",
            specification: [
              { name: 'a', price: "234", remainAmount: "3.2", activityPrice: '3', activityAmount: '2' },
              { name: 'a', price: "24", remainAmount: "3", activityPrice: '36', activityAmount: '26' },
            ]
          }
        ], */

        priceVisible: false,
        priceFormData: {
          price: '',
          type: 0
        },
        priceRules: {
          priceMinus: [
            { validator: validators.checkPriceMinus, trigger: 'blur' }
          ]
        },
        pagination: {
          currentPage: 1, // 分页数据
          pageSize: 20,
          totalCount: 0
        },
        isJump: false,		// 控制分页跳转前校验信息不显示
        visible: false
      }
    },
    created() {
      this.getActivityGoods()
    },
    computed: {
      priceFormType() {
        return this.priceFormData.type
      }
    },
    watch: {
      // 切换优惠方式时重置校验状态
      priceFormType() {
        this.priceFormData.price = ''
        if (this.$refs.restartForm) {
          this.$refs.restartForm.clearValidate()
        }
      }
    },
    methods: {
      // 获取活动商品列表
      getActivityGoods() {
        const params = { activityId: this.id }
        params.pageNo = this.pagination.currentPage
        // ajax
        getActivityGoodsList(params).then(res => {
          if (res.data.length <= 0 && params.pageNo > 1) {
            this.handleCurrentChange(1)
            return
          }
          res.data.forEach(v => {
            if (v.specialPrice === 0) {
              v.specialPrice = ''
            }
            if (v.limitCount === 0) {
              // v.limitCount = v.stock
            }
          })
          this.model.tableData = res.data
          this.pagination.totalCount = res.totalCount
          this.pagination.pageSize = res.pageSize
        })
      },
      // 返回
      goBack() {
        this.$router.push({
          name: 'editActivity',
          params: {
            id: this.id
          }
        })
      },
      // 删除
      delGoods(id) {
        this.$confirm('确定删除该项？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const params = {
            id: id,
            activityId: this.id
          }
          // ajax
          setDelActivityGoods(params).then(res => {
            this.$message({ message: '删除成功！', type: 'success' })
            this.handleCurrentChange(this.pagination.currentPage)
          })
        }).catch(() => {})
      },
      // 批量保存价格
      submitPrice() {
        this.$refs.restartForm.validate(valid => {
          if (valid) {
            this.priceVisible = false
            this.model.tableData.forEach((v, i) => {
              v.specialPrice = this.priceFormData.type
                ? v.actualAmount - this.priceFormData.price : v.actualAmount * this.priceFormData.price
              // 保留两位小数，四舍五入
              if (v.specialPrice <= 0) {
                v.specialPrice = 0.1
              }
              v.specialPrice = Math.round(v.specialPrice * 100) / 100
            })
            this.$message({ message: '价格设置成功', type: 'success' })
          }
        })
      },
      // 保存提交
      submitList(isPagination) {
        /* let valid = false
        this.tableData.forEach((v, i) => {
          let flag = false
          v.specification.forEach((value, index) => {
            if (value.activityPrice <= 0) {
              this.$message({ type: 'error', message: `活动价格需大于0，错误数值“${value.activityPrice}”` })
              flag = true
              return
            } else if (value.activityAmount <= 0) {
              this.$message({ type: 'error', message: `活动库存需大于0，错误数值“${value.activityAmount}”` })
              flag = true
              return
            }
          })
          if (flag) {
            valid = true
            return
          }
        })
        if (valid) {
          return
        } */
        if (isPagination) {
          this.isJump = true
        }
        this.$refs.checkForm.validate((valid, obj) => {
          const indexes = []
          Object.keys(obj).forEach(v => {
            indexes.push(+v.slice(v.indexOf('.') + 1, v.lastIndexOf('.')))
          })
          if (indexes.length === this.model.tableData.length) {
            return
          }
          const params = {
            activityId: this.id,
            aglist: []
          }
          this.model.tableData.forEach((v, i) => {
            if (indexes.indexOf(i) === -1) {
              params.aglist.push({
                id: v.id,
                specialPrice: v.specialPrice,
                limitCount: v.limitCount
              })
            }
          })
          // ajax
          setActivitySave(params).then(res => {
            if (!isPagination) {
              if (valid) {
                this.$message({ type: 'success', message: '保存成功' })
              } else {
                this.$message({ type: 'success', message: '部分保存成功', duration: 1000 })
              }
              // this.handleCurrentChange(this.pagination.currentPage)
            }
            // this.$router.push({ name: 'salesIndex' })
            return
          })
        })
        this.isJump = false
      },
      // 新增活动商品按钮
      addBtn() {
        this.visible = true
      },
      // 新增商品提交
      addGoods(data) {
        const goodsIds = data.map(v => v.id)
        const params = {
          goodsIds: goodsIds.join(),
          activityId: this.id
        }
        setSelectActivityGoods(params).then(res => {
          this.$message({ type: 'success', message: '活动商品添加成功' })
          this.handleCurrentChange(1)
        })
      },
      // 显示价格设置模态框
      showDialog() {
        if (this.model.tableData.length <= 0) {
          this.$message({ type: 'warning', message: '暂无商品' })
          return
        }
        this.priceVisible = true
        if (this.$refs.restartForm) {
          this.$refs.restartForm.clearValidate()
        }
        this.priceFormData = {
          type: 0,
          price: ''
        }
      },
      // 校验数值
      /* checkNum(value, name) {
        if (value <= 0) {
          this.$message({ type: 'error', message: `${name}需大于0，错误数值“${value}”` })
        }
      }, */
      // 处理分页
      handleCurrentChange(val) {
        if (val !== this.pagination.currentPage) {
          this.submitList(true)
          this.$refs.checkForm.clearValidate()
        }
        this.pagination.currentPage = val
        this.getActivityGoods()
      }
    }
  }
</script>

<style lang="less" scoped>
	.goodSelectBox {
		margin-bottom: 25px;

		.del {
			color: #409eff;
			cursor: pointer;
		}
		.setBtn {
			margin-bottom: 20px;
		}
		.el-dialog__body {
			padding: 20px 30px 0 30px !important;
		}
		.btnBox {
			margin-top: 30px;
			text-align: right;
		}
		a {
			color: #409EFF;
		}
		.cell {
			.el-form-item {
				margin-bottom: 0;

				// 校验成功边框
				&.is-success /deep/ .el-input__inner {
					border-color: #dcdfe6;
				}
			}
			// 校验失败文字
			.el-form-item__error {
				display: none;
			}
		}
		.el-table--medium td, .el-table--medium th {
			padding: 2px 0;
    }
	}
	.priceDialog {
		/deep/ .el-form-item__error {
			margin-left: 80px;
		}
	}
	.table {
		width: 100%;
		color: #606266;

		&, tr th, tr td {
			border: 1px solid #ccc;
		}
		th {
			text-align: left;
			color: grey;
			padding: 10px;
		}
		td {
			padding: 5px 10px;
		}
		.el-input {
			width: 80%;
		}
		.goodsName {
			max-width: 50px;
		}

		.el-form-item {
			margin-bottom: 0;
			border-color: #ccc;

			// 校验成功边框
			&.is-success .el-input__inner {
				border-color: #dcdfe6;
			}
		}
		// 校验失败文字
		.el-form-item__error {
			display: none;
		}
		.noData {
			text-align: center;
			padding: 10px 0;
			color: #999;
		}
	}
</style>
