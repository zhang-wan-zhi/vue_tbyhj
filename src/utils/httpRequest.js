import Vue from 'vue'
import axios from 'axios'
import router from '@/router'
import qs from 'qs'
import merge from 'lodash/merge'

import { clearLoginInfo } from '@/utils'

const http = axios.create({
  timeout: 1000 * 30,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    // "token":localStorage.getItem('token')
  }
})

/**
 * 请求拦截
 */
http.interceptors.request.use(config => {
  console.log(config)
  // config.headers['token'] = Vue.cookie.get('token') // 请求头带上token
  config.headers['token'] = localStorage.getItem('token')
  // config.headers['token'] =  '3a046696d65540389081af70de37ad05'
  return config
}, error => {
  return Promise.reject(error)
})

/**
 * 响应拦截
 */
http.interceptors.response.use(response => {
  console.log(response)
  if (response.data && response.data.code === 401) { // 401, token失效
    clearLoginInfo()
    router.push({ name: 'login' })
  }
  console.log(response)
  if (response.data.code == -1) {
    // localStorage.removeItem('token')

    Vue.prototype.$message({
      message: "登录过期/未登录，请登录后使用！",
      type: "warning",
      duration: 2000
    });
    
    let time = setTimeout(() => {
      // if(Vue.$route.name!='login'){
         router.push({ name: 'login' })
      // }
      clearTimeout(time)
    }, 1800)
  }
  if (response.data.code == 1 && response.data.msg) {
    Vue.prototype.$notify({
      title: '警告',
      message: response.data.msg,
      type: 'warning'
    });
  }
  return response
}, error => {
  return Promise.reject(error)
})

/**
 * 请求地址处理
 * @param {*} actionName action方法名称
 */
http.adornUrl = (actionName) => {
  // 非生产环境 && 开启代理, 接口前缀统一使用[/proxyApi/]前缀做代理拦截!
  console.log(process.env.NODE_ENV)
  return (process.env.NODE_ENV !== 'production' && process.env.OPEN_PROXY ? '/proxyApi/' : window.SITE_CONFIG.baseUrl) + actionName
}
http.defaults.timeout = 30000
/**
 * get请求参数处理
 * @param {*} params 参数对象
 * @param {*} openDefultParams 是否开启默认参数?
 */
http.adornParams = (params = {}, openDefultParams = true) => {
  var defaults = {
    // 't': new Date().getTime()
  }
  return openDefultParams ? merge(defaults, params) : params
}

/**
 * post请求数据处理
 * @param {*} data 数据对象
 * @param {*} openDefultdata 是否开启默认数据?
 * @param {*} contentType 数据格式
 *  json: 'application/json; charset=utf-8'
 *  form: 'application/x-www-form-urlencoded; charset=utf-8'
 */
http.adornData = (data = {}, openDefultdata = true, contentType = 'json') => {
  var defaults = {
    // 't': new Date().getTime()
  }
  data = openDefultdata ? merge(defaults, data) : data
  return contentType === 'json' ? JSON.stringify(data) : qs.stringify(data)
}

export default http
