
export function floatWindowList(params = {}) {
  return this.fetch({
    url: 'api/v1/sysPlugin/pageList.html',
    params: Object.assign({
      pluginStatus: 4,
      pluginType: 'REFERENCE_ACTIVITY'
    }, params)
  })
}
