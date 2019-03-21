/**
 * 系统设置->部门管理
 */
export function sysDeptPageList (data) {
  return this.fetch({
    method: 'post',
    url: '/api/v1/sysDept/pageList.html',
    data
  })
}
// 这个是老的接口
export function sysDeptRemove (params) {
  return this.fetch({
    method: 'get',
    url: '/api/sysDept/remove.html',
    params
  })
}
export function sysDeptSave (params) {
  return this.fetch({
    method: 'post',
    url: '/api/v1/sysDept/save.html',
    params
  })
}
export function sysDeptDetailInfo (params) {
  return this.fetch({
    method: 'get',
    url: '/api/v1/sysDept/getDetailInfo.html',
    params
  })
}
export function sysDeptUpdateSeq (params) {
  return this.fetch({
    method: 'get',
    url: '/api/v1/sysDept/updateSeq.html',
    params
  })
}
