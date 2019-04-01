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
