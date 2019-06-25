
// export function getMaterialTypes (data) {
//   return this.fetch({
//     method: 'post',
//     url: 'api/dict/materialType.html',
//     data
//   })
// }
export function getMaterialPageList (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/poster/pageList.html',
    data
  })
}
export function materialBatchAudit (params) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/poster/batchAudit.html',
    params
  })
}
export function materialBatchDelete (params) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/poster/remove.html',
    params
  })
}
/**
 * 公共模块-点击事件管理--系统菜单按钮
 */
export function getCommonOnclickInfoMenu () {
  return this.fetch({
    method: 'post',
    url: 'api/v1/onclickInfo/getMenuInfo.html'
  })
}
/**
 * 公共模块-点击事件管理--列表
 */
export function getCommonOnclickInfoList (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/onclickInfo/pageList.html',
    data
  })
}
/**
 * 公共模块-点击事件管理--保存
 */
export function commonOnclickInfoSave (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/onclickInfo/save.html',
    data
  })
}
/**
 * 公共模块-点击事件管理--删除
 */
export function commonOnclickInfoDelete (params) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/onclickInfo/remove.html',
    params
  })
}
/**
 * 公共模块-点击事件管理--详情
 */
export function getCommonOnclickInfoEdit (params) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/onclickInfo/getDetailInfo.html',
    params
  }).then(data => {
    return data
  })
}
