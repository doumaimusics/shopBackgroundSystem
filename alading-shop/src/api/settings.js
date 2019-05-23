/**
 * 店铺管理API
 */
import request from '@/utils/request.js'
const path = '/shop'

// 物流模板管理====================================================

// 获取物流
export function goTemplatePage() {
  return request({
    url: path + '/goTemplatePage',
    method: 'get'
  })
}

// 删除物流模板
export function deleteLogistics(data) {
  return request({
    url: path + '/deleteLogistics',
    method: 'post',
    params: data
  })
}

// 新增物流模板
export function addLogistics(data) {
  return request({
    url: path + '/addLogistics',
    method: 'post',
    params: data
  })
}

// 获取编辑物流模板
export function getLogTemplate(data) {
  return request({
    url: path + '/getLogTemplate',
    method: 'post',
    params: data
  })
}

// 提交编辑物流模板
export function updateLogistics(data) {
  return request({
    url: path + '/updateLogistics',
    method: 'post',
    params: data
  })
}

// 品牌管理=======================================================

// 获取该店铺的商品名称列表
export function getShopTrademarkNameList() {
  return request({
    url: path + '/getBrandListForShop',
    method: 'post'
  })
}

// 获取该店铺的品牌列表
export function getShopBrandList() {
  return request({
    url: path + '/getTrademark',
    method: 'post'
  })
}

// 提交品牌信息
export function setShopBrandSubmit(query) {
  return request({
    url: path + '/addTrademark',
    method: 'post',
    params: query
  })
}

// 店铺基本设置======================================================

// 店铺设置获取初始数据
export function initData() {
  return request({
    url: path + '/goBasicPage',
    method: 'get'
  })
}

// 店铺设置更新店铺信息
export function updateData(res) {
  return request({
    url: path + '/updateShop',
    method: 'post',
    params: res
  })
}

// 店铺设置新增地址
export function addAddress(res) {
  return request({
    url: path + '/addBackAddress',
    method: 'post',
    params: res
  })
}

// 店铺设置默认地址
export function updateDefaltAddress(res) {
  return request({
    url: path + '/updateDefaltAddress',
    method: 'post',
    params: res
  })
}

// 店铺设置删除地址
export function rmAddress(res) {
  return request({
    url: path + '/deleteAddress',
    method: 'post',
    params: res
  })
}

// 忘记密码(原密码)
export function forgetPwd(data) {
  return request({
    url: path + '/user/forgetPwd',
    method: 'post',
    params: data
  })
}

// 子账号管理==================================================

// 创建子账号
export function addAdmin(data) {
  return request({
    url: path + '/user/addAdmin',
    method: 'post',
    params: data
  })
}

// 更新子账号
export function updateAdmin(data) {
  return request({
    url: path + '/user/updateAdmin',
    method: 'post',
    params: data
  })
}

// 子账号列表
export function adminList() {
  return request({
    url: path + '/user/listAdmin',
    method: 'post'
  })
}

// 开关子账号
export function updateStatus(data) {
  return request({
    url: path + '/user/updateStatus',
    method: 'post',
    params: data
  })
}

// 删除子账号
export function deleteAdmin(data) {
  return request({
    url: path + '/user/deleteAdmin',
    method: 'post',
    params: data
  })
}

// 经营许可证===============================================

// 获取经营许可证
export function goLicensePage() {
  return request({
    url: path + '/goLicensePage',
    method: 'post'
  })
}

// 上传经营许可证
export function saveLicense(data) {
  return request({
    url: path + '/saveLicense',
    method: 'post',
    params: data
  })
}

// 审核经营许可证
export function submitLicense(data) {
  return request({
    url: path + '/submitLicense',
    method: 'post',
    params: data
  })
}

// 账户管理============================================================

// 账户管理
export function accountPage() {
  return request({
    url: path + '/accountPage',
    method: 'post'
  })
}

// 提现按钮判断是否达到要求
export function cashOutValid() {
  return request({
    url: path + '/accountWithdrawalFrontVerify',
    method: 'post',
    defineflag: true // 手动控制code不是1000的情况
  })
}

// 用户余额明细
export function accountDetail(data) {
  return request({
    url: path + '/accountDetail',
    method: 'post',
    params: data
  })
}

// 保证金缴纳和取出
export function bondOperation(data) {
  return request({
    url: path + '/bondOperation',
    method: 'post',
    params: data
  })
}

// 用户提现充值
export function accountOperation(data) {
  return request({
    url: path + '/accountOperation',
    method: 'post',
    params: data
  })
}

// 银行卡管理=======================================================

// 添加银行卡获取银行名称
export function getBankList() {
  return request({
    url: path + '/getBankList',
    method: 'post'
  })
}

// 根据银行卡号获取银行名称
export function getBankName(data) {
  return request({
    url: path + '/getBankName',
    method: 'post',
    params: data
  })
}

// 提交绑卡
export function submitBankCard(data) {
  return request({
    url: path + '/submitBankCard',
    method: 'post',
    params: data
  })
}

// 添加银行卡获取验证码
export function applyBindBankcard(data) {
  return request({
    url: path + '/applyBindBankcard',
    method: 'post',
    params: data
  })
}

// 删除已绑银行卡
export function deleteBankCard(data) {
  return request({
    url: path + '/deleteBankCard',
    method: 'post',
    params: data
  })
}

// 设置支付密码
export function setPayPwd(data) {
  return request({
    url: path + '/setPayPwd',
    method: 'post',
    params: data
  })
}

// 修改支付密码
export function changePayPwd(data) {
  return request({
    url: path + '/changePayPwd',
    method: 'post',
    params: data
  })
}

// 银行卡管理
export function listBankCards() {
  return request({
    url: path + '/listBankCards',
    method: 'post'
  })
}
