export function crowdRelUpsert (data) {
  const formData = new FormData()
  formData.append('jsonStr', JSON.stringify(data))
  return this.fetch({
    method: 'post',
    url: 'api/v1/dmpMgr/save.html',
    data: formData,
    isJSON: true
  })
}

export function crowdRelGet (params) {
  return this.fetch({
    url: 'api/v1/dmpMgr/getDetailInfo.html',
    params
  })
}

export function crowdRelDel(params) {
  return this.fetch({
    url: 'api/v1/dmpMgr/remove.html',
    params
  })
}

export function crowdRefresh () {
  return this.fetch({
    url: 'api/v1/dmpMgr/loadDmpData.html'
  })
}

export function crowdRelList (params) {
  return this.fetch({
    url: 'api/v1/dmpMgr/listCrowdRelationship.html',
    params
  })
}
