export function advertisementList () {
  return this.fetch({
    url: 'api/v1/adBlock/pageList.html?rows=10000'
  })
}

export function advertisementUpsert (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/adBlock/switchStatus.html',
    data
  })
}
