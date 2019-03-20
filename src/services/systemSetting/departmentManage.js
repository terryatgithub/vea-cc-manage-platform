/**
 * 部门管理
 */
export function sysDeptPageList (data) {
  return this.fetch({
    method: 'post',
    url: '/api/sysDept/pageList.html',
    data
  })
}
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
    url: '/api/sysDept/save.html',
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
