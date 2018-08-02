import request from '@/utils/request'

/**
 *
 * 获取banner列表
 *
 */
export function getWebSiteBannerDetail(data) {
  return request({
    url: '/systemManager/getPcWebSiteBannerDetail',
    method: 'post',
    data,
  })
}

/**
 *
 * 新增banner
 *
 */
export function createBannner(data) {
  return request({
    url: '/systemManager/createPcBannner',
    method: 'post',
    data,
  })
}

/**
 *
 * 新增banner
 *
 */
export function saveWebSiteBanner(data) {
  return request({
    url: '/systemManager/savePcWebSiteBanner',
    method: 'post',
    data,
  })
}

/**
 *
 * banner上下架
 *
 */
export function editWebSiteBannerStatus(data) {
  return request({
    url: '/systemManager/editPcWebSiteBannerStatus',
    method: 'post',
    data,
  })
}

/**
 *
 * banner上下架
 *
 */
export function updatePcBannnerSort(data) {
  return request({
    url: '/systemManager/updatePcBannnerSort',
    method: 'post',
    data,
  })
}
