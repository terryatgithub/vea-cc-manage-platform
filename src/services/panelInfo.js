import axios from 'axios'
/**
 * 版块管理 -> 常规运营
 */
export function panelPageList(data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/panel/pageList.html',
    data
  })
}

export function panelDataList(data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/panel/dataList.html',
    data
  })
}

export function panelGetDetail(params) {
  return this.fetch({
    url: 'api/v1/panel/getDetailInfo.html',
    params
  })
}

export function panelUpsert(data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/panel/save.html',
    data: {
      jsonStr: JSON.stringify(data)
    }
  })
}
export function panelRemove(data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/panel/remove.html',
    data
  })
}

export function collectCancel(data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/collect/' + data.type + '/cancel.html',
    data: data.data
  })
}
export function collect(data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/collect/' + data.type + '/collect.html',
    data: data.data
  })
}

export function getSharedTags(params) {
  return this.fetch({
    method: 'get',
    url: 'api/tvos/getMediaCommonTags.html',
    params,
    useLoading: false
  })
}

export function panelTagUpsert(data) {
  return this.fetch({
    method: 'post',
    url: 'api/tvos/updateTagWeight.html',
    data
  })
}

export function panelRecommendList(data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/panelRecommend/pageList.html',
    data
  })
}

export function panelRecommendGetDetail(params) {
  return this.fetch({
    url: 'api/v1/panelRecommend/getDetailInfo.html',
    params
  })
}

export function panelRecommendUpsert(data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/panelRecommend/save.html',
    data: {
      jsonStr: JSON.stringify(data)
    }
  })
}

export function panelRecommendFlagUpsert(data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/panelRecommend/switchRecommend.html',
    data: {
      jsonStr: JSON.stringify(data)
    }
  })
}

export function getPanelRecommandStat (params) {
  // const result = {
  //   rows: [
  //     {
  //       tabName: 'Hello world',
  //       startDate: '20190901',
  //       endDate: '20190902',
  //       recommendIndex: 8,
  //       recommendCategory: '体育'
  //     }
  //   ]
  // }
  // result.rows = result.rows.map(item => {
  //   return {
  //     id: `${item.tabName}: ${item.startDate} - ${item.endDate} 从第 ${item.recommendIndex} 个开始`,
  //     ...item
  //   }
  // })
  // return Promise.resolve(result)
  return this.fetch({
    method: 'get',
    url: 'api/v1/panelRecommendCoreData/getDataList.html',
    params
  })
}

export function getPanelRecommandChart (params) {
  // const result = {"msg":"success","code":"0","data":{"rows":[{"data":[{"x":"2019-09-17","y":1.0},{"x":"2019-09-20","y":253.0},{"x":"2019-09-21","y":566.0},{"x":"2019-09-22","y":499.0},{"x":"2019-09-23","y":396.0},{"x":"2019-09-24","y":232.0},{"x":"2019-09-25","y":181.0},{"x":"2019-09-26","y":183.0},{"x":"2019-09-26","y":1.0},{"x":"2019-09-27","y":209.0},{"x":"2019-09-28","y":228.0}],"title":"版块点击UV","unit":""},{"data":[],"title":"版块UVCTR","unit":"%"}],"total":2},"success":true}
  // return Promise.resolve(result.data)
  return this.fetch({
    method: 'get',
    url: 'api/v1/panelRecommendCoreData/getCoreData.html',
    params
  })
}

export function getPanelRecommandFeedback (params) {
  return this.fetch({
    url: 'api/v1/panelRecommendCoreData/getPanelFeedBack.html',
    params
  })
}

export function getPanelSimpleBrowseData(params) {
  return axios({
    method: 'get',
    url: 'api/v1/dataShow/panel/getSimpleBrowseData.html',
    params
  }).then(({
    data
  }) => {
    return data.data
  })
}

export function getPanelChartData(params) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/dataShow/panel/getChartData.html',
    params
  })
}

export function getVideoChartData(params) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/dataShow/video/getChartData.html',
    params
  })
}
