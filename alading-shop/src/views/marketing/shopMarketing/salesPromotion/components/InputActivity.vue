<template>
  <div class="inputActivity" :loading="loading">
    <el-form :model="activityFormData" status-icon :rules="activityRule" ref="activityForm" class="activityForm">
      <el-form-item label="活动名称：" prop="name">
        <el-input v-model="activityFormData.name" class="inputBox"></el-input>
      </el-form-item>

      <el-form-item label="活动类型：">
        <el-radio v-model="activityFormData.type" :label="1">限时打折</el-radio>
      </el-form-item>

      <el-form-item label="每人限购：" prop="goodsLimitCount">
        <el-input-number
          controls-position="right"
          :min="1" :max="999"
          :precision="0"
          v-model="activityFormData.goodsLimitCount"
        ></el-input-number>
      </el-form-item>

      <el-form-item label="活动时间：" prop="timeRange" class="timeLine">
				<el-date-picker
						type="datetimerange"
						range-separator="至"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						v-model="activityFormData.timeRange"
				></el-date-picker>
			</el-form-item>

      <el-form-item label="" v-if="isEdit">
        <el-button type="primary" @click="onManage">管理活动商品</el-button>
      </el-form-item>

      <el-form-item>
        <el-button type="default" @click="onCancel">返回</el-button>
        <el-button
          type="primary"
          @click="onEdit"
          v-if="isEdit"
        >保存</el-button>
        <el-button
          type="primary"
          @click="addBtn"
          v-if="isAdd"
        >选择活动商品</el-button>
      </el-form-item>
    </el-form>

    <GoodsSelect :isShow.sync="visible" :onSubmit="onAdd"></GoodsSelect>
  </div>
</template>

<script>
  import { getActivityInfo,
    setActivityUpdate,
    setAddActivity,
    setSelectActivityGoods
  } from '@/api/marketing'
  import GoodsSelect from '@/components/GoodsSelect/index'

  export default {
    props: ['isAdd', 'isEdit'],
    components: { GoodsSelect },
    data() {
      const checkName = (rule, value, callback) => {
        if (!value.trim()) {
          return callback(new Error('活动名称不能为空'))
        } else if (value.length > 30) {
          return callback(new Error('活动名称不能超多30个字符'))
        }
        callback()
      }
      const checkTime = (rule, value, callback) => {
        if (!value || value.length <= 0) {
          return callback(new Error('请选择时间'))
        }
        // else if (value[0].getTime() < new Date().getTime()) {
        //   return callback(new Error('开始时间不能小于当前时间'))
        // }
        callback()
      }
      return {
        activityFormData: {
          name: '',
          type: 1,
          goodsLimitCount: undefined,
          timeRange: []
        },
        activityRule: {
          name: [{ validator: checkName, trigger: 'blur' }],
          timeRange: [{ validator: checkTime, trigger: 'change' }]
        },
        id: '',
        visible: false,
        loading: false
      }
    },
    created() {
      this.getParams()
      if (this.isEdit) {
        this.getActivityData()
      }
    },
    methods: {
      getParams() {
        this.id = this.$route.params.id
      },
      // 获取活动信息
      getActivityData() {
        const params = { id: this.id }
        getActivityInfo(params).then(res => {
          this.activityFormData = {
            name: res.data.name,
            type: res.data.type,
            timeRange: [new Date(res.data.gmtStart), new Date(res.data.gmtEnd)]
          }
          // el-input-number 值为undefined时才显示为空
          if (res.data.goodsLimitCount !== 0) {
            this.activityFormData.goodsLimitCount = res.data.goodsLimitCount
          }
        })
      },
      // 编辑保存
      onEdit() {
        this.$refs.activityForm.validate((valid) => {
          if (valid) {
            const params = JSON.parse(JSON.stringify(this.activityFormData))
            params.id = this.id
            console.log(params)
            params.gmtStartTime = new Date(params.timeRange[0]).getTime()
            params.gmtEndTime = new Date(params.timeRange[1]).getTime()
            delete params.timeRange
            if (!params.goodsLimitCount) {
              params.goodsLimitCount = 0
            }
            // ajax
            setActivityUpdate(params).then(res => {
              this.$message({ message: '保存成功', type: 'success' })
              // this.$router.push({ name: 'salesIndex' });
            })
          } else {
            return false
          }
        })
      },
      // 返回
      onCancel() {
        this.$router.push({ name: 'salesIndex' })
      },
      // 管理活动商品
      onManage() {
        this.$router.push({
          name: 'manageGood',
          query: {
            id: this.id
          }
        })
      },
      // 选择活动商品按钮
      addBtn() {
        this.$refs.activityForm.validate(valid => {
          if (valid) {
            this.visible = true
          } else {
            return
          }
        })
      },
      // 新增活动
      onAdd(data) {
        this.loading = true
        const params = JSON.parse(JSON.stringify(this.activityFormData))
        params.gmtStartTime = this.activityFormData.timeRange[0].getTime()
        params.gmtEndTime = this.activityFormData.timeRange[1].getTime()
        delete params.timeRange
        if (!params.goodsLimitCount) {
          params.goodsLimitCount = 0
        }
        // ajax
        setAddActivity(params).then(res => {
          this.addActivityGoods(data, res.data.id)
        }).catch(() => {
          this.loading = false
        })
      },
      // 添加活动商品
      addActivityGoods(data, id) {
        const goodsIds = data.map(v => v.id)
        const params = {
          goodsIds: goodsIds.join(),
          activityId: id
        }
        setSelectActivityGoods(params).then(res => {
          this.$message({ type: 'success', message: '活动商品添加成功' })
          // 路由跳转
          this.$router.push({
            name: 'setPrice',
            query: { id }
          })
        }).catch(() => {
          this.loading = false
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .inputActivity{
    .inputBox{
      display: inline-block;
      width: 40%;
    }
    /deep/ .el-form-item__error {
			left: 85px;
		}
    .timeLine {
			display: inline-block;
			width: 550px;
		}
  }
  // .el-input-number {
  //   /deep/ span {
  //     display: none;
  //   }
  //   /deep/ .el-input__inner {
  //     text-align: left;
  //     padding-right: 15px;
  //   }
  // }
</style>
