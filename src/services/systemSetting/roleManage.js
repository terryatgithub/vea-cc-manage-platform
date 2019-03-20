/**
 *
 * 角色管理接口
 */
export function getRoleList (data) {
  return this.fetch({
    method: 'post',
    url: '/api/sysRole/pageList.html',
    data
  })
}
export function userRoleList (data) {
  return this.fetch({
    method: 'post',
    url: '/api/sysRole/userList.html',
    data
  })
}
export function saveRoleData (params) {
  return this.fetch({
    method: 'post',
    url: '/api/sysRole/save.html',
    params
  })
}
export function deleteRole (params) {
  return this.fetch({
    method: 'get',
    url: '/api/sysRole/remove.html',
    params
  })
}
