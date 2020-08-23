import request from '@/utils/request'

// 查询GDS列表
export function listPolicyInfo(query) {
  return request({
    url: '/direct/policy_info/page',
    method: 'get',
    params: query
  })
}

// 查询GDS详细
export function getPolicyInfo(id) {
  return request({
    url: '/direct/policy_info/' + id,
    method: 'get'
  })
}

// 新增GDS
export function addPolicyInfo(data) {
  return request({
    url: '/direct/policy_info',
    method: 'post',
    data: data
  })
}

// 修改GDS
export function updatePolicyInfo(data) {
  return request({
    url: '/direct/policy_info',
    method: 'put',
    data: data
  })
}

// GDS状态修改
export function changePolicyInfoStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/direct/policy_info/changeStatus',
    method: 'put',
    data: data
  })
}

// 删除GDS
export function delPolicyInfo(id) {
  return request({
    url: '/direct/policy_info/' + id,
    method: 'delete'
  })
}
