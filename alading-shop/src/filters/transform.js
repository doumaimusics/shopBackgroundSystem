/**
 * 字段转文字
 */

// 交易管理 - 售后管理 - 售后状态
export function afterStatusTrans(status, type) {
  switch (status) {
    case 'NEW':
      if (type === 1) { return '退货待处理' }
      if (type === 2) { return '退款待处理' }
      if (type === 3) { return '换货待处理' }
      return '退款待处理'
    case 'CLOSE':
      // return '退款关闭'
      return '售后关闭'
    case 'CLOSING':
      return '售后关闭'
    case 'NOTPASS':
      return '审核不通过'
    case 'WAIT_GOODS_BACK':
      return '待买家发货'
    case 'GOODS_BACKIING':
      return '待商家收货'
    case 'SELLER_SIGNED':
      return '待商家发货'
    case 'WAIT_REFUND':
      return '等待退款'
    case 'REFUNDING':
      return '退款处理中'
    case 'SELLER_DELIVER':
      return '待买家收货'
    case 'FINISH':
      // return '退款成功'
      return '售后成功'
    default:
      return '无'
  }
}
// 交易管理 - 售后管理 - 售后类型
export function afterType(status) {
  switch (status) {
    case 1:
      return '退货退款'
    case 2:
      return '仅退款'
    case 3:
      return '换货'
    default:
      return ''
  }
}

// 交易管理 - 订单管理 - 订单状态
export function orderStatusTrans(status) {
  switch (status) {
    case 'NEW':
      return '待付款' // 待付款列表
    case 'DEALING':
      return '支付中' // 待付款列表
    case 'PAYFAIL': // 支付失败
      return '待付款' // 待付款列表
    case 'PAID':
      return '待发货' // 待发货列表
    case 'AUDITSUCCESS':
      return '租赁已支付'
    case 'REVIEW':
      return '代买审核中'
    case 'AGENCYCOMPLETED':
      return '等待完成'
    case 'DELIVERED':
      return '已发货' // 已发货列表
    case 'FINISHED':
      return '订单完成' // 订单完成列表
    case 'REBATED': // 返利成功
      return '订单完成' // 订单完成列表
    case 'CLOSED':
      return '订单关闭' // 订单关闭列表
    case 'WAIT_REFUND':
      return '等待退款'
    case 'DEAL_REFUNDING':
      return '退款中'
    default:
      return '无'
  }
}

// 店铺装修 - 店铺首页装修 - 组件名
export function typeTrans(type) {
  switch (type) {
    case 'goodsSingle':
      return '单列商品'
    case 'goodsDouble':
      return '双列商品'
    case 'goodsSort':
      return '商品排行榜'
    case 'imgSingle':
      return '单列图片'
    case 'imgDouble':
      return '双列图片'
    case 'imgCarousel':
      return '轮播图'
    case 'marketCoupon':
      return '优惠券'
    default:
      return 'error'
  }
}

// 营销中心 - 店铺营销工具 - 优惠券 - 状态
export function couponStatusTrans(status) {
  switch (status) {
    case 1:
      return '进行中'
    case 2:
      return '已过期'
    case 3:
      return '未开始'
    case 0:
      return '全部'
    default:
      return '无'
  }
}

// 营销中心 - 店铺营销工具 - 店铺促销 - 状态
export function salesStatusTrans(status) {
  switch (status) {
    case 1:
      return '未开始'
    case 2:
      return '进行中'
    case 3:
      return '已过期'
    case 0:
      return '全部'
    default:
      return '无'
  }
}

// 商品管理 - 仓库/出售中的商品 - 商品状态
export function verifyStatusTrans(status) {
  switch (status) {
    case 1:
      return '待提交审核'
    case 2:
      return '待审核'
    case 3:
      return '未通过'
    case 4:
      return '审核通过'
    default:
      return '无'
  }
}

// 店铺管理 - 店铺设置 - 品牌管理 - 审核状态
export function brandVerifyStatusTrans(status) {
  switch (status) {
    case 1:
      return '待审核'
    case 2:
      return '审核通过'
    case 3:
      return '审核未通过'
    default:
      return '无'
  }
}

// 营销中心 - 活动报名 - 报名的商品 - 审核状态
export function joinableGoodsStatusTrans(status) {
  status = +status
  switch (status) {
    case 1:
      return '待提交'
    case 2:
      return '审核中'
    case 3:
      return '审核通过'
    case 4:
      return '审核未通过'
    case 5:
      return '已打回'
    default:
      return '无'
  }
}

// 营销中心 - 活动报名 - 可报名的活动 - 活动类型
export function activityTypeTrans(type) {
  switch (type) {
    case 1:
      return '促销'
    case 2:
      return '满减'
    case 3:
      return '秒杀'
    case 4:
      return '拼团'
    default:
      return '无'
  }
}

// 营销中心 - 活动报名 - 已报名的活动 - 活动状态
export function joinedActivityStatusTrans(status) {
  switch (status) {
    case 1:
      return '未开始'
    case 2:
      return '进行中'
    case 3:
      return '已结束'
    default:
      return '无'
  }
}

// 营销中心 - 满减活动 - 活动力度
export function joinActivityLevelTrans(type, m, n, f) {
  let str = ''
  switch (type) {
    case 'AMOUNT':
      str = '满' + m + '元减' + n + '元'
      break
    case 'COUNT':
      str = '满' + m + '件减' + n + '元'
      break
    case 'AMOUNTDISCOUNT': // 1-10 1表示1折
      str = '满' + m + '元打' + n + '折'
      break
    case 'COUNTDISCOUNT':
      str = '满' + m + '件打' + n + '折'
      break
    case 'AMOUNTCOUNT':
      str = '满' + m + '元任选' + n + '件'
      break
    case 'COUNTAMOUNT':
      str = '满' + m + '件减' + n + '件'
      break
    case 'PERAMOUNT':
      str = '每满' + m + '元减' + n + '元'
      break
    default:
      str = '无'
  }
  str += (+f === 1) ? '（支持跨店）' : '（不支持跨店）'
  return str
}
