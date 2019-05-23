/**
 * 店铺申请API
 */
import request from '@/utils/request'
const path = 'shop'
const imgPath = 'upload'

// 初始化主营类目
export function initItems(query) {
  return request({
    url: path + '/categoryList',
    method: 'post',
    params: query
  })
}

// 上传图片
export function UPLOAD(res) {
  return request({
    url: imgPath + '/uploadFile',
    method: 'post',
    params: res
  })
}

// 判断经营许可证有没有审核成功
export function licenseStatus(res) {
  return request({
    url: path + '/checkLicense',
    method: 'post',
    params: res
  })
}

// 注册店铺
export function applyShop(res) {
  return request({
    url: path + '/commitShop',
    method: 'post',
    params: res
  })
}

// 审核失败后的恢复信息
export function getShopInfo() {
  return request({
    url: path + '/getShopInfo',
    method: 'post'
  })
}

// 店铺设置更新店铺信息
// export function updateData(res) {
//     return request({
//       url: path+'/updateShop',
//       method: 'post',
//       params:res
//     })
//   }

// 根据主营类目获取商标（品牌）名称
export function getTrademarkNameList(query) {
  return request({
    url: path + '/getBrandListForCategory',
    method: 'post',
    params: query
  })
}


// 获取招商经理信息
export function getInvestManagerList(query) {
  return request({
    url: path + '/getInvestManagerList',
    method: 'post',
    params: query
  })
}
