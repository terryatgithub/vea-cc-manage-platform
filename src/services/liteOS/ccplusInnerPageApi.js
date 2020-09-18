// LiteOS CC Plus推送策略

// 分页获取CCPLUS推送管理列表
export function queryCCPlusInnerPagePushManageListPage(params) {
  return this.fetch({
    method: "get",
    url: "api/lite-os/admin/cc-plus-inside-page-push/query-push-list-page",
    params
  });
}

// 根据推送管理id获取对应数据
export function queryCCPlusInnerPageGetPushManageByReleaseConfId(params) {
  return this.fetch({
    method: "get",
    url:
      "api/lite-os/admin/cc-plus-inside-page-push/query-push-by-releaseConfId",
    params
  });
}

// CCPlUS推送策略添加
export function queryCCPlusInnerPageAddPushManage(data) {
  return this.fetch({
    method: "post",
    url: "api/lite-os/admin/cc-plus-inside-page-push/add-push",
    data,
    isJSON: true,
    isHeaders: true
  });
}

// CCPlUS推送策略修改
export function queryCCPlusInnerPageUpdatePushManage(data) {
  return this.fetch({
    method: "post",
    url: "api/lite-os/admin/cc-plus-inside-page-push/update-push",
    data,
    isJSON: true,
    isHeaders: true
  });
}

// 推送状态变更
export function queryCCPlusInnerPageUpdatePushStatus(data) {
  return this.fetch({
    method: "post",
    url: "api/lite-os/admin/cc-plus-inside-page-push/update-push-status",
    data,
    isJSON: true,
    isHeaders: true
  });
}

// 推送管理删除
export function queryCCPlusInnerPageDeletePushManage(data) {
  return this.fetch({
    method: "post",
    url: "api/lite-os/admin/cc-plus-inside-page-push/delete-push",
    data,
    isJSON: true,
    isHeaders: true
  });
}
