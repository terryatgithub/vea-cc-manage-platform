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
export function sysDeptRemove (params) {
  return this.fetch({
    method: 'get',
    url: '/api/v1/sysDept/remove.html',
    params
  })
}
export function sysDeptSave (data) {
  return this.fetch({
    method: 'post',
    url: '/api/v1/sysDept/save.html',
    data: { jsonStr: JSON.stringify(data) }
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
