/**
 * 公共校验函数
 */
import { Message } from 'element-ui'

/**
 * 图片上传
 * @param {file} file el-upload文件对象
 * @param {number} size 限制的文件大小 默认500
 */
export const validImgUpload = (file, size) => {
  size = +size || 500
  const isJPG = file.type.includes('jpg')
  const isJPEG = file.type.includes('jpeg')
  const isPNG = file.type.includes('png')
  const isLt2M = file.size / 1024 < size
  if (!isJPG && !isJPEG && !isPNG) {
    Message.error('请上传jpg，png格式的图片')
  } else if (!isLt2M) {
    Message.error('上传图片大小不能超过' + size + 'kb！')
  }
  return isLt2M && (isJPEG || isPNG || isJPG)
}

/* 金额验证*/
export const account = (rule, value, callback) => {
  const regEn = /^[0-9]+([.]{1}[0-9]{1,2}){0,1}$/
  if (!regEn.test(value)) {
    callback(new Error('金额格式为数字,且最多2位小数'))
  } else {
    callback()
  }
}

/* 用户名验证*/
export const shopName = (rule, value, callback) => {
  const regEn = /[`~!@#$%^&*()+?:"{},.\/;']/im // 去除<>_[]
  const regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】]/im

  if (regEn.test(value) || regCn.test(value)) {
    callback(new Error('店铺名称不支持特殊符号'))
  } else {
    callback()
  }
}

/* 手机号验证*/
export const username = (rule, value, callback) => {
  const reg = /^1\d{10}$/i
  if (!reg.test(value)) {
    callback(new Error('请输入正确的手机号'))
  } else {
    callback()
  }
}

/* 密码验证*/
export const password = (rule, value, callback) => {
  const reg = /^[a-zA-Z0-9]+$/
  if (!value || value.length < 8 || value.length > 16) {
    callback(new Error('密码长度有误,请填写8--16位密码,支持大小写字母和数字'))
  } else if (!reg.test(value)) {
    callback(new Error('密码格式有误,请填写8--16位密码,支持大小写字母和数字'))
  } else {
    callback()
  }
}

/* 验证码长度验证*/
export const code = (rule, value, callback) => {
  if (!value || value.length !== 6) {
    callback(new Error('请输入正确的验证码'))
  } else {
    callback()
  }
}

/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validateAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * validate email
 * @param email
 * @returns {boolean}
 */
export function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

