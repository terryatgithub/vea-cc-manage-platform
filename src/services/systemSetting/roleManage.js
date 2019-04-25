/**
 *
 * 角色管理接口 当参数是data的时候，传的是Body里面的内容格式，当参数是params时，这是拼接到头部url地址栏里的
 */
export function getRoleList (data) {
  return this.fetch({
    method: 'post',
    url: 'api/sysRole/pageList.html',
    data
  })
}
export function userRoleList (params) {
  return this.fetch({
    method: 'post',
    url: 'api/sysRole/userList.html',
    params
  })
}
export function saveRoleData (data) {
  return this.fetch({
    method: 'post',
    url: 'api/sysRole/save.html',
    data
  })
}
export function deleteRole (params) {
  return this.fetch({
    method: 'get',
    url: 'api/sysRole/remove.html',
    params
  })
}
export function getPoliciesAndCrowds (params) {
  return this.fetch({
    method: 'get',
    url: 'api/tag/list.html?type=crowdPolicy',
    params
  })
}
export function rolePageGetCrowdOfPolicy (params) {
  return this.fetch({
    method: 'get',
    url: 'api/tag/list.html?type=crowd',
    params
  })
}
export function setCrowdAuthOfRole (data) {
  return this.fetch({
    method: 'post',
    url: 'api/tag/save.html',
    data,
    isJSON: true
  })
}
export function getAuthList (params) {
  return this.fetch({
    method: 'get',
    url: 'api/sysRole/modifyRoleAuthView.html',
    params
  })
}
export function saveAuthOfRole (data) {
  return this.fetch({
    method: 'post',
    url: 'api/sysRole/modifyRoleAuthSave.html',
    data
  })
}
export function updateSeq (params) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/sysRole/updateSeq.html',
    params
  })
}
export function getRoleDetailById (params) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/sysRole/getDetailInfo.html',
    params
  })
}
