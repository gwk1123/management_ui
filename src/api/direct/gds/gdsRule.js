import request from '@/utils/request'

// 查询GDS列表
export function listGdsRule(query) {
  return request({
    url: '/direct/gds_rule/page',
    method: 'get',
    params: query
  })
}

// 查询GDS详细
export function getGdsRule(id) {
  return request({
    url: '/direct/gds_rule/' + id,
    method: 'get'
  })
}

// 新增GDS
export function addGdsRule(data) {
  return request({
    url: '/direct/gds_rule',
    method: 'post',
    data: data
  })
}

// 修改GDS
export function updateGdsRule(data) {
  return request({
    url: '/direct/gds_rule',
    method: 'put',
    data: data
  })
}

// GDS状态修改
export function changeGdsRuleStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/direct/gds_rule/changeStatus',
    method: 'put',
    data: data
  })
}

// 删除GDS
export function delGdsRule(id) {
  return request({
    url: '/direct/gds_rule/' + id,
    method: 'delete'
  })
}
