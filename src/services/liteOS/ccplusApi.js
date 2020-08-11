// LiteOS CC Plus推送策略

// 分页获取CCPLUS推送管理列表
export function queryCCPlusPushManageListPage (params) {
    return this.fetch({
      method: 'get',
      url: '/api/lite-os/admin/cc-plus-push-manage/query-push-manage-list-page',
      params
    })
  }