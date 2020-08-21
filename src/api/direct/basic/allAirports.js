import request from '@/utils/request'

// 查询GDS列表
export function listAllAirports(query) {
  return request({
    url: '/direct/all_airports/page',
    method: 'get',
    params: query
  })
}

// 查询GDS详细
export function getAllAirports(id) {
  return request({
    url: '/direct/all_airports/' + id,
    method: 'get'
  })
}

// 新增GDS
export function addAllAirports(data) {
  return request({
    url: '/direct/all_airports',
    method: 'post',
    data: data
  })
}

// 修改GDS
export function updateAllAirports(data) {
  return request({
    url: '/direct/all_airports',
    method: 'put',
    data: data
  })
}

// GDS状态修改
export function changeAllAirports(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/direct/all_airports/changeStatus',
    method: 'put',
    data: data
  })
}

// 删除GDS
export function delAllAirports(id) {
  return request({
    url: '/direct/all_airports/' + id,
    method: 'delete'
  })
}
