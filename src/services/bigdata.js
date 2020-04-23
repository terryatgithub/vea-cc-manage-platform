export function getBlockRecList (params) {
  return this.fetch({
    url: 'api/v1/bigDataRec/getRecList',
    params
  })
}
