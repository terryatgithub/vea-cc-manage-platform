export function commonPannelUserList(data) {
  return this.fetch({
    method: 'post',
    url: 'api/collect/pannel/pageList.html',
    data
  })
}
export function commonResourceCancelCollect(data) {
  return this.fetch({
    method: 'post',
    url: 'api/commonResourceUser/pannel/cancelCollectResource.html',
    data
  })
}
