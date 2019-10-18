import axios from 'axios'
/**
 * 版面管理 -> Tab版面管理
 */
// 分页
export function tabInfoList(params) {
  return this.fetch({
    url: 'api/v1/tab/pageList.html',
    params
  })
}
// 版面属性Option
// export function getAppIdType(data) {
//   return this.fetch({
//     method: 'post',
//     url: 'api/globalDictInfo/getTypes/appIdType.html',
//     data
//   })
// }
// 业务分类
// export function getBusinessType(data) {
//   return this.fetch({
//     method: 'post',
//     url: 'api/globalDictInfo/getTypes/businessType.html',
//     data
//   })
// }

/**
 * 版面管理 -> 业务版面
 */
export function getTabType(data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/dict/getTypes/tab/tabType.html',
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
    url: 'api/v1/tab/getIconList.html'
  })
}

export function tabInfoGet(params) {
  const id = params.id
  if (!/^\d+$/.test(id)) {
    return this.getThirdpartTabInfoDetail(params)
  }
  return this.fetch({
    method: 'post',
    url: 'api/v1/tab/getDetailInfo.html',
    params
  })
}

export function tabInfoUpsert(data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/tab/save.html',
    data: { jsonStr: JSON.stringify(data) }
  })
}

export function tabInfoRemove(data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/tab/remove.html',
    data
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

export function getVipButtonSource(params) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/tvos/getVipButtonSource.html',
    params
  })
}

export function getTabSimpleBrowseData(params) {
  return axios({
    method: 'get',
    url: 'api/v1/dataShow/tab/getSimpleBrowseData.html',
    params
  }).then(({ data }) => {
    return data.data
  })
}

export function getTabChartData(params) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/dataShow/tab/getChartData.html',
    params
  })
}

export function getThirdpartTabInfoDetail(params) {
  const id = params.id
  const [from, type] = id.split('-')
  return this.fetch({
    method: 'get',
    url: 'api/v1/third/getV6BoardInfo.html',
    params: {
      from,
      type
    }
  })
}

export function updateThirdPartTabAuditType(params) {
  const id = params.id
  const [from] = id.split('-')
  return this.fetch({
    method: 'get',
    url: 'api/v1/third/switchAuditMode.html',
    params: {
      from,
      enableAuto: params.enableAuto
    }
  })
}

export function updateThirdPartTabAudit(params) {
  const id = params.id
  const [from] = id.split('-')
  return this.fetch({
    method: 'get',
    url: 'api/v1/third/execAudit.html',
    params: {
      from
    }
  })
}

export function getThirdpartTabLayout () {
  return this.fetch({
    method: 'get',
    url: 'api/v1/third/getLayout.html?layoutModel=Expander&width=522&height=295'
  }).then(result => {
    return JSON.parse(result)
  })
}
