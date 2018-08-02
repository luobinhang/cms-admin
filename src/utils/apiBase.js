/**
 * Created by Hang on 2018/5/30 0030.
 */
import Vue from 'vue'

export default function apiBase() {
  let api = 'https://getaway.onlyeduhi.cn/cms/server'
  if(location.host === '172.16.20.98:9528') {
    // api = 'https://getaway.onlyeduhi.cn/cms/server'
    api = 'http://172.16.20.97:8523'
  } else if(location.host === 'cmsadmin.onlyhi.cn') {
    api = 'https://hkt.onlyhi.cn/cms/server'
  }
  return api
}

Vue.prototype.apiBase = apiBase();
