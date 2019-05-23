/**
 * 登录模块API
 */
import request from '@/utils/request'
const path = 'shop'

export function loginByUsername(username, password) {
  return request({
    url: path + '/user/login',
    method: 'post',
    params: {
      username,
      password
    }
  })
}

export function register(data) {
  return request({
    url: path + '/user/register',
    method: 'post',
    params: data
  })
}
export function getCode(username, type) {
  return request({
    url: path + '/getVerifyCode',
    method: 'post',
    params: { username: username, type: type }
  })
}

// 忘记密码(验证码)
export function forget(data) {
  return request({
    url: path + '/user/forget',
    method: 'post',
    params: data
  })
}

export function logout() {
  return request({
    url: path + '/logout',
    method: 'post'
  })
}

export function getUserInfo() {
  return request({
    url: path + '/user/getUserInfo',
    method: 'post'
  })
}

