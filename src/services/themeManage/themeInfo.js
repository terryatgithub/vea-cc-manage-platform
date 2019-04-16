/**
 * 主题皮肤管理
 */
// 列表分页
export function themeInfoPageList (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/theme/pageList.html',
    data
  })
}
// 删除
export function themeInfoRemove (params) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/theme/remove.html',
    params
  })
}
// 预览
export function themeInfoDetail (params) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/theme/getDetailInfo.html',
    params
  })
}
// 历史
export function themeInfoHistory (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/hvi/historyList.html',
    data
  })
}
