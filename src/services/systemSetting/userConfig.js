const depts = [
  { deptId: 57, deptName: '酷开-研发' },
  { deptId: 58, deptName: '酷开-运营' },
  { deptId: 59, deptName: '酷开-测试' }
]
const editData = {
  dateModify: '2017-03-06 16:17:46',
  deptId: 57,
  dicts: [67],
  disabled: 1,
  email: 'admin@cooca.com',
  loginCount: 9572,
  loginIp: '172.20.135.14',
  loginName: 'admin',
  loginPwd: '',
  loginTime: '2018-12-20 17:33:13',
  remark: '我是系统管理员',
  salt: '932299',
  superAdmin: 0,
  userId: 1,
  userName: 'Admin'
}

/**
 * 得到部门
 */
export function getDepts () {
  return Promise.resolve(depts)
}
export function userConfigEdit () {
  return Promise.resolve(editData)
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
    url: '/api/sysUser/saveUserRoles.html',
    data
  })
}

/**
 * 得到数据权限列表
 */
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
export function saveProfession (data) {
  return this.fetch({
    method: 'post',
    url: '/api/sysUser/saveProfession.html',
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
    url: '/api/sysUser/remove.html',
    params
  })
}

/**
 * 部门管理
 */
export function sysDeptPageList (data) {
  return this.fetch({
    method: 'post',
    url: '/api/sysDept/pageList.html',
    data
  })
}
export function sysDeptRemove (params) {
  return this.fetch({
    method: 'get',
    url: '/api/sysDept/remove.html',
    params
  })
}
export function sysDeptSave (params) {
  return this.fetch({
    method: 'post',
    url: '/api/sysDept/save.html',
    params
  })
}
export function sysDeptDetailInfo (params) {
  return this.fetch({
    method: 'get',
    url: '/api/v1/sysDept/getDetailInfo.html',
    params
  })
}
/**
 * 获取数据字典列表
 */
export function getDictList (data) {
  return this.fetch({
    method: 'post',
    url: '/api/dict/pageList.html',
    data
  })
}

/**
 * 数据字典新增保存
 */
export function SaveDictionary (data) {
  return this.fetch({
    method: 'post',
    url: '/api/dict/save.html',
    data
  })
}

/**
 * 数据字典更新
 */
export function UpdateDictionary (data) {
  return this.fetch({
    method: 'post',
    url: '/api/dict/save.html',
    data
  })
}

/**
 * 数据字典分类新增
 */
 export function SaveDictCategory (data) {
   return this.fetch({
     method: 'post',
     url: '/api/dictCategory/save.html',
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
    url: '/api/sysLogLogin/pageList.html',
    data
  })
}
