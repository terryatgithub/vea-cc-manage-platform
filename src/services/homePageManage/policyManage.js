const cache = {
  fetchPolicyPromise: undefined,
  fetchCrowdPromise: {}
}
export function getPolicyManagePageList (data) {
  return this.fetch({
    method: 'post',
    url: 'api/policyConf/pageList.html',
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

export function crowdRelGet(params) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/dmpMgr/getDetailInfo.html',
    params
  })
}

export function getCrowdOfPolicyWithCache(id) {
  if (!cache.fetchCrowdPromise[id]) {
    cache.fetchCrowdPromise[id] = getCrowdOfPolicy(id)
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
