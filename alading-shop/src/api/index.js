/**
 * 店铺首页API
 */
import request from '@/utils/request'
const path = '/shop'

// 首页信息
export function goShopMainPage() {
  return request({
    url: path + '/goShopMainPage',
    method: 'post'
  })
}
