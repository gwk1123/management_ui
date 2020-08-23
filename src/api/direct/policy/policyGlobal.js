import request from '@/utils/request'

// 查询GDS列表
export function listPolicyGlobal(query) {
  return request({
    url: '/direct/policy_global/page',
    method: 'get',
    params: query
  })
}

// 查询GDS详细
export function getPolicyGlobal(id) {
  return request({
    url: '/direct/policy_global/' + id,
    method: 'get'
  })
}

// 新增GDS
export function addPolicyGlobal(data) {
  return request({
    url: '/direct/policy_global',
    method: 'post',
    data: data
  })
}

// 修改GDS
export function updatePolicyGlobal(data) {
  return request({
    url: '/direct/policy_global',
    method: 'put',
    data: data
  })
}

// GDS状态修改
export function changePolicyGlobalStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/direct/policy_global/changeStatus',
    method: 'put',
    data: data
  })
}

// 删除GDS
export function delPolicyGlobal(id) {
  return request({
    url: '/direct/policy_global/' + id,
    method: 'delete'
  })
}
