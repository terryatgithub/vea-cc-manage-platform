export function getLayoutInforPageList (params) {
  return this.fetch({
    url: 'api/v1/layout/pageList.html',
    params
  })
}
export function getLayoutInforBatchDel (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/layout/remove.html',
    data
  })
}
/*
 * 新增编辑保存
*/
export function getLayoutInforSave (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/layout/save.html',
    data
  })
}
/*
 * 获取编辑信息
*/
export function getLayoutInforById (params) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/layout/getDetailInfo.html',
    params
  })
}

export function getLayoutVersion6 (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/layout/getUI8ToUI6.html',
    data
  }).then(data => {
    return JSON.parse(data)
  })
}

export function getAuditDetailButton (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/buttonManage/getAuditDetailButton.html',
    data
  })
}
export function auditTask (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/audit/auditTask.html',
    data
  })
}
export function revokedAudit (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/audit/revokedAudit.html',
    data
  })
}
export function putShelves (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/audit/putShelves.html',
    data
  })
}
