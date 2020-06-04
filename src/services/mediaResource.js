// 查询直播资源
export function mediaPPTVVideoList (params) {
  return this.fetch({
    method: 'get',
    url: 'api/tvos/queryPPTVVideoResult.html?callbackparam=result',
    params
  }).then((data) => {
    return typeof data === 'string'
      ? JSON.parse(data.replace('result(', '').replace(/\)*$/, ''))
      : data
  })
}

export function mediaGetCondition (params) {
  return this.fetch({
    url: 'api/tvos/getCondition.html',
    params
  }).then(data => {
    return typeof data === 'string'
      ? JSON.parse(data.replace('result(', '').replace(/\)*$/, ''))
      : data
  })
}

export function mediaGetTagList (params) {
  return this.fetch({
    method: 'get',
    url: 'api/tvos/getMediaTagList.html?tagCode=',
    params
  }).then(({ data }) => data)
}

export function mediaGetInterestList (params) {
  return this.fetch({
    method: 'get',
    url: 'api/tvos/getMediaCategoryList.html',
    params
  }).then(({ data }) => data)
}
export function mediaGetAuthorList (params) {
  return this.fetch({
    method: 'get',
    url: 'api/tvos/getMediaAuthorList.html',
    params
  }).then(({ data }) => {
    data = data || {}
    return {
      rows: data.authors || [],
      total: data.total,
      page: data.pageIndex
    }
  })
}
export function mediaGetVideoList (params) {
  return this.fetch({
    method: 'get',
    url: 'api/tvos/getMediaBriefVideoList.html',
    params
  }).then(({ data }) => {
    data = data || {}
    return {
      rows: data.videos || [],
      total: data.total,
      page: data.pageIndex
    }
  })
}
export function mediaGetRankingInfoVideoList (params) {
  // 如果是业务分类是教育，则使用腾讯源
  if (params.businessType === 60) {
    params.partner = 'tencent'
  }
  return this.fetch({
    method: 'get',
    url: 'api/tvos/getRankInfoVideoList.html',
    params: {
      code: params.code,
      partner: params.partner
    }
  }).then(({ data }) => data)
}

export function mediaGetGDChannelList (params) {
  const { page = 1, rows } = params
  params.pageIndex = page - 1
  params.pageSize = rows
  delete params.page
  delete params.rows
  return this.fetch({
    method: 'get',
    url: 'api/live/tvos/getChannelInfos',
    params
  }).then(({ data }) => {
    data = data || {}
    return {
      rows: data.channelList || [],
      total: data.channelTotal,
      page: data.pageIndex
    }
  })
  // return Promise.resolve({
  //   rows: [
  //     {
  //       ccChannelName: '中央一套',
  //       ccChannelId: 121,
  //       provincesCode: '1,2,3',
  //       provincesName: '湖南，湖北'
  //     }
  //   ],
  //   total: 100,
  //   page: 1
  // })
}

export function mediaGetGDSchedulelList (params) {
  const { page = 1, rows } = params
  params.pageIndex = page - 1
  params.pageSize = rows
  delete params.page
  delete params.rows
  return this.fetch({
    method: 'get',
    url: 'api/live/tvos/getScheduleInfos',
    params
  }).then(({ data }) => {
    data = data || {}
    return {
      rows: data.scheduleList || [],
      total: data.scheduleTotal,
      page: data.pageIndex
    }
  })
}

export function mediaGetChannelProvinceOptions () {
  return Promise.resolve([
    {
      value: 11,
      label: '北京市'
    },
    {
      value: 12,
      label: '天津市'
    },
    {
      value: 13,
      label: '河北省'
    },
    {
      value: 14,
      label: '山西省'
    },
    {
      value: 15,
      label: '内蒙古自治区'
    },
    {
      value: 21,
      label: '辽宁省'
    },
    {
      value: 22,
      label: '吉林省'
    },
    {
      value: 23,
      label: '黑龙江省'
    },
    {
      value: 31,
      label: '上海市'
    },
    {
      value: 32,
      label: '江苏省'
    },
    {
      value: 33,
      label: '浙江省'
    },
    {
      value: 34,
      label: '安徽省'
    },
    {
      value: 35,
      label: '福建省'
    },
    {
      value: 36,
      label: '江西省'
    },
    {
      value: 37,
      label: '山东省'
    },
    {
      value: 41,
      label: '河南省'
    },
    {
      value: 42,
      label: '湖北省'
    },
    {
      value: 43,
      label: '湖南省'
    },
    {
      value: 44,
      label: '广东省'
    },
    {
      value: 45,
      label: '广西壮族自治区'
    },
    {
      value: 46,
      label: '海南省'
    },
    {
      value: 50,
      label: '重庆市'
    },
    {
      value: 51,
      label: '四川省'
    },
    {
      value: 52,
      label: '贵州省'
    },
    {
      value: 53,
      label: '云南省'
    },
    {
      value: 54,
      label: '西藏自治区'
    },
    {
      value: 61,
      label: '陕西省'
    },
    {
      value: 62,
      label: '甘肃省'
    },
    {
      value: 63,
      label: '青海省'
    },
    {
      value: 64,
      label: '宁夏回族自治区'
    },
    {
      value: 65,
      label: '新疆维吾尔自治区'
    },
    {
      value: 71,
      label: '中国台湾'
    },
    {
      value: 81,
      label: '中国香港'
    },
    {
      value: 82,
      label: '中国澳门'
    }
  ])
}
