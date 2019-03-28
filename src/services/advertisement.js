export function advertisementList () {
  return this.fetch({
    url: 'api/adBit/pageList.html?rows=10000'
  })
}

export function advertisementUpsert (data) {
  return this.fetch({
    method: 'post',
    url: 'api/adBit/switchStatus.html',
    data
  })
}
