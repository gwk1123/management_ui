import request from '@/utils/request'

// 查询GDS列表
export function listOta(query) {
  return request({
    url: '/direct/ota/page',
    method: 'get',
    params: query
  })
}

// 查询GDS详细
export function getOta(id) {
  return request({
    url: '/direct/ota/' + id,
    method: 'get'
  })
}

// 新增GDS
export function addOta(data) {
  return request({
    url: '/direct/ota',
    method: 'post',
    data: data
  })
}

// 修改GDS
export function updateOta(data) {
  return request({
    url: '/direct/ota',
    method: 'put',
    data: data
  })
}

// GDS状态修改
export function changeOtaStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/direct/ota/changeStatus',
    method: 'put',
    data: data
  })
}

// 删除GDS
export function delOta(id) {
  return request({
    url: '/direct/ota/' + id,
    method: 'delete'
  })
}
