export function getBlockRecList (params) {
  return this.fetch({
    url: 'v1/bigDataRec/getRecList',
    params
  })
}
