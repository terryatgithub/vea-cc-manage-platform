export function deviceConfigGetList (params) {
  return this.fetch({
    url: 'api/v1/deviceConfig/pageList.html',
    params
  })
}

export function deviceConfigGetDetail (params) {
  return this.fetch({
    url: 'api/v1/deviceConfig/getDetailInfo.html',
    params
  })
}

export function deviceConfigUpsert (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/deviceConfig/save.html',
    data: { jsonStr: JSON.stringify(data) }
  })
}
