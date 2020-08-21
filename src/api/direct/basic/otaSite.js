import request from '@/utils/request'

// 查询GDS列表
export function listOtaSite(query) {
  return request({
    url: '/direct/ota_site/page',
    method: 'get',
    params: query
  })
}

// 查询GDS详细
export function getOtaSite(id) {
  return request({
    url: '/direct/ota_site/' + id,
    method: 'get'
  })
}

// 新增GDS
export function addOtaSite(data) {
  return request({
    url: '/direct/ota_site',
    method: 'post',
    data: data
  })
}

// 修改GDS
export function updateOtaSite(data) {
  return request({
    url: '/direct/ota_site',
    method: 'put',
    data: data
  })
}

// GDS状态修改
export function changeOtaSiteStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/direct/ota_site/changeStatus',
    method: 'put',
    data: data
  })
}

// 删除GDS
export function delOtaSite(id) {
  return request({
    url: '/direct/ota_site/' + id,
    method: 'delete'
  })
}
