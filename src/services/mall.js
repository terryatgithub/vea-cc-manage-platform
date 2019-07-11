export function mallGetList(params) {
  return this.fetch({
    url: 'api/v1/mall/pageList.html',
    params
  })
}
