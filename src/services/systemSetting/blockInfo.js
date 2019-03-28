/**
 * 推荐位管理->轮播推荐位
 */
export function broadcastBlockPageList (data) {
  return this.fetch({
    method: 'post',
    url: '/api/blockInfo/pageList.html',
    data
  })
}
/**
 * 角标类型
 */
export function getCornerTypes (params) {
  return this.fetch({
    method: 'get',
    url: '/api/v1/cornerIconType/getCornerTypes.html',
    params
  })
}
/**
 * 素材类型
 */
export function getMaterialTypes (params) {
  return this.fetch({
    method: 'get',
    url: '/api/dict/poster/materialType.html',
    params
  })
}
/**
 * 推荐位保存
 */
export function saveBlockInfo (data) {
  return this.fetch({
    method: 'post',
    url: '/api/blockInfo/save.html',
    data
  })
}
/**
 * 轮播推荐位资源
 */
// 影视中心
export function getMediaVideoInfos (params) {
  return this.fetch({
    method: 'get',
    url: '/api/tvos/getMediaVideoInfos.html',
    params
  })
}
// 影视中心2
export function getFilterMediaVideoInfos (params) {
  return this.fetch({
    method: 'get',
    url: '/api/tvos/getMediaVideoInfos.html?resType=vod&callbackparam=?',
    params
  })
}
// 内容源
export function getPartnerSource (params) {
  return this.fetch({
    method: 'get',
    url: '/api/tvos/getPartnerSource.html',
    params
  })
}
// 多情况筛选条件
export function getCondition (params) {
  return this.fetch({
    method: 'get',
    url: '/api/tvos/getCondition.html',
    params
  })
}
