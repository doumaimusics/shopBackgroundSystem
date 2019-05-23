<template>
	<div class="editGoods">
    <ul class="limit">
      <li>
        <span class="title">商品活动库存要求：</span>
        <span class="content">{{stockLimit}}</span>
      </li>
      <li>
        <span class="title">商品活动价格要求：</span>
        <span class="content">{{priceLimit}}</span>
      </li>
    </ul>
    <p class="tip">商品活动库存要求，是针对同一商品下所有规格的活动库存之和</p>
		<!-- 表格 -->
		<el-form :model="model" :rules="model.rules" ref="checkForm">
			<el-table :data="model.tableData" stripe>
				<el-table-column prop="goodsId" label="商品ID"></el-table-column>
        <el-table-column label="商品图片">
          <template slot-scope="scope">
            <div class="imgBox"><img :src="scope.row.goodsIcon" alt=""></div>
          </template>
        </el-table-column>
				<el-table-column prop="name" label="商品名称" min-width="150"></el-table-column>
				<el-table-column prop="specNames" label="规格" min-width="150"></el-table-column>
				<el-table-column prop="saleAmount" label="售价"></el-table-column>
				<el-table-column prop="stock" label="库存"></el-table-column>
				<el-table-column label="活动价" min-width="120">
					<template slot-scope="scope">
            <el-form-item :prop="'tableData.'+scope.$index+'.specialPrice'" :rules="model.rules.specialPrice">
              <el-input-number
                size="small"
                v-model="scope.row.specialPrice"
                controls-position="right"
                :min="0.01"
                :step="0.01"
                :precision="2"
              ></el-input-number>
            </el-form-item>
					</template>
				</el-table-column>
				<el-table-column label="活动库存" min-width="120">
					<template slot-scope="scope">
							<el-form-item :prop="'tableData.'+scope.$index+'.limitCount'" :rules="model.rules.limitCount">
                <el-input-number
                size="small"
                v-model="scope.row.limitCount"
                controls-position="right"
                :min="1"
                :step="1"
                :precision="0"
              ></el-input-number>
							</el-form-item>
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<a @click.prevent="delGoods(scope)">删除</a>
					</template>
				</el-table-column>
			</el-table>
		</el-form>

    <!-- 分页 -->
    <Pagination
      :pageNo="pageNo"
      :pageSize="pageSize"
      :totalCount="totalCount"
      :handleChange="handleCurrentChange"
    ></Pagination>

    <!--拼团人数限制-->
    <template v-if="type==4">
      <p class="">
        <span>成团人数：</span>
        <span v-if="max==0&&min==0">不限</span>
        <el-input-number v-else v-model="times" :step="1" :min="+min" :max="+max" :precision="0" @change="getPeopleNum"></el-input-number>
      </p>
      <p v-if="max!=0&&min!=0" style="color: red;margin-top: 10px;font-size: 12px;">(成团人数必填大于等于{{min}}且小于等于{{max}}的正整数)</p>
    </template>

		<div class="btnBox">
			<el-button type="primary" @click="submitList()" v-if="model.tableData.length>0">
        {{goodsId ? '保存' : '确认提交'}}
      </el-button>
			<el-button @click="goBack()" v-else>
        {{goodsId ? '关闭' : '返回重选'}}
      </el-button>
		</div>
	</div>
</template>

<script>
  import Pagination from '@/components/Pagination/index'
  import {
    getTypeGoods,
    getEditTypeGoods,
    setAddTypeGoods,
    setEditTypeGoods
  } from '@/api/marketing'

  export default {
    props: ['id', 'goodsId', 'callback', 'limit'],
    components: { Pagination },
    data() {
      const checkActivityPrice = (rule, value, callback) => {
        if (value) value = +value
        if (!value) {
          this.$message({ type: 'warning', message: '活动价不能为空' })
          return callback(new Error(''))
        } else {
          const index = rule.field.slice(rule.field.indexOf('.') + 1, rule.field.lastIndexOf('.'))
          let max = +this.model.tableData[index].saleAmount
          let msg = '售价'
          if (this.limit.priceDemand && +this.limit.priceDemand < max) {
            max = +this.limit.priceDemand
            msg = max
          } else if (this.limit.priceDisDemand) {
            max = max * +this.limit.priceDisDemand / 10
            msg = '售价的' + this.limit.priceDisDemand + '折'
          }
          if (value > max) {
            this.$message({ type: 'warning', message: '活动价不能大于' + msg })
            return callback(new Error(''))
          }
        }
        callback()
      }
      const checkActivityAmount = (rule, value, callback) => {
        if (value) value = +value
        if (!value) {
          this.$message({ type: 'warning', message: '活动库存不能为空' })
          return callback(new Error(''))
        } else {
          const index = rule.field.slice(rule.field.indexOf('.') + 1, rule.field.lastIndexOf('.'))
          if (value > this.model.tableData[index].stock) {
            this.$message({ type: 'warning', message: '活动库存不能大于该规格剩余库存' })
            return callback(new Error(''))
          } else {
            if (this.amountLimitJudge(this.model.tableData[index].goodsId)) {
              this.$message({
                type: 'warning',
                message: '商品活动库存不符合要求'
              })
              return callback(new Error(''))
            }
          }
        }
        callback()
      }
      return {
        model: {
          rules: {
            specialPrice: [{ validator: checkActivityPrice, trigger: 'blur' }],
            limitCount: [{ validator: checkActivityAmount, trigger: 'blur' }]
          },
          tableData: []
        },
        totalData: [],

        pageNo: 1, // 分页数据
        pageSize: 20,
        totalCount: 0,
        times: 0,
        type: null,
        min: 0,
        max: 0,
        deleteIds: []
      }
    },
    created() {
      this.init()
    },
    computed: {
      priceLimit() {
        if (this.limit.priceDemand) {
          return '<= ' + this.limit.priceDemand + '元'
        } else if (this.limit.priceDisDemand) { // 1-10 1表示1折
          return '<= ' + this.limit.priceDisDemand + '折'
        } else {
          return '不限'
        }
      },
      stockLimit() {
        if (this.limit.minAmount && this.limit.maxAmount) {
          return this.limit.minAmount + ' ~ ' + this.limit.maxAmount
        }
        if (this.limit.minAmount) {
          return '>= ' + this.limit.minAmount
        }
        if (this.limit.maxAmount) {
          return '<= ' + this.limit.maxAmount
        } else {
          return '不限'
        }
      }
    },
    methods: {
      init() {
        console.log(this.limit)
        this.type = this.$route.query.type
        this.min = this.$route.query.min || this.limit.pintuanManMin
        this.max = this.$route.query.max || this.limit.pintuanManMax
        if (this.limit.editTimes) {
          this.times = this.limit.editTimes
        } else {
          this.times = this.$route.query.min || this.limit.pintuanManMin
        }

        if (this.goodsId) {
          this.getTypeGoodsList(this.goodsId)
        } else {
          const obj = JSON.parse(localStorage.getItem('joinableActivityGoods'))
          if (obj && +obj.activityId === +this.$route.query.id) {
            const ids = obj.data.map(v => v.id).join()
            this.getTypeGoodsList(ids)
          }
        }
      },
      //
      getPeopleNum(val) {
        if (val <= this.min) {
          this.times = this.min
          return false
        }
        if (val >= this.max) {
          this.times = this.max
          return false
        }
      },
      //
      handleChange(val) {
        console.log(val)
      },
      // 获取活动规格列表
      getTypeGoodsList(ids) {
        const params = {
          activityEnterId: this.id
        }
        let apiFun = null
        if (this.goodsId) {
          apiFun = getEditTypeGoods
          params.goodsId = ids
        } else {
          apiFun = getTypeGoods
          params.goodsIds = ids
        }
        // ajax
        apiFun(params).then(res => {
          this.totalData = res.data
          this.totalCount = this.totalData.length
          this.totalData.forEach(v => {
            if (!v.specialPrice) {
              v.specialPrice = undefined
            }
            if (!v.limitCount) {
              v.limitCount = undefined
            }
          })
          if (this.totalCount === 0 && !this.goodsId) {
            this.$message({
              type: 'warning',
              message: '您选择的商品都已存在报名详情列表，请返回重选',
              duration: 5000
            })
          }
          this.getTableData()
        })
      },
      // 处理分页
      handleCurrentChange(val) {
        // 页面跳转前保存数据
        this.totalData.splice(
          this.pageSize * (this.pageNo - 1),
          this.model.tableData.length,
          ...this.model.tableData
        )
        this.$refs.checkForm.clearValidate()
        // 跳转
        this.pageNo = val
        this.getTableData()
      },
      // 获取分页数据
      getTableData() {
        const startIndex = this.pageSize * (this.pageNo - 1)
        if (this.pageNo >= this.totalCount / this.pageSize) {
          this.model.tableData = this.totalData.slice(startIndex)
          if (this.model.tableData.length <= 0 && this.pageNo > 1) {
            this.pageNo--
            this.getTableData()
          }
        } else {
          this.model.tableData = this.totalData.slice(startIndex, startIndex + this.pageSize)
        }
      },
      // 删除
      delGoods(scope) {
        this.$confirm('确定删除该项？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.totalData.splice(this.pageSize * (this.pageNo - 1) + scope.$index, 1)
          this.totalCount = this.totalData.length
          this.getTableData()
          this.$refs.checkForm.clearValidate()
          this.deleteIds.push(scope.row.id)
          // this.$message({ type: 'success', message: '删除成功' })
        }).catch(() => {})
      },
      // 提交
      submitList(isPagination) {
        this.$refs.checkForm.validate((valid, obj) => {
          if (valid) {
            if (this.globalValidate()) {
              const params = {
                activityEnterId: +this.id,
                activityEnterGoodsVos: [],
                times: this.times
              }
              this.totalData.forEach((v, i) => {
                const obj = {
                  goodsId: v.goodsId,
                  priceId: v.priceId,
                  specialPrice: v.specialPrice,
                  limitCount: v.limitCount
                }
                // 表示要删除的商品规格
                if (this.goodsId) {
                  obj.id = v.id
                }
                params.activityEnterGoodsVos.push(obj)
              })
              // ajax
              if (this.goodsId) {
                params.enterActivityGoodsIds = this.deleteIds.join()
                setEditTypeGoods(params).then(res => {
                  this.$emit('callback', { isSubmit: true })
                  this.$message({ type: 'success', message: '保存成功' })
                })
              } else {
                setAddTypeGoods(params).then(res => {
                  localStorage.removeItem('joinableActivityGoods')
                  this.$message({ type: 'success', message: '提交成功' })
                  this.$router.push({
                    name: 'joinableActivityDetail',
                    query: { id: this.id, type: this.type }
                  })
                })
              }
            }
          }
        })
      },
      // 全局校验
      globalValidate() {
        for (let i = 0; i < this.totalData.length; i++) {
          if (this.priceValidate(this.totalData[i]) || this.amountValidate(this.totalData[i])) {
            const currentPage = i >= this.pageSize ? Math.ceil((i + 1) / this.pageSize) : 1
            this.handleCurrentChange(currentPage)
            this.$nextTick(() => {
              this.$refs.checkForm.validate(() => {})
            })
            return false
          }
        }
        return true
      },
      // 校验活动价
      priceValidate(v) {
        let max = +v.saleAmount
        if (this.limit.priceDemand && +this.limit.priceDemand < max) {
          max = +this.limit.priceDemand
        } else if (this.limit.priceDisDemand) {
          max = max * +this.limit.priceDisDemand / 10
        }
        if (!v.specialPrice || v.specialPrice > max) {
          return true
        }
      },
      // 校验活动库存
      amountValidate(v) {
        if (v.limitCount || v.limitCount === 0) {
          if (!v.limitCount || v.limitCount > v.stock || this.amountLimitJudge(v.goodsId)) {
            return true
          }
        }
      },
      // 判断活动库存限制
      amountLimitJudge(goodsId) {
        const newData = {}
        this.totalData.forEach((v, i) => {
          if (!newData[v.goodsId]) {
            newData[v.goodsId] = []
          }
          newData[v.goodsId].push(v)
        })
        let total = 0
        for (let i = 0; i < newData[goodsId].length; i++) {
          if (!newData[goodsId][i].limitCount) {
            return false
          }
          total += +newData[goodsId][i].limitCount
        }
        if (this.limit.minAmount && total < +this.limit.minAmount) {
          return true
        }
        if (this.limit.maxAmount && total > +this.limit.maxAmount) {
          return true
        }
      },
      goBack() {
        if (this.goodsId) {
          this.$emit('callback', { isSubmit: false })
        } else {
          this.$router.push({
            name: 'joinableActivityDetail',
            query: { id: this.id }
          })
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .tip {
    text-align: right;
    // color: #F56C6C;
    color: #999;
    padding-bottom: 5px;
  }
  .btnBox {
    padding-top: 30px;
    padding-right: 50px;
    text-align: right;
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
  .imgBox {
    width: 60px;
    height: 60px;
    img {
      width: auto;
      max-height: 100%;
    }
  }
  .limit {
    display: flex;
    flex-wrap: wrap;
    li {
      width: 300px;
      padding-bottom: 10px;
      display: flex;
      align-items: center;
    }
    .title {
      width: 130px;
    }
    .content {
      color: #666;
    }
  }
</style>
