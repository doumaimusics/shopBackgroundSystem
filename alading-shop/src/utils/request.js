/**
 * axios请求配置
 */
import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import { objToUrlParams } from '@/utils/tools'

let defineflag = false

// create an axios instance
const service = axios.create({
  timeout: 30000
})

// request interceptor
service.interceptors.request.use(config => {
  // judge whether need deal response with code . add by @liurong
  config.defineflag ? defineflag = true : defineflag = false

  if (store.getters.token) {
    config.headers['token'] = getToken()
  }

  // post请求方式配置
  if (config.method === 'post') {
    // params转data
    if (!config.data && config.params) {
      config.data = { ...config.params }
    }
    config.params = undefined

    if (config.type === 'json') {
      // type: 'json' content-type为json形式
      config.headers['Content-Type'] = 'application/json;charset=utf-8'
      config.transformRequest = [data => data && JSON.stringify(data)]
    } else {
      // 默认 content-type为form表单形式
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'
      config.transformRequest = [data => data && objToUrlParams(data)]
    }
  }
  return config
}, error => {
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(response => {
  const res = response.data
  if (res.code !== 1000) {
    // 2001:Token 过期了,1155:登录有问题;
    if (res.code === 2001 || res.code === 1155) {
      MessageBox.alert('你的账号信息已过期，请重新登录', '超时登出', {
        confirmButtonText: '重新登录',
        // cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('FedLogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      })
    } else {
      !defineflag && Message({
        message: res.msg,
        type: 'error',
        duration: 5 * 1000
      })
      return defineflag ? response.data : Promise.reject(res.msg)
    }
  } else {
    return response.data
  }
}, error => {
  Message({
    message: error.message,
    type: 'error',
    duration: 5 * 1000
  })
  return Promise.reject(error)
})

export default service
