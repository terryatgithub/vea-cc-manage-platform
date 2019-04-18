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
// 保存
export function savethemeInfo (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/theme/save.html',
    data
  })
}
// 检查MD5
export function checkThemeMd5 (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/theme/checkThemeMd5.html',
    data
  })
}
