import request from '@/utils/request'

// 查询GDS列表
export function listSiteRulesSwitch(query) {
  return request({
    url: '/direct/site_rules_switch/page',
    method: 'get',
    params: query
  })
}

// 查询GDS详细
export function getSiteRulesSwitch(id) {
  return request({
    url: '/direct/site_rules_switch/' + id,
    method: 'get'
  })
}

// 新增GDS
export function addSiteRulesSwitch(data) {
  return request({
    url: '/direct/site_rules_switch',
    method: 'post',
    data: data
  })
}

// 修改GDS
export function updateSiteRulesSwitch(data) {
  return request({
    url: '/direct/site_rules_switch',
    method: 'put',
    data: data
  })
}

// GDS状态修改
export function changeSiteRulesSwitchStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/direct/site_rules_switch/changeStatus',
    method: 'put',
    data: data
  })
}

// 删除GDS
export function delSiteRulesSwitch(id) {
  return request({
    url: '/direct/site_rules_switch/' + id,
    method: 'delete'
  })
}
