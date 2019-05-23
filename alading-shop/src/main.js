import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

// import Element from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
// Vue.use(Element, { size: 'medium' })

import './elementUI' // 按需引入elementUI

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import './icons' // icon
import './errorLog'// error log
import './permission' // permission control

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
