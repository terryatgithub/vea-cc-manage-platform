const depts = [
  { deptId: 57, deptName: '酷开-研发' },
  { deptId: 58, deptName: '酷开-运营' },
  { deptId: 59, deptName: '酷开-测试' }
]
/**
 * 得到部门
 */
export function getDepts () {
  return Promise.resolve(depts)
}
/**
 *
 * @param {*} data 按钮组
 */
export function userConfigMenuInfo (data) {
  return this.fetch({
    method: 'post',
    url: '/api/sysUser/getMenuInfo.html',
    data
  })
}
/**
 *
 * @param {*} data 列表
 */
export function userConfigPageList (data) {
  return this.fetch({
    method: 'post',
    url: '/api/sysUser/pageList.html',
    data
  })
}
/**
 *
 * @param {*} data 得到不属于该用户的角色列表
 */
export function getNotRolesByUserId (data) {
  return this.fetch({
    method: 'post',
    url: '/api/sysUser/getNotRolesByUserId.html',
    data
  })
}
/**
 *
 * @param {*} data 得到属于该用户的角色列表
 */
export function getRolesByUserId (data) {
  return this.fetch({
    method: 'post',
    url: '/api/sysUser/getRolesByUserId.html',
    data
  })
}
export function userConfigBusinessType (params) {
  return this.fetch({
    method: 'get',
    url: '/api/globalDictInfo/getTypes/businessType.html',
    params
  })
}
export function getDictCheckedByUserId (params) {
  return this.fetch({
    method: 'get',
    url: '/api/sysUser/getDictCheckedByUserId.html',
    params
  })
}
export function userConfigSave (data) {
  return this.fetch({
    method: 'post',
    url: '/api/sysUser/save.html',
    data
  })
}
/**
 *
 * @param {} params  支持批量删除
 */
export function UserConfigDelete (params) {
  return this.fetch({
    method: 'get',
    url: '/api/sysUser/remove.html',
    params
  })
}
