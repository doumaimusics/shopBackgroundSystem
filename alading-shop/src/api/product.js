/**
 * 商品管理API
 */
import request from '@/utils/request.js'
import { getCategory } from '@/api/deal'
import { goTemplatePage } from '@/api/settings'
const path = '/shop'

// 发布商品 ======================================

// 获取类目
export const getGoodsCategory = getCategory

// 根据类目获取品牌列表
export function getBrandList(query) {
  return request({
    url: path + '/getBrandlistForShopAndCategory',
    method: 'post',
    params: query
  })
}

// 发布商品第一步
export function setAddProduct(query) {
  return request({
    url: path + '/goods/add',
    method: 'post',
    params: query,
    defineflag: true
  })
}

// 发布商品步骤优化
export function setNewAddProduct(query) {
  return request({
    url: path + '/goods/addn',
    method: 'post',
    params: query,
    defineflag: true
  })
}

// 根据有商品目录获取sku
export function setGoodSKU(query) {
  return request({
    url: path + '/goods/getStandardListByCateGoryId',
    method: 'post',
    params: query,
    defineflag: true
  })
}

// 编辑商品=============================================

// 获取商品标签库
export function getTagList(query) {
  return request({
    url: path + '/goods/getLabel',
    method: 'post',
    params: query
  })
}

// 获取商品详情
export function getProductDetail(id) {
  return request({
    url: path + `/goods/getById/${id}`,
    method: 'get'
  })
}

// 获取物流模板
export const getTemplatePage = goTemplatePage

// 提交编辑
export function setSubmitProduct(query) {
  return request({
    url: path + '/goods/edit',
    method: 'post',
    params: query
  })
}

// 仓库中和出售中的商品=====================================

// 搜索筛选
export function getSearchList(query) {
  return request({
    url: path + '/goods/list',
    method: 'post',
    params: query
  })
}

// 上架
export function setShelve(query) {
  return request({
    url: path + '/goods/shelve',
    method: 'post',
    params: query
  })
}

// 下架
export function setUnShelve(query) {
  return request({
    url: path + '/goods/unshelve',
    method: 'post',
    params: query
  })
}

// 删除商品
export function deleteGoods(query) {
  return request({
    url: path + '/goods/delete',
    method: 'post',
    params: query
  })
}

// 预览商品==============================================

export function getProductView(id) {
  return request({
    url: path + `/goods/preShow/${id}`,
    method: 'post'
  })
}
