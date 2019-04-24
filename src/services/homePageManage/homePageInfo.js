/**
 * 首页方案管理-首页方案--系统菜单按钮
 */
export function getHomePageInfoMenu () {
  return this.fetch({
    method: 'post',
    url: 'api/homepageInfo/getMenuInfo.html'
  })
}
/**
 * 首页方案管理-首页方案--列表
 */
export function getHomePageInfoList (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/homepage/pageList.html',
    data
  })
}
/**
 * 首页方案管理-首页方案--保存
 */
export function homePageInfoSave (data) {
  return this.fetch({
    method: 'post',
    url: 'api/homepageInfo/save.html',
    data
  })
}
/**
 * 首页方案管理-首页方案--删除
 */
export function homePageInfoDelete (params) {
  return this.fetch({
    method: 'get',
    url: 'api/homepageInfo/save.html',
    params
  })
}
/**
 * 首页方案管理-首页方案--详情
 */
export function getHomePageInfoEdit (params) {
  return this.fetch({
    method: 'get',
    url: 'api/homepageInfo/getDetailInfo.html',
    params
  }).then(data => {
    return data
  })
}