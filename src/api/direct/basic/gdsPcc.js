import request from '@/utils/request'

// 查询GDS列表
export function listGdsPcc(query) {
  return request({
    url: '/direct/gds_pcc/page',
    method: 'get',
    params: query
  })
}

// 查询GDS详细
export function getGdsPcc(id) {
  return request({
    url: '/direct/gds_pcc/' + id,
    method: 'get'
  })
}

// 新增GDS
export function addGdsPcc(data) {
  return request({
    url: '/direct/gds_pcc',
    method: 'post',
    data: data
  })
}

// 修改GDS
export function updateGdsPcc(data) {
  return request({
    url: '/direct/gds_pcc',
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
    url: '/direct/gds_pcc/changeStatus',
    method: 'put',
    data: data
  })
}

// 删除GDS
export function delGdsPcc(id) {
  return request({
    url: '/direct/gds_pcc/' + id,
    method: 'delete'
  })
}
