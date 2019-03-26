export function getMaterialTypes (data) {
  return this.fetch({
    method: 'post',
    url: '/api/dict/materialType.html',
    data
  })
}
export function getMaterialPageList (data) {
  return this.fetch({
    method: 'post',
    url: '/api/v1/poster/pageList.html',
    data
  })
}
export function materialBatchAudit (params) {
  return this.fetch({
    method: 'get',
    url: '/api/v1/poster/batchAudit.html',
    params
  })
}
export function materialBatchDelete (params) {
  return this.fetch({
    method: 'get',
    url: '/api/v1/poster/remove.html',
    params
  })
}
