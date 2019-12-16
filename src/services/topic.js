export function topicGetList (params) {
  return this.fetch({
    url: 'api/v1/topic/pageList.html',
    params
  })
}

export function topicGetDetail (params) {
  return this.fetch({
    url: 'api/v1/topic/getDetailInfo.html',
    params
  })
}

export function topicUpsert (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/topic/save.html',
    data: { jsonStr: JSON.stringify(data) }
  })
}
