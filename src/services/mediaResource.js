// 查询直播资源
export function mediaPPTVVideoList(params) {
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

export function mediaGetCondition(params) {
  return this.fetch({
    url: 'api/tvos/getCondition.html',
    params
  }).then(data => {
    return typeof data === 'string'
      ? JSON.parse(data.replace('result(', '').replace(/\)*$/, ''))
      : data
  })
}

export function mediaGetTagList(params) {
  return this.fetch({
    method: 'get',
    url: 'api/tvos/getMediaTagList.html?tagCode=',
    params
  }).then(({ data }) => data)
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
