/**
 * 版面管理 -> Tab版面管理
 */
// 分页
export function tabInfoList(params) {
  return this.fetch({
    url: 'api/tabInfo/pageList.html',
    params
  })
}
// 版面属性Option
export function getAppIdType(data) {
  return this.fetch({
    method: 'post',
    url: 'api/globalDictInfo/getTypes/appIdType.html',
    data
  })
}
// 业务分类
export function getBusinessType(data) {
  return this.fetch({
    method: 'post',
    url: 'api/globalDictInfo/getTypes/businessType.html',
    data
  })
}

/**
 * 版面管理 -> 业务版面
 */
export function getTabType(data) {
  return this.fetch({
    method: 'post',
    url: 'api/dict/tab/tabType.html?tabParentType=biz',
    data
  })
}
/**
 * 版面管理 -> 影片详情页
 */
export function getMediaResourceInfo(params) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/getMediaResourceInfoToPanel.html',
    params,
    isJSON: true
  })
}
// 分页
export function filmDetailPageList(data) {
  return this.fetch({
    method: 'post',
    url: 'api/filmDetailPage/pageList.html',
    data
  })
}
// 保存
export function saveFilmDetailPage(data) {
  return this.fetch({
    method: 'post',
    url: 'api/filmDetailPage/save.html',
    data
  })
}
// 删除
export function removeFilmDetailPage(params) {
  return this.fetch({
    method: 'get',
    url: 'api/filmDetailPage/remove.html',
    params
  })
}

export function tabIconList() {
  return this.fetch({
    method: 'get',
    url: 'api/tabInfo/getIconList.html'
  })
}

export function tabInfoGet(params) {
  return this.fetch({
    method: 'post',
    url: 'api/tab/getDetailInfo.html',
    params
  })
}

export function tabInfoUpsert(data) {
  return this.fetch({
    method: 'post',
    url: 'api/tab/save.html',
    data: { jsonStr: JSON.stringify(data) }
  })
}

// 编辑
export function editFilmDetailPage(params) {
  return this.fetch({
    method: 'get',
    url: 'api/filmDetailPage/edit.html',
    params
  }).then(result => {
    return JSON.parse(result.match(/param = (\{.+\})/)[1])
  })
}
// 预览
export function reviewFilmDetailPage(params) {
  return this.fetch({
    method: 'get',
    url: 'api/filmDetailPage/preview.html',
    params
  }).then(result => {
    return JSON.parse(result.match(/param = (\{.+\})/)[1])
  })
}
