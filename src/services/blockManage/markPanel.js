/** 板块管理——功能板块 */
// 表格list
export function getMarkPanelList (data) {
  return this.fetch({
    method: 'post',
    url: 'api/panel/pageList.html',
    data
  })
}
// 回显数据
// export function getMarkEditData (params) {
//   return this.fetch({
//     method: 'get',
//     url: 'api/markPanel/edit.html',
//     params
//   }).then(data => {
//     return JSON.parse(data.match(/pannelInit = (\{.+\})/)[1])
//   })
// }
// 保存
export function MarkPanelSave (data) {
  return this.fetch({
    method: 'post',
    url: 'api/panel/save.html',
    data
  })
}
// 删除
export function deleteMarkPanel (params) {
  return this.fetch({
    method: 'get',
    url: 'api/panel/remove.html',
    params
  })
}
// 预览使用接口
export function getViewData (params) {
  return this.fetch({
    method: 'get',
    url: 'api/panel/getDetailInfo.html',
    params
  })
}
// 获取上架时间
export function getTimedInfo (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/timedTask/getTimedInfo.html',
    data
  })
}
// 获取审核者
export function getHandlePerson (params) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/audit/historyList.html',
    params
  })
}
