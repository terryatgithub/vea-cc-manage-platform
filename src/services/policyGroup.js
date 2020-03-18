export function policyGroupList (params) {
  return this.fetch({
    url: 'api/v1/policyGroup/pageList.html',
    params
  })
}

export function policyGroupUpsert (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/policyGroup/save.html',
    data: { jsonStr: JSON.stringify(data) }
  })
}

export function policyGroupGetDetail (params) {
  return this.fetch({
    url: 'api/v1/policyGroup/getDetailInfo.html',
    params
  })
}

export function modelChipList (params) {
  return this.fetch({
    url: 'api/v1/policyGroup/listPolicyGroupByModelChip.htm',
    params
  })
}

export function policyGroupRemove (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/policyGroup/remove.html',
    data
  })
}
