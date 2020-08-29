import request from '@/utils/request'

// 查询GDS列表
export function listOtaRule(query) {
  return request({
    url: '/direct/ota_rule/page',
    method: 'get',
    params: query
  })
}

// 查询GDS详细
export function getOtaRule(id) {
  return request({
    url: '/direct/ota_rule/' + id,
    method: 'get'
  })
}

// 新增GDS
export function addOtaRule(data) {
  return request({
    url: '/direct/ota_rule',
    method: 'post',
    data: data
  })
}

// 修改GDS
export function updateOtaRule(data) {
  return request({
    url: '/direct/ota_rule',
    method: 'put',
    data: data
  })
}

// GDS状态修改
export function changeOtaRuleStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/direct/ota_rule/changeStatus',
    method: 'put',
    data: data
  })
}

// 删除GDS
export function delOtaRule(id) {
  return request({
    url: '/direct/ota_rule/' + id,
    method: 'delete'
  })
}
