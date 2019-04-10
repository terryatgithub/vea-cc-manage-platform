/**
 * 主题皮肤管理
 */
// 列表分页
export function themeInfoPageList (data) {
  return this.fetch({
    method: 'post',
    url: '/api/themeInfo/pageList.html',
    data
  })
}
// 删除
export function themeInfoRemove (params) {
  return this.fetch({
    method: 'get',
    url: '/api/themeInfo/remove.html',
    params
  })
}
// 预览
export function themeInfoDetail (params) {
  return this.fetch({
    method: 'get',
    url: '/api/themeInfo/getDetailInfo.html',
    params
  })
}
