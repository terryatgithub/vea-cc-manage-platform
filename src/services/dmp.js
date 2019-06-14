const cache = {
  fetchPolicyPromise: undefined,
  fetchCrowdPromise: {}
}

export function getCrowdOfPolicyWithCache({ id }) {
  if (!cache.fetchCrowdPromise[id]) {
    cache.fetchCrowdPromise[id] = this.getCrowdOfPolicy(id)
  }
  return cache.fetchCrowdPromise[id]
}
/**
 * @id 人群策略ID，请求具体人群数据时，需要传
 * @type crowdPolicy-人群策略， crowd-具体人群
 * @roleId 角色ID,人群权限设置处获取标签数据，需要传
 */
export function getTaglist(params) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/tag/list.html',
    params
  })
}

export function getCrowdOfPolicy({ id }) {
  return this.getTaglist({ id, type: 'crowd' })
}

export function getCrowdPolicy() {
  return this.getTaglist({ type: 'crowdPolicy' })
}
