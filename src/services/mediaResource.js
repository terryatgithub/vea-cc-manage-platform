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
