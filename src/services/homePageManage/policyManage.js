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
/** 
id 否	Integer	人群策略ID，请求具体人群数据时，需要传
type	 	是	String	crowdPolicy-人群策略， crowd-具体人群
roleId	 	否	Integer	角色ID,人群权限设置处获取标签数据，需要传
*/
export function getTaglist(params) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/tag/list.html',
    params
  })
}

// export function getCrowdOfPolicy(id) {
//   return this.fetch({
//     method: 'get',
//     url: 'api/tag/list.html?type=crowd&id=' + id
//   })
// }

// export function getCrowdPolicy(params) {
//   return this.fetch({
//     method: 'get',
//     url: 'api/tag/list.html?type=crowdPolicy',
//     params
//   })
// }
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