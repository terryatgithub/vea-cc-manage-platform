export function getLayoutInforPageList (data) {
  return this.fetch({
    method: 'post',
    url: '/api/v1/layout/pageList.html',
    data
  })
}
export function getLayoutInforBatchDel (data) {
  return this.fetch({
    method: 'post',
    url: '/api/v1/layout/remove.html',
    data
  })
}
/*
 * 新增编辑保存
*/
export function getLayoutInforSave (data) {
  return this.fetch({
    method: 'post',
    url: '/api/v1/layout/save.html',
    data
  })
}
/*
 * 获取编辑信息
*/
export function getLayoutInforById (params) {
  return this.fetch({
    method: 'get',
    url: '/api/v1/layout/getDetailInfo.html',
    params
  })
}
