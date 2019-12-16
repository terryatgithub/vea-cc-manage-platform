export function topicConfigGetList (params) {
  return this.fetch({
    url: 'api/v1/topicConfig/pageList.html',
    params
  })
}

export function topicConfigGetDetail (params) {
  return this.fetch({
    url: 'api/v1/topicConfig/getDetailInfo.html',
    params
  })
}

export function topicConfigUpsert (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/topicConfig/save.html',
    data: { jsonStr: JSON.stringify(data) }
  })
}
