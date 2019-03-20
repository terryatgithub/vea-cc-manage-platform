/**
 *
 * @param {*} data 按钮组
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
