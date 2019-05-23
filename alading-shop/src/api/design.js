/**
 * 店铺装修API
 */
import request from '@/utils/request.js'
const path = '/shop'

// 店铺橱窗管理=========================

// 开启或关闭橱窗管理
export function isOpenShopWindow(query) {
  return request({
    url: path + '/windows/isOpenOrClose',
    method: 'post',
    params: query
  })
}

// 获取橱窗列表
export function getShopWindowList(query) {
  return request({
    url: path + '/windows/getWindowGoodsList',
    method: 'post',
    params: query
  })
}

// 删除橱窗商品
export function setDelShopWindow(query) {
  return request({
    url: path + '/windows/deleteWindowGoods',
    method: 'post',
    params: query
  })
}

// 添加橱窗商品
export function setMultiWindow(query) {
  return request({
    url: path + '/windows/addWindowGoods',
    method: 'post',
    params: query
  })
}

// 店铺首页装修=============================================

// 获取店铺所有模板
export function getShopTempl() {
  return request({
    url: path + '',
    method: 'post'
  })
}

// 新建模板
export function setNewTempl(query) {
  return request({
    url: path + '',
    method: 'post',
    params: query
  })
}

// 发布模板
export function setPublicTempl(query) {
  return request({
    url: path + '',
    method: 'post',
    params: query
  })
}

// 删除模板
export function setDeleteTempl(query) {
  return request({
    url: path + '',
    method: 'post',
    params: query
  })
}

// 装修模板===================================================

// 获取模板详情
export function getTemplDetail(query) {
  return request({
    url: path + '',
    method: 'post',
    params: query
  })
}

// 保存模板设置
export function setSaveTempl(query) {
  return request({
    url: path + '',
    method: 'post',
    params: query
  })
}
