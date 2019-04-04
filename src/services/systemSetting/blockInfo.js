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
export function saveBlockInfo(data) {
  return this.fetch({
    method: 'post',
    url: '/api/blockInfo/save.html',
    data,
    isJSON: true
  })
}
/**
 * 系统插件list
 */
export function getSysPlugin (data) {
  return this.fetch({
    method: 'post',
    url: '/api/sysPlugin/pageList.html?pluginParentType=builtIn',
    data
  })
}
/**
 * 系统插件编辑回显
 */
export function editSysPlugin (params) {
  return this.fetch({
    method: 'get',
    url: '/api/sysPlugin/edit.html',
    params
  })
    .then(data => {
      return JSON.parse(data.match(/initPlugin = (\{.+\})/)[1])
    })
}
/**
 * 获取系统功能父类型数据字典
 */
export function getPluginParentTypes(data) {
  return this.fetch({
    method: 'post',
    url: '/api/dict/sysPlugin/pluginParentType.html',
    data
  })
}
/**
 * 获取系统功能类型数据字典
 */
export function getPluginTypes(data) {
  return this.fetch({
    method: 'post',
    url: '/api/dict/sysPlugin/pluginType.html',
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
// 查询直播资源
export function queryLiveVideoResult (params) {
  return this.fetch({
    method: 'get',
    url: '/api/tvos/queryLiveVideoResult.html',
    params
  })
}
// export function getPluginVersions(data) {
//   return this.fetch({
//     method: 'post',
//     url: '/api/dict/sysPlugin/',
//     data
//   })
// }
/**
 * 插件类型对应的数据类型
 */
export function getPluginVersions(data) {
  return this.fetch({
    method: 'post',
    url: '/api/dict/sysPlugin/' + data + '.html'
  })
}
/**
 * 系统插件——获取海报
 */
export function getResourceList (data) {
  return this.fetch({
    method: 'post',
    url: '/api/globalPicture/dataList.html',
    data
  })
}
/**
 * 获取角标
 */
export function getCornerList (data) {
  return this.fetch({
    method: 'post',
    url: '/api/globalCornerIcon/pageList.html',
    data
  })
}
/**
 * 系统插件保存
 */
export function SavePlugin (data) {
  data = { jsonStr: JSON.stringify(data) }
  return this.fetch({
    method: 'post',
    url: '/api/sysPlugin/save.html',
    data
  })
}
/**
 * 推荐位——多功能推荐位
 */
export function getMultiBlockList(data) {
  return this.fetch({
    method: 'post',
    url: '/api/sysPlugin/pageList.html?builtInNotShow=1',
    data
  })
}
/**
 * 推荐位——多功能推荐位预览
 */
export function getData(params) {
  return this.fetch({
    method: 'get',
    url: '/api/sysPlugin/getDetailInfo.html',
    params
  })
}
/**
 * 多功能推荐位——审核
 */
export function SaveAudit(params) {
  return this.fetch({
    method: 'get',
    url: '/api/v1/audit/auditTask.html',
    params
  })
}

/**
 * 多功能推进位-删除
 */
export function removeMulti(params) {
  return this.fetch({
    method: 'get',
    url: '/api/sysPlugin/remove.html',
    params
  })
}
/**
 * 功能推荐位——快速填充弹框数据
 */
export function getClickData(data) {
  return this.fetch({
    method: 'post',
    url: '/api/commonOnclickInfo/pageList.html',
    data
  })
}
