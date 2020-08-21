import request from '@/utils/request'

// 查询GDS列表
export function listRouteConfig(query) {
  return request({
    url: '/direct/route_config/page',
    method: 'get',
    params: query
  })
}

// 查询GDS详细
export function getRouteConfig(id) {
  return request({
    url: '/direct/route_config/' + id,
    method: 'get'
  })
}

// 新增GDS
export function addRouteConfig(data) {
  return request({
    url: '/direct/route_config',
    method: 'post',
    data: data
  })
}

// 修改GDS
export function updateRouteConfig(data) {
  return request({
    url: '/direct/route_config',
    method: 'put',
    data: data
  })
}

// GDS状态修改
export function changeRouteConfigStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/direct/route_config/changeStatus',
    method: 'put',
    data: data
  })
}

// 删除GDS
export function delRouteConfig(id) {
  return request({
    url: '/direct/route_config/' + id,
    method: 'delete'
  })
}
