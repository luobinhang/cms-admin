import axios from 'axios'
import { Notification } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import apiBase from '@/utils/apiBase'


const service = axios.create({
  baseURL: apiBase(),
  timeout: 10000
})

service.interceptors.request.use(config => {
  if (store.getters.token) {
    config.headers['token'] = getToken()
  }
  return config
}, error => {
  console.log(error)
  Promise.reject(error)
})

service.interceptors.response.use(
  response => {
    const res = response.data;
    if (res.code !== "100") {
      Notification.error({
        message: res.msg,
        type: 'error',
        duration: 5000
      })
      return Promise.reject('error');
    } else {
      return response.data;
    }
  },

  error => {
    console.log('err' + error)
    Notification.error({
      message: '请检查网络连接是否正常，或稍后重试',
      type: 'error',
      duration: 5000
    })
    return Promise.reject(error)
  })

export default service
