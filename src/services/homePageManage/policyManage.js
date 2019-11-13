export function getPolicyManagePageList (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/policyConf/pageList.html',
    data
  })
}
export function getChildPolicyManagePageList (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/childPolicy/pageList.html',
    data
  })
}
export function getTestPolicyManagePageList (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/testPolicyConf/pageList.html',
    data
  })
}
export function getChipAndModelPageList (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/device/dataList.html',
    data
  })
}
export function addChipAndModel(data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/device/save.html',
    data
  })
}
export function getHomePageModelPageList(data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/homepage/dataList.html',
    data
  })
}
/** 新增保存 */
export function policyConfSave(data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/policyConf/save.html',
    data
  })
}
export function testPolicyConfSave(data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/testPolicyConf/save.html',
    data
  })
}

export function childPolicyConfSave(data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/childPolicy/save.html',
    data
  })
}
/* 删除 */
export function policyConfRemove(data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/policyConf/remove.html',
    data
  })
}
export function testPolicyConfRemove(data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/testPolicyConf/remove.html',
    data
  })
}
/** 编辑 */
export function getPolicyConfDetail(params) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/policyConf/getDetailInfo.html',
    params
  })
}
export function getTestPolicyConfDetail(params) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/testPolicyConf/getDetailInfo.html',
    params
  })
}
