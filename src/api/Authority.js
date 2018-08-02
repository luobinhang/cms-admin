import request from '@/utils/request'

/**
 *
 * 获取路由
 *
 */
export function getAllResource(data) {
  return request({
    url: 'cms/getAllResource',
    method: 'get',
    params: data
  })
}

/**
 *
 * 新增路由
 *
 */
export function createResource(data) {
  return request({
    url: 'cms/createResource',
    method: 'post',
    data
  })
}

/**
 *
 * 编辑路由
 *
 */
export function editResource(data) {
  return request({
    url: 'cms/editResource',
    method: 'post',
    data
  })
}

/**
 *
 * 获取所有角色信息
 *
 */
export function getPageRole(data) {
  return request({
    url: 'cms/getPageRole',
    method: 'get',
    params: data
  })
}

/**
 *
 * 权限分配
 *
 */
export function editRolePermission(data) {
  return request({
    url: 'cms/editRolePermission',
    method: 'post',
    data
  })
}

/**
 *
 * 权限回显
 *
 */
export function displayAllResource(data) {
  return request({
    url: 'cms/displayAllResource',
    method: 'get',
    params: data
  })
}
