/**
 * 版面管理 -> Tab版面管理
 */
// 分页
export function tabInfoList(data) {
  return this.fetch({
    method: 'post',
    url: '/api/tabInfo/pageList.html',
    data
  })
}
// 版面属性Option
export function getAppIdType(data) {
  return this.fetch({
    method: 'post',
    url: '/api/globalDictInfo/getTypes/appIdType.html',
    data
  })
}
// 业务分类
export function getBusinessType(data) {
  return this.fetch({
    method: 'post',
    url: '/api/globalDictInfo/getTypes/businessType.html',
    data
  })
}

/**
 * 版面管理 -> 业务版面
 */
export function getTabType(data) {
  return this.fetch({
    method: 'post',
    url: '/api/dict/tab/tabType.html?tabParentType=biz',
    data
  })
}
