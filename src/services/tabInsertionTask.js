export function tabInsertionTaskGetList(params) {
  return this.fetch({
    url: 'api/v1/tabForceInsert/pageList.html',
    params
  })
}

export function tabInsertionTaskGetDetail (params) {
  return this.fetch({
    url: 'api/v1/tabForceInsert/getDetailInfo.html',
    params
  })
}

export function tabInsertionTaskUpsert (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/tabForceInsert/save.html',
    data: { jsonStr: JSON.stringify(data) }
  })
}
