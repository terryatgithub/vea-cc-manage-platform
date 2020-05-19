/**
 * 推荐位管理->轮播推荐位
 */
export function broadcastBlockPageList (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/blockInfo/pageList.html',
    data
  })
}
export function deleteBroadcastBlock (params) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/blockInfo/remove.html',
    params
  })
}
/**
 * 角标类型
 */
export function getCornerTypes (params) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/cornerIconType/getCornerTypes.html',
    params
  })
}
/**
 * 素材类型
 */
export function getMaterialTypes (type) {
  if (type === undefined) {
    type = 'materialType'
  }
  return this.fetch({
    method: 'get',
    url: `api/v1/dict/getTypes/poster/${type}.html`
  })
}
/**
 * 推荐位保存
 */
export function saveBlockInfo (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/blockInfo/save.html',
    data
  })
}
/**
 * 系统插件list
 */
export function getSysPlugin (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/sysPlugin/pageList.html?pluginParentType=builtIn',
    data
  })
}
/**
 * 系统插件编辑回显
 */
export function editSysPlugin (params) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/sysPlugin/getDetailInfo.html',
    params
  })
}
/**
 * 获取系统功能父类型数据字典
 */
export function getPluginParentTypes (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/dict/getTypes/sysPlugin/pluginParentType.html',
    data
  })
}
/**
 * 获取系统功能类型数据字典
 */
export function getPluginTypes (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/dict/getTypes/sysPlugin/pluginType.html',
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
    url: 'api/tvos/getMediaVideoInfos.html',
    params
  })
}
// 内容源
export function getPartnerSource (params) {
  return this.fetch({
    method: 'get',
    url: 'api/tvos/getPartnerSource.html',
    params
  })
}
// 多情况筛选条件
export function getCondition (params) {
  return this.fetch({
    method: 'get',
    url: 'api/tvos/getCondition.html',
    params
  })
}
// 查询直播资源
export function queryLiveVideoResult (params) {
  return this.fetch({
    method: 'get',
    url: 'api/tvos/queryLiveVideoResult.html',
    params
  })
}
/**
 * 插件类型对应的数据类型
 */
// export function getPluginVersions(data) {
//   return this.fetch({
//     method: 'post',
//     url: 'api/dict/sysPlugin/' + data + '.html'
//   })
// }
export function getPluginVersions (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/dict/getTypes/sysPlugin/' + data + '.html'
  })
}
export function getPluginType (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/dict/getTypes/sysPlugin/pluginType.html',
    data
  })
}
/**
 * 系统插件——获取海报
 */
export function getResourceList (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/poster/dataList.html',
    data
  })
}
/**
 * 获取角标
 */
export function getCornerList (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/cornerIcon/pageList.html',
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
    url: 'api/v1/sysPlugin/save.html',
    data
  })
}
/**
 * 推荐位——多功能推荐位
 */
export function getMultiBlockList (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/sysPlugin/pageList.html?builtInNotShow=1',
    data
  })
}
/**
 * 推荐位——多功能推荐位预览
 */
export function getData (params) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/sysPlugin/getDetailInfo.html',
    params
  })
}
/**
 * 多功能推进位-删除
 */
export function removeMulti (params) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/sysPlugin/remove.html',
    params
  })
}
/**
 * 功能推荐位——快速填充弹框数据
 */
export function getClickData (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/onclickInfo/pageList.html',
    data
  })
}
/*
   id: 10139
   type: block
   预览页面版本历史记录
*/
export function getHistoryList (params) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/hvi/historyList.html',
    params
  })
}
/**
 * 得到轮播推荐位的编辑数据
 */
export function getBroadcastBlockEditData (data) {
  return this.fetch({
    method: 'POST',
    url: 'api/v1/blockInfo/getDetailInfo.html',
    data
  })
}

export function broadcastBlockDataList (params) {
  return this.fetch({
    url: 'api/v1/blockInfo/dataList.html',
    params
  })
}

export function getBlockSimpleBrowseData (params) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/dataShow/block/getSimpleBrowseData.html',
    params
  })
}

export function getBlockChartData (params) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/dataShow/block/getChartData.html',
    params
  })
}

export function getBlockRealTimeChartData (params) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/dataShow/blockRealTime/getChartData.html',
    params
  })
}
/**
 * 推荐位管理——指定影片推荐流
 */
export function getMediaAutomationDataList (params) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/mediaAutomation/dataList.html',
    params
  })
}
export function getMediaAutomationList (params) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/mediaAutomation/pageList.html',
    params
  })
}
export function saveMediaAutomation (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/mediaAutomation/save.html',
    data
  })
}
export function getMediaAutomationDetial (params) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/mediaAutomation/getDetailInfo.html',
    params
  })
}
export function deleteMediaAutomation (params) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/mediaAutomation/remove.html',
    params
  })
}

// 轮播推荐位看数据
export function getBroadcastDataTitles (params) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/dataShow/block/getAllTitles.html',
    params
  })
}
/**
 * 推荐位管理——新影片推荐流管理-适用场景
 */
export function getMediaSence (params) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/dict/getTypes/scene.html',
    params
  })
}
// 新影片推荐流管理
export function getNewMediaAutomationList (params) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/recStream/dataList.html',
    params
  })
}
// 推荐流应用场景
export function getMediaSceneList (params) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/recStreamDmp/pageList.html',
    params
  })
}
// 推荐流应用场景-删除
// 推荐流应用场景--保存
export function saveMediaRecStreamDmp (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/recStreamDmp/save.html',
    data: {
      jsonStr: JSON.stringify(data)
    }
  })
}
// 新推荐流获取详情接口
export function getNewMediaAutomationDetial (params) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/recStream/getDetailInfo.html',
    params
  })
}
