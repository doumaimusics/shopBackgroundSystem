/**
 * 结算管理API
 */
import request from '@/utils/request.js'
import { getToken } from '@/utils/auth'
import { objToUrlParams } from '@/utils/tools.js'
const path = '/shop'

// 结算管理
export function balanceList(data) {
  return request({
    url: path + '/balance/balanceList',
    method: 'post',
    params: data
  })
}

// 导出订单 以参数形式验证_token
export function setSettleExport(query) {
  const url = path + '/settle/export'
  console.log(url)
  return `${url}?${objToUrlParams(query)}&_token=${getToken()}`
}

// 佣金比例
export function cateRateList() {
  return request({
    url: path + '/balance/cateRateList',
    method: 'post'
  })
}

// 结算详情
export function balanceDetail(data) {
  return request({
    url: path + '/balance/balanceDetail',
    method: 'post',
    params: data
  })
}
