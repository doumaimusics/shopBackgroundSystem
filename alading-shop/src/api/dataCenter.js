/**
 * 数据中心API
 */
import request from '@/utils/request.js'
const path = '/shop'

// 数据看板实时数据
export function recentLiveData() {
  return request({
    url: path + '/statistics/recentLiveData',
    method: 'post'
  })
}
