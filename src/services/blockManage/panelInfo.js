/**
 * 版块管理 -> 常规运营
 */
// 分页(老接口)
export function panelPageList(data) {
  return this.fetch({
    method: 'post',
    url: 'api/panel/pageList.html',
    data
  })
}
