<template>
  <div class="activityInfo">
    <el-card class="baseInfo card">
      <h4>活动基本信息</h4>
      <ul>
        <li class="statusLi" v-if="isJoined">
          <span class="title">活动状态：</span>
          <span class="content">{{baseInfo.status | joinedActivityStatusTrans}}</span>
        </li>
        <li>
          <span class="title">活动类型：</span>
          <span class="content">{{baseInfo.activityType | activityTypeTrans}}</span>
        </li>
        <li>
          <span class="title">活动名称：</span>
          <span class="content">{{baseInfo.name}}</span>
        </li>
        <li>
          <span class="title">活动展现位置：</span>
          <span class="content">
            <ImgPreview :imgList="[baseInfo.showAddress]"></ImgPreview>
          </span>
        </li>
        <li>
          <span class="title">活动起止时间：</span>
          <span class="content">{{baseInfo.time}}</span>
        </li>
        <li v-if="baseInfo.activityType===2">
          <span class="title">活动力度：</span>
          <span class="content">{{baseInfo.level}}</span>
        </li>
        <!--拼团字段-->
        <!--<li>-->
          <!--<span class="title">活动预告时间：</span>-->
          <!--<span class="content">2018-10-09 0:00:00</span>-->
        <!--</li>-->
      </ul>
    </el-card>

    <el-card class="demand card" v-if="!isJoined">
      <h4>活动报名要求</h4>
      <ul>
        <li>
          <span class="title">类目要求：</span>
          <span class="content">{{demand.categoryDemand ? demand.categoryDemand : '不限'}}</span>
        </li>
        <li>
          <span class="title">品牌要求：</span>
          <span class="content">{{demand.brandDemand ? demand.brandDemand : '不限'}}</span>
        </li>
        <li>
          <span class="title">商品销量要求：</span>
          <span class="content">{{demand.goodsSaleDemand ? ('>= ' + demand.goodsSaleDemand) : '不限'}}</span>
        </li>
        <li>
          <span class="title">{{baseInfo.activityType === 2 ? '商品库存要求：' : '商品活动库存要求：'}}</span>
          <span class="content">{{demand.stockLimit ? demand.stockLimit : '不限'}}</span>
        </li>
        <li>
          <span class="title">{{baseInfo.activityType === 2 ? '商品价格要求：' : '商品活动价格要求：'}}</span>
          <span class="content">{{demand.priceLimit ? demand.priceLimit : '不限'}}</span>
        </li>
        <li v-if="type==4">
          <span class="title">商品成团人数要求：</span>
          <span class="content">{{demand.pintuanManMin==0&&demand.pintuanManMax==0 ? '不限' : demand.pintuanManMin+'-'+demand.pintuanManMax+'人' }}</span>
        </li>
        <li>
          <span class="title">商品运费要求：</span>
          <span class="content">{{demand.freightType === 2 ? '包邮（活动期间用户下单默认包邮）' : '不限'}}</span>
        </li>
        <li>
          <span class="title">报名商品数量限制：</span>
          <span class="content">{{demand.goodsCountDemand ? ('<= ' + demand.goodsCountDemand) : '不限'}}</span>
        </li>
        <li>
          <span class="title">报名结束时间：</span>
          <span class="content">{{demand.gmtEnd | formatTimestamp}}</span>
        </li>
      </ul>
    </el-card>
  </div>
</template>

<script>
  import ImgPreview from '@/components/ImgPreview'
  import { activityTypeTrans, joinedActivityStatusTrans } from '@/filters/transform'
  import { formatTimestamp } from '@/utils/tools'

  export default {
    props: ['data', 'isJoined', 'type'],
    components: { ImgPreview },
    filters: { activityTypeTrans, formatTimestamp, joinedActivityStatusTrans },
    computed: {
      baseInfo() {
        if (this.data && this.data.baseInfo) {
          return this.data.baseInfo
        } else {
          return {}
        }
      },
      demand() {
        if (this.data && this.data.demand) {
          const demand = this.data.demand
          if (demand.goodsAmountDemand) {
            demand.priceLimit = '<= ' + demand.goodsAmountDemand + '元'
          } else if (demand.goodsAmountDiscountDemand) { // 1-10 1表示1折
            demand.priceLimit = '<= ' + demand.goodsAmountDiscountDemand + '折'
          }
          if (demand.goodsStockDemandMin) {
            demand.stockLimit = '>= ' + demand.goodsStockDemandMin
          }
          if (demand.goodsStockDemandMax) {
            demand.stockLimit = '<= ' + demand.goodsStockDemandMax
          }
          if (demand.goodsStockDemandMin && demand.goodsStockDemandMax) {
            demand.stockLimit = demand.goodsStockDemandMin + ' ~ ' + demand.goodsStockDemandMax
          }
          return demand
        } else {
          return {}
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .card {
    margin-bottom: 20px;
    h4 {
      font-weight: 700;
      padding-bottom: 20px;
      font-size: 16px;
    }
    ul {
      display: flex;
      flex-wrap: wrap;
      li {
        width: 40%;
        padding-bottom: 30px;
        display: flex;
        align-items: center;

        &.statusLi {
          width: 100%;
        }
      }
      span {
        vertical-align: middle;
      }
      .title {
        width: 130px;
      }
      .content {
        color: #666;
      }
    }
  }
</style>
