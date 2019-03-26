export function getGlobalCornerIconTypePageList (data) {
  return this.fetch({
    method: 'post',
    url: '/api/v1/cornerIconType/pageList.html',
    data
  })
}
export function globalCornerIconTypeBatchDel (data) {
  return this.fetch({
    method: 'post',
    url: '/api/v1/cornerIconType/remove.html',
    data
  })
}
/*
 * 新增编辑
*/
export function globalCornerIconTypeSave (data) {
  return this.fetch({
    method: 'post',
    url: '/api/v1/cornerIconType/save.html',
    data
  })
}
export function globalCornerIconTypeDetail (params) {
  return this.fetch({
    method: 'get',
    url: '/api/v1/cornerIconType/getDetailInfo.html',
    params
  })
}
