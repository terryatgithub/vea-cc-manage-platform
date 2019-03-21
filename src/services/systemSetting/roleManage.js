/**
 *
 * 角色管理接口 当参数是data的时候，传的是Body里面的内容格式，当参数是params时，这是拼接到头部url地址栏里的
 */
export function getRoleList (data) {
  return this.fetch({
    method: 'post',
    url: '/api/sysRole/pageList.html',
    data
  })
}
export function userRoleList (params) {
  return this.fetch({
    method: 'post',
    url: '/api/sysRole/userList.html',
    params
  })
}
export function saveRoleData (data) {
  return this.fetch({
    method: 'post',
    url: '/api/sysRole/save.html',
    data
  })
}
export function deleteRole (params) {
  return this.fetch({
    method: 'get',
    url: '/api/sysRole/remove.html',
    params
  })
}
