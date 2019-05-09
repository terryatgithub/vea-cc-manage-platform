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
    methods: 'get',
    url: 'api/tvos/getCondition.html',
    params
  }).then(data => {
    return typeof data === 'string'
      ? JSON.parse(data.replace('result(', '').replace(/\)*$/, ''))
      : data
  })
}
