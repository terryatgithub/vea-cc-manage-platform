import axios from 'axios'
/**
 * 版块管理 -> 常规运营
 */
export function panelPageList (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/panel/pageList.html',
    data
  })
}

export function panelDataList (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/panel/dataList.html',
    data
  })
}

export function panelGetDetail (params) {
  return this.fetch({
    url: 'api/v1/panel/getDetailInfo.html',
    params
  })
}
export function panelGetDetailSilence (params) {
  return this.fetch({
    url: 'api/v1/panel/getDetailInfo.html',
    params,
    useLoading: false
  })
}

export function panelUpsert (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/panel/save.html',
    data: {
      jsonStr: JSON.stringify(data)
    }
  })
}
export function panelUpsertSilent (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/panel/save.html',
    useLoading: false,
    data: {
      jsonStr: JSON.stringify(data)
    }
  })
}
export function panelRemove (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/panel/remove.html',
    data
  })
}

export function collectCancel (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/collect/' + data.type + '/cancel.html',
    data: data.data
  })
}
export function collect (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/collect/' + data.type + '/collect.html',
    data: data.data
  })
}

export function getSharedTags (params) {
  return this.fetch({
    method: 'get',
    url: 'api/tvos/getMediaCommonTags.html',
    params,
    useLoading: false
  })
}

export function panelTagUpsert (data) {
  return this.fetch({
    method: 'post',
    url: 'api/tvos/updateTagWeight.html',
    data
  })
}

export function panelRecommendList (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/panelRecommend/pageList.html',
    data
  })
}

export function panelRecommendGetDetail (params) {
  return this.fetch({
    url: 'api/v1/panelRecommend/getDetailInfo.html',
    params
  })
}

export function panelRecommendUpsert (data) {
  return this.fetch({
    method: 'post',
    url: 'api/v1/panelRecommend/save.html',
    data: {
      jsonStr: JSON.stringify(data)
    }
  })
}

export function panelRecommendFlagUpsert (data) {
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

export function getPanelSimpleBrowseData (params) {
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

export function getPanelChartData (params) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/dataShow/panel/getChartData.html',
    params
  })
}

export function getVideoChartData (params) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/dataShow/video/getChartData.html',
    params
  })
}

export function getVideoRealTimeChartData (params) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/dataShow/videoRealTime/getChartData.html',
    params
  })
}

export function getVideoDmpChartData (params) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/dataShow/videoDmp/getChartData.html',
    params
  })
}

export function getVideoDmpRealTimeChartData (params) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/dataShow/videoDmpRealTime/getChartData.html',
    params
  })
}

export function getVideoDmpTitles (params) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/dataShow/videoDmp/getAllTitles.html',
    params
  })
}

export function getVideoDmpCrowds (params) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/dataShow/videoDmp/getAllCrowds.html',
    params
  })
}

// 影片筛选规则
export function getFilmFilterPartnerSource (params) {
  return this.fetch({
    method: 'get',
    url: 'api/tvos/getPartnerSource',
    params
  })
}

export function getFilmFilterOptions (params) {
  return this.fetch({
    method: 'get',
    url: 'api/tvos/getCondition',
    params
  })
}

export function getFilmFilterResult (params) {
  return this.fetch({
    method: 'get',
    url: 'api/tvos/getMediaBlockVideoList',
    params
  })
}

export function getMediaRuleLayout (params) {
  return this.fetch({
    method: 'get',
    url: 'api/v1/dict/getTypes/mediaRuleLayout.html',
    params
  })
}

export function getFilmFilterResult2 (params) {
  return Promise.resolve({
    data: {
      rows: [{
        'actors': '张涵予,欧豪,杜江,袁泉,张天爱,李沁,张雅玫,杨祺如,高戈,黄志忠,朱亚文,李现,杨颖,陈数,焦俊艳,吴樾,阚清子,余皑磊,小爱,李岷城,冯文娟',
        'businessType': 0,
        'categoryId': 4,
        'ccVideoSourceEntities': [
          {
            'coocaaVId': '',
            'createdTime': null,
            'currentSegment': 1,
            'defaultWeight': 0,
            'drm': '0',
            'extendField1': '',
            'extendField2': '',
            'extendField3': '',
            'extendField4': '',
            'extendField5': '',
            'hot': 0,
            'interactType': -2,
            'is3d': 0,
            'isTvod': 0,
            'isVip': 1,
            'lastCollection': '',
            'license': '',
            'modifyTime': null,
            'operatorWeight': 0,
            'playCount': 0,
            'previewType': 1,
            'price': 0,
            'publishSegment': 0,
            'publistSegment': 0,
            'score': 8.6,
            'shortStatus': 0,
            'sourceName': '',
            'status': 1,
            'strategy': '',
            'streamType': '标清,高清,超清,全高清,4K',
            'thirdId': 'rj8uc45tm8a17wm',
            'thirdSource': 'tencent',
            'updateStatus': 0,
            'updatedSegment': 1,
            'vsId': 0
          }
        ],
        'classfication': '剧情/传记/灾难,灾难,传记,剧情,院线',
        'contentType': '正片',
        'coocaaVId': 'rj8uc45tm8a17wm',
        'currentSegment': 0,
        'description': '根据2018年5月14日川航3U8633航班成功备降的真实事件改编：机组执行航班任务时，在万米高空突遇驾驶舱风挡玻璃爆裂脱落、座舱释压的极端罕见险情，生死关头，他们临危不乱、果断应对、正确处置，确保了机上全部人员的生命安全，创造了世界民航史上的奇迹。',
        'directors': '刘伟强',
        'id': 0,
        'imageInfoList': [
          {
            'flag': 0,
            'size': '260*364',
            'style': 'v',
            'url': 'http://i.gtimg.cn/qqlive/img/jpgcache/files/qqvideo/r/rj8uc45tm8a17wm_x.jpg'
          },
          {
            'flag': 0,
            'size': '498*280',
            'style': 'h',
            'url': 'http://i.gtimg.cn/qqlive/img/jpgcache/files/qqvideo/hori/r/rj8uc45tm8a17wm_big.jpg'
          }
        ],
        'isTrailer': 0,
        'isTvod': 0,
        'isVip': 0,
        'lastUpdateDate': null,
        'mediaType': '剧情/传记/灾难,灾难,传记,剧情,院线',
        'operatoWeight': 0,
        'outhType': 0,
        'payType': '',
        'preSegment': 0,
        'price': '',
        'publishArea': '内地',
        'publishDate': '20190930',
        'publistSegment': 0,
        'remark': '',
        'score': '8.6',
        'season': 0,
        'source': '',
        'sourceName': '',
        'sourceSign': '',
        'subTitle': '11',
        'thirdId': '',
        'thumb': 'http://i.gtimg.cn/qqlive/img/jpgcache/files/qqvideo/r/rj8uc45tm8a17wm_x.jpg',
        'title': '中国机长6',
        'updatedSegment': 0,
        'videoFormat': '',
        'videoKey': '剧情/传记/灾难,灾难,传记,剧情,院线',
        'videoStatus': 1,
        'videoType': '电影',
        'year': '2019'
      },
      {
        'actors': '黄渤,张译,韩昊霖,杜江,葛优,王天辰,雷佳音,张子枫,王洛勇,马伊琍,张建亚,彭昱畅,徐峥',
        'businessType': 0,
        'categoryId': 4,
        'ccVideoSourceEntities': [
          {
            'coocaaVId': '',
            'createdTime': null,
            'currentSegment': 1,
            'defaultWeight': 0,
            'drm': '0',
            'extendField1': '',
            'extendField2': '',
            'extendField3': '',
            'extendField4': '',
            'extendField5': '',
            'hot': 0,
            'interactType': -2,
            'is3d': 0,
            'isTvod': 1,
            'isVip': 1,
            'lastCollection': '',
            'license': '',
            'modifyTime': null,
            'operatorWeight': 0,
            'playCount': 0,
            'previewType': 1,
            'price': 0,
            'publishSegment': 0,
            'publistSegment': 0,
            'score': 7.7,
            'shortStatus': 0,
            'sourceName': '',
            'status': 1,
            'strategy': '',
            'streamType': '标清,高清,超清,全高清,4K',
            'thirdId': 'hk765ykwj4bjpcl',
            'thirdSource': 'tencent',
            'updateStatus': 0,
            'updatedSegment': 1,
            'vsId': 0
          }
        ],
        'classfication': '剧情,院线',
        'contentType': '正片',
        'coocaaVId': 'hk765ykwj4bjpcl',
        'currentSegment': 0,
        'description': '七位导演分别取材新中国成立70周年以来，祖国经历的无数个历史性经典瞬间。讲述普通人与国家之间息息相关密不可分的动人故事。聚焦大时代大事件下，小人物和国家之间，看似遥远实则密切的关联，唤醒全球华人共同回忆。',
        'directors': '陈凯歌,张一白,管虎,薛晓路,徐峥,宁浩,文牧野',
        'id': 0,
        'imageInfoList': [
          {
            'flag': 0,
            'size': '260*364',
            'style': 'v',
            'url': 'http://i.gtimg.cn/qqlive/img/jpgcache/files/qqvideo/h/hk765ykwj4bjpcl_x.jpg'
          },
          {
            'flag': 0,
            'size': '498*280',
            'style': 'h',
            'url': 'http://i.gtimg.cn/qqlive/img/jpgcache/files/qqvideo/hori/h/hk765ykwj4bjpcl_big.jpg'
          }
        ],
        'isTrailer': 0,
        'isTvod': 0,
        'isVip': 0,
        'lastUpdateDate': null,
        'mediaType': '剧情,院线',
        'operatoWeight': 0,
        'outhType': 0,
        'payType': '',
        'preSegment': 0,
        'price': '',
        'publishArea': '内地',
        'publishDate': '20190930',
        'publistSegment': 0,
        'remark': '黄建新',
        'score': '7.9',
        'season': 0,
        'source': '',
        'sourceName': '',
        'sourceSign': '',
        'subTitle': '我和我的祖国',
        'thirdId': '',
        'thumb': 'http://i.gtimg.cn/qqlive/img/jpgcache/files/qqvideo/h/hk765ykwj4bjpcl_x.jpg',
        'title': '我和我的祖国',
        'updatedSegment': 0,
        'videoFormat': '',
        'videoKey': '剧情,院线',
        'videoStatus': 1,
        'videoType': '电影',
        'year': '2019'
      }],
      total: 2
    }
  })
}
