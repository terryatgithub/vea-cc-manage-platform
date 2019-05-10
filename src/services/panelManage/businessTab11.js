export function businessTabSave(data) {
  return this.fetch({
    method: 'post',
    url: 'api/tab/save.html',
    data
  })
}

export function businessTabEdit(params) {
  return this.fetch({
    method: 'get',
    url: 'api/tab/getDetailInfo.html',
    params
  })
}
/** 收藏*/
export function businessTabCollect(data) {
  return this.fetch({
    method: 'post',
    url: 'api/commonResourceUser/tab/collectResource.html',
    data
  })
}

/** 取消收藏*/
export function businessTabCancelCollect(data) {
  return this.fetch({
    method: 'post',
    url: 'api/commonResourceUser/tab/cancelCollectResource.html',
    data
  })
}
