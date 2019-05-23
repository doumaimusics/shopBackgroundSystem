<template>
  <div class="activityDetail">
    <ListGoods ref="goodsRef" v-show="isJoined" :id="id" :type="infoData.baseInfo.activityType" @onChange="onChange" :limit="limit"></ListGoods>

    <div class="chooseButton btn" v-if="isJoined">
      <el-button
        type="primary"
        @click="addBtn"
        :disabled="!!infoData.demand.goodsCountDemand && (joinedCount===infoData.demand.goodsCountDemand)"
      >添加报名商品</el-button>
      <span v-if="!!infoData.demand.goodsCountDemand">
        {{'已/可提交商品数量（' + joinedCount + ' / ' + infoData.demand.goodsCountDemand + '）'}}
      </span>
    </div>

    <ActivityInfo ref="infoRef" :data="infoData" :type="type"></ActivityInfo>

    <div class="chooseButton" v-if="!isJoined">
      <el-button type="primary" @click="addBtn">选择报名商品</el-button>
    </div>

    <GoodsSelect
      :isShow.sync="visible"
      :onSubmit="saveGoods"
      :replace="{ api: api, params: { activityEnterId: this.id } }"
    ></GoodsSelect>
  </div>
</template>

<script>
  import GoodsSelect from '@/components/GoodsSelect/index'
  import ListGoods from './components/ListGoods'
  import ActivityInfo from '../components/ActivityInfo'
  import {
    getJoinActivityDetail,
    setAddActivityGoods,
    getJoinActivitySelectList
  } from '@/api/marketing'
  import { joinActivityLevelTrans } from '@/filters/transform'

  export default {
    components: { ActivityInfo, GoodsSelect, ListGoods },
    data() {
      return {
        id: '',
        type: null,
        infoData: {
          baseInfo: {},
          demand: {}
        },
        isJoined: false, // 是否已报名
        api: getJoinActivitySelectList,
        visible: false,
        joinedCount: 0, // 已提交商品数量
        limit: {} // 传递给商品编辑子组件的报名限制数据
      }
    },
    created() {
      this.getParams()
      this.getActivityInfo()
    },
    methods: {
      getParams() {
        this.id = this.$route.query.id
        this.type = this.$route.query.type
      },
      // 获取活动信息
      getActivityInfo() {
        const params = {
          id: this.id,
          activityType: 1 // 1 可报名 2 已参与
        }
        getJoinActivityDetail(params).then(res => {
          this.infoData = {
            baseInfo: {
              activityType: res.data.afActivityEnterDo.activityType,
              name: res.data.name,
              showAddress: res.data.afActivityEnterDo.showAddress,
              time: res.data.gmtStartTime + ' 至 ' + res.data.gmtEndTime,
              level: joinActivityLevelTrans(
                res.data.type,
                res.data.threshold,
                res.data.discountAmount,
                res.data.discountType
              )
            },
            demand: res.data.afActivityEnterDo
          }
          this.limit.pintuanManMax = this.infoData.demand.pintuanManMax
          this.limit.pintuanManMin = this.infoData.demand.pintuanManMin
          // this.limit.times = this.infoData.demand.times
          if (this.infoData.demand.goodsStockDemandMin) {
            this.limit.minAmount = this.infoData.demand.goodsStockDemandMin
          }
          if (this.infoData.demand.goodsStockDemandMax) {
            this.limit.maxAmount = this.infoData.demand.goodsStockDemandMax
          }
          if (this.infoData.demand.goodsAmountDemand) {
            this.limit.priceDemand = this.infoData.demand.goodsAmountDemand
          }
          if (this.infoData.demand.goodsAmountDiscountDemand) {
            this.limit.priceDisDemand = this.infoData.demand.goodsAmountDiscountDemand
          }
        })
      },
      addBtn() {
        this.visible = true
      },
      // 保存已选商品
      saveGoods(data) {
        if (this.infoData.baseInfo.activityType === 2) {
          const params = {
            activityEnterId: this.id,
            goodsId: data.map(v => v.id).join()
          }
          setAddActivityGoods(params).then(res => {
            this.$message({ type: 'success', message: '保存成功' })
            this.getActivityInfo()
            this.$refs.goodsRef.getTableData()
          })
        } else {
          const localData = {
            activityId: this.id + '',
            data: data
          }
          localStorage.setItem('joinableActivityGoods', JSON.stringify(localData))
          // 跳转
          this.$router.push({
            name: 'joinableEditActivityGoods',
            query: {
              id: this.id,
              type: this.type,
              min: this.infoData.demand.pintuanManMin,
              max: this.infoData.demand.pintuanManMax,
              ...this.limit
            }
          })
        }
      },
      // 已报名商品列表数据改变回调
      onChange(payload) {
        this.isJoined = payload.totalLen > 0
        this.joinedCount = payload.submitLen
      }
    }
  }
</script>

<style lang="less" scoped>
  .activityDetail {
    padding: 20px;
  }
  .btn {
    padding-bottom: 30px;
    span {
      margin-left: 10px;
    }
  }
</style>
