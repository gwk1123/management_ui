import request from '@/utils/request'

// 查询GDS列表
export function listGdsSearch(query) {
  return request({
    url: '/direct/gds_search',
    method: 'post',
    data: query
  })
}
