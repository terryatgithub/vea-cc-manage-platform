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
    url: 'api/v1/panelRecommend/dataList.html',
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

export function getVideoDmpChartData(params) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/dataShow/videoDmp/getChartData.html',
    params
  })
}

export function getVideoChartData2(params) {
  return Promise.resolve({
    'msg': 'success',
    'code': '0',
    'data': {
      'rows': [{
        'data': [{
          'x': '2019-09-18',
          'y': 102.0
        }, {
          'x': '2019-09-19',
          'y': 267.0
        }, {
          'x': '2019-09-20',
          'y': 208.0
        }, {
          'x': '2019-09-21',
          'y': 353.0
        }, {
          'x': '2019-09-22',
          'y': 322.0
        }, {
          'x': '2019-09-23',
          'y': 250.0
        }, {
          'x': '2019-09-24',
          'y': 344.0
        }, {
          'x': '2019-09-25',
          'y': 78.0
        }, {
          'x': '2019-09-26',
          'y': 4.0
        }, {
          'x': '(V1) 2019-09-27',
          'y': 3.0
        }, {
          'x': '2019-09-28',
          'y': 2.0
        }],
        'title': '版块点击UV',
        'unit': ''
      }, {
        'data': [{
          'x': '2019-09-18',
          'y': 73.91304
        }, {
          'x': '2019-09-19',
          'y': 78.070175
        }, {
          'x': '2019-09-20',
          'y': 101.46342
        }, {
          'x': '2019-09-21',
          'y': 101.43678
        }, {
          'x': '2019-09-22',
          'y': 123.84615
        }, {
          'x': '2019-09-23',
          'y': 87.10802
        }, {
          'x': '2019-09-24',
          'y': 70.20408
        }, {
          'x': '2019-09-25',
          'y': 70.27027
        }, {
          'x': '2019-09-26',
          'y': 100.0
        }, {
          'x': '(V1) 2019-09-27',
          'y': 150.0
        }, {
          'x': '2019-09-28',
          'y': 200.0
        }],
        'title': '版块UVCTR',
        'unit': '%'
      }],
      'total': 2
    },
    'success': true
  })
}
