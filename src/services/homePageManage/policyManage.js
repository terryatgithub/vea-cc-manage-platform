const cache = {
  fetchPolicyPromise: undefined,
  fetchCrowdPromise: {}
}
export function getPolicyManagePageList (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/policyConf/pageList.html',
    data
  })
}
export function getChipAndModelPageList (data) {
  return this.fetch({
    method: 'post',
    url: 'api/globalDeviceInfo/dataList.html',
    data
  })
}
export function addChipAndModel(data) {
  return this.fetch({
    method: 'post',
    url: 'api/globalDeviceInfo/save.html',
    data
  })
}
export function getHomePageModelPageList(data) {
  return this.fetch({
    method: 'post',
    url: 'api/homepageInfo/dataList.html',
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
/* 删除 */
export function policyConfRemove(data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/policyConf/remove.html',
    data
  })
}

export function crowdRelGet(params) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/dmpMgr/getDetailInfo.html',
    params
  })
}

export function getCrowdOfPolicyWithCache(id) {
  if (!cache.fetchCrowdPromise[id]) {
    cache.fetchCrowdPromise[id] = this.getCrowdOfPolicy(id)
  }
  return cache.fetchCrowdPromise[id]
}

export function getCrowdOfPolicy(id) {
  return this.fetch({
    method: 'get',
    url: 'api/tag/list.html?type=crowd&id=' + id
  })
}

export function getCrowdPolicy(params) {
  return this.fetch({
    method: 'get',
    url: 'api/tag/list.html?type=crowdPolicy',
    params
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
/** 编辑 */
export function getTestPolicyConfDetail(params) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/testPolicyConf/getDetailInfo.html',
    params
  })
}
