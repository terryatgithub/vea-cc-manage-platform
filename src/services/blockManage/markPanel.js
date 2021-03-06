/** 版块管理——功能版块 */
// 表格list
export function getMarkPanelList (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/panel/pageList.html',
    data
  })
}
// 保存
export function MarkPanelSave (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/panel/save.html',
    data
  })
}
// 删除
export function deleteMarkPanel (params) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/panel/remove.html',
    params
  })
}
// 预览使用接口
export function getViewData (params) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/panel/getDetailInfo.html',
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
