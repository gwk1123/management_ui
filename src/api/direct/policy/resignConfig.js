import request from '@/utils/request'

// 查询GDS列表
export function listResignConfig(query) {
  return request({
    url: '/direct/resign_config/page',
    method: 'get',
    params: query
  })
}

// 查询GDS详细
export function getResignConfig(id) {
  return request({
    url: '/direct/resign_config/' + id,
    method: 'get'
  })
}

// 新增GDS
export function addResignConfig(data) {
  return request({
    url: '/direct/resign_config',
    method: 'post',
    data: data
  })
}

// 修改GDS
export function updateResignConfig(data) {
  return request({
    url: '/direct/resign_config',
    method: 'put',
    data: data
  })
}

// GDS状态修改
export function changeResignConfig(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/direct/resign_config/changeStatus',
    method: 'put',
    data: data
  })
}

// 删除GDS
export function delResignConfig(id) {
  return request({
    url: '/direct/resign_config/' + id,
    method: 'delete'
  })
}
