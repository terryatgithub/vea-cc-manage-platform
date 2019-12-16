export function getUserContentAuth (params) {
  return this.fetch({
    url: 'api/v1/sysContentAuthMgr/getUserContentAuth.html',
    params
  })
}

export function getResourceContentAuthList (params) {
  return this.fetch({
    url: 'api/v1/sysContentAuthMgr/listResourceContentAuth.html',
    params
  })
}

export function upsertResourceContentAuthList (data) {
  const formData = new FormData()
  formData.append('jsonStr', JSON.stringify(data))
  return this.fetch({
    method: 'post',
    url: 'api/v1/sysContentAuthMgr/save.html',
    data: formData,
    isJSON: true
  })
}
