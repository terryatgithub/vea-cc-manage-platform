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

export function getAuditDetailButton (data) {
  return this.fetch({
    method: 'post',
    url: '/api/buttonManage/getAuditDetailButton.html',
    data
  })
}

export function auditTask (params) {
  return this.fetch({
    method: 'get',
    url: '/api/audit/auditTask.html',
    params
  })
}
export function revokedAudit (params) {
  return this.fetch({
    method: 'get',
    url: '/api/V1/audit/revokedAudit.html',
    params
  })
}
