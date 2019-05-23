/**
 * 交易管理模块api
 */
import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import { objToUrlParams } from '@/utils/tools.js'
const path = '/shop'

// 订单管理------------------------

// 获取订单及商品列表
export function getOrderAndGoods(query) {
  return request({
    url: path + '/order/list',
    method: 'post',
    params: query
  })
}

// 获取商品类目
export function getCategory(query) {
  return request({
    url: path + '/category/list',
    method: 'post',
    params: query
  })
}

// 导出订单 以参数形式验证_token
export function setOrderExport(query) {
  const url = path + '/order/export'
  return `${url}?${objToUrlParams(query)}&_token=${getToken()}`;
}

// 单个发货
export function setDeliverySend(query) {
  return request({
    url: path + '/order/deliver',
    method: 'post',
    params: query
  })
}

// 下载发货模板
export function getDeliveryModel() {
  const url = path + '/order/downDeliverTemp'
  return `${url}?_token=${getToken()}`
}

// 导入发货
export function setImportApi() {
  return {
    url: path + '/order/deliverByTemp',
    headers: { 'token': getToken() }
  }
}

// 获取订单信息
export function getOrderInfo(id) {
  return request({
    url: path + `/order/detail/${id}`,
    method: 'post'
  })
}

// 获取物流公司列表
export function getDeliveryComList() {
  return request({
    url: path + '/logistics/list',
    method: 'post'
  })
}

// 修改物流
export function setModifyDelivery(query) {
  return request({
    url: path + '/order/modifyLogistics',
    method: 'post',
    params: query
  })
}

// 查看物流轨迹
export function getDeliveryPath(id) {
  return request({
    url: path + `/order/queryLogistics/${id}`,
    method: 'post'
  })
}

// 售后管理------------------------------------------------

// 获取售后单及商品列表
export function getAfterServiceGoods(query) {
  return request({
    url: path + '/getAfterSaleList',
    method: 'post',
    params: query
  })
}

// 导出订单 售后列表
export function setAfterSaleExport(query) {
  const url = path + '/export'
  return `${url}?${objToUrlParams(query)}&_token=${getToken()}`
}

// 批量退款
export function setBackMoney(query) {
  return request({
    url: path + '/moreBackAmount',
    method: 'post',
    params: query
  })
}

// 获取售后信息
export function getAfterServiceInfo(query) {
  return request({
    url: path + '/afterSaleDetail',
    method: 'post',
    params: query
  })
}

// 回寄签收退款
export function setSignBack(query) {
  return request({
    url: path + '/commitBackMoney',
    method: 'post',
    params: query
  })
}

// 售后详情审批
export function setAfterServiceApprove(query) {
  return request({
    url: path + '/submitBackAmount',
    method: 'post',
    params: query
  })
}

// 售后统计
export function getAfterSaleCount(query) {
  return request({
    url: path + '/getAfterSaleCount',
    method: 'post',
    params: query
  })
}

// 获取售后原因
export function getAfterSaleCause(query) {
  return request({
    url: path + '/getAfterSaleCause',
    method: 'post',
    params: query
  })
}

// 关闭售后订单
export function closeApply(query) {
  return request({
    url: path + '/closeApply',
    method: 'post',
    params: query
  })
}

// 换货类型售后-添加发货信息
export function getRedeliver(query) {
  return request({
    url: path + '/redeliver',
    method: 'post',
    params: query
  })
}

// 换货类型售后-添加发货信息
export function updateSallerLogistics(query) {
  return request({
    url: path + '/updateSallerLogistics',
    method: 'post',
    params: query
  })
}
