import request from '@/utils/request'

export function loginByUsername(username, password,timestamp) {
  const data = {
    username,
    password,
    timestamp
  }
  return request({
    url: '/cms/login',
    method: 'get',
    params: data
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getUserInfo() {
  return request({
    url: '/cms/getUserInfo',
    method: 'get',
  })
}


export function switchUserRole(data) {
  return request({
    url: '/cms/switchUserRole',
    method: 'get',
    params: data
  })
}

export function getRoleResource(data) {
  return request({
    url: '/cms/getRoleResource',
    method: 'get',
    params: data
  })
}

