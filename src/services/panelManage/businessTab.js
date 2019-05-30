export function businessTabSave(data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/tab/save.html',
    data
  })
}
export function businessTabDelete(data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/tab/remove.html',
    data
  })
}


export function businessTabEdit(params) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/tab/getDetailInfo.html',
    params
  })
}
/** 收藏*/
export function businessTabCollect(data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/commonResourceUser/tab/collectResource.html',
    data
  })
}

/** 取消收藏*/
export function businessTabCancelCollect(data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/commonResourceUser/tab/cancelCollectResource.html',
    data
  })
}
