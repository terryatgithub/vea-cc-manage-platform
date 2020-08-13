// LiteOS CC Plus推送策略

// 分页获取CCPLUS推送管理列表
export function queryCCPlusPushManageListPage (params) {
  return this.fetch({
    method: 'get',
    url: '/api/lite-os/admin/cc-plus-push-manage/query-push-manage-list-page',
    params
  })
}

// 媒资信息--新增栏目资源查询
export function queryCCPlusMediaResourceNew (params) {
  return this.fetch({
    method: 'get',
    url: '/api/lite-os/admin/media-resources/query-resource-new',
    params
  })
}


// 媒资信息--新增栏目资源选择项信息查询
export function queryCCPlusMediaResourceAllSelect (params) {
  return this.fetch({
    method: 'get',
    url: '/api/lite-os/admin/media-resources/query-all-select',
    params
  })
}

// 媒资信息--CCPlUS推送策略添加
export function queryCCPlusAddPushManage (data) {
  return this.fetch({
    method: 'post',
    url: '/api/lite-os/admin/cc-plus-push-manage/add-push-manage',
    data,
    isJSON: true,
    isHeaders: true
  })
}