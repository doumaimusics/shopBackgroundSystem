/**
 * 营销中心API
 */
import request from '@/utils/request'
const path = '/shop'

// 店铺营销工具模块=============================================================

// 优惠券------------------------------------------

// 获取优惠券列表
export function getCouponList(query) {
  return request({
    url: path + '/coupon/couponList',
    method: 'get',
    params: query
  })
}

// 删除优惠券
export function setDelCoupon(query) {
  return request({
    url: path + '/coupon/delCoupon',
    method: 'post',
    params: query
  })
}

// 添加优惠券
export function setAddCoupon(query) {
  return request({
    url: path + '/coupon/addCoupon',
    method: 'post',
    params: query
  })
}

// 获取优惠券信息
export function getCouponInfo(query) {
  return request({
    url: path + '/coupon/couponDetail',
    method: 'get',
    params: query
  })
}

// 修改优惠券
export function setCouponUpdate(query) {
  return request({
    url: path + '/coupon/editCoupon',
    method: 'post',
    params: query
  })
}

// 发放
export function setSendCoupon(query) {
  return request({
    url: path + '/coupon/grantCoupon',
    method: 'post',
    params: query
  })
}

// 获取用户购买信息
export function getUserBuyInfo(query) {
  return request({
    url: path + '/coupon/grantCouponDetail',
    method: 'get',
    params: query
  })
}

// 店铺促销-----------------------------------------------

// 获取活动列表table
export function getSalesFormData(query) {
  return request({
    url: path + '/activity/activityList',
    method: 'get',
    params: query
  })
}

// 保存新增活动信息
export function setAddActivity(query) {
  return request({
    url: path + '/activity/addSeckillActivity',
    method: 'post',
    params: query
  })
}

// 选择活动商品
export function setSelectActivityGoods(query) {
  return request({
    url: path + '/activityGoods/addActivityGoods',
    method: 'post',
    params: query
  })
}

// 根据活动id获取活动商品信息
export function getActivityGoodsList(query) {
  return request({
    url: path + '/activityGoods/activityGoodsList',
    method: 'get',
    params: query
  })
}

// 删除单个规格商品
export function setDelActivityGoods(query) {
  return request({
    url: path + '/activityGoods/delActivityGoods',
    method: 'post',
    params: query
  })
}

// 保存活动及价格
export function setActivitySave(query) {
  return request({
    url: path + '/activityGoods/batchSetupActivityPrice',
    method: 'post',
    params: query,
    type: 'json'
  })
}

// 获取活动详情
export function getActivityInfo(query) {
  return request({
    url: path + '/activity/seckillActivityDetail',
    method: 'get',
    params: query
  })
}

// 保存编辑后的活动、启用、禁用、一键重启
export function setActivityUpdate(query) {
  return request({
    url: path + '/activity/editSeckillActivity',
    method: 'post',
    params: query
  })
}

// 满减活动-------------------------------------------------------

// 获取满减活动列表
export function getFullActivityList(query) {
  return request({
    url: path + '/discount/listDiscount',
    method: 'post',
    params: query
  })
}

// 删除满减活动
export function deleteFullActivity(query) {
  return request({
    url: path + '/discount/deleteDiscount',
    method: 'post',
    params: query
  })
}

// 禁用或启用满减活动
export function openFullActivity(query) {
  return request({
    url: path + '/discount/startOrForbidden',
    method: 'post',
    params: query
  })
}

// 添加满减活动
export function addFullActivity(query) {
  return request({
    url: path + '/discount/addDiscount',
    method: 'post',
    params: query
  })
}

// 添加满减活动对应的商品
export function addFullGoods(query) {
  return request({
    url: path + '/discount/addGoodsList',
    method: 'post',
    params: query
  })
}

// 删除满减活动对应的商品
export function deleteFullGoods(query) {
  return request({
    url: path + '/discount/deleteGoods',
    method: 'post',
    params: query
  })
}

// 添加满减活动对应的商品 -- excel类型
// export function addFullExcelGoods(query) {
// return request({
//   url: path + '/discount/uploadGoodsIdList',
//   headers: { 'Content-Type': 'multipart/form-data' },
//   // headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//   method: 'post',
//   params: query
// })
// }

// 编辑：获取活动数据
export function editFullActivity(query) {
  return request({
    url: path + '/discount/editDiscount',
    method: 'post',
    params: query
  })
}

// 编辑：满减活动对应的商品
export function editFullGoods(query) {
  return request({
    url: path + '/discount/listDiscountGoods',
    method: 'post',
    params: query
  })
}

// 更新满减活动数据
export function updateFullGoods(query) {
  return request({
    url: path + '/discount/updateDiscount',
    method: 'post',
    params: query
  })
}

// 活动报名模块==============================================================

// 可报名的活动-------------------------------------------------

// 获取可报名的活动列表
export function getJoinableActivityList(query) {
  return request({
    url: path + '/activityEnter/activityEnterList',
    method: 'get',
    params: query
  })
}

// 获取活动详情
export function getJoinActivityDetail(query) {
  return request({
    url: path + '/activityEnter/activityEnterDetail',
    method: 'get',
    params: query
  })
}

// 获取可选择的商品列表
export function getJoinActivitySelectList(query) {
  return request({
    url: path + '/goods/listForEnterActivity',
    method: 'post',
    params: query
  })
}

// 添加报名商品时获取所有规格
export function getTypeGoods(query) {
  return request({
    url: path + '/activityEnter/activityEnterGoods',
    method: 'get',
    params: query
  })
}

// 编辑报名商品时获取规格
export function getEditTypeGoods(query) {
  return request({
    url: path + '/activityEnter/activityEnterGoodsEdit',
    method: 'get',
    params: query
  })
}

// 提交活动的规格商品 促销
export function setAddTypeGoods(query) {
  return request({
    url: path + '/activityEnter/addActivityEnterGoods',
    method: 'post',
    params: query,
    type: 'json'
  })
}

// 直接提交报名商品 满减
export function setAddActivityGoods(query) {
  return request({
    url: path + '/activityEnter/addActivityEnterGoodsByGoodsIds',
    method: 'post',
    params: query
  })
}

// 获取活动的报名商品
export function getJoinActivityGoods(query) {
  return request({
    url: path + '/activityEnter/activityEnterDetailGoodsList',
    method: 'get',
    params: query
  })
}

// 取消报名的商品
export function setCancelJoinableGoods(query) {
  return request({
    url: path + '/activityEnter/cancel',
    method: 'post',
    params: query
  })
}

// 提交报名的商品
export function setSubmitJoinableGoods(query) {
  return request({
    url: path + '/activityEnter/submit',
    method: 'post',
    params: query
  })
}

// 修改报名的商品
export function setEditTypeGoods(query) {
  return request({
    url: path + '/activityEnter/updActivityEnterGoods',
    method: 'post',
    params: query,
    type: 'json'
  })
}

// 删除报名的规格商品
export function setDelJoinableGoods(query) {
  return request({
    url: path + '/activityEnter/delete',
    method: 'post',
    params: query
  })
}

// 已参与的活动------------------------------------------------

// 获取已参加的活动列表
export function getJoinedActivityList(query) {
  return request({
    url: path + '/activityEnter/partakeActivityList',
    method: 'get',
    params: query
  })
}

// 增加库存提交
export function setAddSkuAmount(query) {
  return request({
    url: path + '/activityEnter/addStock',
    method: 'post',
    params: query,
    type: 'json'
  })
}

