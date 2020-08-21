import request from '@/utils/request'

// 查询GDS列表
export function listGds(query) {
  return request({
    url: '/direct/gds/page',
    method: 'get',
    params: query
  })
}

// 查询GDS详细
export function getGds(id) {
  return request({
    url: '/direct/gds/' + id,
    method: 'get'
  })
}

// 新增GDS
export function addGds(data) {
  return request({
    url: '/direct/gds',
    method: 'post',
    data: data
  })
}

// 修改GDS
export function updateGds(data) {
  return request({
    url: '/direct/gds',
    method: 'put',
    data: data
  })
}

// GDS状态修改
export function changeGdsStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/direct/gds/changeStatus',
    method: 'put',
    data: data
  })
}

// 删除GDS
export function delGds(id) {
  return request({
    url: '/direct/gds/' + id,
    method: 'delete'
  })
}
