/**
 * 主题皮肤管理
 */
export function themeInfoPageList (data) {
  return this.fetch({
    method: 'post',
    url: '/api/themeInfo/pageList.html',
    data
  })
}
