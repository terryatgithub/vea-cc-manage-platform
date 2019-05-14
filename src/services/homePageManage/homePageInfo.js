
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
    url: 'api/v1/homepage/save.html',
    data: { data: JSON.stringify(data) }
  })
}
/**
 * 首页方案管理-首页方案--删除
 */
export function homePageInfoDelete (params) {
  return this.fetch({
    url: 'api/v1/homepage/remove.html',
    params
  })
}
/**
 * 首页方案管理-首页方案--详情
 */
export function homePageGetDetail (params) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/homepage/getDetailInfo.html',
    params
  })
}
