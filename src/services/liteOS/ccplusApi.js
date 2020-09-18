// LiteOS CC Plus推送策略

// 分页获取CCPLUS推送管理列表
export function queryCCPlusPushManageListPage (params) {
  return this.fetch({
    method: 'get',
    url: 'api/lite-os/admin/cc-plus-push-manage/query-push-manage-list-page',
    params
  })
}

// 根据推送管理id获取对应数据
export function queryCCPlusGetPushManageByReleaseConfId (params) {
  return this.fetch({
    method: 'get',
    url: 'api/lite-os/admin/cc-plus-push-manage/get-push-manage-releaseConfId',
    params
  })
}

// 推送状态变更
export function queryCCPlusUpdatePushStatus (params) {
  return this.fetch({
    method: 'get',
    url: 'api/lite-os/admin/cc-plus-push-manage/update-push-status',
    params
  })
}

// 推送管理删除
export function queryCCPlusDeletePushManage (params) {
  return this.fetch({
    method: 'get',
    url: 'api/lite-os/admin/cc-plus-push-manage/delete-push-manage',
    params
  })
}

// CCPlUS推送策略添加
export function queryCCPlusAddPushManage (data) {
  return this.fetch({
    method: 'post',
    url: 'api/lite-os/admin/cc-plus-push-manage/add-push-manage',
    data,
    isJSON: true,
    isHeaders: true
  })
}

// CCPlUS推送策略修改
export function queryCCPlusUpdatePushManage (data) {
  return this.fetch({
    method: 'post',
    url: 'api/lite-os/admin/cc-plus-push-manage/update-push-manage',
    data,
    isJSON: true,
    isHeaders: true
  })
}

// 媒资信息--新增栏目资源查询
export function queryCCPlusMediaResourceNew (params) {
  return this.fetch({
    method: 'get',
    url: 'api/lite-os/admin/media-resources/query-resource-new',
    params
  })
}

// 媒资信息--新增栏目资源选择项信息查询
export function queryCCPlusMediaResourceAllSelect (params) {
  return this.fetch({
    method: 'get',
    url: 'api/lite-os/admin/media-resources/query-all-select',
    params
  })
}