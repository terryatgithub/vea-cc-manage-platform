
/**
 * 得到部门
 */
export function getDepts (params) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/sysDept/listAllDept.html',
    params
  })
}
/**
 *
 * @param {*} data 按钮组
 */
export function userConfigMenuInfo (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/sysUser/getMenuInfo.html',
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
    url: 'api/v1/sysUser/pageList.html',
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
    url: 'api/v1/sysUser/getNotRolesByUserId.html',
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
    url: 'api/v1/sysUser/getRolesByUserId.html',
    data
  })
}

/**
 *
 * @param {*} params 保存用户角色
 */
export function saveUserRoles (data) {
  data = data.reduce((result, item) => {
    result += '&' + item[0] + '=' + item[1]
    return result
  }, '').slice(1)
  return this.fetch({
    method: 'post',
    url: 'api/v1/sysUser/saveUserRoles.html',
    data
  })
}

/**
 * 得到数据权限列表
 */
// export function userConfigBusinessType (params) {
//   return this.fetch({
//     method: 'get',
//     url: 'api/globalDictInfo/getTypes/businessType.html',
//     params
//   })
// }
/**
 * 编辑
 */
export function userConfigEdit (params) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/sysUser/getDetailInfo.html',
    params
  })
}
export function getDictCheckedByUserId (params) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/sysUser/getDictCheckedByUserId.html',
    params
  })
}
export function userConfigSave (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/sysUser/save.html',
    data
  })
}
export function saveProfession (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/sysUser/saveProfession.html',
    data
  })
}
/**
 *
 * @param {} params  支持批量删除
 */
export function userConfigDelete (params) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/sysUser/remove.html',
    params
  })
}
/**
 * 获取数据字典列表
 */
export function getDictList (data) {
  return this.fetch({
    method: 'post',
    url: 'api/dict/pageList.html', // 非运营使用
    data
  })
}

/**
 * 数据字典保存
 */
export function SaveDictionary (data) {
  return this.fetch({
    method: 'post',
    url: 'api/dict/save.html', // 非运营使用
    data,
    isJSON: true
  })
}
/**
 * 数据字典删除
 */
export function DeleteDict (data) {
  return this.fetch({
    method: 'post',
    url: 'api/dict/remove.html', // 非运营使用
    data
  })
}
/**
 * 数据字典分类list
 */

export function getDictCategoryList () {
  return this.fetch({
    method: 'post',
    url: 'api/dictCategory/list.html' // 非运营使用
  })
}
/**
 * 数据字典分类新增
 */
export function SaveDictCategory (data) {
  return this.fetch({
    method: 'post',
    url: 'api/dictCategory/save.html', // 非运营使用
    data,
    isJSON: true
  })
}
/**
 * 获取登陆日志
 */
export function getLoginLogList (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/sysLogLogin/pageList.html',
    data
  })
}

/**
 * 系统菜单list
 */
export function getSysMenuList (params) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/sysMenu/pageList.html',
    params
  })
}

/**
 * 系统菜单保存
 */
export function saveSysMenu (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/sysMenu/save.html',
    data
  })
}

/**
 * 系统菜单数据回显
 */
export function editSysMenu (params) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/sysMenu/getDetailInfo.html',
    params
  })
}
/**
 * 系统菜单操作——待选操作
 */
export function getNotMenuByRunId (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/sysMenu/getNotRunByMenuId.html',
    data
  })
}
/**
 * 系统菜单操作——已选操作
 */
export function getMenuByRunId (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/sysMenu/getRunByMenuId.html',
    data
  })
}
/**
 * 系统菜单操作——保存
 */
export function saveMenuRun (data) {
  data = data.reduce((result, item) => {
    result += '&' + item[0] + '=' + item[1]
    return result
  }, '').slice(1)
  return this.fetch({
    method: 'post',
    url: 'api/v1/sysMenu/saveMenuRun.html',
    data
  })
}
/**
 * 系统菜单按钮
 */
export function getMenuInfo () {
  return this.fetch({
    method: 'post',
    url: 'api/v1/sysMenu/getMenuInfo.html'
  })
}
/**
 * 系统菜单删除
 */
export function deleteMenuById (params) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/sysMenu/remove.html',
    params
  })
}
/*
 * 修改密码
*/
export function modifyPwd (params) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/updatePassword.html',
    params
  })
}
