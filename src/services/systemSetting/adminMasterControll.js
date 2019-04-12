/**
 *
 * 角色管理接口 当参数是data的时候，传的是Body里面的内容格式，当参数是params时，这是拼接到头部url地址栏里的
 */
export function getAdminMasterControllInfo (data) {
  return this.fetch({
    method: 'post',
    url: 'api/adminMasterControl/getDetailInfo.html',
    data
  })
}
export function saveAdminMasterControll (data) {
  return this.fetch({
    method: 'post',
    url: 'api/adminMasterControl/save.html',
    data
  })
}
